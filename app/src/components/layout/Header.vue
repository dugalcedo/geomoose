<script setup>
    import { store } from '../../App.vue'
</script>

<template>
    <header>
        <h1>GeoMoose</h1>
        <a href="#/quiz">
            <button>
                Today's quiz
            </button>
        </a>
        <button @click="store.dark = !store.dark">
            {{ store.dark ? "Light" : "Dark" }} mode
        </button>
    </header>
</template>