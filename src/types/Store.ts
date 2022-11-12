import { LatLng } from "react-native-maps";

type Store = {
  id?: string;
  technical_id: string;
  name: string;
  lat: number;
  lng: number;
  source: string;
};

export default Store;
