import { User } from "@supabase/supabase-js";
import {
  addProduct,
  deleteByTableAndId,
  deleteImage,
  linkProductCategories,
  linkProductImage,
  linkProductStore,
  uploadImage,
  upsertStore,
} from "../../lib/supabase";
import Form from "../../types/Form";
import Product from "../../types/product";

export async function submitForm(
  form: Form,
  mainImage: any,
  user: User
): Promise<Boolean> {
  if (form.store == undefined || form.store.id == undefined) return true;

  const [imageInsertResult, productInsertResult, storeUpsertResult] =
    await Promise.all([
      uploadImage(mainImage),
      addProduct(form, user),
      upsertStore(form.store),
    ]);

  console.debug([imageInsertResult, productInsertResult, storeUpsertResult]);

  //If at least one result is an error
  // then rollback all
  if (
    imageInsertResult.data == null ||
    productInsertResult.data == null ||
    storeUpsertResult.data == null
  ) {
    //Store upsert is not rolledback because not needed
    rollback([imageInsertResult, productInsertResult]);

    return true;
  }

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
  const [
    linkProductStoreResult,
    linkProductCategoriesResult,
    linkProductImageResult,
  ] = await Promise.all([
    linkProductStore(insertedProduct.id, form.store?.id, user),
    linkProductCategories(categoriesToInsert),
    linkProductImage(insertedProduct.id, imageInsertResult.data.path),
  ]);

  console.debug([
    linkProductStoreResult,
    linkProductCategoriesResult,
    linkProductImageResult,
  ]);

  //If at least one of the record is in error
  // then rollback them + the previous ones
  if (
    linkProductStoreResult.error != null ||
    linkProductCategoriesResult.error != null ||
    linkProductImageResult.error != null
  ) {
    //Rollback
    rollback([
      linkProductStoreResult,
      linkProductCategoriesResult,
      linkProductImageResult,
      imageInsertResult,
      productInsertResult,
      storeUpsertResult,
    ]);

    return true;
  }

  return false;
}

/**
 * @description Delete DB entries based on ID or path
 * @param results An array of query results
 */
export function rollback(results: any[]) {
  results.forEach((result) => {
    //If a given query result has an error, it means the entry was not inserted
    // so we don't need to delete
    if (result.rollbackInfos == undefined) return;

    console.log("Rolling back ", result.rollbackInfos);

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
