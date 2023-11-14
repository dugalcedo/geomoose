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

const quizBot = {}

quizBot.thresholds = {}

quizBot.thresholds.population = [
    [100_000_000, 1_500_000_000, '100m-1.5b'],
    [90_000_000, 200_000_000, '90m-200m'],
    [45_000_000, 120_000_000, '45m-120m'],
    [9_000_000, 55_000_000, '9m-55m'],
    [900_000, 11_000_000, '900k-11m'],
    [0, 1_000_000, '1m or less']
]

quizBot.thresholds.area = [
    [2_000_000, 17_100_000, '2m-17.1m km²'],
    [900_000, 3_500_000, '900k-3.5m km²'],
    [450_000, 1_000_000, '450k-1m km²'],
    [225_000, 500_000, '275k-500k km²'],
    [75_000, 250_000, '75k-250k km²'],
    [20_000, 100_000, '20k-100k km²'],
    [2500, 25_000, '2.5k-25k km²'],
    [0, 5000, '5k km² or less']
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
    population: 0,
    area: 0,
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
    question.q = reversed ? 
        `Which country does this flag belong to?` :
        `Which of these is the flag of ${country.name}?`
    question.a = answers
    question.correct = `<img src="${country.flag}" alt="">`
    question.v = cn => cn === country.name
    return question
}

quizBot.parser.capital = (question, country, answers, reversed = false) => {
    question.correct = randomArr(country.capital)
    question.q = reversed ? 
        `Which country has a capital called "${question.correct}"?` :
        `Which of these is a capital of ${country.name}?`
    question.a = answers
    question.v = cn => cn === country.name
    return question
}

quizBot.parser.population = (question, country, answers, reversed = false) => {
    question.q = reversed ? 
        `True or false: ${country.name} has a higher population than ${answers[0].name}` :
        `The population of ${country.name} lies within which range? (There can sometimes be two correct answers)`
    question.a = answers[0]
    question.correct = country.population>=answers[0].population
    question.v = bool => {
        return reversed ?
            bool === (question.correct) :
            false
    }
    return question
}

quizBot.parser.area = (question, country, answers, reversed = false) => {
    question.q = reversed ? 
        `True or false: ${country.name} has a larger area than ${answers[0].name}` :
        `The area of ${country.name} lies within which range? (There can sometimes be two correct answers)`
    question.a = answers[0]
    question.correct = country.area>=answers[0].area
    question.v = bool => {
        return reversed ?
            bool === (question.correct) :
            false
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