import React from "react";

import {
  Page,
  Heading,
  Card,
  TextField,
  FormLayout,
  Layout,
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
          title="Email details"
          description="Specify the account you'd like to use and authorize it"
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
      </Layout>{" "}
    </Page>
  );
};

export default Index;
