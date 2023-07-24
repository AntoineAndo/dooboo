import React from "react";
import { useTranslation } from "../hooks/translation";
import ButtonComponent from "./ButtonComponent";

type Props = {
  onPress: Function;
  style: any;
};

function SearchHereButtonComponent({ onPress, style }: Props) {
  const { translate } = useTranslation();
  return (
    <ButtonComponent
      onPress={onPress}
      type={"secondary"}
      slim={true}
      style={[
        {
          borderWidth: 0,
          elevation: 2,
        },
        style,
      ]}
    >
      {translate("search_here")}
    </ButtonComponent>
  );
}

export default SearchHereButtonComponent;
