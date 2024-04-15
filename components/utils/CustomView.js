import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import {  StyleSheet,View } from "react-native";

const CustomView = ({ children }) => {

  return (

      <KeyboardAvoidingView
      behavior={Platform.OS ==='ios' ? "padding" : null}
        style={[styles.container]}
      >
         {children}
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CustomView;