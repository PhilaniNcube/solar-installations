export type DataLayer = {
  imageryDate : {
    year : number,
    month : number,
    day : number
  }
  imageryProcessedDate : {
    year : number,
    month : number,
    day : number
  }
  dsmUrl : string,
  rgbUrl : string,
  maskUrl : string,
  annualFluxUrl : string,
  monthlyFluxUrl : string,
  hourlyShadeUrls : string[],
  imageryQuality : string,
}

export type DatalayerError = {
  error: {
    code: number,
    message: string,
    status: string
  }
}



export type DataResponse = {
  name: string;
  center: {
    latitude: number;
    longitude: number;
  };
  imageryDate: {
    year: number;
    month: number;
    day: number;
  };
  regionCode: string;
  solarPotential: {
    maxArrayPanelsCount: number;
    maxArrayAreaMeters2: number;
    maxSunshineHoursPerYear: number;
    carbonOffsetFactorKgPerMwh: number;
    wholeRoofStats: {
      areaMeters2: number;
      sunshineQuantiles: number[];
      groundAreaMeters2: number;
    };
    roofSegmentStats: {
      pitchDegrees: number;
      azimuthDegrees: number;
      stats: {
        areaMeters2: number;
        sunshineQuantiles: number[];
        groundAreaMeters2: number;
      };
      center: {
        latitude: number;
        longitude: number;
      };
      boundingBox: {
        sw: {
          latitude: number;
          longitude: number;
        };
        ne: {
          latitude: number;
          longitude: number;
        };
      };
      planeHeightAtCenterMeters: number;
    }[];
    solarPanelConfigs: {
      panelsCount: number;
      yearlyEnergyDcKwh: number;
      roofSegmentSummaries: {
        pitchDegrees: number;
        azimuthDegrees: number;
        panelsCount: number;
        yearlyEnergyDcKwh: number;
        segmentIndex: number;
      }[];
    }[];
    panelCapacityWatts: number;
    panelHeightMeters: number;
    panelWidthMeters: number;
    panelLifetimeYears: number;
    buildingStats: {
      areaMeters2: number;
      sunshineQuantiles: number[];
      groundAreaMeters2: number;
    };
    solarPanels: {
      center: {
        latitude: number;
        longitude: number;
      };
      orientation: string;
      yearlyEnergyDcKwh: number;
      segmentIndex: number;
    }[];
  };
  boundingBox: {
    sw: {
      latitude: number;
      longitude: number;
    };
    ne: {
      latitude: number;
      longitude: number;
    };
  };
  imageryQuality: string;
  imageryProcessedDate: {
    year: number;
    month: number;
    day: number;
  };
};

export type GeocodingResponse = {
  results: {
    address_components: {
      long_name: string;
      short_name: string;
      types: string[]
    }[]
    formatted_address: string;
    geometry: {
      bounds: {
        northeast: {
          lat: number;
          lng: number;
        }
        southwest: {
          lat: number;
          lng: number;
        }
      }
      location: {
        lat: number;
        lng: number;
      }
      location_type: string;
      viewport: {
        northeast: {
          lat: number;
          lng: number;
        }
        southwest: {
          lat: number;
          lng: number;
        }
      }
    }
    place_id: string;
    types: string[]
  }[]
  status: string;
}


export type DataResponseError = {
  error: {
    code: number;
    message: string;
    status: string;
  }
}
