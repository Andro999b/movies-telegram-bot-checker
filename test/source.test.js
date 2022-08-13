const axios = require("axios")
const { expect } = require("chai")

const baseApiUrl = "https://ng9vbpj84c.execute-api.eu-north-1.amazonaws.com/prod/api/trackers"

const testParameters = [
    {
        provider: "animevost",
        itemId: "https%253A%252F%252Fanimevost.org%252Ftip%252Ftv%252F2424-no-guns-life-2nd-season.html",
        sourceId: "2147415892",
        quality: true
    }
]

describe("SourceAPI", () => {
    testParameters.forEach(({provider, itemId, sourceId, quality}) => {
        it(`Provider ${provider} shoudl return info for async source ${sourceId} of item ${itemId}`, async () => {
            const res = await axios.get(`${baseApiUrl}/${provider}/items/${itemId}/source/${sourceId}`)

            const { data, status } = res

            expect(status, `Server respond status: ${status}`).to.equal(200)
            expect(data, `Empty response`).to.be.not.null
            expect(data.urls, `Urls list not present`).to.be.not.empty

            data.urls.forEach((urlInfo) => {
                expect(urlInfo.url, `'url' is not present`).to.be.not.null
                if(quality) {
                    expect(urlInfo.quality, `'quality' is not present`).to.be.not.null
                }
            })
        })
    })
})