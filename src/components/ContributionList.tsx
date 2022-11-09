import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  contributions: any[];
};

function ContributionList({ contributions }: Props) {
  return (
    <View>
      {contributions.map((c) => {
        return (
          <View style={styles.item}>
            <Text style={styles.name}>{c.product.name}</Text>
            <Text> - </Text>
            <Text>{c.store.name}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {},
  item: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
  },
  name: {
    fontWeight: "bold",
  },
});

export default ContributionList;
