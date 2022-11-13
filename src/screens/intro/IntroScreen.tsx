import { CommonActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import { useConfig } from "../../providers/ConfigProvider";

import { getCountries, getLanguages } from "../../lib/supabase";
import { useQuery } from "@tanstack/react-query";

import { Picker } from "@react-native-picker/picker";
import { updateTranslation } from "../../hooks/translation";

type Props = {};

function IntroScreen({}: Props) {
  const navigation = useNavigation();
  const { config, setConfig } = useConfig();

  //Get default Country and Language
  const initialCountry = config.dropdownValues.countries.find(
    (country) => country.default == true
  );
  const initialLanguage = config.dropdownValues.languages.find(
    (language) => language.default == true
  );

  //Initiate State values with the default Country and Language
  const [selectedLanguage, setSelectedLanguage] =
    React.useState(initialCountry);
  const [selectedCountry, setSelectedCountry] = React.useState(initialLanguage);

  const finishOnBoarding = () => {
    let _conf = config;
    _conf.isAppFirstLauched = true;
    _conf.countryId = selectedCountry.id;
    _conf.language_code = selectedLanguage;

    updateTranslation(selectedLanguage);

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

  console.log(selectedCountry);
  console.log(selectedLanguage);

  return (
    <View>
      <Text>IntroScreen</Text>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedLanguage(itemValue);
          console.log(itemValue);
        }}
      >
        {config.dropdownValues.languages.map((language: any) => {
          return <Picker.Item label={language.name} value={language.code} />;
        })}
      </Picker>
      <Picker
        selectedValue={selectedCountry}
        onValueChange={(itemValue, itemIndex) => setSelectedCountry(itemValue)}
      >
        {config.dropdownValues.countries.map((country: any) => {
          return <Picker.Item label={country.name} value={country} />;
        })}
      </Picker>
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
