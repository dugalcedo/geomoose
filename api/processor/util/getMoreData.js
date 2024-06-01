import { readFileSync } from 'fs'
function readJSON(fileName) {
    return JSON.parse(readFileSync(`D:/Webdev/GeoMoose/api/more-data/${fileName}.json`))
}
function addField(c, name, detailKey, filePath, dataKey, trim) {
    let data = readJSON(filePath)
    c.info.detail[detailKey][name] = []
    data.forEach(d => {
        if (d.country === c.name) {
            let value = d[dataKey]
            if (trim) value = splitAndTrim(value)
            if (Array.isArray(value)) {
                c.info.detail[detailKey][name].push(...value)
            } else {
                c.info.detail[detailKey][name].push(value)
            }
        }
    })
    if (c.info.detail[detailKey][name].length < 2) {
        c.info.detail[detailKey][name] = c.info.detail[detailKey][name][0] || ""
    }
}
function splitAndTrim(str) {
    if (typeof str !== 'string') return str
    return str.split(',').map(s=>s.trim())
}

export default function getMoreData(c) {
    addField(
        c, 
        'Government Type', 
        'Politics', 
        'country-by-government-type',
        'government'
        )
    c.govt = c.info.detail.Politics['Government Type']||"N/A"
    addField(
        c,
        'Independence',
        'Politics',
        'country-by-independence-date',
        'independence'
    )
    c.independence = Number(c.info.detail.Politics.Independence)
    addField(
        c,
        'Most common religion',
        'People',
        'country-by-religion',
        'religion'
    )
    c.religion = c.info.detail.People["Most common religion"]
    addField(
        c,
        'Popular dish',
        'People',
        'country-by-national-dish',
        'dish',
        true
    )
    addField(
        c,
        'Average temp',
        'Geography',
        'country-by-yearly-average-temperature',
        'temperature'
    )
    c.temp = Number(c.info.detail.Geography['Average temp'])
}