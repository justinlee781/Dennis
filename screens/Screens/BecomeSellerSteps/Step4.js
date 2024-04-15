import React from "react";
import { 
    View,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import InputBox from "../../../components/utils/InputBox";
import Space from "../../../components/utils/Space";
import Typo from "../../../components/utils/Typo";
import useStore from "../../../store";
import Dropdown from "../../../components/utils/Dropdown";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Theme from "../../../src/Theme";

const Step4 = () => {
    const { step4Data, setStep4Data } = useStore();
    const { bankAccountType, accountHolderName, accountNumber, routingNumber } =
      step4Data;

    const handleSelectAccountType = (type) => {
      setStep4Data({ bankAccountType: type });
    };

    const handleInputChange = (key, value) => {
      setStep4Data({ [key]: value });
    };

    return (
      <View style={styles.stepContainer}>
        <Dropdown
          label={"Account Type*"}
          setSelectedItem={handleSelectAccountType}
          data={["Individual", "Company"]}
          defaultValue={bankAccountType}
        />
        <Space space={15} />
        <InputBox
          label={"Account Holder Name"}
          value={accountHolderName}
          onChangeText={(text) => handleInputChange("accountHolderName", text)}
          placeholder={"Account Holder Name"}
        />
        <Space space={15} />
        <InputBox
          label={"Account Number"}
          value={accountNumber}
          onChangeText={(text) => handleInputChange("accountNumber", text)}
          placeholder={"Account Number Here"}
          keyboardType={"numeric"}
        />
        <Space space={15} />
        <InputBox
          label={"Routing Number"}
          value={routingNumber}
          onChangeText={(text) => handleInputChange("routingNumber", text)}
          placeholder={"Routing Number Here"}
          keyboardType={"numeric"}
        />
      </View>
    );
  };


export default Step4;

const styles = StyleSheet.create({
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
});