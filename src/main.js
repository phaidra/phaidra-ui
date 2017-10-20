// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import App from './App'
import router from './router'
import * as svgicon from 'vue-svgicon'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(Vuetify)
Vue.use(VueI18n)

Vue.use(svgicon, {
  tagName: 'icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

const messages = {
  en: {
    'ADD_PREFIX': 'Add',
    'ADD_PREFIX_2': 'Add another',
    'ADD_SUFFIX': '',
    'ADD_TO_PREFIX': 'Add to',
    'ADD_TO_SUFFIX': '',
    'less 10MB': '< 10MB',
    'more 1GB': '> 1GB',
    'SEARCH_PLACEHOLDER': 'Search',
    'PHAIDRA_IS': 'Phaidra is the repository for the permanent secure storage of digital assets at the University of Vienna.'
  },
  de: {
    'German': 'Deutsch',
    'English': 'Englisch',
    'Italian': 'Italienisch',

    'Browse': 'Blättern',
    'Password': 'Passwort',
    'Featured collections': 'Featured collections',

    'Preferences': 'Einstellungen',
    'Search': 'Suche',
    'New object': 'Neues Objekt',
    'My objects': 'Meine Objekte',
    'My groups': 'Meine Gruppen',
    'Templates': 'Vorlagen',
    'Logout': 'Logout',
    'Login': 'Login',
    'If you have technical problems please contact': 'Bei technischen Fragen steht Ihnen unsere Support-Adresse zur Verfügung',
    'Most searched-for services': 'Meistgesuchte Services',
    'Information about': 'Informationen über',
    'SEARCH_PLACEHOLDER': 'Suchen',
    'Date': 'Datum',
    'License': 'Lizenz',
    'Size': 'Größe',
    'Type': 'Typ',
    'Access': 'Zugang',
    'Roles': 'Rollen',
    'Image': 'Bild',
    'Book': 'Buch',
    'Article': 'Artikel',
    'Text': 'Text',
    'Collection': 'Collection',
    'Video': 'Video',
    'Other': 'Anderes',
    'Data': 'Daten',
    'Dataset': 'Dataset',
    'Container': 'Container',
    'Map': 'Karte',
    'Resource': 'Resource',
    'Sound': 'Audio',
    'All rights reserved': 'alle Rechte vorbehalten',
    'Public Domain Mark': 'Public Domain Marke',

    'More': 'Mehr',
    'Contact': 'Kontakt',
    'Add owner': 'Owner auswählen',
    'ADD_PREFIX': '',
    'ADD_PREFIX_2': 'Weitere',
    'ADD_SUFFIX': 'hinzufügen',
    'Add role': 'Rolle hinzufügen',
    'Members of': 'Mitglieder der',
    'There are no search results for your query.': 'Die Suche lieferte keine Treffer. Bitte versuchen sie es erneut!',
    'objects': 'Objekte',
    'Title ascending': 'Titel aufsteigend',
    'Title descending': 'Titel absteigend',
    'Upload date ascending': 'Upload Datum aufsteigend',
    'Upload date descending': 'Upload Datum absteigend',
    'Link to search results': 'Link zu dieser Suche',
    'Bookmarks': 'Merkliste',
    'Bookmarks added successfully': 'Objekte wurden hinzugefügt',
    'Bookmark added successfully': 'Objekt wurde hinzugefügt',
    'Add new bookmark list': 'Neue Merkliste anlegen',
    'ADD_TO_PREFIX': 'Zu',
    'ADD_TO_SUFFIX': 'hinzufügen',
    'less 10MB': '< 10MB',
    'more 1GB': '> 1GB',
    'PHAIDRA_IS': 'Phaidra ist das Repositorium zur dauerhaften Sicherung von digitalen Beständen an der Universität Wien.',

    'Author': 'AutorIn',
    'Publisher': 'HerausgeberIn',
    'Initiator': 'InitiatorIn',
    'Evaluator': 'EvaluatorIn',
    'Editor': 'EditorIn',
    'Graphic Designer': 'GrafikdesignerIn',
    'Technical Translator': 'Technische/r UmsetzerIn',
    'Data Supplier': 'DatenlieferantIn',
    'Technical Inspector': 'Technische/r PrüferIn',
    'Text Processor': 'TextbearbeiterIn',
    'Pedagogic Expert': 'Pädagogische/r ExpertIn',
    'Domain Expert': 'FachexpertIn',
    'Interpreter': 'InterpretIn',
    'Artist': 'KünstlerIn',
    'Client/Donor': 'AuftraggeberIn/StifterIn',
    'Photographer': 'FotografIn',
    'Digitiser': 'DigitalisiererIn',
    'Keeper of the original': 'AufbewahrerIn des Originals',
    'Adviser': 'BetreuerIn',
    'Judge': 'BeurteilerIn',
    'Etcher': 'RadiererIn',
    'Adapter': 'BearbeiterIn',
    'Architect': 'ArchitektIn',
    'Arranger': 'ArrangeurIn',
    'Actor': 'SchauspielerIn',
    'Writer of accompanying material': 'AutorIn von Begleitmaterial',
    'Dubious author': 'zweifelhafte AutorIn',
    'Metal-engraver': 'MetallstecherIn',
    'Singer': 'SängerIn',
    'Cartographer': 'KartografIn',
    'Compiler': 'HerausgeberIn einer Sammlung',
    'Composer': 'KomponistIn',
    'Scientific advisor': 'wissenschaftliche BeraterIn',
    'Opponent': 'WidersacherIn',
    'Choreographer': 'ChoreographIn',
    'Dedicator': 'Widmende/r',
    'Dedicatee': 'WidmungsträgerIn',
    'Artistic director': 'künstlerische/r LeiterIn',
    'Conductor': 'KapellmeisterIn',
    'Cinematographer': 'Kameramann/frau',
    'Musical director': 'musikalische/r LeiterIn',
    'Illustrator': 'IllustratorIn',
    'Engraver': 'GraveurIn',
    'Engineer': 'IngenieurIn',
    'Interviewee': 'InterviewpartnerIn',
    'Interviewer': 'InterviewerIn',
    'Degree grantor': 'VerleiherIn des Diploms',
    'Librettist': 'LibrettistIn',
    'Illuminator': 'IlluminatorIn',
    'Musician': 'MusikerIn',
    'Attributed name': 'zugeschriebene/r AutorIn',
    'Lyricist': 'SongwriterIn',
    'Performer': 'Performer',
    'Former owner': 'VorbesitzerIn',
    'Producer': 'ProduzentIn',
    'Sound designer': 'SounddesignerIn',
    'Owner': 'EigentümerIn',
    'Reviewer': 'KritikerIn',
    'Thesis advisor': 'DissertationsbetreuerIn',
    'Film editor': 'Film-EditorIn',
    'Author of screenplay': 'AutorIn des Drehbuches',
    'Scenarist': 'SzenentexterIn',
    'Sculptor': 'BildhauerIn',
    'Printer': 'DruckerIn',
    'Recording engineer': 'TonmeisterIn',
    'Dissertant': 'DissertantIn',
    'Videographer': 'VideoanbieterIn',
    'Wood-engraver': 'HolzstecherIn',
    'Uploader': 'Uploader',
    'Founder': 'GründerIn'
  },
  it: {
    'German': 'Tedesco',
    'English': 'Inglese',
    'Italian': 'Italiano',

    'Author': 'Autore',
    'Publisher': 'Editore',
    'Initiator': 'Iniziatore',
    'Evaluator': 'Valutatore',
    'Editor': 'Curatore',
    'Graphic Designer': 'Grafico',
    'Technical Translator': 'Traduttore Tecnico',
    'Data Supplier': 'Fornitore dei dati',
    'Technical Inspector': 'Ispettore tecnico',
    'Text Processor': 'Estensore del testo',
    'Pedagogic Expert': 'Esperto pedagogico',
    'Domain Expert': 'Esperto del settore',
    'Interpreter': 'Interprete',
    'Other': 'Altro',
    'Artist': 'Artista',
    'Client/Donor': 'Cliente/Donatore',
    'Photographer': 'Fotografo',
    'Digitiser': 'Autore della digitalizzazione',
    'Keeper of the original': 'Affidatario dell\'originale',
    'Adviser': 'Consigliere',
    'Judge': 'Giudice',
    'Etcher': 'Acquafortista',
    'Adapter': 'Adattatore',
    'Architect': 'Architetto',
    'Arranger': 'Arrangiatore',
    'Actor': 'Attore',
    'Writer of accompanying material': 'Autore del materiale allegato',
    'Dubious author': 'Autore incerto',
    'Metal-engraver': 'Calcografo',
    'Singer': 'Cantante',
    'Cartographer': 'Cartografo',
    'Compiler': 'Compilatore',
    'Composer': 'Compositore',
    'Scientific advisor': 'Consulente scientifico',
    'Opponent': 'Controrelatore',
    'Choreographer': 'Coreografo',
    'Dedicator': 'Dedicante',
    'Dedicatee': 'Dedicatario',
    'Artistic director': 'Direttore artistico',
    'Conductor': 'Direttore d’orchestra',
    'Cinematographer': 'Direttore della fotografia',
    'Musical director': 'Direttore musicale',
    'Illustrator': 'Illustratore',
    'Engraver': 'Incisore',
    'Engineer': 'Ingegnere',
    'Interviewee': 'Intervistato',
    'Interviewer': 'Intervistatore',
    'Degree grantor': 'Istituzione che rilascia il titolo accademico',
    'Librettist': 'Librettista',
    'Illuminator': 'Miniatore',
    'Musician': 'Musicista',
    'Attributed name': 'Nome attribuito',
    'Lyricist': 'Paroliere',
    'Performer': 'Precedente proprietario',
    'Former owner': 'Produttore',
    'Producer': 'Progettista del suono',
    'Sound designer': 'Proprietario',
    'Owner': 'Recensore',
    'Reviewer': 'Relatore',
    'Thesis advisor': 'Responsabile del montaggio',
    'Film editor': 'Sceneggiatore',
    'Author of screenplay': 'Scenografo',
    'Scenarist': 'Scultore',
    'Sculptor': 'Stampatore',
    'Printer': 'Tecnico della registrazione',
    'Recording engineer': 'Tesista',
    'Dissertant': 'Videografo',
    'Videographer': 'Xilografo',
    'Wood-engraver': 'Uploader',
    'Uploader': 'Uploader',
    'Founder': 'Founder',

    'PHAIDRA_IS': 'Phaidra è la piattaforma del Università di Vienna per l’archiviazione a lungo termine di oggetti e collezioni digitali'
  }
}

const i18n = new VueI18n({
  locale: 'de',
  messages
})

const store = new Vuex.Store({
  state: {
    currentUser: {
      displayName: '',
      email: ''
    }
  },
  mutations: {
    setLoginData (state, logindata) {
      state.currentUser.displayName = logindata.displayName
      state.currentUser.email = logindata.email
    }
  },
  actions: {
    login ({ commit }, credentials) {
      commit('setLoginData', {displayName: 'David', email: 'dave@example.com'})
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})

