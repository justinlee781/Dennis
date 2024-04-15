import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  PanResponder,
  Animated,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import Swiper from "react-native-swiper";
import { windowHeight } from "../../src/ScreenSize";
import assets from "../../assets/assets";
import { Ionicons } from "@expo/vector-icons";
import Typo from "../../components/utils/Typo";
import Space from "../../components/utils/Space";
import Theme from "../../src/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FullButton from "../../components/Buttons/FullButton";
import FullButtonStroke from "../../components/Buttons/FullButtonStroke";
import useStore from "../../store";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { dbFS } from "../../config/firebase";
import LottieView from "lottie-react-native";

function ProductDetail({ route, navigation }) {
  const { item } = route.params;
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const userID = useStore((state) => state.userID);
  const pan = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const [documentData, setDocumentData] = useState(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) =>
        gestureState.dy > 0,
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dy > 0) {
          // Only allow downward movement
          Animated.event([null, { dy: pan }], { useNativeDriver: false })(
            event,
            gestureState
          );
        }
      },
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: 0,
          tension: 1,
          friction: 20,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const height = pan.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [windowHeight / 2, windowHeight / 3.2, windowHeight / 2],
    extrapolate: "clamp",
  });

  const getRandomImage = () => {
    const randomIndex = Math.random() < 0.5 ? 0 : 1; // Randomly pick 0 or 1
    return randomIndex === 0 ? assets.seller : assets.seller2;
  };

  const randomImage = getRandomImage();

  const handleUpdateSold = async () => {
    try {
      const pref = doc(dbFS, item.category, item.id);
      await updateDoc(pref, {
        adStatus: "sold",
      });

      console.log("Product marked as sold successfully");
      Alert.alert("Success", "Product marked as sold successfully");
      navigation.goBack();
    } catch (e) {
      console.error("Error marking product as sold:", error);
      Alert.alert(
        "Error",
        "An error occurred while marking the product as sold. Please try again later."
      );
    }
  };

  const confirmMarkAsSold = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to mark the item as sold?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: handleUpdateSold,
        },
      ]
    );
  };

  const handleDeleteAd = async () => {
    try {
      const pref = doc(dbFS, item.category, item.id);
      await deleteDoc(pref);

      console.log("Deleted");
      Alert.alert("Success", "Ad Deleted Successfully");
      navigation.goBack();
    } catch (e) {
      console.error("Error", error);
      Alert.alert("Error");
    }
  };

  const confirmDeleteProduct = () => {
    Alert.alert(
      "Delete the Listing",
      "Are you sure you want to delete this Listing? The action is irreversible.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: handleDeleteAd,
        },
      ]
    );
  };

  const getFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites !== null) {
        return JSON.parse(favorites);
      }
      return [];
    } catch (error) {
      console.error("Error retrieving favorites:", error);
      return [];
    }
  };

  const getCartItems = async () => {
    try {
      const cart = await AsyncStorage.getItem("cart");
      if (cart !== null) {
        return JSON.parse(cart);
      }
      return [];
    } catch (error) {
      console.error("Error retrieving cart:", error);
      return [];
    }
  };

  const handleAddToCart = async ()=>{
    try {
      const cart = await getCartItems();
      const updatedCart = [...cart, item];
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
      Alert.alert("Success", "Item added to cart!");
      navigation.navigate("MyCart")
    } catch (error) {
      console.error("Error adding to favorites:", error);
      Alert.alert(
        "Error",
        "An error occurred while adding to favorites. Please try again later."
      );
    }
  }

  const addToFavorites = async () => {
    try {
      const favorites = await getFavorites();
      const updatedFavorites = [...favorites, item];
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      Alert.alert("Success", "Item added to favorites!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      Alert.alert(
        "Error",
        "An error occurred while adding to favorites. Please try again later."
      );
    }
  };

  const confirmAddToFavorites = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to add this item to favorites?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: addToFavorites,
        },
      ]
    );
  };

  const checkIfInFavorites = async () => {
    const favorites = await getFavorites();
    const isInFavorites = favorites.some(
      (favorite) => favorite.id === item.id
    );
    setIsInFavorites(isInFavorites);
    checkIfInCart();
  };

  const checkIfInCart = async () => {

    const cart = await getCartItems();
    const isInCart = cart.some(
      (ct) => ct.id === item.id
    );
    console.log("Checking if in cart...",isInCart)
    setIsInCart(isInCart);
  };

