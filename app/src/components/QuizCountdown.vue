<script setup>
    import dayjs from 'dayjs'
    import utc from 'dayjs/plugin/utc'
    import { ref } from 'vue'
    dayjs.extend(utc)
    const floorPad = n => {
        n = Math.floor(n)
        return n > 9 ? n : '0'+n
    }
    function getRemaining() {
        const now = dayjs().utc()
        const tomorrow = 
            dayjs()
            .utc()
            .add(1, 'day')
            .hour(0)
            .minute(0)
            .second(0)
        let rms = tomorrow - now
        let rs = rms/1000
        let s = rs%60
        let rm = rs/60
        let m = rm%60
        let h = rm/60
        return `${floorPad(h)}:${floorPad(m)}:${floorPad(s)}`
    }
    let r = ref(getRemaining())
    setInterval(() => {
        r.value = getRemaining()
    }, 1000);
</script>

<template>
    <span style="font-family: monospace;font-size: 14px;">{{ r }}</span>
</template>