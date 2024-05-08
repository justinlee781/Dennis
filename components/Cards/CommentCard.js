import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Octicons, FontAwesome } from "@expo/vector-icons";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import Typo from "../utils/Typo";
import Theme from "../../src/Theme";
import useStore from "../../store";
import { dbFS } from "../../config/firebase";

const abusiveWords = [
  "4r5e",
  "5h1t",
  "5hit",
  "a55",
  "anal",
  "anus",
  "ar5e",
  "arrse",
  "arse",
  "ass",
  "ass-fucker",
  "asses",
  "assfucker",
  "assfukka",
  "asshole",
  "assholes",
  "asswhole",
  "a_s_s",
  "b!tch",
  "b00bs",
  "b17ch",
  "b1tch",
  "ballbag",
  "balls",
  "ballsack",
  "bastard",
  "beastial",
  "beastiality",
  "bellend",
  "bestial",
  "bestiality",
  "bi+ch",
  "biatch",
  "bitch",
  "bitcher",
  "bitchers",
  "bitches",
  "bitchin",
  "bitching",
  "bloody",
  "blow job",
  "blowjob",
  "blowjobs",
  "boiolas",
  "bollock",
  "bollok",
  "boner",
  "boob",
  "boobs",
  "booobs",
  "boooobs",
  "booooobs",
  "booooooobs",
  "breasts",
  "buceta",
  "bugger",
  "bum",
  "bunny fucker",
  "butt",
  "butthole",
  "buttmuch",
  "buttplug",
  "c0ck",
  "c0cksucker",
  "carpet muncher",
  "cawk",
  "chink",
  "cipa",
  "cl1t",
  "clit",
  "clitoris",
  "clits",
  "cnut",
  "cock",
  "cock-sucker",
  "cockface",
  "cockhead",
  "cockmunch",
  "cockmuncher",
  "cocks",
  "cocksuck",
  "cocksucked",
  "cocksucker",
  "cocksucking",
  "cocksucks",
  "cocksuka",
  "cocksukka",
  "cok",
  "cokmuncher",
  "coksucka",
  "coon",
  "cox",
  "crap",
  "cum",
  "cummer",
  "cumming",
  "cums",
  "cumshot",
  "cunilingus",
  "cunillingus",
  "cunnilingus",
  "cunt",
  "cuntlick",
  "cuntlicker",
  "cuntlicking",
  "cunts",
  "cyalis",
  "cyberfuc",
  "cyberfuck",
  "cyberfucked",
  "cyberfucker",
  "cyberfuckers",
  "cyberfucking",
  "d1ck",
  "damn",
  "dick",
  "dickhead",
  "dildo",
  "dildos",
  "dink",
  "dinks",
  "dirsa",
  "dlck",
  "dog-fucker",
  "doggin",
  "dogging",
  "donkeyribber",
  "doosh",
  "duche",
  "dyke",
  "ejaculate",
  "ejaculated",
  "ejaculates",
  "ejaculating",
  "ejaculatings",
  "ejaculation",
  "ejakulate",
  "f u c k",
  "f u c k e r",
  "f4nny",
  "fag",
  "fagging",
  "faggitt",
  "faggot",
  "faggs",
  "fagot",
  "fagots",
  "fags",
  "fanny",
  "fannyflaps",
  "fannyfucker",
  "fanyy",
  "fatass",
  "fcuk",
  "fcuker",
  "fcuking",
  "feck",
  "fecker",
  "felching",
  "fellate",
  "fellatio",
  "fingerfuck",
  "fingerfucked",
  "fingerfucker",
  "fingerfuckers",
  "fingerfucking",
  "fingerfucks",
  "fistfuck",
  "fistfucked",
  "fistfucker",
  "fistfuckers",
  "fistfucking",
  "fistfuckings",
  "fistfucks",
  "flange",
  "fook",
  "fooker",
  "fuck",
  "fucka",
  "fucked",
  "fucker",
  "fuckers",
  "fuckhead",
  "fuckheads",
  "fuckin",
  "fucking",
  "fuckings",
  "fuckingshitmotherfucker",
  "fuckme",
  "fucks",
  "fuckwhit",
  "fuckwit",
  "fudge packer",
  "fudgepacker",
  "fuk",
  "fuker",
  "fukker",
  "fukkin",
  "fuks",
  "fukwhit",
  "fukwit",
  "fux",
  "fux0r",
  "f_u_c_k",
  "gangbang",
  "gangbanged",
  "gangbangs",
  "gaylord",
  "gaysex",
  "goatse",
  "God",
  "god-dam",
  "god-damned",
  "goddamn",
  "goddamned",
  "hardcoresex",
  "hell",
  "heshe",
  "hoar",
  "hoare",
  "hoer",
  "homo",
  "hore",
  "horniest",
  "horny",
  "hotsex",
  "jack-off",
  "jackoff",
  "jap",
  "jerk-off",
  "jism",
  "jiz",
  "jizm",
  "jizz",
  "kawk",
  "knob",
  "knobead",
  "knobed",
  "knobend",
  "knobhead",
  "knobjocky",
  "knobjokey",
  "kock",
  "kondum",
  "kondums",
  "kum",
  "kummer",
  "kumming",
  "kums",
  "kunilingus",
  "l3i+ch",
  "l3itch",
  "labia",
  "lust",
  "lusting",
  "m0f0",
  "m0fo",
  "m45terbate",
  "ma5terb8",
  "ma5terbate",
  "masochist",
  "master-bate",
  "masterb8",
  "masterbat*",
  "masterbat3",
  "masterbate",
  "masterbation",
  "masterbations",
  "masturbate",
  "mo-fo",
  "mof0",
  "mofo",
  "mothafuck",
  "mothafucka",
  "mothafuckas",
  "mothafuckaz",
  "mothafucked",
  "mothafucker",
  "mothafuckers",
  "mothafuckin",
  "mothafucking",
  "mothafuckings",
  "mothafucks",
  "mother fucker",
  "motherfuck",
  "motherfucked",
  "motherfucker",
  "motherfuckers",
  "motherfuckin",
  "motherfucking",
  "motherfuckings",
  "motherfuckka",
  "motherfucks",
  "muff",
  "mutha",
  "muthafecker",
  "muthafuckker",
  "muther",
  "mutherfucker",
  "n1gga",
  "n1gger",
  "nazi",
  "nigg3r",
  "nigg4h",
  "nigga",
  "niggah",
  "niggas",
  "niggaz",
  "nigger",
  "niggers",
  "nob",
  "nob jokey",
  "nobhead",
  "nobjocky",
  "nobjokey",
  "numbnuts",
  "nutsack",
  "orgasim",
  "orgasims",
  "orgasm",
  "orgasms",
  "p0rn",
  "pawn",
  "pecker",
  "penis",
  "penisfucker",
  "phonesex",
  "phuck",
  "phuk",
  "phuked",
  "phuking",
  "phukked",
  "phukking",
  "phuks",
  "phuq",
  "pigfucker",
  "pimpis",
  "piss",
  "pissed",
  "pisser",
  "pissers",
  "pisses",
  "pissflaps",
  "pissin",
  "pissing",
  "pissoff",
  "poop",
  "porn",
  "porno",
  "pornography",
  "pornos",
  "prick",
  "pricks",
  "pron",
  "pube",
  "pusse",
  "pussi",
  "pussies",
  "pussy",
  "pussys",
  "rectum",
  "retard",
  "rimjaw",
  "rimming",
  "s hit",
  "s.o.b.",
  "sadist",
  "schlong",
  "screwing",
  "scroat",
  "scrote",
  "scrotum",
  "semen",
  "sex",
  "sh!+",
  "sh!t",
  "sh1t",
  "shag",
  "shagger",
  "shaggin",
  "shagging",
  "shemale",
  "shi+",
  "shit",
  "shitdick",
  "shite",
  "shited",
  "shitey",
  "shitfuck",
  "shitfull",
  "shithead",
  "shiting",
  "shitings",
  "shits",
  "shitted",
  "shitter",
  "shitters",
  "shitting",
  "shittings",
  "shitty",
  "skank",
  "slut",
  "sluts",
  "smegma",
  "smut",
  "snatch",
  "son-of-a-bitch",
  "spac",
  "spunk",
  "s_h_i_t",
  "t1tt1e5",
  "t1tties",
  "teets",
  "teez",
  "testical",
  "testicle",
  "tit",
  "titfuck",
  "tits",
  "titt",
  "tittie5",
  "tittiefucker",
  "titties",
  "tittyfuck",
  "tittywank",
  "titwank",
  "tosser",
  "turd",
  "tw4t",
  "twat",
  "twathead",
  "twatty",
  "twunt",
  "twunter",
  "v14gra",
  "v1gra",
  "vagina",
  "viagra",
  "vulva",
  "w00se",
  "wang",
  "wank",
  "wanker",
  "wanky",
  "whoar",
  "whore",
  "willies",
  "willy",
  "xrated",
  "xxx",
];

