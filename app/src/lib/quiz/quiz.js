import countries from '../data.js'

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase()
}

function randInt(max = 1, min = 0) {
    return (Math.round(Math.random()*(max-min)))-min
}

function randomArr(arr = []) {
    if (typeof arr == 'string') {
        return arr
    } else return arr[Math.floor(Math.random()*arr.length)]
}

function getRandomWrongAnswers(amt, country) {
    let answers = []
    while (answers.length < amt) {
        let otherCountry = randomArr(countries)
        if (otherCountry.name !== country.name) {
            answers.push(otherCountry)
        }
    }
    return answers.length > 1 ? answers : answers[0]
}

function getIncorrect(country, answers) {
    return answers.filter(a=>a.name!==country.name)
}

function multipleCorrectAnswers(country, key) {
    const corrects = quizBot.thresholds[key].filter(t=>{
        const [text, hi, lo] = t
        return (country[key]>=lo)&&
               (country[key]<=hi)
    })
    return corrects.filter(c=>c[0])
}

const quizBot = {}

quizBot.thresholds = {}

quizBot.thresholds.population = [
    ['Massive (200m - 1.5b)', 1_500_000_000, 150_000_000],
    ['Very large (75m - 200m)', 200_000_000, 75_000_000],
    ['Large (40m - 100m)', 100_000_000, 40_000_000],
    ['Medium (7.5m - 50m)', 50_000_000, 7_500_000],
    ['Small (750k - 10m)', 10_000_000, 750_000],
    ['Very small (less than 1m)', 1_000_000, 0]
]

quizBot.thresholds.area = [
    ['Massive (5m - 17.1m km²)', 17_200_000, 5_000_000],
    ['Very large (1.2m - 5m km²)', 5_000_000, 1_200_000],
    ['Large (500k - 1.5 km²)', 1_500_000, 500_000],
    ['Medium (150k - 600k km²)', 600_000, 150_000],
    ['Small (20k - 200k km²)', 200_000, 20_000],
    ['Very small (less than 25k km²)', 25_000, 0]
]


quizBot.questionSeedGenerator = {}
quizBot.questionSeedGenerator.capital = (key, reversed) => {
    let type = reversed ? key[0] : key[key.length-1]
    let country = randomArr(countries)
    let answers = getRandomWrongAnswers(3, country)
    answers.splice(randInt(3), 0, country)
    return `${type}.${country.cca2}.${answers.map(a=>a.cca2).join(',')}`
}
quizBot.questionSeedGenerator.flag = quizBot.questionSeedGenerator.capital
quizBot.questionSeedGenerator.population = (key, reversed)=>{
    let type = 
        key == 'population' ? 
            (reversed ? 'n' : 'p') :
            (reversed ? 'e' : 'a')
    let country = randomArr(countries)
    
    return reversed ? 
        `${type}.${country.cca2}.${getRandomWrongAnswers(1, country).cca2}` :
        `${type}.${country.cca2}`
}
quizBot.questionSeedGenerator.area = quizBot.questionSeedGenerator.population

quizBot.generateRandomQuizSeed = (schema = {
    capital: 1,
    flag: 1,
    "capital:r": 1,
    "flag:r": 1,
    population: 1,
    area: 1,
    "population:r": 1,
    "area:r": 1
}) => {
    let questionSeeds = []
    Object.entries(schema).forEach(([type, amt]) => {
        let [key, reversed] = type.split(':')
        for(let i=0;i<amt;i++) {
            let seed  = quizBot.questionSeedGenerator[key](key, reversed)
            questionSeeds.splice(
                randInt(questionSeeds.length-1),
                0, seed
            )
        }
    })
    return questionSeeds.join(' ')
}

const typeMap = {
    f: ['flag'],
    g: ['flag', true],
    c: ['capital'],
    l: ['capital', true],
    p: ['population'],
    n: ['population', true],
    a: ['area'],
    e: ['area', true]
}

quizBot.parser = {}

quizBot.parser.flag = (question, country, answers, reversed = false) => {
    if (reversed) {
        question.question = `Which country does this flag belong to?`
        question.image = country.flag
        question.choices = answers.map(a=>a.name)
        question.answer = country.name
    } else {
        question.question = `Which of these is the flag of ${country.name}?`
        question.choices = answers.map(a=>a.flag)
        question.answer = country.flag
    }
    return question
}

quizBot.parser.capital = (question, country, answers, reversed = false) => {
    if (reversed) {
        const capital = randomArr(country.capital)
        question.answer = country.name
        question.question = `Which country has a capital called "${capital}"?`
        question.choices = answers.map(a=>a.name)
    } else {
        question.question = `Which of these is a capital of ${country.name}?`
        const capitals = {
            correct: randomArr(country.capital),
            incorrect: getIncorrect(country, answers).map(a=>randomArr(a.capital))
        }
        question.answer = capitals.correct
        question.choices = [capitals.correct, ...capitals.incorrect]
    }

    return question
}

quizBot.parser.population = (question, country, answers, reversed = false) => {
    if (reversed) {
        const incorrect = randomArr(getIncorrect(country, answers))
        question.question = `True or false: ${country.name} has a higher population than ${incorrect.name}`
        question.choices = [true, false]
        question.answer = country.population > incorrect.population
    } else {
        question.question = `The population of ${country.name} is...? (There can sometimes be two correct answers)`
        question.choices = quizBot.thresholds.population.map(t=>t[0])
        question.answer = multipleCorrectAnswers(country, 'population')
    }
    return question
}

quizBot.parser.area = (question, country, answers, reversed = false) => {
    if (reversed) {
        const incorrect = randomArr(getIncorrect(country, answers))
        question.question = `True or false: ${country.name} has a larger area than ${incorrect.name}`
        question.choices = [true, false]
        question.answer = country.area > incorrect.area
    } else {
        question.question = `The area of ${country.name} is...? (There can sometimes be two correct answers)`
        question.choices = quizBot.thresholds.area.map(t=>t[0])
        question.answer = multipleCorrectAnswers(country, 'area')
    }
    return question
}

quizBot.parse = quizSeed => {
    const seeds = quizSeed.split(' ')
    const quiz = []
    seeds.map(s=>s.split('.')).forEach(([_type, _country, _answers]) => {
        const [key, reversed] = typeMap[_type]
        const country = countries.find(c=>c.cca2==_country)
        const answers = (_answers||"").split(',').map(a=>countries.find(c=>c.cca2==a))
        const question = {}
        question.type = key
        question.reversed = reversed || false
        question.country = country
        quiz.push(quizBot.parser[key](question, country, answers, reversed))
    }) 
    return quiz
}

export default quizBot