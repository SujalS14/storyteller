import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import firbase from "firebase";

export default class Loading extends Component {
    checkIfLoggedIn=()=>{
        firbase.auth().onAuthStateChanged(user=>{
            if (user)
            this.props.navigation.navigate("Dashboard")
            else 
            this.props.navigation.navigate("LogIn")
        })
    }
    componentDidMount(){
        this.checkIfLoggedIn()
    }
  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
