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
  const shopSwr = adminApiClient.getShop();
  const [email, setEmail] = React.useState("");

  React.useEffect(() => {
    if (shopSwr.data && email == "") {
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
