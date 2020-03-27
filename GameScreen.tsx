import React, { useEffect } from 'react'
import { View, FlatList, ScrollView, TouchableOpacity, Platform, AsyncStorage, Alert } from 'react-native';
import { Button, TextInput, Title, Text, Surface, Snackbar, FAB, Card, Appbar, DataTable } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { MatchState } from './match'
import { Card as GameCard } from './card'
import Mutex from './Mutex'
import * as Haptics from 'expo-haptics';


function PlayerBoard({ players }) {
  console.log(players)
  return <Card style={{ width: "100%", height: "100%"}} elevation={4}><DataTable>
    <DataTable.Header>
      <DataTable.Title>Player</DataTable.Title>
      { players[0]?.points !== undefined && <DataTable.Title numeric>Score</DataTable.Title> }
    </DataTable.Header>

    { players.map(player => <DataTable.Row>
      <DataTable.Cell>{ player.username }</DataTable.Cell>
      { player.points !== undefined && <DataTable.Cell numeric>{player.points}</DataTable.Cell> }
    </DataTable.Row>)}
  </DataTable></Card>
}

export function GameScreen({ navigation, route }) {
  const [ trumpCard, setTrumpCard ] = React.useState(null)
  const [ matchState, setMatchState ] = React.useState(MatchState.NOT_STARTED)
  const [ snackbarText, setSnackbarText ] = React.useState(null)
  const [ hand, setHand ] = React.useState([])
  const [ handMutex, setHandMutex ] = React.useState(new Mutex())
  const [ table, setTable ] = React.useState([])
  const [ stack, setStack ] = React.useState([])
  const [ playerList, setPlayerList ] = React.useState([])
  const [ cardsAreEnabled, setCardsAreEnabled ] = React.useState(true)

  console.log(hand)

  const handleMessageData = async data => {
    if (data.type === "setTrumpCard" && data.trumpCard != null) {
      setTrumpCard(GameCard.fromData(data.trumpCard))
    } else if (data.type === "state") {
      setMatchState(data.state)
    } else if (data.type === "dealtCard") {
      setHand(prevHand => [ ...prevHand, GameCard.fromData(data.card) ].filter((a, b, i) => i.indexOf(a) === b))
    } else if (data.type === "playedCard") {
      setTable(prevTable => [ ...prevTable, GameCard.fromData(data.card) ].filter((a, b, i) => i.indexOf(a) === b))
      navigation.setOptions({ subtitle: `Next player: ${data.nextPlayer}`})
      console.log(data)
    } else if (data.type === "removeCard") {
      setHand(prevHand => prevHand.filter(c => !c.equals(data.card)))
    } else if (data.type === "announcement") {
      setSnackbarText(data.message)
    } else if (data.type === "clearTable") {
      setCardsAreEnabled(false)
      setTimeout(() => {
        setTable([])
        setCardsAreEnabled(true)
      }, 1750)
    } else if (data.type === "clearHand") {
      setHand([])
    } else if (data.type === "nextPlayer") {
      navigation.setOptions({ subtitle: `Next player: ${data.nextPlayer == route.params.username ? "You!" : data.nextPlayer}`})
    } else if (data.type === "addCardToStack") {
      setStack(prevStack => [ ...prevStack, data.card ])
    } else if (data.type === "setPlayerList") {
      setPlayerList(data.playerList)
    } else if (data.type === "matchEnded") {
      setPlayerList(data.winners)
      setMatchState(MatchState.ENDED)
      navigation.setOptions({ title: "Match ended", subtitle: `Winner: ${data.winners[0].username}` })
    }
  }
  
  const [ ws, setWs ] = React.useState(new WebSocket(`ws://${route.params.addr}:777`)) //(() => {

  useEffect(() => {
    navigation.setOptions({ headerRight: () => {
      return <>
      <Appbar.Action color="black" disabled={!stack.length && matchState !== MatchState.NOT_STARTED} key="showStack" icon="format-list-numbered" onPress={() => {
        navigation.push("Stack", { stack })
      }} />
      <Appbar.Action color="black" key="refresh" icon="refresh" onPress={() => {
        setTable([])
        setHand([])
        ws.send(JSON.stringify({ type: "getCurrentState" }))
        if (Platform.OS != 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      }} />
      </>
    }})
  }, [stack])


  useEffect(() => {
    ws.onopen = ev => {
      navigation.setOptions({ title: "Playing" })
      ws.send(JSON.stringify({
        type: 'connect',
        username: route.params.username
      }))
      if (Platform.OS != 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

      AsyncStorage.setItem("default_username", route.params.username)
      AsyncStorage.setItem("default_addr", route.params.addr)
    }

    ws.onclose = ev => {
      if (ev.reason === "match_in_progress") {
        Alert.alert("Match is already in progress", "Please wait for the match to end.")
      }
      setSnackbarText("ERROR! Please rejoin :(")
      if (Platform.OS != 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    }

    ws.onmessage = ev => {
      console.log(`Received msg: ${ev.data}`)
      handleMessageData(JSON.parse(ev.data))
    }

    navigation.setOptions({ headerRight: () => <>
      <Appbar.Action color="black" disabled={!stack.length || matchState === MatchState.NOT_STARTED} key="showStack" icon="format-list-numbered" onPress={() => {
        navigation.push("Stack", { stack })
        if (Platform.OS != 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }} />
      <Appbar.Action color="black" key="refresh" icon="refresh" onPress={() => {
        setTable([])
        setHand([])
        ws.send(JSON.stringify({ type: "getCurrentState" }))
        if (Platform.OS != 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      }} />
    </>})

    return () => {
      ws.onopen = undefined
      ws.onclose = undefined
      ws.onmessage = undefined
      ws.close()
    }
  }, [])


  return <Surface style={{ width: "100%", height: "100%" }}>

    { matchState !== MatchState.PLAYING && <View style={{ flex: 1, alignItems: "center", justifyContent: "center"}}>
        <PlayerBoard players={playerList} />
      </View> }

    { (trumpCard && matchState === MatchState.PLAYING) && <View style={{ position: "absolute", top: 0, right: 0, height: 205, width: 115, margin: 15 }}>
      <Title style={{textAlign: "right"}}>Briscola</Title>
      <Card elevation={3} style={{ position: "absolute", top: 0, right: 0, height: 205, width: 115, backgroundColor: "white", marginTop: 35}}>
        <Text style={{ textAlign: "center", margin: 10, position: "absolute", top: 0, right: 0, left: 0, bottom: 0, color: "black", textTransform: "uppercase", fontSize: 72 }}>{GameCard.getSignEmoji(trumpCard.sign)}</Text>
        { GameCard.getPoints(trumpCard.type)>0 && <Text style={{ textAlign: "center", color: "#aaa", fontWeight: "700", fontSize: 18, position: "absolute", right: 0, left: 0, bottom: 10 }}>{GameCard.getPoints(trumpCard.type)}</Text>}
        <Text style={{ textAlign: "center", position: "absolute", bottom: 30, right: 0, left: 0, textTransform: "uppercase", fontSize: 18, fontWeight: "700", color: GameCard.getPoints(trumpCard.type)>0 ? "orange" : "black" }}>{GameCard.getTypeName(trumpCard.type)}</Text>
      </Card>
    </View> }


    { matchState === MatchState.PLAYING && <>
      <View style={{ position: "absolute", top: 0, left: 0, margin: 15, width: "66%" }}>
        <Title>Table</Title>
        <FlatList 
          data={table.filter((a,b,i) => i.indexOf(a) === b)}
          numColumns={2}
          keyExtractor={(i, idx) => idx.toString()}
          style={{ marginTop: 5 }}
          alwaysBounceVertical={false}
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          renderItem={({ item }) => <Card elevation={4} style={{ height: 205, width: 115, backgroundColor: "white", marginRight: 10, marginBottom: 10 }}>
            <Text style={{ textAlign: "center", margin: 10, position: "absolute", top: 0, right: 0, left: 0, bottom: 0, color: "black", textTransform: "uppercase", fontSize: 72 }}>{GameCard.getSignEmoji(item.sign)}</Text>
            { GameCard.getPoints(item.type)>0 && <Text style={{ textAlign: "center", color: "#aaa", fontWeight: "700", fontSize: 18, position: "absolute", right: 0, left: 0, bottom: 10 }}>{GameCard.getPoints(item.type)}</Text>}
            <Text style={{ textAlign: "center", position: "absolute", bottom: 30, right: 0, left: 0, textTransform: "uppercase", fontSize: 18, fontWeight: "700", color: GameCard.getPoints(item.type)>0 ? "orange" : "black" }}>{GameCard.getTypeName(item.type)}</Text>
          </Card>}
        />
      </View>
      <View style={{ position: "absolute", top: 275, right: 0, margin: 15, width: 115 }}>
        <Text style={{ textAlign: "center", width: "100%", fontSize: 24, fontWeight: "800" }}>SCORE</Text>
        <Text style={{ textAlign: "center", width: "100%", fontSize: 24, fontWeight: "800" }}>{stack.reduce((total, card) => total + GameCard.getPoints(card.type),0)}</Text>
      </View>
    </> }


    <View style={{ position: "absolute", display: "flex", flexDirection: "column", bottom: 10, left: 0, right: 0, paddingVertical: 20 }}>
      <FlatList
          data={hand}
          horizontal
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          keyExtractor={(i, idx) => idx.toString()}
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          initialNumToRender={6}
          renderItem={({ item }) => <Card elevation={4} style={{ width: 115, height: 205, marginHorizontal: 10, flex: 1, backgroundColor: "white" }}>
            <TouchableOpacity disabled={!cardsAreEnabled} style={{ width: "100%", height: "100%" }} onPress={ev => {
              ws.send(JSON.stringify({
                type: "playCard",
                card: item
              }))
            }}>
              <Text style={{ textAlign: "center", margin: 10, position: "absolute", top: 0, right: 0, left: 0, bottom: 0, color: "black", textTransform: "uppercase", fontSize: 72 }}>{GameCard.getSignEmoji(item.sign)}</Text>
              { GameCard.getPoints(item.type)>0 && <Text style={{ textAlign: "center", color: "#aaa", fontWeight: "700", fontSize: 18, position: "absolute", right: 0, left: 0, bottom: 10 }}>{GameCard.getPoints(item.type)}</Text>}
              <Text style={{ textAlign: "center", position: "absolute", bottom: 30, right: 0, left: 0, textTransform: "uppercase", fontSize: 18, fontWeight: "700", color: GameCard.getPoints(item.type)>0 ? "orange" : "black" }}>{GameCard.getTypeName(item.type)}</Text>
            </TouchableOpacity>
          </Card>}
        />
    </View>

    <Snackbar duration={1500} visible={snackbarText != null} onDismiss={() => setSnackbarText(null)}>{snackbarText}</Snackbar>
    <FAB visible={matchState === MatchState.NOT_STARTED} icon="play" onPress={() => {
      ws.send(JSON.stringify({ type: "start" }))
    }} style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }} />
  </Surface>
}
