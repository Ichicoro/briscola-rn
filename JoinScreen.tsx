import React from 'react'

import { View, FlatList, ScrollView, Platform } from 'react-native';
import { Button, TextInput, Title, Text, Surface } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text';
import { human } from 'react-native-typography';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import * as Haptics from 'expo-haptics';

export function JoinScreen({ navigation, route }) {
  const [ username, setUsername ] = React.useState(Platform.OS == 'ios' ? "Ichicoro" : "Ichicoro2")
  const [ addr, setAddr ] = React.useState("192.168.1.11")

  return <Surface style={{ width: "100%", height: "100%" }}>
    <ScrollView keyboardDismissMode="interactive" automaticallyAdjustContentInsets centerContent={true} contentContainerStyle={{
      paddingHorizontal: 20,
    }} contentInsetAdjustmentBehavior="always">
      <Title style={{ marginBottom: 15 }}>Join a match</Title>
      
      <TextInput label="Username" value={username} mode="outlined" onChange={e => setUsername(e.nativeEvent.text)} style={{ marginBottom: 15 }} />
      <TextInput label="Address" value={addr} mode="outlined" onChange={e => setAddr(e.nativeEvent.text)} style={{ marginBottom: 15 }} />
      
      <Button mode="contained" onPress={() => {
        if (Platform.OS != 'web') Haptics.selectionAsync()
        navigation.navigate("Home", { addr: addr, username: username })
        // route.params?.setLoginData()
      }} style={{ marginBottom: 40 }} disabled={username == "" || addr == ""}>Join</Button>
    </ScrollView>
    <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, padding: 20 }}>
      <Text style={{textAlign: "center", opacity: 0.3 }}>marte.dev</Text>
    </View>
    <KeyboardSpacer />
  </Surface>
}
