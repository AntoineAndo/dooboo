import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";

type Props = {};

function AppCheckbox({}: Props) {
  let [checked, setChecked] = useState(false);

  function onCheckPress() {
    setChecked(!checked);
  }

  return (
    <Checkbox
      onPress={onCheckPress}
      status={checked ? "checked" : "unchecked"}
    />
  );
}

export default AppCheckbox;
