<script setup>
import QuizCountdown from './QuizCountdown.vue'

    const {results, dayDiff} = defineProps(['results', 'dayDiff'])
    function userCountry(question) {
        return question.a.find(a=>a.name==question.u)
    }
    function userAnswer(question) {
        switch (question.type) {
            case "capital":
                return !question.reversed ? 
                    userCountry(question).capital :
                    question.u

            case "flag":
                return !question.reversed ? 
                    `<img src="${userCountry(question).flag}" alt="">` :
                    question.u

            default:
                return question.u

        }
    }
    function correctAnswer(question) {
        switch (question.type) {
            case "capital":
                return !question.reversed ? 
                    question.correct :
                    question.country.name
                
            case "flag":
                return !question.reversed ? 
                        question.correct :
                        question.u

            default:
                return question.u
                
        }
    }
</script>

<template>
    <div id="completed-quiz">
        <h2>Your score: {{ results.score }}/6</h2>
        <p>
            You already completed today's quiz. <br>
            Next quiz in: <QuizCountdown />
        </p>
        <div v-for="question, qi in results[dayDiff]" class="quiz-answer">
            <div class="q">
                <div>{{ question.q }}</div>
                <div v-if="question.type == 'flag' && question.reversed">
                    <img :src="question.country.flag" alt="">
                </div>
            </div>
            <div class="a">
                <div class="you-said" v-html="`You said: ${userAnswer(question)}`">
                </div>
                <div class="answer" v-html="`Answer: ${correctAnswer(question)}`">
                </div>
                <div class="result">
                    <div v-if="question.uc" class="correct">CORRECT</div>
                    <div v-else class="incorrect">INCORRECT</div>
                </div>
            </div>
        </div>
    </div>
</template>