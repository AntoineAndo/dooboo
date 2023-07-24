import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import storage from "../lib/storage";

export class Config {
  language_code: string = ""; //Used for display language in the app
  locale: string = "";
  isAppFirstLauched?: Boolean = false; //Show the Onboarding screen on first start
  countryId: number = 0; //Used to fetch the current country's products
  categories?: any[];
  dropdownValues: {
    categories?: any[];
    countries: any[];
  } = {
    categories: [],
    countries: [],
  };
  translations: any;
  fresh?: boolean;
}

//Creation of the Context
const ConfigContext = createContext<
  | {
      config: Config;
      setConfig: Function;
      patchConfig: Function;
      currentCountry: any;
    }
  | undefined
>(undefined);

function updateAsyncStorage(
  existingConfiguration: Config,
  newConfiguration: any
) {
  //Update the existing configuration in the AsyncStorage
  storage.merge("config", JSON.stringify(newConfiguration));

  return newConfiguration;
}

function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig]: [Config, Function] = useReducer(
    updateAsyncStorage,
    {}
  );

  const currentCountry = useMemo(() => {
    if (config.dropdownValues == undefined) return;

    const currentCountryId = config.countryId;

    return config.dropdownValues.countries.find(
      (c) => (c.id = currentCountryId)
    );
  }, [config.countryId]);

  const patchConfig = (key: string, value: string | string[]) => {
    //Enforce validation

    setConfig({
      ...config,
      [key]: value,
    });
  };

  //@@ NOTE: you *might* need to memoize this value
  //@@ Learn more in http://kcd.im/optimize-context
  return (
    <ConfigContext.Provider
      value={{ config, setConfig, patchConfig, currentCountry }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

function useConfig(): {
  config: Config;
  setConfig: Function;
  patchConfig: Function;
  currentCountry: any;
} {
  const context = useContext(ConfigContext);

  if (context == undefined) {
    throw new Error("useConfig must be used within ConfigProvider");
  }
  return context;
}

export { ConfigProvider, useConfig };
