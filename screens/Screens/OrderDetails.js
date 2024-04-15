import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import CustomHeader from "../../components/Headers/CustomHeader";
import Theme from "../../src/Theme";
import Typo from "../../components/utils/Typo";
import LineBar from "../../components/utils/LineBar";
import FullButton from "../../components/Buttons/FullButton";
import useStore from "../../store";
import CurveView from "../../components/utils/CurveView";
import {
  addDoc,
  collection,
  doc,
  runTransaction,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { dbFS } from "../../config/firebase";
import InputBox from "../../components/utils/InputBox";
import Space from "../../components/utils/Space";
import BottomSheet from "../../components/utils/BottomSheet";
import { windowHeight } from "../../src/ScreenSize";
import { Ionicons } from "@expo/vector-icons";

function OrderDetails({ navigation, route }) {
  const { order } = route.params;
  const userID = useStore((state) => state.userID);
  const [trackingID, setTrackingID] = useState("");
  const [courierCompany, setCourierCompany] = useState("");
  const [comments, setComments] = useState("");
  const reviewRef = useRef();
  const [loading, setLoading] = useState(false);
  console.log(order.buyerID, order.sellerID);

  const [communicationRating, setCommunicationRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [otherRating, setOtherRating] = useState(0);

  const handleRating = (criteria, rating) => {
    switch (criteria) {
      case "communication":
        setCommunicationRating(rating);
        break;
      case "quality":
        setQualityRating(rating);
        break;
      case "other":
        setOtherRating(rating);
        break;
      default:
        break;
    }
  };

  const renderStars = (criteria) => {
    let rating = 0;
    switch (criteria) {
      case "communication":
        rating = communicationRating;
        break;
      case "quality":
        rating = qualityRating;
        break;
      case "other":
        rating = otherRating;
        break;
      default:
        break;
    }

    const ratingArray = [];
    for (let i = 1; i <= 5; i++) {
      ratingArray.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleRating(criteria, i)}
          style={{ marginRight: 5 }}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={30}
            color={i <= rating ? "orange" : "gray"}
          />
        </TouchableOpacity>
      );
    }
    return ratingArray;
  };

  function convertTimestampToDate(timestamp) {
    const { seconds, nanoseconds } = timestamp;
    const milliseconds = seconds * 1000 + nanoseconds / 1000000;
    const date = new Date(milliseconds);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const finishOrder = async () => {
    try {
      if (!trackingID || !courierCompany || !comments) {
        // Alert if any of the required fields are missing
        Alert.alert(
          "Incomplete Information",
          "Please enter tracking details, courier company, and comments."
        );
        return;
      }

      // Display confirmation dialog
      const confirmed = Alert.alert(
        "Mark Order Complete",
        "Are you sure you want to mark this order as complete?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              try {
                await updateDoc(doc(dbFS, "orders", order.id), {
                  orderStatus: "completed",
                  trackingDetails: {
                    trackingID,
                    courierCompany,
                    comments,
                  },
                });
                Alert.alert("Success", "Order marked as complete.");
                navigation.goBack();
              } catch (error) {
                console.error("Error marking order as complete:", error);
                Alert.alert(
                  "Error",
                  "Failed to mark order as complete. Please try again."
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error marking order as complete:", error);
      Alert.alert(
        "Error",
        "Failed to mark order as complete. Please try again."
      );
    }
  };

  const handleSubmitRating = async () => {
    if (communicationRating === 0 || qualityRating === 0 || otherRating === 0) {
      Alert.alert(
        "Incomplete Ratings",
        "Please provide ratings for all criteria."
      );
      return;
    }
    const totalRating = communicationRating + qualityRating + otherRating;
    const averageRating = totalRating / 3;

    try {
      setLoading(true);
      const feedbackRef = doc(dbFS, "ratings", order.sellerID);

      await runTransaction(dbFS, async (transaction) => {
        const docSnapshot = await transaction.get(feedbackRef);

        if (!docSnapshot.exists()) {
          // Create new document if it doesn't exist
          await setDoc(feedbackRef, {
            ratings: {
              [order.buyerID]: averageRating,
            },
          });
        } else {
          // Update existing document with new ratings
          const ratings = docSnapshot.data().ratings || {};
          ratings[order.buyerID] = averageRating;

          await updateDoc(feedbackRef, {
            ratings,
          });
        }
      });

      const currentOrderRef = doc(dbFS, "orders", order.id);
      await updateDoc(currentOrderRef, {
        feedbackLeft: true,
        feedbackRating: {
          responsivenessRating: otherRating,
          communicationRating,
          qualityRating,
        },
      });

      Alert.alert("Feedback Submitted", "Thank you for your feedback!");
      reviewRef.current.close();
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Alert.alert("Error", "Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        // sublabel={`#${order.id}`}
        label={`Order Details`}
        hasBackButton={true}
        rightIcon={"headphones"}
        rightIconPress={() =>
          Alert.alert("Need help?", "Email us at : lee.justin781@gmail.com")
        }
      />
      <CurveView style={{ paddingHorizontal: 15 }}>
        <ProductCard productDetails={order.productAllDetails} />
        <LineBar margin={10} />

        {order.trackingDetails ? (
          <>
            <View style={{ flexDirection: "row", gap: 15 }}>
              <View style={{ flex: 1 }}>
                <Typo bold style={{ color: Theme.primaryColor }}>
                  Tracking ID
                </Typo>
                <Typo>{order.trackingDetails.trackingID}</Typo>
              </View>
              <View style={{ flex: 1 }}>
                <Typo bold style={{ color: Theme.primaryColor }}>
                  Courier Company
                </Typo>
                <Typo>{order.trackingDetails.courierCompany}</Typo>
              </View>
            </View>
            <Space space={10} />
            <Typo bold style={{ color: Theme.primaryColor }}>
              Comments
            </Typo>
            <Typo>{order.trackingDetails.comments}</Typo>
            <Space space={5} />
            {userID === order.buyerID &&
            (order.feedbackLeft === false ||
              order.feedbackLeft === null ||
              order.feedbackLeft === undefined) ? (
              <TouchableOpacity onPress={() => reviewRef.current.open()}>
                <Typo
                  bold
                  style={{
                    color: "#cf8715",
                    textDecorationLine: "underline",
                  }}
                >
                  Leave Feedback
                </Typo>
              </TouchableOpacity>
            ) : (
              <>
                <StarRating
                  rating={
                    (order.feedbackRating.communicationRating +
                      order.feedbackRating.qualityRating +
                      order.feedbackRating.responsivenessRating) /
                    3
                  }
                />

                <Typo style={{ color: "#cf8715" }}>
                  Feedback has already been provided for this order.
                </Typo>
              </>
            )}
          </>
        ) : (
          <>
            {userID === order.sellerID ? (
              <>
                <View style={{ flexDirection: "row", gap: 15 }}>
                  <View style={{ flex: 1 }}>
                    <InputBox
                      label={"Attach Tracking Details"}
                      placeholder={"Tracking ID"}
                      onChangeText={(t) => setTrackingID(t)}
                      value={trackingID}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <InputBox
                      label={"Courier Company"}
                      placeholder={"Company Name"}
                      onChangeText={(t) => setCourierCompany(t)}
                      value={courierCompany}
                    />
                  </View>
                </View>
                <Space space={10} />
                <InputBox
                  label={"Any Comments"}
                  placeholder={"Any comments to the buyer"}
                  onChangeText={(t) => setComments(t)}
                  value={comments}
                />
              </>
            ) : null}
          </>
        )}
        <LineBar margin={10} />
        <Typo bold>#{order.id}</Typo>
        <Typo l bold style={{ color: Theme.primaryColor }}>
          {convertTimestampToDate(order.orderPlacedOn).toLocaleString()}
        </Typo>
        <LineBar margin={10} />
        <Typo>Delivery Address</Typo>
        <Typo
          grey
        >{`${order.shippingAddress.houseNo}, ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`}</Typo>
        <LineBar margin={10} />
        <Typo>Payment Mode</Typo>
        <Typo grey>Stripe Connect</Typo>
        <LineBar margin={10} />
        <Typo>Order Status</Typo>
        <Typo style={{ textTransform: "uppercase" }} bold>
          {order.orderStatus}
        </Typo>

        <View style={styles.section}>
          <Typo l bold>
            Order Summary
          </Typo>
          <View style={styles.row}>
            <Typo>Item Price</Typo>
            <Typo>${order.productAllDetails.adPrice}</Typo>
          </View>
          <View style={styles.row}>
            <Typo>Shipping</Typo>
            <Typo>${order.shippingFee.toFixed(2)}</Typo>
          </View>
          <View style={styles.row}>
            <Typo>Platform Fee</Typo>
            <Typo>${order.platformCharges.toFixed(2)}</Typo>
          </View>
          <View style={styles.stripe} />
          <View style={styles.row}>
            <Typo l bold style={{ color: Theme.primaryColor }}>
              Grand Total:
            </Typo>
            <Typo l bold style={{ color: Theme.primaryColor }}>
              ${order.orderTotal.toFixed(2)}
            </Typo>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Image
            style={{
              height: 40,
              width: 40,
              resizeMode: "contain",
              marginRight: 10,
            }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/4238/4238137.png",
            }}
          />
          <View>
            <Typo l>Need assistance? </Typo>
            <Typo style={{ color: Theme.primaryColor }}>
              lee.justin781@gmail.com
            </Typo>
          </View>
        </View>
        <Space space={35} />
      </CurveView>
      {order.trackingDetails ? null : (
        <View
          style={{
            padding: 10,
            backgroundColor: "#f7f7f7",
            flexDirection: "row",
            gap: 10,
          }}
        >
          {order.sellerID === userID ? (
            <>
              {/* <View style={{flex:1}}>
        <FullButton color={"black"} label={"Attach Files"} />
        </View> */}
              <View style={{ flex: 1 }}>
                <FullButton
                  handlePress={finishOrder}
                  color={Theme.primaryColor}
                  label={"Finish Order"}
                />
              </View>
            </>
          ) : null}
        </View>
      )}

      <BottomSheet windowHeight={windowHeight / 3} sheetRef={reviewRef}>
        <Typo bold xl>
          Leave a Feedback
        </Typo>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginTop: 20,
            }}
          >
            <View style={{ alignItems: "flex-start" }}>
              <Typo style={{ marginBottom: 10 }}>Communication:</Typo>
              <Typo style={{ marginBottom: 10 }}>Quality:</Typo>
              <Typo style={{ marginBottom: 10 }}>Responsiveness:</Typo>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <View style={{ flexDirection: "row" }}>
                {renderStars("communication")}
              </View>
              <View style={{ flexDirection: "row" }}>
                {renderStars("quality")}
              </View>
              <View style={{ flexDirection: "row" }}>
                {renderStars("other")}
              </View>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end", width: "100%" }}>
          <FullButton
            loading={loading}
            handlePress={handleSubmitRating}
            color={Theme.primaryColor}
            label={"Submit"}
          />
        </View>
      </BottomSheet>
    </View>
  );
}
export default OrderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
  body: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  section: {
    marginVertical: 10,
    borderWidth: 1,
    padding: 8,
    borderRadius: 15,
    borderColor: "#e5e5e5",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
    justifyContent: "space-between",
  },
  stripe: {
    height: 1,
    backgroundColor: "gray",
    marginVertical: 10,
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 9,
    marginBottom: 10,
    shadowColor: "#7c7c7c",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 25,
  },
  detailsContainer: {
    marginLeft: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
  },
});

function ProductCard({ productDetails }) {
  const { adTitle, category, images, condition, brand } = productDetails;

  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: images[0] }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Typo style={styles.title}>{adTitle}</Typo>
        <Typo grey style={styles.label}>
          Category: {category}
        </Typo>
        <Typo grey style={styles.label}>
          Brand: {brand}
        </Typo>
        <Typo grey style={styles.label}>
          Condition: {condition}
        </Typo>
      </View>
    </View>
  );
}

const StarRating = ({ rating }) => {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;

  const renderStars = () => {
    let stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < filledStars) {
        stars.push(<Ionicons key={i} name="star" size={24} color="#cf8715" />);
      } else if (hasHalfStar && i === filledStars) {
        stars.push(
          <Ionicons key={i} name="star-half" size={24} color="#cf8715" />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={24} color="#cf8715" />
        );
      }
    }

    return stars;
  };

  return <View style={{ flexDirection: "row" }}>{renderStars()}</View>;
};
