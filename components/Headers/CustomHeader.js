import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import Typo from "../utils/Typo";
import Theme from "../../src/Theme";
import assets from "../../assets/assets";
import { useNavigation } from "@react-navigation/native";
import { Feather,AntDesign } from '@expo/vector-icons';

function CustomHeader({
  label,
  noMargin,
  hasBackButton,
  handleImagePress,
  image,
  rightIcon,
  rightIconPress,
  sublabel
}) {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          marginTop: noMargin ? 15 : Platform.OS === "android" ? 30 : 0,
          backgroundColor: null,
        },
      ]}
    >
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {hasBackButton ? (
            <TouchableOpacity style={{marginRight:10}} onPress={() => navigation.goBack()}>
              <AntDesign name="back" size={24} color="black" />
            </TouchableOpacity>
          ) : null}
         {image ? <TouchableOpacity onPress={handleImagePress}>
            <Image
              source={{
                uri: image,
              }}
              style={styles.profile}
            />
          </TouchableOpacity> : null}
          <View>
          <Typo
           xl
          >
            {label}
          </Typo>
          {sublabel ? <Typo s grey>{sublabel}</Typo> : null}
          </View>
        </View>
        <View style={Theme.align}>
          {
            rightIcon ?
            <TouchableOpacity
            onPress={rightIconPress}
          >
            <Feather name={rightIcon} size={24} color="black" />
          </TouchableOpacity>
          :
          null
          }
        </View>
      </View>
    </SafeAreaView>
  );
}

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal:Platform.OS === "ios" ? 15 : 10,
    justifyContent: "space-between",
    paddingTop: 15,
    paddingBottom:Platform.OS === "ios" ? 15 : 5,
    width: "100%",
  },
  icon: {
    height: 22,
    width: 22,
  },
  back: {
    height: 28,
    width: 28,
    marginRight: 15,
  },
  profile: {
    height: 35,
    width: 35,
    borderRadius: 100,
    marginRight: 8,
    backgroundColor:'#e5e5e5'
  },
  loadingIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
