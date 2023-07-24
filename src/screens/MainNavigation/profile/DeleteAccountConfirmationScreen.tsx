import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import HeaderComponent from "../../../components/HeaderComponent";
import PageComponent from "../../../components/PageComponent";
import spacing from "../../../config/spacing";
import { useAuth } from "../../../providers/AuthProvider";
import T from "../../../components/T";
import ButtonComponent from "../../../components/ButtonComponent";
import { deleteUser, deleteUserImages, supabase } from "../../../lib/supabase";
import { useAppState } from "../../../providers/AppStateProvider";
import { useTranslation } from "../../../hooks/translation";

type Props = {
  navigation: any;
  route: any;
};

function DeleteAccountConfirmationScreen({ navigation, route }: Props) {
  const { auth, setAuth } = useAuth();
  const { patchState } = useAppState();
  const { translate } = useTranslation();

  const suppressionForm: {
    photos: boolean;
    profile: boolean;
  } = route.params.suppressionForm;

  if (auth.user == undefined || auth.user.phone == undefined) {
    return navigation.navigate("Authentication");
  }

  const submit = async () => {
    patchState("isLoading", true);

    if (suppressionForm.photos) {
      console.log("delete photos");
      await deleteUserImages({ userId: auth?.user?.id });
    }

    console.log("delete user profile");

    deleteUser({ userId: auth?.user?.id })
      .then((result) => {
        console.log("Profile suppressin confirmed");
        console.log("Now logging out");
        supabase.auth.signOut().then(() => {
          setAuth({});
        });
        navigation.navigate("SuccessScreen", {
          finalDestination: {
            name: "NavbarNavigation",
            buttonLabel: "Go back to the home page",
          },
          pageConfiguration: {
            confirmationMessage: "Account suppression confirmed",
            showConfetti: false,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        patchState("isLoading", false);
      });
  };

  return (
    <PageComponent style={styles.page} withNavbar={true}>
      <HeaderComponent title="Account suppression" showBackButton={true} />
      <View style={styles.view}>
        <View style={styles.content}>
          <T style={styles.text}>{translate("delete_account_user_profile")}</T>
          <T style={styles.text}>
            {translate("delete_account_confirmation_info_1")}
          </T>
          <T style={styles.text}>
            {translate("delete_account_confirmation_info_2")}
          </T>
        </View>
        <View style={styles.footer}>
          <ButtonComponent
            onLongPress={() => {
              submit();
            }}
            type="warning"
          >
            {translate("hold_confirm_suppression")}
          </ButtonComponent>
        </View>
      </View>
    </PageComponent>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: StatusBar.currentHeight,
  },
  view: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    paddingHorizontal: spacing.s3,
  },
  text: {
    textAlign: "justify",
    marginVertical: spacing.s1,
    lineHeight: 22,
  },
  icon: {
    alignSelf: "center",
    marginVertical: spacing.s3,
  },
  footer: {
    padding: spacing.s3,
  },
});

export default DeleteAccountConfirmationScreen;
