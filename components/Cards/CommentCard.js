import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from "react-native";

import { Octicons, FontAwesome } from '@expo/vector-icons';

import { doc, getDoc, updateDoc } from "firebase/firestore";
import Typo from "../utils/Typo";
import Theme from "../../src/Theme";
import useStore from "../../store";
import { dbFS } from "../../config/firebase";

function CommentCard({ image, postedBy, comment, collectionName, index, docID, subCommentData }) {
  const [commentMode, setCM] = useState(false)
  const [subComment, setSC] = useState("")
  const userID = useStore((state) => state.userID);
  const userData = useStore((state) => state.userData);
  const [loading, setLoading] = useState(false)


  function parseCustomTimestamp(timestamp) {
    const parts = timestamp.match(/(\d+)/g);
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    const hour = parseInt(parts[3]);
    const minute = parseInt(parts[4]);
    const second = parseInt(parts[5]);

    return new Date(year, month, day, hour, minute, second);
  }



  function timeAgo(timestamp) {
    const now = new Date();
    const postDate = parseCustomTimestamp(timestamp);

    if (isNaN(postDate)) {
      return "Invalid Date";
    }

    const timeDifference = now.getTime() - postDate.getTime(); // Calculate the time difference in milliseconds

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return seconds + "s ago";
    } else if (minutes < 60) {
      return minutes + "m ago";
    } else if (hours < 24) {
      return hours + "h ago";
    } else {
      return days + "d ago";
    }
  }




  const handleComment = async (index) => {
    if (subComment) {
      try {
        setLoading(true);

        const forumRef = doc(dbFS, "forums","forums",collectionName, docID);

        const forumDoc = await getDoc(forumRef);


        const commentsArray = forumDoc.data()?.comments || [];


        const commentIndex = index;

        // Initialize 'subComments' array if it doesn't exist
        commentsArray[commentIndex].subComments = commentsArray[commentIndex].subComments || [];

        // Add the new sub-comment to the 'subComments' array
        const newSubComment = {
          commentedBy: userID,
          commentByName: userData.userName ? userData.userName : userData.fullName,
          comment: subComment,
          timestamp: new Date().toISOString(),
          commentProfilePic: userData.profilePic ? userData.profilePic : placeholder,
        };

        commentsArray[commentIndex].subComments.push(newSubComment);

        // Update the document with the new sub-comment
        await updateDoc(forumRef, { comments: commentsArray });
        Alert.alert("Commented Posted", "Your comment has been posted successfully.");
        setLoading(false);
        setSC("");
        setCM(false)
      } catch (err) {
        console.error("Error adding sub-comment:", err);
        setLoading(false);
      }
    } else {
      Alert.alert("Comment Empty", "Please enter a comment.");
    }
  };


  function extractDateFromTimestamp(timestamp) {
    const dateMatch = timestamp.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
    return dateMatch ? dateMatch[0] : null;
  }


  function formatTimestamp(timestamp) {
    const dateMatch = timestamp.match(/\d{1,2}\/\d{1,2}\/\d{4}/);

    if (!dateMatch) {
      console.error("Invalid timestamp format");
      return null;
    }

    const extractedDate = dateMatch[0];
    const parts = extractedDate.split('/');
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const year = parseInt(parts[2]);

    const today = new Date();
    const isToday = today.getDate() === day && today.getMonth() + 1 === month && today.getFullYear() === year;

    if (isToday) {
      return today.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } else {
      return extractedDate; // Return the original date if it's not today
    }
  }


  return (
    <View style={{ backgroundColor: '#f6f6f6', borderRadius: 15, marginBottom: 10 }}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', gap: 10, flex: 1 }}>
          <View style={styles.profile}>
            <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
          </View>
          <View style={{ flex: 1 }}>
            <Typo style={{ textTransform: "capitalize" }} s grey>{postedBy}</Typo>
            <Typo>{comment}</Typo>
            {
              loading ?
                <View style={{ width: '100%', marginTop: 10, alignItems: 'flex-start', marginLeft: 0 }}>
                  <ActivityIndicator />
                </View>

                :
                commentMode ?
                  <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, }}>
                    <TextInput value={subComment} onChangeText={(t) => setSC(t)} placeholder="Write something...." style={styles.input} />
                    <TouchableOpacity onPress={() => handleComment(index)}>
                      <FontAwesome name="send" size={15} color={Theme.primaryColor} />
                    </TouchableOpacity>
                  </View>
                  :
                  <TouchableOpacity onPress={() => setCM(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }}>
                    <Octicons name="comment" size={15} color={Theme.primaryColor} />
                    <Typo s style={{ color: Theme.primaryColor }}>Reply</Typo>
                  </TouchableOpacity>
            }
          </View>
        </View>
        <View style={{ position: 'absolute', top: 10, right: 10 }}>
          {/* <Typo xs style={{ color: Theme.greenColor }}>{formatTimestamp(time)}</Typo> */}
        </View>
      </View>
      {subCommentData && subCommentData.map((item, index) => {
        return (
          <SubComment
            key={index}
            comment={item.comment}
            postedBy={item.commentByName}
            image={item.commentProfilePic}
            time={item.timestamp}
          />
        );
      })}
    </View>
  )
}
export default CommentCard;


const SubComment = ({ image, comment, postedBy, time }) => {


  function parseCustomTimestamp(timestamp) {
    const parts = timestamp.match(/(\d+)/g);
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    const hour = parseInt(parts[3]);
    const minute = parseInt(parts[4]);
    const second = parseInt(parts[5]);

    return new Date(year, month, day, hour, minute, second);
  }



  return (
    <View style={styles.subcomment}>
      <View style={[styles.container, {
        backgroundColor: null
      }]}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', flex: 1 }}>
          <View style={{ height: 40, width: 40, borderRadius: 100, overflow: 'hidden' }}>
            <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
          </View>
          <View style={{ flex: 1 }}>
            <Typo s>{postedBy}</Typo>
            <Typo s grey>{comment}</Typo>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    padding: 10,
  },
  profile: {
    height: 45,
    width: 45,
    borderRadius: 50,
    backgroundColor: "#e5e5e5",
    overflow: 'hidden'
  },
  subcomment: {
    paddingLeft: 15,
    borderTopColor: '#f0f0f0',
    borderTopWidth: 1,
  },
  input: {
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginTop: 5,
    paddingVertical: 5,
    fontFamily: Theme.OutfitMedium,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    flex: 1
  }
});

const placeholder = "https://cdn-icons-png.flaticon.com/128/2202/2202112.png"