import axios from "axios";
import IPlaceFinder from "./interface/IPlaceFinder";
//@ts-ignore
import { buildUrl } from "../utils/utils";

import Constants from "expo-constants";

class KakaoAdapter implements IPlaceFinder {
  constructor() {}

  transform(results: any[]): any[] {
    return results.map((result: any) => {
      return {
        id: result.id,
        name: result.place_name,
        lat: parseFloat(result.y),
        lng: parseFloat(result.x),
        source: "kakao",
      };
    });
  }

  search({ searchQuery, languageId, country, location }: any): Promise<any> {
    //https://developers.kakao.com/docs/latest/en/local/dev-guide#search-by-keyword
    const endpoint = "https://dapi.kakao.com/v2/local/search/keyword.json";
    const params = {
      query: searchQuery,
      x: location?.lng,
      y: location?.lat,
      radius: 10000, //Radius in Meters
      page: 1,
      size: 10,
      sort: "distance", //"distance" or "accuracy"
    };

    const url = buildUrl(endpoint, params);

    const headers = {
      Authorization: `KakaoAK ${Constants.expoConfig?.extra?.REACT_KAKAO_REST_API_KEY}`,
    };

    return new Promise((res, rej) => {
      axios
        .get(url, { headers })
        .then((response) => {
          //Transform from Kakao type to generic type
          let transformedData = this.transform(response.data.documents);
          res(transformedData);
        })
        .catch((error) => {
          console.error(error);
          rej(error);
        })
        .finally(() => {
          // always executed
        });
    });
  }
}

export default KakaoAdapter;
