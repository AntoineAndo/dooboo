import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getDocumentAsync } from "expo-document-picker";
import { Image, Button } from "react-native";
import HeaderComponent from "../../components/HeaderComponent";
import { IconButton } from "react-native-paper";
import { useAppState } from "../../providers/AppStateProvider";
import Form from "../../types/Form";
import { submitForm } from "../../adapters/utils/FormUtils";
import { useAuth } from "../../providers/AuthProvider";
import * as ImageManipulator from "expo-image-manipulator";

type Props = {
  route: any;
  navigation: any;
};

function AddScreen3({ route, navigation }: Props) {
  let initialState: Form = route.params != undefined ? route.params.form : {};
  initialState.errors = {};

  //Hooks initialization
  const [form, setForm] = React.useState<Form>(initialState);
  const [error, setError] = React.useState("");
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

      console.log(result);

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
    if (auth.user == undefined) {
      //TODO redirect to auth page
      return;
    }
    //Show the loading overlay
    app.patchState("isLoading", true);

    //Reduce image size
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        mainImage.uri,
        [{ resize: { width: 500 } }],
        { format: ImageManipulator.SaveFormat.JPEG, compress: 0.7 }
      );

      //Submit the form
      submitForm(form, manipResult, auth.user).then((submitError) => {
        app.patchState("isLoading", false);

        if (submitError) {
          setError("Error submitting your product, please try again later");
        } else {
          navigation.replace("AddStep4");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.page}>
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
        {error != "" && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingBottom: 50,
  },
  header: {
    marginTop: 10,
  },
  contentView: {
    paddingHorizontal: 26,
    flex: 1,
    alignItems: "center",
  },
  error: {
    color: "red",
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
