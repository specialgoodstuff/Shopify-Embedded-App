import useSWR, { SWRConfig, responseInterface } from "swr";
import ApiClient from "./ApiClient";
import { ShopResponse } from "./AdminApiResponses";

export default class AdminApiClient extends ApiClient {
  public getRequestUrl(url: string): string {
    return "/shopify-api/admin/" + url;
  }

  public getShop(): responseInterface<ShopResponse, any> {
    return this.get("shop.json", undefined, (data) => data.shop);
  }
}
