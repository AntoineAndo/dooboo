import React from "react";
import Constants from "expo-constants";
import * as Location from "expo-location";

export class AppState {
  isLoading: boolean = false;
  isDev?: boolean;
  showAuthPop: boolean = false;
  userLocation: {
    isAvailable: boolean;
    latitude?: number;
    longitude?: number;
  } = {
    isAvailable: false,
    latitude: undefined,
    longitude: undefined,
  };
}

//Creation of the Context
const AppStateContext = React.createContext<
  | {
      state: AppState;
      setState: Function;
      patchState: Function;
    }
  | undefined
>(undefined);

function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AppState>({
    isLoading: false,
    isDev: Constants?.manifest?.packagerOpts?.dev,
    showAuthPop: false,
    userLocation: {
      isAvailable: false,
      latitude: undefined,
      longitude: undefined,
    },
  });
  // const userLocation = React.useRef<
  //   | {
  //       latitude: number;
  //       longitude: number;
  //     }
  //   | undefined
  // >(undefined);

  //Location permission
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // setErrorMsg("Permission to access location was denied");

        return;
      }

      //Once the user location access is granted
      Location.watchPositionAsync(
        { accuracy: 5, distanceInterval: 10, timeInterval: 1000 },
        (location: any) => {
          let userRegion = {
            isAvailable: true,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          patchState("userLocation", userRegion);
        }
      );
    })();
  }, []);

  const patchState = (key: string, value: any) => {
    //Enforce validation

    setState({
      ...state,
      [key]: value,
    });
  };

  //@@ NOTE: you *might* need to memoize this value
  //@@ Learn more in http://kcd.im/optimize-context
  return (
    <AppStateContext.Provider
      value={{
        state,
        setState,
        patchState,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

function useAppState(): {
  state: AppState;
  setState: Function;
  patchState: Function;
} {
  const context = React.useContext(AppStateContext);

  if (context == undefined) {
    throw new Error("useApPState must be used within AppStateProvider");
  }
  return context;
}

export { AppStateProvider, useAppState };
