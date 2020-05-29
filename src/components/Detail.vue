<template>
  <v-container fluid>

    <v-row v-if="objectInfo">

        <v-col cols="12" md="8">

          <v-row justify="center">
            <a :href="objectInfo.dshash['WEBVERSION'] ? instanceconfig.api + '/object/' + objectInfo.pid + '/diss/Content/getwebversion' : instanceconfig.api + '/object/' + objectInfo.pid + '/diss/Content/get'">
              <img v-if="(objectInfo.cmodel === 'PDFDocument') && (instanceconfig.baseurl === 'e-book.fwf.ac.at')" :src="'https://fedora.e-book.fwf.ac.at/fedora/get/' + objectInfo.pid + '/bdef:Document/preview?box=480'"  class="elevation-1">
              <img v-else-if="objectInfo.cmodel === 'PDFDocument'" class="elevation-1" :src="'https://' + instanceconfig.baseurl + '/preview/' + objectInfo.pid + '/Document/preview/480'" />
              <img v-else-if="objectInfo.cmodel === 'Picture' || objectInfo.cmodel === 'Page'" class="elevation-1" :src="'https://' + instanceconfig.baseurl + '/preview/' + objectInfo.pid + '/ImageManipulator/boxImage/480/png'" />
              <img v-else-if="objectInfo.cmodel === 'Book'" class="elevation-1" :src="'https://' + instanceconfig.baseurl + '/preview/' + coverPid + '/ImageManipulator/boxImage/480/png'" />
            </a>
            <template v-if="(objectInfo.cmodel === 'Audio')">
              <audio controls>
                <source :src="objectInfo.dshash['WEBVERSION'] ? instanceconfig.api + '/object/' + objectInfo.pid + '/diss/Content/getwebversion' : instanceconfig.api + '/object/' + objectInfo.pid + '/diss/Content/get'">
                Your browser does not support the audio element.
              </audio>
            </template>
          </v-row>

          <v-divider class="mt-12 mb-10"></v-divider>

          <v-row justify="center" v-if="objectInfo.dshash['JSON-LD']">
            <p-d-jsonld :jsonld="objectInfo.metadata['JSON-LD']" :pid="objectInfo.pid"></p-d-jsonld>
          </v-row>

          <v-row v-if="objectInfo.dshash['UWMETADATA']">
            <p-d-uwm-rec :children="objectInfo.metadata['uwmetadata']"></p-d-uwm-rec>
          </v-row>

          <v-row no-gutters class="mt-6" v-if="objectInfo.cmodel === 'Collection'">
            <router-link class="title font-weight-light primary--text showmembers" :to="{ path: '/search', query: { collection: objectInfo.pid } }">{{ $t('Show members') }} ({{ objectInfo.haspartsize }})</router-link>
          </v-row>

          <template v-if="objectInfo.cmodel === 'Container'">
            <h3 class="title font-weight-light grey--text text--darken-2">{{$t('Members')}} ({{objectInfo.members.length}})</h3>

            <v-row v-if="objectMembers">
              <v-card class="mb-3 pt-4" width="100%" v-for="(member) in objectMembers" :key="'member_'+member.pid">
                <a :href="member.datastreams.includes('WEBVERSION') ? instanceconfig.api + '/object/' + member.pid + '/diss/Content/getwebversion' : instanceconfig.api + '/object/' + member.pid + '/diss/Content/get'">
                  <v-img class="mb-3" max-height="300" contain v-if="member.cmodel === 'PDFDocument'" :src="'https://' + instanceconfig.baseurl + '/preview/' + member.pid + '/Document/preview/480'" />
                  <v-img class="mb-3" max-height="300" contain v-else-if="member.cmodel === 'Picture' || member.cmodel === 'Page'" :src="'https://' + instanceconfig.baseurl + '/preview/' + member.pid + '/ImageManipulator/boxImage/480/png'" />
                </a>
                <center v-if="(member.cmodel === 'Audio')">
                  <audio controls>
                    <source :src="member.datastreams.includes('WEBVERSION') ? instanceconfig.api + '/object/' + member.pid + '/diss/Content/getwebversion' : instanceconfig.api + '/object/' + member.pid + '/diss/Content/get'">
                    Your browser does not support the audio element.
                  </audio>
                </center>
                <v-card-text class="ma-2">
                  <p-d-jsonld :jsonld="member.metadata['JSON-LD']" :pid="member.pid"></p-d-jsonld>
                </v-card-text>
                <v-divider light v-if="objectInfo.readrights"></v-divider>
                <v-card-actions class="pa-3" v-if="objectInfo.readrights">
                  <v-spacer></v-spacer>
                  <v-btn v-if="member.cmodel === 'Picture'" target="_blank" :href="'https://' + instanceconfig.baseurl + '/imageserver/' + member.pid" primary>{{ $t('View') }}</v-btn>
                  <v-btn :href="getMemberDownloadUrl(member)" primary>{{ $t('Download') }}</v-btn>
                  <v-menu offset-y v-if="objectInfo.writerights === 1">
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark v-on="on">{{ $t('Edit') }}<v-icon right dark>arrow_drop_down</v-icon></v-btn>
                    </template>
                    <v-list>
                      <v-list-item :to="{ name: 'metadataeditor', params: { pid: member.pid } }">
                        <v-list-item-title>{{ $t('Edit metadata') }}</v-list-item-title>
                      </v-list-item>
                      <v-list-item :to="{ name: 'rights', params: { pid: member.pid } }">
                        <v-list-item-title>{{ $t('Access rights') }}</v-list-item-title>
                      </v-list-item>
                      <v-list-item :to="{ name: 'relationships', params: { pid: member.pid } }">
                        <v-list-item-title>{{ $t('Relationships') }}</v-list-item-title>
                      </v-list-item>
                      <v-list-item :to="{ name: 'delete', params: { pid: member.pid } }">
                        <v-list-item-title>{{ $t('Delete') }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-card-actions>
              </v-card>
            </v-row>
          </template>

        </v-col>

        <v-col cols="12" md="3" offset-md="1">

          <v-row class="mb-6">
            <v-col class="pt-0">
              <v-card tile>
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('Identifiers') }}</v-card-title>
                <v-card-text class="mt-4">
                  <v-row no-gutters class="pt-2">
                    <v-col class="caption grey--text text--darken-2" cols="2">{{ $t('PID') }}</v-col>
                    <v-col cols="9" offset="1">{{ 'https://' + instanceconfig.baseurl + '/' + objectInfo.pid }}</v-col>
                  </v-row>
                  <v-row no-gutters class="pt-2" v-if="objectInfo.dc_identifier.length > 1">
                    <v-col class="caption grey--text text--darken-2" cols="2">{{ $t('ID') }}</v-col>
                    <v-col cols="9" offset="1" v-for="(id,i) in objectInfo.dc_identifier" :key="i" v-show="(id !== 'https://' + instanceconfig.baseurl + '/' + objectInfo.pid) && (id !== 'http://' + instanceconfig.baseurl + '/' + objectInfo.pid)">
                      {{ id }}
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="my-6">
            <v-col class="pt-0">
              <v-card tile>
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('Details') }}</v-card-title>
                <v-card-text class="mt-4">
                  <v-row no-gutters class="pt-2">
                    <v-col class="caption grey--text text--darken-2" cols="3">Depositor</v-col>
                    <v-col cols="8" offset="1" v-if="objectInfo.owner.firstname">
                      <a :href="'mailto:' + objectInfo.owner.email">{{ objectInfo.owner.firstname }} {{ objectInfo.owner.lastname }}</a>
                    </v-col>
                    <v-col v-else cols="8">{{ objectInfo.owner.username }}</v-col>
                  </v-row>
                  <v-row no-gutters class="pt-2">
                    <v-col class="caption grey--text text--darken-2" cols="3">{{ $t('Object type') }}</v-col>
                    <v-col cols="8" offset="1">{{ objectInfo.cmodel }}</v-col>
                  </v-row>
                  <v-row v-if="objectInfo.dc_format" no-gutters class="pt-2">
                    <v-col class="caption grey--text text--darken-2" cols="3">{{ $t('Format') }}</v-col>
                    <v-col cols="8" offset="1">
                      <template v-if="objectInfo.dc_format.length > 1">
                        <v-row>
                          <v-col v-for="(v,i) in objectInfo.dc_format" :key="i">{{ v }}</v-col>
                        </v-row>
                      </template>
                      <template v-else>{{ objectInfo.dc_format[0] }}</template>
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="pt-2">
                    <v-col class="caption grey--text text--darken-2" cols="3">{{ $t('Created') }}</v-col>
                    <v-col cols="8" offset="1">{{ objectInfo.created | datetimeutc }}</v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-if="objectInfo.versions.length > 0" class="my-6">
            <v-col class="pt-0">
              <v-card tile>
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('Versions') }}</v-card-title>
                <v-card-text class="mt-4">
                  <template v-for="(rel, i) in objectInfo.versions">
                    <v-row :key="'version'+i">
                      <v-col cols="12" md="5">{{ rel.created | date }}</v-col>
                      <v-col cols="12" md="7">
                        <router-link :to="{ name: 'detail', params: { pid: rel.pid } }">{{ rel.dc_title[0] }}</router-link>
                      </v-col>
                    </v-row>
                    <v-divider v-if="(i+1) < objectInfo.versions.length" :key="'versiond'+i"></v-divider>
                  </template>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-if="objectInfo.alternativeversions.length > 0" class="my-6">
            <v-col class="pt-0">
              <v-card tile>
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('Alternative versions') }}</v-card-title>
                <v-card-text class="mt-4">
                  <template v-for="(rel, i) in objectInfo.alternativeversions">
                    <v-row :key="'version'+i">
                      <v-col cols="12" md="12">
                        <router-link :to="{ name: 'detail', params: { pid: rel.pid } }">{{ rel.dc_title[0] }}</router-link>
                      </v-col>
                    </v-row>
                    <v-divider v-if="(i+1) < objectInfo.alternativeversions.length" :key="'altversiond'+i"></v-divider>
                  </template>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-if="objectInfo.alternativeformats.length > 0" class="my-6">
            <v-col class="pt-0">
              <v-card tile>
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('Alternative formats') }}</v-card-title>
                <v-card-text class="mt-4">
                  <template v-for="(rel, i) in objectInfo.alternativeformats">
                    <v-row :key="'version'+i">
                      <v-col cols="12" md="5">{{ rel.dc_format[0] }}</v-col>
                      <v-col cols="12" md="7">
                        <router-link :to="{ name: 'detail', params: { pid: rel.pid } }">{{ rel.dc_title[0] }}</router-link>
                      </v-col>
                    </v-row>
                    <v-divider v-if="(i+1) < objectInfo.alternativeformats.length" :key="'altformatsd'+i"></v-divider>
                  </template>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-if="objectInfo.relationships.ispartof.length > 0" class="my-6">
            <v-col class="pt-0">
              <v-card tile>
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('This object is in collection') }}</v-card-title>
                <v-card-text class="mt-4">
                  <tempalte v-for="(rel, i) in objectInfo.relationships.ispartof" :key="'ispartoft'+i">
                    <v-row :key="'ispartof'+i">
                      <v-col cols="12" md="5" class="preview-maxwidth">
                        <p-img :src="'https://' + instanceconfig.baseurl + '/preview/' + rel.pid + '///120'" class="elevation-1 mt-2"></p-img>
                      </v-col>
                      <v-col cols="12" md="7">
                        <router-link :to="{ name: 'detail', params: { pid: rel.pid } }">{{ rel.dc_title[0] }}</router-link>
                      </v-col>
                    </v-row>
                    <v-divider :key="'ispartofd'+i" v-if="(i+1) < objectInfo.relationships.ispartof.length"></v-divider>
                  </tempalte>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-if="objectInfo.relationships.isbacksideof.length > 0" class="my-6">
            <v-col class="pt-0">
              <v-card tile>
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('This object is a back side of') }}</v-card-title>
                <v-card-text class="mt-4">
                  <template  v-for="(rel, i) in objectInfo.relationships.isbacksideof">
                    <v-row :key="'isbacksideof'+i" align="center">
                      <v-col cols="12" md="5" class="preview-maxwidth">
                        <p-img :src="'https://' + instanceconfig.baseurl + '/preview/' + rel.pid + '///120'" class="elevation-1 mt-2"></p-img>
                      </v-col>
                      <v-col cols="12" md="7">
                        <router-link :to="{ name: 'detail', params: { pid: rel.pid } }">{{ rel.dc_title[0] }}</router-link>
                      </v-col>
                    </v-row>
                    <v-divider :key="'isbacksideofd'+i" v-if="(i+1) < objectInfo.relationships.isbacksideof.length"></v-divider>
                  </template>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-if="objectInfo.relationships.hasbackside.length > 0" class="my-6">
            <v-col class="pt-0">
              <v-card tile>
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('This object has a back side') }}</v-card-title>
                <v-card-text class="mt-4">
                  <template v-for="(rel, i) in objectInfo.relationships.hasbackside">
                    <v-row :key="'hasbackside'+i" align="center">
                      <v-col cols="12" md="5" class="preview-maxwidth">
                        <p-img :src="'https://' + instanceconfig.baseurl + '/preview/' + rel.pid + '///120'" class="elevation-1 mt-2"></p-img>
                      </v-col>
                      <v-col cols="12" md="7">
                        <router-link :to="{ name: 'detail', params: { pid: rel.pid } }">{{ rel.dc_title[0] }}</router-link>
                      </v-col>
                    </v-row>
                    <v-divider :key="'hasbacksided'+i" v-if="(i+1) < objectInfo.relationships.hasbackside.length"></v-divider>
                  </template>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-if="objectInfo.relationships.isthumbnailfor.length > 0" class="my-6">
            <v-col class="pt-0">
              <v-card tile>
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('This object is thumbnail for') }}</v-card-title>
                <v-card-text class="mt-4">
                  <template v-for="(rel, i) in objectInfo.relationships.isthumbnailfor">
                    <v-row :key="'isthumbnailfor'+i" align="center">
                      <v-col cols="12" md="5" class="preview-maxwidth">
                        <p-img :src="'https://' + instanceconfig.baseurl + '/preview/' + rel.pid + '///120'" class="elevation-1 mt-2"></p-img>
                      </v-col>
                      <v-col cols="12" md="7">
                        <router-link :to="{ name: 'detail', params: { pid: rel.pid } }">{{ rel.dc_title[0] }}</router-link>
                      </v-col>
                    </v-row>
                    <v-divider :key="'isthumbnailford'+i" v-if="(i+1) < objectInfo.relationships.isthumbnailfor.length"></v-divider>
                  </template>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-if="objectInfo.relationships.hasthumbnail.length > 0" class="my-6">
            <v-col class="pt-0">
              <v-card tile>
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('This object has thumbnail') }}</v-card-title>
                <v-card-text class="mt-4">
                  <template v-for="(rel, i) in objectInfo.relationships.hasthumbnail">
                    <v-row :key="'hasthumbnail'+i" align="center">
                      <v-col cols="12" md="5" class="preview-maxwidth">
                        <p-img :src="'https://' + instanceconfig.baseurl + '/preview/' + rel.pid + '///120'" class="elevation-1 mt-2"></p-img>
                      </v-col>
                      <v-col cols="12" md="7">
                        <router-link :to="{ name: 'detail', params: { pid: rel.pid } }">{{ rel.dc_title[0] }}</router-link>
                      </v-col>
                    </v-row>
                    <v-divider :key="'hasthumbnaild'+i" v-if="(i+1) < objectInfo.relationships.hasthumbnail.length"></v-divider>
                  </template>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-if="objectInfo.relationships.references.length > 0" class="my-6">
            <v-col class="pt-0">
              <v-card tile>
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('This object references') }}</v-card-title>
                <v-card-text class="mt-4">
                  <template v-for="(rel, i) in objectInfo.relationships.references">
                    <v-row :key="'references'+i" align="center">
                      <v-col cols="12" md="5" class="preview-maxwidth">
                        <p-img :src="'https://' + instanceconfig.baseurl + '/preview/' + rel.pid + '///120'" class="elevation-1 mt-2"></p-img>
                      </v-col>
                      <v-col cols="12" md="7">
                        <router-link :to="{ name: 'detail', params: { pid: rel.pid } }">{{ rel.dc_title[0] }}</router-link>
                      </v-col>
                    </v-row>
                    <v-divider :key="'referencesd'+i" v-if="(i+1) < objectInfo.relationships.references.length"></v-divider>
                  </template>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-if="objectInfo.relationships.isreferencedby.length > 0" class="my-6">
            <v-col class="pt-0">
              <v-card tile>
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('This object is referenced by') }}</v-card-title>
                <v-card-text class="mt-4">
                  <template v-for="(rel, i) in objectInfo.relationships.isreferencedby">
                    <v-row :key="'isreferencedby'+i" align="center">
                      <v-col cols="12" md="5" class="preview-maxwidth">
                        <p-img :src="'https://' + instanceconfig.baseurl + '/preview/' + rel.pid + '///120'" class="elevation-1 mt-2"></p-img>
                      </v-col>
                      <v-col cols="12" md="7">
                        <router-link :to="{ name: 'detail', params: { pid: rel.pid } }">{{ rel.dc_title[0] }}</router-link>
                      </v-col>
                    </v-row>
                    <v-divider :key="'isreferencedbyd'+i" v-if="(i+1) < objectInfo.relationships.isreferencedby.length"></v-divider>
                  </template>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="my-6">
            <v-col class="pt-0">
              <v-card tile>
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('Metadata') }}</v-card-title>
                <v-card-text class="mt-4">
                  <v-row no-gutters class="pt-2">
                    <router-link :to="{ name: 'metadata' }">{{ $t('Show metadata') }}</router-link>
                  </v-row>
                  <v-row no-gutters class="pt-2" v-if="objectInfo.dshash['UWMETADATA']">
                    <a :href="instanceconfig.api + '/object/' + objectInfo.pid + '/uwmetadata?format=xml'" target="_blank">{{ $t('Metadata XML') }}</a>
                  </v-row>
                  <v-row no-gutters class="pt-2">
                    <a :href="instanceconfig.api + '/object/' + objectInfo.pid + '/index/dc'" target="_blank">{{ $t('Dublin Core') }}</a>
                  </v-row>
                  <v-row no-gutters class="pt-2" v-if="objectInfo.dshash['UWMETADATA']">
                    <a class="mb-1" :href="instanceconfig.api + '/object/' + objectInfo.pid + '/datacite?format=xml'" target="_blank">{{ $t('Data Cite') }}</a>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="my-6" v-if="objectInfo.writerights === 1">
            <v-col class="pt-0">
              <v-card tile>
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('Edit') }}</v-card-title>
                <v-card-text class="mt-4">
                  <v-row no-gutters class="pt-2" v-if="objectInfo.dshash['JSON-LD']">
                    <router-link :to="{ name: 'metadataeditor' }">{{ $t('Edit metadata') }}</router-link>
                  </v-row>
                  <v-row no-gutters class="pt-2" v-if="objectInfo.dshash['UWMETADATA']">
                    <router-link :to="{ name: 'uwmetadataeditor' }">{{ $t('Edit metadata') }}</router-link>
                  </v-row>
                  <v-row no-gutters class="pt-2" v-if="(objectInfo.cmodel === 'Container') || (objectInfo.cmodel === 'Collection')">
                    <router-link class="mb-1" :to="{ name: 'sort' }">{{ $t('Sort members') }}</router-link>
                  </v-row>
                  <v-row no-gutters class="pt-2" v-if="objectInfo.cmodel === 'Container'">
                    <router-link class="mb-1" :to="{ name: 'addmember' }">{{ $t('Upload member') }}</router-link>
                  </v-row>
                  <v-row no-gutters class="pt-2" v-if="(objectInfo.cmodel !== 'Container') && (objectInfo.cmodel !== 'Collection') && (objectInfo.cmodel !== 'Resource') && (objectInfo.cmodel !== 'Book') && (objectInfo.cmodel !== 'Page')">
                    <router-link class="mb-1" :to="{ name: 'upload-webversion', params: { pid: objectInfo.pid } }">{{ $t('Upload web-optimized version') }}</router-link>
                  </v-row>
                  <v-row no-gutters class="pt-2" v-if="(objectInfo.cmodel !== 'Page')">
                    <v-dialog class="pb-4" v-model="relationDialog" width="800px">
                      <template v-slot:activator="{ on }">
                        <a v-on="on" class="mb-1">{{ $t('Submit related object') }}</a>
                      </template>
                      <v-card>
                        <v-card-title dark class="title font-weight-light grey white--text">{{ $t("Choose relation") }}</v-card-title>
                        <v-card-text>
                          <v-container>
                            <v-row align="center" justify="center">
                              <v-col cols="12" md="4">
                                <span>{{ $t('RELATION_SUBMITTED') }}</span>
                              </v-col>
                              <v-col cols="12" md="4">
                                <v-radio-group v-model="chosenRelation">
                                  <template v-for="(r, i) in vocabularies['relations'].terms">
                                    <v-radio v-if="r['@id'] === 'http://phaidra.univie.ac.at/XML/V1.0/relations#hasSuccessor'" :key="'relv'+i" :label="$t('Is new version of')" :value="r['skos:notation'][0].toLowerCase()"></v-radio>
                                    <template v-else-if="r['@id'] === 'info:fedora/fedora-system:def/relations-external#hasCollectionMember'">
                                      <v-radio v-if="objectInfo.cmodel === 'Collection'" :key="'relm'+i" :label="$t('Is member of collection')" :value="r['skos:notation'][0].toLowerCase()"></v-radio>
                                    </template>
                                    <template v-else-if="r['@id'] === 'http://pcdm.org/models#hasMember'">
                                      <v-radio v-if="objectInfo.cmodel === 'Container'" :key="'relcm'+i" :label="$t('Is member of container')" :value="r['skos:notation'][0].toLowerCase()"></v-radio>
                                    </template>
                                    <v-radio v-else :key="'rele'+i" :label="getLocalizedTermLabel('relations', r['@id'])" :value="r['skos:notation'][0].toLowerCase()"></v-radio>
                                  </template>
                                </v-radio-group>
                              </v-col>
                              <v-col cols="12" md="4">
                                <span>{{ objectInfo.pid }} ({{ $t('this object') }})</span>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn @click="relationDialog = false">{{ $t('Cancel') }}</v-btn>
                          <v-btn class="primary" :disabled="!chosenRelation" @click="$router.push({ name: 'submit-related', params: { relatedpid: objectInfo.pid, relation: chosenRelation }})">{{ $t('Continue') }}</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-row>
                  <v-row no-gutters class="pt-2" v-if="(objectInfo.cmodel !== 'Container') && (objectInfo.cmodel !== 'Collection') && (objectInfo.cmodel !== 'Resource')">
                    <router-link class="mb-1" :to="{ name: 'rights' }">{{ $t('Access rights') }}</router-link>
                  </v-row>
                  <v-row no-gutters class="pt-2">
                    <router-link class="mb-1" :to="{ name: 'relationships' }">{{ $t('Relationships') }}</router-link>
                  </v-row>
                  <v-row no-gutters class="pt-2">
                    <router-link class="mb-1" :to="{ name: 'delete' }">{{ $t('Delete') }}</router-link>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="my-6" v-if="(viewable && objectInfo.readrights) || (downloadable && objectInfo.readrights)">
            <v-col class="pt-0">
              <v-card tile>
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('Data') }}</v-card-title>
                <v-card-text class="mt-4">
                  <v-row no-gutters class="pt-2">
                    <v-btn class="mr-2" v-if="downloadable && objectInfo.readrights" :href="instanceconfig.api + '/object/' + objectInfo.pid + '/diss/Content/download'" color="primary">{{ $t('Download') }}</v-btn>
                    <v-btn v-if="viewable && objectInfo.readrights" target="_blank" :href="instanceconfig.api + '/object/' + objectInfo.pid + '/diss/Content/get'" color="primary">{{ $t('View') }}</v-btn>
                  </v-row>
                  <v-divider class="mt-6 mb-4" v-if="(downloadable && objectInfo.readrights && (objectInfo.cmodel === 'Picture')) || (downloadable && objectInfo.readrights && objectInfo.dshash['WEBVERSION'])"></v-divider>
                  <template v-if="downloadable && objectInfo.readrights && (objectInfo.cmodel === 'Picture')">
                    <v-row no-gutters class="pt-2">
                      <a target="_blank" :href="instanceconfig.api + '/imageserver/?IIIF=' + objectInfo.pid + '.tif/full/pct:50/0/default.jpg'" primary>{{ $t('View scaled to 50%') }}</a>
                    </v-row>
                    <v-row no-gutters class="pt-2">
                      <a target="_blank" :href="instanceconfig.api + '/imageserver/?IIIF=' + objectInfo.pid + '.tif/full/pct:25/0/default.jpg'" primary>{{ $t('View scaled to 25%') }}</a>
                    </v-row>
                  </template>
                  <v-row no-gutters class="pt-2" v-if="downloadable && objectInfo.readrights && objectInfo.dshash['WEBVERSION']">
                    <a :href="instanceconfig.api + '/object/' + objectInfo.pid + '/diss/Content/downloadwebversion'" primary>{{ $t('Download web-optimized version') }}</a>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

        </v-col>

    </v-row>

  </v-container>
