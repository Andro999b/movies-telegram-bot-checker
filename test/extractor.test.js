const axios = require("axios")
const { expect } = require("chai")

const baseApiUrl = "https://mcw4r3l663.execute-api.eu-central-1.amazonaws.com/prod/api/extract"

const testParameters = [
    {
        type: "animevost",
        url: "https://play.roomfish.ru/2147406642"
    },
    {
        type: "sibnetmp4",
        url: "https://video.sibnet.ru/shell.php?videoid=3580403"
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