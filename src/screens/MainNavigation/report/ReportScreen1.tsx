import React from "react";
import { View } from "react-native";
import HeaderComponent from "../../../components/HeaderComponent";

type Props = {};

function ReportScreen1({}: Props) {
  return (
    <View>
      <HeaderComponent
        title={"Why are you reporting this product"}
        showBackButton={true}
      />
    </View>
  );
}

export default ReportScreen1;
