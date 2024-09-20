import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Dimensions } from 'react-native';

const MapPage: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [startLocation, setStartLocation] = useState<string>('');
  const [endLocation, setEndLocation] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [destination, setDestination] = useState({
    latitude: 37.78925,
    longitude: -122.4354,
  });

  // Add more options to the array
  const options = [
    'Kafe', 
    'Sinema', 
    'Bar', 
    'Plaj', 
    'Benzinlik', 
    'Restoran', 
    'Park', 
    'Müze', 
    'Otel', 
    'Hastane'
  ];

  const handleOptionPress = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Üst Kısım */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Başlangıç Noktası:</Text>
        <TextInput
          style={styles.input}
          placeholder="Başlangıç noktanızı giriniz"
          placeholderTextColor="#888"
          value={startLocation}
          onChangeText={setStartLocation}
        />
        <Text style={styles.label}>Varış Noktası:</Text>
        <TextInput
          style={styles.input}
          placeholder="Varış noktanızı giriniz"
          placeholderTextColor="#888"
          value={endLocation}
          onChangeText={setEndLocation}
        />
      </View>

      {/* Orta Kısım */}
      <View style={styles.optionsContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedOptions.includes(option) ? styles.selected : styles.notSelected,
            ]}
            onPress={() => handleOptionPress(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Alt Kısım (Harita) */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Anlık Konum (Kırmızı Nokta) */}
        <Marker coordinate={currentLocation} pinColor="red" />
        {/* Varış Noktası (Mavi Nokta) */}
        <Marker coordinate={destination} pinColor="blue" />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',  // Allow multiple rows of buttons
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  optionButton: {
    padding: 10,
    borderRadius: 5,
    width: Dimensions.get('window').width / 3 - 20,  // Make buttons longer
    marginBottom: 10,  // Add space between buttons
    alignItems: 'center',
  },
  notSelected: {
    backgroundColor: 'red',
  },
  selected: {
    backgroundColor: 'green',
  },
  optionText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  map: {
    flex: 1,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default MapPage;
