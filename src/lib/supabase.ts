import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-url-polyfill/auto";
import { createClient, User } from "@supabase/supabase-js";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import Form from "../types/Form";
import Store from "../types/Store";

//@ts-ignore
import { REACT_APP_API_URL, REACT_APP_API_ANON_KEY } from "@env";

const supabaseUrl = process.env.REACT_APP_API_URL as string;
// const supabaseUrl = "https://esgxcigylooqbugecbjt.supabase.co";
const supabaseAnonKey = process.env.REACT_APP_API_ANON_KEY as string;

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
export function getProducts(searchQuery: any): Promise<Array<any>> {
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

export async function getCategories(countryId: number): Promise<any> {
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

export async function addProduct(formData: Form, user: User) {
  let { data, error } = await supabase
    .from("product")
    .insert([
      {
        name: formData.name,
        fk_country_id: formData.countryId,
        fk_created_by: user.id,
      },
    ])
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

export async function upsertStore(store: Store) {
  return await supabase
    .from("store")
    .upsert(
      {
        id: store.id,
        name: store.name,
        source: store.source,
        lat: store.lat,
        lng: store.lng,
      },
      { onConflict: "id" }
    )
    .select();
}

export async function linkProductStore(
  productId: string,
  storeId: string,
  user: User
) {
  //Find the link if it already exists
  // const selectResult = await supabase
  //   .from("product_store")
  //   .select(`id`)
  //   .eq("fk_product_id", productId)
  //   .eq("fk_store_id", storeId)
  //   .eq("fk_profile_id", user.id);

  // console.log(selectResult);

  const { data, error } = await supabase
    .from("product_store")
    .insert([
      {
        fk_product_id: productId,
        fk_store_id: storeId,
        fk_profile_id: user.id,
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

export async function deleteContribution(
  productId: number,
  storeId: string,
  user: User
) {
  const { data, error } = await supabase
    .from("product_store")
    .delete()
    .eq("fk_product_id", productId)
    .eq("fk_store_id", storeId)
    .eq("fk_profile_id", user.id);

  return { data, error };
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
  console.log("image");
  console.log(image);

  try {
    let { data, error }: any = await supabase.storage
      .from("images")
      .upload("products/" + uuidv4() + ".jpg", image as File);

    console.log(data);
    console.log(error);

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
  } catch (e) {
    console.error("Error", e);
    console.error("=====");
  }
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

export async function getContributions(userId: string | undefined) {
  const { data, error } = await supabase
    .from("product_store")
    .select(
      `
        id,
        fk_store_id,
        store!inner(
          *
        ),
        fk_profile_id,
        fk_product_id,
        product!inner(
          *,
          product_image!inner(
            image_url
          )
        )
      `
    )
    .eq("fk_profile_id", userId);

  return data;
}

export async function getCountries(): Promise<any> {
  return new Promise((res, rej) => {
    supabase
      .from("country")
      .select(`*`)
      .then((data) => {
        res(data);
      });
  });
}
export async function getLanguages(): Promise<any> {
  return new Promise((res, rej) => {
    supabase
      .from("language")
      .select(`*`)
      .then((data) => {
        res(data);
      });
  });
}
