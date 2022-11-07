import axios from "axios"
import { describe, test, expect } from "@jest/globals"
import { baseUrl } from "./constants"
import { Playlist } from "../types/playlist"

const baseApiUrl = `${baseUrl}/api/trackers`

interface TestParameters {
  provider: string
  id: string
  asyncSource?: boolean
  path?: boolean
  extractors?: string[]
  hls?: boolean
  quality?: boolean
  audio?: boolean
}

const createTest =
  ({ provider, id, asyncSource, path, extractors, hls, quality, audio }: TestParameters) =>
    async () => {
      const url = `${baseApiUrl}/${provider}/items/${id}?nocache=true`

      console.log(url)
      const res = await axios.get(url, {
        headers: {
          origin: "localhost:3000",
        },
      })

      const { status } = res
      const data: Playlist = res.data

      expect(status).toBe(200)
      expect(data).not.toBeNull
      expect(data.id).not.toBeNull
      expect(data.title).not.toBeNull
      expect(data.image).not.toBeNull
      expect(data.files).not.toBeNull

      data.files.forEach((file) => {
        expect(file.id).not.toBeNull
        expect(file.name).not.toBeNull

        if (asyncSource) {
          expect(file.asyncSource).not.toBeNull
        } else {
          expect(file.urls).not.toBeNull
          file.urls?.forEach((urlInfo) => {
            expect(urlInfo.url).not.toBeNull
            if (extractors && urlInfo.extractor) {
              expect(urlInfo.extractor).not.toBeNull
              // expect(urlInfo.extractor.type).toBe.oneOf(extractors)
            }
            if (quality) {
              expect(urlInfo.quality).not.toBeNull
            }
            if (audio) {
              expect(urlInfo.audio).not.toBeNull
            }
            if (hls) {
              expect(urlInfo.hls).toBeTruthy
            }
          })
        }

        if (path) {
          expect(file.path).not.toBeNull
        }
      })
    }

describe("InfoAPI", () => {
  describe("anigato", () => {
    test("single file with multiple audio", createTest({
      provider: "anigato",
      id: "https%3A%2F%2Fanigato.ru%2Fanime_ova%2F1794-vanpanchmen-ova.html",
      hls: true,
      audio: true,
    }))
    test("multiple file with multiple audio", createTest({
      provider: "anigato",
      id: "https%3A%2F%2Fanigato.ru%2Fanime%2F8763-semja-shpiona-tv-1.html",
      hls: true,
      audio: true,
    }))
    test("single file with single audio", createTest({
      provider: "anigato",
      id: "https%3A%2F%2Fanigato.ru%2Fanime_ova%2F5556-van-pis-piratskie-koroli-bejsbola.html",
      hls: true,
    }))
  })
  test("animevost", createTest({
    provider: "animevost",
    id: "https%3A%2F%2Fanimevost.org%2Ftip%2Ftv%2F2281-dr-stone.html",
    asyncSource: true,
  }))
  test("anidub", createTest({
    provider: "anidub",
    id: "https%3A%2F%2Fanime.anidub.life%2Fanime%2Ffull%2F11115-dorohedoro-dorohedoro-anons.html",
    hls: true
  }))
  test("animedia", createTest({
    provider: "animedia",
    id: "%2Fanime%2Fdorohedoro",
    hls: true
  }))
  test("animedia", createTest({
    provider: "seasonvar",
    id: "%2Fserial-24137-Grand_Tur-4-sezon.html",
  }))
  describe("kinovod", () => {
    test("movie", createTest({
      provider: "kinovod",
      id: "%2Ffilm%2F2164-gorod-grehov",
      quality: true,
    }))
    test("tv show", createTest({
      provider: "kinovod",
      id: "%2Ftv_show%2F7357-grand-tur",
      path: true,
      quality: true,
    }))
  })
  test("eneyida", createTest({
    provider: "eneyida",
    id: "https%3A%2F%2Feneyida.tv%2F2319-zoryana-brama-sg-1.html",
    path: true,
  }))
  describe("uaserials", () => {
    test("tv show", createTest({
      provider: "uaserials",
      id: "https%3A%2F%2Fuaserials.pro%2F196-zoryana-brama-sezon-1.html",
      path: true,
      extractors: ["tortuga"],
      hls: true,
    }))
    test("movie", createTest({
      provider: "uaserials",
      id: "https%3A%2F%2Fuaserials.pro%2F6573-nastupni-365-dniv.html",
      extractors: ["tortuga"],
      hls: true,
    }))
  })
  describe("anitubeua", () => {
    test("page v1", createTest({
      provider: "anitubeua",
      id: "https%3A%2F%2Fanitube.in.ua%2F3948-spy-x-family.html",
      audio: true,
    }))
    test("page v2", createTest({
      provider: "anitubeua",
      id: "https%3A%2F%2Fanitube.in.ua%2F1866-legenda-pro-korru-2.html",
      audio: false,
      extractors: ["tortuga", "ashdi"],
    }))
  })
  describe("videocdn", () => {
    test("movie", createTest({
      provider: "videocdn",
      id: "animes_143",
      quality: true,
    }), 30000)
    test("tv show", createTest({
      provider: "videocdn",
      id: "tv-series_4946",
      quality: true,
      audio: true,
    }), 30000)
  })
  describe("kinogo", () => {
    test("movie", createTest({
      provider: "kinogo",
      id: "https%3A%2F%2Fkinogo.la%2F11361-venom_2018___22-01.html",
      hls: true
    }))
    test("tv show", createTest({
      provider: "kinogo",
      id: "https%3A%2F%2Fkinogo.la%2F17293-project-blue-book_1-2-sezon.html",
      hls: true
    }))
  })
})
