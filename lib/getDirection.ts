 function getDirection(azimuth:number):string {
  if(azimuth >= 0 && azimuth < 22.5) {
    return 'North'
  } else if(azimuth >= 22.5 && azimuth < 45) {
    return 'North-northeast)'
  } else if(azimuth >= 45 && azimuth < 67.5) {
    return "Northeast"
  } else if(azimuth >= 67.5 && azimuth < 90) {
    return "East-northeast"
  } else if(azimuth >= 90 && azimuth < 112.5) {
    return "East"
  } else if(azimuth >= 112.5 && azimuth < 135) {
    return "East-southeast"
  } else if (azimuth >= 135 && azimuth < 157.5) {
    return "Southeast"
  } else if (azimuth >= 157.5 && azimuth < 180) {
    return "South-southeast"
  } else if (azimuth >= 180 && azimuth < 202.5) {
    return "South"
  } else if (azimuth >= 202.5 && azimuth < 225) {
    return "South-southwest"
  } else if (azimuth >= 225 && azimuth < 247.5) {
    return "Southwest"
  } else if (azimuth >= 247.5 && azimuth < 270) {
    return "West-southwest"
  } else if (azimuth >= 270 && azimuth < 292.5) {
    return "West"
  } else if(azimuth >= 292.5 && azimuth < 315) {
    return "West-northwest"
  } else if (azimuth >= 315 && azimuth < 337.5) {
    return "Northwest"
  } else if (azimuth >= 337.5 && azimuth < 360) {
    return "North-northwest"
  } else if (azimuth > 360 || azimuth < 0) {
     return "Error"
  }
  else {
    return 'North (N)'
  }
}


export default getDirection
