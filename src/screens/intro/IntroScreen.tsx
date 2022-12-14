import { CommonActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View, Button } from "react-native";
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

  return (
    <View>
      <Text>IntroScreen</Text>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedLanguage(itemValue);
        }}
      >
        {config.dropdownValues.languages.map((language: any) => {
          return (
            <Picker.Item
              label={language.name}
              value={language.code}
              key={language.name}
            />
          );
        })}
      </Picker>
      <Picker
        selectedValue={selectedCountry}
        onValueChange={(itemValue, itemIndex) => setSelectedCountry(itemValue)}
      >
        {config.dropdownValues.countries.map((country: any) => {
          return (
            <Picker.Item
              label={country.name}
              value={country}
              key={country.name}
            />
          );
        })}
      </Picker>
      <Button title="Done" onPress={() => finishOnBoarding()}></Button>
    </View>
  );
}

export default IntroScreen;
