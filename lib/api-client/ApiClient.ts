import useSWR, { SWRConfig, responseInterface } from "swr";

export type UrlOrUrlGetter = string | (() => any);

export default class ApiClient {
  #requestUrl: undefined | string;
  #responsePromise: undefined | Promise<any>;
  #swrKey: any;

  public getRequestUrl(url: string): string {
    this.#requestUrl = "/" + url;
    return this.#requestUrl;
  }

  private request(
    urlOrUrlGetter: UrlOrUrlGetter,
    fetchOptions: RequestInit | undefined = undefined,
    responseHandler: undefined | ((value: any) => any) = (value) => value
  ): this {
    this.#swrKey = undefined;
    this.#requestUrl = undefined;
    this.#responsePromise = undefined;

    // @see the 'Dependent Fetching' section of https://github.com/vercel/swr
    let url: string | null;
    if (typeof urlOrUrlGetter == "function") {
      try {
        url = urlOrUrlGetter();
      } catch (e) {
        url = null;
      }
    } else {
      url = urlOrUrlGetter;
    }

    if (url) {
      url = this.getRequestUrl(url);

      let method =
        fetchOptions && "method" in fetchOptions
          ? fetchOptions.method.toLowerCase()
          : "get";
      let body =
        fetchOptions && "body" in fetchOptions ? fetchOptions.body : undefined;

      this.#swrKey = body ? [url, method, body] : [url, method];

      console.log("fetch", url, fetchOptions);

      this.#responsePromise = fetch(url, fetchOptions)
        .then((response) => {
          return response.json();
        })
        .then(responseHandler);
    }

    return this;
  }

  public get(
    url: UrlOrUrlGetter,
    fetchOptions: RequestInit | undefined = undefined,
    responseHandler: undefined | ((value: any) => any) = undefined
  ): this {
    return this.request(url, fetchOptions, responseHandler);
  }

  public submit(
    url: UrlOrUrlGetter,
    data: any,
    method: "post" | "put" = "post",
    responseHandler: undefined | ((value: any) => any) = undefined
  ): this {
    let fetchOptions: RequestInit = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    return this.request(url, fetchOptions, responseHandler);
  }

  public asPromise(): Promise<any> {
    if (!this.#responsePromise) {
      if (!this.#requestUrl) {
        throw new Error(
          "Only requests initialized with a string url can be returned as a promise."
        );
      } else {
        throw new Error("You must make a request before invoking asPromise()");
      }
    }
    return this.#responsePromise;
  }

  public asSwr(): responseInterface<any, any> {
    return useSWR(this.#swrKey, async () => {
      if (!this.#responsePromise) {
        throw new Error("You must make a request before invoking asSwr()");
      } else {
        return this.#responsePromise;
      }
    });
  }
}
