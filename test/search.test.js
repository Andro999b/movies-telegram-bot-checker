const axios = require("axios")
const { expect } = require("chai")

const baseApiUrl = "https://mcw4r3l663.execute-api.eu-central-1.amazonaws.com/prod/api/trackers"

const testParameters = [
    {
        provider: "nekomori",
        query: "Тетрадь смерти"
    },   
    {
        provider: "animevost",
        query: "Тетрадь смерти"
    },
    {
        provider: "seasonvar",
        query: "Во все тяжкие"
    },
    {
        provider: "kinogo",
        query: "Терминатор"
    },
    {
        provider: "videocdn",
        query: "Терминатор"
    },
    {
        provider: "kinovod",
        query: "Терминатор"
    },
    {
        provider: "7serealov",
        query: "Во все тяжкие"
    },
    {
        provider: "kinogo2",
        query: "Во все тяжкие"
    }
]

describe("SearchAPI", () => {
    testParameters.forEach(({ provider, query }) => {
        it(`Provider ${provider} should return results by search query '${query}'`, async () => {
            const res =  await axios.get(`${baseApiUrl}/${provider}/search?q=${encodeURIComponent(query)}`)
            const { data, status } = res

            expect(status, `Server respond status: ${status}`).to.equal(200)
            expect(data, `Empty response`).to.be.not.empty
            
            data.forEach((result) => {
                expect(result.provider, "Missing correct provider value in result").to.be.equal(provider)
                expect(result.name, `Empty name`).to.be.not.empty
                expect(result.id, `Missing id`).to.be.not.null
            })
        })
    })
})