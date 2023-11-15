import corrections from "../corrections.js"
export default function makeCorrections(c) {
    Object.entries(corrections.subRegions).forEach(([sr, items]) => {
        if (items.includes(c.name)) c.subregion.push(sr)
    })
    Object.entries(corrections.regions).forEach(([r, items]) => {
        if (items.includes(c.name)) c.region.push(r)
    })
    corrections.names.forEach(([current, newName]) => {
        if (c.name === current) c.name = newName
    })
}