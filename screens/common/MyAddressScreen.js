import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ScrollView, Platform, Alert } from "react-native";
import HeaderTwoIcons from "../../components/Headers/HeaderTwoIcons";
import Theme from "../../src/Theme";
import CurveView from "../../components/utils/CurveView";
import FullButton from "../../components/Buttons/FullButton";
import InputBox from "../../components/utils/InputBox";
import Space from "../../components/utils/Space";
import AddressCard from "../../components/Cards/AddressCard";
import { windowHeight } from "../../src/ScreenSize";
import Typo from "../../components/utils/Typo";
import BottomSheet from "../../components/utils/BottomSheet";
import { addDoc, arrayUnion, collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { dbFS } from "../../config/firebase";
import useStore from "../../store";
import LoadingView from "../../components/utils/LoadingView";

function MyAddressScreen({ navigation }) {
  const [savedAddresses, setSavedAddresses] = useState([]);
  const userID = useStore((state) => state.userID);
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

  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        const docRef = doc(dbFS, "addresses", userID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSavedAddresses(docSnap.data().addresses);
        } else {
          console.log("No addresses found for this user");
        }
      } catch (error) {
        console.error("Error fetching addresses: ", error);
      }
    };
  
    fetchUserAddresses();
  }, [userID]); 

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
      setLoading(true)
      try {
        // Check if the document already exists
        const docRef = doc(dbFS, "addresses", userID);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          // If document exists, update the existing document by appending the new address
          await updateDoc(docRef, {
            addresses: arrayUnion({
              houseNo,
              street,
              city,
              postalCode,
            }),
          });
        } else {
          // If document doesn't exist, create a new document with the user's ID and initialize the "addresses" array
          await setDoc(docRef, { addresses: [{
            houseNo,
            street,
            city,
            postalCode,
          }] });
        }
  
        // Clear input fields after successful submission
        setHouseNo("");
        setStreet("");
        setCity("");
        setPostalCode("");
        addRef.current.close(); // Close the bottom sheet
      } catch (error) {
        console.error("Error adding document: ", error);
        // Handle error
        Alert.alert("Error", "Failed to add address. Please try again later.");
      }  
    } else {
      // Show error alert for the specific field that is missing
      if (newErrors.houseNo) {
        Alert.alert("Fields Required", newErrors.houseNo);
      } else if (newErrors.street) {
        Alert.alert("Fields Required", newErrors.street);
      } else if (newErrors.city) {
        Alert.alert("Fields Required", newErrors.city);
      } else if (newErrors.postalCode) {
        Alert.alert("Fields Required", newErrors.postalCode);
      }
      setLoading(false)
      setErrors(newErrors);
    }
    setLoading(false)
  };
  

  return (
    <View style={styles.container}>
      <HeaderTwoIcons
        handleRightIconPress={() => addRef.current.open()}
        rightIconName={"plus"}
        leftIcon={true}
        label={"My Saved Address"}
        rightIcon={true}
      />
      <CurveView>
        <View style={styles.body}>
          <View style={styles.gapper}>
            {savedAddresses &&
              savedAddresses.map((item, index) => {
                return (
                  <AddressCard
                    key={index}
                    address={`${item.street} , ${item.city} - ${item.postalCode}`}
                    title={item.houseNo}
                  />
                );
              })}
          </View>
        </View>
      </CurveView>

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

export default MyAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
  body: {
    flex: 1,
    padding: 10,
  },
  notificationSetting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: Theme.OutfitMedium,
  },
  gapper: {
    gap: 10,
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
