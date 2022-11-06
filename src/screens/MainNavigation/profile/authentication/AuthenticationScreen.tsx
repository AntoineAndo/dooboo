import React from "react";
import { Text, View, Button, TextInput, StyleSheet } from "react-native";
import { supabase } from "../../../../lib/supabase";
import PhoneInput from "react-phone-number-input/react-native-input";
import { useConfig } from "../../../../providers/ConfigProvider";
import SecureStorage from "../../../../lib/SecureStorage";
import { useAuth } from "../../../../providers/AuthProvider";
// import { isValidPhoneNumber } from "react-phone-number-input";
type Props = {
  navigation: any;
};

function AuthenticationScreen({ navigation }: Props) {
  const [phoneNumber, setPhoneNumber] = React.useState<any>("");
  const [verificationCode, setVerificationCode] = React.useState("");
  const [smsSent, setSmsSent] = React.useState<boolean>(false);
  const { auth, setAuth } = useAuth();

  //SEND SMS
  const sendSms = async () => {
    // if (!isValidPhoneNumber(phoneNumber)) return;
    setSmsSent(true);
    let { data, error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });

    console.log(data);
    console.log(error);

    if (error == null) {
      console.log(data);
    }
  };

  //Verify Code
  const verifyCode = async () => {
    console.log(verificationCode);
    if (verificationCode.length != 6) {
      return;
    }

    let { data, error } = await supabase.auth.verifyOtp({
      type: "sms",
      phone: phoneNumber,
      token: verificationCode,
    });

    if (error != null || data == null) {
      console.error(error);
      return;
    }

    if (data.session != undefined) {
      console.log(data);
      setAuth({
        phoneNumber: phoneNumber,
        accessToken: data.session.access_token,
      });
      navigation.navigate("ProfileHome");
    }
  };

  return (
    <View>
      <Text>Profile</Text>
      <PhoneInput
        country="KR"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={setPhoneNumber}
        style={styles.input}
      />
      <Button
        title="Phone Login"
        onPress={() => {
          sendSms();
        }}
        disabled={smsSent}
      ></Button>

      {smsSent && (
        <>
          <TextInput
            style={styles.input}
            value={verificationCode}
            onChangeText={setVerificationCode}
          ></TextInput>
          <Button
            title="Verify"
            onPress={() => {
              verifyCode();
            }}
          ></Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    margin: 10,
  },
});

export default AuthenticationScreen;
