<template>
  <v-container fluid>
    <v-alert
      :value="validationError"
      dismissible
      type="error"
      transition="slide-y-transition"
    >
      <span>{{ $t("Please fill in the required fields") }}</span>
      <template v-if="fieldsMissing.length > 0">
        <br />
        <span>{{ $t("Some required fields are missing") }}:</span>
        <ul>
          <li v-for="(f, i) in fieldsMissing" :key="'mfld' + i">{{ f }}</li>
        </ul>
      </template>
    </v-alert>
    <v-row>
      <v-col cols="12">
        <p-i-form
          :form="form"
          :rights="rights"
          :enablerights="true"
          :enablerelationships="true"
          :enablepreview="true"
          :templating="false"
          :importing="false"
          :addbutton="true"
          :help="true"
          :debug="false"
          :feedback="true"
          :feedback-user="this.user"
          :feedback-context="'Upload'"
          :guidelines-url="'https://static.phaidra-sandbox.univie.ac.at/guidelines/3.5.5Guidelinespicture_borndigital_'"
          :validate="validate"
          v-on:load-form="form = $event"
          v-on:object-created="objectCreated($event)"
          v-on:form-input-resource-type="handleInputResourceType($event)"
          v-on:input-rights="rights = $event"
        ></p-i-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import arrays from 'phaidra-vue-components/src/utils/arrays'
import fields from 'phaidra-vue-components/src/utils/fields'
import { context } from "../../mixins/context";
import { formvalidation } from "../../mixins/formvalidation";
import { vocabulary } from "phaidra-vue-components/src/mixins/vocabulary";

