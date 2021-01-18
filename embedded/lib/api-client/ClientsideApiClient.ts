import getConfig from 'next/config';
import useSWR, { SWRConfig, responseInterface } from 'swr';
import ApiClient, { UrlOrUrlGetter } from './ApiClient';
import { ShopResponse } from './ShopifyAdminApiResponses';
import { isClient } from 'lib/Util';

/**
 * Classes which extend this client will only make client-side requests
 */
export default class ClientsideApiClient extends ApiClient {
  public request(
    urlOrUrlGetter: UrlOrUrlGetter,
    fetchOptions: RequestInit | undefined = undefined,
    responseHandler: undefined | ((value: any) => any) = (value) => value
  ): this {
    if (isClient()) {
      super.request(urlOrUrlGetter, fetchOptions, responseHandler);
    }
    return this;
  }

  public toSwr(): responseInterface<any, any> {
    if (isClient()) {
      return super.toSwr();
    } else {
      return useSWR(null);
    }
  }
}
