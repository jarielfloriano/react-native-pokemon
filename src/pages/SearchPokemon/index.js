import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { ListItem, Avatar } from 'react-native-elements'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { BorderlessButton, ScrollView } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import api from '../../services/api';
import styles from './styles';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("db.db");
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    accent: 'yellow',
  },
};

export default function SearchPokemonID() {
  
  const navigation = useNavigation();

  function handleNavigateToMain() {
    navigation.navigate('Main');
  }

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [PokemonID, setPokemonID] = useState(null);
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    db.transaction(
      tx => {
        tx.executeSql("create table if not exists pokemon (id integer primary key AUTOINCREMENT, name text, image text);");
      },
    );
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setPokemonID(data);
    alert(`O QRCode foi escaneado com sucesso.`);
  };

  async function executeQuery() {
    try {
      const response = await api.get(`/pokemon/${PokemonID}`);
      await saveRepository(response.data);
      console.log('sucesso: ', response.data);
    } catch (err) {
      console.log('erro: ', err);
    }
  }

  async function saveRepository(repository) {
    const data = {
      name: repository.name,
      image: 'https://pokeres.bastionbot.org/images/pokemon/'+repository.id+'.png',
    };
    db.transaction(
      tx => {
        tx.executeSql("insert or replace into pokemon (id, name, image) values ((select id from pokemon where name = ?), ?, ?)", [data.name, data.name, data.image]);
        tx.executeSql("select * from pokemon order by id desc", [], (_, { rows: { _array } }) =>
          setList(_array),
        );
      },
    );
  }

  if (hasPermission === null) {
    return <Text>Solicitando acesso a camera</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sem acesso a camera</Text>;
  }

  return (
  <ScrollView style={styles.background}>
    <PaperProvider theme={theme}>
      <View style={styles.topBar}>
        <BorderlessButton onPress={handleNavigateToMain}>
          <Feather name="arrow-left" size={25} color="#fafafa" />
        </BorderlessButton>
        <Text style={styles.topBarText}>QR code</Text>
      </View>

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.barCode}
      />

      <View style={styles.container}>
        {scanned && <Text style={styles.text}>Último request: {PokemonID}</Text>}
        <TouchableOpacity style={styles.submitButton} onPress={executeQuery} onPressOut={() => setScanned(false)}>
          <Text style={styles.submitButtonText}>Liberar a camera</Text>
        </TouchableOpacity>
      </View>

      {
        list.map((pokemon, i) => (
          <ListItem key={i} bottomDivider>
            <Avatar source={{uri: pokemon.image}} />
            <ListItem.Content>
              <ListItem.Title>{pokemon.name}</ListItem.Title>
              <ListItem.Subtitle>{pokemon.image}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))
      }
    </PaperProvider>
  </ScrollView>
  );
}