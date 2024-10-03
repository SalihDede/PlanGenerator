import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

// Google Places API Key
const API_KEY = 'AIzaSyAd6QPsDb0lvL7G37GP9Yp-4kDNgiUS7-M'; // Replace with your actual API key

const FindBusiness = ({ circles, onBusinessesFound }: { circles: Array<{ latitude: number, longitude: number, radius: number }>, onBusinessesFound: (businesses: any[]) => void }) => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (circles.length > 0) {
      setLoading(true);
      fetchBusinesses();
    }
  }, [circles]);

  const fetchBusinesses = async () => {
    let allBusinesses: any[] = [];

    try {
      for (const circle of circles) {
        const { latitude, longitude, radius } = circle;
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=establishment&key=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          allBusinesses = [...allBusinesses, ...data.results];
        }
      }

      // Remove duplicates based on business ID
      const uniqueBusinesses = allBusinesses.reduce((acc, business) => {
        if (!acc.some((b: any) => b.place_id === business.place_id)) {
          acc.push(business);
        }
        return acc;
      }, []);

      // Select 5 random businesses
      const shuffledBusinesses = uniqueBusinesses.sort(() => 0.5 - Math.random());
      const randomBusinesses = shuffledBusinesses.slice(0, 5); // Get 5 random businesses

      setBusinesses(randomBusinesses);
      onBusinessesFound(randomBusinesses); // Pass the found businesses to the parent
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Random 5 Businesses Inside Circles</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={businesses}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <View style={styles.businessContainer}>
              <Text style={styles.businessName}>{item.name}</Text>
              <Text style={styles.businessStars}>{`Rating: ${item.rating}`}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  businessContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  businessName: {
    fontSize: 16,
  },
  businessStars: {
    fontSize: 14,
    color: 'gray',
  },
});

export default FindBusiness;
