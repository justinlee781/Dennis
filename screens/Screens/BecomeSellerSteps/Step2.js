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

const Step2 = () => {
    const { step2Data, setStep2Data } = useStore();
    const { accountType, country, eNumber, companyName } = step2Data;

    const handleSelectType = (type) => {
      setStep2Data({ accountType: type });
    };

    const handleSelectOption = (option) => {
      setStep2Data({ country: option });
    };

    const handleInputChange = (key, value) => {
      setStep2Data({ [key]: value });
    };

    return (
      <View style={styles.stepContainer}>
        <Typo l>Account Type</Typo>
        <Typo grey>Select your account type</Typo>
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
              accountType === "individual" && styles.selectedBox,
            ]}
            onPress={() => handleSelectType("individual")}
          >
            <Ionicons
              name="person-outline"
              size={24}
              color={accountType === "individual" ? "white" : "black"}
            />
            <Typo white={accountType === "individual"}>{" Individual"}</Typo>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.accountTypeBox,
              accountType === "company" && styles.selectedBox,
            ]}
            onPress={() => handleSelectType("company")}
          >
            <Ionicons
              name="business-outline"
              size={24}
              color={accountType === "company" ? "white" : "black"}
            />
            <Typo white={accountType === "company"}>{" Company"}</Typo>
          </TouchableOpacity>
        </View>
        <Space space={15} />
        {accountType === "individual" ? (
          <Dropdown
            label={"Country*"}
            setSelectedItem={(op) => handleSelectOption(op)}
            data={["United States"]}
            defaultValue={country}
          />
        ) : accountType === "company" ? (
          <>
            <Dropdown
              label={"Country*"}
              setSelectedItem={(op) => handleSelectOption(op)}
              data={["United States"]}
              defaultValue={country}
            />
            <Space space={15} />
            <InputBox
              value={companyName}
              onChangeText={(text) => handleInputChange("companyName", text)}
              placeholder={"Company Name"}
              label={"Company Name"}
            />
            <Space space={15} />
            <InputBox
              value={eNumber}
              onChangeText={(text) => handleInputChange("eNumber", text)}
              placeholder={"Employer Identification Number"}
              label={"EIN"}
              keyboardType={"numeric"}
            />
          </>
        ) : null}
      </View>
    );
  };

export default Step2;

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