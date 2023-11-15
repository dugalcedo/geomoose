import {
    getBasicInfo,
    makeCorrections,
    getNames,
    getDetails,
    getMoreData
} from './util/index.js'

export default function processor(data) {
    
    let countries = data.map(_c => {
        const c = {}
        getBasicInfo(c, _c)
        makeCorrections(c)
        getNames(c, _c)
        getDetails(c, _c)
        getMoreData(c)
        return c
    })
    return countries

}