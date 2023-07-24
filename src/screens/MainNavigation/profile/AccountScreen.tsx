import React from "react";
import { Pressable, StatusBar, StyleSheet, View } from "react-native";
import spacing from "../../../config/spacing";
import fontSizes from "../../../config/fontSizes";
import { useAuth } from "../../../providers/AuthProvider";
import { useConfig } from "../../../providers/ConfigProvider";
import PhoneInput from "react-phone-number-input/react-native-input";
import commonStyles from "../../../config/stylesheet";
import T from "../../../components/T";
import colors from "../../../config/colors";
import SeparatorComponent from "../../../components/SeparatorComponent";
import { MenuItem } from "../../../components/MenuItemComponent";
import { useTranslation } from "../../../hooks/translation";
import Header2Component from "../../../components/Header2Component";
import ScrollPageWithHeaderComponent from "../../../components/ScrollPageWithHeaderComponent";

type Props = {
  navigation: any;
};

function AccountScreen({ navigation }: Props) {
  const { auth } = useAuth();
  const { config } = useConfig();
  const { translate } = useTranslation();

  if (auth.user == undefined || auth.user.phone == undefined) {
    return navigation.navigate("Authentication");
  }

  const country_code = config.dropdownValues.countries.find(
    (country) => country.id == config.countryId
  ).code;

  return (
    <ScrollPageWithHeaderComponent
      showBackButton={true}
      title={translate("my_account")}
    >
      <View style={styles.content}>
        <View
          style={{
            padding: spacing.s2,
          }}
        >
          <T style={styles.label}>{translate("phone_number")}</T>
          <View>
            <PhoneInput
              country={country_code.toUpperCase()}
              onChange={(v) => {
                return true;
              }}
              placeholder=""
              value={"+" + auth.user.phone}
              style={[
                commonStyles.input,
                {
                  color: colors.lightgrey,
                },
              ]}
              withCountryCallingCode={true}
            />
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
              }}
              style={styles.inputOverlay}
            ></Pressable>
          </View>
          <T>{translate("account_screen_phone_info")}</T>
        </View>

        <View>
          <SeparatorComponent />
          <MenuItem
            title={translate("account_suppression")}
            icon={"warning-outline"}
            onPress={() => navigation.navigate("DeleteAccountScreen")}
          />
        </View>
      </View>
    </ScrollPageWithHeaderComponent>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.primary,
  },
  content: {
    backgroundColor: "white",
    // marginTop: 200,
    // borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: spacing.s3,
    paddingTop: spacing.s3,
    flex: 1,
    justifyContent: "space-between",
  },
  label: {
    fontSize: fontSizes.label,
  },
  inputOverlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
});

export default AccountScreen;
