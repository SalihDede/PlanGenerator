import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const API_KEY = ''; // Replace with your actual API key

const FindBusiness = ({ circles, onBusinessesFound }: { circles: Array<{ latitude: number, longitude: number, radius: number }>, onBusinessesFound: (businesses: any[]) => void }) => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // State to store selected options

  useEffect(() => {
    // Fetch selected options from AsyncStorage
    const fetchSelectedOptions = async () => {
      const optionsString = await AsyncStorage.getItem('selectedOptions');
      if (optionsString) {
        const options = JSON.parse(optionsString);
        setSelectedOptions(options);
      }
    };

    fetchSelectedOptions();
  }, []);

  useEffect(() => {
    if (circles.length > 0 && selectedOptions.length > 0) { // Wait for options to load
      setLoading(true);
      fetchBusinesses();
    }
  }, [circles, selectedOptions]);

  // Map selected options to Google Places types
const optionToTypeMap: { [key: string]: string[] } = {
  'Café': ['cafe'],
  'Food': ['restaurant', 'bakery', 'meal_takeaway'],
  'Bar': ['bar', 'night_club'],
  'Hotel': ['hotel', 'lodging'],
  'Museum': ['museum'],
  'Park': ['park'],
  'University': ['university'],
  'Library': ['library'],
  'Gym': ['gym', 'fitness_center'],
  'Cinema': ['movie_theater'],
  'Shopping Mall': ['shopping_mall'],
  'Pharmacy': ['pharmacy'],
  'Gas Station': ['gas_station'],
  'Supermarket': ['grocery_or_supermarket'],
  'Hospital': ['hospital'],
  'Bank': ['bank', 'atm'],
  'Church': ['church', 'place_of_worship'],
  'Police': ['police'],
  'Post Office': ['post_office'],
  'Zoo': ['zoo'],
};

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

      // Filter businesses by selected options and their respective types
      let filteredBusinesses: any[] = [];

      selectedOptions.forEach(option => {
        const typesForOption = optionToTypeMap[option] || [];
        
        // Filter businesses that match any of the types for this option
        const optionBusinesses = uniqueBusinesses.filter((business: any) => 
          business.types.some((type: string) => typesForOption.includes(type.toLowerCase()))
        );

        // Select 3 random businesses for this option
        const shuffledBusinesses = optionBusinesses.sort(() => 0.5 - Math.random());
        const selectedForOption = shuffledBusinesses.slice(0, 3); // Get 3 businesses for this option

        // Add the selected businesses for this option to the final list
        filteredBusinesses = [...filteredBusinesses, ...selectedForOption];
      });

      setBusinesses(filteredBusinesses);
      onBusinessesFound(filteredBusinesses); // Pass the found businesses to the parent
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="black" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default FindBusiness;
