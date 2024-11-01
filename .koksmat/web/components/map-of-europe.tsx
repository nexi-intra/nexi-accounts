"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { ComponentDoc } from './component-documentation-hub'

// Fix for default marker icon
const icon = L.icon({
  iconUrl: "/placeholder.svg?height=25&width=25",
  iconSize: [25, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

// GeoJSON data for countries
const countriesGeoJSON = {
  denmark: {
    "type": "Feature",
    "properties": { "name": "Denmark" },
    "geometry": {
      "type": "MultiPolygon",
      "coordinates": [
        [[[12.690006, 55.609991], [12.089991, 54.800015], [11.043543, 55.364864], [10.903914, 55.779955], [12.370904, 56.111407], [12.690006, 55.609991]]],
        [[[10.912052, 56.458621], [10.667804, 56.081383], [10.369993, 56.190007], [9.649985, 55.469999], [9.921906, 54.983104], [9.282049, 54.830865], [8.526229, 54.962744], [8.120311, 55.517723], [8.089977, 56.540012], [8.256582, 56.809969], [8.543438, 57.110003], [9.424469, 57.172066], [9.775559, 57.447941], [10.580006, 57.730017], [10.546106, 57.215733], [10.25, 56.890016], [10.369993, 56.609982], [10.912052, 56.458621]]]
      ]
    }
  },
  austria: {
    "type": "Feature",
    "properties": { "name": "Austria" },
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[16.979667, 48.123497], [16.903754, 47.714866], [16.340584, 47.712902], [16.534268, 47.496171], [16.202298, 46.852386], [16.011664, 46.683611], [15.137092, 46.658703], [14.632472, 46.431817], [13.806475, 46.509306], [12.376485, 46.767559], [12.153088, 47.115393], [11.164828, 46.941579], [11.048556, 46.751359], [10.442701, 46.893546], [9.932448, 46.920728], [9.47997, 47.10281], [9.632932, 47.347601], [9.594226, 47.525058], [9.896068, 47.580197], [10.402084, 47.302488], [10.544504, 47.566399], [11.426414, 47.523766], [12.141357, 47.703083], [12.62076, 47.672388], [12.932627, 47.467646], [13.025851, 47.637584], [12.884103, 48.289146], [13.243357, 48.416115], [13.595946, 48.877172], [14.338898, 48.555305], [14.901447, 48.964402], [15.253416, 49.039074], [16.029647, 48.733899], [16.499283, 48.785808], [16.960288, 48.596982], [16.879983, 48.470013], [16.979667, 48.123497]]]
    }
  },
  croatia: {
    "type": "Feature",
    "properties": { "name": "Croatia" },
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[18.829838, 45.908878], [19.072769, 45.521511], [19.390476, 45.236516], [19.005486, 44.860234], [18.553214, 45.08159], [17.861783, 45.06774], [17.002146, 45.233777], [16.534939, 45.211608], [16.318157, 45.004127], [15.959367, 45.233777], [15.750026, 44.818712], [16.23966, 44.351143], [16.456443, 44.04124], [16.916156, 43.667722], [17.297373, 43.446341], [17.674922, 43.028563], [18.56, 42.65], [18.450016, 42.479991], [17.50997, 42.849995], [16.930006, 43.209998], [16.015385, 43.507215], [15.174454, 44.243191], [15.37625, 44.317915], [14.920309, 44.738484], [14.901602, 45.07606], [14.258748, 45.233777], [13.952255, 44.802124], [13.656976, 45.136935], [13.679403, 45.484149], [13.71506, 45.500324], [14.411968, 45.466166], [14.595109, 45.634941], [14.935244, 45.471695], [15.327675, 45.452316], [15.323954, 45.731783], [15.67153, 45.834154], [15.768733, 46.238108], [16.564808, 46.503751], [16.882515, 46.380632], [17.630066, 45.951769], [18.456062, 45.759481], [18.829838, 45.908878]]]
    }
  }
}

// Component props type definition
interface OpenStreetMapProps {
  className?: string;
  mode?: 'view' | 'new' | 'edit';
  initialCenter?: [number, number];
  initialZoom?: number;
  highlightedCountries?: ('denmark' | 'austria' | 'croatia')[];
  onModeChange?: (mode: 'view' | 'new' | 'edit', center: [number, number], zoom: number, highlightedCountries: string[]) => void;
}

/**
 * OpenStreetMap component
 * 
 * This component renders an interactive map using OpenStreetMap and react-leaflet.
 * It supports view, new, and edit modes, and allows highlighting specific countries.
 * 
 * @param {string} [className] - Additional CSS classes for the component
 * @param {'view' | 'new' | 'edit'} [mode='view'] - The current mode of the component
 * @param {[number, number]} [initialCenter=[50.0, 10.0]] - Initial center coordinates of the map
 * @param {number} [initialZoom=4] - Initial zoom level of the map
 * @param {('denmark' | 'austria' | 'croatia')[]} [highlightedCountries=[]] - Countries to highlight on the map
 * @param {function} [onModeChange] - Callback function called when mode or map state changes
 */
