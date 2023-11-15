<script setup>
    import FieldSet from './FieldSet.vue'
    let {left, right = "", colon} = defineProps(['left', 'right', 'colon'])
    const isPlural = (typeof right !== 'string') && right.length > 1
    function plural() {
        if (!isPlural) {
            return left
        } else {
            switch(true) {
                case left.endsWith('y'):
                    return left.slice(0,left.length-1)+"ies"
                case left.endsWith('sh'):
                    return left + "es"
                default:
                    return left + "s"
            }
        }
    }
    function strOrNum(v) {
        return typeof v === 'string' || typeof v === 'number'
    }
</script>

<template>
    <div class="field" v-if="right">
        <div class="prop">
            {{ plural() }}{{ colon || ":" }}
        </div>
        <div class="val">
            <div v-if="Array.isArray(right)" v-for="item in right">
                <div v-if="strOrNum(item)">
                    {{ item }}
                </div>
                <FieldSet v-else
                :info="item"/>
            </div>
            <div v-else-if="typeof right == 'object'">
                <Field v-for="[l,r] in Object.entries(right)" :left="l" :right="r" />
            </div>
            <div v-else>
                {{ right }}
            </div>
        </div>
    </div>
</template>