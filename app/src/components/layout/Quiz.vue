<script setup>
    import { ref } from 'vue'

    import quizBot from '../../lib/quiz/quiz.js'
    import quizSeeds from '../../lib/quizzes.js'
    import QuizResults from '../QuizResults.vue'

    let day1 = new Date('2023-11-12T00:00:00+00:00')
    let today = new Date()
    let dayDiff = Math.floor((today-day1)/1000/60/60/24)
    let quiz = ref(quizBot.parse(quizSeeds[dayDiff]))

    let completedQuizzes = JSON.parse(localStorage.getItem('geoMoose-completed')||'{}')
    
    const isTorF = question => (['population', 'area']).includes(question.type) && question.reversed
    const isRange = question => (['population', 'area']).includes(question.type) && !question.reversed
    const countryAnswers = question => (['flag', 'capital']).includes(question.type) && question.reversed
    const rangeWidth = (question, lo) => {
        let thresholds = quizBot.thresholds[question.type]
        let maxLo = thresholds[0][0]
        return {width: (lo/maxLo*100)+'%'}
    } 

    function setAnswer(qi, u) {
        quiz.value[qi].u = u
    }

    function handleSubmit() {
        if (!quiz.value.every(q => q.hasOwnProperty('u'))) {
            console.log('quiz incomplete')
            return
        }
        let score = quiz.value.reduce((acc, cv, i) => {
            if (cv.v(cv.u)) {
                quiz.value[i].uc = true
                acc++
            }
            return acc
        }, 0)
        const quizData = {}
        quizData[dayDiff] = quiz.value
        quizData.score = score
        localStorage.setItem('geoMoose-completed', JSON.stringify(quizData))
    }
</script>

<template>
    <a href="#/"><button>Back</button></a>
    <QuizResults 
        v-if="completedQuizzes.hasOwnProperty(dayDiff)" 
        :results="completedQuizzes"
        :dayDiff="dayDiff"
        />
    <div v-else id="quiz">
        <div v-for="question, qi in quiz" class="quiz-q"
        :key="`q${qi}`"
        >

            <div class="q">
                <div>{{ question.q }}</div>
                <div v-if="question.type == 'flag' && question.reversed">
                    <img :src="question.country.flag" alt="">
                </div>
            </div>

            <!-- ANSWERS -->

            <div v-if="isTorF(question)" class="a">
                <button @click="setAnswer(qi, true)"
                :class="{selected: question.u===true}">
                    True
                </button>
                <button @click="setAnswer(qi, false)"
                :class="{selected: question.u===false}">
                    False
                </button>
            </div>

            <!-- <div class="a range" v-else-if="isRange(question)">
                <button v-for="[lo, hi, text] in quizBot.thresholds[question.type]">
                    <div class="size" :style="rangeWidth(question, lo)">

                    </div>
                    <span>
                        {{ text }}
                    </span>
                </button>
            </div> -->


            <div class="a" v-else-if="countryAnswers(question)">
                <button v-for="country in question.a"
                :key="country.name"
                @click="setAnswer(qi, country.name)"
                :class="{selected: question.u===country.name}"
                >
                    {{ country.name }}
                </button>
            </div>


            <template v-else>
                <div class="a flags" v-if="question.type == 'flag'">
                    <button v-for="country in question.a"
                    :key="country.name"
                    :class="{selected: question.u===country.name}"
                    @click="setAnswer(qi, country.name)"
                    >
                        <img :src="country.flag" alt="">
                    </button>
                </div>
                <div class="a" v-else>
                    <button v-for="country in question.a"
                    :key="country.name"
                    :class="{selected: question.u===country.name}"
                    @click="setAnswer(qi, country.name)"
                    >
                        {{ country.capital[Math.floor(Math.random()*country.capital.length)] }}
                    </button>
                </div>
            </template>
        </div>
        <button v-on:click="handleSubmit">
            Submit
        </button>
    </div>
</template>