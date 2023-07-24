import AsyncStorage from "@react-native-async-storage/async-storage";
import { Log } from "../utils/Log";
import { supabase } from "./supabase";

const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

const merge = async (key: string, value: string) => {
  try {
    AsyncStorage.mergeItem(key, value);
  } catch (e) {
    // error reading value
  }
};

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    // error reading value
  }
};

const clearData = async () => {
  await AsyncStorage.clear();
};

const uploadFile = async (file: File) => {
  const { data, error } = await supabase.storage
    .from("images")
    .upload("public/" + file?.name, file as File);

  if (data) {
  } else if (error) {
    Log(error, "error");
  }
};

export default {
  merge,
  getData,
  storeData,
  clearData,
  uploadFile,
};
