import { useState } from 'react';


export const useMapSelect = (initialRegion = null) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [region, setRegion] = useState(initialRegion || {
    latitude: 10.7769,
    longitude: 106.7009,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const selectLocation = (location) => {
    setSelectedLocation(location);
    setRegion({ ...region, ...location });
  };

  const updateRegion = (newRegion) => {
    setRegion(newRegion);
  };

  const reset = () => {
    setSelectedLocation(null);
    setSearchText('');
  };

  return {
    selectedLocation,
    setSelectedLocation: selectLocation,
    searchText,
    setSearchText,
    region,
    setRegion: updateRegion,
    reset,
  };
};