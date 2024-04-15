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

function SelectService({role,handleSelectOption}){
    return(
        <>
        <Typo center xxl light>
         I'm Looking For
        </Typo>
        <Typo center l grey>Select why are you on this app.</Typo>
        <View style={styles.cardsContainer}>
          <TouchableWithoutFeedback onPress={() => handleSelectOption("customer")}>
            <View
              style={[
                styles.card,
                role === "customer" && styles.selectedCard,
              ]}
            >
              <MaterialCommunityIcons
                name="home"
                size={25}
                color={role === "customer" ? Theme.primaryColor : "white"}
              />
              <Typo center>House Cleaning</Typo>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => handleSelectOption("ServiceProvider")}
          >
            <View
              style={[
                styles.card,
                role === "ServiceProvider" && styles.selectedCard,
              ]}
            >
              <MaterialCommunityIcons
                name="account-heart"
                size={25}
                color={
                    role === "ServiceProvider" ? Theme.primaryColor :"white"
                }
              />
              <Typo center>Provide Serivce</Typo>
            </View>
          </TouchableWithoutFeedback>
        </View>
   </>
    )}
export default SelectService;

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
    marginHorizontal: 5,
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