"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { FormEvent, useMemo, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  GoogleMapProps,
  Polygon,
  OverlayView,
  PolygonF
} from "@react-google-maps/api";
import { DataResponse, GeocodingResponse } from "@/interfaces";
import { AreaChart } from 'lucide-react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function Home() {

   const { isLoaded, loadError } = useLoadScript({
     googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY || "",
   });
   const center = useMemo(
     () => ({ lat: -33.984245817698465, lng: 18.47764 }),
     []
   );

   const [chartData, setChartData] = useState<any[]>([])

   const [solarConfigIndex, setSolarConfigIndex] = useState<number>(0);

   const [solarData, setSolarData] = useState<DataResponse | null>(null);

   const [coords, setCoords] = useState<{ lat: number; lng: number }>(center);
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)


    const {address} = Object.fromEntries(new FormData(e.currentTarget))

    if (typeof address !== "string") return;

     const encodedAddress = encodeURIComponent(address);

     const gecodingUrl = new URL(
       `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}`
     );

     const response = await fetch(gecodingUrl)
       .then((res) => res.json())
       .then((data) => data)
       .catch((err) => console.log(err));

     const data: GeocodingResponse = await response;

     const { results, status } = data;

     if (status !== "OK") return;

     const {
       geometry: { location },
       formatted_address,
       place_id,
     } = results[0];

     const url = new URL(
       `https://solar.googleapis.com/v1/buildingInsights:findClosest?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}`
     );

     url.searchParams.append("location.latitude", location.lat.toString());
     url.searchParams.append("location.longitude", location.lng.toString());


    const res = await fetch(url, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err));

    const solar: DataResponse = await res;



    setSolarData(solar);

    setChartData(solar.solarPotential.solarPanelConfigs.map((config) => {
      return {
        name: config.panelsCount === 1 ? `${config.panelsCount} Panel` : `${config.panelsCount} Panels`,
        output: config.yearlyEnergyDcKwh.toFixed(2),
      }
    }))

    setCoords({ lat: solar.center.latitude, lng: solar.center.longitude });


    setLoading(false);

  }

  console.log({solarConfigIndex})

  return (
    <main className="">
      <ScrollArea className="w-full h-[calc(100vh-40px)]">
        <h1 className="text-2xl font-bold">
          Solar Installation information tool
        </h1>
        <p className="text-md">
          This tool is designed to help you find information about are
          particular address. For the available areas you will be able to get
          information on the total area of the roof, maximum sunshine hours,
          maximum energy output in KwH at that location. You can use this to
          generate an approximate quote for a solar installation
        </p>

        <Separator className="my-3" />

        <h2 className="text-xl font-bold">Enter your address</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-8 gap-2">
          <div className="w-full p-4">
            <form onSubmit={onSubmit} className="w-full mt-4">
              <div className="flex space-y-3 flex-col">
                <Label htmlFor="address">Street Address</Label>
                <Input name="address" id="address" type="text" />
              </div>
              <div className="mt-2">
                <Button type="submit" disabled={loading}>
                  Submit
                </Button>
              </div>
            </form>
            <Separator className="my-3" />
            <div className="w-full">
              {solarData === null ? (
                <p className="text-lg font-medium">
                  Please enter an address to retrieve the data.{" "}
                </p>
              ) : (
                <div className="w-full">
                  <h2 className="text-xl font-bold">Results</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 mt-8 gap-2">
                    <span>Total Roof Area</span>
                    <span>
                      {solarData.solarPotential.wholeRoofStats.areaMeters2.toFixed(
                        2
                      )}{" "}
                      sqm
                    </span>
                  </div>
                  <Separator className="my-1" />
                  <p className="text-md ">
                    The maximum area that can be covered by solar panels is:
                    <strong>
                      {solarData.solarPotential.maxArrayAreaMeters2.toFixed(2)}{" "}
                      sqm
                    </strong>
                  </p>
                  <Separator className="my-1" />
                  <span>
                    Maximum Sunshine Hours Per Year{" "}
                    <strong>
                      {solarData.solarPotential.maxSunshineHoursPerYear} hours
                    </strong>
                  </span>

                  <Separator className="my-1" />
                  <p>
                    The roof at this address has{" "}
                    <strong>
                      {solarData.solarPotential.roofSegmentStats.length}{" "}
                      sections/segments
                    </strong>
                  </p>
                  <Separator className="my-1" />
                  <p>
                    The roof at this address has{" "}
                    <strong>
                      {solarData.solarPotential.solarPanelConfigs.length}{" "}
                      possible solar panel configurations
                    </strong>
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full h-full text-white">
            {isLoaded ? (
              <GoogleMap
                mapTypeId="satellite"
                zoom={22}
                center={coords}
                mapContainerClassName="w-full w-full aspect-square"
              >
                <Polygon
                  options={{
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#FF0000",
                    fillOpacity: 0.35,
                  }}
                />

                <Marker position={coords} />
              </GoogleMap>
            ) : (
              <div className="w-full h-full">Loading...</div>
            )}
          </div>
        </div>
        {solarData !== null && (
          <div className="w-full">
            <h2 className="text-2xl font-bold mt-4">
              Solar Panel Configurations
            </h2>
            <Separator className="my-3" />
            <div className="w-full flex space-x-3 items-start px-3">
              <div className="w-1/3">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button>Select Configuration</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <ScrollArea className="h-[600px]">
                      {solarData.solarPotential.solarPanelConfigs.map(
                        (config, index) => {
                          return (
                            <DropdownMenuItem
                              key={index}
                              onClick={() => setSolarConfigIndex(index)}
                            >
                              {config.panelsCount === 1
                                ? `${config.panelsCount} Panel`
                                : `${config.panelsCount} Panels`}
                            </DropdownMenuItem>
                          );
                        }
                      )}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Separator className="my-5" />
                <h2 className="text-lg font-medium">Whole Roof Stats</h2>
                <p>
                  Total Roof Output:{" "}
                  {solarData.solarPotential.solarPanelConfigs[
                    solarConfigIndex
                  ].yearlyEnergyDcKwh.toFixed(2)}{" "}
                  KwH
                </p>
                <p>
                  Number of Roof Segments:{" "}
                  {
                    solarData.solarPotential.solarPanelConfigs[solarConfigIndex]
                      .roofSegmentSummaries.length
                  }
                  /{solarData.solarPotential.roofSegmentStats.length}
                </p>
                <p>
                  Total Number of Panels:{" "}
                  {
                    solarData.solarPotential.solarPanelConfigs[solarConfigIndex]
                      .panelsCount
                  }
                </p>
              </div>
              <div className="w-full">
                <div className="flex-1 grid grid-cols-3 gap-4">
                  {solarData.solarPotential.solarPanelConfigs[
                    solarConfigIndex
                  ].roofSegmentSummaries.map((config, index) => {
                    return (
                      <div
                        key={index}
                        className="w-full border border-slate-400 rounded-md p-3 shadow hover:shadow-md"
                      >
                        <h2 className="text-md font-medium">
                          Roof Segement {config.segmentIndex}

                        </h2>
                        <p className="text-sm">
                          Azimuth {config.azimuthDegrees.toFixed(2)}&deg;{" "}
                        </p>
                        <p className="text-sm">
                          Roof Pitch {config.pitchDegrees.toFixed(2)}&deg;{" "}
                        </p>
                        <p className="text-sm">Panels {config.panelsCount} </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </main>
  );
}
