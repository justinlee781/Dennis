import React from "react";
import { 
    View,
    Image,
    StyleSheet,
    TouchableWithoutFeedback
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import Typo from "../utils/Typo";
import Theme from "../../src/Theme";

function SelectOption({option,handleSelectOption}){
    return(
        <>
        <Typo center xxl>
         I'm Looking To
        </Typo>
        <Typo center grey>Before we start, we need to know your preference</Typo>
        <View style={styles.cardsContainer}>
          <TouchableWithoutFeedback onPress={() => handleSelectOption("buyer")}>
            <View
              style={[
                styles.card,
                option === "buyer" && styles.selectedCard,
              ]}
            >
              <Image style={{height:45,width:45,resizeMode:'contain'}} source={{uri:"https://cdn-icons-png.flaticon.com/128/8174/8174616.png"}} />
              <Typo>Buy</Typo>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => handleSelectOption("seller")}
          >
            <View
              style={[
                styles.card,
                option === "seller" && styles.selectedCard,
              ]}
            >
              <Image style={{height:45,width:45,resizeMode:'contain'}} source={{uri:"https://cdn-icons-png.flaticon.com/128/9883/9883117.png"}} />
              <Typo>Recycle</Typo>
            </View>
          </TouchableWithoutFeedback>
        </View>
   </>
    )}
export default SelectOption;

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
    borderWidth: 2,
    borderColor:Theme.primaryColor
  },
});