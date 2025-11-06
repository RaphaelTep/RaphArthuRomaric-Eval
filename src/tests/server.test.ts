import { describe, it, expect, beforeAll } from "vitest"
import { server } from "../main"
import request from 'supertest'

let serverTest: any
const zipCode: string = '21000'
const id: number = 1

describe('TEST de Stormly', () => {

  beforeAll(async () => {
    serverTest = server
  });

  describe('TEST des endpoints', () => {
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
  })

})