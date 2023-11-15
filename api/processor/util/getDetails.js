import {
    formatNumber,
    getCallingCodes,
    arrayFromObj
} from './util.js'

export default function getDetails(c, _c) {
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
        Region: c.region,
        Subregion: c.subregion,
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
}