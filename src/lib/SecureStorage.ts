import * as React from "react";
import * as SecureStore from "expo-secure-store";

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

export default {
  save,
  getItem,
};
