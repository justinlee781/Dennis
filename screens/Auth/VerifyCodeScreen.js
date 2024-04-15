import React, { useEffect, useRef, useState } from "react";
import { 
    View,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from "react-native";
import Theme from "../../src/Theme";
import IconHeader from "../../components/Headers/IconHeader";
import assets from "../../assets/assets";
import Typo from "../../components/utils/Typo";
import Space from "../../components/utils/Space";
import InputBox from "../../components/utils/InputBox";
import FullButton from "../../components/Buttons/FullButton";
import {FirebaseRecaptchaVerifierModal,FirebaseRecaptchaBanner} from 'expo-firebase-recaptcha';
import {PhoneAuthProvider,signInWithCredential} from 'firebase/auth';
import { AUTH, fbConfig } from "../../config/firebase";
import LoadingView from "../../components/utils/LoadingView";
import AsyncStorage from '@react-native-async-storage/async-storage';
import useStore from "../../store";

function VerifyCodeScreen({route,navigation}){
  const inputRefs = useRef([]);
  const recaptchaVerifier = useRef(null);
  const { phoneNumber, countryCode } = route.params;
  const [verificationId, setVerificationID] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [info, setInfo] = useState("");
  const attemptInvisibleVerification = false;
  const [enteredCode, setEnteredCode] = useState(["", "", "", "", "", ""]);
  const [isCodeValid, setIsCodeValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);
  const setUserID = useStore((state) => state.setUserID);

  useEffect(() => {
    handleSendVerificationCode(); 
  }, []); 

  const handleSendVerificationCode = async () => {
    try {
      // Add the +91 prefix to the phone number
      const formattedPhoneNumber = countryCode + phoneNumber;

      // Validate phone number
      if (formattedPhoneNumber.length !== 13) {
        throw new Error("Please enter a valid 10-digit mobile number");
      }

      const phoneProvider = new PhoneAuthProvider(AUTH);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        formattedPhoneNumber,
        recaptchaVerifier.current
      );
      setVerificationID(verificationId);
      setInfo("Success : Verification code has been sent to your phone");
    } catch (error) {
      setInfo(`Error: ${error.message}`);
    }
  };


  const focusNextInput = (index) => {
    if (index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOnPressOutside = () => {
    Keyboard.dismiss();
  };

  const handleCodeChange = (index, value) => {
    const newCode = [...enteredCode];
    newCode[index] = value;
    setEnteredCode(newCode);
    setVerificationCode(newCode.join(""));
    setIsCodeValid(true)
  };


  const handleVerifyCode = async () => {
    try {
      setIsLoading(true);
  
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      
      const userCredential = await signInWithCredential(AUTH, credential);
      const user = userCredential.user;
  
      setInfo("Success: Phone authentication successful");
      setIsLoading(false);
        
      // Store user.uid in AsyncStorage
      await AsyncStorage.setItem("userID", user.uid);
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("phoneNumber", countryCode + phoneNumber);
      
      setIsLoggedIn(true)
      setUserID(user.uid);
      navigation.replace('AccountSetupScreen',{
        phoneNumber:countryCode + phoneNumber
      });
      console.log("Login Successful, userID: " + user.uid);
    } catch (error) {
      setIsLoading(false);
  
      if (error.code === "auth/invalid-verification-code") {
        setIsCodeValid(false);
        setEnteredCode(["", "", "", "", "", ""]);
        setVerificationCode("");
        Alert.alert(
          "Invalid Code",
          "The verification code you entered is invalid. Please try again.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(`Error: ${error.message}`);
        setEnteredCode(["", "", "", "", "", ""]);
      }
    }
  };
  





  return (
    <TouchableWithoutFeedback onPress={handleOnPressOutside}>
      <View style={styles.container}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={fbConfig}
        />
        <IconHeader
          handleLeftIconPress={() => navigation.goBack()}
          leftIcon={true}
        />
        <View style={styles.body}>
          <Typo xl light>
            Enter verification code
          </Typo>
          <Typo center grey>
          A code has been sent to {countryCode + phoneNumber}
          </Typo>

          <View style={styles.otpboxesWrapper}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[styles.inputBox, !isCodeValid && styles.inputBoxError]}
                maxLength={1}
                keyboardType="numeric"
                onChangeText={(text) => {
                  if (text !== "") {
                    focusNextInput(index);
                  }
                  handleCodeChange(index, text);
                }}
                value={enteredCode[index]}
                autoFocus={index === 0}
              />
            ))}
          </View>
          {!isCodeValid && (
            <Typo style={styles.errorText} light>
              The code is invalid. Please try again later.
            </Typo>
          )}

          <Space space={"15%"} />

        </View>

        <View style={styles.button}>
          <FullButton
            handlePress={handleVerifyCode}
            color={Theme.primaryColor}
            label={"Verify"}
          />
        </View>

        {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}

        {
          isLoading ?
          <LoadingView />
          :
          null
        }
      </View>
    </TouchableWithoutFeedback>
  );
}
export default VerifyCodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.backgroundColor,
  },
  loginWrapper: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-evenly",
  },
  socialWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-evenly",
    paddingBottom: 25,
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal:20
  },
  button: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 35,
    paddingHorizontal: 20,
  },
  otpboxesWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal:20,
    width:'100%',
    gap:10
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#141414",
    borderRadius: 15,
    textAlign: "center",
    fontSize: 20,
    marginVertical: 25,
    fontFamily: Theme.OutfitMedium,
    backgroundColor: Theme.containerGrey,
    flex:1,
    paddingVertical:15,
    color:'white'
  },
  align: {
    width: "100%",
    alignItems: "center",
  },
  otp: {
    color: "grey",
  },
  // Style for the input box when it is in an error state
  inputBoxError: {
    borderColor: "red",
  },
  // Style for the error text message
  errorText: {
    color: "red",
    marginTop: 5,
  },
});