export interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  dew_point_2m: number;
  precipitation_probability: number;
  weather_code: number;
  is_day: number;
  wind_speed_10m: number;
  wind_gusts_10m: number;
  wind_direction_10m: number;
}

export interface CurrentUnits {
  temperature_2m: string;
  dew_point_2m: string;
  precipitation_probability: string;
  wind_speed_10m: string;
  wind_gusts_10m: string;
  wind_direction_10m: string;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  dew_point_2m: number[];
  precipitation_probability: number[];
  weather_code: number[];
  is_day: number[];
  wind_speed_10m: number[];
}

export interface HourlyUnits {
  temperature_2m: string;
  dew_point_2m: string;
  precipitation_probability: string;
  wind_speed_10m: string;
}

export interface WeatherResponse {
  current: CurrentWeather;
  current_units: CurrentUnits;
  hourly?: HourlyWeather;
  hourly_units?: HourlyUnits;
  timezone_abbreviation: string;
}
