import IPlaceFinder from "../adapters/interface/IPlaceFinder";
import { useGoogle, useNaver } from "../hooks/apiAdapters";

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
  let api: IPlaceFinder;
  switch (country) {
    case "kr":
      api = useNaver();
      break;
    default:
      api = useGoogle();
  }

  return api.search(searchQuery, country, language);
}
