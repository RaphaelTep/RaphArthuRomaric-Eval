import express from "express";
import { cities, weather } from "./storage";

const server = express();

server.use(express.json());

function isValidMethod(
  req: express.Request,
  res: express.Response,
  method: string,
) {
  if (req.method !== method) {
    res.status(405).json({ error: "Method not allowed" });
    res.end();
  }
}

server.get("/cities", (req, res) => {
  isValidMethod(req, res, "GET");

  res.json(cities);
});

server.get("/cities/:zipCode", (req, res) => {
  isValidMethod(req, res, "GET");

  let findCity = cities.find((city) => city.zipCode === req.params.zipCode);

  if (!findCity) {
    res.status(404).json({ error: "City not found" });
    res.end();
  }

  res.status(200).json(findCity);
});

server.get("/cities/:zipCode/weather", (req, res) => {
  isValidMethod(req, res, "GET");

  let findCity = cities.find((city) => city.zipCode === req.params.zipCode);

  if (!findCity) {
    res.status(404).json({ error: "City not found" });
    res.end();
  }

  let findWeather = weather.find(
    (weather) => weather.zipCode === req.params.zipCode,
  );

  if (!findWeather) {
    res.status(404).json({ error: "No weather data found" });
    res.end();
  }

  res.status(200).json(findWeather);
});

server.get("/weather", (req, res) => {
  res.status(200).json(weather);
});

server.post('/cities', (req, res) => {
  isValidMethod(req, res, 'POST');

  const body = req.body;

  if(
    (body?.zipCode && typeof body?.zipCode === 'string') &&
    (body?.name && typeof body?.name === 'string')
  ){
    cities.push(body);
    res.status(201).json(body);
    res.end();
  } else {
    res.status(400).json({ error: 'Invalid request body' });
    res.end();
  }
});

server.delete("/cities/:zipCode", (req, res) => {
  const index = cities.findIndex(
    (t) => t.zipCode === req.params.zipCode,
  );

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
  } else {
    res.status(404).send({ error: "Contact not found" });
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
  } else {
    res.status(404).send({ error: "Contact not found" });
  }
});

server.listen(3000, () => {
  console.log(`Server running on port 3000`);
});

export { server };
