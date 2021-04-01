import '@babel/polyfill';
import dotenv from 'dotenv';
import 'isomorphic-fetch';
import createShopifyAuth, { verifyRequest } from '@shopify/koa-shopify-auth';
import Shopify, { ApiVersion } from '@shopify/shopify-api';
import Koa from 'koa';
import next from 'next';
import Router from 'koa-router';

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(','),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ''),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage()
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    //@ts-ignore
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: '/webhooks',
          topic: 'APP_UNINSTALLED',
          webhookHandler: async (topic, shop, body) => {
            delete ACTIVE_SHOPIFY_SHOPS[shop];
          }
        });

        if (!response.success) {
          console.log(`Failed to register APP_UNINSTALLED webhook: ${response.result}`);
        }

        /*
        const { API_VERSION, APP_URL, SEA_API_PASSWORD } = process.env;

        console.log('afterAuth', ctx.state.shopify);

        // Login to the SEA Api and set the access token in a cookie
        fetch(APP_URL + '/api/users/login', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            username: 'api',
            password: SEA_API_PASSWORD
          })
        })
          .then((response: Response) => {
            return response.json();
          })
          .then(async (response: { data: LoginResponse }) => {
            if (!response || !response.data || !response.data.accessToken) {
              console.log('SEA LOGIN ERROR', response);
              throw new Error(
                'We had trouble authenticating against the Shopify Embedded App API. Please try again later.'
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
              console.log('SEA REGISTER SHOP ERROR', registerJson);
              throw new Error(
                'We had trouble registering your shop with the Shopify Order Email API. Please try again later.'
              );
            }

            const seaAccessToken = registerJson.data.user.accessToken;
            const shopifyAccessToken = accessToken;

            ctx.session.seaTokens = JSON.stringify({
              shopId: id,
              shopifyAccessToken,
              seaAccessToken
            });

            console.log('UPDATE SESSION', ctx.session.seaTokens);



            // Redirect to app with shop parameter upon auth
            ctx.redirect(`/?shop=${shop}`);
*/

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}`);
      }
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.get('/', async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  router.post('/webhooks', async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post('/graphql', verifyRequest({ returnHeader: true }), async (ctx, next) => {
    await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
  });

  router.get('(/_next/static/.*)', handleRequest); // Static content is clear
  router.get('/_next/webpack-hmr', handleRequest); // Webpack content is clear
  router.get('(.*)', verifyRequest(), handleRequest); // Everything else must have sessions

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
