import React, { useState, useEffect } from 'react';
import { Circle } from 'react-native-maps';

export interface CircleData {
  latitude: number;
  longitude: number;
  radius: number;
}

interface DefineAreaProps {
  coordinates: { latitude: number; longitude: number }[];
  startLatitude: number;
  startLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  onCirclesUpdate?: (circleData: CircleData[]) => void; // Add this prop to pass data back to parent
}

const DefineArea: React.FC<DefineAreaProps> = ({
  coordinates,
  startLatitude,
  startLongitude,
  destinationLatitude,
  destinationLongitude,
  onCirclesUpdate,
}) => {
  const [circles, setCircles] = useState<CircleData[]>([]);

  useEffect(() => {
    if (coordinates.length > 0) {
      createCircles(coordinates);
    }
  }, [coordinates]);

  const calculateDistance = (point1: { latitude: number; longitude: number }, point2: { latitude: number; longitude: number }) => {
    const R = 6371000;
    const dLat = (point2.latitude - point1.latitude) * (Math.PI / 180);
    const dLng = (point2.longitude - point1.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.latitude * (Math.PI / 180)) * Math.cos(point2.latitude * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const createCircles = (coordinates: { latitude: number; longitude: number }[]) => {
    let circlePoints: CircleData[] = [];

    const distanceBetweenPoints = calculateDistance(
      { latitude: startLatitude, longitude: startLongitude },
      { latitude: destinationLatitude, longitude: destinationLongitude }
    );

    const radius = distanceBetweenPoints / 50;
    let distanceCovered = 0;
    let prevPoint = coordinates[0];

    coordinates.forEach((point, index) => {
      if (index === 0) return;

      const distance = calculateDistance(prevPoint, point);
      distanceCovered += distance;

      if (distanceCovered >= radius) {
        const circle = {
          latitude: point.latitude,
          longitude: point.longitude,
          radius: radius,
        };
        circlePoints.push(circle);
        distanceCovered = 0;
      }

      prevPoint = point;
    });

    setCircles([...circlePoints]);
    if (onCirclesUpdate) {
      onCirclesUpdate(circlePoints); // Pass the circle data back to the parent
    }
  };

  return (
    <>
      {circles.map((circle, index) => (
        <Circle
          key={index}
          center={{ latitude: circle.latitude, longitude: circle.longitude }}
          radius={circle.radius}
          fillColor="rgba(255, 0, 0, 0.3)"
          strokeWidth={1}
          strokeColor="rgba(255, 0, 0, 0.5)"
        />
      ))}
    </>
  );
};

export default DefineArea;
