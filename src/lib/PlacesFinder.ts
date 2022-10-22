import IPlaceFinder from "../adapters/interface/IPlaceFinder";
import { useGoogle, useNaver } from "../hooks/apiAdapters";

type queryOptions = {
  searchQuery: string;
  country: string;
  language: string;
};

export function searchPlaces({ searchQuery, country, language }: queryOptions) {
  let api: IPlaceFinder;
  console.log(country);
  switch (country) {
    case "kr":
      api = useNaver();
      break;
    default:
      api = useGoogle();
  }

  api.search(searchQuery, country, language).then((data: any) => {
    console.log(data);
  });
}
