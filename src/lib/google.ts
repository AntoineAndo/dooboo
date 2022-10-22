import axios from "axios";
//@ts-ignore
import { REACT_APP_PROXY_URL, REACT_APP_GOOGLE_API_KEY } from "@env";

type queryOptions = {
  searchQuery: string;
  country: string;
  language: string;
};

export function searchPlaces({
  searchQuery,
  country,
  language,
}: queryOptions): Promise<any> {
  //https://maps.googleapis.com/maps/api/place/textsearch/json?query=7%20eleven&inputtype=textquery

  let url = `${REACT_APP_PROXY_URL}/https://maps.googleapis.com/maps/api/place/textsearch/json?`;
  url += `query=${encodeURIComponent(searchQuery)}&`;
  url += `language=${encodeURIComponent(language)}&`;
  url += `components=${encodeURIComponent("country:" + country)}&`;
  url += `type=store&`;
  url += `inputtype=textquery&`;
  url += `key=${encodeURIComponent(REACT_APP_GOOGLE_API_KEY)}`;

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
