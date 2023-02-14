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
      expect(data).not.toBeNull()
      expect(["string", "number"].includes(typeof data.id)).toBeTruthy()
      expect(typeof data.title).toBe("string")
      expect(data.title.length > 0).toBeTruthy()
      expect(Array.isArray(data.files)).toBeTruthy()
      expect(data.files.length > 0).toBeTruthy()

      data.files.forEach((file) => {
        expect(["string", "number"].includes(typeof file.id)).toBeTruthy()
        expect(typeof file.name).toBe("string")
        expect(file.name!.length > 0).toBeTruthy()

        if (asyncSource) {
          const type = typeof file.asyncSource
          if (type === "object") {
            expect(file.asyncSource).toHaveProperty("sourceId")
          } else {
            expect(type).toBe("string")
          }
        } else {
          expect(Array.isArray(file.urls)).toBeTruthy()
          expect(file.urls!.length > 0).toBeTruthy()
          file.urls!.forEach((urlInfo) => {
            expect(typeof urlInfo.url).toBe("string")
            if (extractors && urlInfo.extractor) {
              expect(urlInfo.extractor).toBeDefined()
              expect(extractors.includes(urlInfo.extractor!.type)).toBeTruthy()
            }
            if (quality) {
              expect(urlInfo.quality).toBeGreaterThan(0)
            }
            if (audio) {
              expect(typeof urlInfo.audio).toBe("string")
              expect(urlInfo.audio!.length > 0).toBeTruthy()
            }
            if (hls) {
              expect(typeof urlInfo.hls).toBe("boolean")
            }
          })
        }

        if (path) {
          expect(file.path).not.toBeNull()
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
  // test("anidub", createTest({
  //   provider: "anidub",
  //   id: "https%3A%2F%2Fanime.anidub.life%2Fanime%2Ffull%2F11115-dorohedoro-dorohedoro-anons.html",
  //   extractors: ['anidub', 'sibnetmp4']
  // }))
  test("animedia", createTest({
    provider: "animedia",
    id: "dorohedoro"
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
  // test("eneyida", createTest({
  //   provider: "eneyida",
  //   id: "https%3A%2F%2Feneyida.tv%2F2319-zoryana-brama-sg-1.html",
  //   path: true,
  // }))
  describe("uaserials", () => {
    test("tv show", createTest({
      provider: "uaserials",
      id: "196-zoryana-brama-sezon-1",
      path: true,
      extractors: ["m3u8proxy"],
      hls: true,
    }))
    test("movie", createTest({
      provider: "uaserials",
      id: "6573-nastupni-365-dniv",
      extractors: ["m3u8proxy"],
      hls: true,
    }))
  })
  describe("anitubeua", () => {
    test("page v1", createTest({
      provider: "anitubeua",
      id: "3948-spy-x-family",
      audio: true,
    }))
    test("page v2", createTest({
      provider: "anitubeua",
      id: "1866-legenda-pro-korru-2",
      audio: false,
      extractors: ["tortuga", "ashdi"],
    }))
  })
  // describe("videocdn", () => {
  //   test("movie", createTest({
  //     provider: "videocdn",
  //     id: "movies_32426",
  //     quality: true,
  //   }), 30000)
  //   test("tv show", createTest({
  //     provider: "videocdn",
  //     id: "tv-series_4946",
  //     quality: true,
  //     audio: true,
  //   }), 30000)
  // })
  describe("kinogo", () => {
    test("movie", createTest({
      provider: "kinogo",
      id: "11361-venom_2018___22-01",
      hls: true
    }))
    test("tv show", createTest({
      provider: "kinogo",
      id: "17293-project-blue-book_1-2-sezon",
      hls: true
    }))
  })
  describe("uakinoclub", () => {
    test("movie", createTest({
      provider: "uakinoclub",
      id: "https%3A%2F%2Fuakino.club%2Ffilmy%2Fgenre-action%2F15719-enola-golms-2.html",
    }))
    test("tv show", createTest({
      provider: "uakinoclub",
      id: "https%3A%2F%2Fuakino.club%2Fanimeukr%2Fanime-series%2F15231-kberpank-t-scho-bzhat-po-krayu-1-sezon.html",
      hls: true
    }))
  })

  describe("uafilmtv", () => {
    test("movie", createTest({
      provider: "uafilmtv",
      id: "https%3A%2F%2Fuafilm.tv%2F11943-%25D0%25B1%25D0%25B0%25D0%25B7%25D0%25B7-%25D1%2580%25D1%258F%25D1%2582%25D1%2596%25D0%25B2%25D0%25BD%25D0%25B8%25D0%25BA.html",
    }))
    test("tv show", createTest({
      provider: "uafilmtv",
      id: "4514-druz",
    }))
  })
})
