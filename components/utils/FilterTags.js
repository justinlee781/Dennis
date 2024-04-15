import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Typo from "./Typo";
import Theme from "../../src/Theme";

function FilterTags({ tags, selectedTag, onTagPress }) {
  return (
    <View style={styles.container}>
      {tags &&
        tags.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tag,
              {
                backgroundColor:
                  item === selectedTag ? Theme.primaryColor : Theme.containerGrey,
              },
            ]}
            onPress={() => onTagPress(item)}
          >
            <Typo white={selectedTag === item? true : false}>{item}</Typo>
          </TouchableOpacity>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
  },
  tag: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 100,
    marginRight: 5,
  },
});

export default FilterTags;