const handleInitiateChat = async () => {
  try {
    // Check if a conversation with the participants already exists
    const conversationsQuery = query(collection(dbFS, "conversations"),
      where("participants", "array-contains-any", [userID, item.postedByUserID]));

    const conversationsSnapshot = await getDocs(conversationsQuery);

    if (!conversationsSnapshot.empty) {
      // Conversation already exists
      const existingConversationDoc = conversationsSnapshot.docs[0]; // Assuming there's only one matching conversation
      const existingConversationID = existingConversationDoc.id;
      
      console.log("Conversation already exists with ID: ", existingConversationID);
      
      // You can navigate to the ChattingScreen with the existing conversation ID
      navigation.navigate("ChattingScreen", {
        conversationID: existingConversationID,
        chatterDetail: {
          profilePic: placeholder,
          fullName: documentData.postedBy,
        },
      });
      
      return;
    }


    // If no existing conversation found, create a new one
    const newConversationDoc = await addDoc(collection(dbFS, 'conversations'), {
      buyerID: userID,
      sellerID: item.postedByUserID,
      participants: [
        userID,
        item.postedByUserID
      ],
      conversationStarted: serverTimestamp()
    });

    console.log("New conversation created with ID: ", newConversationDoc.id);
    navigation.navigate("ChattingScreen", {
      conversationID: newConversationDoc.id,
      chatterDetail: {
        profilePic: placeholder,
        fullName: documentData.postedBy,
      },
    });

  } catch (error) {
    console.error("Error initiating chat:", error);
    Alert.alert(
      "Error",
      "An error occurred while initiating the chat. Please try again later."
    );
  }
};


  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const docRef = doc(dbFS, item.category, item.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDocumentData(docSnap.data());
          setLoading(false);
        } else {
          console.log("No such document!");
          setDocumentData(null)
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        setLoading(false);
      }
    };

    fetchDocument();
  }, []);

  useEffect(() => {
    checkIfInFavorites(); 
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator size={"large"} color={Theme.primaryColor} />
      </View>
    );
  }

  if (!loading && !documentData) {
    return (
      <View
        style={[
          styles.container,
          { alignItems: "center", justifyContent: "center",paddingHorizontal:20 },
        ]}
      >
        <LottieView
          source={require("../../assets/empty.json")}
          style={styles.emptyStateAnimation}
          autoPlay
        />
        <Typo xl>Woopsie! Nothing here!</Typo>
        <Typo grey style={styles.emptyStateText}>
          Seems like the item got deleted or doesn't exist anymore. Try exploring some other
          items.
        </Typo>
        <Space space={25}/>
        <FullButton
          handlePress={() => navigation.goBack()}
          color={Theme.primaryColor}
          label={"Explore More"}
        />
      </View>
    );
  }




  return (
    <View style={styles.container}>
      <Animated.ScrollView
        height={height}
        style={{ flex: 1, height: height }}
        scrollEnabled={!isSwiping}
        {...panResponder.panHandlers}
      >
        <Animated.View
          height={height}
          style={[styles.swiper, { height: height }]}
        >
          {documentData.images.length > 1 ? (
            <Swiper
              activeDotColor="white"
              paginationStyle={{ bottom: 15 }}
              onMomentumScrollEnd={() => setIsSwiping(false)}
            >
              {documentData.images.map((item, index) => {
                return (
                  <Animated.Image
                    key={index}
                    source={{ uri: item }}
                    style={styles.banner}
                    height={height}
                  ></Animated.Image>
                );
              })}
            </Swiper>
          ) : (
            <Animated.Image
              source={{ uri: documentData.images[0] }}
              style={styles.banner}
              height={height}
            ></Animated.Image>
          )}
        </Animated.View>

        <View style={styles.transparentHeader}>
          <TouchableOpacity
            style={styles.iconPlaceholder}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back-outline" size={18} color="black" />
          </TouchableOpacity>
          {isInFavorites ? null : (
            <TouchableOpacity
              onPress={confirmAddToFavorites}
              style={styles.iconPlaceholder}
            >
              <Ionicons name="thumbs-up-outline" size={15} color="black" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.curveBottom}>
          <View style={{ flex: 1 }}>
            <Typo style={{ fontSize: 22, textTransform: "capitalize" }}>
              {documentData.adTitle}
            </Typo>
            <Space space={2} />
            <Typo m style={{ color: Theme.primaryColor }}>
              In {documentData.category}
            </Typo>
          </View>
          <View>
            <TouchableOpacity style={styles.pricebtm}>
              <Typo m white>
                $ {documentData.adPrice}
              </Typo>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ backgroundColor: "#f0f0f0", flex: 1 }}>
          <View style={styles.containerWrapper}>
            <Typo l style={{ marginLeft: 20 }}>
              Overview
            </Typo>
            <Space space={7} />
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                paddingHorizontal: 10,
              }}
            >
              <OverviewItem
                icon={"basket"}
                label={`Category : ${documentData.category}`}
              />
              <OverviewItem
                icon={"star"}
                label={`Condition : ${documentData.condition}`}
              />
              <OverviewItem
                icon={"accessibility"}
                label={`Brand : ${documentData.brand}`}
              />
            </View>
          </View>

          <View style={styles.containerWrapper}>
            <Typo l style={{ marginLeft: 20 }}>
              Description
            </Typo>
            <Space space={7} />
            <View style={{ paddingHorizontal: 20 }}>
              <Typo grey>{documentData.adDescription}</Typo>
            </View>
          </View>

          <View style={styles.containerWrapper}>
            <Typo l style={{ marginLeft: 20 }}>
              Seller Details
            </Typo>
            <Space space={7} />
            <View style={{ paddingHorizontal: 20, flexDirection: "row" }}>
              <Image source={randomImage} style={styles.sellerimage} />
              <View>
                <Typo>{documentData.postedBy.split(" ")[0]}</Typo>
                <Typo grey>No Reviews yet.</Typo>
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
      {documentData.postedByUserID === userID ? (
        <View style={[styles.bottomWrapper, { gap: 10 }]}>
          <View style={{ flex: 1 }}>
            <FullButtonStroke
              handlePress={confirmDeleteProduct}
              color={"black"}
              label={"Delete Listing"}
            />
          </View>
        </View>
      ) : (
        <View style={styles.bottomWrapper}>
          <View style={{ width: "32%" }}>
            <FullButtonStroke handlePress={handleInitiateChat} color={"black"} label={"Chat Now"} />
          </View>
          <View style={{ width: "66%" }}>
           {/* {isInCart ?
            <FullButton handlePress={()=>navigation.navigate("MyCart")} color={Theme.primaryColor} label={"Item Already In Cart"} />
           :
           <FullButton handlePress={handleAddToCart} color={Theme.primaryColor} label={"Add to Cart"} />} */}
            <FullButton handlePress={()=>navigation.replace("CreateAnOrder",{
              cartItems:[item]
            })} color={Theme.primaryColor} label={"Buy Now"} />
          </View>
        </View>
      )}
    </View>
  );
}
export default ProductDetail;

