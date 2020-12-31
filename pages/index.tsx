import {
  Page,
  Heading,
  Card,
  TextField,
  FormLayout,
  Layout,
} from "@shopify/polaris";

import ApiClient from "lib/api-client/ApiClient";

const Index = () => {
  console.log("ApiClient", ApiClient);

  const { data, error } = new ApiClient().get("shopify-api/admin/shop.json");

  if (error) return "An error has occurred.";
  if (!data) return "Loading...";

  console.log("data", data);

  return (
    <Page>
      <Layout>
        <Layout.AnnotatedSection
          title="Email details"
          description="Specify the account you'd like to use and authorize it"
        >
          <Card sectioned>
            <FormLayout>
              <TextField label="Store name" onChange={() => {}} />
              <TextField
                type="email"
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
