import getConfig from 'next/config';
import useSWR, { SWRConfig, responseInterface } from 'swr';
import { UrlOrUrlGetter } from './ApiClient';
import ClientsideApiClient from './ClientsideApiClient';
import { ShopResponse } from './ShopifyAdminApiResponses';
import { isClient } from 'lib/Util';

export default class SeaApiClient extends ClientsideApiClient {
  public getRequestUrl(url: string): string {
    const { publicRuntimeConfig } = getConfig();
    return publicRuntimeConfig.appUrl + '/api/' + url;
  }

  public login(shop: ShopResponse): this {
    return this;
  }
}
