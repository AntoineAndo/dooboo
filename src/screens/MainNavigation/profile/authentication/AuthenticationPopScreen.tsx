import React from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { useAuth } from "../../../../providers/AuthProvider";
import HeaderComponent from "../../../../components/HeaderComponent";
type Props = {
  navigation: any;
};

function AuthenticationPopScreen({ navigation }: Props) {
  const { auth } = useAuth();

  if (auth.user != undefined) {
    navigation.navigate("Profile");
    return;
  }

  return (
    <View style={styles.content}>
      <HeaderComponent title={"Login"} showBackButton={true} />
      <Text>Add new products, contribute to other products, etc...</Text>
      <Button
        title="Login"
        onPress={() => navigation.navigate("Authentication")}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    margin: 10,
  },
  errorMsg: {
    color: "red",
  },
  verificationContainer: {
    marginTop: 20,
  },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
  },
  focusCell: {
    borderColor: "#000",
  },
  errorCell: {
    borderColor: "red",
  },
});

export default AuthenticationPopScreen;
