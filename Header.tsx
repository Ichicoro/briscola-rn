import { Appbar } from 'react-native-paper';
import React from 'react'

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
      { previous && <Appbar.BackAction
        onPress={() => navigation.pop()}
      /> }
      { options.headerLeft && options.headerLeft() }
      <Appbar.Content
        title={title}
        subtitle={subtitle}
      />
      { options.headerRight && options.headerRight() }
      {/*<Appbar.Action icon="magnify" onPress={_handleSearch} />
      <Appbar.Action icon="settings" onPress={() => navigation.push("Settings")} />*/}
    </Appbar.Header>
  );
};
