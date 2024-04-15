import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import Typo from "../utils/Typo";
import Theme from "../../src/Theme";
import Space from "../utils/Space";

function ProductCardHorizontal({ img, title, price, handleImagePress, brand }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePress}>
        <Image
          source={{ uri: img }}
          style={{
            borderRadius: 10,
            height: 80,
            backgroundColor: "#f8f8f8",
            width: 80,
          }}
        ></Image>
      </TouchableOpacity>
      <View style={styles.blurContainer}>
          <View>
          <Typo style={{textTransform:"capitalize"}} numberOfLines={1} grey s>
             {brand}
            </Typo>
            <Typo style={{textTransform:"capitalize"}} numberOfLines={1}>
              {title}
            </Typo>
           <Space space={5}/>
            <Typo l numberOfLines={1} bold style={{color:Theme.primaryColor}}>
              $ {price}
            </Typo>

          </View>
        </View>
    </View>
  );
}

export default ProductCardHorizontal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    flexDirection: "row",
  },
  blurContainer: {
    flexDirection: "row",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 10,
    flex:1
  },
  profile: {
    height: 35,
    width: 35,
    borderRadius: 100,
    marginRight: 5,
  },
});
