import React, { useMemo } from "react";
import { GoogleMap, HeatmapLayer, Circle, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "16px"
};

const center = {
  lat: 7.8731, // Sri Lanka center
  lng: 80.7718
};

const districts = {
  Colombo: { lat: 6.9271, lng: 79.8612 },
  Gampaha: { lat: 7.0840, lng: 80.0098 },
  Kalutara: { lat: 6.5854, lng: 79.9607 },
  Kandy: { lat: 7.2906, lng: 80.6337 },
  Matale: { lat: 7.4675, lng: 80.6234 },
  "Nuwara Eliya": { lat: 6.9497, lng: 80.7828 },
  Galle: { lat: 6.0329, lng: 80.2168 },
  Matara: { lat: 5.9549, lng: 80.5469 },
  Hambantota: { lat: 6.1429, lng: 81.1212 },
  Jaffna: { lat: 9.6615, lng: 80.0255 },
  Kilinochchi: { lat: 9.3803, lng: 80.3770 },
  Mannar: { lat: 8.9810, lng: 79.9044 },
  Vavuniya: { lat: 8.7542, lng: 80.4982 },
  Mullaitivu: { lat: 9.2671, lng: 80.8142 },
  Batticaloa: { lat: 7.7102, lng: 81.6924 },
  Ampara: { lat: 7.2912, lng: 81.6724 },
  Trincomalee: { lat: 8.5811, lng: 81.2335 },
  Kurunegala: { lat: 7.4818, lng: 80.3609 },
  Puttalam: { lat: 8.0195, lng: 79.8339 },
  Anuradhapura: { lat: 8.3114, lng: 80.4037 },
  Polonnaruwa: { lat: 7.9403, lng: 81.0188 },
  Badulla: { lat: 6.9934, lng: 81.0550 },
  Monaragala: { lat: 6.8728, lng: 81.3507 },
  Ratnapura: { lat: 6.6828, lng: 80.3992 },
  Kegalle: { lat: 7.2513, lng: 80.3464 }
};

export default function DiseaseMap({ data }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "", 
    libraries: ["visualization"]
  });

  if (!isLoaded) return <div className="animate-pulse bg-gray-200 h-[500px] w-full rounded-2xl flex items-center justify-center">Loading Map...</div>;

  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
      {data.map((item, index) => {
        const dPos = districts[item.district];
        if (!dPos) return null;

        const intensity = item.count / maxCount;
        
        let color = "#ef4444"; 
        if (intensity < 0.3) color = "#fca5a5"; 
        else if (intensity > 0.7) color = "#991b1b"; 

        const radius = 12000 + (intensity * 15000);

        return (
          <Circle
            key={index}
            center={dPos}
            radius={radius}
            options={{
              fillColor: color,
              fillOpacity: 0.5,
              strokeColor: color,
              strokeOpacity: 0.8,
              strokeWeight: 2,
              clickable: false,
            }}
          />
        );
      })}
    </GoogleMap>
  );
}
