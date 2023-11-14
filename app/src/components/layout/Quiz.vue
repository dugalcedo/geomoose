<script setup>
    import { ref, watch } from 'vue'

    import quizBot from '../../lib/quiz/quiz.js'
    import quizSeeds from '../../lib/quizzes.js'
    import QuizQuestion from '../QuizQuestion.vue'
    import QuizResults from '../QuizResults.vue'

    let day1 = new Date('2023-11-12T00:00:00+00:00')
    let today = new Date()
    let dayDiff = Math.floor((today-day1)/1000/60/60/24)
    let quiz = ref(quizBot.parse(quizSeeds[dayDiff]))

    // console.log(quiz)

    let {score, day, takenQuiz} = JSON.parse(localStorage.getItem('geoMoose-score')||'{}')
    let already = day === dayDiff

    function choose(questionIndex, choice) {
        quiz.value[questionIndex].userChoice = choice
        quiz.value = [...quiz.value]
    }

    watch(quiz, ()=>{
        // console.log(quiz)
    })

    function submit() {
        let completed = quiz.value.every(q=>q.hasOwnProperty('userChoice'))
        if (!completed) {
            cannotSubmit.value = true
            return
        } else cannotSubmit.value = false
        // 
        let score = quiz.value.reduce((acc, cv, i) => {
            if (Array.isArray(cv.answer)) {
                if (cv.answer.some(a=>a.includes(cv.userChoice))) {
                    acc++
                    quiz.value[i].correct = true
                }
            } else {
                if (cv.answer===cv.userChoice) {
                    acc++
                    quiz.value[i].correct = true
                }
            }
            return acc
        }, 0)
        // console.log(score)
        saveScore(score)
        window.scroll(0,0)
        window.location.reload()
    }

    function saveScore(score) {
        localStorage.setItem('geoMoose-score', JSON.stringify({
            score,
            day: dayDiff,
            takenQuiz: quiz.value
        }))
    }

    let cannotSubmit = ref(false)
</script>

<template>
    <a href="#/">
        <button>
            Back
        </button>
    </a>
    <div id="quiz" v-if="!already">
        <QuizQuestion 
            v-for="q, qi in quiz"
            key="q.question"
            :q="q"
            :qi="qi"
            :choose="choose"
        />
        <div id="quiz-foot">
            <button class="quiz-submit" v-on:click="submit">
                Submit
            </button>
            <div class="quiz-foot_error" v-if="cannotSubmit">
                You must answer all questions
            </div>
        </div>
    </div>
    <QuizResults v-if="already" :quiz="takenQuiz" :score="score"/>
</template>