import React, { useEffect } from 'react'

import { View, ScrollView, Platform, AsyncStorage, TouchableOpacity, Linking } from 'react-native';
import { Button, TextInput, Title, Text, Surface, Checkbox, IconButton, Dialog, Portal, Paragraph, Appbar, Card } from 'react-native-paper';
import { human } from 'react-native-typography';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';

export function JoinScreen({ navigation, route }) {
  const [ username, setUsername ] = React.useState("")
  const [ addr, setAddr ] = React.useState("")
  const [ connectToSecureSocket, setConnectToSecureSocket ] = React.useState(false)
  const [ httpsDialogVisible, setHttpsDialogVisible ] = React.useState(false)
  const [ settingsDialogVisible, setSettingsDialogVisible ] = React.useState(false)
  const colorScheme = useColorScheme()

  useEffect(() => {
    AsyncStorage.getItem("default_username").then(defUsername => {
      if (username === "") setUsername(defUsername || "")
    })
  
    AsyncStorage.getItem("default_addr").then(defAddr => {
      if (addr === "") setAddr(defAddr || "")
    })

    AsyncStorage.getItem("use_secure_socket").then(savedVal => {
      setConnectToSecureSocket(Boolean(savedVal))
    })

    navigation.setOptions({
      headerRight: () => [
        <Appbar.Action key="info" icon="information" onPress={() => navigation.push("Info")} />,
        <Appbar.Action key="settings" icon="settings" onPress={() => setSettingsDialogVisible(true)} />,
      ]
    })
  }, [])

  useEffect(() => {
    AsyncStorage.setItem("use_secure_socket", String(connectToSecureSocket))
  }, [connectToSecureSocket])

  return <Surface style={{ width: "100%", height: "100%" }}>
    <ScrollView keyboardDismissMode="interactive" automaticallyAdjustContentInsets centerContent={true} contentContainerStyle={{
      paddingHorizontal: 20, ...(Platform.OS == "web" && { flexDirection: "column", justifyContent: "center", flexGrow: 1 })
    }} contentInsetAdjustmentBehavior="always">
      <Portal>
        <Dialog
            visible={httpsDialogVisible}
            onDismiss={ () => setHttpsDialogVisible(false) }
            style={Platform.OS == 'web' ? { alignSelf: "center", maxWidth: 500 } : {}}
            dismissable={Platform.OS == 'web'}>
          <Dialog.Title>Secure WebSockets</Dialog.Title>
          <Dialog.Content>
            <Paragraph>You should enable this if you are connecting to a WebSocket over SSL (HTTPS).</Paragraph>
            <Paragraph>This can't be disabled if the app is running over HTTPS (eg: this page has the padlock on the address bar)</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={ () => setHttpsDialogVisible(false) }>Got it</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
            visible={settingsDialogVisible}
            onDismiss={ () => setSettingsDialogVisible(false) }
            style={Platform.OS == 'web' ? { alignSelf: "center", maxWidth: 500 } : {}}
            dismissable={Platform.OS == 'web'}>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.Content>
            <Paragraph><Text>The settings area is currently... empty</Text></Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={ () => setSettingsDialogVisible(false) }>Got it</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      <View style={{ marginVertical: Platform.OS == 'web' ? 15 : 0, padding: 15, borderColor: colorScheme == 'dark' ? "#ffffff33" : "#00000033", borderStyle: "solid", borderWidth: 1, borderRadius: 4, marginBottom: 30}}>
        <Title style={{ marginBottom: 15, fontWeight: '700' }}>Join a match</Title>

        <TextInput label="Username" value={username} mode="outlined" onChange={e => setUsername(e.nativeEvent.text)} style={{ marginBottom: 15 }} />
        <TextInput label="Address" value={addr} mode="outlined" onChange={e => setAddr(e.nativeEvent.text)} style={{ marginBottom: 10 }} />
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
          <View style={{ padding: 0 }}>
            <Checkbox disabled={Platform.OS == 'web' && window.location.protocol == 'https:'} status={connectToSecureSocket || (Platform.OS == 'web' && window.location.protocol == 'https:') ? "checked" : "unchecked"} onPress={() => setConnectToSecureSocket(prev => !prev)} />
          </View>
          <Text>Connect to secure WebSocket</Text><IconButton icon="help" onPress={() => setHttpsDialogVisible(true)} />
        </View>
        <Button mode="contained" onPress={() => {
          if (Platform.OS != 'web') Haptics.selectionAsync()
          navigation.navigate("Home", { addr: addr, username: username, secure: connectToSecureSocket })
        }} disabled={username.trim() === "" || addr.trim() === ""}>Join</Button>
      </View>

    </ScrollView>
    <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, padding: 10 }}>
      <TouchableOpacity onPress={() => { Platform.OS == "web" ? window.open("https://marte.dev", '_blank') :  Linking.openURL("https://marte.dev") }}>
        <Text style={{textAlign: "center", opacity: 0.3 }}>marte.dev</Text>
      </TouchableOpacity>
    </View>
    <View style={{ position: "absolute", bottom: 0, left: 0, right: 10, height: 40, padding: 10 }}>
      <Text style={{textAlign: "right", opacity: 0.3 }}>v1.0</Text>
    </View>
    <KeyboardSpacer />
  </Surface>
}
