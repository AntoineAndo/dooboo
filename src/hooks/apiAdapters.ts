import GoogleAdapter from "../adapters/GoogleAdapter";
import KakaoAdapter from "../adapters/KakaoAdapter";

const kakaoAdapter = new KakaoAdapter();
const googleAdapter = new GoogleAdapter();

export const useKakao = () => {
  return kakaoAdapter;
};

export const useGoogle = () => {
  return googleAdapter;
};
