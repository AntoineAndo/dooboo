import { CommonActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import { useConfig } from "../../providers/ConfigProvider";

type Props = {};

function IntroScreen({}: Props) {
  const navigation = useNavigation();
  const { config, setConfig } = useConfig();

  const finishOnBoarding = () => {
    let _conf = config;
    _conf.isAppFirstLauched = true;
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
    <View>
      <Text>IntroScreen</Text>
      <TouchableOpacity
        style={{
          width: 40,
          height: 50,
          borderWidth: 2,
        }}
        onPress={() => finishOnBoarding()}
      ></TouchableOpacity>
    </View>
  );
}

export default IntroScreen;
