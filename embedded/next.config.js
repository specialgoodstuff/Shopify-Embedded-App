const { parsed: localEnv } = require('dotenv').config();
const withCSS = require('@zeit/next-css');

const webpack = require('webpack');
const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);

module.exports = withCSS({
  webpack: (config) => {
    const env = { API_KEY: apiKey };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    host: process.env.HOST,
    appUrl: process.env.APP_URL,
    embeddedUrl: process.env.EMBEDDED_URL,
    nylasClientId: process.env.NYLAS_CLIENT_ID
  }
});
