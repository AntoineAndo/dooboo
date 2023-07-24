import axios from "axios";
import IPlaceFinder from "./interface/IPlaceFinder";
import { buildUrl } from "../utils/utils";
import Store from "../types/Store";
import Constants from "expo-constants";

class GoogleAdapter implements IPlaceFinder {
  constructor() {}

  transform(results: Store[]): Store[] {
    return results.map((result: any) => {
      return {
        id: result.place_id,
        name: result.name,
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        source: "google",
      };
    });
  }

  search({ searchQuery, languageId, country, location }: any): Promise<any> {
    console.log(searchQuery);
    console.log(location);
    const endpoint =
      "https://maps.googleapis.com/maps/api/place/textsearch/json";

    let loc =
      location != undefined ? location.lat + "," + location.lng : undefined;

    const params = {
      query: searchQuery,
      location: loc,
      // radius: 1000,
      rankby: "distance",
      languageId,
      // region: country,
      type: "store",
      inputtype: "textquery",
      key: Constants.expoConfig?.extra?.REACT_APP_GOOGLE_API_KEY,
    };

    const url = buildUrl(endpoint, params);

    console.log(url);

    return new Promise((res, rej) => {
      axios
        .get(url)
        .then((response) => {
          console.log(response);
          let results = response.data.results;

          //Transform from Google type result to generic Store type
          results = this.transform(results);

          // handle success
          res(results);
        })
        .catch((error) => {
          console.log(error);
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