</template>

<script>
import { context } from '../mixins/context'
import { config } from '../mixins/config'
import { vocabulary } from 'phaidra-vue-components/src/mixins/vocabulary'

export default {
  name: 'detail',
  mixins: [ context, config, vocabulary ],
  computed: {
    routepid: function () {
      return this.$store.state.route.params.pid
    },
    objectInfo: function () {
      return this.$store.state.objectInfo
    },
    objectMembers: function () {
      return this.$store.state.objectMembers
    },
    downloadable: function () {
      switch (this.objectInfo.cmodel) {
        case 'PDFDocument':
        case 'Video':
        case 'Audio':
        case 'Picture':
        case 'Unknown':
        case 'Book':
          return true
        default:
          return false
      }
    },
    viewable: function () {
      switch (this.objectInfo.cmodel) {
        case 'PDFDocument':
        case 'Video':
        case 'Audio':
        case 'Picture':
        case 'Book':
          return true
        default:
          return false
      }
    },
    coverPid: function () {
      // HACK
      var pidNumStr = this.objectInfo.pid.substr(2)
      var coverPidNum = parseInt(pidNumStr) + 1
      return 'o:' + coverPidNum
    }
  },
  data () {
    return {
      relationDialog: false,
      chosenRelation: 'http://purl.org/dc/terms/references'
    }
  },
  methods: {
    async fetchAsyncData (self, pid) {
      await self.$store.dispatch('fetchObjectInfo', pid)
      if (self.objectInfo.cmodel === 'Container') {
        await self.$store.dispatch('fetchObjectMembers', self.objectInfo)
      }
    },
    getMemberDownloadUrl: function (member) {
      if (member.cmodel === 'Asset' || member.cmodel === 'Video') {
        return this.instanceconfig.fedora + '/objects/' + member.pid + '/methods/bdef:Content/download'
      } else {
        return this.instanceconfig.api + '/object/' + member.pid + '/diss/Content/download'
      }
    }
  },
  serverPrefetch () {
    console.log('[' + this.$store.state.route.params.pid + '] prefetch')
    return this.fetchAsyncData(this, this.$store.state.route.params.pid)
  },
  beforeRouteEnter: async function (to, from, next) {
    next(async function (vm) {
      vm.$store.commit('setLoading', true)
      vm.$store.commit('setObjectInfo', null)
      await vm.fetchAsyncData(vm, to.params.pid)
      vm.$store.commit('setLoading', false)
    })
  },
  beforeRouteUpdate: async function (to, from, next) {
    await this.fetchAsyncData(this, to.params.pid)
    next()
  }
}
</script>

<style lang="stylus" scoped>
@require '../stylus/colors'

h3
  color: $phaidragrey.darken-4
</style>

<style scoped>
.preview-maxwidth {
  max-width: 80px;
}

.container {
  padding: 0px;
}

.col-border {
  display: block;
  border: solid;
  border-width: 0 0 0 thin;
  border-color: rgba(0, 0, 0, 0.12);
  padding-top: 0px;
}

.showmembers {
  text-decoration: underline;
}

.ph-box {
  line-height: 1rem;
}
</style>
