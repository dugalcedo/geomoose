<script setup>
    import { store } from '../../App.vue'

    function getAll(key) {
        return [...new Set(store.countries.reduce((acc, cv) => {
            acc.push(...cv[key])
            return acc
        }, []))]
    }

    const regions = getAll('region')
    const subregions = getAll('subregion')
    
    function handleInput(e) {
        let data = Object.fromEntries(new FormData(e.currentTarget))
        data.desc ??= 'off'
        store.filters = {
            ...store.filters,
            ...data
        }
    }
</script>

<template>
    <form id="search-bar" v-on:input="handleInput">
        <input type="text" placeholder="Search" name="q">
        <input type="checkbox" name="desc"> descending
        <select name="reg">
            <option value="all" selected>All</option>
            <optgroup label="Regions">
                <option 
                v-for="r in regions"
                :value="`region|${r}`">{{ r }}</option>
            </optgroup>
            <optgroup label="Subregions">
                <option 
                v-for="sr in subregions"
                :value="`subregion|${sr}`">{{ sr }}</option>
            </optgroup>
        </select>
    </form>
</template>