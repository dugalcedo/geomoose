<script setup>
    import Field from './Field.vue'
    const { info } = defineProps(['info'])
    let key = info?.key
    if (key) delete info?.key
</script>

<template>
    <div class="fieldset" v-if="info">
        <h4 v-if="key" class="key">{{ key }}</h4>
        <Field
        v-for="[k,v] in (Array.isArray(info)?info:Object.entries(info))"
        :left="k" :right="v" />
    </div>
</template>