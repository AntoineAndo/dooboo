import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Chip } from "react-native-paper";
import IonIcons from "react-native-vector-icons/Ionicons";
import Store from "../types/Store";

type props = {
  storeList: Store[];
  onSelectedUpdate: Function;
};

function StorePicker({ storeList, onSelectedUpdate }: props) {
  const [selectedStoresId, setSelectedStoresId] = React.useState<number[]>([]);

  const toggleStore = (storeId: number) => {
    let newArray = [...selectedStoresId];
    let index = newArray.indexOf(storeId);

    //If the clicked element is not present in the array
    if (index == -1) {
      newArray.push(storeId);
    } else {
      //else removed
      newArray.splice(index, 1);
    }

    setSelectedStoresId(newArray);
    onSelectedUpdate(newArray);
  };

  return (
    <>
      <View style={styles.result}>
        {storeList.map((store: any) => {
          //Show only the selected stores
          if (selectedStoresId.indexOf(store.id) != -1) {
            return (
              <Chip
                mode="flat"
                selectedColor="white"
                style={[styles.chip, styles.selectedChip]}
                textStyle={[styles.chipText, styles.selectedChipText]}
                onPress={() => {
                  toggleStore(store.id);
                }}
                closeIcon="close"
                onClose={() => {
                  toggleStore(store.id);
                }}
                key={store.id}
              >
                {store.name}
              </Chip>
            );
          }
        })}
      </View>
      <View style={styles.searchBar}>
        <IonIcons name={"search-outline"} style={styles.image} size={40} />
        <TextInput
          style={styles.input}
          placeholder="Search a store here"
          placeholderTextColor={"#888"}
          returnKeyType="next"
        ></TextInput>
      </View>
      <View style={styles.result}>
        {storeList.map((store: any) => {
          //Show only the not selected stores
          if (selectedStoresId.indexOf(store.id) == -1) {
            return (
              <Chip
                mode="outlined"
                selectedColor={"#36D399"}
                style={[styles.chip, styles.unselectedChip]}
                textStyle={[styles.chipText, styles.unselectedChipText]}
                onPress={() => {
                  toggleStore(store.id);
                }}
                key={store.id}
              >
                {store.name}
              </Chip>
            );
          }
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    outlineStyle: "none",
    marginLeft: 10,
    fontSize: 20,
  },
  searchBar: {
    marginVertical: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
    borderRadius: 100,
    padding: 3,
    flexDirection: "row",
  },
  image: {
    resizeMode: "contain",
    fontSize: 30,
    margin: 5,
    height: 30,
    width: 30,
  },
  result: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    borderWidth: 2,
    borderColor: "#36D399",
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  selectedChip: {
    backgroundColor: "#36D399",
  },
  unselectedChip: {
    backgroundColor: "white",
  },
  chipText: {
    fontSize: 18,
    fontWeight: "600",
  },
  selectedChipText: {
    color: "white",
  },
  unselectedChipText: {
    color: "#36D399",
  },
});

export default StorePicker;
