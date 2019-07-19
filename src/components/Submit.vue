<template>
  <div>
    <v-btn raised :to="'submit/ksa-eda'">{{ $t("KSA EDA") }}</v-btn>
    <v-btn raised :to="'submit/empty'">{{ $t("Test") }}</v-btn>
  </div>
</template>

<script>
export default {
  name: 'submit'
}
</script>

<style scoped>

</style>
