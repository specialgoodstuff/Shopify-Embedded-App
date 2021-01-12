import React from "react";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

import {
  Page,
  Heading,
  Card,
  TextField,
  FormLayout,
  Layout,
  Button,
} from "@shopify/polaris";

import AdminApiClient from "lib/api-client/AdminApiClient";

let adminApiClient = new AdminApiClient();

const Index = () => {
  const shopSwr = adminApiClient.getShop().asSwr();
  const [email, setEmail] = React.useState("sender-email@shop.com");

  React.useEffect(() => {
    if (shopSwr.data) {
      setEmail(shopSwr.data.customer_email);
    }
  }, [shopSwr.data]);

  if (shopSwr.error) return "An error has occurred.";
  if (!shopSwr.data) return "Loading...";

  console.log("shop", shopSwr.data);

  return (
    <Page>
      <Layout>
        <Layout.AnnotatedSection
          title="Verify your email"
          description="Review the email account you'll be using."
        >
          <Card sectioned>
            <FormLayout>
              <TextField
                disabled
                type="email"
                placeholder="Sender Email"
                value={email}
                label="Sender email"
              />
              <p>
                The email address we'll sync to your order timeline is presented
                above.
                <br />
                To update it, change the <strong>sender email</strong> in your{" "}
                <a
                  href={
                    "https://" + shopSwr.data.domain + "/admin/settings/general"
                  }
                  target="_parent"
                >
                  general site settings
                </a>
              </p>
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
              Rather, you login to your email account, and grant our application
              access via oauth.
            </p>
            <br />
            <Button
              url={`https://api.nylas.com/oauth/authorize?login_hint=${encodeURIComponent(
                email
              )}&client_id=${
                publicRuntimeConfig.nylasClientId
              }&response_type=token&redirect_uri=${encodeURIComponent(
                publicRuntimeConfig.host + "/nylas-api/callback"
              )}&scopes=email.send,email.read_only&state=CSRF_TOKEN`}
              primary
            >
              Grant access to your account
            </Button>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>{" "}
    </Page>
  );
};

export default Index;
