import GoogleAdapter from "../adapters/GoogleAdapter";
import NaverAdapter from "../adapters/NaverAdapter";

const naverAdapter = new NaverAdapter();
const googleAdapter = new GoogleAdapter();

export const useNaver = () => {
  return naverAdapter;
};

export const useGoogle = () => {
  return googleAdapter;
};
