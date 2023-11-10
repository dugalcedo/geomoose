<script setup>
  import Header from './components/layout/Header.vue'
</script>
<script>
    import { reactive, watch } from 'vue'

    import countries from '/api/countries.js?url'

    let nameSort = (a,b) => a.name.localeCompare(b.name)
    let numSort = (a,b) => a-b
    let startsWith = (long, short) => long.toLowerCase().startsWith(short.toLowerCase())
    let filtered = countries.toSorted(nameSort)

    export const store = reactive({
      countries,
      filtered,
      dark: false,
      filters: {
        sort: 'name',
        desc: 'off',
        q: '',
        reg: 'all'
      }
    })


    watch(() => store.dark, dark=>{
        document.body.classList = dark ? "dark" : ""
    })
    watch(() => store.filters.reg, reg => {
      if (reg === 'all') {
        store.filtered = [...store.countries]
        sort()
        return
      }
      let [k, v] = reg.split('|')
      store.filtered = store.countries.filter(c => {
        let match = false
        if (c[k].includes(v)) match = true
        return match
      })
      sort()
    })
    watch(() => store.filters.q, q => {
      store.filtered = store.countries.filter(c => {
        let match = false
        if (startsWith(c.name, q)) match = true
        c.info.detail.Names["Alternate Spelling"].forEach(s => {
          if (startsWith(s, q)) match = true
        })
        let others = (c.info.detail.Names["Other"]||[]).map(n => n.common)
        others.forEach(s => {
          if (startsWith(s||"", q)) match = true
        })
        return match
      })
      sort()
    })
    watch(() => store.filters.desc, sort)

    function sort(desc = store.filters.desc) {
      const key = store.filters.sort
      store.filtered = store.filtered.toSorted((a,b) => {
        let A = desc == 'on' ? b[key] : a[key]
        let B = desc == 'on' ? a[key] : b[key]
        return typeof A === 'number' ? (A-B) : (A.localeCompare(B))
      })
    }

</script>

<template>
  <Header />
  <main>
    <router-view v-if="store.filtered"/>
  </main>
</template>
