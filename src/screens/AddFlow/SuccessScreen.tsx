import {
  CommonActions,
  StackActions,
  useFocusEffect,
} from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import ButtonComponent from "../../components/ButtonComponent";
import PageComponent from "../../components/PageComponent";
import T from "../../components/T";
import commonStyles from "../../config/stylesheet";
import { useTranslation } from "../../hooks/translation";

function SuccessScreen({ navigation, route }: any) {
  const { translate } = useTranslation();

  let finalDestination =
    route.params != undefined ? route.params.finalDestination : undefined;
  let pageConfiguration =
    route.params != undefined ? route.params.pageConfiguration : undefined;

  //Create a back button press event listener
  // to prevent going back to the forms
  useFocusEffect(() => {
    //Mount event listener
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onSubmit
    );

    //Unmount event listener
    return () => {
      backHandler.remove();
    };
  });

  let filteredRoutes = navigation.getState().routes.filter((r: any) => {
    return r?.params?.oneWay != true;
  });

  const onSubmit = () => {
    if (filteredRoutes.length != 0) {
      let action = CommonActions.reset({
        index: filteredRoutes.length,
        routes: filteredRoutes,
      });

      return navigation.dispatch(action);
    }

    if (finalDestination == undefined) {
      return navigation.navigate({
        name: "Home",
        key: 0,
      });
    }

    // Find the last occurence of the target screen
    let reversedRoutes = navigation.getState().routes.reverse();
    let targetScreen = reversedRoutes.find((r: any) => {
      return r.name == finalDestination.name;
    });
    if (targetScreen != undefined) {
      return navigation.navigate({
        name: targetScreen.name,
        key: targetScreen.key,
        params: finalDestination.params,
      });
    }

    //Fallback
    return navigation.navigate({
      name: "Home",
      key: 0,
    });
  };

  return (
    <PageComponent withNavbar={false}>
      <View style={[commonStyles.pageContent, styles.contentView]}>
        <View
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            height: "50%",
          }}
        >
          <T style={[commonStyles.bigText, { textAlign: "center" }]}>
            {pageConfiguration?.confirmationMessage ??
              translate("contribution_success")}
          </T>
          {pageConfiguration?.showConfetti && (
            <T style={{ fontSize: 50 }}>🎉</T>
          )}
          <View style={{}}>
            <ButtonComponent
              onPress={() => {
                onSubmit();
              }}
            >
              {finalDestination?.buttonLabel ??
                translate("contribution_back_homepage")}
            </ButtonComponent>
          </View>
        </View>
      </View>
    </PageComponent>
  );
}

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SuccessScreen;
