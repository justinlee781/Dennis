import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from "react-native";
import HeaderTwoIcons from "../../components/Headers/HeaderTwoIcons";
import Theme from "../../src/Theme";
import Typo from "../../components/utils/Typo";

function TermsConditions({navigation}) {
    return (
        <View style={styles.container}>
            <View style={styles.headerBackground}>
                <HeaderTwoIcons
                    label={'Terms and Conditions'}
                    rightIcon={true}
                    rightIconName={"x"}
                    handleRightIconPress={() => navigation.goBack()}
                />
            </View>
            <View style={styles.contentContainer}>
                <ScrollView>
                    <Typo style={styles.sectionTitle}>End User License Agreement (EULA)</Typo>
                    <Text style={styles.paragraph}>Please read this End User License Agreement  carefully before using Duckdive provided by Justin Lee . By using this App, you ("User" or "you") agree to be bound by this Agreement.</Text>
                    
                    <Typo style={styles.sectionTitle}>1. Acceptance of Terms</Typo>
                    <Text style={styles.paragraph}>By accessing or using the App, you agree to comply with the terms of this Agreement. If you do not agree with the terms, do not use or access the App.</Text>
                    
                    <Typo style={styles.sectionTitle}>2. License Grant</Typo>
                    <Text style={styles.paragraph}>We grant you a non-exclusive, non-transferable, revocable license to use the App in accordance with this Agreement for your personal, non-commercial use only.</Text>
                    
                    <Typo style={styles.sectionTitle}>3. Restrictions</Typo>
                    <Text style={styles.bulletPoint}>• Modify, copy, distribute, or reverse engineer the App.</Text>
                    <Text style={styles.bulletPoint}>• Use the App for unlawful purposes or violate any laws and regulations.</Text>
                    <Text style={styles.bulletPoint}>• Post or transmit offensive, abusive, obscene, or otherwise objectionable content.</Text>
                    <Text style={styles.bulletPoint}>• Harass, stalk, or otherwise abuse other users.</Text>
                    
                    <Typo style={styles.sectionTitle}>4. User-Generated Content</Typo>
                    <Text style={styles.paragraph}>The App may allow you to create, upload, share, or display content ("User Content"). You are responsible for any User Content you post or share. By using the App, you agree that:</Text>
                    <Text style={styles.bulletPoint}>• You will not post any content that is abusive, offensive, discriminatory, or violates any laws.</Text>
                    <Text style={styles.bulletPoint}>• You will not post or share any content that contains malware, viruses, or harmful software.</Text>
                    <Text style={styles.bulletPoint}>• You retain ownership of your User Content but grant us a non-exclusive, royalty-free, worldwide license to use, reproduce, distribute, and display your content within the App.</Text>
                    
                    <Typo style={styles.sectionTitle}>5. Reporting and Moderation</Typo>
                    <Text style={styles.paragraph}>The App includes features for reporting objectionable content. If you encounter offensive content, please report it immediately.</Text>
                    <Text style={styles.paragraph}>You can block or mute users who engage in abusive behavior.</Text>
                    <Text style={styles.paragraph}>We will review and remove objectionable content within 24 hours of being notified and may eject or ban users responsible for such content.</Text>
                    
                    <Typo style={styles.sectionTitle}>6. Disclaimer and Limitation of Liability</Typo>
                    <Text style={styles.paragraph}>The App is provided "as-is" without warranties of any kind, express or implied.</Text>
                    <Text style={styles.paragraph}>We are not liable for any loss, damage, or harm resulting from your use of the App.</Text>
                    
                    <Typo style={styles.sectionTitle}>7. Termination</Typo>
                    <Text style={styles.paragraph}>We may terminate or suspend your account and access to the App without notice for violations of this Agreement or other misconduct.</Text>

                    <Typo style={styles.sectionTitle}>8. Changes to This Agreement</Typo>
                    <Text style={styles.paragraph}>We may update this Agreement from time to time. If we make changes, we will notify you via the App or email. Your continued use of the App constitutes your acceptance of the updated terms.</Text>
                    
                    <Typo style={styles.sectionTitle}>9. Contact Information</Typo>
                    <Text style={styles.paragraph}>If you have questions about this Agreement, contact us at "lee.justin781@gmail.com"</Text>
                </ScrollView>
            </View>
        </View>
    );
}

export default TermsConditions;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerBackground: {
        backgroundColor: "#ffa1a1",
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical:10
    },
    sectionTitle: {
        fontSize: 20,
        marginVertical: 10,
        fontFamily:Theme.OutfitBold
    },
    paragraph: {
        fontSize: 16,
        marginVertical: 5,
        fontFamily:Theme.OutfitMedium
    },
    bulletPoint: {
        fontSize: 16,
        marginVertical: 2,
        marginLeft: 10,
        fontFamily:Theme.OutfitMedium
    }
});
