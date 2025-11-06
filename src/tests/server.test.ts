import {describe, it, expect, beforeAll} from "vitest"
import app from "../server"
import request from 'supertest'

let serverTest: any

describe('TEST de Stormly', () => {

  beforeAll(async () => {
    serverTest = app
  });
  describe('TEST des endpoints', () => {
    it('GET /cities', async () => {
        const req = await request(serverTest)
        .get("/cities")
        .expect(200)
        .then(res => { expect(res.body).toEqual('') })
    })
  })

})