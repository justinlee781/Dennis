import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import HeaderTwoIcons from "../../components/Headers/HeaderTwoIcons";
import CurveView from "../../components/utils/CurveView";
import Theme from "../../src/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Typo from "../../components/utils/Typo";
import Space from "../../components/utils/Space";
import LottieView from "lottie-react-native";
import FullButton from "../../components/Buttons/FullButton";
import { Feather } from "@expo/vector-icons";
import ProductCardHorizontal from "../../components/Cards/ProductCardHorizontal";


import useStore from "../../store";

function MyLikedItems({ navigation }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cart = await AsyncStorage.getItem("cart");
        if (cart !== null) {
          setCartItems(JSON.parse(cart));
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const removeItemFromCart = async (index) => {
    try {
      const updatedCart = [...cartItems];
      updatedCart.splice(index, 1);
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const confirmRemoveItem = (index) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to remove this item from cart?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => removeItemFromCart(index),
        },
      ]
    );
  };
 

  return (
    <View style={styles.container}>
      <HeaderTwoIcons leftIcon={true} label={"My Cart"} rightIcon={false} />
      <CurveView
        style={{
          paddingHorizontal: 10,
          flex: 1,
        }}
      >
        <Space space={5} />

        <View style={styles.cardsContainer}>
          {cartItems.length > 0 ? (
            cartItems.map((doc, index) => (
              <View key={index} style={styles.cardWrapper}>
                <ProductCardHorizontal
                  price={doc.adPrice}
                  img={doc.images[0]}
                  title={doc.adTitle}
                  postDate={doc.postedDate}
                  brand={doc.brand}
                  handleImagePress={() =>
                    navigation.navigate("ProductDetail", { item: doc })
                  }
                />
                <TouchableOpacity
                  onPress={() => confirmRemoveItem(index)}
                  style={styles.corner}
                >
                  <Feather name="x" size={20} color="black" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <LottieView
                source={require("../../assets/empty.json")}
                style={styles.emptyStateAnimation}
                autoPlay
              />
              <Typo xl>Woopsie! Nothing here!</Typo>
              <Typo grey style={styles.emptyStateText}>
                Seems like there are no listings yet. Try exploring some other
                category.
              </Typo>
              <Space space={15}/>
              <FullButton
                handlePress={() => navigation.goBack()}
                color={Theme.primaryColor}
                label={"Explore More Categories"}
              />
            </View>
          )}
        </View>
      </CurveView>
      <View
        style={{
          paddingBottom: 20,
          backgroundColor: "#ffffff",
          paddingHorizontal: 15,
        }}
      >
        <FullButton
          handlePress={() => navigation.navigate("CreateAnOrder",{
            cartItems
          })}
          color={Theme.primaryColor}
          label={"Buy Now"}
        />
      </View>
    </View>
  );
}
export default MyLikedItems;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
    // justifyContent: "space-between",
  },
  cardsContainer: {
    paddingHorizontal: 5,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  cardWrapper: {
    width: "100%",
    borderRadius: 12,
    marginTop: 5,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  emptyStateAnimation: {
    height: 220,
    width: 160,
  },
  emptyStateText: {
    textAlign: "center",
  },
  corner: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 100,
    padding: 5,
  },
});
