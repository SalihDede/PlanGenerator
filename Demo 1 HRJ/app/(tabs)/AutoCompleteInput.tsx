import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

type AutoCompleteInputProps = {
  apiKey: string;
  onSelectLocation: (location: { description: string; place_id: string; structured_formatting: any; geometry: any }) => void;
  placeholder: string;
};

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({ apiKey, onSelectLocation, placeholder }) => {
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}
      {response && <Text style={styles.response}>{response}</Text>}
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        query={{
          key: apiKey,
          language: 'tr',
        }}
        onPress={(data, details = null) => {
          if (details) {
            const selectedLocation = { 
              description: data.description, 
              place_id: data.place_id, 
              structured_formatting: data.structured_formatting,
              geometry: details.geometry 
            };

            console.log('Selected Location Data:', selectedLocation);
            console.log('Data Type:', typeof selectedLocation);

            onSelectLocation(selectedLocation);
            clearError();
            setResponse(`Selected Location: ${data.description}`);
          } else {
            console.error('No details available.');
            setError('Could not retrieve location details.');
          }
        }}
        onFail={(error) => {
          console.error('API request failed:', error);
          setError('API request failed. Please check your key and connection.');
          setResponse(null);
        }}
        onTimeout={() => {
          console.warn('API request timed out.');
          setError('API request timed out. Please try again.');
          setResponse(null);
        }}
        fetchDetails={true}
        debounce={200}
        nearbyPlacesAPI="GooglePlacesSearch"
        enablePoweredByContainer={false}
        listViewDisplayed="auto"
        styles={{
          container: {
            position: 'absolute',
            zIndex: 1,
            width: '100%',
          },
          textInput: styles.input,
          row: {
            padding: 10,
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  response: {
    color: 'green',
    marginBottom: 10,
  },
  row: {
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  secondary: {
    color: 'gray',
  },
});

export default AutoCompleteInput;