export default function OpenStreetMap({
  className = '',
  mode = 'view',
  initialCenter = [50.0, 10.0],
  initialZoom = 4,
  highlightedCountries = [],
  onModeChange
}: OpenStreetMapProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [center, setCenter] = useState<[number, number]>(initialCenter)
  const [zoom, setZoom] = useState(initialZoom)
  const [highlighted, setHighlighted] = useState<string[]>(highlightedCountries)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (onModeChange) {
      onModeChange(mode, center, zoom, highlighted)
    }
  }, [mode, center, zoom, highlighted, onModeChange])

  const countryStyle = useCallback((color: string) => {
    return {
      fillColor: color,
      fillOpacity: 0.4,
      color: 'black',
      weight: 2,
    }
  }, [])

  const toggleCountry = useCallback((country: string) => {
    if (mode !== 'view') {
      setHighlighted(prev =>
        prev.includes(country)
          ? prev.filter(c => c !== country)
          : [...prev, country]
      )
    }
  }, [mode])

  // Custom component to handle map events
  const MapEvents = () => {
    const map = useMap()

    useEffect(() => {
      const onMoveEnd = () => {
        const newCenter = map.getCenter()
        setCenter([newCenter.lat, newCenter.lng])
        setZoom(map.getZoom())
      }

      map.on('moveend', onMoveEnd)

      return () => {
        map.off('moveend', onMoveEnd)
      }
    }, [map])

    return null
  }

  if (!isMounted) {
    return null // Return null on the server-side
  }

  return (
    <div className={`flex flex-col items-center justify-center bg-gray-100 p-4 ${className}`}>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">OpenStreetMap: Europe</h1>
      <div className="w-full max-w-4xl h-[70vh] rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          attributionControl={false}
        >
          <MapEvents />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {Object.entries(countriesGeoJSON).map(([country, geoJSON]) => (
            <GeoJSON
              key={country}
              data={geoJSON as any}
              style={highlighted.includes(country) ? countryStyle('#ff7f50') : countryStyle('#cccccc')}
              eventHandlers={{
                click: () => toggleCountry(country)
              }}
            >
              <Popup>{geoJSON.properties.name}</Popup>
            </GeoJSON>
          ))}
          <Marker position={[48.8566, 2.3522]} icon={icon}>
            <Popup>
              Paris, France
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="mt-4 text-sm text-gray-600 flex items-center space-x-4">
        <p>Current mode: {mode}</p>
        <p>Click countries to {mode === 'view' ? 'view' : 'highlight'}</p>
      </div>
    </div>
  )
}

// Example usage documentation
export const examplesOpenStreetMap: ComponentDoc[] = [
  {
    id: 'OpenStreetMapView',
    name: 'OpenStreetMap (View Mode)',
    description: 'OpenStreetMap component in view mode',
    usage: `
<OpenStreetMap 
  mode="view"
  initialCenter={[50.0, 10.0]}
  initialZoom={4}
  highlightedCountries={['denmark', 'austria']}
  onModeChange={(mode, center, zoom, highlighted) => {
    console.log('Mode:', mode);
    console.log('Center:', center);
    console.log('Zoom:', zoom);
    console.log('Highlighted countries:', highlighted);
  }}
/>
    `,
    example: (
      <OpenStreetMap
        mode="view"
        initialCenter={[50.0, 10.0]}
        initialZoom={4}
        highlightedCountries={['denmark', 'austria']}
        onModeChange={(mode, center, zoom, highlighted) => {
          console.log('Mode:', mode);
          console.log('Center:', center);
          console.log('Zoom:', zoom);
          console.log('Highlighted countries:', highlighted);
        }}
      />
    ),
  },
  {
    id: 'OpenStreetMapEdit',
    name: 'OpenStreetMap (Edit Mode)',
    description: 'OpenStreetMap component in edit mode',
    usage: `
<OpenStreetMap 
  mode="edit"
  initialCenter={[45.0, 15.0]}
  initialZoom={5}
  highlightedCountries={['croatia']}
  onModeChange={(mode, center, zoom, highlighted) => {
    console.log('Mode:', mode);
    console.log('Center:', center);
    console.log('Zoom:', zoom);
    console.log('Highlighted countries:', highlighted);
  }}
/>
    `,
    example: (
      <OpenStreetMap
        mode="edit"
        initialCenter={[45.0, 15.0]}
        initialZoom={5}
        highlightedCountries={['croatia']}
        onModeChange={(mode, center, zoom, highlighted) => {
          console.log('Mode:', mode);
          console.log('Center:', center);
          console.log('Zoom:', zoom);
          console.log('Highlighted countries:', highlighted);
        }}
      />
    ),
  },
]