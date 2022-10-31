import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { DocumentResult, getDocumentAsync } from "expo-document-picker";
import { Image, Button } from "react-native";
import {
  addProduct,
  deleteImage,
  linkProductCategories,
  linkProductImage,
  linkProductStore,
  supabase,
  uploadImage,
  upsertStore,
} from "../../../../lib/supabase";
import HeaderComponent from "../../../../components/HeaderComponent";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "../../../../hooks/translation";
// import { Button } from "react-native-paper";
import { IconButton, Checkbox } from "react-native-paper";
import colors from "../../../../config/colors";
import Product from "../../../../types/product";
import { useAppState } from "../../../../providers/AppStateProvider";

type Props = {
  route: any;
  navigation: any;
};

function AddScreen3({ route, navigation }: Props) {
  let initialState = route.params != undefined ? route.params.form : {};

  //Hooks initialization
  const [form, setForm] = React.useState(initialState);
  const [image, setImage] = useState<any>({});
  const app = useAppState();

  const pickDocument = async () => {
    let result: DocumentResult = await getDocumentAsync({});
    if (result != undefined) {
      //@ts-ignore
      setImage(result);
    }
  };

  const onSubmit = async () => {
    app.patchState("isLoading", true);

    //Upload image
    let imageInsertResult = await uploadImage(image.file);
    if (imageInsertResult.error || imageInsertResult.data == null) {
      app.patchState("isLoading", false);
      return;
    }

    //Insert product record
    let productInsertResult = await addProduct(form);

    //If there is an error
    if (productInsertResult.error != null || productInsertResult.data == null) {
      //Delete image previously inserted
      await deleteImage(imageInsertResult.data.path);
      app.patchState("isLoading", false);
      return;
    }
    const insertedProduct: Product = productInsertResult.data[0];

    //Upsert store record
    let storeSelectResult = await upsertStore(form.store);
    console.log(storeSelectResult);
    if (
      storeSelectResult.status == 201 ||
      storeSelectResult?.error?.code == "42501"
    ) {
    }

    //Link the product and the store
    const resultInsertProductStore = await linkProductStore(
      insertedProduct.id,
      form.store.id
    );

    const categoriesToInsert = form.categories.map((category: any) => {
      return {
        fk_product_id: insertedProduct.id,
        fk_category_id: category.id,
      };
    });
    const resultInsertProductCategories = await linkProductCategories(
      categoriesToInsert
    );
    if (resultInsertProductCategories.status != 201) {
      return;
    }

    //Link the product and the image
    const resultInsertProductImage = await linkProductImage(
      insertedProduct.id,
      imageInsertResult.data.path
    );
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
        {image.uri == undefined && (
          <IconButton
            icon="image-multiple-outline"
            iconColor="white"
            containerColor="grey"
            size={100}
            style={styles.imageContainer}
            onPress={() => pickDocument()}
          />
        )}
        {image.uri != undefined && (
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => pickDocument()}
          >
            <Image source={{ uri: image.uri }} style={styles.image}></Image>
          </TouchableOpacity>
        )}
        <Button
          title="Next step"
          disabled={image.uri == undefined}
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
