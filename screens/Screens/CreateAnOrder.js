import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import HeaderTwoIcons from "../../components/Headers/HeaderTwoIcons";
import CurveView from "../../components/utils/CurveView";
import Theme from "../../src/Theme";
import Typo from "../../components/utils/Typo";
import Space from "../../components/utils/Space";
import FullButton from "../../components/Buttons/FullButton";
import FullButtonStroke from "../../components/Buttons/FullButtonStroke";
import ProductCardHorizontal from "../../components/Cards/ProductCardHorizontal";
import { dbFS } from "../../config/firebase";

import {
  PlatformPayButton,
  usePlatformPay,
  PlatformPay,
  useStripe,
} from "@stripe/stripe-react-native";
import axios from "axios";
import useStore from "../../store";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import AddressCard from "../../components/Cards/AddressCard";
import BottomSheet from "../../components/utils/BottomSheet";
import { windowHeight } from "../../src/ScreenSize";
import InputBox from "../../components/utils/InputBox";
import LoadingView from "../../components/utils/LoadingView";

function CreateAnOrder({ navigation, route }) {
  const userData = useStore((state) => state.userData);
  const { cartItems } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [total, setTotal] = useState(0);
  const [shippingFee] = useState(10);
  const [platformPercentage] = useState(0.05); //5% fees
  const [platformCharges, setPlatformCharges] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    houseNo: "",
    street: "",
    city: "",
    postalCode: "",
  });
  const addRef = useRef();

  // const {
  //   isPlatformPaySupported,
  //   confirmPlatformPayPayment,
  //   updateUsersRemainigQuestions,
  // } = usePlatformPay();

  const calculateTotal = () => {
    const totalPrice = cartItems.reduce(
      (acc, curr) => acc + parseFloat(curr.adPrice),
      0
    );
    const platformFee = totalPrice * platformPercentage;
    const totalIncludingFees = totalPrice + shippingFee + platformFee;
    setTotal(totalIncludingFees);
    setPlatformCharges(platformFee);
  };

  
  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const fetchPaymentSheetParams = async () => {
    try {
      const res = await axios.post(
        "https://createpaymentintent-77lo2hwf4a-uc.a.run.app",
        { price: total, userId: userData.userID }
      );

      if (res.data?.paymentIntent) {
        const { paymentIntent, ephemeralKey, customerId } = res.data;
        return {
          paymentIntent,
          ephemeralKey,
          customerId,
        };
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  const initializePaymentSheet = async () => {
    setLoading(true);
    const { paymentIntent, ephemeralKey, customerId, publishableKey } =
      await fetchPaymentSheetParams();
    const { error } = await initPaymentSheet({
      merchantDisplayName: "iMarketPlace",
      customerId: customerId,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "iMarketPlace",
      },
    });
    setLoading(false);
  };

  const openPaymentSheet = async () => {
    await initializePaymentSheet();

    const { error } = await presentPaymentSheet();

    if (error) {
      console.log(`Error code: ${error.code}`, error.message);
      setLoading(false);
    } else {
      try {
        setLoading(true);
        const totalOrderValue = total;
        const platformFee = platformCharges;
        const remainingAmount = totalOrderValue - platformFee;
        let res = await axios.post(
          "https://transfermoney-77lo2hwf4a-uc.a.run.app",
          {
            amount: remainingAmount,
            userId: cartItems[0]?.postedByUserID,
          }
        );
        if (res.data.status === "OK") {
          navigation.replace("OrderConfirmation", {
            cartItems: cartItems,
            total: total,
            selectedAddress: selectedAddress,
            txnDetails: res.data,
            shippingFee:shippingFee,
            platformCharges:platformCharges
          });
        } else {
          Alert.alert(
            "Payment Failed",
            "There has been an error in making the payment. Please contact support"
          );
        }
      } catch (e) {
        console.log(e.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePayment = async () => {
    if (selectedAddress) {
      setLoading(true);
      openPaymentSheet();
    } else {
      Alert.alert(
        "Address Not Selected",
        "Please Select an Address or Add a new One!"
      );
    }
  };

  const handleAddressSelection = (address) => {
    setSelectedAddress(address);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(dbFS, "addresses", userData.userID),
      (snapshot) => {
        if (snapshot.exists()) {
          const addresses = snapshot.data().addresses || [];
          setSavedAddresses(addresses);
        } else {
          console.log("No addresses found for this user");
          setSavedAddresses([]); // Set savedAddresses to an empty array
        }
      }
    );

    return () => unsubscribe();
  }, [userData.userID]);

  const handleAddAddress = async () => {
    let formValid = true;
    const newErrors = {};

    if (!houseNo.trim()) {
      newErrors.houseNo = "House number is required";
      formValid = false;
    }

    if (!street.trim()) {
      newErrors.street = "Street is required";
      formValid = false;
    }

    if (!city.trim()) {
      newErrors.city = "City is required";
      formValid = false;
    }

    if (!postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
      formValid = false;
    }

    if (formValid) {
      setLoading(true);
      try {
        // Check if the document already exists
        const docRef = doc(dbFS, "addresses", userData.userID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          await updateDoc(docRef, {
            addresses: arrayUnion({
              houseNo,
              street,
              city,
              postalCode,
            }),
          });
        } else {
          await setDoc(docRef, {
            addresses: [
              {
                houseNo,
                street,
                city,
                postalCode,
              },
            ],
          });
        }

        setHouseNo("");
        setStreet("");
        setCity("");
        setPostalCode("");
        addRef.current.close();
      } catch (error) {
        console.error("Error adding document: ", error);
        // Handle error
        Alert.alert("Error", "Failed to add address. Please try again later.");
      }
    } else {
      if (newErrors.houseNo) {
        Alert.alert("Fields Required", newErrors.houseNo);
      } else if (newErrors.street) {
        Alert.alert("Fields Required", newErrors.street);
      } else if (newErrors.city) {
        Alert.alert("Fields Required", newErrors.city);
      } else if (newErrors.postalCode) {
        Alert.alert("Fields Required", newErrors.postalCode);
      }
      setLoading(false);
      setErrors(newErrors);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <HeaderTwoIcons
        leftIcon={true}
        label={"Confirm your order"}
        rightIcon={false}
      />
      <CurveView
        style={{
          paddingHorizontal: 10,
          flex: 1,
        }}
      >
        <Space space={5} />

        <View style={styles.cardsContainer}>
          {cartItems &&
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
              </View>
            ))}
        </View>
        <Space space={15} />
        <Typo l>Select Your Address</Typo>
        <View style={styles.gapper}>
          {savedAddresses.length > 0 ? (
            savedAddresses.map((item, index) => (
              <TouchableOpacity
                onPress={() => handleAddressSelection(item)}
                style={[
                  styles.addressCard,
                  selectedAddress === item && {
                    borderColor: "green",
                    borderWidth: 2,
                    borderRadius: 10,
                  },
                ]}
                key={index}
              >
                <AddressCard
                  key={index}
                  address={`${item.street} , ${item.city} - ${item.postalCode}`}
                  title={item.houseNo}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Typo>No addresses found</Typo>
          )}
        </View>
        <Space space={10} />
        <FullButtonStroke
          label={"Add New Address"}
          handlePress={() => addRef.current.open()}
          color={Theme.primaryColor}
        />
      </CurveView>
      <TotalBar
        cartItems={cartItems}
        total={total}
        shippingFee={shippingFee}
        platformCharges={platformCharges}
      />
      <View
        style={{
          paddingBottom: 20,
          backgroundColor: "#ffffff",
          paddingHorizontal: 15,
          paddingTop: 10,
        }}
      >
        <FullButton
          handlePress={() => handlePayment()}
          color={Theme.primaryColor}
          loading={loading ? true : false}
          label={"Buy Now"}
        />
      </View>
      {loading ? <LoadingView /> : false}
      <BottomSheet windowHeight={windowHeight / 1.1} sheetRef={addRef}>
        <View style={styles.wrapper}>
          <View>
            <Typo xl>Add Your Address</Typo>
            <Typo grey>Enter your details below and save.</Typo>
          </View>
          <View style={{ width: 25 }} />
        </View>
        <ScrollView>
          <InputBox
            keyboardType={"numeric"}
            label={"H.No"}
            placeholder={"House Number"}
            value={houseNo}
            onChangeText={(text) => setHouseNo(text)}
            errorMessage={errors.houseNo}
          />
          <Space space={15} />
          <InputBox
            label={"Street"}
            placeholder={"Street"}
            value={street}
            onChangeText={(text) => setStreet(text)}
            errorMessage={errors.street}
          />
          <Space space={15} />
          <InputBox
            label={"City"}
            placeholder={"City"}
            value={city}
            onChangeText={(text) => setCity(text)}
            errorMessage={errors.city}
          />
          <Space space={15} />
          <InputBox
            keyboardType={"numeric"}
            label={"Postal Code"}
            placeholder={"Postal Code"}
            value={postalCode}
            onChangeText={(text) => setPostalCode(text)}
            errorMessage={errors.postalCode}
          />
          <Space space={15} />
        </ScrollView>
        <View style={styles.flexBases}>
          <FullButton
            loading={loading}
            handlePress={handleAddAddress}
            label={"Save"}
            color={Theme.primaryColor}
          />
        </View>
      </BottomSheet>
    </View>
  );
}
export default CreateAnOrder;

const TotalBar = ({ total, cartItems, shippingFee, platformCharges }) => {
  const totalPrice = cartItems.reduce(
    (acc, curr) => acc + parseFloat(curr.adPrice),
    0
  );

  return (
    <View style={styles.totalBar}>
      <View style={styles.totalRow}>
        <Typo style={styles.totalLabel}>Total Items:</Typo>
        <Typo style={styles.totalAmount}>${totalPrice.toFixed(2)}</Typo>
      </View>
      <View style={styles.totalRow}>
        <Typo style={styles.totalLabel}>Shipping Fee:</Typo>
        <Typo style={styles.totalAmount}>${shippingFee.toFixed(2)}</Typo>
      </View>
      <View style={styles.totalRow}>
        <Typo style={styles.totalLabel}>Platform Charges:</Typo>
        {platformCharges != null ? (
          <Typo style={styles.totalAmount}>${platformCharges.toFixed(2)}</Typo>
        ) : null}
      </View>
      <View style={styles.totalRow}>
        <Typo l bold style={[styles.totalLabel, styles.totalBold]}>
          Total:
        </Typo>
        <Typo l bold style={[styles.totalAmount, styles.totalBold]}>
          ${total.toFixed(2)}
        </Typo>
      </View>
    </View>
  );
};

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
  totalBar: {
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 2,
    borderTopColor: "#e5e5e5",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  totalLabel: {
    color: "#333",
  },
  totalAmount: {
    color: "#333",
  },
  totalBold: {
    fontWeight: "bold",
  },
  gapper: {
    gap: 10,
    flexDirection: "row",
    marginTop: 5,
  },
  addressCard: {
    flex: 1,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 15,
    width: "100%",
  },
  icon: {
    height: 35,
    width: 35,
    resizeMode: "contain",
  },
  flexBases: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    paddingBottom: Platform.OS === "ios" ? 15 : 0,
  },
  mapView: {
    width: "100%",
    height: 150,
    marginBottom: 15,
    borderRadius: 15,
  },
  map: {
    height: "100%",
    width: "100%",
  },
});
