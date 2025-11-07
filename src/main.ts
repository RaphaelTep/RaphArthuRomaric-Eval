import express from "express";
import { cities, weather } from "./storage";
import logger from "./logger";

const server = express();

server.use(express.json());

function isValidMethod(
  req: express.Request,
  res: express.Response,
  method: string,
) {
  if (req.method !== method) {
    res.status(405).json({ error: "Method not allowed" });
    logger.error(`ERROR : Method not allowed ${JSON.stringify(req)}`);
    res.end();
  }
}

server.get("/cities", (req, res) => {
  isValidMethod(req, res, "GET");
  logger.info(`All cities retrived : ${JSON.stringify(cities)}`);
  res.json(cities);
});

server.get("/cities/:zipCode", (req, res) => {
  isValidMethod(req, res, "GET");

  let findCity = cities.find((city) => city.zipCode === req.params.zipCode);

  if (!findCity) {
    res.status(404).json({ error: "City not found" });
    logger.error(
      `ERROR : City not found ${JSON.stringify(req.params.zipCode)}`,
    );
    res.end();
  }
  logger.info(`City retrieved : ${JSON.stringify(findCity)}`);
  res.status(200).json(findCity);
});

server.get("/cities/:zipCode/weather", (req, res) => {
  isValidMethod(req, res, "GET");

  let findCity = cities.find((city) => city.zipCode === req.params.zipCode);

  if (!findCity) {
    res.status(404).json({ error: "City not found" });
    logger.error(
      `ERROR : City not found ${JSON.stringify(req.params.zipCode)}`,
    );
    res.end();
  }

  let findWeatherReports = weather.filter(
    (item) => item.zipCode === req.params.zipCode,
  );

  if (findWeatherReports.length <= 0) {
    res.status(404).json({ error: "No weather data found" });
    logger.error(`ERROR : No weather data found `);
    res.end();
  }

  // Calcule du score sur tous les rapport de la ville pour "pluie"|"beau"|"neige"
  let score: number[] = [0, 0, 0];

  const weathers = ["pluie", "beau", "neige"];

  for (let i = 0; i < findWeatherReports.length; i++) {
    if (findWeatherReports[i].weather === "pluie") {
      score[0]++;
    } else if (findWeatherReports[i].weather === "beau") {
      score[1]++;
    } else if (findWeatherReports[i].weather === "neige") {
      score[2]++;
    }
  }

  const indexMaxScore = score.findIndex(
    (i) => i === score.reduce((m, n) => Math.max(m, n)),
  );

  res.status(200).json({
    zipCode: req.params.zipCode,
    cityName: findCity?.name,
    weather: weathers[indexMaxScore],
  });
  logger.info(
    `Every Weather Report for a city : ${JSON.stringify(req.params.zipCode, findCity.name, weathers[indexMaxScore])}`,
  );
});

server.post("/cities/:zipCode/weather", (req, res) => {
  isValidMethod(req, res, "POST");

  let findCity = cities.find((city) => city.zipCode === req.params.zipCode);

  if (!findCity) {
    res.status(404).json({ error: "City not found" });
    logger.error(
      `ERROR : City not found ${JSON.stringify(req.params.zipCode)}`,
    );
    res.end();
  }

  const body = req.body;

  if (
    body?.zipCode &&
    typeof body?.zipCode === "string" &&
    body?.weather &&
    typeof body?.weather === "string"
  ) {
    weather.push({
      ...body,
      id: weather.length,
    });
    res.status(201).json({
      id: weather.length - 1,
    });
    logger.info(`New weather report added : ${JSON.stringify(body)}`);
    res.end();
  } else {
    res.status(400).json({ error: "Invalid request body" });
    logger.error(`ERROR : Invalid request body ${JSON.stringify(req.body)}`);
    res.end();
  }
});

server.get("/cities/:zipCode/weather/:weatherId", (req, res) => {
  isValidMethod(req, res, "GET");

  let findCity = cities.find((city) => city.zipCode === req.params.zipCode);

  if (!findCity) {
    res.status(404).json({ error: "City not found" });
    logger.error(
      `ERROR : City not found ${JSON.stringify(req.params.zipCode)}`,
    );
    res.end();
  }

  let findWeather = weather.find(
    (weather) => weather.id === Number(req.params.weatherId),
  );

  if (!findWeather) {
    res.status(404).json({ error: "Weather not found" });
    logger.error(
      `ERROR : Weather not found ${JSON.stringify(req.params.weatherId)}`,
    );
    res.end();
  }
  logger.info(`1 Weather Report for a city : ${JSON.stringify(findWeather)}`);
  res.status(200).json(findWeather);
  res.end();
});

