const axios = require("axios")
const { expect } = require("chai")

const baseApiUrl = "https://mcw4r3l663.execute-api.eu-central-1.amazonaws.com/prod/api/extract"

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
        url: "//aniqit.com/video/58648/1247aab35781f3abdaa2790488175dbd/720p",
        locationTest: [{
            regexp: /Sentinel\.mp4/,
            shouldMath: false
        }]
    },
    {
        type: "anigit",
        url: "//aniqit.com/serial/42082/bffa908f73b10136f7faf121cb852577/720p",
        params: {
            hash: "f3e70a0b6da0f7a40e2b2bcfc16c2a01",
            id: "985884"
        },
        locationTest: [{
            regexp: /Sentinel\.mp4/,
            shouldMath: false
        }]
    }
]

describe("ExtractAPI", () => {
    testParameters.forEach(({ type, url, locationTest, params }) => {
        it(`Extractor ${type} should works for ${url}`, async () => {
            let targetUrl = `${baseApiUrl}?type=${type}&url=${encodeURIComponent(url)}`

            if(params) {
                targetUrl += Object.keys(params).map(key => targetUrl = key + '=' + params[key]).join('&')
            }

            console.log("Traget URL: ", targetUrl)
            const res = await axios.get(
                targetUrl,
                {
                    maxRedirects: 0,
                    validateStatus: (status) => status == 302
                }
            )

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
        })
    })
})