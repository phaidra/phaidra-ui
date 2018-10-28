<template>
  <v-flex>

    <v-layout row v-if="license.url">
      <v-flex>
        <img v-if="license.type === 'CC BY'" src="../../assets/cc-by.png" :alt="license.type" class="license-icon"/>
        <img v-if="license.type === 'CC BY-SA'" src="../../assets/cc-by-sa.png" :alt="license.type" class="license-icon"/>
        <img v-if="license.type === 'CC BY-NC'" src="../../assets/cc-by-nc.png" :alt="license.type" class="license-icon"/>
        <img v-if="license.type === 'CC BY-ND'" src="../../assets/cc-by-nd.png" :alt="license.type" class="license-icon"/>
        <img v-if="license.type === 'CC BY-NC-SA'" src="../../assets/cc-by-nc-sa.png" :alt="license.type" class="license-icon"/>
        <img v-if="license.type === 'CC BY-NC-ND'" src="../../assets/cc-by-nc-nd.png" :alt="license.type" class="license-icon"/>
        <img v-if="license.type === 'GPLv3'" src="../../assets/gplv3.png" :alt="license.type" class="license-icon"/>
        <img v-if="license.type === 'Public Domain Mark'" src="../../assets/pdm.png" :alt="license.type" class="license-icon"/>
        <a :href="license.url" target="_blank" class="mr-2 license-label">
          <span v-if="license.version" :title="license.type + license.version">{{ $t(license.type) + ' ' + license.version }}</span>
          <span v-if="!license.version" :title="license.type">{{ $t(license.type) }}</span>
        </a>
      </v-flex>
    </v-layout>

    <v-layout row v-if="license.type === 'Copyright'">
      <v-flex>
        <span :title="$t('All rights reserved')">© {{ $t('All rights reserved') }}</span>
      </v-flex>
    </v-layout>

  </v-flex>
</template>

<script>

