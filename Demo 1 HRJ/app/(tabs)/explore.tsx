import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExploreScreen = () => {
  const [options, setOptions] = useState([
    { id: 1, name: 'Café', active: false },
    { id: 2, name: 'Food', active: false },
    { id: 3, name: 'Museum', active: false },
    { id: 4, name: 'Bar', active: false },
    { id: 5, name: 'Hotel', active: false },
    { id: 6, name: 'University', active: false },
    { id: 7, name: 'Park', active: false },
    { id: 8, name: 'Cinema', active: false },
    { id: 9, name: 'Gym', active: false },
    { id: 10, name: 'Library', active: false },
    { id: 11, name: 'Shopping Mall', active: false },
    { id: 12, name: 'Pharmacy', active: false },
    { id: 13, name: 'Gas Station', active: false },
    { id: 14, name: 'Supermarket', active: false },
    { id: 15, name: 'Hospital', active: false },
    { id: 16, name: 'Bank', active: false },
    { id: 17, name: 'Church', active: false },
    { id: 18, name: 'Police', active: false },
    { id: 19, name: 'Post Office', active: false },
    { id: 20, name: 'Zoo', active: false },
  ]);

  const router = useRouter();

  const toggleOption = (id: number) => {
    setOptions(options.map(option =>
      option.id === id ? { ...option, active: !option.active } : option
    ));
  };

  const handleGenerateMap = async () => {
    const selectedOptions = options.filter(option => option.active).map(option => option.name);
    await AsyncStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));

    const startLatString = await AsyncStorage.getItem('startLat');
    const startLngString = await AsyncStorage.getItem('startLng');
    const destinationLatString = await AsyncStorage.getItem('destinationLat');
    const destinationLngString = await AsyncStorage.getItem('destinationLng');

    const startLat = startLatString ? JSON.parse(startLatString) : null;
    const startLng = startLngString ? JSON.parse(startLngString) : null;
    const destinationLat = destinationLatString ? JSON.parse(destinationLatString) : null;
    const destinationLng = destinationLngString ? JSON.parse(destinationLngString) : null;

    if (startLat === null || startLng === null || destinationLat === null || destinationLng === null) {
      console.error('One or more coordinates are missing!');
      return;
    }

    console.log('Selected Options:', selectedOptions);

    router.push({
      pathname: '/map',
      params: {
        startLat,
        startLng,
        destinationLat,
        destinationLng,
        selectedOptions,
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {options.map(option => {
          const scaleAnim = useRef(new Animated.Value(1)).current;

          const handlePressIn = () => {
            Animated.spring(scaleAnim, {
              toValue: 1.1,
              useNativeDriver: true,
            }).start();
          };

          const handlePressOut = () => {
            Animated.spring(scaleAnim, {
              toValue: 1,
              useNativeDriver: true,
            }).start();
          };

          return (
            <View key={option.id} style={styles.optionContainer}>
              <Text style={styles.optionText}>{option.name}</Text>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  style={[styles.button, option.active ? styles.activeButton : styles.inactiveButton]}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={() => toggleOption(option.id)}
                >
                  <Text style={styles.buttonText}>
                    {option.active ? 'Activate' : 'Deactivate'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          );
        })}
      </ScrollView>
      <TouchableOpacity style={styles.generateButton} onPress={handleGenerateMap}>
        <Text style={styles.generateButtonText}>GENERATE MAP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  scrollViewContainer: {
    paddingBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionText: {
    fontSize: 18,
    color: '#FFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  activeButton: {
    backgroundColor: '#8A2BE2',
  },
  inactiveButton: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExploreScreen;
