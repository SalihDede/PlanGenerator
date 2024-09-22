import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AutoCompleteInput from './AutoCompleteInput'; // Make sure the path is correct
import { useRouter } from 'expo-router'; // useRouter importu

const HitTheRoadScreen = () => {
  const [startLocation, setStartLocation] = useState<any | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<any | null>(null);
  const router = useRouter(); // useRouter kancasını al

  const handleStartLocationSelect = (location: any) => {
    console.log('Seçilen Başlangıç Konumu:', location);
    setStartLocation(location);
  };

  const handleDestinationLocationSelect = (location: any) => {
    console.log('Seçilen Varış Konumu:', location);
    setDestinationLocation(location);
  };

  const handleFilterPlan = () => {
    console.log('Başlangıç Latitude:', startLocation?.geometry?.location?.lat); // Kontrol et
    console.log('Başlangıç Longitude:', startLocation?.geometry?.location?.lng); // Kontrol et
    console.log('Varış Latitude:', destinationLocation?.geometry?.location?.lat); // Kontrol et
    console.log('Varış Longitude:', destinationLocation?.geometry?.location?.lng); // Kontrol et

    router.push('/map');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hit The Road</Text>
      <AutoCompleteInput
        apiKey="AIzaSyAd6QPsDb0lvL7G37GP9Yp-4kDNgiUS7-M" // Replace with your API key
        onSelectLocation={handleStartLocationSelect}
        placeholder="Başlangıç"
      />
      <AutoCompleteInput
        apiKey="AIzaSyAd6QPsDb0lvL7G37GP9Yp-4kDNgiUS7-M" // Replace with your API key
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
