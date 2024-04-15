import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import CustomHeader from "../../components/Headers/CustomHeader";
import Theme from "../../src/Theme";
import CurveView from "../../components/utils/CurveView";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { dbFS } from "../../config/firebase";
import useStore from "../../store";
import { Ionicons } from "@expo/vector-icons";
import Typo from "../../components/utils/Typo";
import FullButtonStroke from "../../components/Buttons/FullButtonStroke";
import Space from "../../components/utils/Space";
import { useNavigation } from "@react-navigation/native";
import FilterTags from "../../components/utils/FilterTags";

function SPOrders({ navigation }) {
  const userID = useStore((state) => state.userID);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedTag, setSelectedTag] = useState("Buying");
  const handleTagPress = (item) => {
    setSelectedTag(item);
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedTag]);

  const fetchOrders = async () => {
    try {
      const colRef = collection(dbFS, "orders");
      let q;

      if (selectedTag === "Buying") {
        // If selected tag is "Buying", query based on buyerID
        q = query(colRef, where("buyerID", "==", userID));
      } else {
        // If selected tag is "Selling", query based on sellerID
        q = query(colRef, where("sellerID", "==", userID));
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedOrders = [];
        snapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() });
        });
        setOrders(fetchedOrders);
        setLoading(false); // Set loading to false after fetching orders
      });

      // Return the unsubscribe function to stop listening for changes when component unmounts
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false); // Set loading to false if there's an error
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader label={`My Orders`} />
      <View
        style={{
          paddingHorizontal: 10,
          paddingTop: 12,
          backgroundColor: "#fff",
          flex: 1,
        }}
      >
        <FilterTags
          onTagPress={handleTagPress}
          selectedTag={selectedTag}
          tags={["Buying", "Selling"]}
        />
        <Space space={15} />
        {loading ? (
          <ActivityIndicator color={Theme.primaryColor} />
        ) : orders.length === 0 ? (
          <Typo>No orders yet</Typo>
        ) : (
          <>
            <FlatList
              data={orders}
              renderItem={({ item }) => <OrderCard order={item} />}
              keyExtractor={(item) => item.id}
            />
          </>
        )}
      </View>
    </View>
  );
}

export default SPOrders;

const OrderCard = ({ order }) => {
  const { adPrice, adTitle, brand, condition } = order.productAllDetails;
  const { orderPlacedOn, orderStatus, orderTotal } = order;

  function formatTimestamp(timestamp) {
    const currentDate = new Date();
    const secondsAgo = (currentDate.getTime() - timestamp.toMillis()) / 1000;

    if (secondsAgo < 60) {
      return "Just now";
    } else if (secondsAgo < 3600) {
      const minutes = Math.floor(secondsAgo / 60);
      return minutes === 1 ? "1 min ago" : `${minutes} mins ago`;
    } else if (secondsAgo < 86400) {
      const hours = Math.floor(secondsAgo / 3600);
      return hours === 1 ? "1 h ago" : `${hours} hrs ago`;
    } else if (secondsAgo < 2592000) {
      const days = Math.floor(secondsAgo / 86400);
      return days === 1 ? "1 day ago" : `${days} days ago`;
    } else if (secondsAgo < 31536000) {
      const months = Math.floor(secondsAgo / 2592000);
      return months === 1 ? "1 month ago" : `${months} months ago`;
    } else {
      const years = Math.floor(secondsAgo / 31536000);
      return years === 1 ? "1 year ago" : `${years} years ago`;
    }
  }

  const navigation = useNavigation();
  return (
    <View
      style={{
        marginBottom: 15,
        borderRadius: 15,
        paddingBottom: 10,
        backgroundColor: "#f8f8f8",
        borderWidth: 1,
        borderColor: "#e5e5e5",
      }}
    >
      <TouchableOpacity style={styles.cardContainer}>
        <View style={styles.detailsContainer}>
          <Typo style={styles.title}>{adTitle}</Typo>
          <View style={{ flex: 1, flexDirection: "row", gap: 15 }}>
            <View style={styles.rowContainer}>
              <Ionicons
                name="pricetag"
                size={16}
                color={Theme.primaryColor}
                style={styles.icon}
              />
              <Typo style={styles.subtitle}>{`$${adPrice}`}</Typo>
            </View>
            <View style={styles.rowContainer}>
              <Ionicons
                name="business"
                size={16}
                color={Theme.primaryColor}
                style={styles.icon}
              />
              <Typo style={styles.subtitle}>{brand}</Typo>
            </View>
            <View style={styles.rowContainer}>
              <Ionicons
                name="information-circle"
                size={16}
                color={Theme.primaryColor}
                style={styles.icon}
              />
              <Typo style={styles.subtitle}>{condition}</Typo>
            </View>
          </View>
        </View>
        {/* <View style={styles.imageContainer}>
          <Image source={{ uri: images[0] }} style={styles.image} />
        </View> */}
      </TouchableOpacity>
      <View style={{ paddingHorizontal: 10 }}>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between",
            borderRadius: 5,
            gap: 10,
          }}
        >
          <View style={styles.tagger}>
            <Typo s bold>
              Placed
            </Typo>
           {orderPlacedOn ?  <Typo>{formatTimestamp(orderPlacedOn)}</Typo> : null}
          </View>

          <View style={[styles.tagger,{
            backgroundColor:orderStatus ==="completed" ? Theme.secondaryColor : "#c9a37b"
          }]}>
            <Typo s bold>
              Status
            </Typo>
            <Typo style={{ textTransform: "capitalize" }}>{orderStatus}</Typo>
          </View>

          <View style={styles.tagger}>
            <Typo s bold>
              Order Total
            </Typo>
            <Typo>${orderTotal.toFixed(2)}</Typo>
          </View>
        </View>
        <Space space={10}></Space>
        <FullButtonStroke
          handlePress={() =>
            navigation.navigate("OrderDetails", {
              order,
            })
          }
          color={Theme.primaryColor}
          label={"View Order Details"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
  cardContainer: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 10,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 55,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 19,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    marginBottom: 5,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 5,
  },
  tagger: {
    backgroundColor: Theme.secondaryColor,
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    paddingVertical: 5,
  },
});
