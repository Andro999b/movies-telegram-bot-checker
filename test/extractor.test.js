const axios = require("axios")
const { expect } = require("chai")

const baseApiUrl = "https://mcw4r3l663.execute-api.eu-central-1.amazonaws.com/prod/api/extract"

const testParameters = [
    {
        type: "sibnetmp4",
        url: "https://video.sibnet.ru/shell.php?videoid=3853084"
    },
    {
        type: "anigit",
        url: "https://aniqit.com/serial/33972/20f7e906f7369529b9eee44bea18bdb4/720p?only_season=true",
        locationTest: [{
            regexp: /Sentinel\.mp4/,
            shouldMath: false
        }]
    }
]

describe("ExtractAPI", () => {
    testParameters.forEach(({ type, url, locationTest }) => {
        it(`Extractor ${type} should works for ${url}`, async () => {
            const res = await axios.get(`${baseApiUrl}?type=${type}&url=${encodeURIComponent(url)}`, { 
                maxRedirects: 0,
                validateStatus: (status) => status == 302
            })

            const location = res.headers['location']

            expect(location).to.be.not.null

            console.log(location)

            if(locationTest) {
                locationTest.forEach(({ regexp, shouldMath }) => {
                    if(shouldMath)
                        expect(location).to.match(regexp)
                    else
                        expect(location).to.not.match(regexp)
                })
            }
        })
    })
})