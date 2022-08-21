const axios = require("axios")
const { expect } = require("chai")
const { baseUrl } = require("./constants")

const baseApiUrl = `${baseUrl}/api/trackers`

const testParameters = [
    {
        provider: "anigato",
        query: "Выдающиеся звери"
    },   
    {
        provider: "animevost",
        query: "Тетрадь смерти"
    },
    {
        provider: "anidub",
        query: "Дорохедоро"
    },
    {
        provider: "animedia",
        query: "Дорохедоро"
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
        provider: "kinovod",
        query: "веном"
    },
    {
        provider: "anitubeua",
        query: "шпигун"
    },
    {
        provider: "eneyida",
        query: "Зоряна брама"
    },
    // {
    //     provider: "uafilmtv",
    //     query: "Зоряна брама"
    // },
    {
        provider: "uaserials",
        query: "Зоряна брама"
    }
]

describe("SearchAPI", () => {
    testParameters.forEach(({ provider, query, timeout }) => {
        it(`Provider ${provider} should return results by search query '${query}'`, async () => {
            console.log(`${baseApiUrl}/${provider}/search?q=${encodeURIComponent(query)}`)
            
            const res =  await axios.get(
                `${baseApiUrl}/${provider}/search?q=${encodeURIComponent(query)}`, 
                { 
                    timeout: timeout || 5000,
                    headers: {
                        origin: "localhost:3000"
                    }
                }
            )
            const { data, status } = res

            expect(status, `Server respond status: ${status}`).to.equal(200)
            expect(data, `Empty response`).to.be.not.empty
            
            data.forEach((result) => {
                expect(result.provider, "Missing correct provider value in result").to.be.equal(provider)
                expect(result.name, `Empty name`).to.be.not.empty
                expect(result.id, `Missing id`).to.be.not.null
            })
        }).timeout(timeout + 500)
    })
})