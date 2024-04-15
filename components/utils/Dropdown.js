import React from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import SelectDropdown from 'react-native-select-dropdown'
import Theme from "../../src/Theme";
import { Feather,Ionicons } from '@expo/vector-icons';
import Typo from "./Typo";

function Dropdown({data,setSelectedItem,defaultButtonText,label,labelIcon,defaultValue}){
    return (
      <View style={styles.container}>
        {label ? (
          <View style={{ flexDirection: "row", alignItems: "center",gap:4 ,marginBottom: 5}}>
            {labelIcon ? (
              <Ionicons
                name={labelIcon}
                size={18}
                color={Theme.primaryColor}
              />
            ) : null}
            <Typo s>
              {label}
            </Typo>
          </View>
        ) : null}
        <SelectDropdown
          data={data}
          defaultButtonText={defaultButtonText}
          buttonStyle={styles.button}
          buttonTextStyle={styles.label}
          rowStyle={{ borderBottomColor: "#e5e5e5" }}
          defaultValue={defaultValue}
          rowTextStyle={{
            fontFamily: Theme.OutfitMedium,
            fontSize: 16,
            textAlign:'left',
            paddingLeft:10
          }}
          dropdownStyle={styles.dropdown}
          dropdownIconPosition="right"
          renderDropdownIcon={() => (
            <Feather
              name="corner-down-right"
              size={16}
              color={Theme.lightTextcolor}
            />
          )}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
            setSelectedItem(selectedItem);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
        />
      </View>
    );}
export default Dropdown;

const styles = StyleSheet.create({
  container: {
    width:'100%'
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#f7f7f7",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  label: {
    fontFamily: Theme.OutfitMedium,
    textAlign: "left",
    fontSize:16
  },
  dropdown:{
    backgroundColor:'#FFF',
    borderRadius:10
  }
});