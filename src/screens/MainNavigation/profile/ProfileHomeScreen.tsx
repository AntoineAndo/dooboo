import React, { useEffect } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import HeaderComponent from "../../../components/HeaderComponent";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../providers/AuthProvider";
// import { isValidPhoneNumber } from "react-phone-number-input";

type Props = {
  navigation: any;
  route: any;
};

const screenHeight = Dimensions.get("screen").height;
const windowHeight = Dimensions.get("window").height;
const statusBarHeight =
  StatusBar.currentHeight != undefined ? StatusBar.currentHeight : 0;
const navbarHeight = screenHeight - windowHeight + statusBarHeight;

function ProfileHomeScreen({ navigation, route }: Props) {
  const { auth, setAuth } = useAuth();

  const logout = async () => {
    const logoutResult = await supabase.auth.signOut();
    if (logoutResult.error == null) {
      setAuth({});
    }
  };

  return (
    <View style={styles.page}>
      <HeaderComponent title={"DOOBOO"} showBackButton={false} />
      <View style={styles.menu}>
        {auth.session == undefined && (
          <Button
            title="Log in"
            onPress={() => navigation.navigate("Authentication")}
          ></Button>
        )}
        {auth.session != undefined && (
          <Button
            title="My contributions"
            onPress={() => navigation.navigate("My Contributions")}
          ></Button>
        )}
        <Button
          title="Settings"
          onPress={() => navigation.navigate("SettingsScreen")}
        ></Button>
        {auth.session != undefined && (
          <Button title="Log out" onPress={logout}></Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    height: Dimensions.get("window").height - navbarHeight,
    marginTop: -5,
  },
  menu: {
    flex: 1,
    justifyContent: "space-evenly",
  },
});

export default ProfileHomeScreen;
