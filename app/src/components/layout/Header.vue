<script setup>
    import { store } from '../../App.vue'
    function toggleTheme() {
        store.dark = !store.dark
        localStorage.setItem('geoMoose-theme', store.dark)
    }
</script>

<template>
    <header>
        <a href="#/">
            <h1>GeoMoose</h1>
        </a>
        <a href="#/quiz">
            <button>
                Today's quiz
            </button>
        </a>
        <button v-on:click="toggleTheme">
            {{ store.dark ? "Light" : "Dark" }} mode
        </button>
    </header>
</template>