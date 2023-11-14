<script setup>
  import Header from './components/layout/Header.vue'
</script>
<script>

    import { reactive, watch } from 'vue'

    // import countries from './lib/api/countries.js?url'
    import countries from './lib/data.js'

    let nameSort = (a,b) => a.name.localeCompare(b.name)
    let numSort = (a,b) => a-b
    let startsWith = (long, short) => spell(long).startsWith(spell(short))
    let filtered = [...countries]

    function spell(str) {
      let remove = ['.','.',"'"]
      for (let char of remove) {
        str = str.replaceAll(char, '')
      }
      return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    }
    
    filtered.sort(nameSort)

    const theme = localStorage.getItem('geoMoose-theme')
    function setTheme() {
      document.body.classList = store.dark ? "dark" : ""
    }

    export const store = reactive({
      countries,
      filtered,
      dark: theme==='true'?true:false,
      filters: {
        sort: 'name',
        desc: 'off',
        q: '',
        reg: 'all',
        dep: 'off'
      }
    })

    setTheme()
    filterDep()
    sort()

    watch(() => store.dark, setTheme)
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
    watch(() => store.filters.sort, sort)
    watch(() => store.filters.dep, ()=>{
      filterDep()
      sort()
    })
    
    function filterDep() {
      // console.log(store.filters.dep)
      store.filtered = store.countries.filter(c => {
        if (store.filters.dep === 'on') {
          return true
        } else {
          return c.independent
        }
      })
    }

    function sort() {
      let desc = store.filters.desc
      const key = store.filters.sort
      store.filtered.sort((a,b) => {
        try {
          checkMissingKey(a)
          let A = desc == 'on' ? b[key] : a[key]
          let B = desc == 'on' ? a[key] : b[key]
          return typeof A === 'number' ? (A-B) : (A.localeCompare(B))
        } catch {
          console.log(`
            ${a.name}
            ${a[key]}
            ${b.name}
            ${b[key]}
          `)
        }
      })
    }

    function checkMissingKey(c) {
      c.missingSortKey = !c[store.filters.sort]
    }

</script>

<template>
  <Header />
  <main>
    <router-view v-if="store.filtered"/>
  </main>
</template>
