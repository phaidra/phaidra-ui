<template>
  <v-container fluid>
    <template v-if="objectInfo">
      <v-row
        v-if="objectInfo.ismemberof && objectInfo.ismemberof.length > 0"
        justify="center"
      >
        <template v-if="objectInfo.ismemberof.length === 1">
          <v-col cols="6">
            <v-row justify="center" class="mt-5">{{
              $t("MEMBER_OF_CONTAINER", {
                containerpid: objectInfo.ismemberof[0],
              })
            }}</v-row>
            <v-row justify="center" class="mt-4"
              ><v-btn
                large
                raised
                color="primary"
                :to="
                  localePath({ path: `/detail/${objectInfo.ismemberof[0]}` })
                "
                >{{ $t("Go to container") }}</v-btn
              ></v-row
            >
          </v-col>
        </template>
        <template v-else>
          <v-col cols="6">
            <v-row justify="center" class="mt-5">{{
              $t(
                "This object is a member of multiple containers. Please choose a container to view:"
              )
            }}</v-row>
            <v-row justify="center" class="mt-4"
              ><v-btn
                v-for="(contpid, i) in objectInfo.ismemberof"
                :key="'contbtn' + i"
                large
                raised
                color="primary"
                :to="localePath({ path: `/detail/${contpid}` })"
                >{{ $t("Go to container") }}&nbsp;{{ contpid }}</v-btn
              ></v-row
            >
          </v-col>
        </template>
      </v-row>
      <v-row v-else>
        <v-col cols="12" md="8" class="mt-8">
          <v-row v-if="objectInfo.cmodel === 'Page'" justify="center">
            <v-col cols="6">
              <v-row justify="center" class="mt-5">{{
                $t("PAGE_OF_BOOK", { bookpid: objectInfo.bookpid })
              }}</v-row>
              <v-row justify="center" class="mt-4"
                ><v-btn
                  large
                  raised
                  color="primary"
                  :to="localePath({ path: `/detail/${objectInfo.bookpid}` })"
                  >{{ $t("Go to book") }}</v-btn
                ></v-row
              >
            </v-col>
          </v-row>
          <v-row v-if="hasLaterVersion" justify="center">
            <v-alert type="info" color="primary">
              <div>
                {{
                  $t("There is a more recent version of this object available")
                }}
              </div>
            </v-alert>
          </v-row>
          <v-row justify="center" v-if="showPreview">
            <template v-if="(objectInfo.cmodel === 'Book') && (objectInfo.datastreams.includes('UWMETADATA'))">
              <v-btn
                large
                raised
                color="primary"
                :href="
                  instanceconfig.fedora +
                  '/objects/' +
                  objectInfo.pid +
                  '/methods/bdef:Book/view'
                "
                target="_blank"
                >{{ $t("Open in Bookviewer") }}</v-btn
              >
            </template>
          <template v-else-if="(objectInfo.cmodel === 'Book') && (objectInfo.datastreams.includes('IIIF-MANIFEST'))">
              <v-btn
                large
                raised
                color="primary"
                :href="
                  instanceconfig.api +
                    '/object/' +
                    objectInfo.pid +
                    '/preview'
                "
                target="_blank"
                >{{ $t("Open in Bookviewer") }}</v-btn
              >
            </template>
            <template v-else>
              <v-col cols="12">
                <div class="iframe-container" v-if="objectInfo.cmodel === 'Video'">
                  <iframe
                    :src="
                      instanceconfig.api +
                      '/object/' +
                      objectInfo.pid +
                      '/preview'
                    "
                    width="100%"
                    frameborder="0"
                    scrolling="no"
                    class="responsive-iframe"
                    >Content</iframe>
                </div>
                <iframe
                v-else
                  :src="
                    instanceconfig.api +
                    '/object/' +
                    objectInfo.pid +
                    '/preview'
                  "
                  :style="
                    objectInfo.cmodel === 'Audio'
                      ? 'height: 60px; width: 100%; border: 0px;'
                      : objectInfo.cmodel === 'Container' ? 'height: 300px; width: 100%; border: 0px;' : 'height: 500px; width: 100%; border: 0px;'
                  "
                  scrolling="no"
                  border="0"
                  >Content</iframe
                >
                <a
                  class="mt-2 float-right"
                  :href="
                    instanceconfig.api +
                    '/object/' +
                    objectInfo.pid +
                    '/preview'
                  "
                  target="_blank"
                  >{{ $t("Open in new window") }}</a
                >
              </v-col>
            </template>
          </v-row>

          <v-divider class="mt-12 mb-10" v-if="showPreview"></v-divider>
          <client-only>
            <v-row justify="center" v-if="objectInfo.dshash['JSON-LD']">
              <p-d-jsonld
                :jsonld="objectInfo.metadata['JSON-LD']"
                :pid="objectInfo.pid"
                :bold-label-fields="['dce:title', 'role', 'edm:rights']"
                :predicatesToHide="['ebucore:filename', 'ebucore:hasMimeType']"
              ></p-d-jsonld>
            </v-row>

            <v-row v-else-if="objectInfo.dshash['UWMETADATA']">
              <p-d-uwm-rec
                :children="objectInfo.metadata['uwmetadata']"
                :cmodel="objectInfo.cmodel"
              ></p-d-uwm-rec>
            </v-row>

            <v-row v-else-if="objectInfo.dshash['MODS']">
              <p-d-mods-rec
                :children="objectInfo.metadata['mods']"
              ></p-d-mods-rec>
            </v-row>
          </client-only>

          <template v-if="objectInfo.cmodel === 'Container'">
            <v-toolbar class="my-10 grey white--text" elevation="1">
              <v-toolbar-title>
                {{ $t("Members") }} ({{ objectInfo.members.length }})
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-pagination
                v-if="objectInfo.members.length > membersPageSize"
                v-model="membersPage"
                :length="Math.ceil(objectInfo.members.length/membersPageSize)"
              ></v-pagination>
            </v-toolbar>
            <v-row v-if="objectMembers">
              <v-card
                class="mb-3 pt-4"
                width="100%"
                v-for="member in objectMembersPage"
                :key="'member_' + member.pid"
              >
                <iframe
                  :src="
                    instanceconfig.api + '/object/' + member.pid + '/preview'
                  "
                  :style="
                    member.cmodel === 'Audio'
                      ? 'height: 60px; width: 100%; border: 0px;'
                      : 'height: 500px; width: 100%; border: 0px;'
                  "
                  scrolling="no"
                  border="0"
                  >Content</iframe
                >
                <v-card-text class="ma-2">
                  <client-only>
                    <p-d-jsonld
                      :jsonld="member.metadata['JSON-LD']"
                      :pid="member.pid"
                      :bold-label-fields="['dce:title', 'role', 'edm:rights']"
                      :predicatesToHide="['ebucore:filename', 'ebucore:hasMimeType']"
                    ></p-d-jsonld>
                  </client-only>
                </v-card-text>
                <v-divider light v-if="objectInfo.readrights"></v-divider>
                <v-card-actions class="pa-3" v-if="objectInfo.readrights">
                  <v-spacer></v-spacer>
                  <v-btn
                    class="ml-2"
                    raised
                    :href="
                      instanceconfig.api + '/object/' + member.pid + '/download'
                    "
                    color="primary"
                    >{{ $t("Download") }}</v-btn
                  >
                  <v-menu offset-y v-if="objectInfo.writerights === 1">
                    <template v-slot:activator="{ on }">
                      <v-btn class="ml-2" raised color="primary" dark v-on="on"
                        >{{ $t("Edit")
                        }}<v-icon right dark>arrow_drop_down</v-icon></v-btn
                      >
                    </template>
                    <v-list>
                      <v-list-item
                        :to="localePath(`/metadata/${member.pid}/edit`)"
                      >
                        <v-list-item-title>{{
                          $t("Edit metadata")
                        }}</v-list-item-title>
                      </v-list-item>
                      <v-list-item :to="localePath(`/rights/${member.pid}`)">
                        <v-list-item-title>{{
                          $t("Access rights")
                        }}</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        :to="localePath(`/relationships/${member.pid}`)"
                      >
                        <v-list-item-title>{{
                          $t("Relationships")
                        }}</v-list-item-title>
                      </v-list-item>
                      <v-list-item v-if="instanceconfig.enabledelete === 1" :to="localePath(`/delete/${member.pid}`)">
                        <v-list-item-title>{{
                          $t("Delete")
                        }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-card-actions>
              </v-card>
            </v-row>
          </template>
          <template v-if="objectInfo.cmodel === 'Collection' && docs.length">
            <v-toolbar class="my-10 grey white--text" elevation="1">
              <v-toolbar-title>
                {{ $t("Members") }} ({{ total }})
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-pagination
                v-if="total > pagesize"
                v-bind:length="totalPages"
                total-visible="10"
                v-model="page"
              ></v-pagination>
            </v-toolbar>
            <v-row v-for="(doc, i) in this.docs" :key="'doc' + i">
              <v-col cols="2" class="preview-maxwidth">
                <div>
                  <p-img
                    :src="
                      instanceconfig.api + '/object/' + doc.pid + '/thumbnail'
                    "
                    class="elevation-1 mt-2"
                  >
                    <template v-slot:placeholder>
                      <div
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        ></v-progress-circular>
                      </div>
                    </template>
                  </p-img>
                </div>
              </v-col>
              <v-col cols="10">
                <v-row no-gutters class="mb-4">
                  <v-col cols="10">
                    <h3
                      class="title font-weight-light primary--text"
                      @click.stop
                      v-if="doc.dc_title"
                    >
                      <router-link
                        :to="{ path: `${doc.pid}`, params: { pid: doc.pid } }"
                        >{{ doc.dc_title[0] }}</router-link
                      >
                    </h3>
                    <p class="grey--text">{{ doc.pid }}</p>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="2" class="text-right"
                    ><span v-if="doc.created" class="grey--text">{{
                      doc.created | date
                    }}</span></v-col
                  >
                </v-row>
              </v-col>
            </v-row>
        </template>
      <v-row v-if="showCollectionTree" class="mt-8">
        <v-toolbar class="my-10 grey white--text" elevation="1">
          <v-toolbar-title>
            {{ $t("Collection structure") }}
          </v-toolbar-title>
        </v-toolbar>
        <div id="d3-graph-container" style="width: 100%">
          <svg style="position: absolute">
            <defs>
              <marker
                id="m-end"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,6 L9,3 z"></path>
              </marker>
              <marker
                id="m-start"
                markerWidth="6"
                markerHeight="6"
                refX="-4"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <rect width="3" height="6"></rect>
              </marker>
            </defs>
          </svg>
          <d3-network
            ref="net"
            :net-nodes="nodes"
            :net-links="links"
            :options="options"
            @node-click="nodeclick"
            :link-cb="lcb"
          />
        </div>
      </v-row>
        </v-col>

        <v-col cols="12" md="4" class="mt-4">
          <v-row justify="end" class="mb-2">
            <v-col cols="12" class="pt-0">
              <p
                class="text-right"
                v-for="(id, i) in identifiers"
                :key="'id' + i"
              >
                <v-dialog
                  @input="loadCitationStyles()"
                  v-if="id.label === 'DOI'"
                  class="pb-4"
                  v-model="doiCiteDialog"
                  width="800px"
                >
                  <template v-slot:activator="{ on }">
                    <v-chip
                      v-on="on"
                      x-small
                      class="mr-2 font-weight-regular"
                      color="primary"
                      >{{ $t("Cite") }}</v-chip
                    >
                  </template>
                  <v-card>
                    <v-card-title
                      dark
                      class="title font-weight-light grey white--text"
                      >{{ $t("Cite") }}</v-card-title
                    >
                    <v-card-text>
                      <v-container>
                        <v-row align="center" justify="center">
                          <v-btn
                            color="primary"
                            class="mx-3"
                            @click="getBibTex()"
                            >{{ $t("Get BibTex") }}</v-btn
                          >
                          <span>{{ $t("or") }}</span>
                          <v-btn
                            color="primary"
                            class="mx-3"
                            @click="getCitation()"
                            >{{ $t("Get citation") }}</v-btn
                          >
                          <v-autocomplete
                            :loading="citationStylesLoading"
                            v-model="citationStyle"
                            :items="citationStyles"
                            :label="$t('Style')"
                          ></v-autocomplete>
                        </v-row>
                        <v-row align="center" justify="center">
                          <v-textarea
                            hide-details
                            height="300px"
                            readonly
                            filled
                            v-model="citeResult"
                          ></v-textarea>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        :loading="doiCiteLoading"
                        @click="doiCiteDialog = false"
                        >{{ $t("Close") }}</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <span v-if="id.label" class="caption text--secondary">
                  {{ $t(id.label) }}
                </span>
                <br />
                <span :class="id.label == 'Persistent identifier' ? 'font-weight-medium primary--text' : ''">
                  <template v-if="id.label === 'Handle'"><a :href="'https://hdl.handle.net/' + id.value">https://hdl.handle.net/{{ $t(id.value) }}</a></template>
                  <template v-else><a :href="id.value">{{ id.value }}</a></template>
                </span>
              </p>
            </v-col>
          </v-row>
          <v-row justify="end" class="mb-8" no-gutters v-if="isRestricted"><v-chip label dark color="red lighten-1 font-weight-regular"><v-icon small left>mdi-lock</v-icon>{{ $t('Restricted access') }}</v-chip></v-row>
          <v-row justify="end">
            <v-col cols="12" md="9">
              <v-row
                class="mb-6"
                v-if="
                  (viewable && objectInfo.readrights) ||
                  (downloadable && objectInfo.readrights) ||
                  objectInfo.cmodel === 'Collection' ||
                  objectInfo.cmodel === 'Resource'
                "
              >
                <v-col class="pt-0">
                  <v-card tile>
                    <v-card-title
                      class="ph-box title font-weight-light grey white--text"
                      >{{ $t("Content") }}</v-card-title
                    >
                    <v-card-text class="mt-4">
                      <v-row no-gutters class="pt-2" justify="start">
                        <v-btn
                          class="mr-2 mb-2"
                          v-if="downloadable && objectInfo.readrights"
                          :href="
                            instanceconfig.api +
                            '/object/' +
                            objectInfo.pid +
                            '/download'
                          "
                          color="primary"
                          >{{ $t("Download") }}</v-btn
                        >
                        <!--<v-btn class="mb-2" v-if="viewable && objectInfo.readrights" target="_blank" :href="instanceconfig.api + '/object/' + objectInfo.pid + '/get'" color="primary">{{ $t('View') }}</v-btn>-->
                        <v-btn
                          v-if="objectInfo.cmodel === 'Collection'"
                          :to="
                            localePath({
                              path: '/search',
                              query: { collection: objectInfo.pid, reset: 1 },
                            })
                          "
                          color="primary"
                          >{{ $t("Show members") }} ({{
                            objectInfo.haspartsize
                          }})</v-btn
                        >
                        <v-btn
                          v-if="objectInfo.cmodel === 'Resource'"
                          :href="
                            instanceconfig.api +
                            '/object/' +
                            objectInfo.pid +
                            '/diss/Resource/get'
                          "
                          color="primary"
                          >{{ $t("Open link") }}</v-btn
                        >
                      </v-row>
                      <v-divider
                        class="mt-4 mb-4"
                        v-if="
                          (downloadable &&
                            objectInfo.readrights &&
                            objectInfo.cmodel === 'Picture') ||
                          (downloadable &&
                            objectInfo.readrights &&
                            objectInfo.dshash['WEBVERSION'])
                        "
                      ></v-divider>
                      <template
                        v-if="
                          downloadable &&
                          objectInfo.readrights &&
                          objectInfo.cmodel === 'Picture'
                        "
                      >
                        <v-row no-gutters class="pt-2">
                          <a
                            target="_blank"
                            :href="
                              instanceconfig.api +
                              '/imageserver/?IIIF=' +
                              objectInfo.pid +
                              '.tif/full/pct:50/0/default.jpg'
                            "
                            primary
                            >{{ $t("View scaled to 50%") }}</a
                          >
                        </v-row>
                        <v-row no-gutters class="pt-2">
                          <a
                            target="_blank"
                            :href="
                              instanceconfig.api +
                              '/imageserver/?IIIF=' +
                              objectInfo.pid +
                              '.tif/full/pct:25/0/default.jpg'
                            "
                            primary
                            >{{ $t("View scaled to 25%") }}</a
                          >
                        </v-row>
                      </template>
                      <v-row
                        no-gutters
                        class="pt-2"
                        v-if="
                          downloadable &&
                          objectInfo.readrights &&
                          objectInfo.dshash['WEBVERSION']
                        "
                      >
                        <a
                          :href="
                            instanceconfig.api +
                            '/object/' +
                            objectInfo.pid +
                            '/diss/Content/downloadwebversion'
                          "
                          primary
                          >{{ $t("Download web-optimized version") }}</a
                        >
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-row class="mb-6" v-if="objectInfo.isinadminset">
                <v-col class="pt-0">
                  <v-card tile>
                    <v-card-title
                      class="ph-box title font-weight-light grey white--text"
                      >{{ $t("Managed by") }}</v-card-title
                    >
                    <v-card-text class="mt-4">
                      <v-row
                        v-for="(adminset, i) in objectInfo.isinadminset"
                        no-gutters
                        class="pt-2"
                        :key="'adminset' + i"
                      >
                        <a
                          class="font-weight-regular"
                          v-if="adminset === 'phaidra:ir.univie.ac.at'"
                          :href="uscholarlink"
                          target="_blank"
                          >u:scholar</a
                        >
                        <a
                          v-if="adminset === 'phaidra:utheses.univie.ac.at'"
                          :href="utheseslink"
                          target="_blank"
                          >u:theses</a
                        >
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <client-only>
                <v-row class="mb-6">
                  <v-col class="pt-0">
                    <v-card tile>
                      <v-card-title
                        class="ph-box title font-weight-light grey white--text"
                        >{{ $t("Details") }}</v-card-title
                      >
                      <v-card-text class="mt-4">
                        <v-row no-gutters class="pt-2">
                          <v-col
                            class="caption grey--text text--darken-2"
                            cols="3"
                            >{{ $t("Uploader") }}</v-col
                          >
                          <v-col
                            cols="8"
                            offset="1"
                            v-if="objectInfo.owner.firstname"
                          >
                            <a :href="'mailto:' + objectInfo.owner.email"
                              >{{ objectInfo.owner.firstname }}
                              {{ objectInfo.owner.lastname }}</a
                            >
                          </v-col>
                          <v-col v-else-if="objectInfo.owner.displayname" cols="8" offset="1">
                            <v-row>
                                <v-col>
                                  <a :href="'mailto:' + objectInfo.owner.email"
                                    >{{ objectInfo.owner.displayname }}</a
                                  >
                                </v-col>
                            </v-row>
                          </v-col>
                          <v-col v-else cols="8"  offset="1"><a :href="'mailto:' + objectInfo.owner.email"
                              >{{ objectInfo.owner.username }}</a
                            ></v-col>
                        </v-row>
                        <v-row no-gutters class="pt-2">
                          <v-col
                            class="caption grey--text text--darken-2"
                            cols="3"
                            >{{ $t("Object type") }}</v-col
                          >
                          <v-col cols="8" offset="1">{{
                            objectInfo.cmodel
                          }}</v-col>
                        </v-row>
                        <v-row
                          v-if="objectInfo.dc_format"
                          no-gutters
                          class="pt-2"
                        >
                          <v-col
                            class="caption grey--text text--darken-2"
                            cols="3"
                            >{{ $t("Format") }}</v-col
                          >
                          <v-col cols="8" offset="1">
                            <template v-if="objectInfo.dc_format && objectInfo.dc_format.length > 1">
                              <v-row>
                                <v-col
                                  v-for="(v, i) in objectInfo.dc_format"
                                  :key="i"
                                  >{{ v }}</v-col
                                >
                              </v-row>
                            </template>
                            <template v-else>{{
                              objectInfo.dc_format[0]
                            }}</template>
                          </v-col>
                        </v-row>
                        <v-row no-gutters class="pt-2">
                          <v-col
                            class="caption grey--text text--darken-2"
                            cols="3"
                            >{{ $t("Created") }}</v-col
                          >
                          <v-col cols="8" offset="1">{{
                            objectInfo.created | datetime
                          }}</v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </client-only>

              <v-row class="my-6">
                <v-col class="pt-0">
                  <v-card tile>
                    <v-card-title
                      class="ph-box title font-weight-light grey white--text"
                    >
                      <nuxt-link
                        class="white--text"
                        :to="localePath(`/stats/${objectInfo.pid}`)"
                      >
                        {{ $t("Usage statistics") }}</nuxt-link
                      >
                    </v-card-title>
                    <v-card-text class="mt-4">
                      <v-row>
                        <v-col>
                          <v-icon>mdi-eye-outline</v-icon
                          ><span class="ml-2">{{ stats.detail }}</span>
                        </v-col>
                        <v-col v-if="objectInfo.cmodel !== 'Resource'">
                          <v-icon>mdi-download</v-icon
                          ><span class="ml-2">{{ stats.download }}</span>
                        </v-col>
                        <v-spacer></v-spacer>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-row v-if="objectInfo.versions && objectInfo.versions.length > 0" class="my-6">
                <v-col class="pt-0">
                  <v-card tile>
                    <v-card-title
                      class="ph-box title font-weight-light grey white--text"
                      >{{ $t("Versions") }}</v-card-title
                    >
                    <v-card-text class="mt-4">
                      <div v-for="(rel, i) in objectInfo.versions" :key="'version' + i">
                        <v-row>
                          <v-col cols="12" md="5">{{
                            rel.created | date
                          }}</v-col>
                          <v-col cols="12" md="7">
                            <nuxt-link
                              v-if="rel['dc_title']"
                              :to="localePath(`/detail/${rel.pid}`)"
                              >{{ rel.dc_title[0] }}</nuxt-link
                            >
                            <nuxt-link
                              v-else
                              :to="localePath(`/detail/${rel.pid}`)"
                              >{{ rel.pid }}</nuxt-link
                            >
                          </v-col>
                        </v-row>
                        <v-divider
                          v-if="i + 1 < objectInfo.versions.length"
                          :key="'versiond' + i"
                        ></v-divider>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-row
                v-if="objectInfo.alternativeversions && objectInfo.alternativeversions.length > 0"
                class="my-6"
              >
                <v-col class="pt-0">
                  <v-card tile>
                    <v-card-title
                      class="ph-box title font-weight-light grey white--text"
                      >{{ $t("Alternative versions") }}</v-card-title
                    >
                    <v-card-text class="mt-4">
                      <div
                        v-for="(rel, i) in objectInfo.alternativeversions"  :key="'version' + i"
                      >
                        <v-row>
                          <v-col cols="12" md="12">
                            <nuxt-link
                              v-if="rel['dc_title']"
                              :to="localePath(`/detail/${rel.pid}`)"
                              >{{ rel.dc_title[0] }}</nuxt-link
                            >
                            <nuxt-link
                              v-else
                              :to="localePath(`/detail/${rel.pid}`)"
                              >{{ rel.pid }}</nuxt-link
                            >
                          </v-col>
                        </v-row>
                        <v-divider
                          v-if="i + 1 < objectInfo.alternativeversions.length"
                          :key="'altversiond' + i"
                        ></v-divider>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-row
                v-if="objectInfo.alternativeformats && objectInfo.alternativeformats.length > 0"
                class="my-6"
              >
                <v-col class="pt-0">
                  <v-card tile>
                    <v-card-title
                      class="ph-box title font-weight-light grey white--text"
                      >{{ $t("Alternative formats") }}</v-card-title
                    >
                    <v-card-text class="mt-4">
                      <div
                        v-for="(rel, i) in objectInfo.alternativeformats" :key="'format' + i"
                      >
                        <v-row>
                          <v-col cols="12" md="5">{{ rel.dc_format[0] }}</v-col>
                          <v-col cols="12" md="7">
                            <nuxt-link
                              v-if="rel['dc_title']"
                              :to="localePath(`/detail/${rel.pid}`)"
                              >{{ rel.dc_title[0] }}</nuxt-link
                            >
                            <nuxt-link
                              v-else
                              :to="localePath(`/detail/${rel.pid}`)"
                              >{{ rel.pid }}</nuxt-link
                            >
                          </v-col>
                        </v-row>
                        <v-divider
                          v-if="i + 1 < objectInfo.alternativeformats.length"
                          :key="'altformatsd' + i"
                        ></v-divider>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <template v-if="objectInfo.relationships">
                <v-row
                  v-if="objectInfo.relationships.ispartof && objectInfo.relationships.ispartof.length > 0"
                  class="my-6"
                >
                  <v-col class="pt-0">
                    <v-card tile>
                      <v-card-title
                        class="ph-box title font-weight-light grey white--text"
                        >{{ $t("This object is in collection") }}</v-card-title
                      >
                      <v-card-text class="mt-4">
                        <div
                          v-for="(rel, i) in objectInfo.relationships.ispartof" :key="'ispartof' + i"
                        >
                          <v-row align="center">
                            <v-col cols="12" md="5" class="preview-maxwidth">
                              <p-img
                                :src="instanceconfig.api +
                                  '/object/' +
                                  rel.pid +
                                  '/thumbnail'
                                "
                                class="elevation-1 my-4"
                              ></p-img>
                            </v-col>
                            <v-col cols="12" md="7">
                              <nuxt-link
                                v-if="rel['dc_title']"
                                :to="localePath(`/detail/${rel.pid}`)"
                                >{{ rel.dc_title[0] }}</nuxt-link
                              >
                              <nuxt-link
                                v-else
                                :to="localePath(`/detail/${rel.pid}`)"
                                >{{ rel.pid }}</nuxt-link
                              >
                            </v-col>
                          </v-row>
                          <v-divider
                            :key="'ispartofd' + i"
                            v-if="
                              i + 1 < objectInfo.relationships.ispartof.length
                            "
                          ></v-divider>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <v-row
                  v-if="objectInfo.relationships.isbacksideof && objectInfo.relationships.isbacksideof.length > 0"
                  class="my-6"
                >
                  <v-col class="pt-0">
                    <v-card tile>
                      <v-card-title
                        class="ph-box title font-weight-light grey white--text"
                        >{{ $t("This object is a back side of") }}</v-card-title
                      >
                      <v-card-text class="mt-4">
                        <div
                          v-for="(rel, i) in objectInfo.relationships
                            .isbacksideof" :key="'isbacksideof' + i"
                        >
                          <v-row align="center">
                            <v-col cols="12" md="5" class="preview-maxwidth">
                              <p-img
                                :src="instanceconfig.api +
                                  '/object/' +
                                  rel.pid +
                                  '/thumbnail'
                                "
                                class="elevation-1 my-4"
                              ></p-img>
                            </v-col>
                            <v-col cols="12" md="7">
                              <nuxt-link
                                v-if="rel['dc_title']"
                                :to="localePath(`/detail/${rel.pid}`)"
                                >{{ rel.dc_title[0] }}</nuxt-link
                              >
                              <nuxt-link
                                v-else
                                :to="localePath(`/detail/${rel.pid}`)"
                                >{{ rel.pid }}</nuxt-link
                              >
                            </v-col>
                          </v-row>
                          <v-divider
                            :key="'isbacksideofd' + i"
                            v-if="
                              i + 1 < objectInfo.relationships.isbacksideof.length
                            "
                          ></v-divider>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <v-row
                  v-if="objectInfo.relationships.hasbackside && objectInfo.relationships.hasbackside.length > 0"
                  class="my-6"
                >
                  <v-col class="pt-0">
                    <v-card tile>
                      <v-card-title
                        class="ph-box title font-weight-light grey white--text"
                        >{{ $t("This object has a back side") }}</v-card-title
                      >
                      <v-card-text class="mt-4">
                        <div
                          v-for="(rel, i) in objectInfo.relationships.hasbackside" :key="'hasbackside' + i"
                        >
                          <v-row align="center">
                            <v-col cols="12" md="5" class="preview-maxwidth">
                              <p-img
                                :src="instanceconfig.api +
                                  '/object/' +
                                  rel.pid +
                                  '/thumbnail'
                                "
                                class="elevation-1 my-4"
                              ></p-img>
                            </v-col>
                            <v-col cols="12" md="7">
                              <nuxt-link
                                v-if="rel['dc_title']"
                                :to="localePath(`/detail/${rel.pid}`)"
                                >{{ rel.dc_title[0] }}</nuxt-link
                              >
                              <nuxt-link
                                v-else
                                :to="localePath(`/detail/${rel.pid}`)"
                                >{{ rel.pid }}</nuxt-link
                              >
                            </v-col>
                          </v-row>
                          <v-divider
                            :key="'hasbacksided' + i"
                            v-if="
                              i + 1 < objectInfo.relationships.hasbackside.length
                            "
                          ></v-divider>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <v-row
                  v-if="objectInfo.relationships.isthumbnailfor && objectInfo.relationships.isthumbnailfor.length > 0"
                  class="my-6"
                >
                  <v-col class="pt-0">
                    <v-card tile>
                      <v-card-title
                        class="ph-box title font-weight-light grey white--text"
                        >{{ $t("This object is thumbnail for") }}</v-card-title
                      >
                      <v-card-text class="mt-4">
                        <div
                          v-for="(rel, i) in objectInfo.relationships
                            .isthumbnailfor" :key="'isthumbnailfor' + i"
                        >
                          <v-row align="center">
                            <v-col cols="12" md="5" class="preview-maxwidth">
                              <p-img
                                :src="instanceconfig.api +
                                  '/object/' +
                                  rel.pid +
                                  '/thumbnail'
                                "
                                class="elevation-1 my-4"
                              ></p-img>
                            </v-col>
                            <v-col cols="12" md="7">
                              <nuxt-link
                                v-if="rel['dc_title']"
                                :to="localePath(`/detail/${rel.pid}`)"
                                >{{ rel.dc_title[0] }}</nuxt-link
                              >
                              <nuxt-link
                                v-else
                                :to="localePath(`/detail/${rel.pid}`)"
                                >{{ rel.pid }}</nuxt-link
                              >
                            </v-col>
                          </v-row>
                          <v-divider
                            :key="'isthumbnailford' + i"
                            v-if="
                              i + 1 <
                              objectInfo.relationships.isthumbnailfor.length
                            "
                          ></v-divider>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <v-row
                  v-if="objectInfo.relationships.hasthumbnail && objectInfo.relationships.hasthumbnail.length > 0"
                  class="my-6"
                >
                  <v-col class="pt-0">
                    <v-card tile>
                      <v-card-title
                        class="ph-box title font-weight-light grey white--text"
                        >{{ $t("This object has thumbnail") }}</v-card-title
                      >
                      <v-card-text class="mt-4">
                        <div
                          v-for="(rel, i) in objectInfo.relationships
                            .hasthumbnail" :key="'hasthumbnail' + i"
                        >
                          <v-row align="center">
                            <v-col cols="12" md="5" class="preview-maxwidth">
                              <p-img
                                :src="instanceconfig.api +
                                  '/object/' +
                                  rel.pid +
                                  '/thumbnail'
                                "
                                class="elevation-1 my-4"
                              ></p-img>
                            </v-col>
                            <v-col cols="12" md="7">
                              <nuxt-link
                                v-if="rel['dc_title']"
                                :to="localePath(`/detail/${rel.pid}`)"
                                >{{ rel.dc_title[0] }}</nuxt-link
                              >
                              <nuxt-link
                                v-else
                                :to="localePath(`/detail/${rel.pid}`)"
                                >{{ rel.pid }}</nuxt-link
                              >
                            </v-col>
                          </v-row>
                          <v-divider
                            :key="'hasthumbnaild' + i"
                            v-if="
                              i + 1 < objectInfo.relationships.hasthumbnail.length
                            "
                          ></v-divider>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <v-row
                  v-if="objectInfo.relationships.references && objectInfo.relationships.references.length > 0"
                  class="my-6"
                >
                  <v-col class="pt-0">
                    <v-card tile>
                      <v-card-title
                        class="ph-box title font-weight-light grey white--text"
                        >{{ $t("This object references") }}</v-card-title
                      >
                      <v-card-text class="mt-4">
                        <div
                          v-for="(rel, i) in objectInfo.relationships.references" :key="'references' + i"
                        >
                          <v-row align="center">
                            <v-col cols="12" md="5" class="preview-maxwidth">
                              <p-img
                                :src="instanceconfig.api +
                                  '/object/' +
                                  rel.pid +
                                  '/thumbnail'
                                "
                                class="elevation-1 my-4"
                              ></p-img>
                            </v-col>
                            <v-col cols="12" md="7">
                              <nuxt-link
                                v-if="rel['dc_title']"
                                :to="localePath(`/detail/${rel.pid}`)"
                                >{{ rel.dc_title[0] }}</nuxt-link
                              >
                              <nuxt-link
                                v-else
                                :to="localePath(`/detail/${rel.pid}`)"
                                >{{ rel.pid }}</nuxt-link
                              >
                            </v-col>
                          </v-row>
                          <v-divider
                            :key="'referencesd' + i"
                            v-if="
                              i + 1 < objectInfo.relationships.references.length
                            "
                          ></v-divider>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <v-row
                  v-if="objectInfo.relationships.isreferencedby && objectInfo.relationships.isreferencedby.length > 0"
                  class="my-6"
                >
                  <v-col class="pt-0">
                    <v-card tile>
                      <v-card-title
                        class="ph-box title font-weight-light grey white--text"
                        >{{ $t("This object is referenced by") }}</v-card-title
                      >
                      <v-card-text class="mt-4">
                        <div
                          v-for="(rel, i) in objectInfo.relationships
                            .isreferencedby" :key="'isreferencedby' + i"
                        >
                          <v-row align="center">
                            <v-col cols="12" md="5" class="preview-maxwidth">
                              <p-img
                                :src="instanceconfig.api +
                                  '/object/' +
                                  rel.pid +
                                  '/thumbnail'
                                "
                                class="elevation-1 my-4"
                              ></p-img>
                            </v-col>
                            <v-col cols="12" md="7">
                              <nuxt-link
                                v-if="rel['dc_title']"
                                :to="localePath(`/detail/${rel.pid}`)"
                                >{{ rel.dc_title[0] }}</nuxt-link
                              >
                              <nuxt-link
                                v-else
                                :to="localePath(`/detail/${rel.pid}`)"
                                >{{ rel.pid }}</nuxt-link
                              >
                            </v-col>
                          </v-row>
                          <v-divider
                            :key="'isreferencedbyd' + i"
                            v-if="
                              i + 1 <
                              objectInfo.relationships.isreferencedby.length
                            "
                          ></v-divider>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </template>
              <v-row class="my-6">
                <v-col class="pt-0">
                  <v-card tile>
                    <v-card-title
                      class="ph-box title font-weight-light grey white--text"
                      >{{ $t("Metadata") }}</v-card-title
                    >
                    <v-card-text class="mt-4">
                      <v-row
                        no-gutters
                        class="pt-2"
                        v-if="objectInfo.dshash['JSON-LD']"
                      >
                        <nuxt-link
                          :to="localePath(`/metadata/${objectInfo.pid}`)"
                          >{{ $t("Metadata JSON") }}</nuxt-link
                        >
                      </v-row>
                      <v-row
                        no-gutters
                        class="pt-2"
                        v-if="objectInfo.dshash['JSON-LD']"
                      >
                        <a
                        :href="
                            instanceconfig.api +
                            '/object/' +
                            objectInfo.pid +
                            '/json-ld'
                          "
                          target="_blank"
                          >{{ $t("JSON-LD") }}</a
                        >
                      </v-row>
                      <v-row
                        no-gutters
                        class="pt-2"
                        v-if="objectInfo.dshash['UWMETADATA']"
                      >
                        <a
                          :href="
                            instanceconfig.api +
                            '/object/' +
                            objectInfo.pid +
                            '/uwmetadata?format=xml'
                          "
                          target="_blank"
                          >{{ $t("Metadata XML") }}</a
                        >
                      </v-row>
                      <v-row
                        no-gutters
                        class="pt-2"
                        v-if="objectInfo.dshash['MODS']"
                      >
                        <a
                          :href="
                            instanceconfig.api +
                            '/object/' +
                            objectInfo.pid +
                            '/mods?format=xml'
                          "
                          target="_blank"
                          >{{ $t("Metadata XML") }}</a
                        >
                      </v-row>
                      <v-row no-gutters class="pt-2">
                        <a
                          :href="
                            instanceconfig.api +
                            '/object/' +
                            objectInfo.pid +
                            '/index/dc'
                          "
                          target="_blank"
                          >{{ $t("Dublin Core") }}</a
                        >
                      </v-row>
                      <v-row
                        no-gutters
                        class="pt-2"
                      >
                        <a
                          class="mb-1"
                          :href="
                            instanceconfig.api +
                            '/object/' +
                            objectInfo.pid +
                            '/datacite?format=xml'
                          "
                          target="_blank"
                          >{{ $t("Data Cite") }}</a
                        >
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-row class="my-6" v-if="objectInfo.writerights === 1">
                <v-col class="pt-0">
                  <v-card tile>
                    <v-card-title
                      class="ph-box title font-weight-light grey white--text"
                      >{{ $t("Edit") }}</v-card-title
                    >
                    <v-card-text class="mt-4">
                      <v-row
                        no-gutters
                        class="pt-2"
                        v-if="objectInfo.dshash['JSON-LD']"
                      >
                        <nuxt-link
                          :to="localePath(`/metadata/${objectInfo.pid}/edit`)"
                          >{{ $t("Edit metadata") }}</nuxt-link
                        >
                      </v-row>
                      <v-row
                        no-gutters
                        class="pt-2"
                        v-if="objectInfo.dshash['UWMETADATA']"
                      >
                        <nuxt-link
                          :to="localePath(`/uwmetadata/${objectInfo.pid}/edit`)"
                          >{{ $t("Edit metadata") }}</nuxt-link
                        >
                      </v-row>

                      <v-row
                        no-gutters
                        class="pt-2"
                      >
                      <v-dialog
                        v-model="collectionHelpDialog"
                        width="800"
                      >
                        <template v-slot:activator="{ on }">
                          <a
                            class="mb-1"
                            v-on="on"
                            >{{ $t("Manage members") }}</a
                          >
                        </template>
                        <v-card>
                          <v-card-title class="text-h5 grey lighten-2">
                            {{ $t("Manage members") }}
                          </v-card-title>

                          <v-card-text>
                            <p class="mt-4">{{$t('ADD_COLLECTION_MEMBERS_HELP')}}</p>
                          </v-card-text>

                          <v-divider></v-divider>

                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="primary"
                              text
                              @click="collectionHelpDialog = false"
                            >
                              OK
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                      </v-row>
                      <v-row
                        no-gutters
                        class="pt-2"
                        v-if="
                          ((objectInfo.cmodel === 'Container') && (objectInfo.members.length <= 100 )) ||
                          ((objectInfo.cmodel === 'Collection') && (total <= 100 ))
                        "
                      >
                        <nuxt-link
                          class="mb-1"
                          :to="localePath(`/sort/${objectInfo.pid}`)"
                          >{{ $t("Sort members (drag & drop)") }}</nuxt-link
                        >
                      </v-row>
                      <v-row
                        no-gutters
                        class="pt-2"
                        v-if="
                          objectInfo.cmodel === 'Container' ||
                          objectInfo.cmodel === 'Collection'
                        "
                      >
                        <nuxt-link
                          class="mb-1"
                          :to="localePath(`/sorttextinput/${objectInfo.pid}`)"
                          >{{ $t("Sort members (text input)") }}</nuxt-link
                        >
                      </v-row>
                      <v-row
                        no-gutters
                        class="pt-2"
                        v-if="
                          objectInfo.cmodel !== 'Container' &&
                          objectInfo.cmodel !== 'Collection' &&
                          objectInfo.cmodel !== 'Resource' &&
                          objectInfo.cmodel !== 'Book' &&
                          objectInfo.cmodel !== 'Page'
                        "
                      >
                        <nuxt-link
                          class="mb-1"
                          :to="
                            localePath(`/upload-webversion/${objectInfo.pid}`)
                          "
                          >{{ $t("Upload web-optimized version") }}</nuxt-link
                        >
                      </v-row>
                      <v-row
                        no-gutters
                        class="pt-2"
                        v-if="objectInfo.cmodel !== 'Page'"
                      >
                        <v-dialog
                          class="pb-4"
                          v-model="relationDialog"
                          width="800px"
                        >
                          <template v-slot:activator="{ on }">
                            <a v-on="on" class="mb-1">{{
                              $t("Upload related object")
                            }}</a>
                          </template>
                          <v-card>
                            <v-card-title
                              dark
                              class="title font-weight-light grey white--text"
                              >{{ $t("Choose relation") }}</v-card-title
                            >
                            <v-card-text>
                              <v-container>
                                <v-row align="center" justify="center">
                                  <v-col cols="12" md="4">
                                    <span>{{ $t("RELATION_SUBMITTED") }}</span>
                                  </v-col>
                                  <v-col cols="12" md="4">
                                    <v-radio-group v-model="chosenRelation">
                                      <template
                                        v-for="(r, i) in vocabularies[
                                          'relations'
                                        ].terms"
                                      >
                                        <v-radio
                                          v-if="
                                            r['@id'] ===
                                            'http://phaidra.univie.ac.at/XML/V1.0/relations#hasSuccessor'
                                          "
                                          :key="'relv' + i"
                                          :label="$t('Is new version of')"
                                          :value="
                                            r['skos:notation'][0].toLowerCase()
                                          "
                                        ></v-radio>
                                        <template
                                          v-else-if="
                                            r['@id'] ===
                                            'info:fedora/fedora-system:def/relations-external#hasCollectionMember'
                                          "
                                        >
                                          <v-radio
                                            v-if="
                                              objectInfo.cmodel === 'Collection'
                                            "
                                            :key="'relm' + i"
                                            :label="
                                              $t('Is member of collection')
                                            "
                                            :value="
                                              r[
                                                'skos:notation'
                                              ][0].toLowerCase()
                                            "
                                          ></v-radio>
                                        </template>
                                        <template
                                          v-else-if="
                                            r['@id'] ===
                                            'http://pcdm.org/models#hasMember'
                                          "
                                        >
                                          <v-radio
                                            v-if="
                                              objectInfo.cmodel === 'Container'
                                            "
                                            :key="'relcm' + i"
                                            :label="
                                              $t('Is member of container')
                                            "
                                            :value="
                                              r[
                                                'skos:notation'
                                              ][0].toLowerCase()
                                            "
                                          ></v-radio>
                                        </template>
                                        <v-radio
                                          v-else-if="r['@id'] !==
                                            'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#hasTrack'"
                                          :key="'rele' + i"
                                          :label="
                                            getLocalizedTermLabel(
                                              'relations',
                                              r['@id']
                                            )
                                          "
                                          :value="
                                            r['skos:notation'][0].toLowerCase()
                                          "
                                        ></v-radio>
                                      </template>
                                    </v-radio-group>
                                  </v-col>
                                  <v-col cols="12" md="4">
                                    <span
                                      >{{ objectInfo.pid }} ({{
                                        $t("this object")
                                      }})</span
                                    >
                                  </v-col>
                                </v-row>
                              </v-container>
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn @click="relationDialog = false">{{
                                $t("Cancel")
                              }}</v-btn>
                              <v-btn
                                class="primary"
                                :disabled="!chosenRelation"
                                @click="
                                  $router.push(
                                    localeLocation(
                                      `/submitrelated/${objectInfo.pid}/${chosenRelation}`
                                    )
                                  )
                                "
                                >{{ $t("Continue") }}</v-btn
                              >
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-row>
                      <v-row
                        no-gutters
                        class="pt-2"
                        v-if="
                          objectInfo.cmodel !== 'Container' &&
                          objectInfo.cmodel !== 'Collection'
                        "
                      >
                        <nuxt-link
                          class="mb-1"
                          :to="localePath(`/rights/${objectInfo.pid}`)"
                          >{{ $t("Access rights") }}</nuxt-link
                        >
                      </v-row>
                      <v-row no-gutters class="pt-2">
                        <nuxt-link
                          class="mb-1"
                          :to="localePath(`/relationships/${objectInfo.pid}`)"
                          >{{ $t("Relationships") }}</nuxt-link
                        >
                      </v-row>
                      <v-row no-gutters class="pt-2">
                        <nuxt-link
                          class="mb-1"
                          v-if="instanceconfig.enabledelete === 1"
                          :to="localePath(`/delete/${objectInfo.pid}`)"
                          >{{ $t("Delete") }}</nuxt-link
                        >
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-row justify="end" class="mb-2">
                <v-col cols="12" class="pt-0">
                  <template v-for="(md5, i) in checksums">
                    <p
                      class="text-right"
                      v-if="md5.path.includes('OCTETS')"
                      :key="'md5' + i"
                    >
                      <span class="caption text--secondary">md5</span
                      ><br /><span>{{ md5.md5 }}</span>
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
import { context } from "../../mixins/context";
import { config } from "../../mixins/config";
import { vocabulary } from "phaidra-vue-components/src/mixins/vocabulary";
import D3Network from "vue-d3-network";
import "vue-d3-network/dist/vue-d3-network.css";
import qs from "qs";
export default {
  mixins: [context, config, vocabulary],
  components: {
    D3Network,
  },
  validate({ params }) {
    return /^o:\d+$/.test(params.pid);
  },
  metaInfo() {
    return this.detailsMetaInfo;
  },
  computed: {
    options() {
      return {
        force: 3000,
        size: { w: this.windowWidth, h: this.svgHeight },
        nodeSize: this.nodeSize,
        nodeLabels: true,
        canvas: this.canvas,
        linkWidth: 2,
      };
    },
    page: {
      get() {
        return this.currentPage;
      },
      set(value) {
        if (this.currentPage != value) {
          this.currentPage = value;
          this.getCollectionMembers(this.objectInfo.pid);
        }
      },
    },
    totalPages: function () {
      return Math.ceil(this.total / this.pagesize);
    },
    isRestricted: function () {
      return this.objectInfo.datastreams.includes("POLICY");
    },
    showCollectionTree: function () {
      return false
      // return (
      //   this.objectInfo === "Collection" ||
      //   this.objectInfo?.relationships?.ispartof?.length > 0
      // );
    },
    showPreview: function () {
      return (
        this.objectInfo.cmodel !== "Resource" &&
        this.objectInfo.cmodel !== "Collection" &&
        (this.objectInfo.cmodel !== "Asset" ||
          (this.objectInfo.cmodel === "Asset" &&
            (this.mimetype === "model/nxz" ||
              this.mimetype === "model/ply"))) &&
        this.objectInfo.cmodel !== "Container" &&
        this.objectInfo.readrights &&
        !(this.objectInfo.cmodel === "Video" && this.isRestricted)
      );
    },
    uscholarlink: function () {
      return (
        "https://" + this.instanceconfig.irbaseurl + "/" + this.objectInfo.pid
      );
    },
    doi: function () {
      for (let id of this.objectInfo.dc_identifier) {
        let type = id.substr(0, id.indexOf(":"));
        let idvalue = id.substr(id.indexOf(":") + 1);
        if (type === "doi") {
          return idvalue;
        }
      }
      return null;
    },
    identifiers: function () {
      let ids = [];
      ids.push({
        label: "Persistent identifier",
        value:
          "https://" + this.instanceconfig.baseurl + "/" + this.objectInfo.pid,
      });
      if (this.objectInfo.dc_identifier) {
        for (let id of this.objectInfo.dc_identifier) {
          if (
            id ===
              "https://" +
                this.instanceconfig.baseurl +
                "/" +
                this.objectInfo.pid ||
            id ===
              "http://" +
                this.instanceconfig.baseurl +
                "/" +
                this.objectInfo.pid
          ) {
            continue;
          } else {
            let type = id.substr(0, id.indexOf(":"));
            let idvalue = id.substr(id.indexOf(":") + 1);
            switch (type) {
              case "hdl":
                ids.push({ label: "Handle", value: idvalue });
                break;
              case "doi":
                ids.push({ label: "DOI", value: idvalue });
                break;
              case "urn":
                ids.push({ label: "URN", value: idvalue });
                break;
              case "isbn":
              case "ISBN":
                ids.push({ label: "ISBN", value: idvalue });
                break;
              case "HTTP/WWW":
                ids.push({ label: "URL", value: idvalue });
                break;
              case "PrintISSN":
                ids.push({ label: "PrintISSN", value: idvalue });
                break;
              case "uri":
                ids.push({ label: "URI", value: idvalue });
                break;
              default:
                ids.push({ value: idvalue });
                break;
            }
          }
        }
      }
      return ids;
    },
    routepid: function () {
      return this.$route.params.pid;
    },
    objectInfo: function () {
      return this.$store.state.objectInfo;
    },
    objectMembers: function () {
      return this.$store.state.objectMembers;
    },
    objectMembersPage: function () {
      if(this.objectMembers.length < this.membersPageSize) {
        return this.objectMembers
      } else {
        return this.objectMembers.slice((this.membersPage-1)*this.membersPageSize,((this.membersPage-1)*this.membersPageSize)+this.membersPageSize)
      }
    },
    downloadable: function () {
      switch (this.objectInfo.cmodel) {
        case "PDFDocument":
        case "Video":
        case "Audio":
        case "Picture":
        case "Asset":
        case "Book":
        case "Page":
          return true;
        default:
          return false;
      }
    },
    viewable: function () {
      switch (this.objectInfo.cmodel) {
        case "PDFDocument":
        case "Video":
        case "Audio":
        case "Picture":
        case "Book":
        case "Page":
          return true;
        default:
          return false;
      }
    },
    hasLaterVersion: function () {
      if (this.$store.state.objectInfo.versions) {
        if (Array.isArray(this.$store.state.objectInfo.versions)) {
          for (let v of this.$store.state.objectInfo.versions) {
            if (v.created > this.$store.state.objectInfo.created) {
              return true;
            }
          }
        }
      }
      return false;
    },
    citationLocale: function () {
      switch (this.$i18n.locale) {
        case "eng":
          return "en-GB";
        case "deu":
          return "de-AT";
        case "ita":
          return "it-IT";
        default:
          return "en-GB";
      }
    },
    mimetype: function () {
      if (this.objectInfo["dc_format"]) {
        for (let f of this.objectInfo["dc_format"]) {
          if (f.includes("/")) {
            return f;
          }
        }
      }
      return "";
    },
  },
  data() {
    return {
      windowWidth: 1000,
      initialInfo: null,
      parentCount: 0,
      childCount: 0,
      svgHeight: 600,
      existingFoundElem: [],
      allChildrens: [],
      allParentArr: [],
      nodes: [],
      links: [],
      nodeSize: 10,
      canvas: false,
      relationDialog: false,
      doiCiteDialog: false,
      doiCiteLoading: false,
      citeResult: "",
      citationStyle: "apa",
      citationStyles: [],
      citationStylesLoading: false,
      chosenRelation: "http://purl.org/dc/terms/references",
      utheseslink: "",
      stats: {
        download: "-",
        detail: "-",
      },
      checksums: [],
      currentPage: 1,
      pagesize: 10,
      docs: [],
      total: 0,
      membersPage: 1,
      membersPageSize: 10,
      detailsMetaInfo: null,
      collectionHelpDialog: false
    };
  },
  async fetch() {
    const data = await this.getInfo(this.$route.params.pid);
    let metaInfo = {}
    if (data.info) {
      const detailInfo = data.info;
      if (detailInfo) {
        let thumbnail =
          this.instanceconfig.api +
          "/object/" +
          detailInfo.pid +
          "/thumbnail";
        metaInfo.meta = [
          {
            hid: "og:title",
            name: "og:title",
            content: detailInfo.sort_dc_title,
          },
          {
            hid: "og:image",
            name: "og:image",
            content: thumbnail,
          },
          {
            hid: "og:image:width",
            name: "og:image:width",
            content: "1200",
          },
          {
            hid: "og:image:height",
            name: "og:image:height",
            content: "630",
          },
          {
            hid: "twitter:title",
            name: "twitter:title",
            content: detailInfo.sort_dc_title,
          },
          {
            hid: "twitter:card",
            name: "twitter:card",
            content: "summary_large_image",
          },
          {
            hid: "twitter:image",
            name: "twitter:image",
            content: thumbnail,
          },
        ];
        if (detailInfo.metatags) {
          metaInfo.title =
            detailInfo.metatags.citation_title +
            " (" +
            this.instanceconfig.title +
            " - " +
            detailInfo.pid +
            ")";
          Object.entries(detailInfo.metatags).forEach(([name, value]) => {
            if (Array.isArray(value)) {
              for (let v of value) {
                metaInfo.meta.push({
                  name: name,
                  content: v,
                });
              }
            } else {
              metaInfo.meta.push({
                name: name,
                content: value,
              });
            }
          });
        }
      }
    }
    this.detailsMetaInfo = metaInfo
  },
  methods: {
    nodeclick: function (event, node) {
      this.$router.push(node.id);
    },
    lcb: function (link) {
      link._svgAttrs = { "marker-end": "url(#m-end)" };
      return link;
    },
    getInfo: async function (oid) {
      let existingIndex = this.existingFoundElem.findIndex(
        (x) => x?.info?.pid === oid
      );
      if (existingIndex >= 0) {
        return this.existingFoundElem[existingIndex];
      } else {
        const response = await fetch(
          this.instanceconfig.api + `/object/${oid}/info`
        );
        let data = response.json();
        this.existingFoundElem.push(data);
        return data;
      }
    },
    getChild: async function (oid) {
      const info = await fetch(
        this.instanceconfig.solr +
          `/select?fq=ispartof:"${oid}"&indent=on&q=*:*&rows=1000&start=1&wt=json`
      );
      return info.json();
    },
    formChildren: async function (cb) {
      this.childCount += 1;
      if (this.allChildrens.length === 0) {
        let childRes = await this.getChild(this.initialInfo.oid);
        if (childRes?.response?.docs?.length) {
          this.allChildrens = childRes.response.docs.map((elem) => {
            return {
              oid: elem.pid,
              parents: elem.ispartof,
              title: elem.sort_dc_title,
              foundChild: false,
              nodeCount: this.childCount,
            };
          });
        } else {
          return cb(this.allChildrens);
        }
        return this.formChildren(cb);
      } else {
        const allChildRes = await Promise.all(
          this.allChildrens
            .filter((x) => !x.foundChild)
            .map(async (elem) => {
              let childRes = await this.getChild(elem.oid);
              if (childRes?.response?.docs?.length) {
                let allChildrensTemp = childRes.response.docs.map((elem) => {
                  return {
                    oid: elem.pid,
                    parents: elem.ispartof,
                    title: elem.sort_dc_title,
                    foundChild: false,
                    isNew: true,
                    nodeCount: this.childCount,
                  };
                });
                this.allChildrens = [...this.allChildrens, allChildrensTemp];
                this.allChildrens = this.allChildrens.flat();
                return {};
              } else {
                let nonChildNodeIndex = this.allChildrens.findIndex(
                  (x) => x.oid === elem.oid
                );
                if (nonChildNodeIndex >= 0) {
                  this.allChildrens[nonChildNodeIndex].foundChild = true;
                }
                return {};
              }
            })
        );
        this.allChildrens = this.allChildrens.map((elem) => {
          if (elem.isNew) {
            return {
              ...elem,
              isNew: false,
            };
          } else {
            return {
              ...elem,
              foundChild: true,
            };
          }
        });
        console.log("founded childrens 1 =>>", this.allChildrens);
        if (this.allChildrens.findIndex((x) => x.foundChild === false) >= 0) {
          return this.formChildren(cb);
        } else {
          console.log("founded childrens =>>", this.allChildrens);
          this.allChildrens = _.uniqBy(this.allChildrens, "oid");
          cb(this.allChildrens);
        }
      }
    },
    fetchCollectionTree: async function (oid) {
      try {
        this.initialInfo = {
          oid: this.objectInfo.pid,
          parents: this.objectInfo.ispartof,
          title: this.objectInfo.sort_dc_title,
          nodeCount: this.parentCount,
        };
        console.log("initialInfo");
        console.log(this.initialInfo);
        this.formChildren((data) => {
          this.formTree([this.initialInfo]);
        });
      } catch (error) {
        console.log("getInitialInfo error", error);
      } finally {
        setTimeout(() => {
          this.windowWidth =
            document.getElementById("d3-graph-container").offsetWidth;
        }, 6000);
      }
    },
    formTree: async function (mainArr) {
      try {
        this.parentCount -= 1;
        const allParentInfo1 = await Promise.all(
          mainArr.map(async (element) => {
            if (element?.parents?.length) {
              const allParentInfo = await Promise.all(
                element.parents.map(async (elem) => {
                  const parentInfo = await this.getInfo(elem);
                  let obj = {
                    oid: parentInfo?.info?.pid,
                    parents: parentInfo?.info?.ispartof || [],
                    title: parentInfo?.info?.sort_dc_title,
                    nodeCount: this.parentCount,
                  };
                  return obj;
                })
              );
              return allParentInfo;
            } else {
              element.parents = [];
              return element;
            }
          })
        );
        let mergedParentArr = allParentInfo1.flat();
        this.allParentArr = [
          ...this.allParentArr,
          allParentInfo1.flat(),
          ...this.allChildrens,
        ];
        const canFindParent = mergedParentArr.filter(
          (x) => x.parents.length !== 0
        );
        if (canFindParent.length) {
          return this.formTree(mergedParentArr);
        }
        let allParentFlat = _.uniqBy(this.allParentArr.flat(), "oid");
        if (allParentFlat.findIndex((x) => x.oid == this.initialInfo.oid) < 0) {
          allParentFlat.push(this.initialInfo);
        }
        console.log("allParentFlat", allParentFlat);
        let links = [];
        allParentFlat.forEach((elem, index) => {
          let childOfElement = allParentFlat.filter((x) =>
            x.parents.includes(elem.oid)
          );
          childOfElement.forEach((childElem) => {
            links.push({
              sid: elem.oid,
              tid: childElem.oid,
              _color: !elem?.parents?.length
                ? "#db4332"
                : "rgb(0, 98, 164/30%)",
            });
          });
          // allParentFlat[index].children = childOfElement
        });
        let alreadyFoundLevel = [];
        let isOddSaved = false;
        let isEvenSaved = false;
        let node = _.orderBy(allParentFlat, ["nodeCount"], ["asc"]).map(
          (elem, index) => {
            console.log("node elem", elem.oid, elem.nodeCount);
            let sameLevelCount = allParentFlat.filter(
              (x) => x.nodeCount === elem.nodeCount
            ).length;
            let existingLevelIndex = alreadyFoundLevel.findIndex(
              (x) => x.nodeCount === elem.nodeCount
            );
            let yPos =
              alreadyFoundLevel.length === 0
                ? 200
                : (alreadyFoundLevel.length + 1) * 200;
            let screenCenter = this.windowWidth / 2;
            let xPos = 25;
            if (sameLevelCount === 1) {
              xPos = screenCenter;
            }
            if (existingLevelIndex >= 0) {
              let alreadyFoundedDetails = alreadyFoundLevel[existingLevelIndex];
              yPos = alreadyFoundedDetails.yPos - 50;
              if (alreadyFoundedDetails.iteration % 2 === 0) {
                xPos =
                  screenCenter + (alreadyFoundedDetails.iteration / 2) * 100;
                if (isEvenSaved) {
                  yPos = yPos - 20;
                }
                isEvenSaved = !isEvenSaved;
              } else {
                xPos =
                  screenCenter - (alreadyFoundedDetails.iteration / 2) * 100;
                if (isOddSaved) {
                  yPos = yPos - 20;
                }
                isOddSaved = !isOddSaved;
              }
              alreadyFoundedDetails.xPos = xPos;
              alreadyFoundedDetails.iteration += 1;
            } else {
              xPos = screenCenter;
              alreadyFoundLevel.push({
                yPos,
                xPos,
                nodeCount: elem.nodeCount,
                iteration: 1,
              });
            }
            let nodeObj = {
              id: elem.oid,
              fy: yPos,
              fx: xPos,
              pinned: true,
              name: elem.title
                .split(" ")
                .splice(0, 3)
                .join(" ")
                .concat(` (${elem.oid}) `)
                .concat("..."),
              _color: !elem?.parents?.length ? "#db4332" : null,
            };
            return nodeObj;
          }
        );
        this.svgHeight =
          (alreadyFoundLevel.length + 1) * 200 > this.svgHeight
            ? (alreadyFoundLevel.length + 1) * 200
            : this.svgHeight;
        this.nodes = node;
        this.links = links;
      } catch (error) {
        console.log("form tree error", error);
      }
    },

    async getCollectionMembers(pid) {
      const id = pid.replace(/[o:]/g, "");
      let params = {
        q: '-hassuccessor:* AND -ismemberof:["" TO *]',
        "q.op": "AND",
        defType: "edismax",
        wt: "json",
        fq: `owner:* AND ispartof:"${pid}"`,
        start: (this.page - 1) * this.pagesize,
        rows: this.pagesize,
        sort: `pos_in_o_${id} asc`,
        facet: true,
        "facet.query": [],
      };
      try {
        this.$store.commit("setLoading", true);
        let response = await this.$http.request({
          method: "POST",
          url: this.instanceconfig.solr + "/select",
          data: qs.stringify(params, { arrayFormat: "repeat" }),
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        });
        this.$store.commit("setLoading", false);
        this.docs = response.data.response.docs;
        this.total = response.data.response.numFound;
      } catch (error) {
        this.$store.commit("setLoading", false);
        console.log(error);
        this.$store.commit("setAlerts", [{ type: "danger", msg: error }]);
      }
    },
    async fetchAsyncData(self, pid) {
      console.log('fetching object info ' + pid);
      await self.$store.dispatch("fetchObjectInfo", pid);
      self.postMetadataLoad(self);
      console.log('cmodel: ' + self.$store.state.objectInfo.cmodel);
      if (self.$store.state.objectInfo.cmodel === "Container") {
        console.log('fetching container members');
        await self.$store.dispatch(
          "fetchObjectMembers",
          self.$store.state.objectInfo
        );
      }
      if (self.$store.state.objectInfo.cmodel === "Collection") {
        console.log('fetching collection members');
        await self.getCollectionMembers(pid);
      }
    },
    async fetchUsageStats(self, pid) {
      console.log("fetchUsageStats");
      self.stats.download = null;
      self.stats.detail = null;
      try {
        let response = await self.$http.get(
          self.instanceconfig.api + "/stats/" + pid
        );
        if (response.data.stats) {
          self.stats.download = response.data.stats.downloads;
          self.stats.detail = response.data.stats.detail_page;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async fetchChecksums(self, pid) {
      try {
        let response = await self.$http.get(
          self.instanceconfig.api + "/object/" + pid + "/md5",
          {
            headers: {
              "X-XSRF-TOKEN": self.user.token,
            },
          }
        );
        if (response.data.md5) {
          self.checksums = response.data.md5;
        }
      } catch (error) {
        console.log(error);
      }
    },
    postMetadataLoad: function (self) {
      if (self.objectInfo) {
        if (self.objectInfo.metadata) {
          if (self.objectInfo.metadata["JSON-LD"]) {
            Object.entries(self.objectInfo.metadata["JSON-LD"]).forEach(
              ([p, arr]) => {
                if (p === "rdam:P30004") {
                  for (let o of arr) {
                    if (o["@type"] === "ids:uri") {
                      if (/utheses/.test(o["@value"])) {
                        self.utheseslink = o["@value"];
                      }
                    }
                  }
                }
              }
            );
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
      this.citationStylesLoading = true;
      try {
        let response = await this.$http.request({
          method: "GET",
          url: this.appconfig.apis.doi.citationstyles,
        });
        if (response.status !== 200) {
          if (response.data.alerts && response.data.alerts.length > 0) {
            this.$store.commit("setAlerts", response.data.alerts);
          }
        } else {
          this.citationStyles = response.data;
        }
      } catch (error) {
        console.log(error);
        this.$store.commit("setAlerts", [{ type: "danger", msg: error }]);
      } finally {
        this.citationStylesLoading = false;
      }
    },
    getBibTex: async function () {
      this.doiCiteLoading = true;
      try {
        let response = await this.$http.request({
          method: "GET",
          url: "https://" + this.appconfig.apis.doi.baseurl + "/" + this.doi,
          headers: {
            Accept: "application/x-bibtex",
          },
        });
        if (response.status !== 200) {
          if (response.data.alerts && response.data.alerts.length > 0) {
            this.$store.commit("setAlerts", response.data.alerts);
          }
        } else {
          this.citeResult = response.data;
        }
      } catch (error) {
        console.log(error);
        this.$store.commit("setAlerts", [{ type: "danger", msg: error }]);
      } finally {
        this.doiCiteLoading = false;
      }
    },
    getCitation: async function () {
      this.doiCiteLoading = true;
      try {
        let response = await this.$http.request({
          method: "GET",
          url: "https://" + this.appconfig.apis.doi.baseurl + "/" + this.doi,
          headers: {
            Accept:
              "text/x-bibliography; style=" +
              this.citationStyle +
              "; locale=" +
              this.citationLocale,
          },
        });
        if (response.status !== 200) {
          if (response.data.alerts && response.data.alerts.length > 0) {
            this.$store.commit("setAlerts", response.data.alerts);
          }
        } else {
          this.citeResult = response.data;
        }
      } catch (error) {
        console.log(error);
        this.$store.commit("setAlerts", [{ type: "danger", msg: error }]);
      } finally {
        this.doiCiteLoading = false;
      }
    },
    resetData: function (self) {
      self.stats = {
        download: "-",
        detail: "-",
      };
      self.checksums = [];
    },
  },
  mounted() {
    if (this.showCollectionTree) {
      this.fetchCollectionTree(this.$route.params.pid);
      setTimeout(() => {
        this.windowWidth =
          document.getElementById("d3-graph-container").offsetWidth;
      }, 2000);
    }
  },
  serverPrefetch() {
    // console.log('[' + this.$store.state.route.params.pid + '] prefetch')
    this.fetchAsyncData(this, this.$route.params.pid);
  },
  beforeRouteEnter: async function (to, from, next) {
    next(async function (vm) {
      console.log('beforeRouteEnter')
      if (
        process.browser &&
        (!vm.objectInfo || vm.objectInfo.pid !== to.params.pid)
      ) {
        vm.resetData(vm);
        vm.$store.commit("setLoading", true);
        vm.$store.commit("setObjectInfo", null);
        await vm.fetchAsyncData(vm, to.params.pid);
        vm.fetchChecksums(vm, to.params.pid);
        console.log("showtree:" + vm.showCollectionTree);
        if (vm.showCollectionTree) {
          vm.fetchCollectionTree(vm, to.params.pid);
        }
        vm.$store.commit("setLoading", false);
      }
      vm.fetchUsageStats(vm, to.params.pid);
    });
  },
  beforeRouteUpdate: async function (to, from, next) {
    console.log('beforeRouteUpdate')
    this.resetData(this);
    this.$store.commit("setLoading", true);
    this.$store.commit("setObjectInfo", null);
    await this.fetchAsyncData(this, to.params.pid);

    this.fetchChecksums(this, to.params.pid);
    console.log("showtree:" + this.showCollectionTree);
    if (this.showCollectionTree) {
      this.fetchCollectionTree(this, to.params.pid);
    }
    this.$store.commit("setLoading", false);
    next();
  },
};
</script>

<style lang="stylus" scoped>
@require '../../stylus/colors';

h3 {
  color: $phaidragrey.darken-4;
}
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

.iframe-container {
    overflow: hidden;
    padding-top: 56.25%;
    position: relative;
    width: 100%;
}

.responsive-iframe {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;

}
</style>
