import getConfig from "next/config";
import useSWR, { SWRConfig, responseInterface } from "swr";
import ApiClient, { UrlOrUrlGetter } from "./ApiClient";
import { ShopResponse } from "./AdminApiResponses";
import { isClient } from "lib/Util";

export default class AdminApiClient extends ApiClient {
  public asSwr(): responseInterface<any, any> {
    // admin api requests must be made client-side after a session has been initiated
    if (!isClient()) {
      return useSWR(null);
    } else {
      return super.asSwr();
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
