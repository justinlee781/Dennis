import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import assets from "../../assets/assets";
import Typo from "./Typo";

const BottomSheet = ({ windowHeight,sheetRef,children,hasBackButton,title}) => {
  return (
    <RBSheet
      ref={sheetRef}
      height={windowHeight}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        wrapper: {
          backgroundColor: "rgba(0,0,0,0.5)",
        },
        draggableIcon: {
          backgroundColor: "#000",
        },
        container: {
          backgroundColor: "#FFF",
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        },
      }}
    >
      <View style={styles.container}>
        {
          title && hasBackButton ?
          <View style={styles.header}>
            <TouchableOpacity onPress={()=>sheetRef.current.close()}>
              <Image source={assets.backIcon} style={{height:35,width:35,
              resizeMode:'contain'}} />
            </TouchableOpacity>
            <Typo light xl>{title}</Typo>
            <View style={{width:25}}/>
          </View>
          :null
        }
        {children}
        </View>
    </RBSheet>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  header:{
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  }
});