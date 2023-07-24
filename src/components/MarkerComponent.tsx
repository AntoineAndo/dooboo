import React from "react";
import { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

type Props = {
  lat: string;
  lng: string;
  onPress: Function;
  isSelected?: boolean;
  color: string;
};

function MarkerComponent({
  lat,
  lng,
  onPress,
  isSelected = false,
  color,
}: Props) {
  return (
    <Marker
      coordinate={{
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      }}
      onPress={(e) => {
        onPress();
      }}
      zIndex={isSelected ? 10 : 1}
      tracksViewChanges={false}
      style={{ overflow: "visible" }}
    >
      <MaterialCommunityIcons
        name={"ellipse"}
        color={"white"}
        size={16}
        style={{
          position: "absolute",
          left: isSelected ? 14 : 10,
          top: isSelected ? 8 : 6,
        }}
      />
      <MaterialCommunityIcons
        name={"map-marker"}
        color={color}
        size={isSelected ? 44 : 36}
      />
    </Marker>
  );
}

export default MarkerComponent;
