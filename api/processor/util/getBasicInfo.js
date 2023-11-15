export default function getBasicInfo(c, _c) {
    c.flag = _c.flags.png
    c.coat = _c.coatOfArms?.png || ""
    c.name = _c.name.common
    c.population = _c.population
    c.area = _c.area
    c.region = []
    c.subregion = []
    c.microregion= []
    c.independent = _c.independent
}