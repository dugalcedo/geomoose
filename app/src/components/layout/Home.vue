<script setup>
    import { store } from '../../App.vue'
    import CountryCard from '../CountryCard.vue'
    import SearchBar from './SearchBar.vue'
    
</script>

<template>
    <SearchBar />
    <div id="countries">
        <CountryCard
            v-for="country in store.filtered"
            :key="country.name"
            :country="country"
            />
    </div>
</template>