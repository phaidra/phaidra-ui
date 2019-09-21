<template>
  <v-stepper v-if="form.sections.length > 0" v-model="step" non-linear>
    <v-stepper-header>
      <v-stepper-step :complete="step > 1" step="1">{{ $t('Start') }}</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="touCheckbox" step="2">{{ $t('Terms of use') }}</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :editable="step > 3" :complete="step > 3" step="3">{{ $t('Import') }}</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :editable="step > 4" :complete="step > 4" step="4">{{ $t('Check rights') }}</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :editable="step > 5" :complete="step > 5" step="5" :rules="[() => validationStatus !== 'error']">{{ $t('Mandatory fields') }} <small v-if="validationStatus === 'error'">{{ $t('Invalid metadata') }}</small></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :editable="step > 6" :complete="step > 6" step="6">{{ $t('Optional fields') }}</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="step > 7" step="7">{{ $t('Submit') }}</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>

      <v-stepper-content step="1">
        <v-container>
          <v-row no-gutters>
            <h3 class="title font-weight-light primary--text mb-4">{{ $t('Submitting a publication') }}</h3>
          </v-row>
          <v-row no-gutters>
            <i18n path="SUBMIT_START_1" tag="p">
              <a :href="'/info/policy'" target="_blank">{{ $t('guidelines') }}</a>
            </i18n>
          </v-row>
          <v-row no-gutters justify="center">
            <v-col>
              <v-alert outlined type="error" color="primary">
                <h3 class="title font-weight-light mb-4 ml-4">{{ $t('Important notice') }}</h3>
                <ul class="black--text ml-4">
                  <li>
                    <i18n path="SUBMIT_START_2" tag="p">
                      <strong>{{ $t('if you hold the necessary rights') }}</strong>
                    </i18n>
                  </li>
                  <li>
                    <i18n path="SUBMIT_START_3" tag="p">
                      <strong>{{ $t('a larger number of publications') }}</strong>
                      <a :href="'/info/contact'" target="_blank">{{ $t('contact us') }}</a>
                    </i18n>
                  </li>
                </ul>
              </v-alert>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <p>{{ $t('SUBMIT_START_4') }}</p>
          </v-row>
          <v-row no-gutters>
            <i18n path="SUBMIT_START_5" tag="p">
              <a href="mailto:support.uscholar@univie.ac.at">support.uscholar@univie.ac.at</a>
            </i18n>
          </v-row>
          <v-row no-gutters>
            <i18n path="SUBMIT_START_6" tag="p">
              <a :href="'/info/about'" target="_blank">{{ $t('contact us') }}</a>
              <a href="mailto:support.uscholar@univie.ac.at">support.uscholar@univie.ac.at</a>
            </i18n>
          </v-row>
          <v-divider class="mt-5 mb-7"></v-divider>
          <v-row no-gutters justify="center">
            <v-btn color="primary" @click="step = 2; $vuetify.goTo(1)">{{ $t('Start') }}</v-btn>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-container>
          <v-row no-gutters>
            <h3 class="title font-weight-light primary--text mb-4">{{ $t('Terms of use') }}</h3>
          </v-row>
          <v-row no-gutters>
            <p>{{ $t('SUBMIT_TOU_1') }}</p>
          </v-row>
          <v-row no-gutters>
            <p>{{ $t('SUBMIT_TOU_2') }}</p>
          </v-row>
          <v-row no-gutters>
            <p>{{ $t('SUBMIT_TOU_3') }}</p>
          </v-row>
          <v-row no-gutters>
            <v-checkbox v-model="touCheckbox" color="primary" :error-messages="touCheckboxErrors">
              <template v-slot:label>
                <i18n path="SUBMIT_TOU_4" tag="span" class="black--text">
                  <a @click.stop href="https://phaidra.univie.ac.at/terms_of_use/show_terms_of_use" target="_blank">Phaidra</a>
                </i18n>
              </template>
            </v-checkbox>
          </v-row>
          <v-row no-gutters>
            <a class="mt-4" href="https://uscholar.univie.ac.at/static/doc/InstitutionalRepository-TermsOfUse-German.pdf" target="_blank">{{ $t('Terms of use (PDF)') }}</a>
          </v-row>
          <v-divider class="mt-5 mb-7"></v-divider>
          <v-row no-gutters justify="space-between">
            <v-btn dark color="grey" @click="step = 1; $vuetify.goTo(1)">{{ $t('Back') }}</v-btn>
            <v-btn color="primary" @click="checkTou(); $vuetify.goTo(1)">{{ $t('Continue') }}</v-btn>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-container>
          <v-row no-gutters>
            <h3 class="title font-weight-light primary--text mb-4">{{ $t('Metadata-Import via DOI') }}</h3>
          </v-row>
          <v-row no-gutters>
            <p>{{ $t('Many electronically published journals assign persistent names, so called DOIs (Digital Object Identifiers), to their articles.') }}</p>
          </v-row>
          <v-row no-gutters>
            <p>{{ $t('If you enter your article\'s DOI here, its metadata can be loaded automatically.') }}</p>
          </v-row>
          <v-row no-gutters>
            <v-col cols="4">
              <v-text-field :error-messages="doiImportErrors" filled v-model="doiImportInput" label="DOI" :placeholder="$t('please enter')"/>
            </v-col>
            <v-col cols="1" class="ml-4 mt-2">
              <v-btn :loading="loading" :disabled="loading" color="primary" @click="importDOI()">{{ $t('Import') }}</v-btn>
            </v-col>
          </v-row>
          <v-alert outlined type="error" color="primary" transition="slide-y-transition" v-if="doiDuplicate">
            <span class="mr-2 black--text">{{ $t('Possible duplicate found') }}:</span><a target="_blank" :href="'https://' + instanceconfig.baseurl + '/' + doiDuplicate.pid">{{ doiDuplicate.title }}</a>
          </v-alert>
          <v-slide-y-transition>
            <v-row no-gutters v-if="doiImportData">
              <v-col cols="12" md="7">
                <v-card>
                  <v-card-title class="title font-weight-light grey white--text">{{ $t('Folowing metadata were retrieved') }}</v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row v-if="doiImportData.title">
                        <v-col md="2" cols="12" class="primary--text text-right">{{ $t('Title') }}</v-col>
                        <v-col md="10" cols="12">{{ doiImportData.title }}</v-col>
                      </v-row>
                      <v-row v-if="doiImportData.dateIssued">
                        <v-col md="2" cols="12" class="primary--text text-right">{{ $t('Date issued') }}</v-col>
                        <v-col md="10" cols="12">{{ doiImportData.dateIssued }}</v-col>
                      </v-row>
                      <v-row v-for="(author, i) of doiImportData.authors" :key="'aut'+i">
                        <v-col v-if="i === 0" md="2" cols="12" class="primary--text text-right">{{ $t('Authors') }}</v-col>
                        <v-col v-else md="2" cols="12"></v-col>
                        <v-col md="10" cols="12">{{ author.firstname + ' ' + author.lastname }}</v-col>
                      </v-row>
                      <v-row v-if="doiImportData.publicationType">
                        <v-col md="2" cols="12" class="primary--text text-right">{{ $t('Type of publication') }}</v-col>
                        <v-col md="10" cols="12">{{ doiImportData.publicationType }}</v-col>
                      </v-row>
                      <v-row v-if="doiImportData.publisher">
                        <v-col md="2" cols="12" class="primary--text text-right">{{ $t('PUBLISHER_VERLAG') }}</v-col>
                        <v-col md="10" cols="12">{{ doiImportData.publisher }}</v-col>
                      </v-row>
                      <v-row v-if="doiImportData.journalTitle">
                        <v-col md="2" cols="12" class="primary--text text-right">{{ $t('Appeared in') }}</v-col>
                        <v-col md="10" cols="12">{{ doiImportData.journalTitle }}</v-col>
                      </v-row>
                      <v-row v-if="doiImportData.journalISSN">
                        <v-col md="2" cols="12" class="primary--text text-right">{{ $t('ISSN') }}</v-col>
                        <v-col md="10" cols="12">{{ doiImportData.journalISSN }}</v-col>
                      </v-row>
                      <v-row v-if="doiImportData.journalVolume">
                        <v-col md="2" cols="12" class="primary--text text-right">{{ $t('Volume') }}</v-col>
                        <v-col md="10" cols="12">{{ doiImportData.journalVolume }}</v-col>
                      </v-row>
                      <v-row v-if="doiImportData.journalIssue">
                        <v-col md="2" cols="12" class="primary--text text-right">{{ $t('Issue') }}</v-col>
                        <v-col md="10" cols="12">{{ doiImportData.journalIssue }}</v-col>
                      </v-row>
                      <v-row v-if="doiImportData.pageStart">
                        <v-col md="2" cols="12" class="primary--text text-right">{{ $t('Start page') }}</v-col>
                        <v-col md="10" cols="12">{{ doiImportData.pageStart }}</v-col>
                      </v-row>
                      <v-row v-if="doiImportData.pageEnd">
                        <v-col md="2" cols="12" class="primary--text text-right">{{ $t('End page') }}</v-col>
                        <v-col md="10" cols="12">{{ doiImportData.pageEnd }}</v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-slide-y-transition>
          <v-row no-gutters>
            <h3 class="title font-weight-light primary--text my-4">{{ $t('Metadata-Import from prior version') }}</h3>
          </v-row>
          <v-row no-gutters>
            <p>{{ $t('If this publication is a new version (e.g. a postprint or publisher\'s PDF) of an already uploaded version (e.g. a preprint), the existing metadata can be imported and the two versions can be joined.') }}</p>
            <p>{{ $t('To do so, please search and select the previously uploaded version.') }}</p>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <v-text-field
                v-model="objectListSearch"
                append-icon="search"
                :label="$t('Search...')"
                single-line
                hide-details
                class="mb-4"
              ></v-text-field>
              <v-data-table
                hide-default-header
                :headers="objectListHeaders"
                :items="objectList"
                :search="objectListSearch"
                :custom-filter="objectListFilterTitle"
                :loading="loading"
                :loading-text="$t('Loading...')"
                :items-per-page="5"
              >
                <template v-slot:item.title="{ item }">
                  <span v-if="item.dc_title">{{ item.dc_title[0] | truncate(50) }}</span>
                </template>
                <template v-slot:item.created="{ item }">
                  {{ item.created | date }}
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-btn text color="primary" @click="loadObjectMetadata(item)">{{ $t('Load') }}</v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <h3 class="title font-weight-light primary--text my-4">{{ $t('Metadata-Import from a template') }}</h3>
          </v-row>
          <v-row no-gutters>
            <p>{{ $t('Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.') }}</p>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <p-templates ref="templates" :tag="'ir'" v-on:load-template="loadTemplate($event)"></p-templates>
            </v-col>
          </v-row>
          <v-divider class="mt-5 mb-7"></v-divider>
          <v-row no-gutters justify="space-between">
            <v-btn dark color="grey" @click="step = 2; $vuetify.goTo(1)">{{ $t('Back') }}</v-btn>
            <v-btn color="primary" @click="step = 4; $vuetify.goTo(1)">{{ $t('Continue') }}</v-btn>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="4">
        <v-container>
          <v-row no-gutters>
            <h3 class="title font-weight-light primary--text mb-4">{{ $t('SHERPA/RoMEO') }}</h3>
          </v-row>
          <v-row no-gutters>
            <p>{{ $t('SHERPA RoMEO is an online resource that aggregates and analyses publisher open access policies from around the world and provides summaries of self-archiving permissions and conditions of rights given to authors on a journal-by-journal basis.') }}</p>
          </v-row>
          <v-row no-gutters justify="center">
            <v-col cols="12" md="8">
              <v-combobox
                v-model="rightsCheckModel"
                :items="rightsCheckItems"
                :loading="rightsCheckLoading"
                :search-input.sync="rightsCheckSearch"
                :error-messages="rightsCheckErrors"
                cache-items
                hide-no-data
                hide-selected
                item-text="title"
                item-value="issn"
                solo
                :placeholder="$t('please enter exact journal title or ISSN')"
                filled
                clearable
              >
                <template slot="item" slot-scope="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ $t('ISSN') + ': ' + item.issn }}</v-list-item-subtitle>
                    <v-list-item-subtitle>{{ $t('PUBLISHER_VERLAG') + ': ' + item.romeopub }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template slot="selection" slot-scope="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-combobox>
            </v-col>
          </v-row>
          <v-row no-gutters v-if="rightsCheckData" justify="center">
            <v-col cols="12" md="8">
              <v-row v-if="rightsCheckData.journal">
                <v-col md="2" cols="12" class="primary--text text-right">{{ $t('JOURNAL_ERCHIENENIN') }}</v-col>
                <v-col md="10" cols="12">{{ rightsCheckData.journal.title }}</v-col>
              </v-row>
              <v-row v-if="rightsCheckData.publisher">
                <v-col md="2" cols="12" class="primary--text text-right">{{ $t('PUBLISHER_VERLAG') }}</v-col>
                <v-col md="10" cols="12">
                  <template v-if="rightsCheckData.publisher.homeurl">
                    <a target="_blank" :href="rightsCheckData.publisher.homeurl">{{ rightsCheckData.publisher.name }}</a>
                  </template>
                  <template v-else>{{ rightsCheckData.publisher.name }}</template>
                </v-col>
              </v-row>
              <v-row v-if="rightsCheckData.publisher.prearchiving">
                <v-col md="2" cols="12" class="primary--text text-right">{{ $t('AUTHOR_PREPRINT') }}</v-col>
                <v-col md="10" cols="12">
                  <v-icon v-if="rightsCheckData.publisher.prearchiving === 'can'" left color="green">mdi-check</v-icon>
                  <v-icon v-if="rightsCheckData.publisher.prearchiving === 'cannot'" left color="red">mdi-cancel</v-icon>
                  <v-icon v-if="rightsCheckData.publisher.prearchiving === 'restricted'" left color="red">mdi-exclamation</v-icon>
                  {{ rightsCheckData.publisher.prearchiving }}
                </v-col>
              </v-row>
              <v-row v-if="rightsCheckData.publisher.prerestrictions && (rightsCheckData.publisher.prerestrictions.length > 0)">
                <v-col md="2" cols="12" class="primary--text text-right">{{ $t('Restrictions') }}</v-col>
                <v-col md="10" cols="12">
                  <ul>
                    <li v-for="(r, i) in rightsCheckData.publisher.prerestrictions" :key="i">
                      {{ r }}
                    </li>
                  </ul>
                </v-col>
              </v-row>
              <v-row v-if="rightsCheckData.publisher.postarchiving">
                <v-col md="2" cols="12" class="primary--text text-right">{{ $t('AUTHOR_POSTPRINT') }}</v-col>
                <v-col md="10" cols="12">
                  <v-icon v-if="rightsCheckData.publisher.postarchiving === 'can'" left color="green">mdi-check</v-icon>
                  <v-icon v-if="rightsCheckData.publisher.postarchiving === 'cannot'" left color="red">mdi-cancel</v-icon>
                  <v-icon v-if="rightsCheckData.publisher.postarchiving === 'restricted'" left color="red">mdi-exclamation</v-icon>
                  {{ rightsCheckData.publisher.postarchiving }}
                </v-col>
              </v-row>
              <v-row v-if="rightsCheckData.publisher.postrestrictions && (rightsCheckData.publisher.postrestrictions.length > 0)">
                <v-col md="2" cols="12" class="primary--text text-right">{{ $t('Restrictions') }}</v-col>
                <v-col md="10" cols="12">
                  <ul>
                    <li v-for="(r, i) in rightsCheckData.publisher.postrestrictions" :key="i">
                      {{ r }}
                    </li>
                  </ul>
                </v-col>
              </v-row>
              <v-row v-if="rightsCheckData.publisher.pdfarchiving">
                <v-col md="2" cols="12" class="primary--text text-right">{{ $t('PUBLISHER_PDF') }}</v-col>
                <v-col md="10" cols="12">
                  <v-icon v-if="rightsCheckData.publisher.pdfarchiving === 'can'" left color="green">mdi-check</v-icon>
                  <v-icon v-if="rightsCheckData.publisher.pdfarchiving === 'cannot'" left color="red">mdi-cancel</v-icon>
                  <v-icon v-if="rightsCheckData.publisher.pdfarchiving === 'restricted'" left color="red">mdi-exclamation</v-icon>
                  {{ rightsCheckData.publisher.pdfarchiving }}
                </v-col>
              </v-row>
              <v-row v-if="rightsCheckData.publisher.pdfrestrictions && (rightsCheckData.publisher.pdfrestrictions.length > 0)">
                <v-col md="2" cols="12" class="primary--text text-right">{{ $t('Restrictions') }}</v-col>
                <v-col md="10" cols="12">
                  <ul>
                    <li v-for="(r, i) in rightsCheckData.publisher.pdfrestrictions" :key="i">
                      {{ r }}
                    </li>
                  </ul>
                </v-col>
              </v-row>
              <v-row v-if="rightsCheckData.publisher.conditions">
                <v-col md="2" cols="12" class="primary--text text-right">{{ $t('Further conditions') }}</v-col>
                <v-col md="10" cols="12">
                  <ul>
                    <li v-for="(r, i) in rightsCheckData.publisher.conditions" :key="i">
                      {{ r }}
                    </li>
                  </ul>
                </v-col>
              </v-row>
              <v-row v-if="rightsCheckData.disclaimer">
                <v-col md="2" cols="12" class="primary--text text-right">{{ $t('Disclaimer') }}</v-col>
                <v-col md="10" cols="12">{{rightsCheckData.disclaimer}}</v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider class="mt-5 mb-7"></v-divider>
          <v-row no-gutters justify="space-between">
            <v-btn dark color="grey" @click="step = 3; $vuetify.goTo(1)">{{ $t('Back') }}</v-btn>
            <v-btn color="primary" @click="step = 5; $vuetify.goTo(1)">{{ $t('Continue') }}</v-btn>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content v-for="(s) in form.sections" :key="'tabitem'+s.id" :step="s.id">
        <v-container>
          <v-alert outlined type="error" color="primary" transition="slide-y-transition" v-if="validationErrors.length > 0">
            <span v-for="(error, i) of validationErrors" :key="'verr'+i">{{ error }}</span>
          </v-alert>
          <v-row>
            <v-col cols="11" offset="1">
              <template v-for="(f, i) in s.fields">
                <v-row no-gutters :key="f.id">

                  <template v-if="f.component === 'p-text-field'">
                    <p-i-text-field
                      v-bind.sync="f"
                      v-on:input="f.value=$event"
                      v-on:input-language="setSelected(f, 'language', $event)"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                      class="my-2"
                    ></p-i-text-field>
                  </template>

                  <template v-else-if="f.component === 'p-keyword'">
                    <p-i-keyword
                      v-bind.sync="f"
                      v-on:input="f.value=$event"
                      v-on:input-language="setSelected(f, 'language', $event)"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                      class="my-2"
                    ></p-i-keyword>
                  </template>

                  <template v-if="f.component === 'p-title'">
                    <p-i-title
                      v-bind.sync="f"
                      v-on:input-title="f.title=$event"
                      v-on:input-subtitle="f.subtitle=$event"
                      v-on:input-language="setSelected(f, 'language', $event)"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                      v-on:up="sortFieldUp(s.fields, f)"
                      v-on:down="sortFieldDown(s.fields, f)"
                      class="my-2"
                    ></p-i-title>
                  </template>

                  <template v-else-if="f.component === 'p-select'">
                    <p-i-select
                      v-show="f.predicate !== 'dcterms:type'"
                      v-bind.sync="f"
                      v-on:input="selectInput(s.fields, f, $event)"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                      class="my-2"
                    ></p-i-select>
                    <template v-if="f.predicate === 'dcterms:accessRights'">
                      <br/>
                      <v-col cols="10">
                        <v-slide-y-transition hide-on-leave>
                          <v-menu
                            v-model="embargoDateMenu"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-show="showEmbargoDate"
                                :value="embargoDateModel"
                                :label="$t('Embargo date')"
                                :rules="[validationrules.date]"
                                filled
                                append-icon="event"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              color="primary"
                              :show-current="false"
                              v-model="embargoDateModel"
                              :locale="$i18n.locale === 'deu' ? 'de-AT' : 'en-GB'"
                              v-on:input="embargoDateMenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-slide-y-transition>
                      </v-col>
                    </template>
                  </template>

                  <template v-else-if="f.component === 'p-date-edtf'">
                    <p-i-date-edtf
                      v-bind.sync="f"
                      v-on:input-date="f.value=$event"
                      v-on:input-date-type="setSelected(f, 'type', $event)"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                      class="my-2"
                    ></p-i-date-edtf>
                  </template>

                  <template v-else-if="f.component === 'p-series'">
                    <v-col cols="10">
                      <p-i-series
                        v-bind.sync="f"
                        v-on:input-select-journal="selectJournal(s.fields, f, $event)"
                        v-on:input-title="f.title=$event"
                        v-on:input-title-language="setSelected(f, 'titleLanguage', $event)"
                        v-on:input-volume="f.volume=$event"
                        v-on:input-issue="f.issue=$event"
                        v-on:input-issued="f.issued=$event"
                        v-on:input-issn="f.issn=$event"
                        v-on:input-identifier="f.identifier=$event"
                        v-on:add="addField(s.fields, f)"
                        v-on:remove="removeField(s.fields, f)"
                        class="my-2"
                      ></p-i-series>
                    </v-col>
                  </template>

                  <template v-else-if="f.component === 'p-citation'">
                    <v-col cols="10">
                      <p-i-citation
                        v-bind.sync="f"
                        v-on:input-citation-type="setSelected(f, 'type', $event)"
                        v-on:input-citation="f.citation=$event"
                        v-on:input-citation-language="setSelected(f, 'citationLanguage', $event)"
                        v-on:input-identifier="f.identifier=$event"
                        v-on:add="addField(s.fields, f)"
                        v-on:remove="removeField(s.fields, f)"
                        class="my-2"
                      ></p-i-citation>
                    </v-col>
                  </template>

                  <template v-else-if="f.component === 'p-bf-publication'">
                    <v-col cols="10">
                      <p-i-bf-publication
                        v-bind.sync="f"
                        v-on:input-suggest-publisher="publisherSuggestInput(f, $event)"
                        v-on:input-publisher-name="f.publisherName=$event"
                        v-on:change-type="f.publisherType = $event"
                        v-on:input-publisher-select="publisherSelectInput(f, $event)"
                        v-on:input-publishing-place="f.publishingPlace=$event"
                        v-on:input-publishing-date="f.publishingDate=$event"
                        v-on:add="addField(s.fields, f)"
                        v-on:remove="removeField(s.fields, f)"
                        class="my-2"
                      ></p-i-bf-publication>
                    </v-col>
                  </template>

                  <template v-else-if="f.component === 'p-entity-extended'">
                    <v-col cols="10">
                      <p-i-entity-extended
                        v-bind.sync="f"
                        v-on:change-type="f.type = $event"
                        v-on:input-firstname="f.firstname = $event"
                        v-on:input-lastname="f.lastname = $event"
                        v-on:input-name="f.name = $event"
                        v-on:input-identifier="f.identifierText = $event"
                        v-on:change-affiliation-type="f.affiliationType = $event"
                        v-on:input-affiliation-select="affiliationSelectInput(f, $event)"
                        v-on:input-affiliation-other="f.affiliationText = $event"
                        v-on:change-organization-type="f.organizationType = $event"
                        v-on:input-organization-select="organizationSelectInput(f, $event)"
                        v-on:input-organization-other="f.organizationText = $event"
                        v-on:input-role="roleInput(f, $event)"
                        v-on:add="addField(s.fields, f)"
                        v-on:remove="removeField(s.fields, f)"
                        v-on:up="sortFieldUp(s.fields, f)"
                        v-on:down="sortFieldDown(s.fields, f)"
                        class="my-2"
                      ></p-i-entity-extended>
                    </v-col>
                  </template>

                  <template v-else-if="f.component === 'p-subject-gnd'">
                    <p-i-subject-gnd
                      v-bind.sync="f"
                      v-on:input="f.value=$event"
                      v-on:resolve="updateSubject(f, $event)"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                      class="my-2"
                    ></p-i-subject-gnd>
                  </template>

                  <template v-else-if="(f.component === 'p-literal') || (f.component === 'p-alternate-identifier')">
                    <p-i-literal
                      v-bind.sync="f"
                      v-on:input-value="f.value=$event"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                      class="my-2"
                    ></p-i-literal>
                  </template>

                  <template v-else-if="f.component === 'p-project'">
                    <v-col cols="10">
                      <p-i-project
                        v-bind.sync="f"
                        v-on:input-name="f.name=$event"
                        v-on:input-name-language="setSelected(f, 'nameLanguage', $event)"
                        v-on:input-description="f.description=$event"
                        v-on:input-description-language="setSelected(f, 'descriptionLanguage', $event)"
                        v-on:input-identifier="f.identifier=$event"
                        v-on:input-homepage="f.homepage=$event"
                        v-on:add="addField(s.fields, f)"
                        v-on:remove="removeField(s.fields, f)"
                        class="my-2"
                      ></p-i-project>
                    </v-col>
                  </template>

                  <template v-else-if="f.component === 'p-funder'">
                    <p-i-funder
                      v-bind.sync="f"
                      v-on:input-name="f.name=$event"
                      v-on:input-name-language="setSelected(f, 'nameLanguage', $event)"
                      v-on:input-identifier="f.identifier=$event"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                      class="my-2"
                    ></p-i-funder>
                  </template>

                  <template v-else-if="f.component === 'p-file'">
                    <v-col cols="12">
                      <v-row no-gutters>
                        <p-i-file
                          v-bind.sync="f"
                          v-on:input-file="setFilename(f, $event)"
                          v-on:input-mimetype="setSelected(f, 'mimetype', $event)"
                          v-on:add="addField(s.fields, f)"
                          v-on:remove="removeField(s.fields, f)"
                          class="my-2"
                        ></p-i-file>
                      </v-row>
                      <v-row no-gutters v-if="s.fields[i+1].component !== 'p-file'">
                        <v-col cols="2" offset="8">
                          <v-btn @click="addField(s.fields, f)" color="grey" dark class="mb-8"><v-icon left dark>mdi-plus-box</v-icon>Add another format</v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </template>

                </v-row>

              </template>
              <v-row>
                 <v-col cols="12" md="10">
                  <submit-ir-license-info v-if="s.id === 5" :license="license"></submit-ir-license-info>
                 </v-col>
              </v-row>
              <v-divider class="mt-5 mb-7"></v-divider>
              <v-row no-gutters justify="space-between">
                <v-btn dark color="grey" @click="step = (s.id - 1); $vuetify.goTo(1)">{{ $t('Back') }}</v-btn>
                <v-btn color="primary" @click="continueForm(s.id)">{{ $t('Continue') }}</v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="7">
        <v-container>
          <v-row>
            <v-col md="10" offset-md="1">
              <p-d-jsonld :jsonld="jsonld"></p-d-jsonld>
            </v-col>
          </v-row>
          <v-divider class="mt-5 mb-7"></v-divider>
          <v-row no-gutters>
            <v-btn dark color="grey" :disabled="loading" @click="step = 6; $vuetify.goTo(1)">{{ $t('Back') }}</v-btn>
            <v-spacer></v-spacer>
            <v-dialog v-model="templateDialog" width="500">
              <template v-slot:activator="{ on }">
                <v-btn class="mr-3" v-on="on" dark raised :disabled="loading" color="grey">{{ $t('Save as template') }}</v-btn>
              </template>
              <v-card>
                <v-card-title class="title font-weight-light grey lighten-2" primary-title>{{ $t('Save as template') }}</v-card-title>
                <v-card-text>
                  <v-text-field class="mt-4" hide-details filled single-line v-model="templateName" :label="$t('Template name')" ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn :loading="loading" :disabled="loading" color="grey" dark @click="templateDialog= false">{{ $t('Cancel') }}</v-btn>
                  <v-btn :loading="loading" :disabled="loading" color="primary" @click="saveAsTemplate()">{{ $t('Save') }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="resetDialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn class="mr-3" v-on="on" :disabled="loading" dark color="warning">{{ $t('Reset submission') }}</v-btn>
              </template>
              <v-card>
                <v-card-title class="title font-weight-light grey white--text">
                  {{ $t('Reset submission') }}
                </v-card-title>
                <v-card-text>
                  <p class="mt-6 title font-weight-light grey--text text--darken-3">{{ $t('Reset submission process?') }}</p>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn dark @click="resetDialog = false" color="grey">{{ $t('Cancel') }}</v-btn>
                  <v-btn @click="resetSubmission(); resetDialog = false" color="primary">{{ $t('Reset submission') }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="discardDialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" class="mr-3" :disabled="loading" dark color="error">{{ $t('Discard submission') }}</v-btn>
              </template>
              <v-card>
                <v-card-title class="title font-weight-light grey white--text">
                  {{ $t('Discard submission') }}
                </v-card-title>
                <v-card-text>
                  <p class="mt-6 title font-weight-light grey--text text--darken-3">{{ $t('Discard submission process?') }}</p>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn dark @click="discardDialog = false" color="grey">{{ $t('Cancel') }}</v-btn>
                  <v-btn :to="'/'" @click="discardDialog = false" color="primary">{{ $t('Discard') }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn raised color="primary" :loading="loading" :disabled="loading" @click="submit()">{{ $t('Submit') }}</v-btn>
          </v-row>
        </v-container>
      </v-stepper-content>

    </v-stepper-items>

  </v-stepper>

</template>

<script>
import SubmitIrLicenseInfo from '@/components/SubmitIrLicenseInfo'
import xmlUtils from 'phaidra-vue-components/src/utils/xml'
import arrays from 'phaidra-vue-components/src/utils/arrays'
import jsonLd from 'phaidra-vue-components/src/utils/json-ld'
import fields from 'phaidra-vue-components/src/utils/fields'
import { context } from '@/mixins/context'
import { config } from '@/mixins/config'
import { validationrules } from 'phaidra-vue-components/src/mixins/validationrules'
import qs from 'qs'
import axios from 'axios'
var iconv = require('iconv-lite')

export default {
  name: 'submit-ir',
  mixins: [ context, config, validationrules ],
  components: {
    SubmitIrLicenseInfo
  },
  computed: {
    importedMetadata: function () {
      if (this.doiImportData) {
        return this.doiImportData
      } else {
        return null
      }
    },
    doiToImport: function () {
      if (this.doiImportInput) {
        // TODO clean input
        return this.doiImportInput
      } else {
        return null
      }
    },
    jsonld: function () {
      return this.getJsonld()
    }
  },
  data () {
    return {
      form: {
        sections: []
      },
      step: 1,
      loadedMetadata: [],
      loading: false,
      templateDialog: false,
      templateName: '',
      discardDialog: false,
      resetDialog: false,
      touCheckbox: false,
      touCheckboxErrors: [],
      doiImportInput: null,
      doiImportData: null,
      doiImportErrors: [],
      license: null,
      showEmbargoDate: false,
      embargoDateMenu: false,
      embargoDateModel: null,
      embargoDate: null,
      rightsCheckModel: null,
      rightsCheckItems: [],
      rightsCheckErrors: [],
      rightsCheckData: null,
      rightsCheckLoading: false,
      rightsCheckSearch: '',
      rightsCheckDebounce: 500,
      rightsCheckMinLetters: 3,
      rightsCheckDebounceTask: null,
      doiDuplicate: null,
      validationStatus: '',
      validationErrors: [],
      objectListLoading: false,
      objectList: [],
      objectListSearch: '',
      objectListHeaders: [
        { text: 'Pid', align: 'left', value: 'pid' },
        { text: 'Title', align: 'left', value: 'title' },
        { text: 'Created', align: 'right', value: 'created' },
        { text: 'Actions', align: 'right', value: 'actions', sortable: false }
      ]
    }
  },
  watch: {
    rightsCheckSearch (val) {
      val && this.queryRightsCheckDebounce(val)
    },
    rightsCheckModel (val) {
      val.issn && this.queryRightsCheckJournal(val.issn)
    }
  },
  methods: {
    async loadObjectMetadata (doc) {
      this.loading = true
      try {
        let response = await fetch(this.instanceconfig.api + '/object/' + doc.pid + '/jsonld', {
          method: 'GET',
          mode: 'cors'
        })
        let json = await response.json()
        let components = jsonLd.json2components(json)
        this.setFormFromObject(components)
        this.step = 5
      } catch (error) {
        console.log(error)
      } finally {
        this.objectListLoading = false
      }
    },
    objectListFilterTitle (value, search, item) {
      if (item.dc_title) {
        if (item.dc_title.length > 0) {
          return item.dc_title[0].indexOf(search) !== -1
        } else {
          return false
        }
      } else {
        return false
      }
    },
    objectListLoad: async function () {
      this.objectListLoading = true
      try {
        let params = {
          q: '*:*',
          defType: 'edismax',
          wt: 'json',
          start: 0,
          rows: 1000,
          sort: 'created desc',
          fq: [ 'edm_hastype_id:"https://vocab.phaidra.org/vocabulary/VKA6-9XTY"', 'owner:' + this.user.username ]
        }
        let query = qs.stringify(params, { encodeValuesOnly: true, indices: false })
        let response = await fetch(this.instanceconfig.solr + '/select', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: query
        })
        let json = await response.json()
        this.objectList = json.response.docs
      } catch (error) {
        console.log(error)
      } finally {
        this.objectListLoading = false
      }
    },
    queryRightsCheckDebounce (value) {
      this.showList = true
      if (this.rightsCheckDebounce) {
        if (this.rightsCheckDebounceTask !== undefined) clearTimeout(this.rightsCheckDebounceTask)
        this.rightsCheckDebounceTask = setTimeout(() => {
          return this.suggestJournals(value)
        }, this.rightsCheckDebounce)
      } else {
        return this.suggestJournals(value)
      }
    },
    async suggestJournals (q) {
      if (q.length < this.rightsCheckMinLetters || !this.appconfig.apis.sherparomeo) return

      this.rightsCheckLoading = true
      this.rightsCheckItems = []

      var params = {
        ak: this.appconfig.apis.sherparomeo.key,
        versions: 'all',
        qtype: 'contains',
        jtitle: q
      }

      var query = qs.stringify(params)

      try {
        let response = await axios.request({
          method: 'GET',
          url: this.appconfig.apis.sherparomeo.url + '?' + query,
          responseType: 'arraybuffer'
        })
        let utfxml = iconv.decode(Buffer.from(response.data), 'ISO-8859-1')
        let dp = new window.DOMParser()
        let obj = xmlUtils.xmlToJson(dp.parseFromString(utfxml, 'text/xml'))
        for (let j of obj.romeoapi[1].journals.journal) {
          this.rightsCheckItems.push(
            {
              title: j.jtitle['#text'],
              issn: j.issn['#text'],
              romeopub: j.romeopub['#text'] ? j.romeopub['#text'] : this.$t('Not available')
            }
          )
        }
      } catch (error) {
        console.log(error)
        this.rightsCheckErrors.push(error)
      } finally {
        this.rightsCheckLoading = false
      }
    },
    async queryRightsCheckJournal (issn) {
      if (!issn || !this.appconfig.apis.sherparomeo) return

      this.rightsCheckLoading = true

      var params = {
        ak: this.appconfig.apis.sherparomeo.key,
        versions: 'all',
        issn: issn
      }

      var query = qs.stringify(params)

      try {
        let response = await axios.request({
          method: 'GET',
          url: this.appconfig.apis.sherparomeo.url + '?' + query,
          responseType: 'arraybuffer'
        })
        let utfxml = iconv.decode(Buffer.from(response.data), 'ISO-8859-1')
        let dp = new window.DOMParser()
        let obj = this.xmlToJson(dp.parseFromString(utfxml, 'text/xml'))
        let disclaimer = obj.romeoapi[1].header.disclaimer['#text']
        let j = obj.romeoapi[1].journals.journal
        let journal = {
          title: j.jtitle['#text'],
          issn: j.issn['#text'],
          romeopub: j.romeopub['#text'] ? j.romeopub['#text'] : this.$t('Not available')
        }
        let p = obj.romeoapi[1].publishers.publisher
        let publisher = {
          name: p.name['#text'],
          homeurl: p.homeurl['#text'],
          color: p.romeocolour['#text']
        }
        publisher['prearchiving'] = p.preprints.prearchiving['#text']
        publisher['prerestrictions'] = []
        if (p.preprints.prerestrictions.prerestriction) {
          for (let prerestriction of p.preprints.prerestrictions.prerestriction) {
            publisher['prerestrictions'].push(prerestriction['#text'])
          }
        }
        publisher['postarchiving'] = p.postprints.postarchiving['#text']
        publisher['postrestrictions'] = []
        if (p.postprints.postrestrictions.postrestriction) {
          for (let postrestriction of p.postprints.postrestrictions.postrestriction) {
            publisher['postrestrictions'].push(postrestriction['#text'])
          }
        }
        publisher['pdfarchiving'] = p.pdfversion.pdfarchiving['#text']
        publisher['pdfrestrictions'] = []
        if (p.pdfversion.pdfrestrictions.pdfrestriction) {
          for (let pdfrestriction of p.pdfversion.pdfrestrictions.pdfrestriction) {
            publisher['pdfrestrictions'].push(pdfrestriction['#text'])
          }
        }
        publisher['conditions'] = []
        if (p.conditions.condition) {
          for (let condition of p.conditions.condition) {
            publisher['conditions'].push(condition['#text'])
          }
        }
        this.rightsCheckData = {
          disclaimer: disclaimer,
          journal: journal,
          publisher: publisher
        }
      } catch (error) {
        console.log(error)
        this.rightsCheckErrors.push(error)
      } finally {
        this.rightsCheckLoading = false
      }
    },
    importDOI: async function () {
      this.loading = true
      this.doiImportErrors = []
      this.doiDuplicate = null
      this.doiImportData = null
      if (this.doiImportInput) {
        try {
          let params = {
            wt: 'json',
            q: 'dc_identifier:"' + this.doiToImport + '"'
          }

          let query = qs.stringify(params)

          let solrResponse = await fetch(this.instanceconfig.solr + '/select?' + query, {
            method: 'GET',
            mode: 'cors'
          })
          let solrJson = await solrResponse.json()
          if (solrJson.response.numFound > 0) {
            this.doiDuplicate = {
              pid: solrJson.response.docs[0].pid,
              title: solrJson.response.docs[0].dc_title[0]
            }
          } else {
            let response = await fetch('https://' + this.appconfig.apis.doi.baseurl + '/' + this.doiToImport, {
              method: 'GET',
              mode: 'cors',
              headers: {
                'Accept': this.appconfig.apis.doi.accept
              }
            })
            let crossrefData = await response.json()

            this.doiImportData = {
              doi: this.doiToImport,
              title: '',
              dateIssued: '',
              authors: [],
              publicationType: '',
              publisher: '',
              journalTitle: '',
              journalISSN: '',
              journalVolume: '',
              journalIssue: '',
              pageStart: '',
              pageEnd: ''
            }

            if (crossrefData['title']) {
              if (Array.isArray(crossrefData['title'])) {
                this.doiImportData.title = crossrefData['title'][0]
              } else {
                this.doiImportData.title = crossrefData['title']
              }
            }

            if (crossrefData['issued']) {
              if (crossrefData['issued']['date-parts']) {
                this.doiImportData.dateIssued = crossrefData['issued']['date-parts'][0][0]
              }
            }

            let authors = crossrefData['author']
            if (authors.length > 0) {
              for (let author of authors) {
                this.doiImportData.authors.push({ firstname: author['given'], lastname: author['family'] })
              }
            }

            // https://github.com/citation-style-language/schema/blob/master/csl-types.rnc
            // https://wiki.univie.ac.at/display/IR/Mapping+CrossRef-Erscheinungsformen
            switch (crossrefData['type']) {
              case 'article':
              case 'journal-article':
              case 'article-journal':
                this.doiImportData.publicationType = 'article'
                this.doiImportData.publicationTypeId = 'https://vocab.phaidra.org/vocabulary/VKA6-9XTY'
                break
              case 'report':
                this.doiImportData.publicationType = 'report'
                this.doiImportData.publicationTypeId = 'https://vocab.phaidra.org/vocabulary/JMAV-7F3R'
                break
              case 'book':
              case 'monograph':
              case 'reference-book':
              case 'edited-book':
                this.doiImportData.publicationType = 'book'
                this.doiImportData.publicationTypeId = 'https://vocab.phaidra.org/vocabulary/47QB-8QF1'
                break
              case 'book-chapter':
              case 'book-part':
              case 'book-section':
                this.doiImportData.publicationType = 'book_part'
                this.doiImportData.publicationTypeId = 'https://vocab.phaidra.org/vocabulary/XA52-09WA'
                break
              case 'dissertation':
                this.doiImportData.publicationType = 'doctoral_thesis'
                this.doiImportData.publicationTypeId = 'https://vocab.phaidra.org/vocabulary/1PHE-7VMS'
                break
              case 'proceedings-article':
              case 'proceedings':
                this.doiImportData.publicationType = 'conference_object'
                this.doiImportData.publicationTypeId = 'https://vocab.phaidra.org/vocabulary/QKDF-E5HA'
                break
              case 'dataset':
                this.doiImportData.publicationType = 'research_data'
                this.doiImportData.publicationTypeId = 'https://vocab.phaidra.org/vocabulary/KW6N-2VTP'
                break
              case 'other':
              case 'standard':
              case 'standard-series':
              case 'book-entry':
              case 'book-series':
              case 'book-set':
              case 'book-track':
              case 'component':
              case 'journal-issue':
              case 'journal-volume':
              case 'journal':
              case 'report-series':
                this.doiImportData.publicationType = 'other'
                this.doiImportData.publicationTypeId = 'https://vocab.phaidra.org/vocabulary/PYRE-RAWJ'
                break
              default:
                this.doiImportData.publicationType = 'other'
                this.doiImportData.publicationTypeId = 'https://vocab.phaidra.org/vocabulary/PYRE-RAWJ'
            }

            if (crossrefData['publisher']) {
              this.doiImportData.publisher = crossrefData['publisher']
            }

            if (crossrefData['container-title']) {
              this.doiImportData.journalTitle = crossrefData['container-title']
            }

            if (crossrefData['ISSN']) {
              if (Array.isArray(crossrefData['ISSN'])) {
                this.doiImportData.journalISSN = crossrefData['ISSN'][0]
              } else {
                this.doiImportData.journalISSN = crossrefData['ISSN']
              }
            }

            if (crossrefData['volume']) {
              this.doiImportData.journalVolume = crossrefData['volume']
            }

            if (crossrefData['issue']) {
              this.doiImportData.journalIssue = crossrefData['issue']
            }

            if (crossrefData['page']) {
              let page = crossrefData['page'].split('-')
              let regexnum = new RegExp('^[0-9]+$')
              let startpage = page[0]
              if (regexnum.test(startpage)) {
                this.doiImportData.pageStart = startpage
              }
              if (page.length > 1) {
                let endpage = page[1]
                if (regexnum.test(endpage)) {
                  this.doiImportData.pageEnd = endpage
                }
              }
            }
            this.resetForm(this, this.doiImportData, null)
          }
        } catch (error) {
          this.doiImportErrors.push(error)
        } finally {
          this.loading = false
        }
      }
    },
    checkTou: function () {
      if (this.touCheckbox) {
        this.step = 3
      } else {
        this.touCheckboxErrors.push(this.$t('You have to accept the terms of use.'))
      }
    },
    getMetadata: function () {
      return { metadata: { 'json-ld': this.getJsonld() } }
    },
    getJsonld: function () {
      return jsonLd.form2json(this.form)
    },
    loadTemplates: function () {
      if (this.$refs.templates) {
        this.$refs.templates.loadTemplates()
      }
    },
    loadTemplate: function (form) {
      this.form = form
      this.step = 5
      this.$vuetify.goTo(0)
    },
    saveAsTemplate: async function () {
      this.loading = true
      var httpFormData = new FormData()
      httpFormData.append('tag', 'ir')
      httpFormData.append('name', this.templateName)
      httpFormData.append('form', JSON.stringify(this.form))
      var url = this.instanceconfig.api + '/jsonld/template/add'
      try {
        let response = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'X-XSRF-TOKEN': this.user.token
          },
          body: httpFormData
        })
        let json = await response.json()
        if (json.alerts && json.alerts.length > 0) {
          this.$store.commit('setAlerts', json.alerts)
        }
        this.templateDialog = false
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    submit: function () {
      var self = this
      this.loading = true
      var httpFormData = new FormData()
      for (let i = 0; i < this.form.sections.length; i++) {
        let s = this.form.sections[i]
        if (s.fields) {
          for (let j = 0; j < s.fields.length; j++) {
            if (s.fields[j].component === 'p-file') {
              if (s.fields[j].file !== '') {
                httpFormData.append('file', s.fields[j].file)
              }
            }
          }
        }
      }

      httpFormData.append('metadata', JSON.stringify(self.getMetadata()))

      fetch(self.$store.state.instanceconfig.api + '/document/create', {
        method: 'POST',
        mode: 'cors',
        headers: {
          // 'Authorization': 'Basic ' + base64.encode(self.$store.state.instanceconfig.adminuser + ':' + self.$store.state.instanceconfig.adminpass),
          'X-XSRF-TOKEN': this.$store.state.user.token
        },
        body: httpFormData
      })
        .then(response => response.json())
        .then(function (json) {
          if (json.alerts && json.alerts.length > 0) {
            self.$store.commit('setAlerts', json.alerts)
          }
          self.loading = false
          if (json.status === 200) {
            if (json.pid) {
              self.$emit('object-created', json.pid)
            }
          }
          self.$vuetify.goTo(0)
        })
        .catch(function (error) {
          self.$store.commit('setAlerts', [{ type: 'danger', msg: error }])
          self.loading = false
          self.$vuetify.goTo(0)
        })
    },
    addField: function (arr, f) {
      var newField = arrays.duplicate(arr, f)
      if (newField) {
        newField.id = (new Date()).getTime()
        newField.removable = true
      }
    },
    removeField: function (arr, f) {
      arrays.remove(arr, f)
    },
    sortFieldUp: function (arr, f) {
      var i = arr.indexOf(f)
      if (arr[i - 1]) {
        if (arr[i - 1].ordergroup === f.ordergroup) {
          arrays.moveUp(arr, f)
        }
      }
    },
    sortFieldDown: function (arr, f) {
      var i = arr.indexOf(f)
      if (arr[i + 1]) {
        if (arr[i + 1].ordergroup === f.ordergroup) {
          arrays.moveDown(arr, f)
        }
      }
    },
    sortMemberUp: function (s) {
      var i = this.form.sections.indexOf(s)
      if (this.form.sections[i - 1]) {
        if (this.form.sections[i - 1].type === 'member') {
          arrays.moveUp(this.form.sections, s)
        }
      }
    },
    sortMemberDown: function (s) {
      var i = this.form.sections.indexOf(s)
      if (this.form.sections[i + 1]) {
        if (this.form.sections[i + 1].type === 'member') {
          arrays.moveDown(this.form.sections, s)
        }
      }
    },
    affiliationSelectInput: function (f, event) {
      if (event) {
        f.affiliation = event['@id']
        f.affiliationSelectedName = []
        var preflabels = event['skos:prefLabel']
        Object.entries(preflabels).forEach(([key, value]) => {
          f.affiliationSelectedName.push({ '@value': value, '@language': key })
        })
      }
    },
    publisherSelectInput: function (f, event) {
      if (event) {
        f.publisherOrgUnit = event['@id']
        f.publisherSelectedName = []
        var preflabels = event['skos:prefLabel']
        Object.entries(preflabels).forEach(([key, value]) => {
          f.publisherSelectedName.push({ '@value': value, '@language': key })
        })
      }
    },
    publisherSuggestInput: function (f, event) {
      if (event) {
        f.publisherName = event['name']
      }
    },
    organizationSelectInput: function (f, event) {
      if (event) {
        f.organization = event['@id']
        f.organizationSelectedName = []
        var preflabels = event['skos:prefLabel']
        Object.entries(preflabels).forEach(([key, value]) => {
          f.organizationSelectedName.push({ '@value': value, '@language': key })
        })
      }
    },
    selectJournal: function (fields, f, event) {
      if (event.title) {
        f.title = event.title
      }
      if (event.issn) {
        f.issn = event.issn
      }
      if (event.romeopub) {
        for (let formfield of fields) {
          if (formfield.component === 'p-bf-publication') {
            formfield.publisherType = 'other'
            formfield.publisherName = event.romeopub
          }
        }
      }
    },
    setSelected: function (f, property, event) {
      if (event) {
        f[property] = event['@id']
      }
      this.$emit('form-input-' + f.component, f)
    },
    updateSubject: function (f, event) {
      f['skos:prefLabel'] = event['skos:prefLabel']
      if (f['skos:prefLabel']) {
        if (f['skos:prefLabel'].length > 0) {
          // needed to init the search input if loading from template
          // will be synced with component's initquery prop
          f.initquery = f['skos:prefLabel'][0]['@value']
        }
      }
      f['rdfs:label'] = event['rdfs:label']
      this.$emit('form-input-' + f.component, f)
    },
    selectInput: function (fields, f, event) {
      if (event) {
        f.value = event['@id']
        if (event['@type']) {
          f.type = event['@type']
        }
        var preflabels = event['skos:prefLabel']
        f['skos:prefLabel'] = []
        Object.entries(preflabels).forEach(([key, value]) => {
          f['skos:prefLabel'].push({ '@value': value, '@language': key })
        })
        var rdfslabels = event['rdfs:label']
        if (rdfslabels) {
          f['rdfs:label'] = []
          Object.entries(rdfslabels).forEach(([key, value]) => {
            f['rdfs:label'].push({ '@value': value, '@language': key })
          })
        }
        f['skos:notation'] = event['skos:notation']

        if (f.predicate === 'edm:rights') {
          this.license = f.value
        }

        if (f.predicate === 'dcterms:accessRights') {
          this.showEmbargoDate = f.value === 'https://vocab.phaidra.org/vocabulary/AVFC-ZZSZ'
        }

        this.$store.commit('enableAllVocabularyTerms', 'versiontypes')
        this.$store.commit('enableAllVocabularyTerms', 'irobjecttype')

        if (f.predicate === 'edm:hasType') {
          this.filterVocabulary(
            'versiontypes',
            'oaire:version',
            fields,
            f.value,
            [
              {
                // if object is dataset
                conditionIds: [
                  'https://vocab.phaidra.org/vocabulary/KW6N-2VTP'
                ],
                // disable version AO and AM
                disableIds: [
                  'https://vocab.phaidra.org/vocabulary/TV31-080M',
                  'https://vocab.phaidra.org/vocabulary/PHXV-R6B3'
                ]
              },
              {
                // if object is 'dissertation' or 'book' or 'book part' or 'journal article'
                conditionIds: [
                  'https://vocab.phaidra.org/vocabulary/1PHE-7VMS',
                  'https://vocab.phaidra.org/vocabulary/47QB-8QF1',
                  'https://vocab.phaidra.org/vocabulary/XA52-09WA',
                  'https://vocab.phaidra.org/vocabulary/VKA6-9XTY'
                ],
                // disable version AO and SMUR
                disableIds: [
                  'https://vocab.phaidra.org/vocabulary/TV31-080M',
                  'https://vocab.phaidra.org/vocabulary/JTD4-R26P'
                ]
              },
              {
                // if object is 'preprint' or 'working paper'
                conditionIds: [
                  'https://vocab.phaidra.org/vocabulary/T023-BGTD',
                  'https://vocab.phaidra.org/vocabulary/489N-Y6VX'
                ],
                // disable version AM and VoR and CVoR and EVoR
                disableIds: [
                  'https://vocab.phaidra.org/vocabulary/PHXV-R6B3',
                  'https://vocab.phaidra.org/vocabulary/PMR8-3C8D',
                  'https://vocab.phaidra.org/vocabulary/MT1G-APSB',
                  'https://vocab.phaidra.org/vocabulary/SSQW-AP1S'
                ]
              }
            ]
          )
        }

        if (f.predicate === 'oaire:version') {
          this.filterVocabulary(
            'irobjecttype',
            'edm:hasType',
            fields,
            f.value,
            [
              {
                // if version is AO or AM
                conditionIds: [
                  'https://vocab.phaidra.org/vocabulary/TV31-080M',
                  'https://vocab.phaidra.org/vocabulary/PHXV-R6B3'
                ],
                // disable type dataset
                disableIds: [
                  'https://vocab.phaidra.org/vocabulary/KW6N-2VTP'
                ]
              },
              {
                // if version is AO or SMUR
                conditionIds: [
                  'https://vocab.phaidra.org/vocabulary/TV31-080M',
                  'https://vocab.phaidra.org/vocabulary/JTD4-R26P'
                ],
                // disable object 'dissertation' and 'book' and 'book part' and 'journal article'
                disableIds: [
                  'https://vocab.phaidra.org/vocabulary/1PHE-7VMS',
                  'https://vocab.phaidra.org/vocabulary/47QB-8QF1',
                  'https://vocab.phaidra.org/vocabulary/XA52-09WA',
                  'https://vocab.phaidra.org/vocabulary/VKA6-9XTY'
                ]
              },
              {
                // if version is AM or VoR or CVoR or EVoR
                conditionIds: [
                  'https://vocab.phaidra.org/vocabulary/PHXV-R6B3',
                  'https://vocab.phaidra.org/vocabulary/PMR8-3C8D',
                  'https://vocab.phaidra.org/vocabulary/MT1G-APSB',
                  'https://vocab.phaidra.org/vocabulary/SSQW-AP1S'

                ],
                // disable object 'preprint' and 'working paper'
                disableIds: [
                  'https://vocab.phaidra.org/vocabulary/T023-BGTD',
                  'https://vocab.phaidra.org/vocabulary/489N-Y6VX'
                ]
              }
            ]
          )
        }
      } else {
        f.value = ''
        f['skos:prefLabel'] = []
      }
      this.$emit('form-input-' + f.component, f)
    },
    filterVocabulary: function (vocabulary, predicate, fields, selectedValue, filter) {
      for (let f of filter) {
        for (let conditionId of f.conditionIds) {
          if (selectedValue === conditionId) {
            for (let formfield of fields) {
              if (formfield.predicate === predicate) {
                for (let toDisable of f.disableIds) {
                  if (formfield.value === toDisable) {
                    formfield.value = null
                  }
                }
              }
            }
            this.$store.commit('disableVocabularyTerms', {
              vocabulary: vocabulary,
              termids: f.disableIds
            })
          }
        }
      }
    },
    roleInput: function (f, event) {
      f.role = event['@id']
      this.$emit('form-input-' + f.component, f)
    },
    setFilename: function (f, event) {
      f.value = event.name
      f.file = event
      this.$emit('form-input-' + f.component, f)
    },
    setFormFromObject: function (importedComponents) {
      this.$store.commit('enableAllVocabularyTerms', 'versiontypes')
      this.$store.commit('enableAllVocabularyTerms', 'irobjecttypes')

      this.form = {
        sections: []
      }

      let mandatory = [
        'resource-type',
        'file',
        'title',
        'role-extended',
        'date-edtf',
        'language',
        'object-type',
        'version-type',
        'access-right',
        'license'
      ]

      let smf = []
      for (let fieldId of mandatory) {
        let field = fields.getField(fieldId)
        let added = false
        for (let c of importedComponents) {
          if (c.predicate === field.predicate) {
            added = true
            smf.push(c)
          }
        }
        if (!added) {
          smf.push(field)
        }
      }

      this.form.sections.push(
        {
          title: this.$t('Mandatory fields'),
          type: 'digitalobject',
          id: 5,
          fields: smf
        }
      )

      let optional = [
        'description',
        'funder',
        'project',
        'alternate-identifier',
        'citation',
        'keyword',
        'series',
        'page-start',
        'page-end',
        'bf-publication',
        'gnd-subject'
      ]

      let sof = []
      for (let fieldId of optional) {
        let field = fields.getField(fieldId)
        let added = false
        for (let c of importedComponents) {
          if (c.predicate === field.predicate) {
            added = true
            sof.push(c)
          }
        }
        if (!added) {
          sof.push(field)
        }
      }

      this.form.sections.push(
        {
          title: this.$t('Optional fields'),
          type: 'digitalobject',
          id: 6,
          fields: sof
        }
      )
    },
    resetForm: function (self, doiImportData, importedComponents) {
      self.$store.commit('enableAllVocabularyTerms', 'versiontypes')
      self.$store.commit('enableAllVocabularyTerms', 'irobjecttypes')

      self.form = {
        sections: []
      }

      let smf = []

      let rt = fields.getField('resource-type')
      rt.value = 'https://pid.phaidra.org/vocabulary/69ZZ-2KGX'
      smf.push(rt)

      let f = fields.getField('file')
      f.multiplicable = true
      f.mimetype = 'application/pdf'
      smf.push(f)

      let tf = fields.getField('title')
      if (doiImportData && doiImportData.title) {
        tf.title = doiImportData.title
      }
      smf.push(tf)

      if (doiImportData && doiImportData.authors.length > 0) {
        for (let author of doiImportData.authors) {
          let role = fields.getField('role-extended')
          role.role = 'role:aut'
          role.ordergroup = 'roles'
          role.firstname = author.firstname
          role.lastname = author.lastname
          smf.push(role)
        }
      } else {
        let role = fields.getField('role-extended')
        role.role = 'role:aut'
        role.ordergroup = 'roles'
        smf.push(role)
      }

      let edtf = fields.getField('date-edtf')
      edtf.picker = true
      edtf.type = 'dcterms:issued'
      if (doiImportData && doiImportData.dateIssued) {
        edtf.value = doiImportData.dateIssued
      }
      smf.push(edtf)

      smf.push(fields.getField('language'))

      let otf = fields.getField('object-type')
      otf.vocabulary = 'irobjecttype'
      otf.label = self.$t('Type of publication')
      otf.hint = self.$t('The publication type you choose can restrict the possible version type values.')
      otf.showValueDefinition = true
      if (doiImportData && doiImportData.publicationTypeId) {
        otf.value = doiImportData.publicationTypeId
      }
      smf.push(otf)

      let vtf = fields.getField('version-type')
      vtf.showValueDefinition = true
      smf.push(vtf)

      let arf = fields.getField('access-right')
      arf.vocabulary = 'iraccessright'
      arf.showValueDefinition = true
      smf.push(arf)

      smf.push(fields.getField('license'))

      self.form.sections.push(
        {
          title: self.$t('Mandatory fields'),
          type: 'digitalobject',
          id: 5,
          fields: smf
        }
      )

      let sof = []

      sof.push(fields.getField('description'))

      sof.push(fields.getField('funder'))

      sof.push(fields.getField('project'))

      let aif = fields.getField('alternate-identifier')
      aif.label = 'DOI'
      aif.multiplicable = true
      if (doiImportData && doiImportData.doi) {
        aif.value = doiImportData.doi
      }
      sof.push(aif)

      sof.push(fields.getField('citation'))

      sof.push(fields.getField('keyword'))

      let sf = fields.getField('series')
      sf.journalSuggest = true
      if (doiImportData) {
        if (doiImportData.journalTitle) {
          sf.title = doiImportData.journalTitle
        }
        if (doiImportData.journalISSN) {
          sf.issn = doiImportData.journalISSN
        }
        if (doiImportData.journalVolume) {
          sf.volume = doiImportData.journalVolume
        }
        if (doiImportData.journalIssue) {
          sf.issue = doiImportData.journalIssue
        }
      }
      sof.push(sf)

      let ps = fields.getField('page-start')
      if (doiImportData && doiImportData.pageStart) {
        ps.value = doiImportData.pageStart
      }
      sof.push(ps)

      let pe = fields.getField('page-end')
      if (doiImportData && doiImportData.pageEnd) {
        pe.value = doiImportData.pageEnd
      }
      sof.push(pe)

      let pf = fields.getField('bf-publication')
      pf.multiplicable = false
      if (doiImportData && doiImportData.publisher) {
        pf.publishername = doiImportData.publisher
      }
      sof.push(pf)

      let gndf = fields.getField('gnd-subject')
      gndf.exactvoc = 'SubjectHeadingSensoStricto'
      sof.push(gndf)

      self.form.sections.push(
        {
          title: self.$t('Optional fields'),
          type: 'digitalobject',
          id: 6,
          fields: sof
        }
      )
    },
    continueForm: function (step) {
      if (step === 5) {
        this.validateMandatory()
      }
      if (this.validationStatus !== 'error') {
        this.step = step + 1
      }
      this.$vuetify.goTo(1)
    },
    validateMandatory: function () {
      this.validationStatus = ''
      this.validationErrors = []
      let hasLocalAffiliation = false
      for (let s of this.form.sections) {
        if (s.id === 5) {
          for (let f of s.fields) {
            if (f.component === 'p-title') {
              f.titleErrorMessages = []
              if (f.title.length < 1) {
                f.titleErrorMessages.push(this.$t('Missing title'))
                this.validationStatus = 'error'
              }
            }
            if (f.component === 'p-entity-extended') {
              f.firstnameErrorMessages = []
              f.lastnameErrorMessages = []
              f.roleErrorMessages = []
              f.affiliationErrorMessages = []
              f.affiliationTextErrorMessages = []
              f.organizationErrorMessages = []
              f.organizationTextErrorMessages = []
              if (f.role.length < 1) {
                f.roleErrorMessages.push(this.$t('Missing role'))
                this.validationStatus = 'error'
              }
              if (f.type === 'schema:Person') {
                if (f.firstname.length < 1) {
                  f.firstnameErrorMessages.push(this.$t('Missing firstname'))
                  this.validationStatus = 'error'
                }
                if (f.lastname.length < 1) {
                  f.lastnameErrorMessages.push(this.$t('Missing lastname'))
                  this.validationStatus = 'error'
                }
                if (f.affiliationType === 'select') {
                  if (f.affiliation.length < 1) {
                    f.affiliationErrorMessages.push(this.$t('Missing affiliation'))
                    this.validationStatus = 'error'
                  } else {
                    hasLocalAffiliation = true
                  }
                }
                if (f.affiliationType === 'other') {
                  if (f.affiliationText.length < 1) {
                    f.affiliationTextErrorMessages.push(this.$t('Missing affiliation'))
                    this.validationStatus = 'error'
                  }
                }
              }
              if (f.type === 'schema:Organization') {
                if (f.organizationType === 'select') {
                  if (f.organization.length < 1) {
                    f.organizationErrorMessages.push(this.$t('Missing organization'))
                    this.validationStatus = 'error'
                  } else {
                    hasLocalAffiliation = true
                  }
                }
                if (f.organizationType === 'other') {
                  if (f.organizationText.length < 1) {
                    f.organizationTextErrorMessages.push(this.$t('Missing organization'))
                    this.validationStatus = 'error'
                  }
                }
              }
            }
            if (f.component === 'p-date-edtf') {
              f.typeErrorMessages = []
              f.valueErrorMessages = []
              if (f.type.length < 1) {
                f.typeErrorMessages.push(this.$t('Missing date type'))
                this.validationStatus = 'error'
              }
              if (f.value.length < 1) {
                f.valueErrorMessages.push(this.$t('Missing date'))
                this.validationStatus = 'error'
              }
            }
            if (f.component === 'p-select') {
              f.errorMessages = []
              if (f.value.length < 1) {
                f.errorMessages.push(this.$t('Please select'))
                this.validationStatus = 'error'
              }
            }
            if (f.component === 'p-file') {
              f.fileErrorMessages = []
              f.mimetypeErrorMessages = []
              if (!f.file) {
                f.fileErrorMessages.push(this.$t('Please select'))
                this.validationStatus = 'error'
              }
              if (f.mimetype.length < 1) {
                f.mimetypeErrorMessages.push(this.$t('Please select'))
                this.validationStatus = 'error'
              }
            }
          }
        }
      }
      if (!hasLocalAffiliation && (this.user.username !== this.appconfig.iraccount)) {
        this.validationStatus = 'error'
        this.validationErrors.push(this.$t('At least one person named must be affiliated with the') + ' ' + this.instanceconfig.institution)
      }
    },
    resetSubmission: function (self) {
      if (!self) {
        self = this
      }
      self.$store.dispatch('loadLanguages')
      self.loadTemplates()
      self.step = 1
      self.resetForm(self, null, null)
    }
  },
  mounted: function () {
    this.objectListLoad()
    this.resetSubmission(this)
  },
  beforeRouteEnter: async function (to, from, next) {
    next(vm => {
      vm.resetSubmission(vm)
    })
  },
  beforeRouteUpdate: async function (to, from, next) {
    this.resetSubmission(this)
    next()
  }
}
</script>

<style scoped>
.v-btn {
  margin: 0;
}

.prewrap {
  white-space: pre-wrap;
}
</style>
