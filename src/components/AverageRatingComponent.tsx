import React, { useMemo } from "react";
import T from "./T";
import IonIcons from "react-native-vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import spacing from "../config/spacing";
import colors from "../config/colors";

type Props = {
  ratingsArray?: number[];
  averageRating?: number;
};

function AverageRatingComponent({ ratingsArray, averageRating }: Props) {
  //Use the averageRating input or Calculate average rating based on input array
  const avgRating =
    averageRating ??
    useMemo(() => {
      if (ratingsArray == undefined || ratingsArray.length == 0) {
        return undefined;
      }

      let average =
        ratingsArray.reduce((acc: number, next: any) => acc + next, 0) /
        ratingsArray.length;

      return average;
    }, [ratingsArray]);

  if (avgRating) {
    return (
      <View style={styles.row}>
        <T style={styles.averageRating}>{avgRating.toFixed(1)}</T>
        <IonIcons
          name="star"
          color={colors.darkgrey}
          size={15}
          style={styles.starIcon}
        />
      </View>
    );
  }

  return <></>;
}

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
  },
  averageRating: {},
  starIcon: {},
});

export default AverageRatingComponent;
