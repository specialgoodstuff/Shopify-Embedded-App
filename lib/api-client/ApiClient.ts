import useSWR, { SWRConfig, responseInterface } from "swr";

type UrlOrUrlGetter = string | (() => any);

export default class ApiClient {
  public getRequestUrl(url: string): string {
    return "/" + url;
  }

  private request(
    urlOrUrlGetter: UrlOrUrlGetter,
    fetchOptions: RequestInit | undefined = undefined
  ): responseInterface<any, any> {
    // @see the 'Dependent Fetching' section of https://github.com/vercel/swr
    let url: string | null;
    if (typeof urlOrUrlGetter == "function") {
      try {
        url = urlOrUrlGetter();
      } catch (e) {
        url = null;
      }
    }

    let key = null;
    if (url) {
      url = this.getRequestUrl(url);

      let method =
        fetchOptions && "method" in fetchOptions
          ? fetchOptions.method.toLowerCase()
          : "get";
      let body =
        fetchOptions && "body" in fetchOptions ? fetchOptions.body : undefined;
      key = body ? [url, method, body] : [url, method];
    }

    return useSWR(
      key,
      async (url: string, method: string, body: string | undefined) => {
        return fetch(url, fetchOptions).then((response) => {
          return response.json();
        });
      }
    );
  }

  public get(
    url: UrlOrUrlGetter,
    fetchOptions: RequestInit | undefined = undefined
  ): responseInterface<any, any> {
    return this.request(url, fetchOptions);
  }

  public submit(
    url: UrlOrUrlGetter,
    data: any,
    method: "post" | "put" = "post"
  ): responseInterface<any, any> {
    let fetchOptions: RequestInit = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    return this.request(url, fetchOptions);
  }
}
