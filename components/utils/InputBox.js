import React, { useState } from "react";
import { 
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image
} from "react-native";
import Theme from "../../src/Theme";
import { Ionicons,Feather } from '@expo/vector-icons';
import Typo from "./Typo";

function InputBox({
  secureTextEntry,
  multiline,
  placeholder,
  leftIcon,
  keyboardType,
  maxLength,
  label,
  onChangeText,
  value,
  textMode,
  handlePress,
  passwordMode,
  rightLabel,
  handleRightIconPress,
  phoneMode,
  handlePhonePress,
  flagImage,
  labelIcon
}) {
  const [eye, setEye] = useState(true);

  return (
    <View>
      {label ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            marginBottom: 2,
          }}
        >
          {labelIcon ? (
            <Ionicons name={labelIcon} size={18} color={Theme.primaryColor} />
          ) : null}
          <Typo s>{label}</Typo>
        </View>
      ) : null}

      <View
        style={[
          styles.container,
          ,
          {
            height: multiline ? 80 : 50,
            alignItems: multiline ? "flex-start" : "center",
            backgroundColor: textMode ? Theme.containerGrey : Theme.containerGrey,
          },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {leftIcon ? (
            <Ionicons
              style={{ marginRight: 5 }}
              name={leftIcon}
              size={20}
              color={Theme.primaryColor}
            />
          ) : null}
          {phoneMode ? (
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={handlePhonePress}
            >
              <Image source={{ uri: flagImage }} style={styles.flagIcon} />
              <Typo style={{ marginRight: 5 }} light>
                {phoneMode}
              </Typo>
            </TouchableOpacity>
          ) : null}
          <TextInput
            onPressIn={textMode ? handlePress : null}
            editable={textMode ? false : true}
            secureTextEntry={
              secureTextEntry ? secureTextEntry : passwordMode ? eye : false
            }
            value={value}
            multiline={multiline ? multiline : false}
            onChangeText={onChangeText}
            maxLength={maxLength}
            keyboardType={keyboardType}
            placeholderTextColor={textMode ? "black" : "grey"}
            style={[styles.input]}
            placeholder={placeholder}
            autoCapitalize="none"
          />
        </View>
        {passwordMode ? (
          <TouchableOpacity
            style={{ position: "absolute", right: 10 }}
            onPress={() => setEye(!eye)}
          >
            <Feather name={eye ? "eye-off" : "eye"} size={20} color="black" />
          </TouchableOpacity>
        ) : null}
        {rightLabel ? (
          <TouchableOpacity
            style={{ position: "absolute", right: 10 }}
            onPress={handleRightIconPress}
          >
            <Typo light s style={{ textDecorationLine: "underline" }}>
              {rightLabel}
            </Typo>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
export default InputBox;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    alignItems: "center",
    paddingHorizontal: 15,
    flexDirection: "row",
    paddingVertical: 8,
    justifyContent: "space-between",
    borderRadius:15,
  },
  input: {
    maxWidth: "100%",
    fontSize: 16,
    fontFamily: Theme.OutfitMedium,
    minWidth: "60%",
    flex: 1,
    color:'black'
  },
  img: {
    height: 17,
    width: 17,
    resizeMode: "contain",
    marginRight: 15,
  },
  label: {
    fontFamily: Theme.OutfitBold,
    fontSize: 16,
    color: Theme.lightTextcolor,
  },
  flagIcon: {
    height: 18,
    width: 18,
    resizeMode: "contain",
    marginRight: 5,
  },
});
