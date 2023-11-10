<script setup>
import FieldSet from './FieldSet.vue'
const props = defineProps(['country'])
const { country } = props
</script>

<template>
    <a 
        :href="`#/country/`+country.name"
        :class="{
            countryCard: true,
            independent: country.independent
        }"
    >
        <div id="flag">
            <img :src="country.flag" :alt="`Flag of ${country.name}`">
        </div>
        <div class="body">
            <h2>{{ country.name }}</h2>
            <FieldSet :info="country.info.intro" />
        </div>
    </a>
</template>