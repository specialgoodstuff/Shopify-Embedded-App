import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import mount from "koa-mount";
// Forked custom version of koa-proxies to pass ctx into proxy factory
// and facillitate use of session access token for shopify api requests
// We've also included koa-proxies in the package json so that npm
// will load that package's dependencies.
import proxy, { IKoaProxiesOptions } from "../lib/koa-proxies";

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

const {
  SHOPIFY_API_SECRET,
  SHOPIFY_API_KEY,
  SCOPES,
  API_VERSION,
} = process.env;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(
    session(
      {
        sameSite: "none",
        secure: true,
      },
      server
    )
  );
  server.keys = [SHOPIFY_API_SECRET];
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],

      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop } = ctx.state.shopify;
        //console.log("afterAuth", shop);
        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}`);
      },
    })
  );

  // provision /shopify-api/graphql
  server.use(
    mount(
      "/shopify-api",
      graphQLProxy({
        version: API_VERSION as ApiVersion,
      })
    )
  );

  // provision /shopify-api/s3
  server.use(
    proxy("/shopify-api/s3", {
      target: "https://shopify.s3.amazonaws.com",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/shopify-api\/s3/, ""),
    })
  );

  // provision /shopify-api/admin
  server.use(
    proxy(
      "/shopify-api/admin",
      (params, ctx): IKoaProxiesOptions => {
        const { accessToken, shop } = ctx.session;
        //console.log("session", ctx.session);
        const target = `https://${shop}`;
        return {
          target: target,
          changeOrigin: true,
          rewrite: (path: string) => {
            return path.replace(
              /^\/shopify-api\/admin/,
              "/admin/api/" + API_VERSION
            );
          },
          logs: true,
          /**
           * @see https://community.shopify.com/c/Shopify-APIs-SDKs/POST-to-admin-orders-json-returns-301-Moved-Permanently/td-p/288085
           */
          headers: {
            "X-Shopify-Access-Token": accessToken,
          },
        };
      }
    )
  );

  router.get("(.*)", verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
