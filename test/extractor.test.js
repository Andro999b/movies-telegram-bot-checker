const axios = require("axios")
const { expect } = require("chai")
const { baseUrl } = require("./constants")

const baseApiUrl = `${baseUrl}/api/extract`

const testParameters = [
    {
        type: "sibnetmp4",
        url: "https://video.sibnet.ru/shell.php?videoid=3853084",
        locationTest: [{
            regexp: /.*\.mp4.*/,
            shouldMath: true
        }]
    },
    {
        type: "ashdi",
        url: "https://ashdi.vip/vod/62469",
        locationTest: [{
            regexp: /.*\.m3u8/,
            shouldMath: true
        }]
    },
    {
        type: "anigit",
        url: "",
        params: {
            thash: '63514a5821d395f177ea95b9b0e29380',
            tid: '77025',
            ttype: 'video'
        },
        locationTest: [{
            regexp: /.*\.m3u8/,
            shouldMath: true
        }]
    },
    {
        type: "anigit",
        url: "https://kodik.biz/video/59004/302a1cf84c1a57de140328a89052df96/720p",
        locationTest: [{
            regexp: /.*\.m3u8/,
            shouldMath: true
        }]
    },
    {
        type: "anigit",
        url: "1",
        params: {
            "season": "1",
            "thash": "20efcb3cd42984ab0e54bae268fb3a07",
            "tid": "42068",
            "ttype": "serial"
        },
        locationTest: [{
            regexp: /.*\.m3u8/,
            shouldMath: true
        }]
    },
    {
        type: "anidub",
        url: "/player/index.php?vid=/s1/11038/1/1.mp4&url=/anime_ova/11168-udivitelnyy-mir-el-hazard-ova-1-el-hazard-the-magnificent-world.html&ses=ff&id=-1"
    },
    {
        type: "tortuga",
        url: "https://tortuga.wtf/vod/79962",
        locationTest: [{
            regexp: /.*\.m3u8/,
            shouldMath: true
        }]
    }
]

describe("ExtractAPI", () => {
    testParameters.forEach(({ type, url, locationTest, params }) => {
        it(`Extractor ${type} should works for ${url}`, async () => {
            let targetUrl = `${baseApiUrl}?type=${type}&url=${encodeURIComponent(url)}`

            if (params) {
                targetUrl += "&" + Object.keys(params).map(key => targetUrl = key + '=' + params[key]).join('&')
            }

            console.log("Traget URL: ", targetUrl)
            const res = await axios.get(
                targetUrl,
                {
                    maxRedirects: 0,
                    validateStatus: (status) => status == 302 || status == 200,
                    headers: {
                        origin: "localhost:3000"
                    }
                }
            )

            if (locationTest) {
                const location = res.headers['location']

                expect(location).to.be.not.null

                console.log("Location: " + location)

                if (locationTest) {
                    locationTest.forEach(({ regexp, shouldMath }) => {
                        if (shouldMath)
                            expect(location).to.match(regexp)
                        else
                            expect(location).to.not.match(regexp)
                    })
                }
            }
        })
    })
})