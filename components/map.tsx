"use client"
import { FormEvent, useMemo, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const Map = ({ coords }:{ coords: {lat:number, lng: number}}) => {

    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
    });


  const center = useMemo(
    () => ({
      lat: coords.lat,
      lng: coords.lng,
    }),
    [coords]
  );

  console.log("Map", center)

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapTypeId="satellite"
      zoom={22}
      center={center}
      mapContainerClassName="w-full w-full aspect-square"
    >
      <Marker position={center} />
    </GoogleMap>
  );
};
export default Map;

