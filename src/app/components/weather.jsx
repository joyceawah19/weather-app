"use client";

import { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather } from "../redux/weatherSlice";
import Image from "next/image";

export default function Weather() {
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  const dispatch = useDispatch();
  const {
    data: weather,
    loading,
    error,
  } = useSelector((state) => state.weather);

  const handleFetch = () => {
    if (!city || !date) return alert("Enter city and date");
    dispatch(fetchWeather({ city, date }));
  };

  useEffect(() =>{
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                dispatch(fetchWeather({lat,lon}));
            },
            (error) => {
                console.log("location error:", error);
            }
        );
    }
  }, [dispatch]  )

  return (
    <div className="flex justify-center bg-[#c5cfe3] " >
    <div className="bg-gradient-to-r from-[hsl(220,60%,56%)] to-[hsl(236,60%,36%)] text-white shadow-lg rounded-2xl p-6 w-full h-full max-w-md mt-[20px]">
      <h1 className="text-2xl  text-white font-bold text-center mb-4">
        Weather Checker
      </h1>

      <input
        type="text"
        placeholder="Enter city"
        className="w-full p-2 mb-3 border rounded"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <input
        type="date"
        className="w-full p-2 mb-3 border rounded"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button
        onClick={handleFetch}
        className="w-full bg-white text-blue-600 p-2 rounded-[20px] hover:blur-[1px] cursor-pointer "
      >
        {loading ? "Loading..." : "Get Weather"}
      </button>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {weather && (
        <div className="mt-6 text-center">
          <img src={weather.icon} alt="weather icon"  className="mx-auto color-white h-[150px] w-[150px] " />
          <h2 className="text-xl font-semibold mb-[20px]">{weather.condition}</h2>
          <div className=" flex justify-center items-center gap-[20px] ">
            <Image src={"/wi-thermometer.svg"} height={50} width={50} alt="temp" className="invert" />
            <p> Temp: {weather.temp}°C</p>
          </div>
          <div className=" flex justify-center items-center gap-[20px]">
            <Image src={"/wi-humidity.svg"} height={50} width={50} alt="temp" className="invert" />
            <p> Humidity: {weather.humidity}%</p>
          </div>
          <div className=" flex justify-center items-center gap-[20px] " >
            <Image src={"/wi-strong-wind.svg"} height={50} width={50} alt="temp" className="invert" />
            <p> Wind: {weather.wind} kph</p>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
