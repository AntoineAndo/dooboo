//Style import
import colors from "./colors";

import { StyleSheet } from "react-native";
import spacing from "./spacing";

const commonStyles = StyleSheet.create({
  label: {
    fontFamily: "Milliard-Medium",
    fontSize: 18,
    color: colors.primary,
  },
  bottomShadow: {
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: {
      height: 2,
      width: 2,
    },
  },
  elevation2: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  pageContent: {
    padding: 20,
    flex: 1,
  },
  bigText: {
    fontSize: 40,
    fontWeight: "300",
    color: colors.primary,
  },
  title: {
    width: "100%",
    textAlign: "center",
    color: colors.primary,
    fontSize: 30,
    fontWeight: "400",
    fontFamily: "Milliard-Bold",
  },
  input: {
    height: 50,
    marginVertical: spacing.s3,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.grey,
    borderRadius: 100,
    padding: spacing.s1,
    paddingLeft: spacing.s3,
    flexDirection: "row",
  },
  bullet: {
    marginHorizontal: spacing.s1,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    height: 60,
    zIndex: 999,
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#eeeeee99",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
});

export default commonStyles;
