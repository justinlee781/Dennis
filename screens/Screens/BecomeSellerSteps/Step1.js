import React from "react";
import { 
    View,
    StyleSheet
} from "react-native";
import InputBox from "../../../components/utils/InputBox";
import Space from "../../../components/utils/Space";
import Typo from "../../../components/utils/Typo";
import useStore from "../../../store";

const Step1 = () => {
    const { step1Data, setStep1Data } = useStore();
    const { fullName, email, phoneNumber, streetNumber, city, postalCode } =
      step1Data;

    const handleInputChange = (key, value) => {
      setStep1Data({ [key]: value });
    };

    return (
      <View style={styles.stepContainer}>
        <Typo l>Personal Details</Typo>
        <Typo grey>Please verify your personal information.</Typo>
        <Space space={10} />
        <View style={{ gap: 15 }}>
          <InputBox
            label={"Full Name"}
            value={fullName}
            onChangeText={(text) => handleInputChange("fullName", text)}
            placeholder={"Full Name"}
          />
          <InputBox
            value={email}
            onChangeText={(text) => handleInputChange("email", text)}
            placeholder={"Email"}
            label={"Email"}
          />
          <InputBox
            value={phoneNumber}
            onChangeText={(text) => handleInputChange("phoneNumber", text)}
            placeholder={"Phone number"}
            label={"Phone number"}
            keyboardType={"numeric"}
            maxLength={10}
          />
          <InputBox
            value={streetNumber}
            onChangeText={(text) => handleInputChange("streetNumber", text)}
            placeholder={"Street Number"}
            label={"Street Number"}
          />
          <InputBox
            value={city}
            onChangeText={(text) => handleInputChange("city", text)}
            placeholder={"City"}
            label={"City"}
          />
          <InputBox
            value={postalCode}
            onChangeText={(text) => handleInputChange("postalCode", text)}
            placeholder={"Postal Code"}
            label={"Postal Code"}
            keyboardType={"numeric"}
          />
        </View>
      </View>
    );
  };

export default Step1;

const styles = StyleSheet.create({
    stepContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
      },
});