export default {
  layout: "main",
  mixins: [context, vocabulary, formvalidation],
  data() {
    return {
      form: { sections: [] },
      rights: {},
    };
  },
  methods: {
    addRemovedFieldsCol: function (rt) {
      let haslicense = false;
      for (let s of this.form.sections) {
        for (let f of s.fields) {
          if (f.predicate === "edm:rights") {
            haslicense = true;
          }
        }
      }
      if (!haslicense) {
        this.form.sections[0].fields.push(fields.getField("license"));
      }
      let hasfile = false;
      for (let s of this.form.sections) {
        for (let f of s.fields) {
          if (f.component === "p-file") {
            hasfile = true;
          }
        }
      }
      if (!hasfile) {
        this.form.sections[0].fields.splice(1, 0, fields.getField("file"));
      }
      let hasObjectType2 = false;
      for (let s of this.form.sections) {
        for (let f of s.fields) {
          if (f.predicate === "edm:hasType") {
            hasObjectType2 = true;
            f.selectedTerms = [];
          }
        }
      }
      if (!hasObjectType2) {
        let otf2 = fields.getField("object-type-checkboxes");
        let rtv2;
        for (let s of this.form.sections) {
          for (let f of s.fields) {
            if (f.predicate === "dcterms:type") {
              rtv2 = f.value;
            }
          }
        }
        otf2.resourceType = rtv2;
        this.form.sections[0].fields.splice(2, 0, otf2);
      }
    },
    handleInputResourceType: function (rt) {
      switch (rt) {
        case "https://pid.phaidra.org/vocabulary/44TN-P1S0":
          // add fields which were removed if switching from collection
          this.addRemovedFieldsCol(rt);
          // image => remove language
          for (let s of this.form.sections) {
            for (let f of s.fields) {
              if (f.predicate === "dcterms:language") {
                arrays.remove(s.fields, f);
                break;
              }
            }
          }
          break;
        case "https://pid.phaidra.org/vocabulary/GXS7-ENXJ":
          // collection => remove file, language, license and object type field
          for (let s of this.form.sections) {
            for (let f of s.fields) {
              if (f.component === "p-file") {
                arrays.remove(s.fields, f);
                break;
              }
            }
          }
          for (let s of this.form.sections) {
            for (let f of s.fields) {
              if (f.predicate === "dcterms:language") {
                arrays.remove(s.fields, f);
                break;
              }
            }
          }
          for (let s of this.form.sections) {
            for (let f of s.fields) {
              if (f.predicate === "edm:hasType") {
                arrays.remove(s.fields, f);
                break;
              }
            }
          }
          for (let s of this.form.sections) {
            for (let f of s.fields) {
              if (f.predicate === "edm:rights") {
                arrays.remove(s.fields, f);
                break;
              }
            }
          }
          break;
        default:
          // add fields which were removed if switching from collection
          this.addRemovedFieldsCol(rt);
          // add language (removed if switching from picture or collection)
          let hasLang = false;
          for (let s of this.form.sections) {
            for (let f of s.fields) {
              if (f.predicate === "dcterms:language") {
                hasLang = true;
              }
            }
          }
          if (!hasLang) {
            let lang = fields.getField("language");
            lang.value = this.$i18n.locale;
            lang.label = "Language of object";
            this.form.sections[0].fields.splice(4, 0, lang);
          }
          break;
      }
    },
    objectCreated: function (event) {
      this.$router.push(this.localeLocation({ path: `detail/${event}`}));
      this.$vuetify.goTo(0);
    },
    createForm: function (self, index) {
      self.validationError = false;
      self.fieldsMissing = [];

      self.form = {
        sections: [
          {
            title: null,
            type: "digitalobject",
            id: 1,
            fields: [],
          },
          {
            title: "Classification",
            mode: "expansion",
            addbutton: false,
            disablemenu: true,
            collapsed: true,
            outlined: true,
            id: 2,
            fields: [],
          },
          {
            title: "Coverage",
            mode: "expansion",
            addbutton: false,
            disablemenu: true,
            collapsed: true,
            outlined: true,
            id: 3,
            fields: [],
          },
          {
            title: "Association",
            mode: "expansion",
            addbutton: false,
            disablemenu: true,
            collapsed: true,
            outlined: true,
            id: 4,
            fields: [],
          },
          {
            title: "Represented object",
            type: "phaidra:Subject",
            mode: "expansion",
            disablemenu: true,
            collapsed: true,
            outlined: true,
            id: 5,
            fields: [],
          },
          {
            title: "Bibliographic metadata",
            mode: "expansion",
            addbutton: false,
            disablemenu: true,
            collapsed: true,
            outlined: true,
            id: 6,
            fields: [],
          },
        ],
      };

      let defaultResourceType = "https://pid.phaidra.org/vocabulary/44TN-P1S0";

      let rt = fields.getField("resource-type-buttongroup");
      rt.vocabulary = "resourcetypenocontainer";
      rt.value = defaultResourceType;
      self.form.sections[0].fields.push(rt);

      let file = fields.getField("file");
      file.fileInputClass = "mb-2";
      self.form.sections[0].fields.push(file);

      let ot = fields.getField("object-type-checkboxes");
      ot.resourceType = defaultResourceType;
      self.form.sections[0].fields.push(ot);

      self.form.sections[0].fields.push(fields.getField("title"));

      self.form.sections[0].fields.push(fields.getField("description"));

      let lang = fields.getField("language");
      lang.value = this.$i18n.locale;
      lang.label = "Language of object";
      self.form.sections[0].fields.push(lang);

      let kw = fields.getField("keyword");
      kw.disableSuggest = true;
      self.form.sections[0].fields.push(kw);

      let role = fields.getField("role");
      role.ordergroup = "role";
      role.roleVocabulary = "submitrolepredicate";
      self.form.sections[0].fields.push(role);

      let lic = fields.getField("license");
      lic.showValueDefinition = true;
      lic.vocabulary = "alllicenses";
      self.form.sections[0].fields.push(lic);

      self.form.sections[1].fields.push(fields.getField("gnd-subject"));
      self.form.sections[1].fields.push(fields.getField("oefos-subject"));
      self.form.sections[1].fields.push(fields.getField("bk-subject"));

      self.form.sections[2].fields.push(fields.getField("temporal-coverage"));
      let place = fields.getField("spatial-geonames-search");
      place.showtype = false;
      self.form.sections[2].fields.push(place);

      self.form.sections[3].fields.push(fields.getField("association"));
      self.form.sections[3].fields.push(fields.getField("project"));

      self.form.sections[4].fields.push(fields.getField("date-edtf"));
      self.form.sections[4].fields.push(fields.getField("inscription"));
      self.form.sections[4].fields.push(fields.getField("shelf-mark"));
      self.form.sections[4].fields.push(fields.getField("accession-number"));
      self.form.sections[4].fields.push(fields.getField("provenance"));
      self.form.sections[4].fields.push(fields.getField("production-company"));
      self.form.sections[4].fields.push(fields.getField("production-place"));
      self.form.sections[4].fields.push(fields.getField("physical-location"));
      self.form.sections[4].fields.push(fields.getField("condition-note"));
      self.form.sections[4].fields.push(fields.getField("height"));
      self.form.sections[4].fields.push(fields.getField("width"));
      self.form.sections[4].fields.push(fields.getField("material-text"));
      self.form.sections[4].fields.push(fields.getField("technique-text"));

      self.form.sections[5].fields.push(fields.getField("series"));
      self.form.sections[5].fields.push(fields.getField("bf-publication"));

      for (let s of this.form.sections) {
        for (let f of s.fields) {
          for (let prop of Object.keys(f)) {
            switch (prop) {
              case "language":
                f.language = this.$i18n.locale;
                break;
              case "nameLanguage":
                f.nameLanguage = this.$i18n.locale;
                break;
            }
          }
        }
      }

      this.markMandatory();
    },
  },
  beforeRouteEnter: function (to, from, next) {
    next((vm) => {
      vm.createForm(vm);
    });
  },
  beforeRouteUpdate: function (to, from, next) {
    this.createForm(this);
    next();
  },
};
</script>
