import React, { useEffect } from 'react';
import { AppLoading } from 'expo';
import { useFonts } from '@use-expo/font';
import { StyleSheet, Text as RNText, View, Button, AppRegistry, AsyncStorage, Image } from 'react-native';
import { NavigationContainer, StackRouter } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { iOSColors, iOSUIKit } from 'react-native-typography';
import { Appbar, DefaultTheme, Provider as PaperProvider, Button as MatButton, DarkTheme, Theme, Text, Surface, TextInput, configureFonts, Portal } from 'react-native-paper';
import { Header } from './Header';
import { JoinScreen } from './JoinScreen';
import { GameScreen } from './GameScreen';
import { StackScreen } from './StackScreen'
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import 'react-native-gesture-handler';

const fontConfig = {
  android: null,
  ios: null,
  web: null,
  default: {
    regular: {
      fontFamily: 'Rubik-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Rubik-Medium',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Rubik-Bold',
      fontWeight: 'normal',
    },
    black: {
      fontFamily: 'Rubik-Black',
      fontWeight: '800' as '800',
    },
    light: {
      fontFamily: 'Rubik-Light',
      fontWeight: '300' as '300',
    }
  },
};

fontConfig.ios = fontConfig.default;
fontConfig.web = fontConfig.default;
fontConfig.android = fontConfig.default;

const Stack = createStackNavigator();

const lightTheme: Theme = {
  ...DefaultTheme,
  roundness: 3,
  fonts: configureFonts(fontConfig),
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
  fonts: configureFonts(fontConfig),
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
  return <Surface style={{ width: "100%", height: "100%", padding: 15 }}>
    <Text style={{ width: "100%", textAlign: "center", paddingBottom: 15 }}>Gio è ブラッド・ピット da giovane</Text>
    <Image source={require('./assets/brad_pitt.jpg')} resizeMode="contain" style={{ width: "100%", height: "90%" }} />
  </Surface>
}

export default function App() {
  let colorScheme = useColorScheme();

  const fontsDidLoad = useFonts({
    'Rubik-Black': require("./assets/Rubik/Rubik-Black.ttf"),
    'Rubik-BlackItalic': require("./assets/Rubik/Rubik-BlackItalic.ttf"),
    'Rubik-Medium': require("./assets/Rubik/Rubik-Medium.ttf"),
    'Rubik-MediumItalic': require("./assets/Rubik/Rubik-MediumItalic.ttf"),
    'Rubik-Regular': require("./assets/Rubik/Rubik-Regular.ttf"),
    'Rubik-Italic': require("./assets/Rubik/Rubik-Italic.ttf"),
    'Rubik-Light': require("./assets/Rubik/Rubik-Light.ttf"),
    'Rubik-LightItalic': require("./assets/Rubik/Rubik-LightItalic.ttf"),
    'Rubik-Bold': require("./assets/Rubik/Rubik-Bold.ttf"),
    'Rubik-BoldItalic': require("./assets/Rubik/Rubik-BoldItalic.ttf"),
  })

  if (!fontsDidLoad) return <AppLoading />

  return (
    <AppearanceProvider>
      <PaperProvider theme={ colorScheme === "dark" ? darkTheme : lightTheme }>
      <Portal.Host>
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
              headerRight: () => [
                <Appbar.Action key="info" icon="information" onPress={() => navigation.push("Info")} />
              ],
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
      </Portal.Host>
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
