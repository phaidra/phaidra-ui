<template>
  <v-layout column>
    <v-flex>
      <span class="youarehere">{{$t('You are here')}}:</span>
      <template v-for="(item) in items">
        <icon left dark name="univie-right" color="#a4a4a4" width="8px" height="8px" class="mx-1"></icon>
        <span v-if="item.disabled" class="text">{{item.text}}</span>
        <template v-else>
          <a v-if="item.external" :href="item.to" class="text">{{item.text}}</a>
          <router-link v-else :to="item.to" class="text">{{item.text}}</router-link>
        </template>
      </template>
    </v-flex>
    <v-divider class="mb-4"></v-divider>
  </v-layout>
</template>

<script>
export default {
  name: 'p-breadcrumbs',
  props: {
    items: Array
  }
}
</script>

<style scoped>
.youarehere {
  font-weight: bold;
  font-size: 10pt;
}

.text {
  font-size: 10pt;
}
</style>
