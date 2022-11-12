import axios from "axios";
//@ts-ignore
import { REACT_APP_GOOGLE_API_KEY } from "@env";
import IPlaceFinder from "./interface/IPlaceFinder";
import { buildUrl } from "./utils/utils";
import Store from "../types/Store";

class GoogleAdapter implements IPlaceFinder {
  constructor() {}

  transform(results: Store[]): Store[] {
    return results.map((result: any) => {
      return {
        id: result.place_id,
        technical_id: result.technical_id,
        name: result.name,
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        source: "google",
      };
    });
  }

  exclude(results: Store[], excludePlacesId: string[]): Store[] {
    //Keep only the results that are not already present
    return results.filter(
      (result: Store) => excludePlacesId.indexOf(result.technical_id) == -1
    );
  }

  search(
    searchQuery: string,
    language: string,
    country: string,
    excludePlacesId: string[]
  ): Promise<any> {
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
          const transformedData = this.transform(
            response.data.results.slice(0, 5)
          );

          // handle success
          res(this.exclude(transformedData, excludePlacesId));
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
