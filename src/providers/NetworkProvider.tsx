import React, { createContext, useContext } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { Log } from "../utils/Log";

export class NetworkType {
  isConnected: boolean = false;
}

//Creation of the Context
const NetworkContext = createContext<
  | {
      network: NetworkType;
      setState: Function;
    }
  | undefined
>(undefined);

function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [network, setState] = React.useState<NetworkType>(new NetworkType());

  React.useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      let netState = state.isConnected != null ? state.isConnected : false;

      if (netState != network.isConnected) {
        Log("Network change", "verbose", true);
        setState({ isConnected: netState });

        //In case of reconnection
        if (network.isConnected) {
        }
      }
    });

    return () => {
      unsub();
    };
  });

  //@@ NOTE: you *might* need to memoize this value
  //@@ Learn more in http://kcd.im/optimize-context
  return (
    <NetworkContext.Provider value={{ network, setState }}>
      {children}
    </NetworkContext.Provider>
  );
}

function useNetwork(): {
  network: NetworkType;
} {
  const context = useContext(NetworkContext);

  if (context == undefined) {
    throw new Error("useNetwork must be used within NetworkProvider");
  }
  return context;
}

export { NetworkProvider, useNetwork };
