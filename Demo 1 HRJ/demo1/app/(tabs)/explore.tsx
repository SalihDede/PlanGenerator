import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter for routing

const ExploreScreen = () => {
  const [options, setOptions] = useState([
    { id: 1, name: 'Kafe', active: false },
    { id: 2, name: 'Yemek', active: false },
    { id: 3, name: 'Müze', active: false },
    { id: 4, name: 'Bar', active: false },
    { id: 5, name: 'Otel', active: false },
    { id: 6, name: 'Üniversite', active: false },
    { id: 7, name: 'Park', active: false },
    { id: 8, name: 'Sinema', active: false },
    { id: 9, name: 'Spor Salonu', active: false },
    { id: 10, name: 'Kütüphane', active: false },
  ]);

  const router = useRouter(); // useRouter for navigation

  const toggleOption = (id: number) => {
    setOptions(options.map(option =>
      option.id === id ? { ...option, active: !option.active } : option
    ));
  };

  const handleGenerateMap = () => {
    router.push('/map'); // Navigate to the map screen when "GENERATE MAP" is clicked
  };

  return (
    <View style={styles.container}>
      {options.map(option => (
        <View key={option.id} style={styles.optionContainer}>
          <Text style={styles.optionText}>{option.name}</Text>
          <TouchableOpacity
            style={[styles.button, option.active ? styles.activeButton : styles.inactiveButton]}
            onPress={() => toggleOption(option.id)}
          >
            <Text style={styles.buttonText}>
              {option.active ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
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
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionText: {
    fontSize: 18,
    color: '#fff',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: 'green',
  },
  inactiveButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 30,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ExploreScreen;
