import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
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

function ForumInside({ route }) {
  const { item, cardColor, forumDetails } = route.params;
  const [commentsData, setCommentsData] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const userData = useStore((state) => state.userData);
  const adBanners = useStore((state) => state.adBanners);

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

  function containsAbusiveLanguage(text) {
    const lowerCaseText = text.toLowerCase();
    return abusiveWords.some((word) => lowerCaseText.includes(word));
  }

  const handleComment = async () => {
    if (comment) {
      if (containsAbusiveLanguage(comment)) {
        Alert.alert(
          "Offensive Language Detected",
          "Please check your language. We do not allow offensive language in comments."
        );
        return;
      }
    }
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
          commentProfilePic: userData.profilePic
            ? userData.profilePic
            : placeholder,
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
          {adBanners ? (
            <Image
              source={{ uri: adBanners.forumBanner }}
              style={{ width: "100%", height: 150, borderRadius: 10 }}
            />
          ) : null}
        </View>

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

const placeholder = "https://cdn-icons-png.flaticon.com/128/2202/2202112.png";
