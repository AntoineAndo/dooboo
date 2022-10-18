import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { DocumentResult, getDocumentAsync } from "expo-document-picker";
import { Image } from "react-native";
import { supabase } from "../../../../lib/supabase";
import HeaderComponent from "../../../../components/HeaderComponent";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "../../../../hooks/translation";
import { Button, Checkbox } from "react-native-paper";
import { IconButton } from "react-native-paper";
import colors from "../../../../config/colors";

type Props = {
  route: any;
  navigation: any;
};

function AddScreen2({ route, navigation }: Props) {
  const [image, setImage] = useState("");
  const [formState, setFormState] = React.useState(route.params.form);
  console.log(formState);

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
        {/* <Checkbox
        ></Checkbox> */}
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
  image: {
    resizeMode: "contain",
    fontSize: 30,
    margin: 5,
    height: 30,
    width: 30,
  },
});

export default AddScreen2;
