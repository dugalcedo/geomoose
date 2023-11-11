<script setup>
import { store } from '../App.vue'
import FieldSet from './FieldSet.vue'
const props = defineProps(['country'])
const { country } = props
</script>

<template>
    <a 
        :href="`#/country/`+country.name"
        :class="{
            countryCard: true,
            dependent: !country.independent,
            missingSortKey: country.missingSortKey
        }"
    >
        <div id="flag">
            <img :src="country.flag" :alt="`Flag of ${country.name}`">
        </div>
        <div class="body">
            <h2>{{ country.name }}</h2>
            <FieldSet :info="country.info.intro" />
        </div>
        <div class="missing-alert">
            {{ store.filters.sort }} missing
        </div>
    </a>
</template>