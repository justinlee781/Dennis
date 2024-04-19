import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Feather } from "@expo/vector-icons"; // assuming you are using Ionicons for user icon
import Theme from "../../src/Theme";
import Typo from "../utils/Typo";
import assets from "../../assets/assets";

const imageArray = [
    assets.cookinaround,
    assets.localspots,
    assets.randomstuff,
    assets.shape,
    assets.wsl,
]

const ForumCard = ({ title, description, postDate, cardColor }) => {
  // Generate a random index to select an image from the array
  const randomIndex = Math.floor(Math.random() * imageArray.length);
  const randomImage = imageArray[randomIndex];

  return (
    <View style={[styles.card,{
        backgroundColor:cardColor
    }]}>
      <Image source={randomImage} style={styles.image} resizeMode="contain" />
      <View style={styles.content}>
        <Typo style={styles.title}>{title}</Typo>
        <Typo s>{description}</Typo>
        <View style={styles.postDateContainer}>
          <Feather name="clock" size={16} color={"grey"} style={styles.clockIcon} />
          <Typo s grey>{postDate}</Typo>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 25,
    padding: 10,
    marginBottom: 10,
    flex: 1,
    margin: 5,
    maxWidth: "48%", 
  },
  image: {
    width: "78%",
    height: 125, // Adjust the height as needed
    borderRadius: 25,
    marginBottom: 10,
    alignSelf:'center'
  },
  content: {
    paddingHorizontal:5
  },
  title: {
    fontSize: 16,
  },
  description: {
    color: Theme.textColor,
  },
  postDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  clockIcon: {
    marginRight: 5,
  },
  postDate: {
    color: Theme.textColor,
  },
});

export default ForumCard;
