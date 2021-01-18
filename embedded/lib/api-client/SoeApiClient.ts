import getConfig from 'next/config';
import useSWR, { SWRConfig, responseInterface } from 'swr';
import ApiClient, { UrlOrUrlGetter } from './ApiClient';
import { ShopResponse } from './ShopifyAdminApiResponses';
import { isClient } from 'lib/Util';

export default class SoeApiClient extends ApiClient {
  public request(
    urlOrUrlGetter: UrlOrUrlGetter,
    fetchOptions: RequestInit | undefined = undefined,
    responseHandler: undefined | ((value: any) => any) = (value) => value
  ): this {
    // soe api requests must be made client-side after an xsrf/session cookie has been issued
    if (isClient()) {
      super.request(urlOrUrlGetter, fetchOptions, responseHandler);
    }
    return this;
  }

  public asSwr(): responseInterface<any, any> {
    if (isClient()) {
      return super.asSwr();
    } else {
      return useSWR(null);
    }
  }

  public getRequestUrl(url: string): string {
    const { publicRuntimeConfig } = getConfig();
    return publicRuntimeConfig.host + '/shopify-api/admin/' + url;
  }

  public getShop(): this {
    console.log('getShop');
    return this.get('shop.json', undefined, (data) => data.shop);
  }
}
