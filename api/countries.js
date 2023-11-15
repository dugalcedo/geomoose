import api from "./api.js"
import processor from "./processor/index.js"

let countries = processor(api)

export default countries