import React, { useState } from "react";
import { View } from "react-native";
import { MenuItem } from "./MenuItemComponent";
import { useTranslation } from "../hooks/translation";
import colors from "../config/colors";

type Props = {
  item: any;
  title: string;
  imageUrl: string;
  dispatch: Function;
  childrens: any[];
  checkedItems: any[];
  noCheckboxForParents?: boolean;
};

function DropDownMenuComponent({
  item,
  title,
  imageUrl,
  dispatch,
  childrens,
  checkedItems,
  noCheckboxForParents = false,
}: Props) {
  const { translate } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const isChecked = checkedItems.indexOf(item) != -1;

  const onParentCheck = () => {
    dispatch(isChecked ? "uncheck" : "check", [item, ...childrens]);
  };

  let dropdownIcon;

  if (childrens && childrens.length != 0) {
    if (isOpen) {
      dropdownIcon = "chevron-down-outline";
    } else {
      dropdownIcon = "chevron-forward-outline";
    }
  }

  return (
    <>
      <MenuItem
        title={title}
        imageUrl={imageUrl}
        onPress={() => setIsOpen(!isOpen)}
        accessibilityLabel={"Category " + title}
        accessibilityHint={"Start a search of this category"}
        checkbox={
          !noCheckboxForParents ||
          (noCheckboxForParents && childrens.length == 0)
        }
        checked={isChecked}
        showArrow={false}
        onCheck={() => onParentCheck()}
        dropdownIcon={dropdownIcon}
        isOpen={isOpen}
      />
      {isOpen &&
        childrens.map((children: any) => {
          const isChildrenChecked = checkedItems.indexOf(children) != -1;
          return (
            <MenuItem
              title={translate(children.code)}
              onPress={() =>
                dispatch(isChildrenChecked ? "uncheck" : "check", [children])
              }
              key={children.code}
              imageUrl={`icons/${children.icon_name}.png`}
              accessibilityLabel={"Category " + translate(children.code)}
              accessibilityHint={"Start a search of this category"}
              style={{
                paddingLeft: 10,
                marginLeft: 20,
                borderLeftWidth: 1,
                borderColor: colors.lightgrey,
              }}
              checkbox={true}
              checked={isChildrenChecked}
              onCheck={() =>
                dispatch(isChildrenChecked ? "uncheck" : "check", [children])
              }
            />
          );
        })}
    </>
  );
}

export default DropDownMenuComponent;
