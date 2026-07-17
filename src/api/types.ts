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

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_direction_10m_dominant: number[];
}

export interface DailyUnits {
  temperature_2m_max: string;
  temperature_2m_min: string;
  precipitation_probability_max: string;
  wind_speed_10m_max: string;
}

export interface WeatherResponse {
  current: CurrentWeather;
  current_units: CurrentUnits;
  hourly?: HourlyWeather;
  hourly_units?: HourlyUnits;
  daily?: DailyWeather;
  daily_units?: DailyUnits;
  timezone_abbreviation: string;
}
