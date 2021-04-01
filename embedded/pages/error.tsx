import React from 'react';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import _ from 'lodash';
import { Page, Heading, Card, TextField, FormLayout, Layout, Button } from '@shopify/polaris';

const ErrorPage = () => {
  return (
    <Page>
      <h1>Whoops</h1>
      <p>
        An error occured. Please try again later.
        <br />
        Contact <a href="mailto:support@shopifyorderemails.com">support@shopifyorderemails.com</a> if the problem
        persists.
      </p>
    </Page>
  );
};

export default ErrorPage;
