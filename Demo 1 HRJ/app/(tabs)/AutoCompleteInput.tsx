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
            onSelectLocation(selectedLocation);
            clearError();
            setResponse(`Selected Location: ${data.description}`);
          } else {
            console.error('No details available.');
            setError('Konum detayları alınamadı.');
          }
        }}
        onFail={(error) => {
          console.error('API request failed:', error);
          setError('API isteği başarısız oldu. Lütfen anahtarınızı ve bağlantınızı kontrol edin.');
          setResponse(null);
        }}
        onTimeout={() => {
          console.warn('API request timed out.');
          setError('API isteği zaman aşımına uğradı. Lütfen tekrar deneyin.');
          setResponse(null);
        }}
        fetchDetails={true}
        debounce={200}
        nearbyPlacesAPI="GooglePlacesSearch"
        enablePoweredByContainer={false}
        listViewDisplayed="auto"
        textInputProps={{
          placeholderTextColor: '#fff', // Placeholder rengini beyaz yapar
        }}
        styles={{
          container: {
            position: 'relative', // Öneri kutusunun sayfa içinde doğru yerleşmesi için
            zIndex: 10, // En önde görünmesi için yüksek bir zIndex değeri verdik
            width: '100%',
            maxHeight: 200, // Öneri kutusunun maksimum yüksekliği
          },
          textInput: styles.input, // Kullanıcı giriş kutusuna uygulanan stil
          row: {
            padding: 10,
            backgroundColor: '#1e1e1e',
            borderBottomColor: '#fff', // Beyaz çerçeve
            borderBottomWidth: 1,
          },
          description: {
            color: '#fff', // Öneri metinlerinin beyaz renk olması
          },
          listView: {
            position: 'absolute',
            top: 50, // Giriş kutusunun hemen altına yerleşmesi için
            zIndex: 20, // ListView'in öne çıkması için daha yüksek zIndex
            backgroundColor: '#1e1e1e',
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
    zIndex: 3, // Dropdown'ın üstte olmasını sağlar
  },
  input: {
    borderColor: '#fff', // Beyaz çerçeve
    borderWidth: 1,
    padding: 12, // Rahat bir aralık sağlar
    borderRadius: 8,
    color: '#fff', // Yazı rengi beyaz
    backgroundColor: '#1e1e1e',
    zIndex: 3, // Giriş kutusunun katman önceliği
  },
  error: {
    color: 'red', // Hata mesajı için kırmızı
    marginBottom: 10,
  },
  row: {
    padding: 10,
    borderBottomColor: '#fff', // Satırlar arasında beyaz çizgi
    borderBottomWidth: 1,
    backgroundColor: '#1e1e1e',
  },
  secondary: {
    color: 'gray',
  },
});

export default AutoCompleteInput;
