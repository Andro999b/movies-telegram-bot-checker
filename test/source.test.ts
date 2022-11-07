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

const testParameters = [
  {
    provider: "animevost",
    itemId: "https%253A%252F%252Fanimevost.org%252Ftip%252Ftv%252F2424-no-guns-life-2nd-season.html",
    sourceId: "2147415892",
    quality: true
  }
]

const createTest = ({ provider, itemId, sourceId, quality }: TestParameters) => async () => {
  const res = await axios.get(`${baseApiUrl}/${provider}/items/${itemId}/source/${sourceId}`, {
    headers: {
      origin: "localhost:3000"
    }
  })

  const { status } = res
  const data: File = res.data

  expect(status).toBe(200)
  expect(data).not.toBe
  expect(data.urls).not.toBeNull

  data.urls!.forEach((urlInfo) => {
    expect(urlInfo.url).not.toBeNull
    if (quality) {
      expect(urlInfo.quality).not.toBeNull
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