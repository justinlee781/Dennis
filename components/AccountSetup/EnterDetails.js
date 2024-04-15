import React from "react";
import { 
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import Typo from "../utils/Typo";
import Theme from "../../src/Theme";
import InputBox from "../utils/InputBox";
import Space from "../utils/Space";

function EnterDetails({fullName,setFullName,email,setEmail}){
  return (
    <>
      <Typo center xxl>
       Enter Your Username
      </Typo>
      <Typo center grey>
        This will be displayed on your public profile.
      </Typo>
      <Space space={25} />
      <InputBox
        value={fullName}
        onChangeText={(text) => setFullName(text)}
        leftIcon={"person-circle-outline"}
        placeholder={"Username"}
      />
      {/* <Space space={15} />
      <InputBox
        value={email}
        onChangeText={(text) => setEmail(text)}
        leftIcon={"mail-outline"}
        placeholder={"Email"}
      />
      <Space space={15} />
      <InputBox
        value={email}
        onChangeText={(text) => setEmail(text)}
        leftIcon={"cake"}
        placeholder={"Birth Date : DD/MM/YYYY"}
      /> */}
    </>
  );
}
export default EnterDetails;

const styles = StyleSheet.create({
  container: {
  
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 10,
    alignItems: "center",
    flex: 1,
    height: 100,
    justifyContent: "center",
    backgroundColor: Theme.containerGrey,
  },
  selectedCard: {
    borderColor: Theme.primaryColor,
    borderWidth: 2,
  },
});