import axios from "axios";
import IPlaceFinder from "./interface/IPlaceFinder";
//@ts-ignore
import { REACT_APP_GOOGLE_API_KEY } from "@env";
import { buildUrl } from "./utils/utils";

class NaverAdapter implements IPlaceFinder {
  constructor() {}

  search(searchQuery: string, language: string, country: string): Promise<any> {
    console.log("search");

    return new Promise((res, rej) => {
      //https://openapi.naver.com/v1/papago/n2mt?source=en&target=ko&text=seven%20eleven%20sinchon

      const endpoint = "https://openapi.naver.com/v1/papago/n2mt";
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
    });
  }

  translate() {}
}

export default NaverAdapter;
