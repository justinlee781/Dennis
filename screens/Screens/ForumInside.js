import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import HeaderTwoIcons from "../../components/Headers/HeaderTwoIcons";
import CurveView from "../../components/utils/CurveView";
import Theme from "../../src/Theme";
import Typo from "../../components/utils/Typo";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { dbFS } from "../../config/firebase";
import CommentCard from "../../components/Cards/CommentCard";
import Space from "../../components/utils/Space";
import { FontAwesome } from "@expo/vector-icons";
import useStore from "../../store";

function ForumInside({ route }) {
  const { item, cardColor, forumDetails } = route.params;
  const [commentsData, setCommentsData] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false)
  const userData = useStore((state) => state.userData);

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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsRef = doc(
          dbFS,
          "forums",
          "forums",
          forumDetails.title,
          item.id
        );

        const docSnapshot = await getDoc(commentsRef);
        const initialComments = docSnapshot.data()?.comments || [];
        setCommentsData(initialComments);

        const unsubscribe = onSnapshot(commentsRef, (doc) => {
          const updatedComments = doc.data()?.comments || [];
          setCommentsData(updatedComments);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [item.id]);

  console.log(userData)
  const handleComment = async () => {
    if (comment) {
      try {
        setLoading(true);
        const forumRef = doc(
          dbFS,
          "forums",
          "forums",
          forumDetails.title,
          item.id
        );

        const forumDoc = await getDoc(forumRef);

        const commentsArray = forumDoc.data().comments || [];

        const newComment = {
          commentedBy: userData.userID,
          commentByName: userData.userName,
          comment: comment,
          timestamp: new Date().toLocaleString(),
          commentProfilePic: userData.profilePic ? userData.profilePic : placeholder,
        };

        commentsArray.push(newComment);

        await updateDoc(forumRef, { comments: commentsArray });
        Alert.alert(
          "Commented Posted",
          "Your comment has been posted successfully."
        );
        setLoading(false);
        setComment("");
      } catch (err) {
        console.error("Error adding comment:", err);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Comment Empty", "Please enter a comment.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: cardColor }]}>
      <HeaderTwoIcons leftIcon={true} label={`${forumDetails.title}`} />
      <CurveView style={{ paddingHorizontal: 15, backgroundColor: "#f7f7f7" }}>
        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typo style={{ textTransform: "capitalize", maxWidth: "75%" }} l>
              😃 {item.title}
            </Typo>
            <Typo grey s>
              {formatTimestamp(item.createdAt)}
            </Typo>
          </View>
          <Typo style={{ textTransform: "capitalize" }} grey>
            Created By {item.createdBy.userName}
          </Typo>
        </View>
        <View style={styles.card}>
          <Typo>Description</Typo>
          <Typo grey>{item.description}</Typo>
        </View>

        <View style={styles.card}>
          <Typo l>Comments</Typo>
          {commentsData ? (
            <>
              <Space space={10} />
              {commentsData &&
                commentsData.map((item, index) => {
                  return (
                    <CommentCard
                      key={index}
                      comment={item.comment}
                      postedBy={item.commentByName}
                      image={item.commentProfilePic}
                      time={item.timestamp}
                      index={index}
                      docID={route.params.item.id}
                      collectionName={forumDetails.title}
                      subCommentData={
                        item.subComments ? item.subComments : null
                      }
                    />
                  );
                })}
            </>
          ) : null}

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <TextInput
              value={comment}
              onChangeText={(t) => setComment(t)}
              placeholder="Comment on this Post...."
              style={styles.input}
            />
            <TouchableOpacity onPress={handleComment}>
              <FontAwesome name="send" size={20} color={Theme.primaryColor} />
            </TouchableOpacity>
          </View>
        </View>
      </CurveView>
    </View>
  );
}

export default ForumInside;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
  card: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f2f2f2",
    marginTop: 5,
    paddingVertical: 5,
    fontFamily: Theme.OutfitMedium,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    flex: 1,
    minHeight: 45,
    fontSize: 16,
  },
});

const placeholder = "https://cdn-icons-png.flaticon.com/128/2202/2202112.png"