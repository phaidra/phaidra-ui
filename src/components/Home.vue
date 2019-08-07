<template>
  <div class="home">
    <h5>{{ $t("PHAIDRA_IS") }}</h5>
  </div>
</template>

<script>
import { context } from '../mixins/context'

export default {
  name: 'home',
  mixins: [ context ]
}
</script>

<style scoped>

</style>
