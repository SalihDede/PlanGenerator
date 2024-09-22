import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';

const MapScreen = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825, // Varsayılan değer
          longitude: -122.4324, // Varsayılan değer
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2, // Yüksekliği ihtiyaca göre ayarlayın
  },
});

export default MapScreen;
