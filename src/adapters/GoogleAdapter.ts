import axios from "axios";
//@ts-ignore
import { REACT_APP_PROXY_URL, REACT_APP_GOOGLE_API_KEY } from "@env";
import IPlaceFinder from "./interface/IPlaceFinder";
import { buildUrl } from "./utils/utils";

class GoogleAdapter implements IPlaceFinder {
  constructor() {}

  transform(results: any[]): any[] {
    return results.map((result: any) => {
      return {
        id: result.place_id,
        name: result.name,
        location: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        },
        source: "google",
      };
    });
  }

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

    return new Promise((res, rej) => {
      axios
        .get(url)
        .then((response) => {
          // handle success
          console.log(response.data.results);
          res(this.transform(response.data.results.slice(0, 5)));
        })
        .catch((error) => {
          // handle error
          rej(error);
        })
        .finally(() => {
          // always executed
        });
    });
  }
}

export default GoogleAdapter;
