<script setup>
    import { store } from '../../App.vue'
    import { useRoute } from 'vue-router'
    import FieldSet from '../FieldSet.vue'
    const route = useRoute()
    const country = store.countries.find(c=>c.name==route.params.name)
</script>

<template>
    <a href="#">
        <button>
            Back
        </button>
    </a>
    <div id="country">
        <div id="country-head">
            <div class="area flag">
                <img :src="country.flag" :alt="`Flag of ${country.name}`" :title="`Flag of ${country.name}`">
                <img :src="country.coat">
            </div>
        </div>
        <div id="country-body">
            <div class="info-card" v-for="[title, info] in Object.entries(country.info.detail)">
                <h2>{{ title }}</h2>
                <FieldSet :info="info" />
            </div>
        </div>
    </div>
</template>