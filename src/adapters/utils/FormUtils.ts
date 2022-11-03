import { deleteByTableAndId, deleteImage } from "../../lib/supabase";

/**
 * @description Delete DB entries based on ID or path
 * @param results An array of query results
 */
export function rollback(results: any[]) {
  results.forEach((result) => {
    //If a given query result has an error, it means the entry was not inserted
    // so we don't need to delete
    if (result.error != null) return;

    //File rollback
    if (result.rollbackInfos.type == "file") {
      deleteImage(result.rollback.path);
      return;
    }

    //Row rollback
    if (result.rollbackInfos.type == "row") {
      deleteByTableAndId(result.rollbackInfos.table, result.rollbackInfos.id);
      return;
    }
  });

  //ROLLBACK
  //If at last one of the three inserts failed
  // the ones who did not failed are deleted
  // if (
  //     imageInsertResult.error != null ||
  //     imageInsertResult.data == null ||
  //     productInsertResult.error != null ||
  //     productInsertResult.data == null ||
  //     storeUpsertResult.error != null
  //   ) {
  //     const errors = [];
  //     if (imageInsertResult.error == null) {
  //       //Delete image
  //       if (imageInsertResult.data?.path != undefined)
  //         deleteImage(imageInsertResult.data?.path);
  //     } else {
  //       errors.push(imageInsertResult.error);
  //     }
  //     if (productInsertResult.error == null) {
  //       //Delete product record
  //       if (productInsertResult.data != null)
  //         deleteByTableAndId("product", productInsertResult.data[0].id);
  //     } else {
  //       errors.push(productInsertResult.error);
  //     }
  //     if (storeUpsertResult.error == null) {
  //       //Store upsert not rolled back because it is still useful
  //       // and allegedly clean data coming from an external source
  //       //deleteByTableAndId("store", storeUpsertResult.data[0].id);
  //     } else {
  //       errors.push(storeUpsertResult.error);
  //     }
  //     //Store errors
  //     patchForm("errors", {
  //       form: errors,
  //     });

  //     //Remove loading screen
  //     app.patchState("isLoading", false);

  //     return;
  //   }
}
