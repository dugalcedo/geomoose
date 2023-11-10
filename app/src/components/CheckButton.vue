<script setup>
    import { ref } from 'vue'
    const checkbox = ref()

    const {
        title,
        onChange = (x)=>{},
        checked
    } = defineProps([
        'title',
        'onChange',
        'checked'
    ])

    function handleClick(e) {
        const clickedCheckbox = e.target.tagName == "INPUT"
        if (!clickedCheckbox) checkbox.value.checked = !checkbox.value.checked
        onChange(!checkbox.value.checked)
    }
</script>

<template>
    <button class="checkbutton" v-on:click="handleClick">
        <input type="checkbox" ref="checkbox" :checked="checked"> {{ title }}
    </button>
</template>