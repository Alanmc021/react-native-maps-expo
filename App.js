import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Text, View } from 'react-native';
import * as Location from 'expo-location'; // Importe do expo-location
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { css } from './assets/css/Css';

export default function App() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const mapEl = useRef()

  useEffect(() => {
    (async function () {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setOrigin({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.000922,
          longitudeDelta: 0.000421
        });
      } else {
        throw new Error('Permissão de localização não concedida');
      }
    })();
  }, []);

  return (
    <View style={css.container}>
      <View style={css.map}>
        <MapView
          ref={mapEl}
          style={css.map}
          initialRegion={origin}
          showsUserLocation={true}
          zoomEnabled={false}
          loadingEnabled={true}
        >
          {destination && (
            <Marker
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude
              }}
              title="Destino"
            />
          )}
          {origin && destination && (
            // <MapViewDirections
            //   origin={origin}
            //   destination={destination}
            //   apikey={"AIzaSyDWO8PIiszn2rIw88iIGZIBdlAVCsH3zPY"}
            //   strokeWidth={3}
            // />
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={"your-key"}
              strokeWidth={3}
              onReady={result => {
                console.log(result.distance)
                console.log(result.start_address)
                console.log(result.end_address)
                setDuration(result.duration)
                setDistance(result.distance);
                mapEl.current.fitToCoordinates(
                  result.coordinates, {
                  edgePadding: {
                    top: 50,
                    bottom: 50,
                    left: 50,
                    right: 50
                  }
                }
                );
              }
              }
            />
          )}
        </MapView>
      </View>
      <View style={css.search}>
        <GooglePlacesAutocomplete
          placeholder='Para onde vamos?'
          onPress={(data, details = null) => {
            setDestination({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.000922,
              longitudeDelta: 0.000421
            });
          }}
          query={{
            key: "your-key",
            language: 'pt-br',
          }}
          enablePoweredByContainer={false}
          fetchDetails={true}
          styles={{ listView: { height: 100 } }}
        />
        {distance ?
          <View style={{ bottom: '30%' }}>
            <Text> Distance:{distance} m</Text>
            <Text> Duration:{duration} s</Text>
          </View>
          :
          null
        }
      </View>
    </View>
  );
}
