import React, { useEffect } from 'react';
import { StyleSheet, Text as RNText, View, Button, AppRegistry, AsyncStorage, Image } from 'react-native';
import { NavigationContainer, StackRouter } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { iOSColors, iOSUIKit } from 'react-native-typography';
import { Appbar, DefaultTheme, Provider as PaperProvider, Button as MatButton, DarkTheme, Theme, Text, Surface, TextInput } from 'react-native-paper';
import { Header } from './Header';
import { JoinScreen } from './JoinScreen';
import { GameScreen } from './GameScreen';
import { StackScreen } from './StackScreen'
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

const lightTheme: Theme = {
  ...DefaultTheme,
  roundness: 3,
  colors: {
    ...DefaultTheme.colors,
    primary: "tomato",
    accent: "orange"
    // primary: '#3498db',
    // accent: '#f1c40f',
  },
};

const darkTheme: Theme = {
  ...DarkTheme,
  roundness: 3,
  dark: true,
  mode: "exact",
  colors: {
    ...DarkTheme.colors,
    primary: "tomato",
    accent: "orange"
    // primary: '#3498db',
    // accent: '#f1c40f',
  },
};

export function InfoPage({ navigation, route }) {
  const [ defaultUsername, setDefaultUsername ] = React.useState("")
  AsyncStorage.getItem("default_username").then(username => {
    if (defaultUsername == "") {
      setDefaultUsername(username)
      console.log(username)
    }
  }).catch(err => {})

  return <Surface style={{ width: "100%", height: "100%", padding: 15 }}>
    <Text style={{ width: "100%", textAlign: "center", paddingBottom: 15 }}>Gio è ブラッド・ピット da giovane</Text>
    <Image source={require('./assets/brad_pitt.jpg')} resizeMode="contain" style={{ width: "100%", height: "90%" }} />
  </Surface>
}

export default function App() {
  let colorScheme = useColorScheme();

  return (
    <AppearanceProvider>
    <PaperProvider theme={ colorScheme === "dark" ? darkTheme : lightTheme }>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={"Join"}
          screenOptions={{
            header: ({ scene, previous, navigation }) => (
              <Header scene={scene} previous={previous} navigation={navigation} />
            ),
          }}
          headerMode="screen"
        >
          <Stack.Screen key="join" name="Join" component={JoinScreen} options={({navigation}) => ({
            title: "Briscolino",
            subtitle: "v1.0",
            headerRight: () => [
              <Appbar.Action key="info" icon="information" onPress={() => navigation.push("Info")} />
            ],
            // animationTypeForReplace: !loginData.addr ? 'pop' : 'push'
          })} />
          <Stack.Screen name="Home" key="home" component={GameScreen} /*initialParams={{ ...loginData }}*/ options={({ navigation }) => ({
            title: "Playing",
            gestureEnabled: false,
          })} />
          <Stack.Screen name="Stack" key="home" component={StackScreen} options={({ navigation }) => ({
            title: "Stack"
          })}/>
          <Stack.Screen name="Info" key="info" component={InfoPage}/>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
    </AppearanceProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

AppRegistry.registerComponent("main", () => App)



// headerRight: () => (
//   <Button
//     onPress={() => navigation.navigate("Settings")}
//     title="Settings"
//     color={iOSColors.red}
//   />
// ),
// headerRightContainerStyle: {
//   paddingRight: 10
// }
