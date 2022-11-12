import IPlaceFinder from "../adapters/interface/IPlaceFinder";
import { useGoogle, useNaver } from "../hooks/apiAdapters";

type queryOptions = {
  searchQuery: string;
  country: string;
  language: string;
  excludePlacesId?: string[];
};

export function searchPlaces({
  searchQuery,
  country,
  language,
  excludePlacesId,
}: queryOptions): Promise<any> {
  let api: IPlaceFinder;
  if (excludePlacesId == undefined) {
    excludePlacesId = [];
  }
  switch (country) {
    case "kr":
      api = useNaver();
      break;
    default:
      api = useGoogle();
  }

  return api.search(searchQuery, country, language, excludePlacesId);
}
