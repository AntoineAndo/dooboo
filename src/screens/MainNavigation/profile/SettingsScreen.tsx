import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import HeaderComponent from "../../../components/HeaderComponent";
import PageComponent from "../../../components/PageComponent";
import { updateTranslation, useTranslation } from "../../../hooks/translation";
import { useConfig } from "../../../providers/ConfigProvider";
import PickerComponent from "../../../components/PickerComponent";
import commonStyles from "../../../config/stylesheet";
import colors from "../../../config/colors";
import ButtonComponent from "../../../components/ButtonComponent";
import T from "../../../components/T";
import spacing from "../../../config/spacing";
import Header2Component from "../../../components/Header2Component";
import ScrollPageWithHeaderComponent from "../../../components/ScrollPageWithHeaderComponent";

type Props = {
  navigation: any;
};

function SettingsScreen({ navigation }: Props) {
  const { config, setConfig } = useConfig();

  const { translate } = useTranslation();

  //Get default Country and Language
  const initialCountryId = config.dropdownValues.countries.find(
    (country) => country.id == config.countryId
  ).id;

  const initialLanguageCode = config.translations.find(
    (language: any) => language.code == config.language_code
  ).code;

  //Initiate State values with the default Country and Language
  const [selectedLanguageCode, setSelectedLanguageCode] =
    React.useState(initialLanguageCode);

  const [selectedCountryId, setSelectedCountryId] =
    React.useState(initialCountryId);

  //Disables the save button if the form hasnt been changed
  const [changed, setChanged] = React.useState(false);

  // const [countryCode, setCountryCode] = React.useState<Country>("KR");

  const save = () => {
    let newConfiguration: any = {};
    Object.assign(newConfiguration, config);

    newConfiguration.countryId = selectedCountryId;
    newConfiguration.language_code = selectedLanguageCode;

    //Update translations
    updateTranslation(selectedLanguageCode);

    //update configuration
    setConfig(newConfiguration);

    setChanged(false);
  };

  return (
    <ScrollPageWithHeaderComponent
      title={translate("settings")}
      showBackButton={true}
    >
      <View style={styles.content}>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View>
            <View style={styles.pickerGroup}>
              <T style={[commonStyles.label, styles.label]}>
                {translate("language")}
              </T>
              <PickerComponent
                value={selectedLanguageCode}
                choices={config.translations}
                onChange={(value: any) => {
                  setSelectedLanguageCode(value);
                  setChanged(true);
                }}
                labelField="language"
                valueField="code"
              />
            </View>
            <View style={styles.pickerGroup}>
              <T style={[commonStyles.label, styles.label]}>
                {translate("country")}
              </T>
              <PickerComponent
                value={selectedCountryId}
                onChange={(id: any) => {
                  setSelectedCountryId(id);
                  setChanged(true);
                }}
                choices={config.dropdownValues.countries}
                showEmoji={true}
                labelField="name"
                valueField="id"
              />
            </View>
          </View>
        </View>
        <ButtonComponent onPress={() => save()} disabled={!changed}>
          {translate("save_changes")}
        </ButtonComponent>
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
  content: {
    backgroundColor: "white",
    // borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: spacing.s3,
    flex: 1,
  },
  pickerGroup: {
    marginVertical: 12,
  },
  label: {
    marginVertical: 12,
  },
});

export default SettingsScreen;
