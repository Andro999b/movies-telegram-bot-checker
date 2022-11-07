import axios from "axios"
import { describe, test, expect } from "@jest/globals"
import { File } from "../types/playlist"
import { baseUrl } from "./constants"

const baseApiUrl = `${baseUrl}/api/trackers`

interface TestParameters {
  provider: string
  itemId: string
  sourceId: string
  quality: boolean
}

const createTest = ({ provider, itemId, sourceId, quality }: TestParameters) => async () => {
  const res = await axios.get(`${baseApiUrl}/${provider}/items/${itemId}/source/${sourceId}`, {
    headers: {
      origin: "localhost:3000"
    }
  })

  const { status } = res
  const data: File = res.data

  expect(status).toBe(200)
  expect(data).toBeDefined
  expect(Array.isArray(data.urls)).toBeTruthy
  expect(data.urls!.length > 0).toBeTruthy

  data.urls!.forEach((urlInfo) => {
    expect(typeof urlInfo.url).toBe("string")
    if (quality) {
      expect(urlInfo.quality).toBeGreaterThan(0)
    }
  })
}

describe("SourceAPI", () => {
  test("animevost", createTest({
    provider: "animevost",
    itemId: "https%253A%252F%252Fanimevost.org%252Ftip%252Ftv%252F2424-no-guns-life-2nd-season.html",
    sourceId: "2147415892",
    quality: true
  }))
})