import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../../components/Headers/CustomHeader";
import CurveView from "../../components/utils/CurveView";
import Theme from "../../src/Theme";
import FullButton from "../../components/Buttons/FullButton";
import FullButtonStroke from "../../components/Buttons/FullButtonStroke";
import Typo from "../../components/utils/Typo";
import Space from "../../components/utils/Space";
import InputBox from "../../components/utils/InputBox";
import useStore from "../../store";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Dropdown from "../../components/utils/Dropdown";
import assets from "../../assets/assets";
import Step1 from "./BecomeSellerSteps/Step1";
import Step2 from "./BecomeSellerSteps/Step2";
import Step4 from "./BecomeSellerSteps/Step4";
import { doc, setDoc } from "firebase/firestore";
import { dbFS } from "../../config/firebase";

function SellerSetup() {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [loading,setLoading] = useState(false)
  const userID = useStore(state => state.userID);
  const step1Data = useStore(state => state.step1Data);
  const step2Data = useStore(state => state.step2Data);
  const step3Data = useStore(state => state.step3Data);
  const step4Data = useStore(state => state.step4Data);

  const handleNextStep = () => {
    // Check if all required fields are filled
    const isStepValid = validateStep(currentStep);
    
    if (isStepValid) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setProgressPercentage((nextStep / 4) * 100);
    }
    if(currentStep === 3){
      handleFinish()
    }
  };
  const handlePreviousStep = () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    setProgressPercentage((prevStep / 4) * 100);
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      const sellerDetailsRef = doc(dbFS, 'sellerDetails', userID);
      await setDoc(sellerDetailsRef, {
       personalDetails: step1Data,
       accountDetails: step2Data,
       preferredPaymentMethod: step3Data,
       paymentMethodDetails: step4Data,
      });

      console.log("Updated")
    } catch (error) {
      console.error("Error adding document: ", error);
      // Handle error gracefully (e.g., show an alert to the user)
      Alert.alert("Error", "Failed to save seller details. Please try again later.");
    }finally{
      setLoading(false)
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 />;
      case 2:
        return <Step3 />;
      case 3:
        return <Step4 />;
      case 4:
        return <Step5 />;
      default:
        return null;
    }
  };


  const validateStep = (step) => {
    let isValid = true;
    let emptyFields = [];
  
    switch (step) {
      case 0:
        const { fullName, email, phoneNumber, streetNumber, city, postalCode } = step1Data;
        if (!fullName || !email || !phoneNumber || !streetNumber || !city || !postalCode) {
          isValid = false;
          emptyFields = ["Full Name", "Email", "Phone Number", "Street Number", "City", "Postal Code"];
        }
        break;
        case 1:
          const { accountType, country, companyName, eNumber } = step2Data;
          if (!accountType || !country || (accountType === 'company' && (!companyName || !eNumber))) {
            isValid = false;
            emptyFields = ["Account Type", "Country"];
            if (accountType === 'company') {
              if (!companyName) emptyFields.push("Company Name");
              if (!eNumber) emptyFields.push("Employer Identification Number");
            }
          }
          break;        
      case 2:
        const { selectedPaymentMethod } = step3Data;
        if (!selectedPaymentMethod) {
          isValid = false;
          emptyFields = ["Payment Method"];
        }
        break;
      case 3:
        const {bankAccountType, accountHolderName, accountNumber, routingNumber } = step4Data;
        if (!bankAccountType || !accountHolderName || !accountNumber || !routingNumber) {
          isValid = false;
          emptyFields = ["Account Type", "Account Holder Name", "Account Number", "Routing Number"];
        }
        break;
      default:
        break;
    }
  
    if (!isValid) {
      Alert.alert("Validation Error", `Please fill in the following fields: ${emptyFields.join(", ")}`);
    }
  
    return isValid;
  };

 if(loading){
  return(
    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
      <ActivityIndicator color={Theme.greenColor} size={'large'}/>
      <Space space={5}/>
      <Typo >Loading...</Typo>
    </View>
  )
 }


  const Step3 = () => {
    const { step3Data, setStep3Data } = useStore();
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const { selectedPaymentMethod } = step3Data;

    const handleSelectPaymentMethod = (method) => {
      setStep3Data({ selectedPaymentMethod: method });
    };

    return (
      <View style={styles.stepContainer}>
        <Typo l>Select Payment Method</Typo>
        <Typo grey>Pick the best payout method.</Typo>
        <Space space={10} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <TouchableOpacity
            style={[
              styles.accountTypeBox,
              selectedPaymentMethod === "bank" && styles.selectedBox,
            ]}
            onPress={() => handleSelectPaymentMethod("bank")}
          >
            <FontAwesome
              name="bank"
              size={20}
              color={selectedPaymentMethod === "bank" ? "white" : "black"}
            />
            <Space space={5} />
            <Typo white={selectedPaymentMethod === "bank"}>{"Bank"}</Typo>
          </TouchableOpacity>
          <TouchableOpacity
            disabled
            style={[
              styles.accountTypeBox,
              selectedPaymentMethod === "card" && styles.selectedBox,
            ]}
            onPress={() => handleSelectPaymentMethod("card")}
          >
            <Ionicons
              name="card"
              size={24}
              color={selectedPaymentMethod === "card" ? "white" : "grey"}
            />
            <Typo grey>{"Card ( Coming Soon )"}</Typo>
          </TouchableOpacity>
        </View>

        {!tooltipVisible && (
          <View style={styles.tooltipContainer}>
            <View style={styles.tooltipBox}>
              <Typo>
                We are partnered with Stripe to keep your payments safe.
              </Typo>
            </View>
          </View>
        )}
        {/* Stripe logo */}
        <TouchableOpacity
          style={styles.stripeLogo}
          onPress={() => setTooltipVisible(!tooltipVisible)}
        >
          <Typo>Powered By: </Typo>
          <FontAwesome name="cc-stripe" size={30} color={Theme.primaryColor} />
        </TouchableOpacity>
      </View>
    );
  };

  const Step5 = () => {
    return (
      <View style={styles.stepContainer}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={assets.congo} // Path to your congratulations image
            style={styles.congratulationsImage}
          />
          <Typo xl>Congratulations!</Typo>
          <Typo l grey center>
            You have now applied as a seller. You can now create a listing from the + icon.
          </Typo>
          <Space space={15} />
          <FullButton handlePress={()=>navigation.navigate("MainRoute")} color={Theme.primaryColor} label={"Finish"} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        rightIconPress={() => navigation.replace("MainRoute")}
        rightIcon={"x"}
        label={"Setup Seller Account"}
      />
      <CurveView>
        {
          currentStep === 4 ? null : 
          <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBar, { width: `${progressPercentage}%` }]}
          />
        </View>
        }
        {renderStepContent()}
      </CurveView>
      <View style={styles.stepButtonContainer}>
        {currentStep !== 4  && currentStep !== 0? (
          <View style={{ flex: 1 }}>
            <FullButtonStroke
              color={"black"}
              handlePress={handlePreviousStep}
              label={"Back"}
            />
          </View>
        ) : null}
        {currentStep !== 4 ? (
          <View style={{ flex: 1 }}>
            <FullButton
              color={Theme.primaryColor}
              handlePress={handleNextStep}
              label={"Next"}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

export default SellerSetup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
  progressBarContainer: {
    backgroundColor: "#DDD",
    height: 6,
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: Theme.primaryColor,
    borderRadius: 5,
  },
  stepContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  stepButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 25,
    backgroundColor: "white",
    gap: 10,
    paddingTop:15
  },
  stepContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  accountTypeBox: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    height: 80,
    justifyContent: "center",
  },
  selectedBox: {
    borderWidth: 1,
    borderColor: Theme.primaryColor, // Change to desired selected color
    backgroundColor: Theme.primaryColor,
  },
  tooltipContainer: {
    marginTop: 10,
    width: "100%",
  },
  tooltipBox: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    width: "100%",
  },
  stripeLogo: {
    justifyContent: "center",
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  congratulationsImage: {
    width: 300,
    height: 250,
    resizeMode: "contain",
  },
});
