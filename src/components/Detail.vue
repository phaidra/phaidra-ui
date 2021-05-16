<template>
  <v-container fluid>

    <template v-if="objectInfo">

      <v-row v-if="objectInfo.cmodel === 'Page'" justify="center">
        <v-col cols="6">
          <v-row justify="center" class="mt-5">{{ $t('PAGE_OF_BOOK', { bookpid: objectInfo.bookpid } ) }}</v-row>
          <v-row justify="center" class="mt-4"><v-btn large raised color="primary" :to="{ name: 'detail', params: { pid: objectInfo.bookpid }}">{{ $t('Go to book') }}</v-btn></v-row>
        </v-col>
      </v-row>
      <v-row v-else-if="objectInfo.ismemberof && (objectInfo.ismemberof.length > 0)" justify="center">
        <template v-if="objectInfo.ismemberof.length === 1">
          <v-col cols="6">
            <v-row justify="center" class="mt-5">{{ $t('MEMBER_OF_CONTAINER', { containerpid: objectInfo.ismemberof[0] } ) }}</v-row>
            <v-row justify="center" class="mt-4"><v-btn large raised color="primary" :to="{ name: 'detail', params: { pid: objectInfo.ismemberof[0] }}">{{ $t('Go to container') }}</v-btn></v-row>
          </v-col>
        </template>
        <template v-else>
          <v-col cols="6">
            <v-row justify="center" class="mt-5">{{ $t('This object is a member of multiple containers. Please choose a container to view:') }}</v-row>
            <v-row justify="center" class="mt-4"><v-btn v-for="(contpid, i) in objectInfo.ismemberof" :key="'contbtn'+i" large raised color="primary" :to="{ name: 'detail', params: { pid: contpid }}">{{ $t('Go to container') }}&nbsp;{{ contpid }}</v-btn></v-row>
          </v-col>
        </template>
      </v-row>
      <v-row v-else>

        <v-col cols="12" md="8" class="mt-8">
          <template v-if="objectInfo.relationships.hasthumbnail.length > 0">
            <img v-for="(thumb, i) in objectInfo.relationships.hasthumbnail" :src="instanceconfig.api + '/object/' + thumb.pid + '/thumbnail?h=480&w=480'" :key="'thmb'+i"/>
          </template>
          <v-row justify="center" v-if="showPreview">
            <template v-if="objectInfo.cmodel === 'Book'">
              <v-btn large raised color="primary" :href="instanceconfig.fedora + '/objects/' + objectInfo.pid + '/methods/bdef:Book/view'" target="_blank">{{ $t('Open in Bookviewer') }}</v-btn>
            </template>
            <template v-else>
              <iframe :src="instanceconfig.api + '/object/' + objectInfo.pid + '/preview'" :style="objectInfo.cmodel === 'Audio' ? 'height: 60px; width: 100%; border: 0px;' : 'height: 500px; width: 100%; border: 0px;'" scrolling="no" border="0">Content</iframe>
            </template>
          </v-row>

          <v-divider class="mt-12 mb-10" v-if="showPreview"></v-divider>

          <v-row justify="center" v-if="objectInfo.dshash['JSON-LD']">
            <p-d-jsonld :jsonld="objectInfo.metadata['JSON-LD']" :pid="objectInfo.pid" :bold-label-fields="['dce:title', 'role', 'edm:rights']"></p-d-jsonld>
          </v-row>

          <v-row v-else-if="objectInfo.dshash['UWMETADATA']">
            <p-d-uwm-rec :children="objectInfo.metadata['uwmetadata']" :cmodel="objectInfo.cmodel"></p-d-uwm-rec>
          </v-row>

          <v-row v-else-if="objectInfo.dshash['MODS']">
            <p-d-mods-rec :children="objectInfo.metadata['MODS']"></p-d-mods-rec>
          </v-row>

          <template v-if="objectInfo.cmodel === 'Container'">
            <h3 class="title font-weight-light grey--text text--darken-2">{{$t('Members')}} ({{objectInfo.members.length}})</h3>

            <v-row v-if="objectMembers">
              <v-card class="mb-3 pt-4" width="100%" v-for="(member) in objectMembers" :key="'member_'+member.pid">
                <iframe :src="instanceconfig.api + '/object/' + member.pid + '/preview'" :style="member.cmodel === 'Audio' ? 'height: 60px; width: 100%; border: 0px;' : 'height: 500px; width: 100%; border: 0px;'" scrolling="no" border="0">Content</iframe>
                <v-card-text class="ma-2">
                  <p-d-jsonld :jsonld="member.metadata['JSON-LD']" :pid="member.pid" :bold-label-fields="['dce:title', 'role', 'edm:rights']"></p-d-jsonld>
                </v-card-text>
                <v-divider light v-if="objectInfo.readrights"></v-divider>
                <v-card-actions class="pa-3" v-if="objectInfo.readrights">
                  <v-spacer></v-spacer>
                  <v-btn raised :href="instanceconfig.api + '/object/' + member.pid + '/download'" color="primary">{{ $t('Download') }}</v-btn>
                  <v-menu offset-y v-if="objectInfo.writerights === 1">
                    <template v-slot:activator="{ on }">
                      <v-btn raised color="primary" dark v-on="on">{{ $t('Edit') }}<v-icon right dark>arrow_drop_down</v-icon></v-btn>
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

        <v-col cols="12" md="4" class="mt-4">

          <v-row justify="end" class="mb-2">
            <v-col cols="12" class="pt-0">
              <p class="text-right" v-for="(id,i) in identifiers" :key="'id'+i">
                <v-dialog @input="loadCitationStyles()" v-if="id.label === 'DOI'" class="pb-4" v-model="doiCiteDialog" width="800px">
                  <template v-slot:activator="{ on }">
                    <v-chip v-on="on" x-small class="mr-2 font-weight-regular" color="primary">{{ $t('Cite') }}</v-chip>
                  </template>
                  <v-card>
                    <v-card-title dark class="title font-weight-light grey white--text">{{ $t("Cite") }}</v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row align="center" justify="center">
                          <v-btn color="primary" class="mx-3" @click="getBibTex()">{{$t('Get BibTex')}}</v-btn>
                          <span>{{ $t('or') }}</span>
                          <v-btn color="primary" class="mx-3" @click="getCitation()">{{$t('Get citation')}}</v-btn>
                          <v-autocomplete :loading="citationStylesLoading" v-model="citationStyle" :items="citationStyles" :label="$t('Style')"></v-autocomplete>
                        </v-row>
                        <v-row align="center" justify="center">
                          <v-textarea hide-details height="300px" readonly filled v-model="citeResult"></v-textarea>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn @click="doiCiteDialog=false">{{ $t('Close') }}</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <span v-if="id.label" class="caption text--secondary">{{$t(id.label)}}</span><br/><span>{{id.value}}</span>
              </p>
            </v-col>
          </v-row>

          <v-row justify="end">
            <v-col cols="12" md="9">

              <v-row class="mb-6" v-if="(viewable && objectInfo.readrights) || (downloadable && objectInfo.readrights) || (objectInfo.cmodel === 'Collection') || (objectInfo.cmodel === 'Resource')">
                <v-col class="pt-0">
                  <v-card tile>
                    <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('Content') }}</v-card-title>
                    <v-card-text class="mt-4">
                      <v-row no-gutters class="pt-2" justify="start">
                        <v-btn class="mr-2 mb-2" @click="trackDownload()" v-if="downloadable && objectInfo.readrights" :href="instanceconfig.api + '/object/' + objectInfo.pid + '/download'" color="primary">{{ $t('Download') }}</v-btn>
                        <!--<v-btn class="mb-2" v-if="viewable && objectInfo.readrights" target="_blank" :href="instanceconfig.api + '/object/' + objectInfo.pid + '/get'" color="primary">{{ $t('View') }}</v-btn>-->
                        <v-btn v-if="objectInfo.cmodel === 'Collection'" :to="{ path: '/search', query: { collection: objectInfo.pid, reset: 1 } }" color="primary">{{ $t('Show members') }} ({{ objectInfo.haspartsize }})</v-btn>
                        <v-btn  v-if="objectInfo.cmodel === 'Resource'" :href="instanceconfig.api + '/object/' + objectInfo.pid + '/diss/Resource/get'" color="primary">{{ $t('Open link') }}</v-btn>
                      </v-row>
                      <v-divider class="mt-4 mb-4" v-if="(downloadable && objectInfo.readrights && (objectInfo.cmodel === 'Picture')) || (downloadable && objectInfo.readrights && objectInfo.dshash['WEBVERSION'])"></v-divider>
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

              <v-row class="mb-6" v-if="objectInfo.isinadminset">
                <v-col class="pt-0">
                  <v-card tile>
                    <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('Managed by') }}</v-card-title>
                    <v-card-text class="mt-4">
                      <v-row v-for="(adminset, i) in objectInfo.isinadminset" no-gutters class="pt-2" :key="'adminset'+i">
                        <a class="font-weight-regular" v-if="adminset === 'phaidra:ir.univie.ac.at'" :href="uscholarlink" target="_blank">u:scholar</a>
                        <a v-if="adminset === 'phaidra:utheses.univie.ac.at'" :href="utheseslink" target="_blank">u:theses</a>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-row class="mb-6">
                <v-col class="pt-0">
                  <v-card tile>
                    <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('Details') }}</v-card-title>
                    <v-card-text class="mt-4">
                      <v-row no-gutters class="pt-2">
                        <v-col class="caption grey--text text--darken-2" cols="3">{{ $t('Uploader') }}</v-col>
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
                        <v-col cols="8" offset="1">{{ objectInfo.created | datetime }}</v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-row class="my-6">
                <v-col class="pt-0">
                  <v-card tile>
                    <v-card-title class="ph-box title font-weight-light grey white--text"><router-link class="white--text" :to="{ name: 'stats', params: { pid: objectInfo.pid } }">{{ $t('Usage statistics') }}</router-link></v-card-title>
                    <v-card-text class="mt-4">
                      <v-row>
                        <v-col>
                          <v-icon>mdi-eye-outline</v-icon><span class="ml-2">{{ stats.detail }}</span>
                        </v-col>
                        <v-col v-if="objectInfo.cmodel !== 'Resource'">
                          <v-icon>mdi-download</v-icon><span class="ml-2">{{ stats.download }}</span>
                        </v-col>
                        <v-spacer></v-spacer>
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
                        <v-row :key="'format'+i">
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
                      <template v-for="(rel, i) in objectInfo.relationships.ispartof">
                        <v-row :key="'ispartof'+i" align="center">
                          <v-col cols="12" md="5" class="preview-maxwidth">
                            <p-img :src="'https://' + instanceconfig.baseurl + '/preview/' + rel.pid + '///120'" class="elevation-1 mt-2"></p-img>
                          </v-col>
                          <v-col cols="12" md="7">
                            <router-link :to="{ name: 'detail', params: { pid: rel.pid } }">{{ rel.dc_title[0] }}</router-link>
                          </v-col>
                        </v-row>
                        <v-divider :key="'ispartofd'+i" v-if="(i+1) < objectInfo.relationships.ispartof.length"></v-divider>
                      </template>
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
                      <v-row no-gutters class="pt-2" v-if="objectInfo.dshash['JSON-LD']">
                        <router-link :to="{ name: 'metadata' }">{{ $t('Show metadata') }}</router-link>
                      </v-row>
                      <v-row no-gutters class="pt-2" v-if="objectInfo.dshash['UWMETADATA']">
                        <a :href="instanceconfig.api + '/object/' + objectInfo.pid + '/uwmetadata?format=xml'" target="_blank">{{ $t('Metadata XML') }}</a>
                      </v-row>
                      <v-row no-gutters class="pt-2" v-if="objectInfo.dshash['MODS']">
                        <a :href="instanceconfig.api + '/object/' + objectInfo.pid + '/mods?format=xml'" target="_blank">{{ $t('Metadata XML') }}</a>
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
                            <a v-on="on" class="mb-1">{{ $t('Upload related object') }}</a>
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
                      <v-row no-gutters class="pt-2" v-if="(objectInfo.cmodel !== 'Container') && (objectInfo.cmodel !== 'Collection')">
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

              <v-row justify="end" class="mb-2">
                <v-col cols="12" class="pt-0">
                  <template v-for="(md5,i) in checksums">
                    <p class="text-right" v-if="md5.path.includes('OCTETS')" :key="'md5'+i">
                      <span class="caption text--secondary">md5</span><br/><span>{{md5.md5}}</span>
                    </p>
                  </template>
                </v-col>
              </v-row>

            </v-col>
          </v-row>

        </v-col>

      </v-row>
    </template>
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
    isRestricted: function () {
      return this.objectInfo.datastreams.includes('POLICY')
    },
    showPreview: function () {
      return (this.objectInfo.cmodel !== 'Resource') && (this.objectInfo.cmodel !== 'Collection') && (this.objectInfo.cmodel !== 'Asset') && (this.objectInfo.cmodel !== 'Container') && this.objectInfo.readrights && !((this.objectInfo.cmodel === 'Video') && this.isRestricted)
    },
    uscholarlink: function () {
      return 'https://' + this.instanceconfig.irbaseurl + '/' + this.objectInfo.pid
    },
    doi: function () {
      for (let id of this.objectInfo.dc_identifier) {
        let type = id.substr(0, id.indexOf(':'))
        let idvalue = id.substr(id.indexOf(':') + 1)
        if (type === 'doi') {
          return idvalue
        }
      }
      return null
    },
    identifiers: function () {
      let ids = []
      ids.push({ label: 'Persistent identifier', value: 'https://' + this.instanceconfig.baseurl + '/' + this.objectInfo.pid })
      if (this.objectInfo.dc_identifier) {
        for (let id of this.objectInfo.dc_identifier) {
          if ((id === 'https://' + this.instanceconfig.baseurl + '/' + this.objectInfo.pid) || (id === 'http://' + this.instanceconfig.baseurl + '/' + this.objectInfo.pid)) {
            continue
          } else {
            let type = id.substr(0, id.indexOf(':'))
            console.log(type)
            let idvalue = id.substr(id.indexOf(':') + 1)
            switch (type) {
              case 'hdl':
                ids.push({ label: 'Handle', value: idvalue })
                break
              case 'doi':
                ids.push({ label: 'DOI', value: idvalue })
                break
              case 'urn':
                ids.push({ label: 'URN', value: idvalue })
                break
              case 'isbn':
              case 'ISBN':
                ids.push({ label: 'ISBN', value: idvalue })
                break
              case 'HTTP/WWW':
                ids.push({ label: 'URL', value: idvalue })
                break
              case 'PrintISSN':
                ids.push({ label: 'PrintISSN', value: idvalue })
                break
              case 'uri':
                ids.push({ label: 'URI', value: idvalue })
                break
              default:
                ids.push({ value: idvalue })
                break
            }
          }
        }
      }
      return ids
    },
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
        case 'Asset':
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
    citationLocale: function () {
      switch (this.$i18n.locale) {
        case 'eng':
          return 'en-GB'
        case 'deu':
          return 'de-AT'
        case 'ita':
          return 'it-IT'
        default:
          return 'en-GB'
      }
    },
    mimetype: function () {
      for (let f of this.objectInfo['dc_format']) {
        if (f.includes('/')) {
          return f
        }
      }
      return ''
    }
  },
  data () {
    return {
      relationDialog: false,
      doiCiteDialog: false,
      citeResult: '',
      citationStyle: 'apa',
      citationStyles: [],
      citationStylesLoading: false,
      chosenRelation: 'http://purl.org/dc/terms/references',
      utheseslink: '',
      stats: {
        download: '-',
        detail: '-'
      },
      checksums: []
    }
  },
  methods: {
    trackDownload () {
      this.$matomo.setCustomUrl('https://' + this.instanceconfig.baseurl + '/download/' + this.routepid)
      this.$matomo.setDocumentTitle('Download ' + this.routepid)
      this.$matomo.trackPageView()
    },
    async fetchAsyncData (self, pid) {
      await self.$store.dispatch('fetchObjectInfo', pid)
      self.postMetadataLoad(self)
      if (self.objectInfo.cmodel === 'Container') {
        await self.$store.dispatch('fetchObjectMembers', self.objectInfo)
      }
    },
    async fetchUsageStats (self, pid) {
      self.stats.download = null
      self.stats.detail = null
      try {
        let response = await self.$http.get(self.instanceconfig.api + '/stats/' + pid,
          {
            headers: {
              'X-XSRF-TOKEN': self.user.token
            }
          }
        )
        if (response.data.stats) {
          self.stats.download = response.data.stats.downloads
          self.stats.detail = response.data.stats.detail_page
        }
      } catch (error) {
        console.log(error)
      }
    },
    async fetchChecksums (self, pid) {
      try {
        let response = await self.$http.get(self.instanceconfig.api + '/object/' + pid + '/md5',
          {
            headers: {
              'X-XSRF-TOKEN': self.user.token
            }
          }
        )
        if (response.data.md5) {
          self.checksums = response.data.md5
        }
      } catch (error) {
        console.log(error)
      }
    },
    postMetadataLoad: function (self) {
      if (self.objectInfo) {
        if (self.objectInfo.metadata) {
          if (self.objectInfo.metadata['JSON-LD']) {
            Object.entries(self.objectInfo.metadata['JSON-LD']).forEach(([p, arr]) => {
              if (p === 'rdam:P30004') {
                for (let o of arr) {
                  if (o['@type'] === 'ids:uri') {
                    if (/utheses/.test(o['@value'])) {
                      self.utheseslink = o['@value']
                    }
                  }
                }
              }
            })
          }
        }
      }
    },
    // getMemberDownloadUrl: function (member) {
    //   if (member.cmodel === 'Asset' || member.cmodel === 'Video') {
    //     return this.instanceconfig.fedora + '/objects/' + member.pid + '/methods/bdef:Content/download'
    //   } else {
    //     return this.instanceconfig.api + '/object/' + member.pid + '/diss/Content/download'
    //   }
    // },
    loadCitationStyles: async function () {
      this.citationStylesLoading = true
      try {
        let response = await this.$http.request({
          method: 'GET',
          url: this.appconfig.apis.doi.citationstyles
        })
        if (response.status !== 200) {
          if (response.data.alerts && response.data.alerts.length > 0) {
            this.$store.commit('setAlerts', response.data.alerts)
          }
        } else {
          this.citationStyles = response.data
        }
      } catch (error) {
        console.log(error)
        this.$store.commit('setAlerts', [{ type: 'danger', msg: error }])
      } finally {
        this.citationStylesLoading = false
      }
    },
    getBibTex: async function () {
      try {
        let response = await this.$http.request({
          method: 'GET',
          url: 'https://' + this.appconfig.apis.doi.baseurl + '/' + this.doi,
          headers: {
            'Accept': 'application/x-bibtex'
          }
        })
        if (response.status !== 200) {
          if (response.data.alerts && response.data.alerts.length > 0) {
            this.$store.commit('setAlerts', response.data.alerts)
          }
        } else {
          this.citeResult = response.data
        }
      } catch (error) {
        console.log(error)
        this.$store.commit('setAlerts', [{ type: 'danger', msg: error }])
      }
    },
    getCitation: async function () {
      try {
        let response = await this.$http.request({
          method: 'GET',
          url: 'https://' + this.appconfig.apis.doi.baseurl + '/' + this.doi,
          headers: {
            'Accept': 'text/x-bibliography; style=' + this.citationStyle + '; locale=' + this.citationLocale
          }
        })
        if (response.status !== 200) {
          if (response.data.alerts && response.data.alerts.length > 0) {
            this.$store.commit('setAlerts', response.data.alerts)
          }
        } else {
          this.citeResult = response.data
        }
      } catch (error) {
        console.log(error)
        this.$store.commit('setAlerts', [{ type: 'danger', msg: error }])
      }
    },
    resetData: function (self) {
      self.stats = {
        download: '-',
        detail: '-'
      }
      self.checksums = []
    }
  },
  serverPrefetch () {
    console.log('[' + this.$store.state.route.params.pid + '] prefetch')
    return this.fetchAsyncData(this, this.$store.state.route.params.pid)
  },
  beforeRouteEnter: async function (to, from, next) {
    next(async function (vm) {
      vm.resetData(vm)
      vm.$store.commit('setLoading', true)
      vm.$store.commit('setObjectInfo', null)
      await vm.fetchAsyncData(vm, to.params.pid)
      vm.fetchUsageStats(vm, to.params.pid)
      vm.fetchChecksums(vm, to.params.pid)
      vm.$store.commit('setLoading', false)
    })
  },
  beforeRouteUpdate: async function (to, from, next) {
    this.resetData(this)
    this.$store.commit('setLoading', true)
    await this.fetchAsyncData(this, to.params.pid)
    this.fetchUsageStats(this, to.params.pid)
    this.fetchChecksums(this, to.params.pid)
    this.$store.commit('setLoading', false)
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
