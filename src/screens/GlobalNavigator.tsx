import React, { useEffect, useState } from "react";
import RNN from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IntroScreen from "./intro/IntroScreen";
import NavbarNavigator from "./MainNavigation/NavbarNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { Config, useConfig } from "../providers/ConfigProvider";
import * as SplashScreen from "expo-splash-screen";
import Storage from "../lib/storage";
import { initializeTranslations } from "../hooks/translation";
import storage from "../lib/storage";
import {
  getCategories,
  getCountries,
  getDefaultCountry,
  getLanguages,
  supabase,
} from "../lib/supabase";
import { useAppState } from "../providers/AppStateProvider";
import OverlayComponent from "../components/OverlayComponent";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import AddNavigator from "./AddFlow/AddNavigator";

const Stack = createNativeStackNavigator();

type Props = {};

function GlobalNavigator({}: Props): any {
  const [appIsReady, setAppIsReady] = useState(false);
  const app = useAppState();
  const { config, setConfig } = useConfig();
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    function loadResourcesAndDataAsync(cb: Function) {
      try {
        //Override splashscreen behaviour
        SplashScreen.preventAutoHideAsync();

        //Get the configuration
        //@@ https://docs.expo.dev/archive/classic-updates/preloading-and-caching-assets/#pre-loading-and-caching-assets
        const configuration = Storage.getData("config");
        const defaultCountry = getDefaultCountry();
        const categories = getCategories(0);
        const countries = getCountries();
        const languages = getLanguages();
        const session = supabase.auth.getSession();
        Promise.all([
          configuration,
          defaultCountry,
          categories,
          session,
          countries,
          languages,
        ]).then(
          ([
            configuration,
            defaultCountryResult,
            categories,
            session,
            countries,
            languages,
          ]) => {
            let configurationObject: Config;

            if (defaultCountryResult.data == null) {
              console.error("An error occured");
              return;
            }

            const defaultCountry = defaultCountryResult.data[0];

            //Session ?
            if (session.data != null && session.data.session != undefined) {
              supabase.auth
                .refreshSession({
                  refresh_token: session.data.session.refresh_token,
                })
                .then((response: any) => {
                  if (response.error == null && response.data != null) {
                    console.log("session refresh");
                    console.log(response);
                    setAuth({
                      session: response.data.session,
                      user: {
                        id: response.data.user?.id,
                        phone: response.data.user?.phone,
                      },
                    });
                    return;
                  }

                  //If there is an error during the session refresh
                  // then the user is signed out
                  supabase.auth.signOut();
                  setAuth({});
                });
            }

            //If the stored configuration is empty
            //Then we assume that this is the first time the app is launched
            //So we initialize the configuration values
            //Which will then lead to the opening of the Intro screen
            // configuration=undefined
            if (
              configuration == undefined ||
              Object.keys(configuration).length == 0
            ) {
              console.log("New configuration");
              //Initial values
              configurationObject = {
                countryId: defaultCountry.id,
                language_code: "eng",
                isAppFirstLauched: false,
                dropdownValues: {
                  categories: categories.data,
                  languages: languages.data,
                  countries: countries.data,
                },
              };

              storage.storeData("config", JSON.stringify(configurationObject));
            } else {
              //duplicate stored existing conf
              configurationObject = configuration;
              //Patch dropdown configuration values
              configurationObject.dropdownValues = {
                categories: categories.data,
                languages: languages.data,
                countries: countries.data,
              };
            }

            console.log(configurationObject);

            //Set the configuration object as the context value
            // so that it can be accessed everywhere in the app
            setConfig(configurationObject);
            cb(configurationObject);
          }
        );
      } catch (e) {
        //@@ You might want to provide this error information to an error reporting service
        console.warn(e);
      }
    }

    loadResourcesAndDataAsync((configuration: any) => {
      console.log("configuration", configuration);

      // Translation init
      initializeTranslations(configuration.language_code as string);

      setAppIsReady(true);

      SplashScreen.hideAsync();
    });
  }, []);

  //While the app isnt ready the splash screen is displayed
  //TODO
  if (!appIsReady) {
    //Return the splash screen here
    return (
      <View>
        <Text>LOADING</Text>
      </View>
    );
  }

  return (
    <>
      {app.state.isLoading && <OverlayComponent />}
      <View style={styles.app}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Intro"
            screenOptions={{
              headerShown: false,
            }}
          >
            {(config.isAppFirstLauched == undefined || //If the app was never launched
              config.isAppFirstLauched == false) && ( // the Intro Screen is added to the navigator
              <Stack.Screen name="Intro" component={IntroScreen} />
            )}

            <Stack.Screen name="Navbar" component={NavbarNavigator} />

            {auth.session != undefined && (
              <Stack.Screen name="AddNavigation" component={AddNavigator} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
  },
});

export default GlobalNavigator;
