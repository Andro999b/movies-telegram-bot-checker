import axios from "axios"
import { describe, it, expect } from '@jest/globals'
import { baseUrl } from "./constants"
import { SearchResult } from "../types/search"

const baseApiUrl = `${baseUrl}/api/trackers`

interface TestParameters {
  provider: string
  query: string
}

const createTest = ({ provider, query }: TestParameters) => async () => {
  console.log(`${baseApiUrl}/${provider}/search?q=${encodeURIComponent(query)}`)

  const res = await axios.get(
    `${baseApiUrl}/${provider}/search?q=${encodeURIComponent(query)}`,
    {
      timeout: 15000,
      headers: {
        origin: "localhost:3000"
      }
    }
  )
  const { status } = res
  const data: SearchResult[] = res.data

  expect(status).toBe(200)
  expect(data).toBeDefined()
  expect(Array.isArray(data)).toBeTruthy()
  expect(data.length > 0).toBeTruthy()

  data.forEach((result) => {
    expect(typeof result.provider).toBe("string")
    expect(typeof result.name).toBe("string")
    expect(typeof result.id).toBe("string")
  })
}

describe("SearchAPI", () => {
  test("anigato", createTest({
    provider: "anigato",
    query: "Выдающиеся звери"
  }), 15000)
  test("animevost", createTest({
    provider: "animevost",
    query: "Тетрадь смерти"
  }))
  // test("anidub", createTest({
  //   provider: "anidub",
  //   query: "Дорохедоро"
  // }))
  test("animedia", createTest({
    provider: "animedia",
    query: "Дорохедоро"
  }))
  test("seasonvar", createTest({
    provider: "seasonvar",
    query: "Во все тяжкие"
  }))
  test("kinogo", createTest({
    provider: "kinogo",
    query: "Терминатор"
  }))
  test("videocdn", createTest({
    provider: "videocdn",
    query: "Терминатор"
  }), 20000)
  test("kinovod", createTest({
    provider: "kinovod",
    query: "веном"
  }))
  test("anitubeua", createTest({
    provider: "anitubeua",
    query: "шпигун"
  }), 20000)
  test("eneyida", createTest({
    provider: "eneyida",
    query: "Зоряна брама"
  }))
  test("uaserials", createTest({
    provider: "uaserials",
    query: "Зоряна брама"
  }))

  test("uakinoclub", createTest({
    provider: "uakinoclub",
    query: "Енола"
  }))

  test("uafilmtv", createTest({
    provider: "uafilmtv",
    query: "Енола"
  }))
})