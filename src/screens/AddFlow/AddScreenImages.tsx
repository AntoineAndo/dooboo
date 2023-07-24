import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { getDocumentAsync } from "expo-document-picker";
import { Image } from "react-native";
import HeaderComponent from "../../components/HeaderComponent";
import { IconButton } from "react-native-paper";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useAppState } from "../../providers/AppStateProvider";
import Form from "../../types/Form";
import { submitForm, submitContribution } from "../../utils/FormUtils";
import { useAuth } from "../../providers/AuthProvider";
import * as ImageManipulator from "expo-image-manipulator";
import ButtonComponent from "../../components/ButtonComponent";
import { Log } from "../../utils/Log";
import PageComponent from "../../components/PageComponent";
import NetworkViewComponent from "../../components/NetworkViewComponent";
import OfflineCard from "../../components/OfflineCard";
import T from "../../components/T";
import commonStyles from "../../config/stylesheet";
import SeparatorComponent from "../../components/SeparatorComponent";
import spacing from "../../config/spacing";
import { useTranslation } from "../../hooks/translation";

type Props = {
  route: any;
  navigation: any;
};

function AddScreenImages({ route, navigation }: Props) {
  let initialState: Form = route.params != undefined ? route.params.form : {};
  initialState.errors = {};

  //Hooks initialization
  const [form, setForm] = React.useState<Form>(initialState);
  const [error, setError] = React.useState("");
  const [mainImage, setMainImage] = useState<any>();
  const [secondaryImage, setSecondaryImage] = useState<any>();
  const app = useAppState();
  const { translate } = useTranslation();
  const { auth } = useAuth();

  //If it's a new product then mandatory image
  // else if the product already exists then not mandatory
  const isMainImageMandatory = form.existingProduct?.id == undefined;

  const pickDocument = async (imageType: "mainImage" | "secondaryImage") => {
    console.log("image pick");
    let result = await getDocumentAsync({
      type: ["image/png", "image/jpeg"],
      multiple: false,
    });

    console.log(result);

    if (result == null) return;

    const imgAsset = result;

    //@ts-ignore
    if (imgAsset.mimeType != "image/png" && imgAsset.mimeType != "image/jpeg") {
      let errors: any = {};

      errors[imageType] = "Only .jpg/jpeg and .png formats are supported";

      patchForm("errors", errors);
      if (imageType == "mainImage") setMainImage(undefined);
      else if (imageType == "secondaryImage") setSecondaryImage(undefined);

      return;
    } else {
      patchForm("errors", {});

      //convert to base64

      if (imageType == "mainImage") setMainImage(imgAsset);
      else if (imageType == "secondaryImage") setSecondaryImage(imgAsset);
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

    //Prevent the user from pressing Back while the product is being submitted
    const preventBack = navigation.addListener("beforeRemove", (e: any) => {
      e.preventDefault();
    });

    //Reduce image size and convert to base64
    try {
      let mainImageManipResult, secondaryImageManipResult;

      if (mainImage != undefined) {
        mainImageManipResult = await ImageManipulator.manipulateAsync(
          mainImage.uri,
          [{ resize: { width: 500 } }],
          {
            format: ImageManipulator.SaveFormat.JPEG,
            compress: 0.7,
            base64: true,
          }
        );
      }

      if (secondaryImage != undefined) {
        secondaryImageManipResult = await ImageManipulator.manipulateAsync(
          secondaryImage.uri,
          [{ resize: { width: 500 } }],
          {
            format: ImageManipulator.SaveFormat.JPEG,
            compress: 0.7,
            base64: true,
          }
        );
      }

      let submit;

      //If the product does not already exists, then it's a full product submission
      //Else it is just a contribution submission
      if (form.existingProduct?.id == undefined) {
        submit = submitForm(
          form,
          [
            {
              image: mainImageManipResult,
              type: "primary",
            },
            {
              image: secondaryImageManipResult,
              type: "secondary",
            },
          ].filter((image) => image.image != undefined),
          auth.user
        );
      } else {
        submit = submitContribution({
          store: form.store,
          product: form.existingProduct,
          images: [
            {
              image: mainImageManipResult,
              type: "primary",
            },
            {
              image: secondaryImageManipResult,
              type: "secondary",
            },
          ].filter((image) => image.image != undefined),
          user: auth.user,
        });
      }

      submit
        .then((submitError) => {
          Log(form);
          if (submitError) {
            Log(submitError, "error");
            console.error("submitError", submitError);
            setError("Error submitting your product, please try again later");
          } else {
            navigation.navigate("SuccessScreen", {
              finalDestination: {
                name: "NavbarNavigator",
                buttonLabel: "Go back to the homepage",
              },
              // product: product,
              pageConfiguration: {
                showConfetti: true,
              },
            });
          }
        })
        .finally(() => {
          app.patchState("isLoading", false);
          preventBack();
        });
    } catch (error) {
      Log(error, "error");
    }
  };

  return (
    <PageComponent
      withNavbar={route.params.type == "contribution" ? true : false}
    >
      <ScrollView
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
        keyboardShouldPersistTaps={"always"}
      >
        <View style={styles.header}>
          <HeaderComponent
            title="Add a product"
            showBackButton={false}
            subtitle="Product pictures"
          />
        </View>
        <NetworkViewComponent
          style={styles.contentView}
          offlineComponent={<OfflineCard />}
        >
          {/* Main image */}
          <View style={styles.imageSection}>
            {isMainImageMandatory ? (
              <T style={styles.label}>{translate("main_picture_label")}</T>
            ) : (
              <T style={styles.label}>
                {translate("main_picture_label")} ({translate("optional")})
              </T>
            )}
            <View style={styles.listItem}>
              <T style={commonStyles.bullet}>•</T>
              <T>{translate("main_picture_tip_1")}</T>
            </View>
            <View style={styles.listItem}>
              <T style={commonStyles.bullet}>•</T>
              <T>{translate("main_picture_tip_2")}</T>
            </View>
            <View style={styles.listItem}>
              <T style={commonStyles.bullet}>•</T>
              <T>{translate("main_picture_tip_3")}</T>
            </View>
            {mainImage == undefined && (
              <IconButton
                icon="image-multiple-outline"
                color="white"
                size={100}
                style={styles.imageContainer}
                onPress={() => pickDocument("mainImage")}
              />
            )}
            {mainImage != undefined && (
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={() => pickDocument("mainImage")}
              >
                <Image
                  source={{ uri: mainImage.uri }}
                  style={styles.image}
                ></Image>
                <Pressable
                  style={styles.deleteBadge}
                  onPress={(e) => {
                    setMainImage(undefined);
                  }}
                >
                  <IonIcons name="close" color="red" size={20} />
                </Pressable>
              </TouchableOpacity>
            )}
            {form.errors["mainImage"] && (
              <T style={styles.error}>{form.errors["mainImage"]}</T>
            )}
            {error != "" && <T style={styles.error}>{error}</T>}
          </View>

          <SeparatorComponent style={{ marginVertical: 20 }} />

          {/* Secondary image */}
          <View style={styles.imageSection}>
            <T style={styles.label}>
              {translate("secondary_picture_label")} ({translate("optional")})
            </T>
            <View style={styles.listItem}>
              <T style={commonStyles.bullet}>•</T>
              <T>{translate("secondary_picture_tip_1")}</T>
            </View>
            {secondaryImage == undefined && (
              <IconButton
                icon="image-multiple-outline"
                color="white"
                size={100}
                style={styles.imageContainer}
                onPress={() => pickDocument("secondaryImage")}
              />
            )}
            {secondaryImage != undefined && (
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={() => pickDocument("secondaryImage")}
              >
                <Image
                  source={{ uri: secondaryImage.uri }}
                  style={styles.image}
                ></Image>
                <Pressable
                  style={styles.deleteBadge}
                  onPress={(e) => {
                    setSecondaryImage(undefined);
                  }}
                >
                  <IonIcons name="close" color="red" size={20} />
                </Pressable>
              </TouchableOpacity>
            )}
            {form.errors["secondaryImage"] && (
              <T style={styles.error}>{form.errors["secondaryImage"]}</T>
            )}
            {error != "" && <T style={styles.error}>{error}</T>}
          </View>
        </NetworkViewComponent>
      </ScrollView>
      <View style={styles.footer}>
        <ButtonComponent onPress={() => navigation.goBack()}>
          {translate("back")}
        </ButtonComponent>
        <ButtonComponent
          disabled={isMainImageMandatory && mainImage == undefined}
          onPress={() => {
            onSubmit();
          }}
        >
          {translate("submit")}
        </ButtonComponent>
      </View>
    </PageComponent>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    marginTop: 10,
  },
  contentView: {
    paddingHorizontal: 26,
    flex: 1,
    alignItems: "center",
    marginBottom: 80,
  },
  error: {
    color: "red",
  },
  imageSection: {
    display: "flex",
    justifyContent: "center",
  },
  label: {
    fontFamily: "Milliard-Bold",
    marginVertical: spacing.s1,
  },
  listItem: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: spacing.s1,
  },
  imageContainer: {
    marginTop: spacing.s3,
    borderRadius: 10,
    height: 200,
    width: 200,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "lightgrey",
    alignSelf: "center",
    position: "relative",
  },
  deleteBadge: {
    position: "absolute",
    top: spacing.s2,
    right: spacing.s2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    ...commonStyles.elevation2,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    height: 60,
    zIndex: 999,
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#eeeeee99",
  },
});

export default AddScreenImages;
