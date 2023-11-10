<script setup>
    import { store } from '../../App.vue'
</script>

<template>
    <header>
        <h1>GeoMoose</h1>
        <button @click="store.dark = !store.dark">
            {{ store.dark ? "Light" : "Dark" }} mode
        </button>
    </header>
</template>