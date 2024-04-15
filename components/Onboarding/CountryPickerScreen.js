import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import assets from "../../assets/assets";
import Theme from "../../src/Theme";
import Typo from "../../components/utils/Typo";
import Space from "../../components/utils/Space";
import InputBox from "../../components/utils/InputBox";
import { AntDesign } from '@expo/vector-icons';
import FullButton from "../../components/Buttons/FullButton";

function CountryPickerScreen({ navigation }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [countriesData, setCountriesData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Country');
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
  };


  async function fetchCountryData() {
    try {
      const response = await fetch("https://restcountries.com/v2/all");
      const data = await response.json();
      return data.map((country) => ({
        id: country.alpha2Code,
        name: country.name,
        flag: country.flags.png,
      }));
    } catch (error) {
      console.error("Error fetching country data:", error);
      return [];
    }
  }
  

  useEffect(() => {
    fetchCountryData()
      .then((data) => {
        setCountriesData(data);
        setFilteredCountries(data);
      })
      .catch((error) => {
        console.error("Error fetching country data:", error);
      });
  }, []);

  const handleSearch = (text) => {
    const filtered = countriesData.filter((country) =>
      country.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCountries(filtered);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.countryItem,
      ]}
      onPress={() => setSelectedCountry(item)}
    >
      <Image source={{ uri: item.flag }} style={styles.flagIcon} />
      <Text style={styles.countryName}>{item.name}</Text>
      {selectedCountry === item && (
        <AntDesign name="checkcircle" size={18} color={Theme.primaryColor} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Image source={assets.iconDown} style={styles.down} />
        </TouchableOpacity>
        <Typo light>Select Country / Region</Typo>
        <View style={{ width: 25 }} />
      </View>

      <View style={styles.tabWrapper}>
        <TouchableOpacity
          style={[
            styles.halfWrapper,
            selectedTab === "Country" ? styles.selectedTab : null,
          ]}
          onPress={() => handleTabPress("Country")}
        >
          <Typo
            s
            light
            style={selectedTab === "Country" ? styles.selectedTabText : null}
          >
            Country
          </Typo>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.halfWrapper,
            selectedTab === "Language" ? styles.selectedTab : null,
          ]}
          onPress={() => handleTabPress("Language")}
        >
          <Typo
            s
            light
            style={selectedTab === "Language" ? styles.selectedTabText : null}
          >
            Language
          </Typo>
        </TouchableOpacity>
      </View>

      {selectedTab === "Country" ? (
        <View style={styles.body}>
          <InputBox
            leftIcon="search"
            placeholder="Search"
            onChangeText={handleSearch}
          />
          <Space space={20} />
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filteredCountries.sort((a, b) =>
              a.name.localeCompare(b.name)
            )} // Sort countries alphabetically
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      ) : (
        <View style={styles.body}>
          <TouchableOpacity
            style={[
              styles.languageOption,
              selectedLanguage === "English" ? styles.selectedLanguage : null,
            ]}
            onPress={() => setSelectedLanguage("English")}
          >
            <Typo s>{"English"}</Typo>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.languageOption,
              selectedLanguage === "Arabic" ? styles.selectedLanguage : null,
            ]}
            onPress={() => setSelectedLanguage("Arabic")}
          >
            <Typo s>{"Arabic"}</Typo>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.languageOption,
              selectedLanguage === "Dari" ? styles.selectedLanguage : null,
            ]}
            onPress={() => setSelectedLanguage("Dari")}
          >
            <Typo s>{"Dari"}</Typo>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.overLap}>
        <FullButton handlePress={()=>navigation.goBack()} color={Theme.primaryColor} label={'Save'} />
      </View>
    </View>
  );
}

export default CountryPickerScreen;

  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 20,
    backgroundColor: Theme.backgroundColor,
  },
  down: {
    height: 35,
    width: 35,
    resizeMode: "contain",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  body: {
    flex: 1,
    paddingVertical: 20,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingVertical: 15,
  },
  selectedCountry: {
    backgroundColor: "#f0f0f0", // Add some background color for selected country
  },
  flagIcon: {
    height: 18,
    width: 18,
    resizeMode: "contain",
    marginRight: 10,
  },
  countryName: {
    flex: 1,
    fontSize: 14,
    fontFamily: Theme.OutfitMedium,
  },
  checkIcon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  tabWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: Theme.containerGrey,
    height: 50,
    borderRadius: 15,
    padding: 5,
  },
  halfWrapper: {
    height: "100%",
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTab: {
    backgroundColor: Theme.primaryColor,
    borderRadius: 15,
  },
  selectedTabText: {
    color: "#FFFF",
  },
  languageOption: {
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  selectedLanguage: {
    backgroundColor: Theme.secondaryColor,
  },
  overLap:{
    position:'absolute',
    bottom:30,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    left:25
  }
});