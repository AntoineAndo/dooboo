import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
//@ts-ignore
import { REACT_APP_API_URL, REACT_APP_API_ANON_KEY } from "@env";

import { v4 as uuidv4 } from "uuid";
import Form from "../types/Form";
import SecureStorage from "./SecureStorage";

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
export function getProducts(searchQuery: any): Promise<any> {
  return new Promise((res, rej) => {
    let query = supabase.from("product").select(
      `
        id,
        name,
        product_image!inner(
          image_url
        ),
        product_category!inner(
          category(
            *
          )
        ),
        product_store!inner(
          store(
            *
          )
        )
      `
    );

    //ID filter
    if (searchQuery.id != undefined) {
      query.eq("id", searchQuery.id);
    }

    //Country filter
    if (searchQuery.country != undefined) {
      query.eq("fk_country_id", searchQuery.country);
    }

    //Categories filter
    if (searchQuery.categoriesId != undefined) {
      query.in("product_category.fk_category_id", searchQuery.categoriesId);
    }

    //Fetch and handle response
    query.then(({ data: products, error }) => {
      if (error != undefined) {
        console.error(error.message);
        console.error(error.hint);
        rej(error);
      }

      res(products as Array<any>);
    });
  });
}

export async function getCategories(countryId: string): Promise<any> {
  return new Promise((res, rej) => {
    supabase
      .from("category")
      .select(`*`)
      .then((data) => {
        res(data);
      });
  });
}

export async function linkProductCategories(categoriesToInsert: any[]) {
  const { data, error } = await supabase
    .from("product_category")
    .insert(categoriesToInsert)
    .select();

  //Define rollback infos
  // to allow for generic rollback
  let rollbackInfos;
  if (data != null) {
    rollbackInfos = {
      type: "row",
      table: "product_category",
      id: data[0].id,
    };
  }

  return { data, error, rollbackInfos };
}

export async function addProduct(formData: Form) {
  let { data, error } = await supabase
    .from("product")
    .insert([{ name: formData.name, fk_country_id: formData.countryId }])
    .select();

  //Define rollback infos
  // to allow for generic rollback
  let rollbackInfos;
  if (data != null) {
    rollbackInfos = {
      type: "row",
      table: "product",
      id: data[0].id,
    };
  }

  return { data, error, rollbackInfos };
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
        lat: store.location.latitude,
        lng: store.location.longitude,
      },
      { onConflict: "technical_id" }
    )
    .select();
}

export async function linkProductStore(productId: string, storeId: string) {
  console.log(productId);
  console.log(storeId);
  const { data, error } = await supabase
    .from("product_store")
    .insert([
      {
        fk_product_id: productId,
        fk_store_id: storeId,
      },
    ])
    .select();

  //Define rollback infos
  // to allow for generic rollback
  let rollbackInfos;
  if (data != null) {
    rollbackInfos = {
      type: "row",
      table: "product_store",
      id: data[0].id,
    };
  }
  return { data, error, rollbackInfos };
}

export async function linkProductImage(productId: string, imageUrl: string) {
  const { data, error } = await supabase
    .from("product_image")
    .insert([
      {
        fk_product_id: productId,
        image_url: imageUrl,
      },
    ])
    .select();

  //Define rollback infos
  // to allow for generic rollback
  let rollbackInfos;
  if (data != null) {
    rollbackInfos = {
      type: "row",
      table: "product_image",
      id: data[0].id,
    };
  }
  return { data, error, rollbackInfos };
}

export async function uploadImage(image: File) {
  console.log(image);
  let { data, error }: any = await supabase.storage
    .from("images")
    .upload("products/" + uuidv4() + ".jpg", image as File);

  //Define rollback infos
  // to allow for generic rollback
  let rollbackInfos;
  if (data != null) {
    rollbackInfos = {
      type: "file",
      path: data.path,
    };
  }

  return { data, error, rollbackInfos };
}

export async function downloadImage(imageUrl: string) {
  return await supabase.storage.from("images").getPublicUrl(imageUrl);
}

//Delete an image with the given path
export async function deleteImage(path: string) {
  const { data, error } = await supabase.storage.from("images").remove([path]);

  return { data, error };
}

/**
 * @description Generic function which delete a table entry
 * @param table Name of the table where the record should be deleted
 * @param id Id of the record to delete
 */
export async function deleteByTableAndId(table: string, id: number) {
  const { data, error } = await supabase.from(table).delete().eq("id", id);

  return { data, error };
}
