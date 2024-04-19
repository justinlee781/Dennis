import React, { useState } from "react";
import { 
  View,
  Image,
  StyleSheet,
} from "react-native";
import HeaderTwoIcons from "../../components/Headers/HeaderTwoIcons";
import Theme from "../../src/Theme";
import CurveView from "../../components/utils/CurveView";
import InputBox from "../../components/utils/InputBox";
import Space from "../../components/utils/Space";
import useStore from "../../store";
import FullButton from "../../components/Buttons/FullButton";


function PersonalInfoScreen({ navigation }) {
  const userData = useStore((state) => state.userData);

  const [fullName,setFullName] = useState("")
  const [email,setEmail] = useState(userData.email)
  return (
    <View style={styles.container}>
      <HeaderTwoIcons
        leftIcon={true}
        label={"Personal Information"}
        rightIcon={false}
      />
      <CurveView style={{ paddingHorizontal: 10 }}>
        <View style={styles.body}>
          <InputBox
            value={fullName}
            onChangeText={(text) => setFullName(text)}
            leftIcon={"person"}
            placeholder={userData.userName}
          />
          <Space space={15} />
          <InputBox
            textMode={true}
            value={email}
            leftIcon={"mail"}
            keyboardType={"numeric"}
            placeholder={"Phone"}
          />
          <Space space={15} />
          <InputBox
            textMode={true}
            rightLabel="Reset"
            value={"********"}
            leftIcon={"lock-closed"}
            placeholder={"Password"}
          />
          <Space space={15} />
        </View>
      </CurveView>
      <View style={{ padding: 20,backgroundColor:'white' }}>
        <FullButton label={"Save"} color={Theme.primaryColor} />
      </View>
    </View>
  );
}

export default PersonalInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
  body: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop:20
  },
  notificationSetting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily:Theme.OutfitMedium
  },
});
