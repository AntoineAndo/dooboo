import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import colors from "../config/colors";
import { downloadImages } from "../lib/supabase";
import LogoComponent from "./LogoComponent";

//Types import
import T from "./T";
import fontSizes from "../config/fontSizes";
import AverageRatingComponent from "./AverageRatingComponent";
import { brands } from "../utils/utils";
import { Config } from "../providers/ConfigProvider";

type Props = {
  children: any;
  config: Config;
};

function ListItemComponent({ children, config }: Props) {
  const { isLoading, isError, data, error } = useQuery(
    [children.product_image[0].image_url],
    () => downloadImages([children.product_image[0].image_url])
  );

  //Once the url of the image is loaded
  //It is set in the image object
  // so that it can be reused by other components
  // const imageUrl = data?.publicUrl;
  const imageUrl = data != undefined ? data[0].publicUrl : undefined;
  children.imageUrl = imageUrl;

  return (
    <View style={styles.item}>
      {isLoading ? (
        <View style={styles.image}>
          <LogoComponent style={{ width: 30, height: 30, elevation: 0 }} />
        </View>
      ) : (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      )}

      <View style={styles.textContainer}>
        <View style={styles.column}>
          <View style={styles.titleContainer}>
            <T style={styles.title} numberOfLines={3}>
              {children.name}
            </T>
            <T>{brands(children, config.language_code)}</T>
            <AverageRatingComponent
              ratingsArray={children.rating.map((r: any) => r.rating)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    // backgroundColor: "powderblue",
    width: "100%",
  },
  image: {
    height: "100%",
    width: 100,
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.lightgrey,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 10,
  },
  column: {
    flex: 1,
    flexDirection: "column",
    // alignItems: "",
  },
  titleContainer: {
    flex: 1,
    flexDirection: "column",
  },
  title: {
    fontFamily: "Milliard-Medium",
    fontSize: fontSizes.label,
    flexWrap: "wrap",
  },
});

export default ListItemComponent;
