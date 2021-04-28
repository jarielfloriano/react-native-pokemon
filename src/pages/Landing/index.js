import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

export default function Landing() {
  const navigation = useNavigation();

  function handleNavigateToPokemonAPI() {
    navigation.navigate('Query');
  }

  return (
    <View style={styles.background}>
      <View style={styles.containerLogo}>
        <Image source={require('../../images/logo.png')} />
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.submitButton} onPress={handleNavigateToPokemonAPI}>
          <Text style={styles.submitButtonText}>Consultar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}