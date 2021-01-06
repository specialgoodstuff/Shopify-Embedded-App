import getConfig from "next/config";
import useSWR, { SWRConfig, responseInterface } from "swr";
import ApiClient, { UrlOrUrlGetter } from "./ApiClient";
import { ShopResponse } from "./AdminApiResponses";
import { isClient } from "lib/Util";

export default class AdminApiClient extends ApiClient {
  public request(
    urlOrUrlGetter: UrlOrUrlGetter,
    fetchOptions: RequestInit | undefined = undefined,
    responseHandler: undefined | ((value: any) => any) = (value) => value
  ): this {
    // admin api requests must be made client-side after a session has been initiated
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
    return publicRuntimeConfig.host + "/shopify-api/admin/" + url;
  }

  public getShop(): this {
    return this.get("shop.json", undefined, (data) => data.shop);
  }
}
