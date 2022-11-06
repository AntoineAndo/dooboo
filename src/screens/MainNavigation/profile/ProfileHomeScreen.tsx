import React, { useEffect } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { useAuth } from "../../../providers/AuthProvider";
// import { isValidPhoneNumber } from "react-phone-number-input";

type Props = {
  navigation: any;
};

function ProfileHomeScreen({ navigation }: Props) {
  const { auth } = useAuth();

  return (
    <View>
      {auth.phoneNumber == undefined && (
        <Button
          title="Log in"
          onPress={() => navigation.navigate("Authentication")}
        ></Button>
      )}
      {auth.phoneNumber != undefined && <Text>Logged in</Text>}
    </View>
  );
}

export default ProfileHomeScreen;
