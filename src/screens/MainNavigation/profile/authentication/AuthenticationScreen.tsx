import React from "react";
import { Text, View, Button, TextInput, StyleSheet } from "react-native";
import { supabase } from "../../../../lib/supabase";
import PhoneInput, {
  Country,
} from "react-phone-number-input/react-native-input";
import { useAuth } from "../../../../providers/AuthProvider";
import { getCountries, isValidPhoneNumber } from "react-phone-number-input";
import { useTimer } from "react-timer-hook";
import HeaderComponent from "../../../../components/HeaderComponent";
import CountryPicker, {
  CountryCode,
  getAllCountries,
} from "react-native-country-picker-modal";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
type Props = {
  navigation: any;
};

const TIMER_DURATION = 10;
const VERIFICATION_CODE_LENGTH = 6;

function AuthenticationScreen({ navigation }: Props) {
  const [countryCode, setCountryCode] = React.useState<Country>("KR");
  const [phoneNumber, setPhoneNumber] = React.useState<any>("");
  const [verificationCode, setVerificationCode] = React.useState("");
  const [smsSent, setSmsSent] = React.useState<boolean>(false);

  const [errorPhoneNumber, setErrorPhoneNumber] = React.useState<string>("");
  const [errorVerificationCode, setErrorVerificationCode] =
    React.useState<string>("");

  const { auth, setAuth } = useAuth();

  const ref = useBlurOnFulfill({
    value: verificationCode,
    cellCount: VERIFICATION_CODE_LENGTH,
  });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: verificationCode,
    setValue: setVerificationCode,
  });

  const handleChangeVerificationCode = (value: any) => {
    //Clear error
    if (errorVerificationCode != "") {
      setErrorVerificationCode("");
    }

    //Update state
    setVerificationCode(value);

    //If the code is complete, then auto verify
    if (value.length == VERIFICATION_CODE_LENGTH) {
      verifyCode(value);
    }
  };

  const time = new Date();
  time.setSeconds(time.getSeconds() + TIMER_DURATION);

  const { seconds, isRunning, start, restart } = useTimer({
    expiryTimestamp: time,
    autoStart: false,
    onExpire: () => {
      let time = new Date();
      time.setSeconds(time.getSeconds() + TIMER_DURATION);
      restart(time, false);
    },
  });

  //SEND SMS
  const sendSms = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      setErrorPhoneNumber("Please enter a valid phone number");
      return;
    }

    //Clear error
    setErrorPhoneNumber("");

    //Send OTP
    let { data, error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });

    if (error != null) {
      setErrorPhoneNumber("Please enter a valid phone number");
      return;
    }
    //Start timer
    start();

    //Show verification code field
    setSmsSent(true);
  };

  /**
   * Function called to verify if the OTP entered is correct and authentify the user
   * @params Code - Passed by the auto verification, without it the verification will fail
   *                due to the async state update
   */
  const verifyCode = async (code: string | undefined = undefined) => {
    if (verificationCode.length != 6 && code == undefined) {
      setErrorVerificationCode("Invalid code");
      return;
    }

    //Verify the OTP
    //If a code was passed then verify this one as it is synced with the input field
    // else use the state
    let { data, error } = await supabase.auth.verifyOtp({
      type: "sms",
      phone: phoneNumber,
      token: code != undefined ? code : verificationCode,
    });

    if (error != null || data == null) {
      //If the code is wrong,
      //Empty the code field
      setVerificationCode("");
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
      {errorPhoneNumber != "" && (
        <Text style={styles.errorMsg}>{errorPhoneNumber}</Text>
      )}
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
          {/* <TextInput
            style={styles.input}
            value={verificationCode}
            onChangeText={setVerificationCode}
          ></TextInput> */}
          <CodeField
            ref={ref}
            {...props}
            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
            value={verificationCode}
            onChangeText={handleChangeVerificationCode}
            cellCount={VERIFICATION_CODE_LENGTH}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[
                  styles.cell,
                  isFocused && styles.focusCell,
                  errorVerificationCode != "" && styles.errorCell,
                ]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
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

export default AuthenticationScreen;