function CommentCard({
  image,
  postedBy,
  comment,
  collectionName,
  index,
  docID,
  subCommentData,
}) {
  const [commentMode, setCM] = useState(false);
  const [subComment, setSC] = useState("");
  const userID = useStore((state) => state.userID);
  const userData = useStore((state) => state.userData);
  const [loading, setLoading] = useState(false);

  function containsAbusiveLanguage(text) {
    const lowerCaseText = text.toLowerCase();
    return abusiveWords.some((word) => lowerCaseText.includes(word));
  }

  const handleComment = async (index) => {
    if (subComment) {
      if (containsAbusiveLanguage(subComment)) {
        Alert.alert(
          "Offensive Language Detected",
          "Please check your language. We do not allow offensive language in comments."
        );
        return;
      }
    }

    if (subComment) {
      try {
        setLoading(true);

        const forumRef = doc(dbFS, "forums", "forums", collectionName, docID);

        const forumDoc = await getDoc(forumRef);

        const commentsArray = forumDoc.data()?.comments || [];

        const commentIndex = index;

        // Initialize 'subComments' array if it doesn't exist
        commentsArray[commentIndex].subComments =
          commentsArray[commentIndex].subComments || [];

        // Add the new sub-comment to the 'subComments' array
        const newSubComment = {
          commentedBy: userID,
          commentByName: userData.userName
            ? userData.userName
            : userData.fullName,
          comment: subComment,
          timestamp: new Date().toISOString(),
          commentProfilePic: userData.profilePic
            ? userData.profilePic
            : placeholder,
        };

        commentsArray[commentIndex].subComments.push(newSubComment);

        // Update the document with the new sub-comment
        await updateDoc(forumRef, { comments: commentsArray });
        Alert.alert(
          "Commented Posted",
          "Your comment has been posted successfully."
        );
        setLoading(false);
        setSC("");
        setCM(false);
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
    const parts = extractedDate.split("/");
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const year = parseInt(parts[2]);

    const today = new Date();
    const isToday =
      today.getDate() === day &&
      today.getMonth() + 1 === month &&
      today.getFullYear() === year;

    if (isToday) {
      return today.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } else {
      return extractedDate; // Return the original date if it's not today
    }
  }

  return (
    <View
      style={{ backgroundColor: "#f6f6f6", borderRadius: 15, marginBottom: 10 }}
    >
      <View style={styles.container}>
        <View style={{ flexDirection: "row", gap: 10, flex: 1 }}>
          <View style={styles.profile}>
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{flex:1,paddingRight:10}}>
              <Typo style={{ textTransform: "capitalize" }} s grey>
              {postedBy}
            </Typo>
            <Typo>{comment}</Typo>
              </View>
              <TouchableOpacity
                onPress={() => Alert.alert("Report Submitted","We have received your report related to this comment and it will be reviewed within 24 hours.")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 5,
                }}
              >
                <Octicons name="report" size={12} color={Theme.primaryColor} />
                <Typo xs style={{ color: Theme.primaryColor }}>
                  Report
                </Typo>
              </TouchableOpacity>
            </View>
            {loading ? (
              <View
                style={{
                  width: "100%",
                  marginTop: 10,
                  alignItems: "flex-start",
                  marginLeft: 0,
                }}
              >
                <ActivityIndicator />
              </View>
            ) : commentMode ? (
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
                  value={subComment}
                  onChangeText={(t) => setSC(t)}
                  placeholder="Write something...."
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => handleComment(index)}>
                  <FontAwesome
                    name="send"
                    size={15}
                    color={Theme.primaryColor}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setCM(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 5,
                }}
              >
                <Octicons name="comment" size={15} color={Theme.primaryColor} />
                <Typo s style={{ color: Theme.primaryColor }}>
                  Reply
                </Typo>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={{ position: "absolute", top: 10, right: 10 }}>
    
        </View>
      </View>
      {subCommentData &&
        subCommentData.map((item, index) => {
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
  );
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
      <View
        style={[
          styles.container,
          {
            backgroundColor: null,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            flex: 1,
          }}
        >
          <View
            style={{
              height: 40,
              width: 40,
              borderRadius: 100,
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Typo s>{postedBy}</Typo>
            <Typo s grey>
              {comment}
            </Typo>
          </View>
        </View>
      </View>
    </View>
  );
};

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
    overflow: "hidden",
  },
  subcomment: {
    paddingLeft: 15,
    borderTopColor: "#f0f0f0",
    borderTopWidth: 1,
  },
  input: {
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginTop: 5,
    paddingVertical: 5,
    fontFamily: Theme.OutfitMedium,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    flex: 1,
  },
});

const placeholder = "https://cdn-icons-png.flaticon.com/128/2202/2202112.png";
