import {
  Page,
  Heading,
  Card,
  TextField,
  FormLayout,
  Layout,
} from "@shopify/polaris";

const Index = () => (
  <Page>
    <Heading>Ordered emails</Heading>
    <Layout>
      <Layout.AnnotatedSection
        title="Emails details"
        description="Specify the account you'd like to use and give us access"
      >
        <Card sectioned>
          <FormLayout>
            <TextField label="Store name" onChange={() => {}} />
            <TextField type="email" label="Account email" onChange={() => {}} />
          </FormLayout>
        </Card>
      </Layout.AnnotatedSection>
    </Layout>{" "}
  </Page>
);

export default Index;
