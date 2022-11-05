import React, { useEffect } from "react";
import { Text, View, Button, TextInput, StyleSheet } from "react-native";
import { supabase } from "../../../lib/supabase";
import PhoneInput from "react-phone-number-input/react-native-input";
import SecureStorage from "../../../lib/SecureStorage";
// import { isValidPhoneNumber } from "react-phone-number-input";

type Props = {
  navigation: any;
};

function ProfileHomeScreen({ navigation }: Props) {
  useEffect(() => {
    SecureStorage.getValueFor("session").then((value: string | null) => {
      if (value != null) {
        console.log(JSON.parse(value));
      }
    });
  }, []);

  return (
    <View>
      {/* {config.session == undefined && ( */}
      <Button
        title="Log in"
        onPress={() => navigation.navigate("Authentication")}
      ></Button>
      {/* )} */}
      {/* {config.session != undefined && <Text>Logged in</Text>} */}
    </View>
  );
}

export default ProfileHomeScreen;
