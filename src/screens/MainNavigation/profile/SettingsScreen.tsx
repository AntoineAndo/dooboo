import { Picker } from "@react-native-picker/picker";
import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";
import { updateTranslation, useTranslation } from "../../../hooks/translation";
import { useConfig } from "../../../providers/ConfigProvider";

type Props = {
  navigation: any;
};

function SettingsScreen({ navigation }: Props) {
  const { config, setConfig } = useConfig();

  //Get default Country and Language
  const initialCountryId = config.dropdownValues.countries.find(
    (country) => country.id == config.countryId
  ).id;
  const initialLanguageCode = config.dropdownValues.languages.find(
    (language) => language.code == config.language_code
  ).code;

  //Initiate State values with the default Country and Language
  const [selectedLanguageCode, setSelectedLanguageCode] =
    React.useState(initialLanguageCode);
  const [selectedCountryId, setSelectedCountryId] =
    React.useState(initialCountryId);

  const save = () => {
    let newConfiguration: any = {};
    Object.assign(newConfiguration, config);

    newConfiguration.countryId = selectedCountryId;
    newConfiguration.language_code = selectedLanguageCode;

    //Update translations
    updateTranslation(selectedLanguageCode);

    //update configuration
    setConfig(newConfiguration);
  };

  return (
    <View>
      <Text>IntroScreen</Text>
      <Picker
        selectedValue={selectedLanguageCode}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedLanguageCode(itemValue);
        }}
      >
        {config.dropdownValues.languages.map((language: any) => {
          return (
            <Picker.Item
              label={language.name}
              value={language.code}
              key={"language" + language.code}
            />
          );
        })}
      </Picker>
      <Picker
        selectedValue={selectedCountryId}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedCountryId(itemValue)
        }
      >
        {config.dropdownValues.countries.map((country: any) => {
          return (
            <Picker.Item
              label={country.name}
              value={country.id}
              key={"country" + country.code}
            />
          );
        })}
      </Picker>
      <Button onPress={() => save()} title="Save changes"></Button>
    </View>
  );
}

export default SettingsScreen;
