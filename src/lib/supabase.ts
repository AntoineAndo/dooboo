import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-url-polyfill/auto";
import { createClient, User } from "@supabase/supabase-js";

import Constants from "expo-constants";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import Form from "../types/Form";
import Store from "../types/Store";
import Brand from "../types/Brand";

const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL as string;
// const supabaseUrl = "https://esgxcigylooqbugecbjt.supabase.co";
const supabaseAnonKey = Constants.expoConfig?.extra?.SUPABASE_KEY as string;
const supabaseServiceRole = Constants.expoConfig?.extra
  ?.SUPABASE_SERVICE_ROLE as string;

export const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

const adminAuthClient = supabase.auth.admin;

//Get all the products from a given country, joined with the store presence info
//Main request to list products
export function getProducts(
  searchQuery: any,
  page: number = 1,
  numberOfItems: number = 10
): Promise<Array<any>> {
  return new Promise((res, rej) => {
    let query = supabase.from("product").select(
      `
        id,
        name,
        vegan,
        justification,
        product_image!inner(
          image_url,
          main
        ),
        product_category!inner(
          category(
            *
          )
        ),
        product_store(
          store(
            *
          )
        ),
        brand!product_fk_brand_id_fkey(
          *,
          brand_country(
            country(
              *
            )
          )
        ),
        brand2:brand!product_fk_brand2_id_fkey(
          *
        ),
        rating(
          *
        ) as ratings,
      `
    );

    //ID filter
    if (searchQuery.id != undefined) {
      query.eq("id", searchQuery.id);
      query.eq("rating.fk_product_id", searchQuery.id);
    }

    //Country filter
    if (searchQuery.country != undefined) {
      query.eq("fk_country_id", searchQuery.country);
    }

    //Search string filter
    if (
      searchQuery.searchString != "" &&
      searchQuery.searchString != undefined
    ) {
      query.ilike("name", `%${searchQuery.searchString.trim()}%`);
    }

    //Categories filter
    if (
      searchQuery.categoriesId != undefined &&
      searchQuery.categoriesId.length != 0
    ) {
      query.in("product_category.fk_category_id", searchQuery.categoriesId);
    }

    //Brand filter
    if (searchQuery.brandsId != undefined && searchQuery.brandsId.length != 0) {
      query.or(
        `fk_brand_id.in.(${searchQuery.brandsId.join(
          ","
        )}),fk_brand2_id.in.(${searchQuery.brandsId.join(",")})`
      );
    }

    if (searchQuery.onlyMainImage) {
      query.eq("product_image.main", true);
    }

    //Pagination
    let f = numberOfItems * (page - 1);
    let l = f + numberOfItems - 1;
    query.range(f, l);

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

export async function findExistingProduct({
  name,
  brand_id,
}: {
  name: string;
  brand_id: string;
}): Promise<any[]> {
  return new Promise((res, rej) => {
    supabase
      .from("product")
      .select(
        `
        id,
        name,
        product_image!inner(
          image_url
        ),
        brand(
          *
        )
      `
      )
      .eq("fk_brand_id", brand_id)
      .then((result) => {
        if (result.data != null) res(result.data);

        rej([]);
      });
  });
}

export async function getProductFindings({
  min_lat,
  min_long,
  max_lat,
  max_long,
  productId,
}: {
  min_lat: number;
  min_long: number;
  max_lat: number;
  max_long: number;
  productId: string;
}): Promise<any> {
  const { data, error } = await supabase.rpc("places_in_view_with_product_id", {
    product_id: productId,
    min_lat,
    min_long,
    max_lat,
    max_long,
  });

  if (error != null) {
    throw new Error("Something went wrong", {
      cause: error,
    });
  }

  return data;
}

export async function getCategories(countryId?: number): Promise<any> {
  return new Promise((res, rej) => {
    let query = supabase.from("category").select(`*`).order("id", {
      ascending: true,
    });

    // if (countryId != undefined) {
    //   query.eq("fk_country_id", countryId);
    // }

    query.then((data) => {
      res(data.data);
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
    rollbackInfos = [
      {
        type: "row",
        table: "product_category",
        id: data[0].id,
      },
    ];
  }

  return { data, error, rollbackInfos };
}

export async function addProduct(
  formData: Form,
  brand1: Brand,
  brand2: Brand,
  user: User
) {
  let { data, error } = await supabase
    .from("product")
    .insert([
      {
        name: formData.name.trim(),
        fk_country_id: formData.countryId,
        fk_brand_id: brand1.id,
        fk_brand2_id: brand2?.id,
        fk_created_by: user.id,
      },
    ])
    .select();

  //Define rollback infos
  // to allow for generic rollback
  let rollbackInfos;
  if (data != null) {
    rollbackInfos = [
      {
        type: "row",
        table: "product",
        id: data[0].id,
      },
    ];
  }

  return { data, error, rollbackInfos };
}

export async function upsertStore(store: Store) {
  return await supabase
    .from("store")
    .upsert(
      {
        id: store.id,
        name: store.name,
        source: store.source,
        location: `POINT(${store.lng} ${store.lat})`,
        vegan: store.vegan,
      },
      { onConflict: "id" }
    )
    .select();
}

export async function getStoreById(storeId: string) {
  return await supabase.from("store").select(`*`).eq("id", storeId);
}

export async function getNearbyStores({
  latitude,
  longitude,
  distance = 1000,
  product_id,
}: {
  latitude: number;
  longitude: number;
  distance?: number;
  product_id?: number;
}) {
  const { data, error } = await supabase.rpc("stores_around_point", {
    latitude,
    longitude,
    distance,
    product_id: product_id?.toString() ?? "",
  });

  if (error != null) {
    throw new Error("Something went wrong", {
      cause: error,
    });
  }

  return data;
}

// export async function getNearbyStores({
//   min_lat,
//   min_long,
//   max_lat,
//   max_long,
// }: {
//   min_lat: number;
//   min_long: number;
//   max_lat: number;
//   max_long: number;
// }): Promise<any> {
//   const { data, error } = await supabase.rpc("places_in_view", {
//     min_lat,
//     min_long,
//     max_lat,
//     max_long,
//   });

//   if (error != null) {
//     throw new Error("Something went wrong", {
//       cause: error,
//     });
//   }

//   return data;
// }

/**
 * @description Create a product/store entry in the DB
 * @param productId
 * @param storeId
 * @param user
 * @returns
 */
export async function linkProductStore(
  productId: string,
  storeId: string,
  user: User
) {
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
    rollbackInfos = [
      {
        type: "row",
        table: "product_store",
        id: data[0].id,
      },
    ];
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

export async function linkProductImage({
  productId,
  images,
  userId,
  newProduct = false,
}: {
  productId: string;
  images: any;
  userId: string;
  newProduct?: Boolean;
}) {
  let data = await Promise.all(
    images.data.map((image: any) => {
      return supabase
        .from("product_image")
        .insert([
          {
            fk_product_id: productId,
            fk_created_by: userId,
            image_url: image.data.path,
            type: image.data.type,
            main: newProduct && image.data.type == "primary", //If it is a new product, the primary image is used as the main one
          },
        ])
        .select();
    })
  );

  let hasError = null;
  if (data.find((result) => result.error != null)) {
    hasError = true;
  }

  //Define rollback infos
  // to allow for generic rollback
  let rollbackInfos;
  if (data != null) {
    rollbackInfos = data.map((result: any) => {
      return {
        type: "row",
        table: "product_image",
        id: result.id,
      };
    });
  }
  return { data, error: hasError, rollbackInfos };
}

export async function uploadImages(images: any[]) {
  let data = await Promise.all(
    images.map(({ image }: { image: File }) => {
      let promise = supabase.storage
        .from("images")
        .upload("products/" + uuidv4() + ".jpg", image as File);
      return promise;
    })
  );

  // Define rollback infos
  // to allow for generic rollback
  let rollbackInfos;
  if (data != null) {
    rollbackInfos = data.map((result: any) => {
      return {
        type: "file",
        path: result.path,
      };
    });
  }

  return { data, rollbackInfos };
}

export async function downloadImages(imagesUrl: string[]) {
  return await Promise.all(
    imagesUrl.map((imageUrl) => {
      return supabase.storage.from("images").getPublicUrl(imageUrl).data;
    })
  );
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

export async function getContributions({
  userId,
  storeId,
}: {
  userId?: string;
  storeId?: string;
}) {
  return new Promise((res, rej) => {
    supabase
      .rpc("get_contributions_in_store", {
        store_id: storeId,
        user_id: userId,
      })
      .then(({ data, error }) => {
        if (data == null) {
          console.log(error);
          return res([]);
        }

        console.log(data);

        return res(
          data.map((row: any) => {
            const returnData = {
              store_id: row.fk_store_id,
              product: {
                id: row.product_id,
                name: row.product_name,
                main_image_url: row.main_image_url,
                totalRating: row.total_rating,
                categories: [],
                brand: {
                  id: row.brand_id,
                  name_ori: row.brand_name_ori,
                  name_rom: row.brand_name_rom,
                  brand_country: [
                    {
                      country: {
                        id: row.country_id,
                        code: row.country_code,
                        name: row.country_name,
                        language_code: row.country_language_code,
                      },
                    },
                  ],
                },
                brand2: undefined as any,
              },
              brand: {
                id: row.brand_id,
                name_ori: row.brand_name_ori,
                name_rom: row.brand_name_rom,
                brand_country: [
                  {
                    country: {
                      id: row.country_id,
                      code: row.country_code,
                      name: row.country_name,
                      language_code: row.country_language_code,
                    },
                  },
                ],
              },
              brand2: undefined as any,
              last_seen: row.last_seen,
              last_seen_by_user: row.last_seen_by_user,
              seen_by: row.fk_profile_id,
            };

            //If the second brand is defined,
            //add the data to the return data
            if (row.brand2_id != null) {
              returnData.brand2 = {
                id: row.brand2_id,
                name_ori: row.brand2_name_ori,
                name_rom: row.brand2_name_rom,
                brand_country: [
                  {
                    country: {
                      id: row.country_id,
                      code: row.country_code,
                      name: row.country_name,
                      language_code: row.country_language_code,
                    },
                  },
                ],
              };

              returnData.product.brand2 = {
                id: row.brand2_id,
                name_ori: row.brand2_name_ori,
                name_rom: row.brand2_name_rom,
                brand_country: [
                  {
                    country: {
                      id: row.country_id,
                      code: row.country_code,
                      name: row.country_name,
                      language_code: row.country_language_code,
                    },
                  },
                ],
              };
            }

            return returnData;
          })
        );
      });
  });
}

export async function getPersonnalContributionsForProduct(
  userId: string,
  productId: string
) {
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
    .eq("fk_profile_id", userId)
    .eq("fk_product_id", productId);

  return data;
}

export async function getCountries(): Promise<any> {
  return new Promise((res, rej) => {
    supabase
      .from("country")
      .select(`*`)
      .eq("active", true)
      .then((data) => {
        console.log(data);
        res(data);
      });
  });
}

export async function getReportCategories(): Promise<any> {
  return new Promise((res, rej) => {
    supabase
      .from("report_category")
      .select(`*`)
      .then((data) => {
        res(data.data);
      });
  });
}

export async function searchBrands({
  queryKey: [_, searchString, country_id],
  countryId,
}: any) {
  const response = await supabase
    .from("brand")
    .select(
      `
      *,
      brand_country!inner(
        *
      )`
    )
    .or(
      `name_rom.ilike.%${searchString.trim()}%,name_ori.ilike.%${searchString.trim()}%` //case insensitive and double % wildcard
    )
    .eq("brand_country.fk_country_id", country_id)
    .eq("active", true);

  return response.data ?? [];
}

export async function insertBrands(brands: Brand[]) {
  let { data, error } = await supabase
    .from("brand")
    .insert(
      brands.map((brand) => {
        return {
          name_ori: brand.name_ori,
          name_rom: brand.name_rom,
          active: true,
        };
      })
    )
    .select();

  //Define rollback infos
  // to allow for generic rollback
  let rollbackInfos;
  if (data != null) {
    console.log("brand insert data");
    console.log(data);
    rollbackInfos = [
      {
        type: "row",
        table: "brand",
        id: data[0].id,
      },
    ];
  }

  return { data, error, rollbackInfos };
}

export async function linkBrandsCountry(brands: Brand[], countryId: number) {
  let { data, error } = await supabase
    .from("brand_country")
    .insert(
      brands.map((brand: Brand) => {
        return {
          fk_brand_id: brand.id,
          fk_country_id: countryId,
        };
      })
    )
    .select();

  //Define rollback infos
  // to allow for generic rollback
  let rollbackInfos;
  if (data != null) {
    rollbackInfos = [
      {
        type: "row",
        table: "brand_country",
        id: data[0].id,
      },
    ];
  }

  return { data, error, rollbackInfos };
}

export async function submitReport(
  product_id: string,
  report_category_id: number
) {
  let { data, error } = await supabase
    .from("report")
    .insert([
      {
        fk_product_id: product_id,
        fk_report_category_id: report_category_id,
      },
    ])
    .select();

  return { data, error };
}

export async function getTopBrands({ countryId }: any): Promise<any> {
  console.log("country id", countryId);
  return new Promise((res, rej) => {
    supabase
      .from("brand_count_view")
      .select(`*`)
      .eq(`fk_country_id`, countryId)
      .then(({ data, error }) => {
        if (error) {
          rej([]);
        }
        console.log(data);
        res(data);
      });
  });
}

export async function deleteUser({ userId }: any) {
  const { data, error } = await adminAuthClient.deleteUser(userId);
  return {
    data,
    error,
  };
}

export async function deleteUserImages({ userId }: any) {
  return new Promise((res, rej) => {
    supabase
      .from("product_image")
      .select("*")
      .eq("fk_created_by", userId)
      .then(({ data, error }) => {
        if (error) return rej(error);

        supabase.storage
          .from("images")
          .remove(
            data.map((product_image) => {
              return product_image.image_url;
            })
          )
          .then((result) => {
            if (result.error != null) {
              return rej(result.error);
            }
            res(result.data);
          });
      });
  });
}

export async function upsertRating({ user, product, rating }: any) {
  return await supabase.from("rating").upsert(
    {
      fk_user_id: user.id,
      rating: rating,
      fk_product_id: product.id,
    },
    { onConflict: "fk_user_id, fk_product_id" }
  );
  // .select();
}
