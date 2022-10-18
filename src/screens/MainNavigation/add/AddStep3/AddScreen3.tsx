import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { DocumentResult, getDocumentAsync } from "expo-document-picker";
import { Image } from "react-native";
import { supabase } from "../../../../lib/supabase";
import HeaderComponent from "../../../../components/HeaderComponent";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "../../../../hooks/translation";
import { Button } from "react-native-paper";
import { IconButton, Checkbox } from "react-native-paper";
import colors from "../../../../config/colors";

type Props = {};

function AddScreen3({}: Props) {
  const [image, setImage] = useState("");

  const pickDocument = async () => {
    let result: DocumentResult = await getDocumentAsync({});
    console.log(result);
    if (result != undefined) {
      //@ts-ignore
      setImage(result.uri);
    }
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
        {image != "" && (
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100 }}
          ></Image>
        )}
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
