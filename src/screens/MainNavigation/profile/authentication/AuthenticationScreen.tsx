import React from "react";
import { Text, View, Button, TextInput, StyleSheet } from "react-native";
import { supabase } from "../../../../lib/supabase";
import PhoneInput, {
  Country,
} from "react-phone-number-input/react-native-input";
import { useAuth } from "../../../../providers/AuthProvider";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useTimer } from "react-timer-hook";
import HeaderComponent from "../../../../components/HeaderComponent";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
type Props = {
  navigation: any;
};

function AuthenticationScreen({ navigation }: Props) {
  const [countryCode, setCountryCode] = React.useState<Country>("KR");
  const [phoneNumber, setPhoneNumber] = React.useState<any>("");
  const [verificationCode, setVerificationCode] = React.useState("");
  const [smsSent, setSmsSent] = React.useState<boolean>(false);
  const { auth, setAuth } = useAuth();

  const timerDuration = 10;

  const time = new Date();
  time.setSeconds(time.getSeconds() + timerDuration);

  const { seconds, isRunning, start, restart } = useTimer({
    expiryTimestamp: time,
    autoStart: false,
    onExpire: () => {
      let time = new Date();
      time.setSeconds(time.getSeconds() + timerDuration);
      restart(time, false);
    },
  });

  //SEND SMS
  const sendSms = async () => {
    if (!isValidPhoneNumber(phoneNumber)) return;

    start();
    setSmsSent(true);
    let { data, error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });

    if (error == null) {
    }
  };

  //Verify Code
  const verifyCode = async () => {
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
      setAuth({
        session: data.session,
        user: {
          id: data.user?.id,
          phone: data.user?.phone,
        },
      });

      navigation.navigate("ProfileHome");
    }
  };

  return (
    <View style={styles.content}>
      <HeaderComponent title={"Login"} showBackButton={true} />
      <Text>Please type your mobile phone number below</Text>
      <Text>We will send you a One Time code by message</Text>

      <View>
        <CountryPicker
          withEmoji={true}
          withFilter={true}
          withCallingCode={true}
          withCallingCodeButton={true}
          withCountryNameButton={true}
          countryCode={countryCode as CountryCode}
          preferredCountries={["KR"]}
          onSelect={(country: any) => {
            //Clear field
            setPhoneNumber("");
            setCountryCode(country.cca2);
          }}
          visible
        />
      </View>

      <PhoneInput
        country={countryCode}
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={setPhoneNumber}
        style={styles.input}
      />
      {smsSent ? (
        <Button
          title={
            isRunning
              ? "Resend verification code in " + seconds + " seconds"
              : "Resend verification code"
          }
          onPress={() => {
            sendSms();
          }}
          disabled={isRunning}
        ></Button>
      ) : (
        <Button
          title="Send verification code"
          onPress={() => {
            sendSms();
          }}
          disabled={isRunning}
        ></Button>
      )}

      {smsSent && (
        <View style={styles.verificationContainer}>
          <Text>
            Please type the code you received by message to complete the
            authentication
          </Text>
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
        </View>
      )}
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
  verificationContainer: {
    marginTop: 20,
  },
});

export default AuthenticationScreen;
