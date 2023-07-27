import React from "react";
import { Animated, StatusBar, StyleSheet } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import IonIcons from "react-native-vector-icons/Ionicons";

//Style import
import colors from "../../config/colors";
import spacing from "../../config/spacing";

//Screens
import HomeNavigation from "./main/MainNavigator";
import ProfileNavigation from "./profile/ProfileNavigation";
import AddNavigator from "../AddFlow/AddNavigator";
import AuthenticationPopScreen from "./profile/authentication/AuthenticationPopScreen";

//Hooks
import { useAuth } from "../../providers/AuthProvider";
import { useTranslation } from "../../hooks/translation";
import { useAppState } from "../../providers/AppStateProvider";

const Tab = createMaterialBottomTabNavigator();

type Props = {
  navigation: any;
};

function NavbarNavigator({ navigation }: Props) {
  const { state, patchState } = useAppState();
  const { auth } = useAuth();
  const { translate } = useTranslation();

  // const [modalRef, updateModalRef] = React.useState<any>(null);
  const openModalAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (state.showAuthPop) {
      //Close first, then animate the opening
      openModalAnim.setValue(0);
      Animated.timing(openModalAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [state.showAuthPop]);

  const closeAuthPop = () => {
    Animated.timing(openModalAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      patchState("showAuthPop", false);
    });
  };

  let interpolatePositionY = openModalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [800, 0],
    extrapolate: "clamp",
  });

  return (
    <>
      {state.showAuthPop && (
        <Animated.View
          style={[
            styles.overlayContainer,
            {
              opacity: openModalAnim,
            },
          ]}
        >
          <StatusBar barStyle={"light-content"}></StatusBar>
          <Animated.View
            style={[
              {
                flex: 1,
              },
              {
                transform: [{ translateY: interpolatePositionY }],
              },
            ]}
          >
            <AuthenticationPopScreen
              style={[
                {
                  height: "75%",
                  // width: "100%",
                  flex: 0,
                  margin: 0,
                },
              ]}
              onClose={closeAuthPop}
            />
          </Animated.View>
        </Animated.View>
      )}
      <Tab.Navigator
        initialRouteName={"HomeNavigation"}
        activeColor={colors.primary}
        inactiveColor={colors.primary}
        barStyle={{
          marginTop: 0,
          backgroundColor: "white",
        }}
        sceneAnimationEnabled={false}
        shifting={true}
      >
        <Tab.Screen
          name={translate("home")}
          component={HomeNavigation}
          options={{
            tabBarIcon: ({ color }) => {
              return <IonIcons name="home" color={color} size={26} />;
            },
          }}
        />
        <Tab.Screen
          name={"Contribute"}
          component={AddNavigator}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              //If the user is not connected
              // redirects to the login page
              if (auth.session != undefined) {
                navigation.navigate("AddNavigation");
              } else {
                patchState("showAuthPop", true);
              }
              return () => {};
            },
          }}
          options={{
            tabBarIcon: ({ color }) => {
              return <IonIcons name="add" color={color} size={26} />;
            },
          }}
        />
        <Tab.Screen
          name={translate("profile")}
          component={ProfileNavigation}
          options={{
            tabBarIcon: ({ color }) => {
              return <IonIcons name="person" color={color} size={26} />;
            },
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    zIndex: 999,
    backgroundColor: "#00000099",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.s3,
  },
});

export default NavbarNavigator;
