import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
//@ts-ignore
import { REACT_APP_API_URL, REACT_APP_API_ANON_KEY } from "@env";
import Product from "../types/product";
import Store from "../types/store";

const supabaseUrl = REACT_APP_API_URL as string;
const supabaseAnonKey = REACT_APP_API_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

//Get all the products from a given country, joined with the store presence info
//Main request to list products
export function getProducts(countryId: number): Promise<any> {
  return new Promise((res, rej) => {
    supabase
      .from("product")

      .select(
        `
        id,
        name,
        product_store!inner(
          count,
          store (
            name
          )
        )
      `
      )
      .eq("product_store.fk_country_id", countryId)
      .then(({ data: products, error }) => {
        if (error != undefined) {
          console.error(error.message);
          console.error(error.hint);
          rej(error);
        }

        res(products as Array<Product>);
      });
  });
}

export function getStores(countryId: number) {
  return new Promise((res, rej) => {
    supabase
      .from("store")

      .select(
        `
        id,
        name,
        store_country!inner(
          count
        )
      `
      )
      .eq("store_country.fk_country_id", countryId)
      .then(({ data: stores, error }) => {
        if (error != undefined) {
          console.error(error.message);
          console.error(error.hint);
          rej(error);
        }

        res(stores as Array<Store>);
      });
  });
}
