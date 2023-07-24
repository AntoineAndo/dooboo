import React, { useRef, useState } from "react";
import { Text, View, StyleSheet, StatusBar, Animated } from "react-native";
import { supabase } from "../../../../lib/supabase";
import PhoneInput, {
  Country,
} from "react-phone-number-input/react-native-input";
import { useAuth } from "../../../../providers/AuthProvider";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import { useTimer } from "react-timer-hook";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import ButtonComponent from "../../../../components/ButtonComponent";
import commonStyles from "../../../../config/stylesheet";
import spacing from "../../../../config/spacing";
import T from "../../../../components/T";
import { useTranslation } from "../../../../hooks/translation";
import colors from "../../../../config/colors";
import ScrollPageWithHeaderComponent from "../../../../components/ScrollPageWithHeaderComponent";
type Props = {
  navigation: any;
};

const TIMER_DURATION = 10;
const VERIFICATION_CODE_LENGTH = 6;

function AuthenticationScreen({ navigation }: Props) {
  const { translate } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [countryCode, setCountryCode] = useState<Country>("KR");
  const [phoneNumber, setPhoneNumber] = useState<any>("");
  const [verificationCode, setVerificationCode] = useState("");
  const [smsSent, setSmsSent] = useState<boolean>(false);
  const [canSend, setCanSend] = useState(false);
  const [showConfirmationField, setShowConfirmationField] =
    useState<boolean>(false);

  const [errorPhoneNumber, setErrorPhoneNumber] = useState<string>("");
  const [errorToken, setErrorToken] = useState<string>("");
  const [errorVerificationCode, setErrorVerificationCode] =
    useState<string>("");

  const { auth, setAuth } = useAuth();

  const ref = useBlurOnFulfill({
    value: verificationCode,
    cellCount: VERIFICATION_CODE_LENGTH,
  });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: verificationCode,
    setValue: setVerificationCode,
  });

  //Animation state
  // const [animationTranslateContent] = React.useState(new Animated.Value(0));

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
      setCanSend(isPossiblePhoneNumber(phoneNumber));
      let time = new Date();
      time.setSeconds(time.getSeconds() + TIMER_DURATION);
      restart(time, false);
    },
  });

  //SEND SMS
  const sendSms = async () => {
    setCanSend(false);

    if (!isPossiblePhoneNumber(phoneNumber)) {
      setErrorPhoneNumber(translate("error_phone_number"));
      setSmsSent(false);
      return;
    }

    //Clear error
    setErrorPhoneNumber("");

    //Send OTP
    let { data, error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });

    if (error != null) {
      console.log(error);
      setErrorPhoneNumber("Please enter a valid phone number");
      setSmsSent(false);
      return;
    }

    setShowConfirmationField(true);

    //Start timer
    start();
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
      setErrorToken("Invalid or expired code");
      return;
    }

    if (data.session != undefined) {
      console.log("data", data);
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

  const onPhoneInputChange = (v: string) => {
    if (v == undefined) {
      v = "";
    }
    setPhoneNumber(v);
    setCanSend(isPossiblePhoneNumber(v));
  };

  return (
    <ScrollPageWithHeaderComponent
      title={translate("login")}
      showBackButton={true}
    >
      <View style={styles.content}>
        <View style={styles.instructions}>
          <T>{translate("login_instruction_1")}</T>
          <T>{translate("login_instruction_2")}</T>
        </View>
        <View style={styles.phoneNumberContainer}>
          <CountryPicker
            containerButtonStyle={styles.countryPicker}
            withEmoji={true}
            withFilter={true}
            withCallingCode={true}
            withCallingCodeButton={true}
            // withCountryNameButton={true}
            countryCode={countryCode as CountryCode}
            preferredCountries={["KR"]}
            onSelect={(country: any) => {
              //Clear field
              setPhoneNumber("");

              setCountryCode(country.cca2);
              setVisible(false);
            }}
            visible={visible}
          />

          <PhoneInput
            country={countryCode}
            placeholder={translate("phone_number_placeholder")}
            value={phoneNumber}
            onChange={onPhoneInputChange}
            style={[
              commonStyles.input,
              { flex: 1, marginVertical: spacing.s1, marginLeft: spacing.s1 },
            ]}
            withCountryCallingCode={true}
          />
        </View>
        {errorPhoneNumber != "" && (
          <T style={styles.errorMsg}>{errorPhoneNumber}</T>
        )}
        {!smsSent && !isRunning ? (
          <ButtonComponent
            onPress={() => {
              sendSms();
              setSmsSent(true);
            }}
            style={{
              marginTop: spacing.s2,
            }}
            disabled={!canSend}
          >
            {translate("send_verification_code")}
          </ButtonComponent>
        ) : (
          <ButtonComponent
            onPress={() => {
              sendSms();
            }}
            disabled={(smsSent && isRunning) || !canSend}
            style={{
              marginTop: spacing.s2,
            }}
          >
            {translate("resend_verification_code")}
            {/* {isRunning
              ? "Resend verification code in " + seconds + " seconds"
              : translate('resend_verification_code')} */}
          </ButtonComponent>
        )}

        {showConfirmationField && (
          <View style={styles.verificationContainer}>
            <T>{translate("sms_otp_instruction")}</T>
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
            {errorToken != "" && <T style={styles.errorMsg}>{errorToken}</T>}
            <ButtonComponent
              onPress={() => {
                verifyCode();
              }}
            >
              {translate("verify")}
            </ButtonComponent>
          </View>
        )}
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
  logoContainer: {
    position: "absolute",
    width: "100%",
    top: 0,
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    alignSelf: "center",
    width: 50,
  },
  title: {
    color: "white",
  },
  content: {
    backgroundColor: "white",
    // marginTop: 200,
    // borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flex: 1,
    padding: spacing.s3,
  },
  header: {
    padding: spacing.s1,
  },
  instructions: {
    marginVertical: spacing.s2,
  },
  errorMsg: {
    color: "red",
    marginBottom: spacing.s2,
  },
  verificationContainer: {
    marginTop: 20,
  },
  phoneNumberContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  countryPicker: {
    borderWidth: 1,
    borderColor: colors.grey,
    backgroundColor: "white",
    height: 50,
    display: "flex",
    alignItems: "center",
    paddingHorizontal: spacing.s2,
    paddingRight: spacing.s2 + 3,
    justifyContent: "center",
    borderRadius: 50,
  },
  codeFieldRoot: {
    marginVertical: spacing.s3,
  },
  cell: {
    width: 50,
    height: 50,
    lineHeight: 46,
    fontSize: 24,
    color: "white",
    fontFamily: "Milliard-Medium",
    borderRadius: 10,
    backgroundColor: colors.lightgrey,
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
