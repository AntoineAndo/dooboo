import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import fontSizes from "../config/fontSizes";
import BrandModal from "../screens/AddFlow/BrandModal";
import IonIcons from "react-native-vector-icons/Ionicons";
import colors from "../config/colors";
import Brand from "../types/Brand";
import spacing from "../config/spacing";

type Props = {
  valueChange: Function;
  canClear?: Boolean;
};

function SelectTextInput({ valueChange, canClear = false }: Props) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedBrand, setSelectedBrand] = React.useState<Brand>();

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = (selectedBrand?: Brand) => {
    setModalVisible(false);

    //If 'Cancel' then just close the modal and disregard the brand change
    if (selectedBrand != undefined) {
      //update local state
      setSelectedBrand(selectedBrand);

      //Inform parent of change
      valueChange(selectedBrand);
    }
  };

  return (
    <>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => closeModal(undefined)}
      >
        <BrandModal
          closeModal={(selectedBrand: Brand) => closeModal(selectedBrand)}
        />
      </Modal>
      <TouchableOpacity style={styles.searchBar} onPress={() => openModal()}>
        <View style={styles.iconContainer}>
          <IonIcons name={"search-outline"} style={styles.image} size={40} />
        </View>
        <TextInput
          style={styles.input}
          value={selectedBrand != undefined ? selectedBrand?.name_ori : ""}
          editable={false}
          selectTextOnFocus={false}
        ></TextInput>
        {selectedBrand != undefined && canClear && (
          <Pressable
            style={styles.inputClear}
            onPress={() => closeModal(undefined)}
          >
            <IonIcons name="close" color={colors.darkgrey} size={25} />
          </Pressable>
        )}
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    // outlineStyle: "none",
    paddingLeft: 10,
    fontSize: fontSizes.p,
    flex: 1,
    color: "black",
  },
  searchBar: {
    height: 50,
    marginVertical: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.grey,
    borderRadius: 100,
    // padding: 3,
    paddingLeft: 10,
    flexDirection: "row",
  },
  iconContainer: {},
  image: {
    // resizeMode: "contain",
    fontSize: 30,
    marginTop: 5,
    paddingTop: 4,
    height: 30,
    width: 30,
  },
  inputClear: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: spacing.s1,
    // top: spacing.s1,
    top: 0,
    right: spacing.s1,
    // borderWidth: 1,
  },
});

export default SelectTextInput;
