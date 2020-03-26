import React from 'react'
import { Surface, DataTable } from "react-native-paper";
import { Card } from './card';
import { ScrollView } from 'react-native';

export function StackScreen({ navigation, route }) {
  navigation.setOptions({ subtitle: `Total: ${route.params.stack.reduce((total, card) => total + Card.getPoints(card.type),0)}` })
  return <Surface style={{ width: "100%", height: "100%"}}>
    <ScrollView contentInsetAdjustmentBehavior="always"><DataTable>
      <DataTable.Header>
        <DataTable.Title>Card</DataTable.Title>
        <DataTable.Title numeric>Value</DataTable.Title>
      </DataTable.Header>

      { route.params.stack.map((card, i) => <DataTable.Row key={i}>
        <DataTable.Cell>{Card.getCardName(card)}</DataTable.Cell>
        <DataTable.Cell numeric>{Card.getPoints(card.type)}</DataTable.Cell>
      </DataTable.Row>)}
    </DataTable></ScrollView>
  </Surface>
}
