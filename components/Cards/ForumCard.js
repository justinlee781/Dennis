import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
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

const ForumCard = ({ title, description, postDate, cardColor,handlePress }) => {
  // Generate a random index to select an image from the array
  const randomIndex = Math.floor(Math.random() * imageArray.length);
  const randomImage = imageArray[randomIndex];

  function formatTimestamp(timestamp) {
    const currentDate = new Date();
    const secondsAgo = (currentDate.getTime() - timestamp.toMillis()) / 1000;
  
    if (secondsAgo < 60) {
      return "Just now";
    } else if (secondsAgo < 3600) {
      const minutes = Math.floor(secondsAgo / 60);
      return minutes === 1 ? "1 min ago" : `${minutes} mins ago`;
    } else if (secondsAgo < 86400) {
      const hours = Math.floor(secondsAgo / 3600);
      return hours === 1 ? "1 h ago" : `${hours} hrs ago`;
    } else if (secondsAgo < 2592000) {
      const days = Math.floor(secondsAgo / 86400);
      return days === 1 ? "1 day ago" : `${days} days ago`;
    } else if (secondsAgo < 31536000) {
      const months = Math.floor(secondsAgo / 2592000);
      return months === 1 ? "1 month ago" : `${months} months ago`;
    } else {
      const years = Math.floor(secondsAgo / 31536000);
      return years === 1 ? "1 year ago" : `${years} years ago`;
    }
  }

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.card,{
        backgroundColor:cardColor
    }]}>
      <Image source={randomImage} style={styles.image} resizeMode="contain" />
      <View style={styles.content}>
        <Typo style={styles.title}>🙋 {title}</Typo>
        <Typo s>🧾 {description}</Typo>
        <View style={styles.postDateContainer}>
          <Typo s grey>⏲️ {postDate ? formatTimestamp(postDate) : null}</Typo>
        </View>
      </View>
    </TouchableOpacity>
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
