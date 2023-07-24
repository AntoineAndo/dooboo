import React, { useRef } from "react";
import { View, StyleSheet, Alert, StatusBar } from "react-native";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../providers/AuthProvider";
import { MenuItem } from "../../../components/MenuItemComponent";
import SeparatorComponent from "../../../components/SeparatorComponent";
import { useTranslation } from "../../../hooks/translation";
import spacing from "../../../config/spacing";
import colors from "../../../config/colors";
import { Animated } from "react-native";
import ScrollPageWithHeaderComponent from "../../../components/ScrollPageWithHeaderComponent";

type Props = {
  navigation: any;
  route: any;
};

function ProfileHomeScreen({ navigation, route }: Props) {
  const { auth, setAuth } = useAuth();
  const { translate } = useTranslation();

  const logout = async () => {
    Alert.alert("Log-out confirmation", "Are you sure you want to log-out ?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          const logoutResult = await supabase.auth.signOut();
          if (logoutResult.error == null) {
            setAuth({});
          }
        },
      },
    ]);
  };

  const scrollOffset = useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollOffset.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 100],
    extrapolate: "clamp",
  });

  return (
    <ScrollPageWithHeaderComponent
      title={"Dooboo"}
      showBackButton={false}
      showLogo={true}
    >
      <View style={styles.content}>
        <View style={styles.menu}>
          {auth.session == undefined ? (
            <>
              <MenuItem
                title={translate("login")}
                onPress={() => navigation.navigate("Authentication")}
                icon={"person-circle-outline"}
              />
              <SeparatorComponent />
              <MenuItem
                title={translate("settings")}
                icon={"settings-outline"}
                onPress={() => navigation.navigate("SettingsScreen")}
              />
            </>
          ) : (
            <>
              <MenuItem
                title={translate("settings")}
                icon={"settings-outline"}
                onPress={() => navigation.navigate("SettingsScreen")}
              />

              <SeparatorComponent />
              <MenuItem
                title={translate("account_privacy")}
                icon={"shield-checkmark-outline"}
                onPress={() => navigation.navigate("AccountPrivacyScreen")}
              />
              <SeparatorComponent />
              <MenuItem
                title={translate("logout")}
                onPress={logout}
                icon={"exit-outline"}
              />
            </>
          )}
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
    borderTopLeftRadius: 25,
    // borderTopRightRadius: 25,
    flex: 1,
    padding: spacing.s3,
  },
  menu: {
    flex: 1,
  },
  itemContainer: {},
});

export default ProfileHomeScreen;
