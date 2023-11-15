export function getCallingCodes(_c) {
    let {idd} = _c
    if (!idd) return []
    let {root, suffixes} = idd
    if (!suffixes) return [root]
    return suffixes.map(s => root+s)
}

export function arrayFromObj(obj, options) {
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

export function formatNumber(n) {
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