const OverviewItem = ({ icon, label }) => {
  return (
    <View style={styles.tag}>
      {icon ? <Ionicons name={icon} size={20} color="black" /> : null}
      <Typo s style={{ marginLeft: 5 }}>
        {label}
      </Typo>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  transparentHeader: {
    width: "100%",
    position: "absolute",
    top: 40,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  iconPlaceholder: {
    height: 35,
    width: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  curveBottom: {
    width: "100%",
    backgroundColor: "#FFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pricebtm: {
    backgroundColor: "black",
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 100,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  containerWrapper: {
    backgroundColor: "#FFF",
    marginTop: 10,
    paddingVertical: 10,
  },
  tag: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
    flexDirection: "row",
  },
  bottomWrapper: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingBottom: 20,
    justifyContent: "space-between",
    paddingTop: 15,
    borderTopColor: "#f7f7f7",
    borderTopWidth: 2,
  },
  sellerimage: {
    height: 45,
    width: 45,
    borderRadius: 100,
    backgroundColor: "#e5e5e5",
    marginRight: 10,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal:10
},
emptyStateAnimation: {
    height: 220,
    width: 160,
},
emptyStateText: {
    textAlign: 'center',
},
});

const placeholder = "https://cdn-icons-png.flaticon.com/128/236/236832.png";