export default {
  name: 'p-d-license',
  props: {
    dclicense: String,
    required: true
  },
  computed: {
    license () {
      switch (this.dclicense) {
        case 'http://creativecommons.org/licenses/by/2.0/':
        case 'CC BY 2.0 Generic':
          return { type: 'CC BY', version: '2.0', url: 'http://creativecommons.org/licenses/by/2.0/' }
        case 'http://creativecommons.org/licenses/by/2.0/at/':
        case 'CC BY 2.0 Austria':
          return { type: 'CC BY', version: '2.0 AT', url: 'http://creativecommons.org/licenses/by/2.0/at/' }
        case 'http://creativecommons.org/licenses/by/3.0/':
        case 'CC BY 3.0 Unported':
          return { type: 'CC BY', version: '3.0', url: 'http://creativecommons.org/licenses/by/3.0/' }
        case 'http://creativecommons.org/licenses/by/3.0/at/':
        case 'CC BY 3.0 Austria':
          return { type: 'CC BY', version: '3.0 AT', url: 'http://creativecommons.org/licenses/by/3.0/at/' }
        case 'http://creativecommons.org/licenses/by/4.0/':
        case 'CC BY 4.0 International':
          return { type: 'CC BY', version: '4.0', url: 'http://creativecommons.org/licenses/by/4.0/' }
        //
        case 'http://creativecommons.org/licenses/by-sa/2.0/':
        case 'CC BY-SA 2.0 Generic':
          return { type: 'CC BY-SA', version: '2.0', url: 'http://creativecommons.org/licenses/by-sa/2.0/' }
        case 'http://creativecommons.org/licenses/by-sa/2.0/at/':
        case 'CC BY-SA 2.0 Austria':
          return { type: 'CC BY-SA', version: '2.0 AT', url: 'http://creativecommons.org/licenses/by-sa/2.0/at/' }
        case 'http://creativecommons.org/licenses/by-sa/3.0/':
        case 'CC BY-SA 3.0 Unported':
          return { type: 'CC BY-SA', version: '3.0', url: 'http://creativecommons.org/licenses/by-sa/3.0/' }
        case 'http://creativecommons.org/licenses/by-sa/3.0/at/':
        case 'CC BY-SA 3.0 Austria':
          return { type: 'CC BY-SA', version: '3.0 AT', url: 'http://creativecommons.org/licenses/by-sa/3.0/at/' }
        case 'http://creativecommons.org/licenses/by-sa/4.0/':
        case 'CC BY-SA 4.0 International':
          return { type: 'CC BY-SA', version: '4.0', url: 'http://creativecommons.org/licenses/by-sa/4.0/' }
        //
        case 'http://creativecommons.org/licenses/by-nc/2.0/':
        case 'CC BY-NC 2.0 Generic':
          return { type: 'CC BY-NC', version: '2.0', url: 'http://creativecommons.org/licenses/by-nc/2.0/' }
        case 'http://creativecommons.org/licenses/by-nc/2.0/at/':
        case 'CC BY-NC 2.0 Austria':
          return { type: 'CC BY-NC', version: '2.0 AT', url: 'http://creativecommons.org/licenses/by-nc/2.0/at/' }
        case 'http://creativecommons.org/licenses/by-nc/3.0/':
        case 'CC BY-NC 3.0 Unported':
          return { type: 'CC BY-NC', version: '3.0', url: 'http://creativecommons.org/licenses/by-nc/3.0/' }
        case 'http://creativecommons.org/licenses/by-nc/3.0/at/':
        case 'CC BY-NC 3.0 Austria':
          return { type: 'CC BY-NC', version: '3.0 AT', url: 'http://creativecommons.org/licenses/by-nc/3.0/at/' }
        case 'http://creativecommons.org/licenses/by-nc/4.0/':
        case 'CC BY-NC 4.0 International':
          return { type: 'CC BY-NC', version: '4.0', url: 'http://creativecommons.org/licenses/by-nc/4.0/' }
        //
        case 'http://creativecommons.org/licenses/by-nd/2.0/':
        case 'CC BY-ND 2.0 Generic':
          return { type: 'CC BY-ND', version: '2.0', url: 'http://creativecommons.org/licenses/by-nd/2.0/' }
        case 'http://creativecommons.org/licenses/by-nd/2.0/at/':
        case 'CC BY-ND 2.0 Austria':
          return { type: 'CC BY-ND', version: '2.0 AT', url: 'http://creativecommons.org/licenses/by-nd/2.0/at/' }
        case 'http://creativecommons.org/licenses/by-nd/3.0/':
        case 'CC BY-ND 3.0 Unported':
          return { type: 'CC BY-ND', version: '3.0', url: 'http://creativecommons.org/licenses/by-nd/3.0/' }
        case 'http://creativecommons.org/licenses/by-nd/3.0/at/':
        case 'CC BY-ND 3.0 Austria':
          return { type: 'CC BY-ND', version: '3.0 AT', url: 'http://creativecommons.org/licenses/by-nd/3.0/at/' }
        case 'http://creativecommons.org/licenses/by-nd/4.0/':
        case 'CC BY-ND 4.0 International':
          return { type: 'CC BY-ND', version: '4.0', url: 'http://creativecommons.org/licenses/by-nd/4.0/' }
        //
        case 'http://creativecommons.org/licenses/by-nc-sa/2.0/':
        case 'CC BY-NC-SA 2.0 Generic':
          return { type: 'CC BY-NC-SA', version: '2.0', url: 'http://creativecommons.org/licenses/by-nc-sa/2.0/' }
        case 'http://creativecommons.org/licenses/by-nc-sa/2.0/at/':
        case 'CC BY-NC-SA 2.0 Austria':
          return { type: 'CC BY-NC-SA', version: '2.0 AT', url: 'http://creativecommons.org/licenses/by-nc-sa/2.0/at/' }
        case 'http://creativecommons.org/licenses/by-nc-sa/3.0/':
        case 'CC BY-NC-SA 3.0 Unported':
          return { type: 'CC BY-NC-SA', version: '3.0', url: 'http://creativecommons.org/licenses/by-nc-sa/3.0/' }
        case 'http://creativecommons.org/licenses/by-nc-sa/3.0/at/':
        case 'CC BY-NC-SA 3.0 Austria':
          return { type: 'CC BY-NC-SA', version: '3.0 AT', url: 'http://creativecommons.org/licenses/by-nc-sa/3.0/at/' }
        case 'http://creativecommons.org/licenses/by-nc-sa/4.0/':
        case 'CC BY-NC-SA 4.0 International':
          return { type: 'CC BY-NC-SA', version: '4.0', url: 'http://creativecommons.org/licenses/by-nc-sa/4.0/' }
        //
        case 'http://creativecommons.org/licenses/by-nc-nd/2.0/':
        case 'CC BY-NC-ND 2.0 Generic':
          return { type: 'CC BY-NC-ND', version: '2.0', url: 'http://creativecommons.org/licenses/by-nc-nd/2.0/' }
        case 'http://creativecommons.org/licenses/by-nc-nd/2.0/at/':
        case 'CC BY-NC-ND 2.0 Austria':
          return { type: 'CC BY-NC-ND', version: '2.0 AT', url: 'http://creativecommons.org/licenses/by-nc-nd/2.0/at/' }
        case 'http://creativecommons.org/licenses/by-nc-nd/3.0/':
        case 'CC BY-NC-ND 3.0 Unported':
          return { type: 'CC BY-NC-ND', version: '3.0', url: 'http://creativecommons.org/licenses/by-nc-nd/3.0/' }
        case 'http://creativecommons.org/licenses/by-nc-nd/3.0/at/':
        case 'CC BY-NC-ND 3.0 Austria':
          return { type: 'CC BY-NC-ND', version: '3.0 AT', url: 'http://creativecommons.org/licenses/by-nc-nd/3.0/at/' }
        case 'http://creativecommons.org/licenses/by-nc-nd/4.0/':
        case 'CC BY-NC-ND 4.0 International':
          return { type: 'CC BY-NC-ND', version: '4.0', url: 'http://creativecommons.org/licenses/by-nc-nd/4.0/' }
        //
        case 'http://www.gnu.org/licenses/gpl-3.0.txt':
        case 'GPLv3':
          return { type: 'GPLv3', url: 'http://www.gnu.org/licenses/gpl-3.0.txt' }
        //
        case 'http://creativecommons.org/publicdomain/mark/1.0/':
        case 'Public Domain Mark':
          return { type: 'Public Domain Mark', url: 'http://creativecommons.org/publicdomain/mark/1.0/' }
        //
        default:
          return { type: 'Copyright' }
      }
    }
  }
}
</script>

<style scoped>

.license-icon {
  height: 1.3em;
  vertical-align: text-bottom;
}

.license-label {
  vertical-align: middle;
}

</style>
