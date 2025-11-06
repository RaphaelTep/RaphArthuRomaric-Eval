import { server } from "./main";
import { cities, weather } from "./storage";

server.get('/cities', (req, res) => {
  res.json(cities);
});
