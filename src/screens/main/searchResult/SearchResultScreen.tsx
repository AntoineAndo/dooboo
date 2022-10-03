import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

//Style import
import commonStyles from "../../../config/stylesheet";

type Props = {
  route: any;
  navigation: any;
};

function SearchResultScreen({ route, navigation }: Props) {
  const { search } = route.params;
  return (
    <View style={styles.page}>
      <View style={[styles.header, commonStyles.bottomShadow]}>
        <View style={styles.container}>
          <View
            style={styles.headerAction}
            onTouchStart={() => navigation.goBack()}
          >
            <Text style={styles.actionText}>←</Text>
          </View>
          <Text style={styles.headerText}>Search result</Text>
          <View style={styles.headerAction}>
            <Image
              style={styles.actionImage}
              source={require("../../../assets/icons/filter.svg")}
            ></Image>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {},
  header: {
    height: 90,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "500",
  },
  headerAction: {
    width: 40,
    height: 40,
    borderWidth: 1,
  },
  actionImage: {
    flex: 1,
  },
  actionText: {
    fontSize: 40,
    fontWeight: "700",
  },
});

export default SearchResultScreen;
