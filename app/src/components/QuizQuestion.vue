<script setup>
    const {q, qi, choose} = defineProps(['q', 'qi', 'choose'])

    function getChoice(choice) {
        return typeof choice == 'string' ? 
            choice.includes('//') ?
                `<img src="${choice}">`
                :
                choice
            :
            choice
    }
</script>

<template>
    <div class="question">
        <div class="q">
            <div class="text">
                {{ q.question }}
            </div>
            <div class="image" v-if="q.image">
                <img :src="q.image" alt="">
            </div>
        </div>
        <div class="choices">
            <button 
                class="choice" 
                :class="{
                    chosen: q.userChoice === choice
                }"
                v-for="choice, ci in q.choices" 
                key="choice+ci"
                v-html="getChoice(choice)"
                @click="choose(qi, choice)"
            ></button>
        </div>
    </div>
</template>