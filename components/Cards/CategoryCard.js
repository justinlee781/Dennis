import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from "react-native";
import Typo from "../utils/Typo";

function CategoryCard({ image, label, handlePress }) {
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.card,
        {
          height: label === "Other" ? 150 : 250,
        },
      ]}
    >
      <ImageBackground
        imageStyle={{ borderRadius: 25 }}
        source={image}
        style={{ height: "100%", width: "100%",alignItems:'center',paddingTop:10 }}
      >
        <Typo bold xl style={{ color: "white",textAlign:'center',fontFamily:"Pacifico" }}>
        {label}
        </Typo>
      </ImageBackground>
    </TouchableOpacity>
  );
}
export default CategoryCard;

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    margin: 5,
    borderRadius: 15,
    width: "48%",
    flex: 1,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  cover: {
    height: 35,
    width: 35,
    borderRadius: 55,
    marginRight: 5,
  },
  label: {
    paddingRight: 8,
  },
});
