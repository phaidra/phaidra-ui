<template>
  <v-text-field 
    :value="value" 
    v-on:input="$emit('input', $event)" 
    :label="label" 
    :required="required"
    :rules="rules"></v-text-field>
</template>

<script>
export default {
  name: 'p-text-field',
  props: {
    value: {
      type: String,
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
      x: ''
    }
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
