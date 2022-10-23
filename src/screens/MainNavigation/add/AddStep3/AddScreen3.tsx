import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { DocumentResult, getDocumentAsync } from "expo-document-picker";
import { Image } from "react-native";
import {
  addProduct,
  deleteImage,
  linkProductImage,
  linkProductStore,
  supabase,
  uploadImage,
  upsertStore,
} from "../../../../lib/supabase";
import HeaderComponent from "../../../../components/HeaderComponent";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "../../../../hooks/translation";
import { Button } from "react-native-paper";
import { IconButton, Checkbox } from "react-native-paper";
import colors from "../../../../config/colors";
import Product from "../../../../types/product";

type Props = {
  route: any;
  navigation: any;
};

function AddScreen3({ route, navigation }: Props) {
  let initialState = route.params != undefined ? route.params.form : {};

  const [form, setForm] = React.useState(initialState);
  const [image, setImage] = useState<any>({});

  const pickDocument = async () => {
    let result: DocumentResult = await getDocumentAsync({});
    console.log(result);
    if (result != undefined) {
      //@ts-ignore
      setImage(result);
    }
  };

  const onSubmit = async () => {
    //Upload image
    let imageInsertResult = await uploadImage(image.file);
    if (imageInsertResult.error || imageInsertResult.data == null) {
      return;
    }

    //Insert product record
    let productInsertResult = await addProduct(form);

    //If there is an error
    if (productInsertResult.error != null || productInsertResult.data == null) {
      //Delete image previously inserted
      await deleteImage(imageInsertResult.data.path);
      return;
    }
    const insertedProduct: Product = productInsertResult.data[0];

    //Upsert store record
    let storeSelectResult = await upsertStore(form.store);
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

    //Link the product and the image
    const resultInsertProductImage = await linkProductImage(
      insertedProduct.id,
      imageInsertResult.data.path
    );
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
        <IconButton
          icon="image-multiple-outline"
          iconColor="white"
          containerColor="grey"
          size={100}
          style={{
            height: 200,
            width: 200,
          }}
          onPress={() => pickDocument()}
        />
        {image.uri == undefined && (
          <Image
            source={{ uri: image.uri }}
            style={{ width: 100, height: 100 }}
          ></Image>
        )}
        <Button
          mode="contained"
          disabled={image.uri == undefined}
          onPress={() => {
            onSubmit();
          }}
        >
          Next step
        </Button>
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
  image: {
    resizeMode: "contain",
    fontSize: 30,
    margin: 5,
    height: 30,
    width: 30,
  },
});

export default AddScreen3;
