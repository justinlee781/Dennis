import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import HeaderTwoIcons from "../../components/Headers/HeaderTwoIcons";
import CurveView from "../../components/utils/CurveView";
import Theme from "../../src/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Typo from "../../components/utils/Typo";
import Space from "../../components/utils/Space";
import ProductCard from "../../components/Cards/ProductCard";
import LottieView from "lottie-react-native";
import FullButton from "../../components/Buttons/FullButton";
import { Feather } from '@expo/vector-icons';


function MyLikedItems({ navigation }) {
  const [favoriteItems, setFavoriteItems] = useState([]);

  useEffect(() => {
    const fetchFavoriteItems = async () => {
      try {
        const favorites = await AsyncStorage.getItem("favorites");
        if (favorites !== null) {
          setFavoriteItems(JSON.parse(favorites));
        }
      } catch (error) {
        console.error("Error fetching favorite items:", error);
      }
    };

    fetchFavoriteItems();
  }, []);


  const removeItemFromFavorites = async (index) => {
    try {
      const updatedFavorites = [...favoriteItems];
      updatedFavorites.splice(index, 1);
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setFavoriteItems(updatedFavorites);
    } catch (error) {
      console.error("Error removing item from favorites:", error);
    }
  };

  const confirmRemoveItem = (index) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to remove this item from favorites?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => removeItemFromFavorites(index),
        },
      ]
    );
  };


  return (
    <View style={styles.container}>
      <HeaderTwoIcons
        leftIcon={true}
        label={"My Liked Items"}
        rightIcon={false}
      />
      <CurveView style={{ paddingHorizontal: 10 }}>
        <Space space={5} />

        <View style={styles.cardsContainer}>
          {favoriteItems.length > 0 ? (
            favoriteItems.map((doc, index) => (
              <View key={index} style={styles.cardWrapper}>
                <ProductCard
                  price={doc.adPrice}
                  img={doc.images[0]}
                  title={doc.adTitle}
                  postDate={doc.postedDate}
                  brand={doc.brand}
                  handleImagePress={() =>
                    navigation.navigate("ProductDetail", { item: doc })
                  }
                />
                <TouchableOpacity onPress={() => confirmRemoveItem(index)} style={styles.corner}>
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
              <FullButton
                handlePress={() => navigation.goBack()}
                color={Theme.primaryColor}
                label={"Explore More Categories"}
              />
            </View>
          )}
        </View>
      </CurveView>
    </View>
  );
}
export default MyLikedItems;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
  cardsContainer: {
    paddingHorizontal: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  cardWrapper: {
    width: "48%",
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
  corner:{
    position:'absolute',
    top:5,
    right:5,
    backgroundColor:'rgba(255,255,255,1)',
    borderRadius:100,
    padding:5
  }
});
