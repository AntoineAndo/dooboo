import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { DocumentResult, getDocumentAsync } from "expo-document-picker";
import { Image } from "react-native";
import { supabase } from "../../../lib/supabase";
import HeaderComponent from "../../../components/HeaderComponent";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "../../../hooks/translation";

type Props = {};

function AddScreen({}: Props) {
  const [image, setImage] = useState("");
  const translation = useTranslation();

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
          subtitle="Product description"
        />
      </View>

      <View style={styles.contentView}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Product name</Text>
          <Text style={styles.inputSubLabel}>
            Please include the brand name
          </Text>

          <View style={styles.searchBar}>
            <IonIcons name={"search-outline"} style={styles.image} size={40} />
            <TextInput
              style={styles.input}
              placeholder={translation.t("search_placeholder")}
              placeholderTextColor={"#888"}
              returnKeyType="search"
            ></TextInput>
          </View>
        </View>

        <Text style={styles.inputLabel}>Product category</Text>
        <Text style={styles.inputSubLabel}>
          You can select up to 3 categories
        </Text>
        {/* <TouchableOpacity
        onPress={() => pickDocument()}
        style={{ height: 50, width: 50, borderWidth: 1 }}
      >
        <Text>Test</Text>
      </TouchableOpacity>
      {image != "" && (
        <Image
          source={{ uri: image }}
          style={{ width: 100, height: 100 }}
        ></Image> */}
        {/* )} */}
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

export default AddScreen;
