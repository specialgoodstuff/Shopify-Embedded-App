import React from 'react';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import isEmail from 'validator/lib/isEmail';
import _ from 'lodash';
import { Page, Heading, Card, TextField, FormLayout, Layout, Button } from '@shopify/polaris';

import ShopifyAdminApiClient from 'lib/api-client/ShopifyAdminApiClient';
import { responseInterface, ShopResponse } from 'lib/api-client/ShopifyAdminApiResponses';

let ShopifyAdminApiClient = new ShopifyAdminApiClient();

const Index = () => {
  let shopSwr: responseInterface<ShopResponse, any> = ShopifyAdminApiClient.getShop().asSwr();
  const defaultEmail = 'sender-email@shop.com';
  const [email, setEmail] = React.useState(defaultEmail);
  const [emailError, setEmailError] = React.useState<string | null>(null);

  if (shopSwr.error) return 'An error has occurred.';
  if (!shopSwr.data) return 'Loading...';

  if (email == defaultEmail) {
    setEmail(shopSwr.data.customer_email);
  }

  return (
    <Page>
      <Layout>
        <Layout.AnnotatedSection title="Verify your email" description="Review the email account you'll be using.">
          <Card sectioned>
            <FormLayout>
              <p>
                By default, we sync order timelines to the <strong>sender email</strong> specified in your{' '}
                <a href={'https://' + shopSwr.data.domain + '/admin/settings/general'} target="_parent">
                  general site settings
                </a>
              </p>
              <p>
                However, if that email account is forwarded to another, you can update the address we use here. The
                address specified here must recieve any replies a customer makes to the order emails that they recieve
                for this application to work.
              </p>

              <TextField
                type="email"
                placeholder="Sender Email"
                value={email}
                onChange={(email: string) => {
                  setEmail(email);
                  if (!isEmail(email)) {
                    setEmailError('A valid email address is required.');
                  } else {
                    setEmailError(null);
                  }
                }}
                label="Sender email"
                error={emailError}
              />
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
        <Layout.AnnotatedSection
          title="Authorize us"
          description="Authorize our application to use your email account."
        >
          <Card sectioned>
            <p>
              We do not store your account credentials directly.
              <br />
              Rather, you login to your email account, and grant our application access via oauth.
            </p>
            <br />
            <Button
              url={`https://api.nylas.com/oauth/authorize?login_hint=${encodeURIComponent(email)}&client_id=${
                publicRuntimeConfig.nylasClientId
              }&response_type=token&redirect_uri=${encodeURIComponent(
                publicRuntimeConfig.host + '/nylas-api/callback'
              )}&scopes=email.send,email.read_only&state=CSRF_TOKEN`}
              primary
              disabled={!!emailError}
            >
              Grant access to your account
            </Button>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>{' '}
    </Page>
  );
};

export default Index;
