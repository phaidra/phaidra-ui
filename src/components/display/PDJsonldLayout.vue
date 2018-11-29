<template>
  <v-container  grid-list-lg>
    <v-layout column>
      <slot name="dce:title"></slot>
      <slot name="role"></slot>
      <slot name="bf:note"></slot>
      
      <slot name="dcterms:language"></slot>
      <slot name="dce:subject"></slot>
      <slot name="schema:temporalCoverage"></slot>
      <slot name="dcterms:spatial"></slot>

      <slot name="dcterms:type"></slot>

      <slot name="dcterms:issued"></slot>
      <slot name="edm:rights"></slot>
      <slot name="dce:rights"></slot>
      <slot name="frapo:hasFundingAgency"></slot>
      <slot name="frapo:isOutputOf"></slot>
      <slot name="dcterms:provenance"></slot>

      <slot name="phaidra:Subject"></slot>

      <slot name="opaque:cco_accessionNumber"></slot>
      <slot name="bf:shelfMark"></slot>
      <slot name="bf:physicalLocation"></slot>

      <slot name="vra:hasInscription"></slot>
      <slot name="vra:material"></slot>
      <slot name="vra:hasTechnique"></slot>
      <slot name="schema:width"></slot>
      <slot name="schema:height"></slot>
      <slot name="schema:depth"></slot>
      <slot name="schema:weight"></slot>
      
      <slot name="ebucore:filename"></slot>
      <slot name="ebucore:hasMimeType"></slot>

      <slot name="prov:wasDerivedFrom"></slot>
      
      <slot name="unknown-predicate"></slot>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  name: 'p-d-jsonld-layout'
}
</script>