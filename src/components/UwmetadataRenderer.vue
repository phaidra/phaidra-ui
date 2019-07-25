<template>
  <v-container>
    <v-layout row>
      <v-flex xs10>
        <v-layout column>
          <v-flex v-if="node.input_type === 'node'">
            <v-card>
              <v-card-text>
                <v-flex class="caption grey--text" xs4>{{ $t(nodepath) }}</v-flex>
                <uwmetadata-renderer v-for="(child,i) in node.children" :key="i" :node="child" :path="nodepath"></uwmetadata-renderer>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex v-else-if="node.input_type === 'input_text'">
            <v-flex v-if="node.xmlname === 'description'">
              <v-text-field :label="$t(nodepath)" v-model="node.ui_value" multi-line :disabled="disabled"></v-text-field>
            </v-flex>
            <v-flex v-else-if="node.xmlname === 'data_order'">
              <v-text-field :label="$t('Order')" v-bind:value="node.ui_value" :disabled="disabled"></v-text-field>
            </v-flex>
            <v-flex v-else>
              <v-flex v-if="node.datatype === 'DateTime'">
                <v-text-field :label="$t(nodepath)" v-bind:value="node.ui_value | time" :disabled="disabled"></v-text-field>
              </v-flex>
              <v-flex v-else>
                <v-text-field :label="$t(nodepath)" v-model="node.ui_value" :disabled="disabled"></v-text-field>
              </v-flex>
            </v-flex>
          </v-flex>
          <v-flex v-else-if="node.input_type === 'select'">
            <v-flex v-if="(node.xmlname === 'lang') || (node.xmlname === 'language')">
              <v-text-field :label="$t('Language')" v-bind:value="$t('lang_' + node.ui_value)" :disabled="disabled"></v-text-field>
            </v-flex>
            <v-flex v-else-if="node.xmlname === 'taxon'">
              <v-text-field :label="$t('Taxon')" v-bind:value="node.ui_value" :disabled="disabled"></v-text-field>
            </v-flex>
            <v-flex v-else>
              <v-select :label="$t(nodepath)" v-model="node.labels[$i18n.locale]" :items="[node.labels[$i18n.locale]]" :disabled="disabled"></v-select>
            </v-flex>
          </v-flex>
          <v-flex v-else class="red">
            Metadata error: Unsupported input type
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs2>
        <uwmetadata-renderer v-for="(a,j) in node.attributes" :key="j" :node="a" :path="nodepath"></uwmetadata-renderer>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'uwmetadata-renderer',
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
