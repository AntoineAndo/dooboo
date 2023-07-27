import { User } from "@supabase/supabase-js";
import {
  addProduct,
  deleteByTableAndId,
  deleteImage,
  insertBrands,
  linkBrandsCountry,
  linkProductCategories,
  linkProductImage,
  linkProductStore,
  uploadImages,
  upsertStore,
} from "../lib/supabase";
import Form from "../types/Form";
import Product from "../types/product";
import { Log } from "./Log";
import Brand from "../types/Brand";

export async function submitForm(
  form: Form,
  images: any[],
  user: User
): Promise<Boolean> {
  Log("Form submit");
  if (form.brand1 == undefined) return true;

  //Filter out undefined brands
  let selectedBrands = [form.brand1, form.brand2].filter(
    (b) => b != undefined
  ) as Brand[];
  let brandInsertResult: any, linkBrandCountryResult: any;
  let brand2InsertResult, linkBrand2CountryResult;

  //If one of the selected brand doesnt have an ID,
  // then that means it's a new one so it is going to be created
  //@ts-ignore
  let newBrandsToInsert: Brand[] = selectedBrands.filter((br?: Brand) => {
    if (!br) {
      return false;
    }

    return br.id == undefined;
  });

  if (newBrandsToInsert.length > 0) {
    //Creating new brands
    brandInsertResult = await insertBrands(newBrandsToInsert);

    //if error during insert
    //return error true
    if (brandInsertResult.data == null) {
      return true;
    }

    //Each of these new brands is linked to their country
    linkBrandCountryResult = await linkBrandsCountry(
      brandInsertResult.data,
      form.countryId
    );

    //if error during insert
    //rollback brand insert and return true
    if (linkBrandCountryResult.data == null) {
      rollback([brandInsertResult]);
      return true;
    }

    //update the values of the selected brands with the insert results
    //  Filter out the brands with no ID (aka the new ones), and add them back from the inserts result
    selectedBrands = selectedBrands
      .filter((b) => b.id != undefined)
      .concat(brandInsertResult.data);
  }

  const [imageInsertResult, productInsertResult]: any[] = await Promise.all([
    uploadImages(images),
    addProduct(form, selectedBrands[0], selectedBrands[1], user),
  ]);

  Log([imageInsertResult, productInsertResult]);

  //If at least one result is an error
  // then rollback all
  if (imageInsertResult.data == null || productInsertResult.data == null) {
    //Store upsert is not rolledback because not needed
    rollback([
      imageInsertResult,
      productInsertResult,
      linkBrandCountryResult,
      brandInsertResult,
    ]);

    return true;
  }

  //Bring back the image type in the image upload result data
  imageInsertResult.data.map((i: any, index: number) => {
    i.data.type = images[index].type;
  });

  const insertedProduct: Product = productInsertResult.data[0];

  //Build the payload for the categories insert
  const categoriesToInsert = form.categories.map((category: any) => {
    return {
      fk_product_id: insertedProduct.id,
      fk_category_id: category.id,
    };
  });

  //link the product with the store
  //link the product with the selected categories
  //link the product with the image previously uploaded
  const [linkProductCategoriesResult, linkProductImageResult] =
    await Promise.all([
      linkProductCategories(categoriesToInsert),
      linkProductImage({
        productId: insertedProduct.id,
        images: imageInsertResult,
        userId: user.id,
        newProduct: true,
      }),
    ]);

  Log([linkProductCategoriesResult, linkProductImageResult]);

  //If a store was selected, upsert it
  // then link the product to the store
  let storeUpsertResult, linkProductStoreResult;
  if (form.store && form.store.id) {
    //Upsert
    storeUpsertResult = await upsertStore(form.store);

    //Product-store link
    linkProductStoreResult = await linkProductStore(
      insertedProduct.id,
      form.store?.id,
      user
    );
  }

  //If at least one of the record is in error
  // then rollback them + the previous ones
  if (
    (linkProductStoreResult && linkProductStoreResult.error != null) ||
    (storeUpsertResult && storeUpsertResult.error != null) ||
    linkProductCategoriesResult.error != null ||
    linkProductImageResult.error != null
  ) {
    //Rollback
    rollback([
      linkProductStoreResult,
      linkProductCategoriesResult,
      linkProductImageResult,
      linkBrandCountryResult,
      imageInsertResult,
      productInsertResult,
      brandInsertResult,
    ]);

    return true;
  }

  return false;
}

/**
 * @description Delete DB entries based on ID or path
 * @param results An array of query results
 */
export function rollback(results: Array<{ rollbackInfos: any } | undefined>) {
  results.forEach((result) => {
    //If a given query result has an error, it means the entry was not inserted
    // so we don't need to delete
    if (result == undefined || result.rollbackInfos == undefined) return;

    Log("Rolling back ", result.rollbackInfos);

    //File rollback
    if (result.rollbackInfos.type == "file") {
      deleteImage(result.rollbackInfos.path);
      return;
    }

    //Row rollback
    if (result.rollbackInfos.type == "row") {
      deleteByTableAndId(result.rollbackInfos.table, result.rollbackInfos.id);
      return;
    }
  });
}

export async function submitContribution({
  store,
  product,
  images,
  user,
}: {
  store: any;
  product: Product;
  images: any[];
  user: User;
}) {
  Log("Contribution submit");

  //Insert images and Store
  const [imageInsertResult, storeUpsertResult] = await Promise.all([
    uploadImages(images),
    upsertStore(store),
  ]);

  Log([imageInsertResult, storeUpsertResult]);

  //If at least one result is an error
  // then rollback all
  if (imageInsertResult.data == null || storeUpsertResult.data == null) {
    //Store upsert is not rolledback because not needed
    rollback([imageInsertResult]);

    return true;
  }

  //Bring back the image type in the image upload result data
  imageInsertResult.data.map((i: any, index: number) => {
    i.data.type = images[index].type;
  });

  //link the product with the store
  //link the product with the selected categories
  //link the product with the image previously uploaded
  const [linkProductStoreResult, linkProductImageResult] = await Promise.all([
    linkProductStore(product.id, store.id, user),
    linkProductImage({
      productId: product.id,
      images: imageInsertResult,
      userId: user.id,
    }),
  ]);

  Log([linkProductStoreResult, linkProductImageResult]);

  //If at least one of the record is in error
  // then rollback them + the previous ones
  if (
    linkProductStoreResult.error != null ||
    linkProductImageResult.error != null
  ) {
    //Rollback
    rollback([
      linkProductStoreResult,
      linkProductImageResult,
      imageInsertResult,
    ]);

    return true;
  }

  return false;
}
