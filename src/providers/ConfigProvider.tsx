import React, { createContext, useContext, useReducer, useState } from "react";
import storage from "../lib/storage";

export class Config {
  language_code?: String = "en";
  isAppFirstLauched?: Boolean = false;
}

//Creation of the Context
const ConfigContext = createContext<
  { config: Config; setConfig: Function } | undefined
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
  //@@ NOTE: you *might* need to memoize this value
  //@@ Learn more in http://kcd.im/optimize-context
  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

function useConfig(): { config: Config; setConfig: Function } {
  const context = useContext(ConfigContext);

  if (context == undefined) {
    throw new Error("useConfig must be used within ConfigProvider");
  }
  return context;
}

export { ConfigProvider, useConfig };
