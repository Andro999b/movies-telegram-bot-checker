import axios from "axios"
import { describe, test, expect } from "@jest/globals"
import { baseUrl } from "./constants"

const baseApiUrl = `${baseUrl}/api/extract`

interface TestParameres {
  type: string
  url: string
  params?: Record<string, string>
  locationTest?: {
    regexp: RegExp
    shouldMath: boolean
  }[]
}

const createTest =
  ({ type, url, locationTest, params }: TestParameres) =>
    async () => {
      let targetUrl = `${baseApiUrl}?type=${type}&url=${encodeURIComponent(url)}`

      if (params) {
        targetUrl +=
          "&" +
          Object.keys(params)
            .map((key) => (targetUrl = key + "=" + params[key]))
            .join("&")
      }

      console.log("Traget URL: ", targetUrl)
      const res = await axios.get(targetUrl, {
        maxRedirects: 0,
        validateStatus: (status) => status == 302 || status == 200,
        headers: {
          origin: "localhost:3000",
        },
      })

      if (locationTest) {
        const location = res.headers["location"]

        expect(location).toBeDefined()
        expect(location).not.toBeNull()
        expect(location.length > 0).toBeTruthy()

        console.log("Location: " + location)

        if (locationTest) {
          locationTest.forEach(({ regexp, shouldMath }) => {
            if (shouldMath) expect(location).toMatch(regexp)
            else expect(location).not.toMatch(regexp)
          })
        }
      }
    }

describe("ExtractAPI", () => {
  test("sibnetmp4", createTest({
    type: "sibnetmp4",
    url: "https://video.sibnet.ru/shell.php?videoid=3853084",
    locationTest: [
      {
        regexp: /.*\.mp4.*/,
        shouldMath: true,
      },
    ],
  }))
  test("ashdi", createTest({
    type: "ashdi",
    url: "https://ashdi.vip/vod/62469",
    locationTest: [
      {
        regexp: /.*\.m3u8/,
        shouldMath: true,
      },
    ],
  }))

  describe("anigit", () => {
    test("movie", createTest({
      type: "anigit",
      url: "https://kodik.biz/video/59004/302a1cf84c1a57de140328a89052df96/720p",
      locationTest: [
        {
          regexp: /.*\.m3u8/,
          shouldMath: true,
        },
      ],
    }))
    test("serial episode", createTest({
      type: "anigit",
      url: "1",
      params: {
        season: "1",
        thash: "20efcb3cd42984ab0e54bae268fb3a07",
        tid: "42068",
        ttype: "serial",
      },
      locationTest: [
        {
          regexp: /.*\.m3u8/,
          shouldMath: true,
        },
      ],
    }))
  })
  test("anidub", createTest({
    type: "anidub",
    url: "/player/index.php?vid=/s1/11038/1/1.mp4&url=/anime_ova/11168-udivitelnyy-mir-el-hazard-ova-1-el-hazard-the-magnificent-world.html&ses=ff&id=-1",
  }))
  // test("tortuga", createTest({
  //   type: "tortuga",
  //   url: "https://tortuga.wtf/vod/79962",
  //   locationTest: [
  //     {
  //       regexp: /.*\.m3u8/,
  //       shouldMath: true,
  //     },
  //   ],
  // }))
})