server.get("/weather/:weatherId", (req, res) => {
  isValidMethod(req, res, "GET");

  let findWeather = weather.find(
    (weather) => weather.id === Number(req.params.weatherId),
  );

  if (!findWeather) {
    res.status(404).json({ error: "Weather not found" });
    logger.error(
      `ERROR : Weather not found ${JSON.stringify(req.params.weatherId)}`,
    );
    res.end();
  }
  logger.info(`1 Weather Report for a city : ${JSON.stringify(findWeather)}`);
  res.status(200).json(findWeather);
  res.end();
});

server.get("/weather", (req, res) => {
  const weatherResult = weather;

  for (let i = 0; i < weatherResult.length; i++) {
    let findCity = cities.find(
      (city) => city.zipCode === weatherResult[i].zipCode,
    );
    weatherResult[i]["townName"] = findCity?.name;
  }
  logger.info(
    `Returns every weather for every city ${JSON.stringify(weather)}`,
  );
  res.status(200).json(weather);
});

server.post("/cities", (req, res) => {
  isValidMethod(req, res, "POST");

  const body = req.body;

  if (
    body?.zipCode &&
    typeof body?.zipCode === "string" &&
    body?.name &&
    typeof body?.name === "string"
  ) {
    cities.push(body);
    res.status(201).json(body);
    logger.info(`New city added : ${JSON.stringify(body)}`);
    res.end();
  } else {
    res.status(400).json({ error: "Invalid request body" });
    logger.error(`ERROR : Invalid request body ${JSON.stringify(body)}`);
    res.end();
  }
});

server.delete("/cities/:zipCode", (req, res) => {
  const index = cities.findIndex((t) => t.zipCode === req.params.zipCode);

  isValidMethod(req, res, "DELETE");

  if (index !== -1) {
    cities.splice(index, 1);

    if (cities.length === 0) {
      res.status(204);
      res.end();
    }

    res.status(200).send({
      status: "success",
    });
    logger.info(
      `deleted city : ${JSON.stringify({ zipCode: req.params.zipCode, name: cities.name })}`,
    );
  } else {
    res.status(404).send({ error: "City not found" });
    logger.error(
      `ERROR : City not found ${JSON.stringify(req.params.zipCode)}`,
    );
  }
});

server.delete("/weather/:id", (req, res) => {
  const index = weather.findIndex((t) => t.id === parseInt(req.params.id));

  isValidMethod(req, res, "DELETE");

  if (index !== -1) {
    weather.splice(index, 1);

    if (weather.length === 0) {
      res.status(204);
      res.end();
    }

    res.status(200).send({
      status: "success",
    });
    logger.info(`weather report deleted: ${JSON.stringify(weather)}`);
  } else {
    res.status(404).send({ error: "Weather not found" });
    logger.error(`ERROR : Weather not found ${JSON.stringify(req.params.id)}`);
  }
});

server.put("/cities/:zipCode", (req, res) => {
  let findCity = cities.find((city) => city.zipCode === req.params.zipCode);
  const body = req.body;
  isValidMethod(req, res, "PUT");

  if (findCity) {
    if (body?.name && typeof body?.name === "string") {
      findCity = {
        zipCode: req.params.zipCode,
        name: req.body.name,
      };
      logger.info(`City edited: ${JSON.stringify(body)}`);
      res.status(201).json(findCity);
    } else {
      res
        .status(400)
        .send({ error: "Missing required fields or structure error" });
      logger.error(
        `ERROR : Missing required fields or structure error ${JSON.stringify(body)}`,
      );
      res.end();
      return;
    }
  } else {
    res.status(404).send({ error: "cities not found" });
    logger.error(
      `ERROR : City not found ${JSON.stringify(req.params.zipCode)}`,
    );
  }
});

server.listen(3000, () => {
  console.log(`Server running on port 3000`);
});

export { server };
