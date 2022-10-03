import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../../../config/colors";
import BigButton from "../../../components/BigButton";
import SearchInput from "../../../components/SearchInput";

//Styles import
import commonStyles from "../../../config/stylesheet";

type Props = {
  navigation: any;
};

function SearchScreen({ navigation }: Props) {
  return (
    <View style={styles.page}>
      <View style={styles.input}>
        <SearchInput
          onSubmit={(value: string) => search(navigation, value)}
        ></SearchInput>
      </View>
      <View style={styles.content}>
        <Text style={commonStyles.label}>Quick search</Text>
        <View style={styles.quickSearchContainer}>
          <BigButton imageSource={require("../../../assets/store.svg")}>
            Store chain
          </BigButton>
          <BigButton imageSource={require("../../../assets/store.svg")}>
            Product brand
          </BigButton>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.linkContainer}>
          <Text style={styles.link} onPress={() => navigation.goBack()}>
            {"< Back"}
          </Text>
          <Text style={styles.link}>Change country</Text>
        </View>
      </View>
    </View>
  );
}

function search(navigation: any, value: String) {
  navigation.navigate("Search result", {
    search: value,
  });
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    height: "100%",
  },
  input: {
    margin: 20,
  },
  content: {
    flex: 1,
    margin: 20,
    marginTop: 30,
  },
  quickSearchContainer: {
    flexDirection: "row",
  },
  footer: {
    height: 90,
    borderTopWidth: 1,
    paddingHorizontal: 20,
  },
  linkContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  link: {
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    fontSize: 18,
    margin: 20,
    color: colors.primary,
  },
});

export default SearchScreen;
