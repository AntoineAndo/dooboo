//Style import
import colors from "./colors";

import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
  label: {
    fontWeight: "700",
    fontSize: 18,
    color: colors.primary,
    marginBottom: 10,
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
});

export default commonStyles;
