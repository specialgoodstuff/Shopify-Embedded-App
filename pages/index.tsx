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

const Index = () => {
  const shopSwr = new AdminApiClient().getShop();
  if (shopSwr.error) return "An error has occurred.";
  if (!shopSwr.data) return "Loading...";

  const [email, setEmail] = React.useState(shopSwr.data.customer_email);

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
                type="email"
                placeholder="Enter email address"
                value={email}
                label="Account email"
                onChange={() => {}}
              />
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>{" "}
    </Page>
  );
};

export default Index;
