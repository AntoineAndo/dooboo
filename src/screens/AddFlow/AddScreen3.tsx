import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getDocumentAsync } from "expo-document-picker";
import { Image, Button } from "react-native";
import {
  addProduct,
  linkProductCategories,
  linkProductImage,
  linkProductStore,
  uploadImage,
  upsertStore,
} from "../../lib/supabase";
import HeaderComponent from "../../components/HeaderComponent";
import { IconButton } from "react-native-paper";
import Product from "../../types/product";
import { useAppState } from "../../providers/AppStateProvider";
import Form from "../../types/Form";
import { rollback } from "../../adapters/utils/FormUtils";
import { useAuth } from "../../providers/AuthProvider";

type Props = {
  route: any;
  navigation: any;
};

function AddScreen3({ route, navigation }: Props) {
  let initialState: Form = route.params != undefined ? route.params.form : {};
  initialState.errors = {};

  //Hooks initialization
  const [form, setForm] = React.useState(initialState);
  const [mainImage, setMainImage] = useState<any>({});
  const app = useAppState();
  const { auth } = useAuth();

  const pickDocument = async () => {
    let result = await getDocumentAsync({});
    if (result == undefined) return;

    //@ts-ignore
    if (result.mimeType != "image/png" && result.mimeType != "image/jpeg") {
      patchForm("errors", {
        mainImage: "Only .jpg/jpeg and .png formats are supported",
      });
      setMainImage({});
      return;
    } else {
      patchForm("errors", {});

      setMainImage(result);
    }
  };

  //Method used to update the form/state value
  const patchForm = (key: string, value: any) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const onSubmit = async () => {
    if (form.store == undefined) return;

    if (auth.user == undefined) {
      //TODO redirect to auth page
      return;
    }

    //Show the loading overlay
    app.patchState("isLoading", true);

    const [imageInsertResult, productInsertResult, storeUpsertResult] =
      await Promise.all([
        uploadImage(mainImage),
        addProduct(form, auth.user),
        upsertStore(form.store),
      ]);

    console.log([imageInsertResult, productInsertResult, storeUpsertResult]);

    //If at least one result is an error
    // then rollback all
    if (
      imageInsertResult.data == null ||
      productInsertResult.data == null ||
      storeUpsertResult.data == null
    ) {
      rollback([imageInsertResult, productInsertResult, storeUpsertResult]);

      app.patchState("isLoading", false);
      return;
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
      linkProductStore(insertedProduct.id, form.store.id, auth.user),
      linkProductCategories(categoriesToInsert),
      linkProductImage(insertedProduct.id, imageInsertResult.data.path),
    ]);

    console.log([
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

      app.patchState("isLoading", false);

      return;
    }

    app.patchState("isLoading", false);

    navigation.replace("AddStep4");
  };

  return (
    <View>
      <View style={styles.header}>
        <HeaderComponent
          title="Add a product"
          showBackButton={false}
          subtitle="Product pictures"
        />
      </View>
      <View style={styles.contentView}>
        {mainImage.uri == undefined && (
          <IconButton
            icon="image-multiple-outline"
            color="white"
            // containerColor="grey"
            size={100}
            style={styles.imageContainer}
            onPress={() => pickDocument()}
          />
        )}
        {mainImage.uri != undefined && (
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => pickDocument()}
          >
            <Image source={{ uri: mainImage.uri }} style={styles.image}></Image>
          </TouchableOpacity>
        )}
        {form.errors["mainImage"] && (
          <Text style={styles.error}>{form.errors["mainImage"]}</Text>
        )}
        <Button
          title="Next step"
          disabled={mainImage.uri == undefined}
          onPress={() => {
            onSubmit();
          }}
        ></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
  },
  contentView: {
    paddingHorizontal: 26,
  },
  error: {
    color: "red",
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontWeight: "bold",
    fontSize: 22,
  },
  inputSubLabel: {
    fontSize: 18,
  },
  input: {
    //@ts-ignore
    outlineStyle: "none",
    marginLeft: 10,
    fontSize: 20,
  },
  searchBar: {
    marginVertical: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
    borderRadius: 100,
    padding: 3,
    flexDirection: "row",
  },
  imageContainer: {
    borderRadius: 10,
    height: 200,
    width: 200,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default AddScreen3;
