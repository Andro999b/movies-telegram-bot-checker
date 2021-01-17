const axios = require("axios")
const { expect } = require("chai")

const baseApiUrl = "https://mcw4r3l663.execute-api.eu-central-1.amazonaws.com/prod/api/trackers"

const testParameters = [
    {
        provider: "nekomori",
        id: "2685",
        extractors: [ "sibnetmp4" ],
        audio: true
    },
    {
        provider: "nekomori", //Чёрный клевер
        id: "150",
        extractors: [ "sibnetmp4", "anigit" ],
        audio: true
    },    
    {
        provider: "nekomori",
        id: "13712",
        extractors: [ "sibnetmp4", "anigit" ],
        audio: true
    },
    {
        provider: "animevost",
        id: "https%3A%2F%2Fanimevost.org%2Ftip%2Ftv%2F2281-dr-stone.html",
        asyncSource: true
    },
    {
        provider: "anidub",
        id: "https%3A%2F%2Fanime.anidub.life%2Fanime%2Ffull%2F11115-dorohedoro-dorohedoro-anons.html"
    },
    {
        provider: "animedia",
        id: "%2Fanime%2Fdorohedoro",
        manifest: true
    },
    {
        provider: "seasonvar",
        id: "%2Fserial-24137-Grand_Tur-4-sezon.html",
    },
    { // movie
        provider: "kinogo",
        id: "https%3A%2F%2Fkinogo.appspot.com%2F11361-venom_2018___22-01.html",
        timeout: 15000,
        quality: true,
        audio: true
    },
    { // tvshow
        provider: "kinogo",
        id: "https%3A%2F%2Fkinogo.appspot.com%2F17293-project-blue-book_1-2-sezon.html",
        timeout: 15000,
        quality: true,
        audio: true
    },
    {
        provider: "kinogo",
        id: "https%3A%2F%2Fkinogo.appspot.com%2F14452-fitnes-1-2-3-4-sezon.html",
        quality: true,
        audio: true
    },
    {
        provider: "videocdn",
        id: "tv-series_3381",
        path: true,
        timeout: 30000,
        quality: true,
        audio: true
    },
    {
        provider: "videocdn",
        id: "movies_1765",
        timeout: 30000,
        quality: true,
        audio: true
    },
    {
        provider: "kinovod",
        id: "%2Ffilm%2F2164-gorod-grehov",
        quality: true
    },
    {
        provider: "kinovod",
        id: "%2Ftv_show%2F7357-grand-tur",
        path: true,
        quality: true
    }
]

describe("InfoAPI", () => {
    testParameters.forEach(({ provider, id, manifest, asyncSource, path, extractors, timeout, quality, audio }) => {
        it(`Provider ${provider} should return playlist by ${id}`, async () => {
            const res =  await axios.get(
                `${baseApiUrl}/${provider}/items/${id}?dnt=1`,
                { timeout: timeout || 5000}
            )
            const { data, status } = res

            expect(status, `Server respond status: ${status}`).to.equal(200)
            expect(data, `Empty response`).to.be.not.null
            expect(data.id, `Empty id`).to.be.not.empty
            expect(data.title, `Empty title`).to.be.not.empty
            expect(data.image, `Playlist logo not present`).to.be.not.empty
            expect(data.files, `Playlist files list not present`).to.be.not.empty

            data.files.forEach((file) => {
                expect(file.id, `File id not present`).exist
                expect(file.name, `Empty name`).to.be.not.empty

                if(asyncSource) {
                    expect(file.asyncSource, `'asyncSource' is not present`).to.be.not.empty
                } else if(manifest) {
                    expect(file.manifestUrl, `'manifestUrl' is not present`).to.be.not.empty
                } else {
                    expect(file.urls, `'urls' is not present`).to.be.not.empty
                    file.urls.forEach((urlInfo) => {
                        expect(urlInfo.url, `'url' is not present`).to.be.not.null
                        if(extractors) {
                            expect(urlInfo.extractor, 'expect extractor to exits').exist
                            expect(urlInfo.extractor.type, `Unknow extractor type ${urlInfo.extractor.type}`).to.be.oneOf(extractors)
                        }
                        if(quality) {
                            expect(urlInfo.quality, `'quality' is not present`).to.be.not.null
                        }
                        if(audio) {
                            expect(urlInfo.audio, `'audio' is not present`).to.be.not.null
                        }
                    })
                }

                if(path) {
                    expect(file.path, `'path' is not present`).to.be.not.empty
                }
            })
        }).timeout(timeout + 500)
    })
})