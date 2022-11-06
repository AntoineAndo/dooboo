import React, { useEffect } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../providers/AuthProvider";
// import { isValidPhoneNumber } from "react-phone-number-input";

type Props = {
  navigation: any;
};

function ProfileHomeScreen({ navigation }: Props) {
  const { auth, setAuth } = useAuth();

  const logout = async () => {
    console.log("LOGOUT");
    const logoutResult = await supabase.auth.signOut();
    if (logoutResult.error == null) {
      setAuth({});
    }
    console.log(logoutResult);
  };

  return (
    <View>
      {auth.phoneNumber == undefined && (
        <Button
          title="Log in"
          onPress={() => navigation.navigate("Authentication")}
        ></Button>
      )}
      {auth.phoneNumber != undefined && (
        <View>
          <Text>Logged In</Text>
          <Button title="Log out" onPress={logout}></Button>
        </View>
      )}
    </View>
  );
}

export default ProfileHomeScreen;
