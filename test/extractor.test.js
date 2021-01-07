const axios = require("axios")
const { expect } = require("chai")

const baseApiUrl = "https://mcw4r3l663.execute-api.eu-central-1.amazonaws.com/prod/api/extract"

const testParameters = [
    {
        type: "sibnetmp4",
        url: "https://video.sibnet.ru/shell.php?videoid=3580403"
    },
    {
        type: "anigit",
        url: "https://aniqit.com/serial/24057/3002e903007e30473cb85755964eea48/720p?season=1&only_episode=true&episode=100&translations=false"
    }
]

describe("ExtractAPI", () => {
    testParameters.forEach(({ type, url }) => {
        it(`Extractor ${type} should works for ${url}`, async () => {
            const res = await axios.get(`${baseApiUrl}?type=${type}&url=${encodeURIComponent(url)}`, { 
                maxRedirects: 0,
                validateStatus: (status) => status == 302
            })

            const location = res.headers['location']

            expect(location).to.be.not.null
        })
    })
})