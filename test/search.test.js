const axios = require("axios")
const { expect } = require("chai")

const baseApiUrl = "https://ng9vbpj84c.execute-api.eu-north-1.amazonaws.com/prod/api/trackers"

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
    }
    // {
    //     provider: "rezka",
    //     query: "Терминатор"
    // },
    // {
    //     provider: "rezka",
    //     query: "Во все тяжкие"
    // }
]

describe("SearchAPI", () => {
    testParameters.forEach(({ provider, query, timeout }) => {
        it(`Provider ${provider} should return results by search query '${query}'`, async () => {
            console.log(`${baseApiUrl}/${provider}/search?q=${encodeURIComponent(query)}`)
            
            const res =  await axios.get(
                `${baseApiUrl}/${provider}/search?q=${encodeURIComponent(query)}`, 
                { timeout: timeout || 5000}
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