<script setup>
    import { store } from '../../App.vue'

    function dive(obj, str) {
        let keys = str.split('.')
        let target = obj
        keys.forEach(k => {
            target = target.value[k]
        })
        return target
    }

    function getAll(key) {
        let results = [...new Set(store.countries.reduce((acc, cv) => {
            if (key.includes('.')) {
                let keys = key.split('.')
                let target = cv
                keys.forEach(k =>{
                    target = target[k]
                })
                acc.push(...target)
                return acc
            } else {
                acc.push(...cv[key])
                return acc
            }
        }, []))]
        results.sort((a,b)=>(a||"").localeCompare(b||""))
        return results
    }

    const regions = getAll('region')
    const subregions = getAll('subregion')
    const microregions = getAll('microregion')
    // const religions = getAll('religion')
    // const governments = getAll('govt')
    // console.log(governments)
    
    function handleInput(e) {
        let data = Object.fromEntries(new FormData(e.currentTarget))
        data.desc ??= 'off'
        data.dep ??= 'off'
        // console.log(data)
        store.filters = {
            ...store.filters,
            ...data
        }
    }
</script>

<template>
    <form id="search-bar" v-on:input="handleInput">
        <div class="field search">
            <input
            type="text"
            placeholder="Search"
            name="q"
            :value="store.filters.q"
            >
            <button type="button" @click="store.filters.q = ''">
                Clear
            </button>
        </div>

        <div class="field">
            <input
            type="checkbox"
            name="desc"
            :checked="store.filters.desc == 'on'"
            > descending
        </div>

        <div class="field">
            <input 
            type="checkbox" 
            :checked="store.filters.dep == 'on'"
            name="dep"> 
            Show dependencies
        </div>

        <div class="field">
            Region:
            <select name="reg" :value="store.filters.reg">
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
                <optgroup label="Microregions">
                    <option
                    v-for="mr in microregions"
                    :value="`microregion|${mr}`">{{ mr }}</option>
                </optgroup>
            </select>
        </div>

        <!-- <div class="field">
            Religion:
            <select name="rel">
                <option value="all">All</option>
                <option 
                v-for="rel in religions" 
                :value="rel">{{ rel }}</option>
            </select>
        </div> -->

        <div class="field">
            Sort by:
            <select name="sort" :value="store.filters.sort">
                <option value="name">Name</option>
                <option value="population">Population</option>
                <option value="area">Area</option>
                <option value="gini">Gini coefficient</option>
            </select>
        </div>



    </form>
</template>