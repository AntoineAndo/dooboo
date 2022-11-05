import * as React from "react";
import * as SecureStore from "expo-secure-store";

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  console.log(result);
  if (result) {
    return result;
  } else {
    return null;
  }
}

export default {
  save,
  getValueFor,
};
