import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Button, Alert, Text, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import FindBusiness from './findBusiness';
import DefineArea, { CircleData } from './defineArea';

const MapScreen = () => {
  const { startLat, startLng, destinationLat, destinationLng } = useLocalSearchParams();

  const startLatitude = Array.isArray(startLat) ? startLat[0] : startLat || '';
  const startLongitude = Array.isArray(startLng) ? startLng[0] : startLng || '';
  const destinationLatitude = Array.isArray(destinationLat) ? destinationLat[0] : destinationLat || '';
  const destinationLongitude = Array.isArray(destinationLng) ? destinationLng[0] : destinationLng || '';

  const [transportMode, setTransportMode] = useState('driving');
  const [directions, setDirections] = useState<any[]>([]);
  const [expectedDistance, setExpectedDistance] = useState<number>(0);
  const [circleData, setCircleData] = useState<CircleData[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [markedBusinesses, setMarkedBusinesses] = useState<any[]>([]);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (mapRef.current && startLatitude && startLongitude && destinationLatitude && destinationLongitude) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: parseFloat(startLatitude), longitude: parseFloat(startLongitude) },
          { latitude: parseFloat(destinationLatitude), longitude: parseFloat(destinationLongitude) },
        ],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }
  }, [startLatitude, startLongitude, destinationLatitude, destinationLongitude]);

  const getDirections = async () => {
    if (!startLatitude || !startLongitude || !destinationLatitude || !destinationLongitude) {
      Alert.alert('Locations are missing!');
      return;
    }

    // Önceki verileri temizle
    setDirections([]);
    setBusinesses([]);
    setMarkedBusinesses([]);

    const apiKey = 'AIzaSyAd6QPsDb0lvL7G37GP9Yp-4kDNgiUS7-M'; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLatitude},${startLongitude}&destination=${destinationLatitude},${destinationLongitude}&mode=${transportMode}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes.length) {
        const route = data.routes[0];
        const points = route.overview_polyline.points;
        const coordinates = decodePolyline(points);

        setDirections([...coordinates]);
        calculateTotalDistance(coordinates);
      } else {
        Alert.alert('Route not found.');
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  const decodePolyline = (t: string) => {
    let points = [];
    let index = 0,
      len = t.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b, shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1 ? ~(result >> 1) : result >> 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1 ? ~(result >> 1) : result >> 1);
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  const calculateTotalDistance = (coordinates: { latitude: number; longitude: number }[]) => {
    let totalDistance = 0;

    for (let i = 0; i < coordinates.length - 1; i++) {
      totalDistance += calculateDistance(coordinates[i], coordinates[i + 1]);
    }

    setExpectedDistance(totalDistance);
    console.log(`Total route distance: ${totalDistance} meters`);
  };

  const handleCirclesUpdate = (circleData: CircleData[]) => {
    setCircleData(circleData);
    console.log('Updated Circle Data:', circleData);
  };

  const calculateDistance = (point1: { latitude: number; longitude: number }, point2: { latitude: number; longitude: number }) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (point2.latitude - point1.latitude) * (Math.PI / 180);
    const dLng = (point2.longitude - point1.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.latitude * (Math.PI / 180)) * Math.cos(point2.latitude * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const handleBusinessesFound = (foundBusinesses: any[]) => {
    setBusinesses(foundBusinesses);
  };

  const handleMarkBusiness = (business: any) => {
    // İşaretlenen işletmeyi listeden kaldırma
    const updatedBusinesses = businesses.filter((item) => item.place_id !== business.place_id);
    setBusinesses(updatedBusinesses);
    setMarkedBusinesses([...markedBusinesses, business]);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: parseFloat(startLatitude) || 37.78825,
          longitude: parseFloat(startLongitude) || -122.4324,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {startLatitude && startLongitude && (
          <Marker
            coordinate={{ latitude: parseFloat(startLatitude), longitude: parseFloat(startLongitude) }}
            pinColor="red"
            title="Start"
          />
        )}
        {destinationLatitude && destinationLongitude && (
          <Marker
            coordinate={{ latitude: parseFloat(destinationLatitude), longitude: parseFloat(destinationLongitude) }}
            pinColor="green"
            title="Destination"
          />
        )}
        {directions.length > 0 && <Polyline coordinates={directions} strokeWidth={6} strokeColor="#000" />}
        <DefineArea
          coordinates={directions}
          startLatitude={parseFloat(startLatitude)}
          startLongitude={parseFloat(startLongitude)}
          destinationLatitude={parseFloat(destinationLatitude)}
          destinationLongitude={parseFloat(destinationLongitude)}
          onCirclesUpdate={handleCirclesUpdate}
        />
        {markedBusinesses.map((business, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: business.geometry.location.lat, longitude: business.geometry.location.lng }}
            pinColor="black"
            title={business.name}
          />
        ))}
      </MapView>
      {/* İşletmeleri haritanın altına taşıdık */}
      {businesses.length > 0 && (
        <FlatList
          data={businesses}
          keyExtractor={(item) => item.place_id}
          horizontal={true} // Yatay liste
          renderItem={({ item }) => (
            <View style={styles.businessContainer}>
              <Text style={styles.businessName}>{item.name}</Text>
              <Text style={styles.businessRating}>{`Rating: ${item.rating}`}</Text>
              <TouchableOpacity onPress={() => handleMarkBusiness(item)}>
                <Text style={styles.markBusinessButton}>Mark Business</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <View style={styles.bottomContainer}>
        <View style={styles.transportModeContainer}>
          <Picker
            selectedValue={transportMode}
            onValueChange={(itemValue) => setTransportMode(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Driving" value="driving" />
            <Picker.Item label="Walking" value="walking" />
            <Picker.Item label="Bicycling" value="bicycling" />
            <Picker.Item label="Transit" value="transit" />
          </Picker>
        </View>
        <Button title="Get Directions" onPress={getDirections} />
        <FindBusiness circles={circleData} onBusinessesFound={handleBusinessesFound} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: '50%', // Haritanın yüksekliği %50 olarak ayarlandı
  },
  bottomContainer: {
    flex: 1,
    padding: 10,
  },
  transportModeContainer: {
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: 150,
  },
  businessContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: 200,
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  businessRating: {
    fontSize: 14,
  },
  markBusinessButton: {
    marginTop: 5,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default MapScreen;
