<template>
    <section class="checkbox-wrapper">
        <div :class="{'check-box': true, checked: checked}" @click="toggleCheck">
            <div class="check-box indicator"></div>
        </div>
        <span class="body-2 text-gray-7" v-if="label">{{label}}</span>
    </section>
    
</template> 

<script lang="ts">
export default {
    data: () => ({
        checked: false,
    }),
    emits: ['onCheck'],
    props: {
        label: {
            type: String,
            default: '',
            required: false,
        }
    },
    methods: {
        toggleCheck() {
            this.checked = !this.checked;
            this.$emit('onCheck', this.checked);
        }
    }
}
</script>

<style scoped>
.checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
}
</style>