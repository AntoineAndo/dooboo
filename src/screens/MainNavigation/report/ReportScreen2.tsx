import { CommonActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet } from "react-native";
import ButtonComponent from "../../../components/ButtonComponent";
import PageComponent from "../../../components/PageComponent";
import T from "../../../components/T";
import fontSizes from "../../../config/fontSizes";
import commonStyles from "../../../config/stylesheet";
import { useTranslation } from "../../../hooks/translation";

function ReportScreen2() {
  const { translate } = useTranslation();
  const navigation = useNavigation();
  const onSubmit = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Navbar" }],
      })
    );
  };

  return (
    <PageComponent withNavbar={false}>
      <View
        style={[
          commonStyles.pageContent,
          { flex: 1, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            height: "50%",
          }}
        >
          <T style={{ fontSize: fontSizes.label, textAlign: "center" }}>
            {translate("report_complete_notice")}
          </T>
          <View style={{}}>
            <ButtonComponent
              onPress={() => {
                onSubmit();
              }}
            >
              {translate("contribution_back_homepage")}
            </ButtonComponent>
          </View>
        </View>
      </View>
    </PageComponent>
  );
}

const styles = StyleSheet.create({
  contentView: {
    paddingHorizontal: 26,
  },
});

export default ReportScreen2;
