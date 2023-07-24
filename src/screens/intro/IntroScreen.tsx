import { CommonActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, Animated, Image, Easing } from "react-native";
import { Text } from "react-native";
import { useConfig } from "../../providers/ConfigProvider";

import { updateTranslation, useTranslation } from "../../hooks/translation";
import commonStyles from "../../config/stylesheet";
import PickerComponent from "../../components/PickerComponent";
import ButtonComponent from "../../components/ButtonComponent";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../config/colors";
import { Dimensions } from "react-native";
import fontSizes from "../../config/fontSizes";
import T from "../../components/T";
import spacing from "../../config/spacing";
import LogoComponent from "../../components/LogoComponent";

type Props = {};

const MODAL_HEIGHT = 250;

function IntroScreen({}: Props) {
  const { translate } = useTranslation();
  const navigation = useNavigation();
  const { config, setConfig } = useConfig();

  //Get default Country and Language
  const initialCountry = config.dropdownValues.countries.find(
    (country) => country.default == true
  );
  const initialLanguage = config.translations.find(
    (language: any) => language.default == true
  );

  //Initiate State values with the default Country and Language
  const [selectedLanguageCode, setSelectedLanguageCode] = React.useState(
    initialLanguage.code
  );
  const [selectedCountryId, setSelectedCountryId] = React.useState(
    initialCountry.id
  );

  const [animationYValue] = React.useState(new Animated.Value(0));
  const [animationXValue] = React.useState(new Animated.Value(0));
  const [animationHeadline] = React.useState(new Animated.Value(0));
  const [hideStartButton, setHideStartButton] = React.useState(false);

  const startOnboarding = () => {
    Animated.parallel([
      Animated.timing(animationHeadline, {
        //Animate Headline
        toValue: -70,
        useNativeDriver: true,
        duration: 400,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(animationYValue, {
        //Animate modal
        toValue: -(MODAL_HEIGHT + spacing.s3),
        useNativeDriver: true,
        duration: 500,
        // delay: 10,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start();
    setTimeout(() => {
      setHideStartButton(true);
    }, 500);
  };

  const nextOnboarding = () => {
    Animated.timing(animationXValue, {
      toValue: -Dimensions.get("window").width,
      useNativeDriver: true,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  const finishOnboarding = () => {
    let _conf = config;
    _conf.isAppFirstLauched = true;
    _conf.countryId = selectedCountryId;
    _conf.language_code = selectedLanguageCode;

    updateTranslation(selectedLanguageCode);

    setConfig(_conf);

    //Navigate to the Navbar Navigator
    //"reset" is used to prevent going back to the Onboarding screen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Navbar" }],
      })
    );
  };

  return (
    <LinearGradient
      colors={["white", "white", colors.primary]}
      start={{
        x: 0,
        y: 0,
      }}
      end={{
        x: 0,
        y: 1.3,
      }}
      style={styles.page}
    >
      <Animated.View
        style={[
          { paddingTop: 100, flex: 1, alignItems: "center" },
          {
            transform: [
              {
                translateY: animationHeadline,
              },
            ],
          },
        ]}
      >
        <LogoComponent
          style={{
            marginTop: 100,
          }}
        />

        <T style={[commonStyles.title, { marginTop: spacing.s3 }]}>
          {translate("intro_title")}
        </T>
        <T
          style={{
            fontSize: 20,
            // fontFamily: "Milliard-Medium",
            color: colors.darkgrey,
          }}
        >
          {translate("intro_subtitle")}
        </T>
      </Animated.View>

      <View>
        {!hideStartButton && (
          <ButtonComponent onPress={() => startOnboarding()}>
            {translate("start")}
          </ButtonComponent>
        )}
      </View>
      <Animated.View
        style={[
          styles.animatedModalContainer,
          {
            transform: [
              {
                translateY: animationYValue,
              },
              {
                translateX: animationXValue,
              },
            ],
          },
        ]}
      >
        <View style={styles.modal}>
          <View>
            <T style={commonStyles.label}>{translate("language")}</T>
            <T style={styles.subtext}></T>
          </View>
          <PickerComponent
            value={selectedLanguageCode}
            choices={config.translations}
            onChange={(value: any) => setSelectedLanguageCode(value)}
            labelField="language"
            valueField="code"
            style={styles.picker}
          />
          <ButtonComponent onPress={() => nextOnboarding()}>
            {translate("next")}
          </ButtonComponent>
        </View>
        <View style={styles.modal}>
          <T style={commonStyles.label}>{translate("country")}</T>
          <T style={styles.subtext}>{translate("intro_country_tip")}</T>
          <PickerComponent
            value={selectedCountryId}
            onChange={(id: any) => setSelectedCountryId(id)}
            choices={config.dropdownValues.countries}
            showEmoji={true}
            labelField="name"
            valueField="id"
            style={styles.picker}
          />
          <ButtonComponent onPress={() => finishOnboarding()}>
            {translate("next")}
          </ButtonComponent>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    height: "100%",
    padding: spacing.s3,
    width: "100%",
    position: "absolute",
    top: 0,
  },
  animatedModalContainer: {
    width: "100%",
    position: "absolute",
    left: spacing.s3,
    bottom: -MODAL_HEIGHT,
    zIndex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  modal: {
    // height: MODAL_HEIGHT,
    marginRight: spacing.s3 * 2,
    borderRadius: 25,
    backgroundColor: "white",
    padding: spacing.s3,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    width: Dimensions.get("window").width - spacing.s3 * 2,
    ...commonStyles.elevation2,
  },
  picker: {
    marginVertical: spacing.s3,
  },
  subtext: {
    fontSize: fontSizes.p,
    marginTop: spacing.s1,
    color: colors.darkgrey,
  },
});

export default IntroScreen;
