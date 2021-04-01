import React from 'react';
import { Heading, Page, Card, Layout, Button } from '@shopify/polaris';
import { Provider, useAppBridge } from '@shopify/app-bridge-react';

function getCookie(name) {
  let cookie = {};
  console.log('document cookie', document.cookie);
  document.cookie.split(';').forEach(function (el) {
    let [k, v] = el.split('=');
    cookie[k.trim()] = v;
  });
  return cookie[name];
}

async function getShop() {
  const seaTokens = JSON.parse(getCookie('seaTokens'));
  console.log('seaTokens', seaTokens, getCookie('seaTokens'));

  /*
  const shopResponse = await fetch(`https://${shop}/admin/api/${Shopify.Context.API_VERSION}/shop.json`, {
    method: 'get',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      Accept: 'application/json'
    }
  });
  let shopJson = await shopResponse.json();
  */
}

const Index = () => {
  const [result, setResult] = React.useState<any>(null);

  return (
    <Page>
      <Heading>Shopify app with Node and React 🎉</Heading>
      <br />
      <br />
      <Layout>
        <Layout.Section oneThird>
          <Button
            onClick={async () => {
              getShop();
            }}
          >
            Test the Shopify REST API
          </Button>
        </Layout.Section>
        <Layout.Section oneThird>
          <Button
            onClick={async () => {
              getShop();
            }}
          >
            Test the Shopify GraphQL API
          </Button>
        </Layout.Section>
        <Layout.Section oneThird>
          <Button onClick={() => {}}>Test the SEA REST API</Button>
        </Layout.Section>
        <br />
        <Layout.Section>
          <Card title="Results">
            <br />
            <br />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Index;
