<template>
  <v-select 
    :value="value" 
    v-on:input="$emit('input', $event)" 
    :label="label" 
    :required="required"
    :rules="rules"
    :loading="loading"
    :items="items"
    ></v-select>
</template>

<script>
export default {
  name: 'p-select',
  props: {
    value: {
      type: [String, Object],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    required: {
      type: Boolean
    },
    rules: {
      type: Array
    }
  },
  data () {
    return {
      loading: false,
      items: []
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.loading = true
      this.loading = false
    })
  }
}
</script>

<style scoped>
/*
.form-background {
  background-color: #f3f3f3;
}
*/
</style>
