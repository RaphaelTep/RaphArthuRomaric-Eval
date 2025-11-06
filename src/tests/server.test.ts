import {describe, it, expect, beforeAll} from "vitest"
import app from "../server"
import request from 'supertest'

let serverTest: any
let zipCode: string = '25000'

describe('TEST de Stormly', () => {

  beforeAll(async () => {
    serverTest = app
  });
  describe('TEST des endpoints', () => {
    it('GET /cities', async () => {
        const req = await request(serverTest)
        .get("/cities")
        .expect(200)
        .then(res => { expect(res.body[0]).toEqual({ name: 'Besançon', zipCode: '25000' }) })
    })
    it('GET cities by zipCode /cities/:zipCode', async () => {
        const req = await request(serverTest)
        .get(`/cities/${zipCode}`)
        .expect(200)
        .then(res => { expect(res.body).toEqual({ name: 'Besançon', zipCode: '25000' }) })
    })
    it('GET weather by zipCode /cities/:zipCode/weather', async () => {
        const req = await request(serverTest)
        .get(`/cities/${zipCode}/weather`)
        .expect(200)
        .then(res => { expect(res.body).toEqual({
          zipCode: '25000',
	        name: 'Besançon',
          weather: "neige"
        })})
    })
  })

})