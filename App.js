import * as React from "react";
import LogIn from "./screens/logIn";
import Dashboard from "./screens/dashboard";
import Loading from "./screens/loadingScreen";
import {createSwitchNavigator, createAppContainer} from "react-navigation";
import { firebaseConfig } from "./config";

if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
 }
  else {
     firebase.app();
     }

const SwitchNavigator = createSwitchNavigator({
  Loading:Loading,
  LogIn:LogIn,
  Dashboard:Dashboard
})

const AppContainer = createAppContainer(SwitchNavigator)

export default function App() {
  return (
    <AppContainer/>
  );
}
