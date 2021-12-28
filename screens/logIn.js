import React, { Component } from "react";
import { StyleSheet, Text, View, Button, SafeAreaView, Platform, StatusBar, Image, TouchableOpacity } from "react-native";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { FlatList } from "react-native-gesture-handler";

let customFonts = {
    "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class LogIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false
        };
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
    }
    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            const providerData = firebaseUser.providerData;
            for (let i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    }
    onSignIn = (googleUser) => {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!isUserEqual(googleUser, firebaseUser)) {
                // Build Firebase credential with the Google ID token.
                const credential = GoogleAuthProvider.credential(
                    googleUser.getAuthResponse().id_token);

                // Sign in with credential from the Google user.
                signInWithCredential(auth, credential).catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.email;
                    // The credential that was used.
                    const credential = GoogleAuthProvider.credentialFromError(error);
                    // ...
                });
            } else {
                console.log('User already signed-in Firebase.');
            }
        });
    }

    signInWithGoogleAsync = async () => {
        try {
            const result = await Google.logInAsync({
                androidClientId: "189624761275-po5e37jme645gpq1bsibrlhggn24e1at.apps.googleusercontent.com",
                iosClientId: "189624761275-rmuj11g7ed7lohhoj5nt9852vnmnfqjb.apps.googleusercontent.com",
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        }
    }

    render() {
        if (!this.state.fontsLoaded) {
            return <AppLoading />;
          } else {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={styles.appTitleText}>Storytelling App</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={()=>this.signInWithGoogleAsync()}> 
              <Image style={styles.googleIcon} source={require("../assets/google_icon.png")}/> <Text style={styles.googleText}> SIGN IN WITH GOOGLE</Text>
               </TouchableOpacity>
               </View>
               <View style={styles.cloudContainer}> 
               <Image style={styles.cloudImage} source={require("../assets/cloud.png")}/>
               </View>
            </View>
        );
          }
    }
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#15193c" }, droidSafeArea: { marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35) }, appTitle: { flex: 0.4, justifyContent: "center", alignItems: "center" }, appIcon: { width: RFValue(130), height: RFValue(130), resizeMode: "contain" }, appTitleText: { color: "white", textAlign: "center", fontSize: RFValue(40), fontFamily: "Bubblegum-Sans" }, buttonContainer: { flex: 0.3, justifyContent: "center", alignItems: "center" }, button: { width: RFValue(250), height: RFValue(50), flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", borderRadius: RFValue(30), backgroundColor: "white" }, googleIcon: { width: RFValue(30), height: RFValue(30), resizeMode: "contain" }, googleText: { color: "black", fontSize: RFValue(20), fontFamily: "Bubblegum-Sans" }, cloudContainer: { flex: 0.3 }, cloudImage: { position: "absolute", width: "100%", resizeMode: "contain", bottom: RFValue(-5) } });