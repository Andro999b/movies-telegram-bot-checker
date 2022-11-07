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
  expect(data).not.toBeNull

  data.forEach((result) => {
    expect(result.provider).toBe(provider)
    expect(result.name).not.toBe
    expect(result.id).not.toBe
  })
}

describe("SearchAPI", () => {
  test("anigato", createTest({
    provider: "anigato",
    query: "Выдающиеся звери"
  }))
  test("animevost", createTest({
    provider: "animevost",
    query: "Тетрадь смерти"
  }))  
  test("anidub", createTest({
    provider: "anidub",
    query: "Дорохедоро"
  }))
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
  test("kinovod", createTest({
    provider: "kinovod",
    query: "веном"
  }))
  test("anitubeua", createTest({
    provider: "anitubeua",
    query: "шпигун"
  }))
  test("eneyida", createTest({
    provider: "eneyida",
    query: "Зоряна брама"
  }))
  test("uaserials", createTest({
    provider: "uaserials",
    query: "Зоряна брама"
  }))
})