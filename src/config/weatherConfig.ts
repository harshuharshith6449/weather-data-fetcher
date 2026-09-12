export const WEATHER_CONFIG = {
  student: {
    name: 'Harshith T J',
    registerNumber: '24UG00206',
    course: 'Cloud Computing Project'
  },
  location: {
    name: 'Bengaluru, Karnataka, India',
    latitude: 12.9716,
    longitude: 77.5946,
    timezone: 'Asia/Kolkata'
  },
  supabase: {
    projectRef: 'okrctxvndvqztijhisuq',
    url: 'https://okrctxvndvqztijhisuq.supabase.co',
    functionName: 'fetch-weather',
    edgeFunctionUrl: 'https://okrctxvndvqztijhisuq.supabase.co/functions/v1/fetch-weather'
  },
  openMeteo: {
    baseUrl: 'https://api.open-meteo.com/v1/forecast',
    params: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation',
      'rain',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m'
    ].join(',')
  },
  cron: {
    name: 'fetch-weather-daily',
    expression: '0 6 * * *',
    scheduleDescription: '06:00 UTC Daily (11:30 AM IST)'
  }
};

export const getWeatherDescription = (code: number): { text: string; icon: string } => {
  switch (code) {
    case 0: return { text: 'Clear Sky', icon: '☀️' };
    case 1: return { text: 'Mainly Clear', icon: '🌤️' };
    case 2: return { text: 'Partly Cloudy', icon: '⛅' };
    case 3: return { text: 'Overcast', icon: '☁️' };
    case 45: case 48: return { text: 'Foggy', icon: '🌫️' };
    case 51: case 53: case 55: return { text: 'Drizzle', icon: '🌦️' };
    case 61: case 63: case 65: return { text: 'Rain', icon: '🌧️' };
    case 71: case 73: case 75: return { text: 'Snow', icon: '❄️' };
    case 80: case 81: case 82: return { text: 'Rain Showers', icon: '🌧️' };
    case 95: case 96: case 99: return { text: 'Thunderstorm', icon: '🌩️' };
    default: return { text: 'Fair Weather', icon: '🌤️' };
  }
};
