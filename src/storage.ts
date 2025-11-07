import * as fs from "fs";

interface City {
  name: string;
  zipCode: string;
}

interface Weather {
  zipCode: string;
  weather: string;
  id: number;
  townName?: string;
}

let cities: City[] = [
  {
    name: "Dijon",
    zipCode: "21000",
  },
  {
    name: "Besançon",
    zipCode: "25000",
  },
  {
    name: "Paris",
    zipCode: "75001",
  },
];

let weather: Weather[] = [
  {
    id: 0,
    zipCode: "21000",
    weather: "pluie"
  },
  {
    id: 1,
    zipCode: "21000",
    weather: "pluie",
  },
  {
    id: 2,
    zipCode: "21000",
    weather: "beau",
  },
  {
    id: 3,
    zipCode: "21000",
    weather: "neige",
  },
  {
    id: 4,
    zipCode: "21000",
    weather: "pluie",
  },
];

function saveWeatherData() {
  let finalJson = JSON.stringify({
    cities: cities,
    weather: weather,
  });

  fs.writeFile("user.json", finalJson, (err) => {
    if (err) {
      console.log("Error writing file:", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
}

export { cities, weather, saveWeatherData };
