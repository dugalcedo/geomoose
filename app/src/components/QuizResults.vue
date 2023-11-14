<script setup>
    import QuizAnswer from './QuizAnswer.vue'
    import QuizCountdown from './QuizCountdown.vue'
    const {quiz, score} = defineProps(['quiz', 'score'])
   
    function display(uc) {
        // console.log(uc)
        if (typeof uc === 'string') {
            if (uc.includes('//')) {
                return `<img src="${uc}">`
            } else return uc
        } else {
            return uc
        }
    }

    console.log(quiz)

</script>

<template>
    <div id="quiz-results">
        <h2>Your score: {{ score }}/8</h2>
        <p>
            You've already taken today's quiz <br>
            The next quiz is in: <QuizCountdown />
        </p>
        <div class="quiz-result" v-for="q, qi in quiz">
            <div class="quiz-result_q">
                <div class="text">
                    {{ q.question }}
                </div>
                <div class="image" v-if="q.image">
                    <img :src="q.image" alt="">
                </div>
            </div>
            <div class="quiz-result_y quiz-result_x">
                <div class="label">
                    You said:
                </div>
                <div class="userChoice" v-html="display(q.userChoice)"></div>
            </div>
            <div class="quiz-result_a quiz-result_x">
                <QuizAnswer :answer="q.answer" />
            </div>
            <div class="quiz-result_x quiz-result_c">
                {{ q.correct ? "CORRECT" : "INCORRECT" }}
            </div>
        </div>
    </div>
</template>