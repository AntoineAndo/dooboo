import axios from "axios";
import IPlaceFinder from "./interface/IPlaceFinder";
//@ts-ignore
import { REACT_APP_NAVER_CLIENT_ID, REACT_APP_NAVER_CLIENT_SECRET } from "@env";
import { buildUrl } from "./utils/utils";

class NaverAdapter implements IPlaceFinder {
  constructor() {}

  transform(results: any[]): any[] {
    return results.map((result: any) => {
      return {
        name: result.title,
        location: {
          lat: result.mapx,
          lng: result.mapy,
        },
      };
    });
  }

  translate() {}

  search(searchQuery: string, language: string, country: string): Promise<any> {
    console.log("search");
    return new Promise((res, rej) => {
      const endpoint = "https://openapi.naver.com/v1/search/local.json";
      const params = {
        query: searchQuery,
        display: "20",
      };

      const url = buildUrl(endpoint, params);
      console.log(url);

      const headers = {
        "X-Naver-Client-Id": REACT_APP_NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": REACT_APP_NAVER_CLIENT_SECRET,
      };

      return new Promise((res, rej) => {
        axios
          .get(url, { headers })
          .then((response) => {
            // handle success
            res(this.transform(response.data.items));
          })
          .catch((error) => {
            // handle error
            rej(error);
          })
          .finally(() => {
            // always executed
          });
      });
    });
  }
}

export default NaverAdapter;
