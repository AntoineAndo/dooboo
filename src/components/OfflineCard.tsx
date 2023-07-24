import React from "react";
import { View } from "react-native";
import colors from "../config/colors";
import spacing from "../config/spacing";
import T from "./T";
import IonIcons from "react-native-vector-icons/Ionicons";
import fontSizes from "../config/fontSizes";
import { useTranslation } from "../hooks/translation";

type Props = {};

function OfflineCard({}: Props) {
  const { translate } = useTranslation();

  return (
    <View
      style={{
        height: 300,
        backgroundColor: "white",
        borderRadius: 25,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        padding: spacing.s3,
      }}
    >
      <T style={{ fontSize: fontSizes.label, textAlign: "center" }}>
        {translate("offline_notice")}
      </T>
      <IonIcons
        name={"cloud-offline-outline"}
        size={40}
        color={colors.darkgrey}
      />
      <T style={{ fontSize: fontSizes.label, textAlign: "center" }}>
        {translate("offline_tip")}
      </T>
    </View>
  );
}

export default OfflineCard;
