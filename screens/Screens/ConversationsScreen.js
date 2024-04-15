import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import CustomHeader from "../../components/Headers/CustomHeader";
import Theme from "../../src/Theme";
import CurveView from "../../components/utils/CurveView";
import FilterTags from "../../components/utils/FilterTags";
import Space from "../../components/utils/Space";
import Typo from "../../components/utils/Typo";
import { useNavigation } from "@react-navigation/native";
import { dbFS } from "../../config/firebase";
import useStore from "../../store";

function ConversationCard({ fullName, profilePic, lastMessage, time, id }) {
  const navigation = useNavigation();
  return (
    <>
    {fullName ? <TouchableOpacity
      onPress={() =>
        navigation.navigate("ChattingScreen", {
          conversationID: id,
          chatterDetail:{profilePic,fullName,time}
        })
      }
      style={styles.card}
    >
      <Image source={{ uri: profilePic }} style={styles.profilePicture} />
      <View style={styles.cardText}>
        <Typo style={styles.name}>{fullName}</Typo>
        <Typo s style={styles.lastMessage}>
          {lastMessage}
        </Typo>
      </View>
      <Typo style={styles.time}>{time}</Typo>
    </TouchableOpacity> : <ActivityIndicator/>}
    </>
  );
}

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

function ConversationsScreen({ navigation }) {
  const [selectedTag, setSelectedTag] = useState("All");
  const [conversations, setConversations] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const userID = useStore((state) => state.userID);
  const handleTagPress = (item) => {
    setSelectedTag(item);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(dbFS, "conversations"),
        where("participants", "array-contains", userID)
      ),
      (snapshot) => {
        const conversationsData = [];
        snapshot.forEach((doc) => {
          conversationsData.push({ id: doc.id, ...doc.data() });
        });
        setConversations(conversationsData);
        setDataFetched(true);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const updatedConversations = await Promise.all(
        conversations.map(async (conversation) => {
          const otherParticipantId = conversation.participants.find(
            (id) => id !== userID
          );
          const userRef = doc(dbFS, "users", otherParticipantId);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            return { ...conversation, otherParticipantDetails: userData };
          } else {
            console.log("User document does not exist");
            return conversation;
          }
        })
      );

      setConversations(updatedConversations);
      console.log(conversations);
    };

    fetchUserDetails();
  }, [dataFetched]);

  return (
    <View style={styles.container}>
      <CustomHeader label={`Conversations`} />
      <View style={styles.CurveView}>
        <Space space={10} />
        <FilterTags
          onTagPress={handleTagPress}
          selectedTag={selectedTag}
          tags={["All", "Buying", "Selling"]}
        />
        <Space space={15} />
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationCard
            fullName={
                item.otherParticipantDetails
                  ? item.otherParticipantDetails.fullName.split(" ")[0]
                  : ""
              }
              profilePic={
                item.otherParticipantDetails &&
                item.otherParticipantDetails.profilePic
                  ? item.otherParticipantDetails.profilePic
                  : placeholder
              }
              lastMessage={"Click To View Conversation."}
              time={formatTimestamp(item.conversationStarted)}
              id={item.id}
            />
          )}
        />
      </View>
    </View>
  );
}
export default ConversationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8",
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
  },
  cardText: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
  },
  lastMessage: {
    color: "#777",
  },
  time: {
    color: "#777",
    fontSize: 12,
  },
  CurveView: {
    paddingHorizontal: 20,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: "white",
    flex: 1,
    marginTop: 10,
    paddingTop: 5,
  },
});

const placeholder = "https://cdn-icons-png.flaticon.com/128/236/236832.png";
