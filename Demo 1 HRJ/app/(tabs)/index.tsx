import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AutoCompleteInput from './AutoCompleteInput';
import { useRouter } from 'expo-router';

const HitTheRoadScreen = () => {
  const [startLocation, setStartLocation] = useState<any | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<any | null>(null);
  const router = useRouter();

  const handleStartLocationSelect = (location: any) => {
    console.log('Seçilen Başlangıç Konumu:', location);
    setStartLocation(location);
  };

  const handleDestinationLocationSelect = (location: any) => {
    console.log('Seçilen Varış Konumu:', location);
    setDestinationLocation(location);
  };

  const handleFilterPlan = () => {
    const startLat = startLocation?.geometry?.location?.lat;
    const startLng = startLocation?.geometry?.location?.lng;
    const destinationLat = destinationLocation?.geometry?.location?.lat;
    const destinationLng = destinationLocation?.geometry?.location?.lng;

    if (startLat && startLng && destinationLat && destinationLng) {
      router.push({
        pathname: '/map',
        params: {
          startLat,
          startLng,
          destinationLat,
          destinationLng,
        },
      });
    } else {
      console.log('Başlangıç veya varış konumu eksik!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hit The Road</Text>
      <AutoCompleteInput
        apiKey="AIzaSyAd6QPsDb0lvL7G37GP9Yp-4kDNgiUS7-M"
        onSelectLocation={handleStartLocationSelect}
        placeholder="Başlangıç"
      />
      <AutoCompleteInput
        apiKey="AIzaSyAd6QPsDb0lvL7G37GP9Yp-4kDNgiUS7-M"
        onSelectLocation={handleDestinationLocationSelect}
        placeholder="Varış"
      />
      <View style={styles.buttonContainer}>
        <Button title="FILTER PLAN" onPress={handleFilterPlan} color="#007bff" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 5,
    marginTop: 20,
  },
});

export default HitTheRoadScreen;
