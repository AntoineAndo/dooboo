import axios from "axios";
//@ts-ignore
import { REACT_APP_PROXY_URL, REACT_APP_GOOGLE_API_KEY } from "@env";
import IPlaceFinder from "./interface/IPlaceFinder";
import { buildUrl } from "./utils/utils";

class GoogleAdapter implements IPlaceFinder {
  constructor() {}

  search(searchQuery: string, language: string, country: string): Promise<any> {
    const endpoint =
      "https://maps.googleapis.com/maps/api/place/textsearch/json";

    const params = {
      query: searchQuery,
      language,
      components: "country:" + country,
      type: "store",
      inputtype: "textquery",
      key: REACT_APP_GOOGLE_API_KEY,
    };

    const url = buildUrl(endpoint, params);
    console.log(url);

    return new Promise((res, rej) => {
      axios
        .get(url)
        .then(function (response) {
          // handle success
          res(response.data.results.slice(0, 5));
        })
        .catch(function (error) {
          // handle error
          rej(error);
        })
        .finally(function () {
          // always executed
        });
    });
  }
}

export default GoogleAdapter;
