import React from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // useRouter importu

const HitTheRoadScreen = () => {
  const [start, setStart] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const router = useRouter(); // useRouter kancasını al

  const handleFilterPlan = () => {
    router.push('/explore'); // Explore ekranına yönlendir
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hit The Road</Text>
      <TextInput
        style={styles.input}
        placeholder="Başlangıç"
        value={start}
        onChangeText={setStart}
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Varış"
        value={destination}
        onChangeText={setDestination}
        placeholderTextColor="#ccc"
      />
      <Button title="FILTER PLAN" onPress={handleFilterPlan} color="#007bff" />
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
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default HitTheRoadScreen;
