# Shopify Embedded App with Laravel Backend

Boilerplate to extend Node applications created by the [Shopify-App-CLI](https://github.com/Shopify/shopify-app-cli) in the following ways:

1. Add Typescript support
2. Dockerize
3. Provision a Laravel application to host the backend/public portion of the application

## Installation

1. Create the application using the 'shopify create' command of the 'shopify cli' tool.
1. Run the 'shopify serve' command, and copy/load the installation link it gives you
1. Copy the contents of the directory you created via the 'shopify create' command into the 'embedded' directory
1. Comment out the HOST line in /embedded/.env (the HOST env variable will be managed by docker)
1. Run 'shopify version' to determine the version of the CLI in use.
1. Copy 'package.json' from /embedded/sea/VERSION_NUMBER to /embedded
1. Copy 'server.ts' from /embedded/sea/VERSION_NUMBER/server to /embedded/server
1. Copy 'index.tsx' from /embedded/sea/VERSION_NUMBER/pages to /embedded/pages
1. Copy '\_app.tsx' from /embedded/sea/VERSION_NUMBER/pages to /embedded/pages
1. Verify that the application builds by running `npm run build`
1. Sign up (or sign into) an Ngrok account (used for public url's to your dev machine). Provision two ngrok url's for use with this application (one for embedded app, one for public app).
1. Copy '.env.eample' to '.env' in the root directory. Update the APP_URL and EMBEDDED_URL to the Ngrok url's you provisioned above.
1. Update your application's URL in shopify to the embedded url you provisioned above:
1. Run `docker-compose build` to build your docker containers

## On first run

1. From project root directory, run: `docker-compose sea-web /bin/bash`
1. Run: `php artisan migrate`
1. Run: `php artisan db:seed`
1. Verify the backend responds withought error at: http://sea.localhost
