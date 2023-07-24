import React, { ReactElement } from "react";
import { View } from "react-native";
import { useNetwork } from "../providers/NetworkProvider";
import T from "./T";

type Props = {
  children: React.ReactNode;
  style?: any;
  styleOffline?: any;
  offlineComponent?: ReactElement;
};

function NetworkViewComponent({
  children,
  style,
  styleOffline,
  offlineComponent,
}: Props) {
  const { network } = useNetwork();

  if (network.isConnected) {
    // if (false) {
    return <View style={style}>{children}</View>;
  } else {
    if (offlineComponent != undefined) {
      return <View style={styleOffline}>{offlineComponent}</View>;
    }

    return <View style={styleOffline ?? style}></View>;
  }
}

export default NetworkViewComponent;
