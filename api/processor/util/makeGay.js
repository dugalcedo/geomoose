import fs from 'fs'
import lgbt from '../../more-data/lgbt-countries.js'

export default function makeGay(c) {
    if (lgbt[c.name]) {
        c.info.detail.LGBT = lgbt[c.name]
    }
    return c
}