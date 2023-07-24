import React from "react";
import { View, StyleSheet, Alert, StatusBar } from "react-native";
import HeaderComponent from "../../../components/HeaderComponent";
import PageComponent from "../../../components/PageComponent";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../providers/AuthProvider";
import Constants from "expo-constants";
import { useAppState } from "../../../providers/AppStateProvider";
import { MenuItem } from "../../../components/MenuItemComponent";
import SeparatorComponent from "../../../components/SeparatorComponent";
import { useTranslation } from "../../../hooks/translation";
import Header2Component from "../../../components/Header2Component";
import colors from "../../../config/colors";
import spacing from "../../../config/spacing";
import ScrollPageWithHeaderComponent from "../../../components/ScrollPageWithHeaderComponent";

type Props = {
  navigation: any;
  route: any;
};

function AccountPrivacyScreen({ navigation, route }: Props) {
  const { auth } = useAuth();
  const { state } = useAppState();
  const { translate } = useTranslation();

  return (
    <ScrollPageWithHeaderComponent
      title={translate("account_privacy")}
      showBackButton={true}
    >
      <View style={styles.content}>
        <View style={styles.menu}>
          {auth.user != undefined}
          {
            <>
              <MenuItem
                title={translate("my_account")}
                icon={"person-outline"}
                onPress={() => navigation.navigate("AccountScreen")}
                accessibilityHint="Navigate to the My Account screen"
                accessibilityLabel={translate("my_account")}
              />
              <SeparatorComponent />
            </>
          }
          <MenuItem
            title={translate("privacy_policy")}
            icon={"shield-checkmark-outline"}
            onPress={() => navigation.navigate("PrivacyPolicyScreen")}
            accessibilityHint="Navigate to the Privacy Policy screen"
            accessibilityLabel={translate("privacy_policy")}
          />
          <SeparatorComponent />
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
    // borderTopRightRadius: 25,
    padding: spacing.s3,
    flex: 1,
  },
  menu: {
    flex: 1,
  },
  itemContainer: {},
});

export default AccountPrivacyScreen;
