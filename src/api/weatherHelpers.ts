export function getPrecipitationType(
  probability: number,
  weatherCode: number,
): string {
  if (probability === 0 || weatherCode < 51) {
    return "None expected";
  }

  if ([56, 57, 66, 67].includes(weatherCode)) {
    return "Freezing rain";
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return "Snow";
  }

  if ([80, 81, 82].includes(weatherCode)) {
    return "Rain showers";
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return "Thunderstorms";
  }

  return "Rain";
}

export function getWindDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const directionIndex = Math.round(degrees / 45) % directions.length;
  return directions[directionIndex];
}
