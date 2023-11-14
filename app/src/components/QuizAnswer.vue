<script setup>
    const {answer} = defineProps(['answer'])
    let label = "Answer:"
    if (Array.isArray(answer) && answer.length > 1) {
        label = "Answers:"
    }
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
</script>

<template>
    <div class="label">{{ label }}</div>
    <div v-if="Array.isArray(answer)" class="quiz-a_a">
        <div v-for="a in answer">
            {{ a[0] }}
        </div>
    </div>
    <div v-else v-html="display(answer)" class="quiz-a_a"></div>
</template>