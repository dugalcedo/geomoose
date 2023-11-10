<script setup>
    import FieldSet from './FieldSet.vue'
    let {left, right = "", colon} = defineProps(['left', 'right', 'colon'])
    const isPlural = typeof right !== 'string' && right.length > 1
    function plural() {
        return !isPlural ? 
            left :
            left.endsWith('y') ? 
                left.slice(0,left.length-1)+"ies"
                :
                left + "s"
    }
</script>

<template>
    <div class="field" v-if="right">
        <div class="prop">
            {{ plural() }}{{ colon || ":" }}
        </div>
        <div class="val">
            <div v-if="Array.isArray(right)" v-for="item in right">
                <div v-if="typeof item === 'string'">
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