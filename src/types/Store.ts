import { LatLng } from "react-native-maps";

type Store = {
  id?: string;
  name: string;
  lat: any;
  lng: any;
  source: string;
  preset?: boolean;
  vegan?: boolean;
};

export default Store;
