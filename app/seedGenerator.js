import { writeFileSync } from 'fs'
import quizBot from "./src/lib/quiz/quiz.js"
const seeds = []
for (let i = 0; i < 366; i++) {
    seeds.push(quizBot.generateRandomQuizSeed())
}
writeFileSync('./src/lib/quizzes.js', 'export default ' + JSON.stringify(seeds))