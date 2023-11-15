import {
    arrayFromObj
} from './util.js'

export default function getNames(c, _c) {
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
    function getLang(code) {
        return _c.languages?.[code]
    }
}