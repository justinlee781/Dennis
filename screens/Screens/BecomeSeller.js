import React, { useEffect } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import CustomHeader from "../../components/Headers/CustomHeader";
import CurveView from "../../components/utils/CurveView";
import Theme from "../../src/Theme";
import useStore from "../../store";
import assets from "../../assets/assets";
import Typo from "../../components/utils/Typo";
import FullButton from "../../components/Buttons/FullButton";
import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { dbFS } from "../../config/firebase";

const StepCard = ({ stepNumber, title, description }) => {
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepNumberContainer}>
        <Typo style={styles.stepNumber}>{stepNumber}</Typo>
      </View>
      <View style={styles.stepContent}>
        <Typo style={styles.stepTitle}>{title}</Typo>
        <Typo style={styles.stepDescription}>{description}</Typo>
      </View>
    </View>
  );
};

function BecomeSeller() {
  const navigation = useNavigation(); // Get navigation object
  const userData = useStore((state) => state.userData);

  const handleCreateSellerAccount = () => {
    Alert.alert(
      "Create Seller Account",
      "You will be redirected to Stripe's official Connect linking process. Once finished, you can come back to the app.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Create",
          onPress: () => {
            createConnectAcc();
          },
        },
      ]
    );
  };

  const createConnectAcc = async () => {
    try {
      let response = await axios.post(
        "https://createconnectedaccount-77lo2hwf4a-uc.a.run.app",
        {
          userId: userData.userID,
          name: userData.fullName,
        }
      );

      navigation.navigate("WebView", {
        uri: response.data.data.res.url,
      });
    } catch (error) {
      console.log("Error creating payment intent:", error);
      response.status(500).send("Internal Server Error");
    }
  };


  const navigateBackIfNeeded = async () => {
    const sellerDetailsRef = doc(dbFS, 'sellerDetails', userData.userID);
    const sellerDetailsSnapshot = await getDoc(sellerDetailsRef);
    const sellerDetailsData = sellerDetailsSnapshot.data();
    if (sellerDetailsData.stripeLinkingProcessFinished === true) {
      navigation.navigate("MainRoute");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      navigateBackIfNeeded();
    }, [])
  );

  return (
    <View style={styles.container}>
      <CustomHeader
        rightIconPress={() => navigation.replace("MainRoute")}
        rightIcon={"x"}
        label={"Become a Seller"}
      />
      <CurveView>
        <View style={styles.imageContainer}>
          <Image source={assets.sell} style={styles.img} />
        </View>
        <View style={styles.stepsContainer}>
          <StepCard
            stepNumber={1}
            title="Step 1: Register"
            description="Sign up for a seller account to get started."
          />
          <StepCard
            stepNumber={2}
            title="Step 2: List Your Products"
            description="Create listings for the items you want to sell."
          />
          <StepCard
            stepNumber={3}
            title="Step 3: Get Paid"
            description="Receive payment for your sold items."
          />
        </View>
      </CurveView>
      <View style={styles.wrapbtn}>
        <FullButton
          handlePress={handleCreateSellerAccount}
          color={Theme.primaryColor}
          label={"Create Seller Account"}
        />
      </View>
    </View>
  );
}

export default BecomeSeller;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
  imageContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  img: {
    height: 225,
    width: 300,
    resizeMode: "contain",
  },
  stepsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  stepCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#7c7c7c",
    shadowOffset: {
      width: 1,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5.84,
    elevation: 4,
  },
  stepNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  stepNumber: {
    color: "white",
    fontSize: 18,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
  },
  stepDescription: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.6)",
  },
  wrapbtn: {
    paddingHorizontal: 15,
    width: "100%",
    backgroundColor: "white",
    paddingBottom: 25,
  },
});
