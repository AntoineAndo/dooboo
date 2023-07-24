import React from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import HeaderComponent from "../../../components/HeaderComponent";
import PageComponent from "../../../components/PageComponent";
import spacing from "../../../config/spacing";
import fontSizes from "../../../config/fontSizes";
import { useAuth } from "../../../providers/AuthProvider";
import { useConfig } from "../../../providers/ConfigProvider";
import PhoneInput from "react-phone-number-input/react-native-input";
import commonStyles from "../../../config/stylesheet";
import T from "../../../components/T";
import colors from "../../../config/colors";
import CheckboxComponent from "../../../components/CheckboxComponent";
import ButtonComponent from "../../../components/ButtonComponent";
import { useTranslation } from "../../../hooks/translation";

type Props = {
  navigation: any;
};

function DeleteAccountScreen({ navigation }: Props) {
  const { auth } = useAuth();
  const { translate } = useTranslation();
  const [suppressionForm, setSuppressionForm] = React.useState<any>({
    profile: true,
    photos: false,
  });

  if (auth.user == undefined || auth.user.phone == undefined) {
    return navigation.navigate("Authentication");
  }

  const patchForm = (key: string, value: any) => {
    let form = { ...suppressionForm };
    form[key] = value;
    setSuppressionForm(form);
  };

  return (
    <PageComponent style={styles.page} withNavbar={true}>
      <HeaderComponent
        title={translate("account_suppression")}
        showBackButton={true}
      />
      <View style={styles.view}>
        <T style={styles.text}>{translate("delete_account_warning")}</T>

        <View style={styles.inputGroup}>
          <View style={styles.checkboxLabelGroup}>
            <CheckboxComponent
              checked={true}
              onPress={() => {
                null;
              }}
              style={{ opacity: 0.5 }}
            />
            <T style={[commonStyles.label, styles.label]}>
              {translate("delete_account_user_profile")}
            </T>
          </View>

          <T style={styles.text}>
            {translate("delete_acount_user_profile_info_1")}
          </T>
          <T style={styles.text}>
            {translate("delete_acount_user_profile_info_2")}
          </T>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.checkboxLabelGroup}>
            <CheckboxComponent
              checked={suppressionForm.photos == true}
              onPress={() => {
                patchForm("photos", !suppressionForm.photos);
              }}
            />
            <Pressable
              onPress={() => {
                patchForm("photos", !suppressionForm.photos);
              }}
            >
              <T style={[commonStyles.label, styles.label]}>
                {translate("delete_account_photos")}
              </T>
            </Pressable>
          </View>

          <T style={styles.text}>{translate("delete_acount_photos_info_1")}</T>
        </View>
      </View>
      <View style={styles.footer}>
        <ButtonComponent
          onPress={() =>
            navigation.navigate("DeleteAccountConfirmationScreen", {
              suppressionForm,
            })
          }
          type="secondary"
        >
          {translate("next")}
        </ButtonComponent>
      </View>
    </PageComponent>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: StatusBar.currentHeight,
  },
  view: {
    height: 500,
    width: "100%",
    paddingHorizontal: spacing.s3,
  },
  text: {
    textAlign: "justify",
    marginVertical: spacing.s1,
    lineHeight: 22,
  },
  inputGroup: {
    marginVertical: spacing.s2,
  },
  checkboxLabelGroup: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginLeft: spacing.s1,
    fontFamily: "Milliard-Medium",
  },
  footer: {
    padding: spacing.s3,
  },
});

export default DeleteAccountScreen;
