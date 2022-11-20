import IPlaceFinder from "../adapters/interface/IPlaceFinder";
import { useGoogle, useNaver } from "../hooks/apiAdapters";

type queryOptions = {
  searchQuery: string;
  country: any;
  language: string;
  excludePlacesId?: string[];
};

export function searchPlaces({
  searchQuery,
  country,
  language,
}: queryOptions): Promise<any> {
  let api: IPlaceFinder;
  switch (country.code) {
    case "kr":
      api = useGoogle();
      // api = useNaver();
      break;
    default:
      api = useGoogle();
  }

  return api.search(searchQuery, language, country.code);
}
