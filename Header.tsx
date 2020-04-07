import React from 'react'
import { View, Platform } from 'react-native'
import { Appbar } from 'react-native-paper';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export const Header = ({ scene, previous, navigation }) => {
  const { options } = scene?.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
        ? options.title
        : scene?.route.name;
  const subtitle =
    options.headerSubtitle !== undefined
      ? options.headerSubtitle
      : options.subtitle !== undefined
        ? options.subtitle
        : undefined

  return (
    <Appbar.Header>
      { Platform.OS == "ios" && <View style={{ backgroundColor: "#00000018", position: "absolute", height: getStatusBarHeight(true), top: 0-getStatusBarHeight(true), left: 0, right: 0 }}></View>}
      { previous && <Appbar.BackAction
        onPress={() => navigation.pop()}
      /> }
      { options.headerLeft && options.headerLeft() }
      <Appbar.Content
        title={title}
        subtitle={subtitle}
      />
      { options.headerRight && options.headerRight() }
    </Appbar.Header>
  );
};
