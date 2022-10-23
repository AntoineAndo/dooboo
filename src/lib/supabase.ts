import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
//@ts-ignore
import { REACT_APP_API_URL, REACT_APP_API_ANON_KEY } from "@env";
import Product from "../types/product";

import { v4 as uuidv4 } from "uuid";
import Form from "../types/Form";

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
        product_image!inner(
          image_url
        )
      `
      )
      .eq("fk_country_id", countryId)
      .then(({ data: products, error }) => {
        if (error != undefined) {
          console.error(error.message);
          console.error(error.hint);
          rej(error);
        }

        res(products as Array<any>);
      });
  });
}

export async function addProduct(formData: Form) {
  let { data, error } = await supabase
    .from("product")
    .insert([{ name: formData.name, fk_country_id: formData.countryId }])
    .select();

  return { data, error };
}

//Return the default country
export async function getDefaultCountry() {
  return await supabase.from("country").select(`*`).eq("default", true);
}

export async function upsertStore(store: any) {
  return await supabase
    .from("store")
    .upsert(
      {
        technical_id: store.id,
        name: store.name,
        source: store.source,
        lat: store.location.lat,
        lng: store.location.lng,
      },
      { onConflict: "technical_id" }
    )
    .select();
}

export async function linkProductStore(productId: string, storeId: string) {
  return await supabase.from("product_store").insert([
    {
      fk_product_id: productId,
      fk_store_id: storeId,
    },
  ]);
}

export async function linkProductImage(productId: string, imageUrl: string) {
  return await supabase.from("product_image").insert([
    {
      fk_product_id: productId,
      image_url: imageUrl,
    },
  ]);
}

export async function uploadImage(image: any) {
  let { data, error } = await supabase.storage
    .from("images")
    .upload("products/" + uuidv4() + ".jpg", image as File);

  return { data, error };
}

export async function downloadImage(imageUrl: string) {
  return await supabase.storage.from("images").getPublicUrl(imageUrl);
}

//Delete an image with the given path
export async function deleteImage(path: string) {
  const { data, error } = await supabase.storage.from("images").remove([path]);

  return { data, error };
}
