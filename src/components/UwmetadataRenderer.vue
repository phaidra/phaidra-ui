<template>
  <v-container>
    <v-row >
      <v-col cols="10">
        <v-row>
          <v-col v-if="node.input_type === 'node'">
            <v-card>
              <v-card-text>
                <v-col class="caption grey--text" cols="4">{{ $t(nodepath) }}</v-col>
                <uwmetadata-renderer v-for="(child,i) in node.children" :key="i" :node="child" :path="nodepath"></uwmetadata-renderer>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col v-else-if="node.input_type === 'input_text'">
            <v-col v-if="node.xmlname === 'description'">
              <v-text-field :label="$t(nodepath)" v-model="node.ui_value" multi-line :disabled="disabled"></v-text-field>
            </v-col>
            <v-col v-else-if="node.xmlname === 'data_order'">
              <v-text-field :label="$t('Order')" v-bind:value="node.ui_value" :disabled="disabled"></v-text-field>
            </v-col>
            <v-col v-else>
              <v-col v-if="node.datatype === 'DateTime'">
                <v-text-field :label="$t(nodepath)" v-bind:value="node.ui_value | time" :disabled="disabled"></v-text-field>
              </v-col>
              <v-col v-else>
                <v-text-field :label="$t(nodepath)" v-model="node.ui_value" :disabled="disabled"></v-text-field>
              </v-col>
            </v-col>
          </v-col>
          <v-col v-else-if="node.input_type === 'select'">
            <v-col v-if="(node.xmlname === 'lang') || (node.xmlname === 'language')">
              <v-text-field :label="$t('Language')" v-bind:value="$t('lang_' + node.ui_value)" :disabled="disabled"></v-text-field>
            </v-col>
            <v-col v-else-if="node.xmlname === 'taxon'">
              <v-text-field :label="$t('Taxon')" v-bind:value="node.ui_value" :disabled="disabled"></v-text-field>
            </v-col>
            <v-col v-else>
              <v-select :label="$t(nodepath)" v-model="node.labels[$i18n.locale]" :items="[node.labels[$i18n.locale]]" :disabled="disabled"></v-select>
            </v-col>
          </v-col>
          <v-col v-else class="red">
            Metadata error: Unsupported input type
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2">
        <uwmetadata-renderer v-for="(a,j) in node.attributes" :key="j" :node="a" :path="nodepath"></uwmetadata-renderer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { context } from '../mixins/context'

export default {
  name: 'uwmetadata-renderer',
  mixins: [ context ],
  props: {
    node: Object,
    path: {
      type: String,
      default: ''
    }
  },
  computed: {
    nodepath: function () {
      return this.path ? this.path + '_' + this.node.xmlname : this.node.xmlname
    }
  },
  data () {
    return {
      active: null,
      disabled: true
    }
  },
  methods: {
    next () {

    }
  }
}
</script>

<style scoped>
.container {
  padding-top: 4px;
  padding-bottom: 0px;
}

.v-input__slot {
  background-color: #fff;
}
</style>
