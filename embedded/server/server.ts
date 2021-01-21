import '@babel/polyfill';
import dotenv from 'dotenv';
import 'isomorphic-fetch';
import createShopifyAuth, { verifyRequest } from '@shopify/koa-shopify-auth';
import graphQLProxy, { ApiVersion } from '@shopify/koa-shopify-graphql-proxy';
import Koa from 'koa';
import next from 'next';
import Router from 'koa-router';
import session from 'koa-session';
import mount from 'koa-mount';
// Forked custom version of koa-proxies to pass ctx into proxy factory
// and facillitate use of session access token for shopify api requests
// We've also included koa-proxies in the package json so that npm
// will load that package's dependencies.
import proxy, { IKoaProxiesOptions } from '../lib/koa-proxies';
import { LoginResponse } from '../lib/api-client/SoeApiResponses';

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev
});
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES, API_VERSION, APP_URL, SOE_API_PASSWORD } = process.env;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(
    session(
      {
        sameSite: 'none',
        secure: true
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
        const { shop, accessToken } = ctx.state.shopify;
        console.log('afterAuth', ctx.state.shopify);

        // Login to the SOE Api and set the access token in a cookie
        fetch(APP_URL + '/api/users/login', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            username: 'api',
            password: SOE_API_PASSWORD
          })
        })
          .then((response: Response) => {
            return response.json();
          })
          .then(async (response: { data: LoginResponse }) => {
            if (!response || !response.data || !response.data.accessToken) {
              console.log('SOE LOGIN ERROR', response);
              throw new Error(
                'We had trouble authenticating against the Shopify Order Email API. Please try again later.'
              );
            }

            const shopResponse = await fetch(`https://${shop}/admin/api/${API_VERSION}/shop.json`, {
              method: 'get',
              headers: {
                'X-Shopify-Access-Token': accessToken,
                Accept: 'application/json'
              }
            });
            let shopJson = await shopResponse.json();
            shopJson = shopJson.shop;
            const { id, domain, email } = shopJson;
            shopJson = JSON.stringify(shopJson);

            let body = JSON.stringify({
              id: id,
              domain: domain,
              email: email,
              data: shopJson
            }).replace(/\\\\"/g, '\\"');

            const registerResponse = await fetch(APP_URL + '/api/shops', {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + response.data.accessToken
              },
              body: body
            });

            const registerJson = await registerResponse.json();

            if (!registerJson || !registerJson.data || !registerJson.data.user || !registerJson.data.user.accessToken) {
              console.log('SOE REGISTER SHOP ERROR', registerJson);
              throw new Error(
                'We had trouble registering your shop with the Shopify Order Email API. Please try again later.'
              );
            }

            const soeAccessToken = registerJson.data.user.accessToken;
            const shopifyAccessToken = accessToken;

            ctx.session.soeTokens = JSON.stringify({
              shopId: id,
              shopifyAccessToken,
              soeAccessToken
            });

            console.log('UPDATE SESSION', ctx.session.soeTokens);

            /*
            const cookieOptions = {
              httpOnly: true,
              secure: true,
              signed: true,
              overwrite: true
            };

            console.log(
              'SET COOKIE',
              JSON.stringify({
                shopId: id,
                shopifyAccessToken,
                soeAccessToken
              })
            );

            ctx.cookies.set(
              'soeTokens',
              JSON.stringify({
                shopifyAccessToken,
                soeAccessToken
              }),
              cookieOptions
            );

            ctx.session.
            */

            // Redirect to app with shop parameter upon auth
            ctx.redirect(`/?shop=${shop}`);
          })
          .catch((error) => {
            console.log('ERROR', error);
            ctx.throw(500, error.message);
            //ctx.redirect(`/?shop=${shop}&error=${encodeURIComponent(error.message)}`);
          });
      }
    })
  );

  // provision /shopify-api/graphql
  server.use(
    mount(
      '/shopify-api',
      graphQLProxy({
        version: API_VERSION as ApiVersion
      })
    )
  );

  // provision /shopify-api/s3
  server.use(
    proxy('/shopify-api/s3', {
      target: 'https://shopify.s3.amazonaws.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/shopify-api\/s3/, '')
    })
  );

  // provision /shopify-api/admin
  server.use(
    proxy(
      '/shopify-api/admin',
      (params, ctx): IKoaProxiesOptions => {
        const { accessToken, shop } = ctx.session;
        //console.log("session", ctx.session);
        const target = `https://${shop}`;
        return {
          target: target,
          changeOrigin: true,
          rewrite: (path: string) => {
            return path.replace(/^\/shopify-api\/admin/, '/admin/api/' + API_VERSION);
          },
          logs: true,
          /**
           * @see https://community.shopify.com/c/Shopify-APIs-SDKs/POST-to-admin-orders-json-returns-301-Moved-Permanently/td-p/288085
           */
          headers: {
            'X-Shopify-Access-Token': accessToken
          }
        };
      }
    )
  );

  router.get('/error', verifyRequest(), async (ctx) => {
    await app.render(ctx.req, ctx.res, '/error', ctx.query);
    ctx.respond = true;
    ctx.res.statusCode = 200;
  });

  router.get('(.*)', verifyRequest(), async (ctx) => {
    try {
      if (ctx.session.soeTokens) {
        console.log('SOE TOKENS RETRIEVED FROM SESSION', ctx.session.soeTokens);
        const cookieOptions = {
          httpOnly: true,
          secure: true,
          signed: true,
          overwrite: true
        };
        ctx.cookies.set('soeTokens', ctx.session.soeTokens, cookieOptions);
      }
    } catch (error) {
      console.log('COOKIE SET ERROR', error);
    }

    console.log('PROCESSING', ctx.req.url);

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
