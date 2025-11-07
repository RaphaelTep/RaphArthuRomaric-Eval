import { describe, it, expect, beforeAll } from "vitest"
import { server } from "../main"
import request from 'supertest'

let serverTest: any
const zipCode: string = '21000'
const id: number = 1
const wrongZipCode: string = '09'
const id: number = 1
const wrongId: number = -99
const newWeather: [] = []
const newCity: [] = []
const updateCity: [] = []
const wrongNewCity: {} = [ { name: "Coda town", zipCode: " " } ]
const wrongNewWeather: {} = [ { zipCode: " ", weather: " ", id: 9999999 } ]
const wrongUpdateCity: {} = [ { name: " ", zipCode: "21000" } ]


describe('TEST de Stormly', () => {

  beforeAll(async () => {
    serverTest = server
  });

  describe('TEST success des endpoints', () => {
    it('GET /cities', async () => {
        const req = await request(serverTest)
        .get("/cities")
        .expect(200)
        .then(res => { expect(res.body[0]).toEqual({ name: 'Dijon', zipCode: '21000' }) })
    })
    it('GET cities by zipCode /cities/:zipCode', async () => {
        const req = await request(serverTest)
        .get(`/cities/${zipCode}`)
        .expect(200)
        .then(res => { expect(res.body).toEqual({ name: 'Dijon', zipCode: '21000' }) })
    })
    it('GET /weather', async () => {
        const req = await request(serverTest)
        .get("/weather")
        .expect(200)
        .then(res => { expect(res.body[0]).toEqual({
          id: 1,
          zipCode: "21000",
          townName: "Dijon",
          weather: "neige"
        }) })
    })
    it('GET weather report by id /weather/:id', async () => {
        const req = await request(serverTest)
        .get(`/weather/${id}`)
        .expect(200)
        .then(res => { expect(res.body).toEqual({
          id: 1,
          zipCode: "21000",
          townName: "Dijon",
          weather: "neige"
        }) })
    })
    it('GET cities weather by zipCode /cities/:zipCode/weather', async () => {
        const req = await request(serverTest)
        .get(`/cities/${zipCode}/weather`)
        .expect(200)
        .then(res => { expect(res.body).toEqual({
          id: 1,
          zipCode: '21000',
	        townName: 'Dijon',
          weather: "neige"
        }) })
    })
    it('GET weather report by id /cities/:zipCode/weather/:id', async () => {
        const req = await request(serverTest)
        .get(`/cities/${zipCode}/weather/${id}`)
        .expect(200)
        .then(res => { expect(res.body).toEqual({
          id: 1,
          zipCode: '21000',
	        townName: 'Dijon',
          weather: "neige"
        }) })
    })
    it('PUT city by zipCode /cities/:zipCode', async () => {
      const req = await request(serverTest)
      .post(`/cities/${zipCode}`)
      .send(updateCity)
      .expect(201)
      .then(res => { expect(res.body).toEqual({ zipCode: "21000", name: "Dijon" }) })
    })
    it('DELETE cities by zipCode /cities/:zipCode', async () => {
      const req = await request(serverTest)
      .get(`/cities/${zipCode}`)
      .expect(200)
    })
    it('DELETE weather by id /weather/:id', async () => {
      const req = await request(serverTest)
      .get(`/weather/${id}`)
      .expect(200)
    })
  })
  describe('TEST failed des endpoints', () => {
    it('GET cities by wrongZipCode /cities/:zipCode', async () => {
      const req = await request(serverTest)
      .get(`/cities/${wrongZipCode}`)
      .expect(404)
      .then(res => { expect(res).toEqual({ error: 'City not found' }) })
    })
    it('GET weather report by wrongId /weather/:id', async () => {
      const req = await request(serverTest)
      .get(`/weather/${wrongId}`)
      .expect(404)
      .then(res => { expect(res).toEqual({ error: 'Weather not found' }) })
    })
    it('GET cities weather by wrongZipCode /cities/:zipCode/weather', async () => {
      const req = await request(serverTest)
      .get(`/cities/${wrongZipCode}/weather`)
      .expect(404)
      .then(res => { expect(res).toEqual({ error: 'City not found' }) })
    })
    it('GET cities weather by zipCode with 0 data found /cities/:zipCode/weather', async () => {
      const req = await request(serverTest)
      .get(`/cities/${zipCode}/weather`)
      .expect(404)
      .then(res => { expect(res).toEqual({ error: "No weather data found" }) })
    })
    it('GET weather report by wrongZipCode /cities/:zipCode/weather/:id', async () => {
      const req = await request(serverTest)
      .get(`/cities/${wrongZipCode}/weather/${id}`)
      .expect(404)
      .then(res => { expect(res.body).toEqual({ error: "City not found" }) })})
    it('GET weather report by wrongId /cities/:zipCode/weather/:id', async () => {
      const req = await request(serverTest)
      .get(`/cities/${zipCode}/weather/${wrongId}`)
      .expect(404)
      .then(res => { expect(res.body).toEqual({ error: "Weather not found" }) })})
    it('POST city /cities', async () => {
      const res = await request(serverTest)
      .post('/cities')
      .send(wrongNewCity)
      .expect(400)
      .then(res => { expect(res.body).toEqual( { error: "Invalid request body" }) })
    })
    it('POST weather report by wrongZipCode /cities/:zipCode/weather', async () => {
      const req = await request(serverTest)
      .post(`/cities/${wrongZipCode}/weather`)
      .send(newWeather)
      .expect(404)
      .then(res => { expect(res.body).toEqual({ error: "City not found" }) })})
    it('POST wrongNewWeather report by zipCode /cities/:zipCode/weather', async () => {
      const req = await request(serverTest)
      .post(`/cities/${zipCode}/weather`)
      .send(wrongNewWeather)
      .expect(400)
      .then(res => { expect(res).toEqual({ error: 'Invalid request body' }) })})
    it('PUT city by wrongZipCode /cities/:zipCode', async () => {
      const req = await request(serverTest)
      .post(`/cities/${wrongZipCode}`)
      .send(updateCity)
      .expect(404)
      .then(res => { expect(res).toEqual({ error: "cities not found" }) })
    })
    it('PUT wrongUpdateCity by zipCode /cities/:zipCode', async () => {
      const req = await request(serverTest)
      .post(`/cities/${zipCode}`)
      .send(wrongUpdateCity)
      .expect(400)
      .then(res => { expect(res).toEqual({ error: "Missing required fields or structure error" }) })
    })
    it('DELETE cities by wrongZipCode /cities/:zipCode', async () => {
      const req = await request(serverTest)
      .get(`/cities/${wrongZipCode}`)
      .expect(404)
    })
    it('DELETE weather by wrongId /weather/:id', async () => {
      const req = await request(serverTest)
      .get(`/weather/${wrongId}`)
      .expect(404)
    })
  })
})
