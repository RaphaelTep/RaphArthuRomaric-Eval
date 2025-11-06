import * as fs from "fs";

interface City {
  name: string;
  zipCode: string;
}

interface Weather {
  zipCode: string;
  weather: string;
  id: number;
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

let weather: Weather[] = [];

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
