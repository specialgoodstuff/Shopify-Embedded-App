# Shopify Embedded App

Boilerplate to extend Node applications created by the [Shopify-App-CLI](https://github.com/Shopify/shopify-app-cli) in the following ways:

1. Add Typescript support
2. Dockerize
3. Provision a Laravel application to host the backend/public portion of the application

# Installation

1. Create the application within the 'embedded' directory using the 'shopify create' command of the 'shopify cli' tool.
2. Sign up (or sign into) an Ngrok account (used for public url's to your dev machine). Provision two ngrok url's for use with this application (one for embedded app, one for public app).
3. Copy '.env.eample' to '.env' in the root directory. Update the APP_URL and EMBEDDED_URL to the Ngrok url's you provisioned above.
