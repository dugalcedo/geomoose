// import langs from './langs'
// function getLang(code) {
//     let lang = langs.find(l => l['alpha3-b'] === code)
//     lang = (lang?.English || code).replaceAll(';',' /')
//     return lang
// }

import corrections from "./corrections.js"

function getCallingCodes(_c) {
    let {idd} = _c
    if (!idd) return []
    let {root, suffixes} = idd
    if (!suffixes) return [root]
    return suffixes.map(s => root+s)
}

function arrayFromObj(obj, options) {
    const {_c, test, keyName="key", ifNull, keyValue=k=>k, additional={}} = options
    if (!obj) {
        if (test) console.error(`
            Property was undefined on ${_c.name.common}
        `)
        return ifNull
    }
    return Object.entries(obj).map(([k,v]) => {
        let obj = {}
        obj[keyName] = keyValue(k)
        obj = {...obj, ...v, ...additional}
        return obj
    })
}

function formatNumber(n) {
    let str = Math.round(n).toString()
    let result = ""
    let b = 1
    for (let i = str.length; i > 0; i--) {
        let char = str[i-1]
        if (b%3==0 && i!=1) char = ","+char
        result = char + result
        b++
    }
    return result
}


export default function processor(data) {
    
    let countries = data.map(_c => {
        const c = {}
        c.flag = _c.flags.png
        c.coat = _c.coatOfArms?.png || ""
        c.name = _c.name.common
        c.population = _c.population
        c.area = _c.area
        c.region = []
        c.subregion = []
        Object.entries(corrections.subRegions).forEach(([sr, items]) => {
            if (items.includes(c.name)) c.subregion.push(sr)
        })
        Object.entries(corrections.regions).forEach(([r, items]) => {
            if (items.includes(c.name)) c.region.push(r)
        })
        corrections.names.forEach(([current, newName]) => {
            if (c.name === current) c.name = newName
        })
        c.independent = _c.independent
        
        // other names
        c.names = {}
        c.names.common = _c.name.common
        c.names.official = _c.name.official
        delete _c.name.nativeName?.eng
        c.names.native = arrayFromObj(_c.name.nativeName, {
            _c,
            ifNull: [{Official: c.name, Common: c.name}],
            keyValue: getLang
        })
        if (!c.names.native.length) delete c.names.native
        
        c.info = {}
        // card info
        c.info.intro = {}
        // c.info.intro.name = c.name
        c.info.intro.capital = _c.capital || "None"
        c.info.intro.population = formatNumber(_c.population)
        c.info.intro.region = c.region
        c.info.intro.subregion = c.subregion
        
        
        c.info.detail = {}
        
        // geography
        c.info.detail.Geography = {
            Capital: _c.capital,
            Continent: _c.continents,
            Region: _c.region,
            Subregion: _c.subregion,
            Area: formatNumber(_c.area) + " km²",
            Landlocked: _c.landlocked ? "yes" : "no",
            Timezone: _c.timezones
        }

        c.info.detail['Names'] = {
            Common: c.names.common,
            Official: c.names.official,
            Other: c.names.native,
            "Alternate Spelling": _c.altSpellings
        }

        
        c.info.detail['People'] = {
            Population: formatNumber(_c.population),
            Density: formatNumber(_c.population/_c.area) + "/km²",
            Language: Object.entries(_c.languages||{}).map(l=>l[1]),
            Demonym: _c.demonyms?.eng
        }

        c.info.detail['Economy & Infrastructure'] = {
            "Top Level domain": _c.tld,
            "Driving side": _c.car.side,
            "Calling code": getCallingCodes(_c),
            "Gini coefficient": _c.gini,
            "Postal code format": _c.postalCode?.format,
            Currency: arrayFromObj(_c.currencies, {

            })
        }

        c.info.detail.Politics = {
            "Independent": c.independent ? "yes" : "no",
            "UN Member": _c.unMember ? "yes" : "no"
        }

        return c
        function getLang(code) {
            return _c.languages?.[code]
        }
    })
    return countries
    // 
    function showMe(name) {
        console.log(countries.find(c=>c.name==name))
    }
}