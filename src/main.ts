import express from 'express';
import { cities, weather } from './storage';

const server = express();

server.use(express.json());

function isValidMethod(req: express.Request, res: express.Response, method: string) {
  if(req.method !== method){
    res.status(405).json({ error: 'Method not allowed' });
    res.end()
  }
}

server.get('/cities', (req, res) => {
  isValidMethod(req, res, 'GET');

  res.json(cities);
});

server.get('/cities/:zipCode', (req, res) => {
  isValidMethod(req, res, 'GET');

  let findCity = cities.find(city => city.zipCode === req.params.zipCode);

  if(!findCity){
    res.status(404).json({ error: 'City not found' });
    res.end();
  }

  res.status(200).json(findCity);
});


server.listen(3000, () => {
  console.log(`Server running on port 3000`);
});

export { server };
