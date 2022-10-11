import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key: string, value: string) => {
  try {
    console.log(key, value);
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

export const getAllConfiguration = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const configuration = await AsyncStorage.multiGet(keys);
    return configuration;
  } catch (e) {}
};

export const clearData = async () => {
  await AsyncStorage.clear();
};
