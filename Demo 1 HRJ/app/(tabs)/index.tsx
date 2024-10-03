import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AutoCompleteInput from './AutoCompleteInput';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Bungee_400Regular } from '@expo-google-fonts/bungee';

const HitTheRoadScreen = () => {
  const [startLocation, setStartLocation] = useState<any | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<any | null>(null);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Bungee_400Regular,
  });

  if (!fontsLoaded) {
    return null; // Optionally show a loading indicator here
  }

  const handleStartLocationSelect = (location: any) => {
    console.log('Selected Start Location:', location);
    setStartLocation(location);
  };

  const handleDestinationLocationSelect = (location: any) => {
    console.log('Selected Destination Location:', location);
    setDestinationLocation(location);
  };

  const handleFilterPlan = async () => {
    const startLat = startLocation?.geometry?.location?.lat;
    const startLng = startLocation?.geometry?.location?.lng;
    const destinationLat = destinationLocation?.geometry?.location?.lat;
    const destinationLng = destinationLocation?.geometry?.location?.lng;

    if (startLat && startLng && destinationLat && destinationLng) {
      await AsyncStorage.setItem('startLat', JSON.stringify(startLat));
      await AsyncStorage.setItem('startLng', JSON.stringify(startLng));
      await AsyncStorage.setItem('destinationLat', JSON.stringify(destinationLat));
      await AsyncStorage.setItem('destinationLng', JSON.stringify(destinationLng));

      router.push('/explore');
    } else {
      console.log('Start or destination location is missing!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Hit The Road</Text>
      <View style={styles.card}>
        <View style={styles.inputContainer}>
          <View style={styles.inputSpacing}>
            <AutoCompleteInput
              apiKey="AIzaSyAd6QPsDb0lvL7G37GP9Yp-4kDNgiUS7-M"
              onSelectLocation={handleStartLocationSelect}
              placeholder="Başlangıç Noktası"
            />
          </View>
          <View style={styles.inputSpacing}>
            <AutoCompleteInput
              apiKey="AIzaSyAd6QPsDb0lvL7G37GP9Yp-4kDNgiUS7-M"
              onSelectLocation={handleDestinationLocationSelect}
              placeholder="Varış Noktası"
            />
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleFilterPlan}>
          <Text style={styles.buttonText}>Harita Oluştur</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  logo: {
    fontSize: 40,
    marginBottom: 50,
    color: '#fff',
    fontFamily: 'Bungee_400Regular',
  },
  card: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    zIndex: 2,
  },
  inputSpacing: {
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#6200ea',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    zIndex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HitTheRoadScreen;
