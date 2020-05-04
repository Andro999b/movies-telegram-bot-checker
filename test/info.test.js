const axios = require("axios")
const { expect } = require("chai")

const baseApiUrl = "https://6gov3btrq2.execute-api.eu-central-1.amazonaws.com/dev/api/trackers"

const testParameters = [
    {
        provider: "nekomori",
        id: "2685",
        path: true,
        extractors: [ "sibnetmp4" ]
    },
    {
        provider: "nekomori",
        id: "150",
        path: true,
        extractors: [ "sibnetmp4", "anigit" ]
    },    
    {
        provider: "nekomori",
        id: "13712",
        path: true,
        extractors: [ "sibnetmp4", "stormo" ]
    },
    {
        provider: "animevost",
        id: "https%3A%2F%2Fanimevost.org%2Ftip%2Ftv%2F2281-dr-stone.html",
        path: false,
        extractors: [ "animevost" ]
    },
    {
        provider: "seasonvar",
        id: "%2Fserial-24137-Grand_Tur-4-sezon.html",
        path: true
    },
    {
        provider: "kinogo",
        id: "https%3A%2F%2Fkinogo.by%2F2048-gorod-grehov-2-zhenschina-radi-kotoroy-stoit-ubivat-2014-smotret-onlayn.html"
    },
    {
        provider: "kinogo",
        id: "https%3A%2F%2Fkinogo.by%2F15114-ballmastrz-9009_2018.html",
        path: false
    },
    {
        provider: "kinogo",
        id: "https%3A%2F%2Fkinogo.by%2F6347-parki-i-zony-otdyha_parks-and-recreation_1-2-3-4-5-6-7-sezon.html",
        path: false
    },
    {
        provider: "videocdn",
        id: "tv-series_3381",
        path: true
    },
    {
        provider: "videocdn",
        id: "movies_1765"
    },
    {
        provider: "kinovod",
        id: "%2Ffilm%2F2164-gorod-grehov"
    },
    {
        provider: "kinovod",
        id: "%2Ftv_show%2F7357-grand-tur",
        path: true
    },
    {
        provider: "7serealov",
        id: "http%3A%2F%2F7serialov.net%2Fload%2Fdrama%2Forvill_1%2F8-1-0-386",
        manifest: true,
        path: true
    }
]

describe("InfoAPI", () => {
    testParameters.forEach(({ provider, id, manifest, path, extractors }) => {
        it(`Provider ${provider} should return playlist by ${id}`, async () => {
            const res =  await axios.get(`${baseApiUrl}/${provider}/items/${id}`)
            const { data, status } = res

            expect(status, `Server respond status: ${status}`).to.equal(200)
            expect(data, `Empty response`).to.be.not.null
            expect(data.title, `Empty title`).to.be.not.empty
            expect(data.image, `Playlist logo not present`).to.be.not.empty
            expect(data.files, `Playlist files list not present`).to.be.not.empty

            data.files.forEach((file) => {
                expect(file.id, `File id not present`).exist
                expect(file.name, `Empty name`).to.be.not.empty

                if(manifest) {
                    expect(file.manifestUrl, `'manifestUrl' id not present`).to.be.not.empty
                } else {
                    expect(file.url, `'url' id not present`).to.be.not.empty
                }

                if(path) {
                    expect(file.path, `'path' id not present`).to.be.not.empty
                }

                if(extractors) {
                    expect(file.extractor).exist
                    expect(file.extractor.type, `Unknow extractor type ${file.extractor.type}`).to.be.oneOf(extractors)
                }
            })
        })
    })
})