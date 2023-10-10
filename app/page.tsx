"use client"
import solarPanels from "@/data/solar-panels";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormEvent, useState } from "react";

import { DataResponse, DataResponseError, GeocodingResponse } from "@/interfaces";
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import getDirection from '@/lib/getDirection'
import Map from '@/components/map'



export default function Home() {

  const [panel, setSelectedPanel] = useState(solarPanels[0]);



   const [electricityData, setElectricityData] = useState({
     bill: 0,
     baseBill: 0,
     discountBill: 0,
     baseBillKwh: 0,
     totalKwh: 0,
     yearlyEnergyKwh: 0,
     dailyEnergyKwh:0,
   });




   // this is the service charge on each electricity bill
   const serviceCharge = 252.09

   // for the first 600kWh of usage the rate is 3.09
   const discountRate = 3.09

    // for usage over 600kWh of usage the rate is 4.27
   const baseRate = 4.27

   const [solarConfigIndex, setSolarConfigIndex] = useState<number>(0);

   const [solarData, setSolarData] = useState<DataResponse | null>(null);

   const [coords, setCoords] = useState<{ lat: number; lng: number }>({
     lat: 33,
     lng: 18,
   });
  const [loading, setLoading] = useState(false)


  const onSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)


    const {address, bill, solution} = Object.fromEntries(new FormData(e.currentTarget))

    console.log({address, bill, solution})

    if (
      typeof address !== "string" ||
      typeof bill !== "string" ||
      typeof solution !== "string"
    )
      return;

    const electricityBill = parseInt(bill) * 12;

    const discountBill = discountRate * 600;

    const baseBill = parseInt(bill) - discountBill - serviceCharge;

    const baseBillKwh = baseBill / baseRate;

    const totalKwh = baseBillKwh + 600;

    const yearlyEnergyKwh = totalKwh * 12;

    const dailyEnergyKwh = yearlyEnergyKwh / 365;

    console.log({
      bill: parseInt(bill),
      baseBill,
      discountBill,
      baseBillKwh,
      totalKwh,
      yearlyEnergyKwh,
    });

    setElectricityData({
      bill: parseInt(bill),
      baseBill,
      discountBill,
      baseBillKwh,
      totalKwh,
      yearlyEnergyKwh,
      dailyEnergyKwh,
    });





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

     console.log({formatted_address})

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



    const solar: DataResponse  = await res;

    if (solar.name === undefined) {
      toast({
        title: "Error",
        description: "There was an error retrieving the data. Some areas are not yet covered by this tool. Your city/country is not yet covered.",
        variant: "destructive"
      })
      setLoading(false);
      return;
    }



    setSolarData(solar);

    console.log("Solar", solar);


    setCoords({ lat: solar.center.latitude, lng: solar.center.longitude });


    setLoading(false);

  }



  return (
    <main className="container py-10">
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
        <div className="grid grid-cols-1 gap-2 mt-8 lg:grid-cols-2">
          <div className="w-full p-4">
            <form onSubmit={onSubmit} className="w-full mt-4">
              <div className="flex flex-col space-y-3">
                <Label htmlFor="address">Street Address</Label>
                <Input name="address" id="address" type="text" />
              </div>
              <div className="flex flex-col my-3 space-y-3">
                <Label htmlFor="bill">
                  What is your average monthly electricity bill
                </Label>
                <Input name="bill" id="bill" type="number" />
              </div>
              <div className="flex flex-col my-3 space-y-3">
                <Select name="solution">
                  <SelectTrigger className="">
                    <SelectValue placeholder="Please select what type of solution you need.." />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectLabel>Solar Installation Solution</SelectLabel> */}
                    <SelectItem value="Off-Grid">Total Off Grid</SelectItem>
                    <SelectItem value="Load Shedding Protection">
                      Load Shedding Protection
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                <div className="w-full ">
                  <div className="flex items-center justify-between">
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
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button>Select Solar Panel</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <ScrollArea className="h-[600px]">
                          {solarPanels.map(
                            (panel, index) => {
                              return (
                                <DropdownMenuItem
                                  key={index}
                                  onClick={() => setSelectedPanel(panel)}
                                >
                                  {panel.manufacturer} - {panel.maxPower} Watts
                                </DropdownMenuItem>
                              );
                            }
                          )}
                        </ScrollArea>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-4">
                    {/* <p className="text-md">
                      Based on your montly electricity bill we estimate you use{" "}
                      <span className="font-bold">
                        {electricityData.yearlyEnergyKwh.toFixed(2)} kWh/year
                      </span>
                    </p> */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Yearly </TableHead>
                          <TableHead>Monthly </TableHead>
                          <TableHead>Daily </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell> Electricity Usage</TableCell>
                          <TableCell>
                            {" "}
                            {electricityData.yearlyEnergyKwh.toFixed(2)}{" "}
                            kWh/year
                          </TableCell>
                          <TableCell>
                            {electricityData.totalKwh.toFixed(2)} kWh/month
                          </TableCell>
                          <TableCell>
                            {electricityData.dailyEnergyKwh.toFixed(2)} kWh/day
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            {" "}
                            Solar{" "}
                            {
                              solarData.solarPotential.solarPanelConfigs[
                                solarConfigIndex
                              ].panelsCount
                            }{" "}
                            panels
                          </TableCell>
                          <TableCell
                            className={cn(
                              "font-bold",
                              electricityData.yearlyEnergyKwh >
                                solarData.solarPotential.solarPanelConfigs[
                                  solarConfigIndex
                                ].yearlyEnergyDcKwh *
                                  (panel.maxPower /
                                    solarData.solarPotential.panelCapacityWatts)
                                ? "text-red-500"
                                : "text-green-500"
                            )}
                          >
                            {" "}
                            {(
                              solarData.solarPotential.solarPanelConfigs[
                                solarConfigIndex
                              ].yearlyEnergyDcKwh *
                              (panel.maxPower /
                                solarData.solarPotential.panelCapacityWatts)
                            ).toFixed(2)}{" "}
                            kWh/year
                          </TableCell>
                          <TableCell
                            className={cn(
                              "font-bold",
                              electricityData.yearlyEnergyKwh >
                                solarData.solarPotential.solarPanelConfigs[
                                  solarConfigIndex
                                ].yearlyEnergyDcKwh *
                                  (panel.maxPower /
                                    solarData.solarPotential.panelCapacityWatts)
                                ? "text-red-500"
                                : "text-green-500"
                            )}
                          >
                            {(
                              (solarData.solarPotential.solarPanelConfigs[
                                solarConfigIndex
                              ].yearlyEnergyDcKwh /
                                12) *
                              (panel.maxPower /
                                solarData.solarPotential.panelCapacityWatts)
                            ).toFixed(2)}{" "}
                            kWh/month
                          </TableCell>
                          <TableCell
                            className={cn(
                              "font-bold",
                              electricityData.yearlyEnergyKwh >
                                solarData.solarPotential.solarPanelConfigs[
                                  solarConfigIndex
                                ].yearlyEnergyDcKwh *
                                  (panel.maxPower /
                                    solarData.solarPotential.panelCapacityWatts)
                                ? "text-red-500"
                                : "text-green-500"
                            )}
                          >
                            {(
                              (solarData.solarPotential.solarPanelConfigs[
                                solarConfigIndex
                              ].yearlyEnergyDcKwh /
                                365) *
                              (panel.maxPower /
                                solarData.solarPotential.panelCapacityWatts)
                            ).toFixed(2)}{" "}
                            kWh/day
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  <div className="grid grid-cols-1 gap-2 mt-8 lg:grid-cols-2">
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
                      {solarData.solarPotential.maxSunshineHoursPerYear.toFixed(
                        2
                      )}{" "}
                      hours
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
            <Map coords={coords} />
          </div>
        </div>
        {solarData !== null && (
          <div className="w-full">
            <h2 className="mt-4 text-2xl font-bold">
              Solar Panel Configurations
            </h2>
            <Separator className="my-3" />
            <div className="flex items-start w-full px-3 space-x-3">
              <div className="w-1/3">
                <h2 className="text-lg font-medium">Whole Roof Stats</h2>

                <p className="font-bold text-md">
                  Electricity Usage {electricityData.yearlyEnergyKwh.toFixed(2)}{" "}
                  kWh/year
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
                <div className="grid flex-1 grid-cols-3 gap-4">
                  {solarData.solarPotential.solarPanelConfigs[
                    solarConfigIndex
                  ].roofSegmentSummaries.map((config, index) => {
                    return (
                      <div
                        key={index}
                        className="w-full p-3 border rounded-md shadow border-slate-400 hover:shadow-md"
                      >
                        <h2 className="font-medium text-md">
                          Roof Segement {config.segmentIndex}
                        </h2>
                        <p className="text-sm">
                          Facing {getDirection(config.azimuthDegrees)}
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
