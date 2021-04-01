# Shopify Embedded App

Boilerplate to extend Node applications created by the [Shopify-App-CLI](https://github.com/Shopify/shopify-app-cli) in the following ways:

1. Add Typescript support
2. Dockerize
3. Provision a Laravel application to host the backend/public portion of the application

# Installation

1. Create the application within the 'embedded' directory using the 'shopify create' command of the 'shopify cli' tool.
2. Run 'shopify version' to determine the version of the CLI in use.
3. Copy 'package.json' from /embedded/sea/VERSION_NUMBER to /embedded
4. Copy 'server.ts' from /embedded/sea/VERSION_NUMBER/server to /embedded/server
5. Copy 'index.ts'

6. Sign up (or sign into) an Ngrok account (used for public url's to your dev machine). Provision two ngrok url's for use with this application (one for embedded app, one for public app).
7. Copy '.env.eample' to '.env' in the root directory. Update the APP_URL and EMBEDDED_URL to the Ngrok url's you provisioned above.
8. Run `docker-compose build` to build your docker containers
