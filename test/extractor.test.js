const axios = require("axios")
const { expect } = require("chai")

const baseApiUrl = "https://6gov3btrq2.execute-api.eu-central-1.amazonaws.com/dev/api/extract"

const testParameters = [
    {
        type: "animevost",
        url: "https://play.roomfish.ru/2147406642"
    },
    {
        type: "sibnetmp4",
        url: "https://video.sibnet.ru/shell.php?videoid=3580403"
    },
    {
        type: "anigit",
        url: "https://aniqit.com/serial/4898/d72ca532e8abcbd0d6b6ca56f9544341/720p?season=1&only_episode=true&episode=100&translations=false"
    },
    // {
    //     type: "stormo",
    //     url: "https://www.stormo.online/embed/593318/"
    // },
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