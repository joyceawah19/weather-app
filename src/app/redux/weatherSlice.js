import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = "de237a24a74142a9b2982940262203"; // your key

// Async API call
export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async ({ city, date, lat, lon }, { rejectWithValue }) => {
    try {
      let url = "";
      let params = {};

      // ✅ CASE 1: User location (default on load)
      if (lat && lon) {
        url = "https://api.weatherapi.com/v1/current.json";
        params = {
          key: API_KEY,
          q: `${lat},${lon}`,
        };
      }

      // ✅ CASE 2: Manual search (history with date)
      else if (city && date) {
        url = "https://api.weatherapi.com/v1/history.json";
        params = {
          key: API_KEY,
          q: city,
          dt: date,
        };
      }

      // ❌ Invalid input
      else {
        return rejectWithValue("Provide city & date OR location");
      }

      const response = await axios.get(url, { params });

      // ✅ Format response depending on API
      if (lat && lon) {
        const data = response.data.current;
        const location = response.data.location;

        return {
          temp: data.temp_c,
          condition: data.condition.text,
          icon: data.condition.icon,
          humidity: data.humidity,
          wind: data.wind_kph,
         city: location.name,
         country: location.country,
        };
      } else {
        const data = response.data.forecast.forecastday[0].day;
                const location = response.data.location;

        return {
          temp: data.avgtemp_c,
          condition: data.condition.text,
          icon: data.condition.icon,
          humidity: data.avghumidity,
          wind: data.maxwind_kph,
           city: location.name,
            country: location.country,
        };
      }

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || "Error fetching weather"
      );
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default weatherSlice.reducer;