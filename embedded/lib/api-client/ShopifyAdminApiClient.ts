import getConfig from 'next/config';
import useSWR, { SWRConfig, responseInterface } from 'swr';
import { UrlOrUrlGetter } from './ApiClient';
import ClientsideApiClient from './ClientsideApiClient';
import { ShopResponse } from './ShopifyAdminApiResponses';
import { isClient } from 'lib/Util';

export default class ShopifyAdminApiClient extends ClientsideApiClient {
  public getRequestUrl(url: string): string {
    const { publicRuntimeConfig } = getConfig();
    return publicRuntimeConfig.embeddedUrl + '/shopify-api/admin/' + url;
  }

  public getShop(): this {
    return this.get('shop.json', undefined, (data) => data.shop);
  }
}
