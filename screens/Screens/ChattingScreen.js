import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install @expo/vector-icons package
import Theme from "../../src/Theme";
import CustomHeader from "../../components/Headers/CustomHeader";
import Typo from "../../components/utils/Typo";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { dbFS } from "../../config/firebase";
import useStore from "../../store";
import Space from "../../components/utils/Space";

function ChattingScreen({ route }) {
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState(null);
  const { conversationID, chatterDetail } = route.params;
  const userID = useStore((state) => state.userID);
  const [chatterTempDetial, setChatterTempDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(dbFS, "conversations", conversationID),
      (snapshot) => {
        if (snapshot.exists()) {
          const conversationData = snapshot.data();
          setChatData(conversationData);
          if (conversationData && conversationData.sellerID) {
            if (chatterDetail === null) {
              getOtherIDDetails(conversationData.sellerID);
            } else {
              console.log("Chatter Detail exsist.");
            }
            setLoading(false);
          } else {
            console.log("Seller ID not available in conversation data");
            setLoading(false);
          }
        } else {
          console.log("No such conversation!");
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [conversationID]);

  const getOtherIDDetails = async (sellerID) => {
    try {
      const userRef = doc(dbFS, "users", sellerID);
      const userDoc = await getDoc(userRef);
      console.log("Fetching Other Id Details");
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setChatterTempDetail(userData);
      } else {
        console.log("No such user document!");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatData]);

  const sendMessage = async () => {
    if (message.trim() === "") return; // Prevent sending empty messages

    try {
      setMessage("");
      const docRef = doc(dbFS, "conversations", conversationID);
      const newMessage = {
        sender: userID, // Assuming the current user is the sender
        message: message,
        timestamp: new Date().toISOString(), // Current timestamp
      };

      await updateDoc(docRef, {
        messages: arrayUnion(newMessage), // Add newMessage to the messages array
      });

      // Clear input field after sending message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" color={Theme.primaryColor} />
        <Space space={10} />
        <Typo>Loading Chat Data...</Typo>
      </View>
    );
  }

  const userImage = chatterDetail
    ? chatterDetail.profilePic
    : chatterTempDetial.profilePic
    ? chatterTempDetial.profilePic
    : placeholder;

  const userName = chatterDetail
    ? chatterDetail.fullName
    : chatterTempDetial.fullName;

  return (
    <View style={styles.container}>
      {/* Header */}

      <CustomHeader
        hasBackButton={true}
        image={userImage}
        label={userName}
      />

      <View style={styles.CurveView}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <View style={styles.toolTip}>
            <Typo s style={{ textAlign: "center", color: "#c78704" }}>
              Stay Polite and Friendly
            </Typo>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            onContentSizeChange={() =>
              flatListRef.current.scrollToEnd({ animated: true })
            }
            data={chatData.messages}
            renderItem={({ item }) => (
              <View
                style={
                  item.sender === userID
                    ? styles.userMessageContainer
                    : styles.otherMessageContainer
                }
              >
                <Typo style={styles.message}>{item.message}</Typo>
              </View>
            )}
            contentContainerStyle={styles.chatContentContainer}
          />
        </View>

        {/* Input box */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={15} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default ChattingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerTime: {
    color: "#777",
  },
  backButton: {
    paddingHorizontal: 10,
  },
  chatContentContainer: {
    padding: 10,
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    borderRadius: 10,
    maxWidth: "70%",
    marginBottom: 10,
    padding: 10,
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    maxWidth: "70%",
    marginBottom: 10,
    padding: 10,
  },
  message: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "white",
    paddingBottom: Platform.OS === "android" ? 20 : 25,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    fontFamily: Theme.OutfitMedium,
  },
  sendButton: {
    backgroundColor: Theme.primaryColor,
    borderRadius: 100,
    padding: 10,
  },
  CurveView: {
    flex: 1,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: "white",
    marginTop: 10,
  },
  toolTip: {
    backgroundColor: "#ffe7b5",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: "absolute",
    zIndex:1
  },
});

const placeholder = "https://cdn-icons-png.flaticon.com/128/236/236832.png";
