import Vue from 'vue'
import axios from 'axios'
import config from '../config/phaidra-ui'
import languages from 'phaidra-vue-components/src/utils/lang'
import lang3to2map from 'phaidra-vue-components/src/utils/lang3to2map'
import orgunits from 'phaidra-vue-components/src/utils/orgunits'
import oefos from 'phaidra-vue-components/src/utils/oefos'

const lang2to3map = Object.keys(lang3to2map).reduce((ret, key) => {
  ret[lang3to2map[key]] = key
  return ret
}, {})

const ns = 'https://pid.phaidra.org/vocabulary/'
const ot4rt = {
  // image
  'https://pid.phaidra.org/vocabulary/44TN-P1S0': [
    // drawing
    ns + '85QM-7TZ3',
    // painting
    ns + 'WWS3-0ACP',
    // print
    ns + '7WYH-AZ8C',
    // wall chart
    ns + 'QM0R-ZTAA',
    // map
    ns + 'A52A-CWMM',
    // photograph
    ns + '7CAB-P987',
    // postcard
    ns + 'Q4Q5-3554',
    // poster
    ns + '6EFK-BRQD',
    // slide (Diapositiv)
    ns + '431H-5YSA',
    // other
    ns + 'PYRE-RAWJ'
  ],
  // text
  'https://pid.phaidra.org/vocabulary/69ZZ-2KGX': [
    // print
    ns + '7WYH-AZ8C',
    // musical notation
    ns + '8A6X-FKB1',
    // periodical
    ns + 'GY3Z-50FT',
    // newspaper
    ns + 'DCHD-W3GM',
    // magazine
    ns + 'EHPQ-XYA3',
    // letter (correspondence)
    ns + 'GBWA-JJP8',
    // report
    ns + 'JMAV-7F3R',
    // project deliverable
    ns + 'T8PK-GADB',
    // data management plan
    ns + 'W2Z3-3YA6',
    // lecture
    ns + 'F4JN-ZST0',
    // yearbook
    ns + 'HARH-6R3C',
    // other
    ns + 'PYRE-RAWJ'
  ],
  // video
  'https://pid.phaidra.org/vocabulary/B0Y6-GYT8': [
    // interview
    ns + '8KGA-CH97',
    // lecture
    ns + 'F4JN-ZST0',
    // other
    ns + 'PYRE-RAWJ'
  ],
  // data
  'https://pid.phaidra.org/vocabulary/7AVS-Y482': [
    // questionnaire
    ns + 'MZ2Q-R099',
    // learning object
    ns + 'YA8R-1M0D',
    // other
    ns + 'PYRE-RAWJ'
  ],
  // sound
  'https://pid.phaidra.org/vocabulary/8YB5-1M0J': [
    // interview
    ns + '8KGA-CH97',
    // lecture
    ns + 'F4JN-ZST0',
    // podcast
    ns + 'JF85-NYRJ',
    // musical composition
    ns + 'EWZ9-3MPH',
    // other
    ns + 'PYRE-RAWJ'
  ]
}

export const state = () => ({
  config: config,
  appconfig: config.global,
  instanceconfig: config.instances[config.defaultinstance],
  snackbar: false,
  alerts: [],
  objectInfo: null,
  objectMembers: [],
  user: {
    token: null
  },
  groups: [],
  breadcrumbs: [],
  loading: false,
  vocabulary: {
    vocabularies: {
      'cmodels': {
        terms: [
          { '@id': 'Asset', 'skos:prefLabel': { 'eng': 'Asset' } },
          { '@id': 'Audio', 'skos:prefLabel': { 'eng': 'Audio' } },
          { '@id': 'Book', 'skos:prefLabel': { 'eng': 'Book' } },
          { '@id': 'Collection', 'skos:prefLabel': { 'eng': 'Collection' } },
          { '@id': 'Container', 'skos:prefLabel': { 'eng': 'Container' } },
          { '@id': 'PDFDocument', 'skos:prefLabel': { 'eng': 'PDFDocument' } },
          { '@id': 'Page', 'skos:prefLabel': { 'eng': 'Page' } },
          { '@id': 'Picture', 'skos:prefLabel': { 'eng': 'Picture' } },
          { '@id': 'Resource', 'skos:prefLabel': { 'eng': 'Resource' } },
          { '@id': 'Video', 'skos:prefLabel': { 'eng': 'Video' } }
        ],
        loaded: true
      },
      'relations': {
        terms: [
          { '@id': 'http://purl.org/dc/terms/references', 'skos:prefLabel': { 'eng': 'References' }, 'skos:notation': [ 'references' ] },
          { '@id': 'http://phaidra.org/XML/V1.0/relations#isBackSideOf', 'skos:prefLabel': { 'eng': 'Is back side of' }, 'skos:notation': [ 'isBackSideOf' ] },
          { '@id': 'http://phaidra.org/XML/V1.0/relations#isThumbnailFor', 'skos:prefLabel': { 'eng': 'Is thumbnail for' }, 'skos:notation': [ 'isThumbnailFor' ] },
          { '@id': 'http://phaidra.univie.ac.at/XML/V1.0/relations#hasSuccessor', 'skos:prefLabel': { 'eng': 'Is older version of' }, 'skos:notation': [ 'hasSuccessor' ] },
          { '@id': 'http://phaidra.org/XML/V1.0/relations#isAlternativeFormatOf', 'skos:prefLabel': { 'eng': 'Is alternative format of' }, 'skos:notation': [ 'isAlternativeFormatOf' ] },
          { '@id': 'http://phaidra.org/XML/V1.0/relations#isAlternativeVersionOf', 'skos:prefLabel': { 'eng': 'Is alternative version of' }, 'skos:notation': [ 'isAlternativeVersionOf' ] },
          { '@id': 'info:fedora/fedora-system:def/relations-external#hasCollectionMember', 'skos:prefLabel': { 'eng': 'Has part' }, 'skos:notation': [ 'hasCollectionMember' ] },
          { '@id': 'http://pcdm.org/models#hasMember', 'skos:prefLabel': { 'eng': 'Has member' }, 'skos:notation': [ 'hasMember' ] }
        ],
        loaded: true
      },
      'pool': {
        terms: [
          { '@id': 'Bibliothek', 'skos:prefLabel': { 'eng': 'Bibliothek' } },
          { '@id': 'Institut für Romanistik', 'skos:prefLabel': { 'eng': 'Institut für Romanistik' } },
          { '@id': 'privat', 'skos:prefLabel': { 'eng': 'privat' } }
        ],
        loaded: true
      },
      'datepredicate': {
        terms: [
          { '@id': 'dcterms:date', 'skos:prefLabel': { 'eng': 'Date', 'deu': 'Datum' } },
          { '@id': 'dcterms:created', 'skos:prefLabel': { 'eng': 'Date created', 'deu': 'Erstellungsdatum' } },
          { '@id': 'dcterms:modified', 'skos:prefLabel': { 'eng': 'Date modified', 'deu': 'Date modified' } },
          { '@id': 'dcterms:available', 'skos:prefLabel': { 'eng': 'Date available', 'deu': 'Date available' } },
          { '@id': 'dcterms:issued', 'skos:prefLabel': { 'eng': 'Date issued', 'deu': 'Date issued' } },
          { '@id': 'dcterms:valid', 'skos:prefLabel': { 'eng': 'Date valid', 'deu': 'Date valid' } },
          { '@id': 'dcterms:dateAccepted', 'skos:prefLabel': { 'eng': 'Date accepted', 'deu': 'Date accepted' } },
          { '@id': 'dcterms:dateCopyrighted', 'skos:prefLabel': { 'eng': 'Date copyrighted', 'deu': 'Date copyrighted' } },
          { '@id': 'dcterms:dateSubmitted', 'skos:prefLabel': { 'eng': 'Date submitted', 'deu': 'Date submitted' } },
          { '@id': 'rdau:P60071', 'skos:prefLabel': { 'eng': 'Date of production', 'deu': 'Produktionsdatum' } },
          { '@id': 'phaidra:dateAccessioned', 'skos:prefLabel': { 'eng': 'Date accessioned', 'deu': 'Eingangsdatum' } },
          { '@id': 'dcterms:temporal', 'skos:prefLabel': { 'eng': 'Temporal coverage', 'deu': 'Zeitliche Abdeckung' } }
        ],
        loaded: true
      },
      'placetype': {
        terms: [
          { '@id': 'schema:Place', 'skos:prefLabel': { 'eng': 'Place' } },
          { '@id': 'schema:AdministrativeArea', 'skos:prefLabel': { 'eng': 'AdministrativeArea' } }
        ],
        loaded: true
      },
      'objectidentifiertype': {
        terms: [
          { '@id': 'ids:doi', 'skos:prefLabel': { 'eng': 'DOI' }, 'skos:example': '10.1629/uksg.419' },
          { '@id': 'ids:hdl', 'skos:prefLabel': { 'eng': 'Handle' }, 'skos:example': '11353/10.761200' },
          { '@id': 'ids:urn', 'skos:prefLabel': { 'eng': 'URN' }, 'skos:example': 'urn:nbn:at:at-ubw-21405.98566.193074-2' },
          { '@id': 'ids:uri', 'skos:prefLabel': { 'eng': 'URI' }, 'skos:example': 'https://example.com/path/resource.txt' },
          { '@id': 'ids:isbn', 'skos:prefLabel': { 'eng': 'ISBN' }, 'skos:example': '978-3-16-148410-0' },
          { '@id': 'ids:gnd', 'skos:prefLabel': { 'eng': 'GND' }, 'skos:example': '118635808' },
          { '@id': 'phaidra:acnumber', 'skos:prefLabel': { 'eng': 'AC number' }, 'skos:example': 'AC13399179' }
        ],
        loaded: true
      },
      'irobjectidentifiertype': {
        terms: [
          { '@id': 'ids:doi', 'skos:prefLabel': { 'eng': 'DOI' }, 'skos:example': '10.1629/uksg.419' },
          { '@id': 'ids:hdl', 'skos:prefLabel': { 'eng': 'Handle' }, 'skos:example': '11353/10.761200' },
          { '@id': 'ids:urn', 'skos:prefLabel': { 'eng': 'URN' }, 'skos:example': 'urn:nbn:at:at-ubw-21405.98566.193074-2' },
          { '@id': 'ids:isbn', 'skos:prefLabel': { 'eng': 'ISBN' }, 'skos:example': '978-3-16-148410-0' },
          { '@id': 'ids:uri', 'skos:prefLabel': { 'eng': 'URI/URL' }, 'skos:example': 'https://example.com/path/resource.txt' }
        ],
        loaded: true
      },
      'irobjectidentifiertypenoisbn': {
        terms: [
          { '@id': 'ids:doi', 'skos:prefLabel': { 'eng': 'DOI' }, 'skos:example': '10.1629/uksg.419' },
          { '@id': 'ids:hdl', 'skos:prefLabel': { 'eng': 'Handle' }, 'skos:example': '11353/10.761200' },
          { '@id': 'ids:urn', 'skos:prefLabel': { 'eng': 'URN' }, 'skos:example': 'urn:nbn:at:at-ubw-21405.98566.193074-2' },
          { '@id': 'ids:uri', 'skos:prefLabel': { 'eng': 'URI/URL' }, 'skos:example': 'https://example.com/path/resource.txt' }
        ],
        loaded: true
      },
      'entityidentifiertype': {
        terms: [
          { '@id': 'ids:orcid', 'skos:prefLabel': { 'eng': 'ORCID' }, 'skos:example': '0000-0002-1825-0097' },
          { '@id': 'ids:gnd', 'skos:prefLabel': { 'eng': 'GND' }, 'skos:example': '118635808' },
          { '@id': 'ids:viaf', 'skos:prefLabel': { 'eng': 'VIAF' }, 'skos:example': '89597697' },
          { '@id': 'ids:wikidata', 'skos:prefLabel': { 'eng': 'Wikidata ID' }, 'skos:example': 'Q129772' },
          { '@id': 'ids:lcnaf', 'skos:prefLabel': { 'eng': 'LCNAF' }, 'skos:example': 'n79021164' },
          { '@id': 'ids:isni', 'skos:prefLabel': { 'eng': 'ISNI' }, 'skos:example': '0000000121174585' },
          { '@id': 'ids:uri', 'skos:prefLabel': { 'eng': 'URI' }, 'skos:example': 'https://authority.example.com/path/resource' }
        ],
        loaded: true
      },
      'citationpredicate': {
        terms: [
          { '@id': 'cito:cites', 'skos:prefLabel': { 'eng': 'Cites' } },
          { '@id': 'cito:isCitedBy', 'skos:prefLabel': { 'eng': 'Is cited by' } }
        ],
        loaded: true
      },
      'rolepredicate': {
        terms: [
          { '@id': 'role:abr', 'skos:prefLabel': { 'eng': 'Abridger', 'deu': 'Autor*in von Kurzfassungen', 'ita': 'Abridger' } },
          { '@id': 'role:act', 'skos:prefLabel': { 'eng': 'Actor', 'deu': 'Schauspieler*in', 'ita': 'Attore' } },
          { '@id': 'role:adp', 'skos:prefLabel': { 'eng': 'Adapter', 'deu': 'Bearbeiter*in', 'ita': 'Adattatore' } },
          { '@id': 'role:rcp', 'skos:prefLabel': { 'eng': 'Addressee', 'deu': 'Empfänger*in', 'ita': 'Destinatario' } },
          { '@id': 'role:advisor', 'skos:prefLabel': { 'eng': 'Adviser', 'deu': 'Betreuer*in der Hochschulschrift', 'ita': 'Consigliere' } },
          { '@id': 'role:anl', 'skos:prefLabel': { 'eng': 'Analyst', 'deu': 'Analyst*in ', 'ita': 'Analista' } },
          { '@id': 'role:anm', 'skos:prefLabel': { 'eng': 'Animator', 'deu': 'Animator*in', 'ita': 'Animator' } },
          { '@id': 'role:ann', 'skos:prefLabel': { 'eng': 'Annotator', 'deu': 'Autor*in von Anmerkungen', 'ita': 'Annotatore' } },
          { '@id': 'role:app', 'skos:prefLabel': { 'eng': 'Applicant', 'deu': 'Antragsteller*in', 'ita': 'Applicant' } },
          { '@id': 'role:arc', 'skos:prefLabel': { 'eng': 'Architect', 'deu': 'Architekt*in', 'ita': 'Architetto' } },
          { '@id': 'role:arr', 'skos:prefLabel': { 'eng': 'Arranger', 'deu': 'Arrangeur*in', 'ita': 'Arrangiatore' } },
          { '@id': 'role:acp', 'skos:prefLabel': { 'eng': 'Art copyist', 'deu': 'Kunstkopist*in', 'ita': 'Art copyist' } },
          { '@id': 'role:adi', 'skos:prefLabel': { 'eng': 'Art director', 'deu': 'Szenenbildner*in', 'ita': 'Art director' } },
          { '@id': 'role:art', 'skos:prefLabel': { 'eng': 'Artist', 'deu': 'Künstler*in', 'ita': 'Artista' } },
          { '@id': 'role:ard', 'skos:prefLabel': { 'eng': 'Artistic director', 'deu': 'Intendant', 'ita': 'Direttore artistico' } },
          { '@id': 'role:assessor', 'skos:prefLabel': { 'eng': 'Assessor', 'deu': 'Beurteiler*in der Hochschulschrift', 'ita': 'Assessor' } },
          { '@id': 'role:asg', 'skos:prefLabel': { 'eng': 'Assignee', 'deu': 'Rechtsnachfolger*in', 'ita': 'Assignee' } },
          { '@id': 'role:asn', 'skos:prefLabel': { 'eng': 'Associated name', 'deu': 'Assoziierter Name', 'ita': 'Associated name' } },
          { '@id': 'role:att', 'skos:prefLabel': { 'eng': 'Attributed name', 'deu': 'Zugeschriebene/r Autor*in', 'ita': 'Nome attribuito' } },
          { '@id': 'role:auc', 'skos:prefLabel': { 'eng': 'Auctioneer', 'deu': 'Auktionator*in', 'ita': 'Auctioneer' } },
          { '@id': 'role:aut', 'skos:prefLabel': { 'eng': 'Author', 'deu': 'Autor*in', 'ita': 'Author' } },
          { '@id': 'role:aqt', 'skos:prefLabel': { 'eng': 'Author in quotations or text abstracts', 'deu': 'Autor*in in Zitaten oder Zusammenfassungen', 'ita': 'Author in quotations or text abstracts' } },
          { '@id': 'role:aft', 'skos:prefLabel': { 'eng': 'Author of afterword, colophon, etc.', 'deu': 'Autor*in des Nachworts, Kolophon…', 'ita': 'Author of afterword, colophon, etc.' } },
          { '@id': 'role:aud', 'skos:prefLabel': { 'eng': 'Author of dialog', 'deu': 'Autor*in eines Kommentars', 'ita': 'Autore del dialogo' } },
          { '@id': 'role:aui', 'skos:prefLabel': { 'eng': 'Author of introduction', 'deu': 'Autor*in der Einleitung', 'ita': 'Autore dell\'introduzione' } },
          { '@id': 'role:authorofsubtitles', 'skos:prefLabel': { 'eng': 'Author of subtitles', 'deu': 'Autor*in der Untertitel', 'ita': 'Autore dei sottotitoli' } },
          { '@id': 'role:ato', 'skos:prefLabel': { 'eng': 'Autographer', 'deu': 'Unterzeichnende/r', 'ita': 'Autographer' } },
          { '@id': 'role:ant', 'skos:prefLabel': { 'eng': 'Bibliographic antecedent', 'deu': 'Verfasser*in der literarischen Vorlage', 'ita': 'Antecedente bibliografico' } },
          { '@id': 'role:bnd', 'skos:prefLabel': { 'eng': 'Binder', 'deu': 'Buchbinder*in', 'ita': 'Legatore' } },
          { '@id': 'role:bdd', 'skos:prefLabel': { 'eng': 'Binding designer', 'deu': 'Buchbinde-Designer*in', 'ita': 'Binding designer' } },
          { '@id': 'role:blw', 'skos:prefLabel': { 'eng': 'Blurb writer (missing space)', 'deu': 'Autor*in des Klappentextes', 'ita': 'Blurbwriter' } },
          { '@id': 'role:bkd', 'skos:prefLabel': { 'eng': 'Book designer', 'deu': 'Buchgestalter*in', 'ita': 'Designer del libro' } },
          { '@id': 'role:bkp', 'skos:prefLabel': { 'eng': 'Book producer', 'deu': 'Buchproduzent*in', 'ita': 'Book producer' } },
          { '@id': 'role:bjd', 'skos:prefLabel': { 'eng': 'Bookjacket designer', 'deu': 'Designer*in des Buchumschlages / Schutzumschlages', 'ita': 'Bookjacket designer' } },
          { '@id': 'role:bpd', 'skos:prefLabel': { 'eng': 'Bookplate designer', 'deu': 'Designer*in des Exlibris', 'ita': 'Creatore dell\'ex-libris' } },
          { '@id': 'role:bsl', 'skos:prefLabel': { 'eng': 'Bookseller', 'deu': 'Buchhändler*in', 'ita': 'Bookseller' } },
          { '@id': 'role:brl', 'skos:prefLabel': { 'eng': 'Braille embosser', 'deu': 'Brailledrucker*in', 'ita': 'Braille embosser' } },
          { '@id': 'role:brd', 'skos:prefLabel': { 'eng': 'Broadcaster', 'deu': 'Rundfunkveranstalter*in', 'ita': 'Broadcaster' } },
          { '@id': 'role:cll', 'skos:prefLabel': { 'eng': 'Calligrapher', 'deu': 'Kalligraph*in', 'ita': 'Calligrapher' } },
          { '@id': 'role:ctg', 'skos:prefLabel': { 'eng': 'Cartographer', 'deu': 'Kartograph*in', 'ita': 'Cartografo' } },
          { '@id': 'role:cas', 'skos:prefLabel': { 'eng': 'Caster', 'deu': 'Gießer*in', 'ita': 'Caster' } },
          { '@id': 'role:cns', 'skos:prefLabel': { 'eng': 'Censor', 'deu': 'Zensor*in', 'ita': 'Censor' } },
          { '@id': 'role:chr', 'skos:prefLabel': { 'eng': 'Choreographer', 'deu': 'Choreograph*in', 'ita': 'Coreografo' } },
          { '@id': 'role:cng', 'skos:prefLabel': { 'eng': 'Cinematographer', 'deu': 'Kameramann/frau', 'ita': 'Direttore della fotografia' } },
          { '@id': 'role:cli', 'skos:prefLabel': { 'eng': 'Client', 'deu': 'Auftraggeber*in', 'ita': 'Client' } },
          { '@id': 'role:coadvisor', 'skos:prefLabel': { 'eng': 'Co-Advisor', 'deu': 'Mitbetreuer*in der Hochschulschrift', 'ita': 'Co-Advisor' } },
          { '@id': 'role:cor', 'skos:prefLabel': { 'eng': 'Collection registrar', 'deu': 'Registrar*in', 'ita': 'Collection registrar' } },
          { '@id': 'role:col', 'skos:prefLabel': { 'eng': 'Collector', 'deu': 'Sammler*in', 'ita': 'Collezionista' } },
          { '@id': 'role:clt', 'skos:prefLabel': { 'eng': 'Collotyper', 'deu': 'Lichtdrucker*in', 'ita': 'Collotyper' } },
          { '@id': 'role:clr', 'skos:prefLabel': { 'eng': 'Colorist', 'deu': 'Kolorist*in', 'ita': 'Colorist' } },
          { '@id': 'role:cmm', 'skos:prefLabel': { 'eng': 'Commentator', 'deu': 'Kommentator*in', 'ita': 'Commentator' } },
          { '@id': 'role:cwt', 'skos:prefLabel': { 'eng': 'Commentator for written text', 'deu': 'Kommentator*in eines geschriebenen Textes', 'ita': 'Commentator for written text' } },
          { '@id': 'role:com', 'skos:prefLabel': { 'eng': 'Compiler', 'deu': 'Ersteller*in einer Sammlung', 'ita': 'Compilatore' } },
          { '@id': 'role:cmp', 'skos:prefLabel': { 'eng': 'Composer', 'deu': 'Komponist*in', 'ita': 'Compositore' } },
          { '@id': 'role:cmt', 'skos:prefLabel': { 'eng': 'Compositor', 'deu': 'Schriftsetzer*in', 'ita': 'Compositor' } },
          { '@id': 'role:ccp', 'skos:prefLabel': { 'eng': 'Conceptor', 'deu': 'Konzepter*in', 'ita': 'Conceptor' } },
          { '@id': 'role:cnd', 'skos:prefLabel': { 'eng': 'Conductor', 'deu': 'Dirigent*in', 'ita': 'Direttore d’orchestra' } },
          { '@id': 'role:con', 'skos:prefLabel': { 'eng': 'Conservator', 'deu': 'Konservator*in', 'ita': 'Conservator' } },
          { '@id': 'role:csl', 'skos:prefLabel': { 'eng': 'Consultant', 'deu': 'Fachberater*in', 'ita': 'Consultant' } },
          { '@id': 'role:csp', 'skos:prefLabel': { 'eng': 'Consultant to a project', 'deu': 'Projektberater*in', 'ita': 'Consultant to a project' } },
          { '@id': 'role:ctr', 'skos:prefLabel': { 'eng': 'Contractor', 'deu': 'Vertragspartner*in', 'ita': 'Contractor' } },
          { '@id': 'role:ctb', 'skos:prefLabel': { 'eng': 'Contributor', 'deu': 'Mitwirkende/r', 'ita': 'Contributor' } },
          { '@id': 'role:copista', 'skos:prefLabel': { 'eng': 'Copista', 'deu': 'Copista', 'ita': 'Copista' } },
          { '@id': 'role:cpc', 'skos:prefLabel': { 'eng': 'Copyright claimant', 'deu': 'Anspruchsteller*in auf das Copyright', 'ita': 'Copyright claimant' } },
          { '@id': 'role:cph', 'skos:prefLabel': { 'eng': 'Copyright holder', 'deu': 'Inhaber*in des Copyright', 'ita': 'Copyright holder' } },
          { '@id': 'role:crr', 'skos:prefLabel': { 'eng': 'Corrector', 'deu': 'Korrektor*in', 'ita': 'Corrector' } },
          { '@id': 'role:crp', 'skos:prefLabel': { 'eng': 'Correspondent', 'deu': 'Teilnehmer*in einer Korrespondenz', 'ita': 'Correspondent' } },
          { '@id': 'role:cst', 'skos:prefLabel': { 'eng': 'Costume designer', 'deu': 'Kostümbildner*in', 'ita': 'Costume designer' } },
          { '@id': 'role:cov', 'skos:prefLabel': { 'eng': 'Cover designer', 'deu': 'Designer*in der Hüller / Verpackung', 'ita': 'Cover designer' } },
          { '@id': 'role:cur', 'skos:prefLabel': { 'eng': 'Curator', 'deu': 'Kurator*in', 'ita': 'Curator' } },
          { '@id': 'role:dnc', 'skos:prefLabel': { 'eng': 'Dancer', 'deu': 'Tänzer*in', 'ita': 'Dancer' } },
          { '@id': 'role:dtc', 'skos:prefLabel': { 'eng': 'Data contributor', 'deu': 'Datenlieferant*in', 'ita': 'Data contributor' } },
          { '@id': 'role:dtm', 'skos:prefLabel': { 'eng': 'Data manager', 'deu': 'Datenmanager*in', 'ita': 'Gestore di dati' } },
          { '@id': 'role:datasupplier', 'skos:prefLabel': { 'eng': 'Data Supplier', 'deu': 'Datenlieferant*in', 'ita': 'Fornitore dei dati' } },
          { '@id': 'role:dte', 'skos:prefLabel': { 'eng': 'Dedicatee', 'deu': 'Widmungsträger*in', 'ita': 'Dedicatario' } },
          { '@id': 'role:dto', 'skos:prefLabel': { 'eng': 'Dedicator', 'deu': 'Widmende/r', 'ita': 'Dedicante' } },
          { '@id': 'role:dgg', 'skos:prefLabel': { 'eng': 'Degree granting institution', 'deu': 'Verleihende Institution des akademischen Abschlusses', 'ita': 'Istituzione che rilascia il titolo accademico' } },
          { '@id': 'role:dgs', 'skos:prefLabel': { 'eng': 'Degree supervisor', 'deu': 'Betreuer*in der Hochschulschrift', 'ita': 'Degree supervisor' } },
          { '@id': 'role:dln', 'skos:prefLabel': { 'eng': 'Delineator', 'deu': 'Entwurfszeichner*in', 'ita': 'Delineator' } },
          { '@id': 'role:dpc', 'skos:prefLabel': { 'eng': 'Depicted', 'deu': 'Dargestellt / beschrieben', 'ita': 'Depicted' } },
          { '@id': 'role:dpt', 'skos:prefLabel': { 'eng': 'Depositor', 'deu': 'Depositor*in', 'ita': 'Depositor' } },
          { '@id': 'role:dsr', 'skos:prefLabel': { 'eng': 'Designer', 'deu': 'Designer*in', 'ita': 'Designer' } },
          { '@id': 'role:digitiser', 'skos:prefLabel': { 'eng': 'Digitiser', 'deu': 'Digitalisierer*in', 'ita': 'Autore della digitalizzazione' } },
          { '@id': 'role:drt', 'skos:prefLabel': { 'eng': 'Director', 'deu': 'Produktionsleiter*in', 'ita': 'Director' } },
          { '@id': 'role:dis', 'skos:prefLabel': { 'eng': 'Dissertant', 'deu': 'Verfasser*in der Hochschulschrift', 'ita': 'Tesista' } },
          { '@id': 'role:dbp', 'skos:prefLabel': { 'eng': 'Distribution place', 'deu': 'Vertriebsort', 'ita': 'Distribution place' } },
          { '@id': 'role:dst', 'skos:prefLabel': { 'eng': 'Distributor', 'deu': 'Distributor*in', 'ita': 'Distributore' } },
          { '@id': 'role:domainexpert', 'skos:prefLabel': { 'eng': 'Domain Expert', 'deu': 'Fachexpert*in', 'ita': 'Esperto del settore' } },
          { '@id': 'role:dnr', 'skos:prefLabel': { 'eng': 'Donor', 'deu': 'Stifter*in', 'ita': 'Donatore' } },
          { '@id': 'role:drm', 'skos:prefLabel': { 'eng': 'Draftsman', 'deu': 'Technische/r Zeichner*in', 'ita': 'Draftsman' } },
          { '@id': 'role:dub', 'skos:prefLabel': { 'eng': 'Dubious author', 'deu': 'Zweifelhafte Autor*in', 'ita': 'Autore incerto' } },
          { '@id': 'role:edt', 'skos:prefLabel': { 'eng': 'Editor', 'deu': 'Herausgeber*in', 'ita': 'Curatore' } },
          { '@id': 'role:edc', 'skos:prefLabel': { 'eng': 'Editor of compilation', 'deu': 'Herausgeber*in eines Sammelwerks', 'ita': 'Editor of compilation' } },
          { '@id': 'role:edm', 'skos:prefLabel': { 'eng': 'Editor of moving image work', 'deu': 'Filmeditor*in', 'ita': 'Editor of moving image work' } },
          { '@id': 'role:elg', 'skos:prefLabel': { 'eng': 'Electrician', 'deu': 'Lichtechniker*in', 'ita': 'Electrician' } },
          { '@id': 'role:elt', 'skos:prefLabel': { 'eng': 'Electrotyper', 'deu': 'Galvanoplastiker*in', 'ita': 'Electrotyper' } },
          { '@id': 'role:enj', 'skos:prefLabel': { 'eng': 'Enacting jurisdiction', 'deu': 'Verfügende / verordnende Jurisdiktion', 'ita': 'Enacting jurisdiction' } },
          { '@id': 'role:eng', 'skos:prefLabel': { 'eng': 'Engineer', 'deu': 'Ingenieur*in', 'ita': 'Ingegnere' } },
          { '@id': 'role:egr', 'skos:prefLabel': { 'eng': 'Engraver', 'deu': 'Graveur*in', 'ita': 'Incisore' } },
          { '@id': 'role:etr', 'skos:prefLabel': { 'eng': 'Etcher', 'deu': 'Radierer*in', 'ita': 'Acquafortista' } },
          { '@id': 'role:evaluator', 'skos:prefLabel': { 'eng': 'Evaluator', 'deu': 'Evaluator*in', 'ita': 'Valutatore' } },
          { '@id': 'role:exp', 'skos:prefLabel': { 'eng': 'Expert', 'deu': 'Expert*in / Sachverständige/r', 'ita': 'Expert' } },
          { '@id': 'role:fac', 'skos:prefLabel': { 'eng': 'Facsimilist', 'deu': 'Ersteller*in des Faksimile', 'ita': 'Responsabile del facsimile' } },
          { '@id': 'role:fld', 'skos:prefLabel': { 'eng': 'Field director', 'deu': 'Leiter*in der Feldforschung', 'ita': 'Field director' } },
          { '@id': 'role:fmd', 'skos:prefLabel': { 'eng': 'Film director', 'deu': 'Filmregisseur*in', 'ita': 'Film director' } },
          { '@id': 'role:fds', 'skos:prefLabel': { 'eng': 'Film distributor', 'deu': 'Filmverleiher*in', 'ita': 'Film distributor' } },
          { '@id': 'role:flm', 'skos:prefLabel': { 'eng': 'Film editor', 'deu': 'Filmeditor*in', 'ita': 'Responsabile del montaggio' } },
          { '@id': 'role:fmp', 'skos:prefLabel': { 'eng': 'Film producer', 'deu': 'Filmproduzent*in', 'ita': 'Film producer' } },
          { '@id': 'role:fmk', 'skos:prefLabel': { 'eng': 'Filmmaker', 'deu': 'Filmemacher*in', 'ita': 'Filmmaker' } },
          { '@id': 'role:fpy', 'skos:prefLabel': { 'eng': 'First party', 'deu': 'Erste Vertragspartei', 'ita': 'First party' } },
          { '@id': 'role:frg', 'skos:prefLabel': { 'eng': 'Forger', 'deu': 'Fälscher*in', 'ita': 'Forger' } },
          { '@id': 'role:fmo', 'skos:prefLabel': { 'eng': 'Former owner', 'deu': 'Ehemalige/r Eigentümer*in', 'ita': 'Precedente proprietario' } },
          { '@id': 'role:founder', 'skos:prefLabel': { 'eng': 'Founder', 'deu': 'Gründer*in', 'ita': 'Founder' } },
          { '@id': 'role:fnd', 'skos:prefLabel': { 'eng': 'Funder', 'deu': 'Geldgäber*in', 'ita': 'Funder' } },
          { '@id': 'role:gis', 'skos:prefLabel': { 'eng': 'Geographic information specialist', 'deu': 'Spezialist*in für geografische Informationen', 'ita': 'Field director' } },
          { '@id': 'role:graphicdesigner', 'skos:prefLabel': { 'eng': 'Graphic Designer', 'deu': 'Grafikdesigner*in', 'ita': 'Grafico' } },
          { '@id': 'role:hnr', 'skos:prefLabel': { 'eng': 'Honoree', 'deu': 'Geehrte/r, Jubilar*in', 'ita': 'Onorato' } },
          { '@id': 'role:hst', 'skos:prefLabel': { 'eng': 'Host', 'deu': 'Gastgeber*in', 'ita': 'Host' } },
          { '@id': 'role:his', 'skos:prefLabel': { 'eng': 'Host institution', 'deu': 'Gastgebende Institution', 'ita': 'Host institution' } },
          { '@id': 'role:ilu', 'skos:prefLabel': { 'eng': 'Illuminator', 'deu': 'Buchmaler*in', 'ita': 'Miniatore' } },
          { '@id': 'role:ill', 'skos:prefLabel': { 'eng': 'Illustrator', 'deu': 'Illustrator*in', 'ita': 'Illustratore' } },
          { '@id': 'role:initiator', 'skos:prefLabel': { 'eng': 'Initiator', 'deu': 'Initiator*in', 'ita': 'Iniziatore' } },
          { '@id': 'role:ins', 'skos:prefLabel': { 'eng': 'Inscriber', 'deu': 'Widmende/r', 'ita': 'Inscriber' } },
          { '@id': 'role:itr', 'skos:prefLabel': { 'eng': 'Instrumentalist', 'deu': 'Instrumentalist*in', 'ita': 'Instrumentalist' } },
          { '@id': 'role:interpreter', 'skos:prefLabel': { 'eng': 'Interpreter', 'deu': 'Dolmetscher*in', 'ita': 'Interprete' } },
          { '@id': 'role:ive', 'skos:prefLabel': { 'eng': 'Interviewee', 'deu': 'Interviewpartner*in', 'ita': 'Intervistato' } },
          { '@id': 'role:ivr', 'skos:prefLabel': { 'eng': 'Interviewer', 'deu': 'Interviewer*in', 'ita': 'Intervistatore' } },
          { '@id': 'role:inv', 'skos:prefLabel': { 'eng': 'Inventor', 'deu': 'Erfinder*in', 'ita': 'Inventor' } },
          { '@id': 'role:isb', 'skos:prefLabel': { 'eng': 'Issuing body', 'deu': 'Herausgebende Körperschaft', 'ita': 'Issuing body' } },
          { '@id': 'role:keeperoftheoriginal', 'skos:prefLabel': { 'eng': 'Keeper of the original', 'deu': 'Aufbewahrer*in des Originals', 'ita': 'Affidatario dell\'originale' } },
          { '@id': 'role:lbr', 'skos:prefLabel': { 'eng': 'Laboratory', 'deu': 'Labor', 'ita': 'Laboratory' } },
          { '@id': 'role:ldr', 'skos:prefLabel': { 'eng': 'Laboratory director', 'deu': 'Laborleiter*in', 'ita': 'Laboratory director' } },
          { '@id': 'role:lsa', 'skos:prefLabel': { 'eng': 'Landscape architect', 'deu': 'Landschaftsarchitekt*in', 'ita': 'Landscape architect' } },
          { '@id': 'role:led', 'skos:prefLabel': { 'eng': 'Lead', 'deu': 'Leitung', 'ita': 'Lead' } },
          { '@id': 'role:len', 'skos:prefLabel': { 'eng': 'Lender', 'deu': 'Leihgeber', 'ita': 'Lender' } },
          { '@id': 'role:lbt', 'skos:prefLabel': { 'eng': 'Librettist', 'deu': 'Librettist*in', 'ita': 'Librettista' } },
          { '@id': 'role:lse', 'skos:prefLabel': { 'eng': 'Licensee', 'deu': 'Lizenznehmer*in', 'ita': 'Licensee' } },
          { '@id': 'role:lso', 'skos:prefLabel': { 'eng': 'Licensor', 'deu': 'Lizenzgeber*in', 'ita': 'Licensor' } },
          { '@id': 'role:lgd', 'skos:prefLabel': { 'eng': 'Lighting designer', 'deu': 'Lichtgestalter*in', 'ita': 'Lighting designer' } },
          { '@id': 'role:ltg', 'skos:prefLabel': { 'eng': 'Lithographer', 'deu': 'Lithograph*in', 'ita': 'Litografo' } },
          { '@id': 'role:lyr', 'skos:prefLabel': { 'eng': 'Lyricist', 'deu': 'Liedtexter*in', 'ita': 'Paroliere' } },
          { '@id': 'role:mfp', 'skos:prefLabel': { 'eng': 'Manufacture place', 'deu': 'Herstellungsort', 'ita': 'Manufacture place' } },
          { '@id': 'role:mfr', 'skos:prefLabel': { 'eng': 'Manufacturer', 'deu': 'Hersteller*in', 'ita': 'Manufacturer' } },
          { '@id': 'role:mrb', 'skos:prefLabel': { 'eng': 'Marbler', 'deu': 'Marmorier*in', 'ita': 'Marbler' } },
          { '@id': 'role:mrk', 'skos:prefLabel': { 'eng': 'Markup editor', 'deu': 'Markup-Editor*in', 'ita': 'Markup editor' } },
          { '@id': 'role:med', 'skos:prefLabel': { 'eng': 'Medium', 'deu': 'Medium', 'ita': 'Medium' } },
          { '@id': 'role:mdc', 'skos:prefLabel': { 'eng': 'Metadata contact', 'deu': 'Metadaten-Editor*in', 'ita': 'Metadata contact' } },
          { '@id': 'role:emt', 'skos:prefLabel': { 'eng': 'Metal-engraver', 'deu': 'Metallstecher*in', 'ita': 'Calcografo' } },
          { '@id': 'role:mtk', 'skos:prefLabel': { 'eng': 'Minute taker', 'deu': 'Protokollführer*in', 'ita': 'Minute taker' } },
          { '@id': 'role:mod', 'skos:prefLabel': { 'eng': 'Moderator', 'deu': 'Diskussionsleiter*in', 'ita': 'Moderator' } },
          { '@id': 'role:mon', 'skos:prefLabel': { 'eng': 'Monitor', 'deu': 'Vertragsprüfer*in', 'ita': 'Monitor' } },
          { '@id': 'role:mcp', 'skos:prefLabel': { 'eng': 'Music copyist', 'deu': 'Musikkopist*in', 'ita': 'Music copyist' } },
          { '@id': 'role:msd', 'skos:prefLabel': { 'eng': 'Musical director', 'deu': 'Musikalische/r Leiter*in', 'ita': 'Direttore musicale' } },
          { '@id': 'role:mus', 'skos:prefLabel': { 'eng': 'Musician', 'deu': 'Musiker*in', 'ita': 'Musicista' } },
          { '@id': 'role:nrt', 'skos:prefLabel': { 'eng': 'Narrator', 'deu': 'Erzähler*in', 'ita': 'Narrator' } },
          { '@id': 'role:osp', 'skos:prefLabel': { 'eng': 'Onscreen presenter', 'deu': 'Fernsehmoderator*in', 'ita': 'Onscreen presenter' } },
          { '@id': 'role:opn', 'skos:prefLabel': { 'eng': 'Opponent', 'deu': 'Opponent*in bei akademischen Prüfungen', 'ita': 'Controrelatore' } },
          { '@id': 'role:orm', 'skos:prefLabel': { 'eng': 'Organizer', 'deu': 'Veranstalter*in', 'ita': 'Organizer' } },
          { '@id': 'role:org', 'skos:prefLabel': { 'eng': 'Originator', 'deu': 'Schöpfer*in / Urheber*in ', 'ita': 'Originator' } },
          { '@id': 'role:oth', 'skos:prefLabel': { 'eng': 'Other', 'deu': 'Andere', 'ita': 'Altro' } },
          { '@id': 'role:own', 'skos:prefLabel': { 'eng': 'Owner', 'deu': 'Eigentümer*in', 'ita': 'Proprietario' } },
          { '@id': 'role:pan', 'skos:prefLabel': { 'eng': 'Panelist', 'deu': 'Diskussionsteilnehmer*in', 'ita': 'Panelist' } },
          { '@id': 'role:ppm', 'skos:prefLabel': { 'eng': 'Papermaker', 'deu': 'Papiermacher*in', 'ita': 'Papermaker' } },
          { '@id': 'role:pta', 'skos:prefLabel': { 'eng': 'Patent applicant', 'deu': 'Patentantragsteller*in', 'ita': 'Patent applicant' } },
          { '@id': 'role:pth', 'skos:prefLabel': { 'eng': 'Patent holder', 'deu': 'Patentinhaber*in', 'ita': 'Patent holder' } },
          { '@id': 'role:pat', 'skos:prefLabel': { 'eng': 'Patron', 'deu': 'Schirmherr*in / Förderer*in', 'ita': 'Patron' } },
          { '@id': 'role:pedagogicexpert', 'skos:prefLabel': { 'eng': 'Pedagogic Expert', 'deu': 'Pädagogische/r Expert*in', 'ita': 'Esperto pedagogico' } },
          { '@id': 'role:prf', 'skos:prefLabel': { 'eng': 'Performer', 'deu': 'Performer / Künstler*in', 'ita': 'Performer' } },
          { '@id': 'role:pma', 'skos:prefLabel': { 'eng': 'Permitting agency', 'deu': 'Genehmigungsbehörde', 'ita': 'Permitting agency' } },
          { '@id': 'role:pht', 'skos:prefLabel': { 'eng': 'Photographer', 'deu': 'Fotograf*in', 'ita': 'Fotografo' } },
          { '@id': 'role:plt', 'skos:prefLabel': { 'eng': 'Platemaker', 'deu': 'Druckplattenhersteller*in allgemein', 'ita': 'Platemaker' } },
          { '@id': 'role:pra', 'skos:prefLabel': { 'eng': 'Praeses', 'deu': 'Präses', 'ita': 'Praeses' } },
          { '@id': 'role:pre', 'skos:prefLabel': { 'eng': 'Presenter', 'deu': 'Präsentator*in', 'ita': 'Presenter' } },
          { '@id': 'role:prt', 'skos:prefLabel': { 'eng': 'Printer', 'deu': 'Drucker*in', 'ita': 'Stampatore' } },
          { '@id': 'role:pop', 'skos:prefLabel': { 'eng': 'Printer of plates', 'deu': 'Plattendrucker*in', 'ita': 'Printer of plates' } },
          { '@id': 'role:prm', 'skos:prefLabel': { 'eng': 'Printmaker', 'deu': 'Druckplattenhersteller*in (Tief-, Hoch-, Flachdruck)', 'ita': 'Printmaker' } },
          { '@id': 'role:prc', 'skos:prefLabel': { 'eng': 'Process contact', 'deu': 'Ansprechpartner*in', 'ita': 'Process contact' } },
          { '@id': 'role:pro', 'skos:prefLabel': { 'eng': 'Producer', 'deu': 'Produzent*in', 'ita': 'Produttore' } },
          { '@id': 'role:prn', 'skos:prefLabel': { 'eng': 'Production company', 'deu': 'Produktionsfirma', 'ita': 'Production company' } },
          { '@id': 'role:prp', 'skos:prefLabel': { 'eng': 'Production place', 'deu': 'Produktionsort', 'ita': 'Production place' } },
          { '@id': 'role:prs', 'skos:prefLabel': { 'eng': 'Production designer', 'deu': 'Produktionsdesigner*in', 'ita': 'Production designer' } },
          { '@id': 'role:pmn', 'skos:prefLabel': { 'eng': 'Production manager', 'deu': 'Produktionsmanager*in', 'ita': 'Production manager' } },
          { '@id': 'role:prd', 'skos:prefLabel': { 'eng': 'Production personnel', 'deu': 'Produktionspersonal', 'ita': 'Production personnel' } },
          { '@id': 'role:prg', 'skos:prefLabel': { 'eng': 'Programmer', 'deu': 'Programmierer*in', 'ita': 'Programmer' } },
          { '@id': 'role:pdr', 'skos:prefLabel': { 'eng': 'Project director', 'deu': 'Projektleiter*in', 'ita': 'Project director' } },
          { '@id': 'role:pfr', 'skos:prefLabel': { 'eng': 'Proofreader', 'deu': 'Lektor*in', 'ita': 'Correttore' } },
          { '@id': 'role:prv', 'skos:prefLabel': { 'eng': 'Provider', 'deu': 'Anbieter*in / Lieferant*in', 'ita': 'Provider' } },
          { '@id': 'role:pbl', 'skos:prefLabel': { 'eng': 'Publisher', 'deu': 'Verleger*in', 'ita': 'Editore' } },
          { '@id': 'role:pbd', 'skos:prefLabel': { 'eng': 'Publishing director', 'deu': 'Verlagsleiter*in', 'ita': 'Publishing director' } },
          { '@id': 'role:ppt', 'skos:prefLabel': { 'eng': 'Puppeteer', 'deu': 'Puppenspieler*in', 'ita': 'Puppeteer' } },
          { '@id': 'role:rdd', 'skos:prefLabel': { 'eng': 'Radio director', 'deu': 'Radio-, Hörfunkdirektor*in', 'ita': 'Radio director' } },
          { '@id': 'role:rpc', 'skos:prefLabel': { 'eng': 'Radio producer', 'deu': 'Radioproduzent*in', 'ita': 'Radio producer' } },
          { '@id': 'role:rce', 'skos:prefLabel': { 'eng': 'Recording engineer', 'deu': 'Toningenieur*in', 'ita': 'Tecnico della registrazione' } },
          { '@id': 'role:rcd', 'skos:prefLabel': { 'eng': 'Recordist', 'deu': 'Tonaufnahmetechniker*in', 'ita': 'Recordist' } },
          { '@id': 'role:red', 'skos:prefLabel': { 'eng': 'Redaktor', 'deu': 'Redakteur*in', 'ita': 'Redaktor' } },
          { '@id': 'role:ren', 'skos:prefLabel': { 'eng': 'Renderer', 'deu': 'Reinzeichner*in', 'ita': 'Renderer' } },
          { '@id': 'role:rpt', 'skos:prefLabel': { 'eng': 'Reporter', 'deu': 'Reporter*in / Berichterstatter*in', 'ita': 'Reporter' } },
          { '@id': 'role:rth', 'skos:prefLabel': { 'eng': 'Research team head', 'deu': 'Leiter*in eines Forschungsteams', 'ita': 'Direttore della ricerca' } },
          { '@id': 'role:rtm', 'skos:prefLabel': { 'eng': 'Research team member', 'deu': 'Mitarbeiter*in des Forschungsteams', 'ita': 'Membro di un gruppo di ricerca' } },
          { '@id': 'role:res', 'skos:prefLabel': { 'eng': 'Researcher', 'deu': 'Forscher*in', 'ita': 'Ricercatore' } },
          { '@id': 'role:rsp', 'skos:prefLabel': { 'eng': 'Respondent', 'deu': 'Befragte/r bei akademischer Prüfung', 'ita': 'Respondent' } },
          { '@id': 'role:rst', 'skos:prefLabel': { 'eng': 'Respondent-appellant', 'deu': 'Respondent-appellant', 'ita': 'Respondent-appellant' } },
          { '@id': 'role:rse', 'skos:prefLabel': { 'eng': 'Respondent-appellee', 'deu': 'Respondent-appellee', 'ita': 'Respondent-appellee' } },
          { '@id': 'role:rpy', 'skos:prefLabel': { 'eng': 'Responsible party', 'deu': 'Rechtlich verantwortliche Partei', 'ita': 'Responsible party' } },
          { '@id': 'role:rsg', 'skos:prefLabel': { 'eng': 'Restager', 'deu': 'Wiederaufführung', 'ita': 'Restager' } },
          { '@id': 'role:rsr', 'skos:prefLabel': { 'eng': 'Restorationist', 'deu': 'Restaurator*in', 'ita': 'Restorationist' } },
          { '@id': 'role:rev', 'skos:prefLabel': { 'eng': 'Reviewer', 'deu': 'Kritiker*in', 'ita': 'Recensore' } },
          { '@id': 'role:rbr', 'skos:prefLabel': { 'eng': 'Rubricator', 'deu': 'Rubrikator*in', 'ita': 'Rubricator' } },
          { '@id': 'role:sce', 'skos:prefLabel': { 'eng': 'Scenarist', 'deu': 'Szenarist*in', 'ita': 'Scenografo' } },
          { '@id': 'role:sad', 'skos:prefLabel': { 'eng': 'Scientific advisor', 'deu': 'Wissenschaftliche Berater*in', 'ita': 'Consulente scientifico' } },
          { '@id': 'role:aus', 'skos:prefLabel': { 'eng': 'Screenwriter', 'deu': 'Drehbuchautor*in', 'ita': 'Sceneggiatore' } },
          { '@id': 'role:scr', 'skos:prefLabel': { 'eng': 'Scribe', 'deu': 'Skriptor*in', 'ita': 'Scribe' } },
          { '@id': 'role:scl', 'skos:prefLabel': { 'eng': 'Sculptor', 'deu': 'Bildhauer*in', 'ita': 'Scultore' } },
          { '@id': 'role:spy', 'skos:prefLabel': { 'eng': 'Second party', 'deu': 'Zweite Vertragspartei', 'ita': 'Second party' } },
          { '@id': 'role:sec', 'skos:prefLabel': { 'eng': 'Secretary', 'deu': 'Sekretär*in (Funktion)', 'ita': 'Secretary' } },
          { '@id': 'role:sll', 'skos:prefLabel': { 'eng': 'Seller', 'deu': 'Verkäufer*in', 'ita': 'Seller' } },
          { '@id': 'role:std', 'skos:prefLabel': { 'eng': 'Set designer', 'deu': 'Bühnenbildner*in / Filmarchitekt', 'ita': 'Set designer' } },
          { '@id': 'role:stg', 'skos:prefLabel': { 'eng': 'Setting', 'deu': 'Schauplatz / Handlungsraum', 'ita': 'Setting' } },
          { '@id': 'role:sgn', 'skos:prefLabel': { 'eng': 'Signer', 'deu': 'Unterzeichner*in', 'ita': 'Signer' } },
          { '@id': 'role:sng', 'skos:prefLabel': { 'eng': 'Singer', 'deu': 'Sänger*in', 'ita': 'Cantante' } },
          { '@id': 'role:sds', 'skos:prefLabel': { 'eng': 'Sound designer', 'deu': 'Sounddesigner*in', 'ita': 'Progettista del suono' } },
          { '@id': 'role:spk', 'skos:prefLabel': { 'eng': 'Speaker', 'deu': 'Sprecher*in', 'ita': 'Speaker' } },
          { '@id': 'role:spn', 'skos:prefLabel': { 'eng': 'Sponsor', 'deu': 'Sponsor', 'ita': 'Sponsor' } },
          { '@id': 'role:sgd', 'skos:prefLabel': { 'eng': 'Stage director', 'deu': 'Theaterregisseur*in', 'ita': 'Stage director' } },
          { '@id': 'role:stm', 'skos:prefLabel': { 'eng': 'Stage manager', 'deu': 'Inspizient*in / Bühnenmeister*in', 'ita': 'Stage manager' } },
          { '@id': 'role:stn', 'skos:prefLabel': { 'eng': 'Standards body', 'deu': 'Normkomitee', 'ita': 'Standards body' } },
          { '@id': 'role:str', 'skos:prefLabel': { 'eng': 'Stereotyper', 'deu': 'Stereotypieplattenhersteller', 'ita': 'Stereotyper' } },
          { '@id': 'role:stl', 'skos:prefLabel': { 'eng': 'Storyteller', 'deu': 'Geschichtenerzähler', 'ita': 'Storyteller' } },
          { '@id': 'role:sht', 'skos:prefLabel': { 'eng': 'Supporting host', 'deu': 'Unterstützer*in', 'ita': 'Supporting host' } },
          { '@id': 'role:srv', 'skos:prefLabel': { 'eng': 'Surveyor', 'deu': 'Landvermesser*in', 'ita': 'Surveyor' } },
          { '@id': 'role:tch', 'skos:prefLabel': { 'eng': 'Teacher', 'deu': 'Lehrer*in', 'ita': 'Teacher' } },
          { '@id': 'role:tcd', 'skos:prefLabel': { 'eng': 'Technical director', 'deu': 'Technische/r Direktor*in', 'ita': 'Technical director' } },
          { '@id': 'role:technicalinspector', 'skos:prefLabel': { 'eng': 'Technical Inspector', 'deu': 'Technische/r Prüfer*in', 'ita': 'Ispettore tecnico' } },
          { '@id': 'role:technicaltranslator', 'skos:prefLabel': { 'eng': 'Technical Translator', 'deu': 'Technische/r Übersetzer*in', 'ita': 'Traduttore Tecnico' } },
          { '@id': 'role:tld', 'skos:prefLabel': { 'eng': 'Television director', 'deu': 'Fernsehintendant*in', 'ita': 'Television director' } },
          { '@id': 'role:tlp', 'skos:prefLabel': { 'eng': 'Television producer', 'deu': 'Fernsehproduzent*in', 'ita': 'Television producer' } },
          { '@id': 'role:textprocessor', 'skos:prefLabel': { 'eng': 'Text Processor', 'deu': 'Textbearbeiter*in', 'ita': 'Estensore del testo' } },
          { '@id': 'role:ths', 'skos:prefLabel': { 'eng': 'Thesis advisor', 'deu': 'Dissertationsbetreuer*in', 'ita': 'Relatore' } },
          { '@id': 'role:trc', 'skos:prefLabel': { 'eng': 'Transcriber', 'deu': 'Transkriptor*in von Noten', 'ita': 'Transcriber' } },
          { '@id': 'role:trl', 'skos:prefLabel': { 'eng': 'Translator', 'deu': 'Übersetzer*in', 'ita': 'Traduttore' } },
          { '@id': 'role:tyd', 'skos:prefLabel': { 'eng': 'Type designer', 'deu': 'Schriftdesigner*in / Schriftentwerfer*in', 'ita': 'Type designer' } },
          { '@id': 'role:tyg', 'skos:prefLabel': { 'eng': 'Typographer', 'deu': 'Typograph*in', 'ita': 'Tipografo' } },
          { '@id': 'role:uploader', 'skos:prefLabel': { 'eng': 'Uploader', 'deu': 'Uploader', 'ita': 'Uploader' } },
          { '@id': 'role:vdg', 'skos:prefLabel': { 'eng': 'Videographer', 'deu': 'Videofilmer*in', 'ita': 'Videografo' } },
          { '@id': 'role:vac', 'skos:prefLabel': { 'eng': 'Voice actor', 'deu': 'Synchron-, Sprecher*in', 'ita': 'Voice actor' } },
          { '@id': 'role:wit', 'skos:prefLabel': { 'eng': 'Witness', 'deu': 'Zeug*in', 'ita': 'Witness' } },
          { '@id': 'role:wde', 'skos:prefLabel': { 'eng': 'Wood-engraver', 'deu': 'Holzstecher*in', 'ita': 'Xilografo' } },
          { '@id': 'role:wdc', 'skos:prefLabel': { 'eng': 'Woodcutter', 'deu': 'Holzschneider*in', 'ita': 'Woodcutter' } },
          { '@id': 'role:wam', 'skos:prefLabel': { 'eng': 'Writer of accompanying material', 'deu': 'Autor*in von Begleitmaterial', 'ita': 'Autore del materiale allegato' } },
          { '@id': 'role:wac', 'skos:prefLabel': { 'eng': 'Writer of added commentary', 'deu': 'Autor*in von zusätzlichen Kommentaren', 'ita': 'Writer of added commentary' } },
          { '@id': 'role:wal', 'skos:prefLabel': { 'eng': 'Writer of added lyrics', 'deu': 'Autor*in von zusätzlichen Texten zu musikalischen Werken ', 'ita': 'Writer of added lyrics' } },
          { '@id': 'role:wat', 'skos:prefLabel': { 'eng': 'Writer of added text', 'deu': 'Autor*in von zusätzlichen Texten zu nichtextlichen Werken', 'ita': 'Writer of added text' } },
          { '@id': 'role:win', 'skos:prefLabel': { 'eng': 'Writer of introduction', 'deu': 'Autor*in der Einführung', 'ita': 'Writer of introduction' } },
          { '@id': 'role:wpr', 'skos:prefLabel': { 'eng': 'Writer of preface', 'deu': 'Autor*in des Vorwortes', 'ita': 'Writer of preface' } },
          { '@id': 'role:wst', 'skos:prefLabel': { 'eng': 'Writer of supplementary textual content', 'deu': 'Autor*in von ergänzendem Textinhalt', 'ita': 'Writer of supplementary textual content' } }
        ],
        loaded: true
      },
      'irrolepredicate': {
        terms: [
          { '@id': 'role:aut', 'skos:prefLabel': { 'eng': 'Author', 'deu': 'Autor*in', 'ita': 'Author' } },
          { '@id': 'role:edt', 'skos:prefLabel': { 'eng': 'Editor', 'deu': 'Herausgeber*in', 'ita': 'Curatore' } }
        ],
        loaded: true
      },
      'editoronlyrolepredicate': {
        terms: [
          { '@id': 'role:edt', 'skos:prefLabel': { 'eng': 'Editor', 'deu': 'Herausgeber*in', 'ita': 'Curatore' } }
        ],
        loaded: true
      },
      'submitrolepredicate': {
        terms: [
          { '@id': 'role:adp', 'skos:prefLabel': { 'eng': 'Adapter', 'deu': 'Bearbeiter*in', 'ita': 'Adattatore' } },
          { '@id': 'role:arc', 'skos:prefLabel': { 'eng': 'Architect', 'deu': 'Architekt*in', 'ita': 'Architetto' } },
          { '@id': 'role:art', 'skos:prefLabel': { 'eng': 'Artist', 'deu': 'Künstler*in', 'ita': 'Artista' } },
          { '@id': 'role:assessor', 'skos:prefLabel': { 'eng': 'Assessor', 'deu': 'Beurteiler*in der Hochschulschrift', 'ita': 'Assessor' } },
          { '@id': 'role:att', 'skos:prefLabel': { 'eng': 'Attributed name', 'deu': 'Zugeschriebene/r Autor*in', 'ita': 'Nome attribuito' } },
          { '@id': 'role:aut', 'skos:prefLabel': { 'eng': 'Author', 'deu': 'Autor*in', 'ita': 'Author' } },
          { '@id': 'role:chr', 'skos:prefLabel': { 'eng': 'Choreographer', 'deu': 'Choreograph*in', 'ita': 'Coreografo' } },
          { '@id': 'role:col', 'skos:prefLabel': { 'eng': 'Collector', 'deu': 'Sammler*in', 'ita': 'Collezionista' } },
          { '@id': 'role:cmp', 'skos:prefLabel': { 'eng': 'Composer', 'deu': 'Komponist*in', 'ita': 'Compositore' } },
          { '@id': 'role:cnd', 'skos:prefLabel': { 'eng': 'Conductor', 'deu': 'Dirigent*in', 'ita': 'Direttore d’orchestra' } },
          { '@id': 'role:con', 'skos:prefLabel': { 'eng': 'Conservator', 'deu': 'Konservator*in', 'ita': 'Conservator' } },
          { '@id': 'role:dnc', 'skos:prefLabel': { 'eng': 'Dancer', 'deu': 'Tänzer*in', 'ita': 'Dancer' } },
          { '@id': 'role:dtc', 'skos:prefLabel': { 'eng': 'Data contributor', 'deu': 'Datenlieferant*in', 'ita': 'Data contributor' } },
          { '@id': 'role:datasupplier', 'skos:prefLabel': { 'eng': 'Data Supplier', 'deu': 'Datenlieferant*in', 'ita': 'Fornitore dei dati' } },
          { '@id': 'role:dgg', 'skos:prefLabel': { 'eng': 'Degree granting institution', 'deu': 'Verleihende Institution des akademischen Abschlusses', 'ita': 'Istituzione che rilascia il titolo accademico' } },
          { '@id': 'role:dgs', 'skos:prefLabel': { 'eng': 'Degree supervisor', 'deu': 'Betreuer*in der Hochschulschrift', 'ita': 'Degree supervisor' } },
          { '@id': 'role:dsr', 'skos:prefLabel': { 'eng': 'Designer', 'deu': 'Designer*in', 'ita': 'Designer' } },
          { '@id': 'role:digitiser', 'skos:prefLabel': { 'eng': 'Digitiser', 'deu': 'Digitalisierer*in', 'ita': 'Autore della digitalizzazione' } },
          { '@id': 'role:dis', 'skos:prefLabel': { 'eng': 'Dissertant', 'deu': 'Verfasser*in der Hochschulschrift', 'ita': 'Tesista' } },
          { '@id': 'role:edt', 'skos:prefLabel': { 'eng': 'Editor', 'deu': 'Herausgeber*in', 'ita': 'Curatore' } },
          { '@id': 'role:fmd', 'skos:prefLabel': { 'eng': 'Film director', 'deu': 'Filmregisseur*in', 'ita': 'Film director' } },
          { '@id': 'role:founder', 'skos:prefLabel': { 'eng': 'Founder', 'deu': 'Gründer*in', 'ita': 'Founder' } },
          { '@id': 'role:fnd', 'skos:prefLabel': { 'eng': 'Funder', 'deu': 'Geldgäber*in', 'ita': 'Funder' } },
          { '@id': 'role:graphicdesigner', 'skos:prefLabel': { 'eng': 'Graphic Designer', 'deu': 'Grafikdesigner*in', 'ita': 'Grafico' } },
          { '@id': 'role:initiator', 'skos:prefLabel': { 'eng': 'Initiator', 'deu': 'Initiator*in', 'ita': 'Iniziatore' } },
          { '@id': 'role:interpreter', 'skos:prefLabel': { 'eng': 'Interpreter', 'deu': 'Dolmetscher*in', 'ita': 'Interprete' } },
          { '@id': 'role:ive', 'skos:prefLabel': { 'eng': 'Interviewee', 'deu': 'Interviewpartner*in', 'ita': 'Intervistato' } },
          { '@id': 'role:ivr', 'skos:prefLabel': { 'eng': 'Interviewer', 'deu': 'Interviewer*in', 'ita': 'Intervistatore' } },
          { '@id': 'role:keeperoftheoriginal', 'skos:prefLabel': { 'eng': 'Keeper of the original', 'deu': 'Aufbewahrer*in des Originals', 'ita': 'Affidatario dell\'originale' } },
          { '@id': 'role:led', 'skos:prefLabel': { 'eng': 'Lead', 'deu': 'Leitung', 'ita': 'Lead' } },
          { '@id': 'role:mfr', 'skos:prefLabel': { 'eng': 'Manufacturer', 'deu': 'Hersteller*in', 'ita': 'Manufacturer' } },
          { '@id': 'role:emt', 'skos:prefLabel': { 'eng': 'Metal-engraver', 'deu': 'Metallstecher*in', 'ita': 'Calcografo' } },
          { '@id': 'role:nrt', 'skos:prefLabel': { 'eng': 'Narrator', 'deu': 'Erzähler*in', 'ita': 'Narrator' } },
          { '@id': 'role:oth', 'skos:prefLabel': { 'eng': 'Other', 'deu': 'Andere', 'ita': 'Altro' } },
          { '@id': 'role:pedagogicexpert', 'skos:prefLabel': { 'eng': 'Pedagogic Expert', 'deu': 'Pädagogische/r Expert*in', 'ita': 'Esperto pedagogico' } },
          { '@id': 'role:pht', 'skos:prefLabel': { 'eng': 'Photographer', 'deu': 'Fotograf*in', 'ita': 'Fotografo' } },
          { '@id': 'role:pro', 'skos:prefLabel': { 'eng': 'Producer', 'deu': 'Produzent*in', 'ita': 'Produttore' } },
          { '@id': 'role:res', 'skos:prefLabel': { 'eng': 'Researcher', 'deu': 'Forscher*in', 'ita': 'Ricercatore' } },
          { '@id': 'role:technicalinspector', 'skos:prefLabel': { 'eng': 'Technical Inspector', 'deu': 'Technische/r Prüfer*in', 'ita': 'Ispettore tecnico' } },
          { '@id': 'role:technicaltranslator', 'skos:prefLabel': { 'eng': 'Technical Translator', 'deu': 'Technische/r Übersetzer*in', 'ita': 'Traduttore Tecnico' } },
          { '@id': 'role:textprocessor', 'skos:prefLabel': { 'eng': 'Text Processor', 'deu': 'Textbearbeiter*in', 'ita': 'Estensore del testo' } },
          { '@id': 'role:ths', 'skos:prefLabel': { 'eng': 'Thesis advisor', 'deu': 'Dissertationsbetreuer*in', 'ita': 'Relatore' } },
          { '@id': 'role:trl', 'skos:prefLabel': { 'eng': 'Translator', 'deu': 'Übersetzer*in', 'ita': 'Traduttore' } },
          { '@id': 'role:uploader', 'skos:prefLabel': { 'eng': 'Uploader', 'deu': 'Uploader', 'ita': 'Uploader' } }
        ],
        loaded: true
      },
      'mimetypes': {
        terms: [
          { '@id': 'image/jpeg', 'skos:notation': ['jpeg', 'jpg'], 'skos:prefLabel': { 'eng': 'JPG/JPEG' } },
          { '@id': 'image/tiff', 'skos:notation': ['tiff', 'tif'], 'skos:prefLabel': { 'eng': 'TIFF' } },
          { '@id': 'image/gif', 'skos:notation': ['gif'], 'skos:prefLabel': { 'eng': 'GIF' } },
          { '@id': 'image/png', 'skos:notation': ['png'], 'skos:prefLabel': { 'eng': 'PNG' } },
          { '@id': 'image/x-ms-bmp', 'skos:notation': ['bmp'], 'skos:prefLabel': { 'eng': 'BMP' } },
          { '@id': 'audio/wav', 'skos:notation': ['wav'], 'skos:prefLabel': { 'eng': 'WAVE' } },
          { '@id': 'audio/mpeg', 'skos:notation': ['mp3'], 'skos:prefLabel': { 'eng': 'MP3' } },
          { '@id': 'audio/flac', 'skos:notation': ['flac'], 'skos:prefLabel': { 'eng': 'FLAC' } },
          { '@id': 'audio/ogg', 'skos:notation': ['ogg'], 'skos:prefLabel': { 'eng': 'Ogg' } },
          { '@id': 'video/mpeg', 'skos:notation': ['mpg'], 'skos:prefLabel': { 'eng': 'MPEG' } },
          { '@id': 'video/avi', 'skos:notation': ['avi'], 'skos:prefLabel': { 'eng': 'AVI' } },
          { '@id': 'video/mp4', 'skos:notation': ['mp4'], 'skos:prefLabel': { 'eng': 'MPEG-4' } },
          { '@id': 'video/quicktime', 'skos:notation': ['qt', 'mov'], 'skos:prefLabel': { 'eng': 'Quicktime' } },
          { '@id': 'video/x-matroska', 'skos:notation': ['mkv'], 'skos:prefLabel': { 'eng': 'MKV' } },
          { '@id': 'application/x-iso9660-image', 'skos:notation': ['iso'], 'skos:prefLabel': { 'eng': 'ISO' } },
          { '@id': 'application/octet-stream', 'skos:notation': [], 'skos:prefLabel': { 'eng': 'Data' } },
          { '@id': 'application/pdf', 'skos:notation': ['pdf'], 'skos:prefLabel': { 'eng': 'PDF' } },
          { '@id': 'text/plain', 'skos:notation': ['txt'], 'skos:prefLabel': { 'eng': '.txt' } },
          { '@id': 'text/html', 'skos:notation': ['htm', 'html', 'shtml'], 'skos:prefLabel': { 'eng': 'HTML' } },
          { '@id': 'model/ply', 'skos:notation': ['ply'], 'skos:prefLabel': { 'eng': 'PLY' } },
          { '@id': 'model/nxz', 'skos:notation': ['nxz'], 'skos:prefLabel': { 'eng': 'NXZ' } },
          { '@id': 'application/epub+zip', 'skos:notation': ['.epub'], 'skos:prefLabel': { 'eng': 'EPUB' } },
          { '@id': 'application/msword', 'skos:notation': ['doc'], 'skos:prefLabel': { 'eng': '.doc' } },
          { '@id': 'application/vnd.ms-excel', 'skos:notation': ['xls'], 'skos:prefLabel': { 'eng': '.xls' } },
          { '@id': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'skos:notation': ['docx'], 'skos:prefLabel': { 'eng': '.docx' } },
          { '@id': 'application/vnd.openxmlformats-officedocument.wordprocessingml.template', 'skos:notation': ['dotx'], 'skos:prefLabel': { 'eng': '.dotx' } },
          { '@id': 'application/vnd.ms-word.document.macroEnabled.12', 'skos:notation': ['docm'], 'skos:prefLabel': { 'eng': '.docm' } },
          { '@id': 'application/vnd.ms-word.template.macroEnabled.12', 'skos:notation': ['dotm'], 'skos:prefLabel': { 'eng': '.dotm' } },
          { '@id': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'skos:notation': ['xlsx'], 'skos:prefLabel': { 'eng': '.xlsx' } },
          { '@id': 'application/vnd.openxmlformats-officedocument.spreadsheetml.template', 'skos:notation': ['xltx'], 'skos:prefLabel': { 'eng': '.xltx' } },
          { '@id': 'application/vnd.ms-excel.sheet.macroEnabled.12', 'skos:notation': ['xlsm'], 'skos:prefLabel': { 'eng': '.xlsm' } },
          { '@id': 'application/vnd.ms-excel.template.macroEnabled.12', 'skos:notation': ['xltm'], 'skos:prefLabel': { 'eng': '.xltm' } },
          { '@id': 'application/vnd.ms-excel.addin.macroEnabled.12', 'skos:notation': ['xlam'], 'skos:prefLabel': { 'eng': '.xlam' } },
          { '@id': 'application/vnd.ms-excel.sheet.binary.macroEnabled.12', 'skos:notation': ['xlsb'], 'skos:prefLabel': { 'eng': '.xlsb' } },
          { '@id': 'application/vnd.ms-powerpoint', 'skos:notation': ['ppt'], 'skos:prefLabel': { 'eng': '.ppt' } },
          { '@id': 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'skos:notation': ['pptx'], 'skos:prefLabel': { 'eng': '.pptx' } },
          { '@id': 'application/vnd.openxmlformats-officedocument.presentationml.template', 'skos:notation': ['potx'], 'skos:prefLabel': { 'eng': '.potx' } },
          { '@id': 'application/vnd.openxmlformats-officedocument.presentationml.slideshow', 'skos:notation': ['ppsx'], 'skos:prefLabel': { 'eng': '.ppsx' } },
          { '@id': 'application/vnd.ms-powerpoint.addin.macroEnabled.12', 'skos:notation': ['ppam'], 'skos:prefLabel': { 'eng': '.ppam' } },
          { '@id': 'application/vnd.ms-powerpoint.presentation.macroEnabled.12', 'skos:notation': ['pptm'], 'skos:prefLabel': { 'eng': '.pptm' } },
          { '@id': 'application/vnd.ms-powerpoint.presentation.macroEnabled.12', 'skos:notation': ['potm'], 'skos:prefLabel': { 'eng': '.potm' } },
          { '@id': 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12', 'skos:notation': ['ppsm'], 'skos:prefLabel': { 'eng': '.ppsm' } },
          { '@id': 'application/vnd.oasis.opendocument.text', 'skos:notation': ['odt'], 'skos:prefLabel': { 'eng': '.odt' } },
          { '@id': 'application/vnd.oasis.opendocument.text-template', 'skos:notation': ['ott'], 'skos:prefLabel': { 'eng': '.ott' } },
          { '@id': 'application/vnd.oasis.opendocument.text-web', 'skos:notation': ['oth'], 'skos:prefLabel': { 'eng': '.oth' } },
          { '@id': 'application/vnd.oasis.opendocument.text-master', 'skos:notation': ['odm'], 'skos:prefLabel': { 'eng': '.odm' } },
          { '@id': 'application/vnd.oasis.opendocument.graphics', 'skos:notation': ['odg'], 'skos:prefLabel': { 'eng': '.odg' } },
          { '@id': 'application/vnd.oasis.opendocument.graphics-template', 'skos:notation': ['otg'], 'skos:prefLabel': { 'eng': '.otg' } },
          { '@id': 'application/vnd.oasis.opendocument.presentation', 'skos:notation': ['odp'], 'skos:prefLabel': { 'eng': '.odp' } },
          { '@id': 'application/vnd.oasis.opendocument.presentation-template', 'skos:notation': ['otp'], 'skos:prefLabel': { 'eng': '.otp' } },
          { '@id': 'application/vnd.oasis.opendocument.spreadsheet', 'skos:notation': ['ods'], 'skos:prefLabel': { 'eng': '.ods' } },
          { '@id': 'application/vnd.oasis.opendocument.spreadsheet-template', 'skos:notation': ['ots'], 'skos:prefLabel': { 'eng': '.ots' } },
          { '@id': 'application/vnd.oasis.opendocument.chart', 'skos:notation': ['odc'], 'skos:prefLabel': { 'eng': '.odc' } },
          { '@id': 'application/vnd.oasis.opendocument.formula', 'skos:notation': ['odf'], 'skos:prefLabel': { 'eng': '.odf' } },
          { '@id': 'application/vnd.oasis.opendocument.database', 'skos:notation': ['odb'], 'skos:prefLabel': { 'eng': '.odb' } },
          { '@id': 'application/vnd.oasis.opendocument.image', 'skos:notation': ['odi'], 'skos:prefLabel': { 'eng': '.odi' } }
        ],
        loaded: true
      },
      'licenses': {
        terms: [
          { '@id': 'http://rightsstatements.org/vocab/InC/1.0/', 'skos:notation': ['1'], 'skos:prefLabel': { 'eng': 'All rights reserved', 'deu': 'Alle Rechte vorbehalten' } },
          { '@id': 'http://creativecommons.org/licenses/by/4.0/', 'skos:notation': ['16'], 'skos:prefLabel': { 'eng': 'CC BY 4.0 International' }, 'img': 'cc-by.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc/4.0/', 'skos:notation': ['17'], 'skos:prefLabel': { 'eng': 'CC BY-NC 4.0 International' }, 'img': 'cc-by-nc.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc-nd/4.0/', 'skos:notation': ['18'], 'skos:prefLabel': { 'eng': 'CC BY-NC-ND 4.0 International' }, 'img': 'cc-by-nc-nd.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc-sa/4.0/', 'skos:notation': ['19'], 'skos:prefLabel': { 'eng': 'CC BY-NC-SA 4.0 International' }, 'img': 'cc-by-nc-sa.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nd/4.0/', 'skos:notation': ['20'], 'skos:prefLabel': { 'eng': 'CC BY-ND 4.0 International' }, 'img': 'cc-by-nd.png' },
          { '@id': 'http://creativecommons.org/licenses/by-sa/4.0/', 'skos:notation': ['21'], 'skos:prefLabel': { 'eng': 'CC BY-SA 4.0 International' }, 'img': 'cc-by-sa.png' }
        ],
        loaded: true
      },
      'alllicenses': {
        terms: [
          { '@id': 'http://rightsstatements.org/vocab/InC/1.0/', 'skos:notation': ['1'], 'skos:prefLabel': { 'eng': 'All rights reserved', 'deu': 'Alle Rechte vorbehalten' } },
          { '@id': 'http://creativecommons.org/licenses/by/4.0/', 'skos:notation': ['16'], 'skos:prefLabel': { 'eng': 'CC BY 4.0 International' }, 'img': 'cc-by.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc/4.0/', 'skos:notation': ['17'], 'skos:prefLabel': { 'eng': 'CC BY-NC 4.0 International' }, 'img': 'cc-by-nc.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc-nd/4.0/', 'skos:notation': ['18'], 'skos:prefLabel': { 'eng': 'CC BY-NC-ND 4.0 International' }, 'img': 'cc-by-nc-nd.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc-sa/4.0/', 'skos:notation': ['19'], 'skos:prefLabel': { 'eng': 'CC BY-NC-SA 4.0 International' }, 'img': 'cc-by-nc-sa.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nd/4.0/', 'skos:notation': ['20'], 'skos:prefLabel': { 'eng': 'CC BY-ND 4.0 International' }, 'img': 'cc-by-nd.png' },
          { '@id': 'http://creativecommons.org/licenses/by-sa/4.0/', 'skos:notation': ['21'], 'skos:prefLabel': { 'eng': 'CC BY-SA 4.0 International' }, 'img': 'cc-by-sa.png' },
          { '@id': 'http://creativecommons.org/publicdomain/mark/1.0/', 'skos:notation': ['9'], 'skos:prefLabel': { 'eng': 'Public Domain Mark 1.0' }, 'img': 'pdm.png' },
          { '@id': 'http://creativecommons.org/licenses/by/3.0/', 'skos:notation': ['28'], 'skos:prefLabel': { 'eng': 'CC BY 3.0 Unported' }, 'img': 'cc-by.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc/3.0/', 'skos:notation': ['30'], 'skos:prefLabel': { 'eng': 'CC BY-NC 3.0 Unported' }, 'img': 'cc-by-nc.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc-nd/3.0/', 'skos:notation': ['33'], 'skos:prefLabel': { 'eng': 'CC BY-NC-ND 3.0 Unported' }, 'img': 'cc-by-nc-nd.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc-sa/3.0/', 'skos:notation': ['32'], 'skos:prefLabel': { 'eng': 'CC BY-NC-SA 3.0 Unported' }, 'img': 'cc-by-nc-sa.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nd/3.0/', 'skos:notation': ['31'], 'skos:prefLabel': { 'eng': 'CC BY-ND 3.0 Unported' }, 'img': 'cc-by-nd.png' },
          { '@id': 'http://creativecommons.org/licenses/by-sa/3.0/', 'skos:notation': ['29'], 'skos:prefLabel': { 'eng': 'CC BY-SA 3.0 Unported' }, 'img': 'cc-by-sa.png' },
          { '@id': 'http://creativecommons.org/licenses/by/3.0/at/', 'skos:notation': ['10'], 'skos:prefLabel': { 'eng': 'CC BY 3.0 Austria' }, 'img': 'cc-by.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc/3.0/at/', 'skos:notation': ['11'], 'skos:prefLabel': { 'eng': 'CC BY-NC 3.0 Austria' }, 'img': 'cc-by-nc.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc-nd/3.0/at/', 'skos:notation': ['12'], 'skos:prefLabel': { 'eng': 'CC BY-NC-ND 3.0 Austria' }, 'img': 'cc-by-nc-nd.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc-sa/3.0/at/', 'skos:notation': ['13'], 'skos:prefLabel': { 'eng': 'CC BY-NC-SA 3.0 Austria' }, 'img': 'cc-by-nc-sa.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nd/3.0/at/', 'skos:notation': ['14'], 'skos:prefLabel': { 'eng': 'CC BY-ND 3.0 Austria' }, 'img': 'cc-by-nd.png' },
          { '@id': 'http://creativecommons.org/licenses/by-sa/3.0/at/', 'skos:notation': ['15'], 'skos:prefLabel': { 'eng': 'CC BY-SA 3.0 Austria' }, 'img': 'cc-by-sa.png' },
          { '@id': 'http://creativecommons.org/licenses/by/2.0/', 'skos:notation': ['22'], 'skos:prefLabel': { 'eng': 'CC BY 2.0 Generic' }, 'img': 'cc-by.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc/2.0/', 'skos:notation': ['24'], 'skos:prefLabel': { 'eng': 'CC BY-NC 2.0 Generic' }, 'img': 'cc-by-nc.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc-nd/2.0/', 'skos:notation': ['27'], 'skos:prefLabel': { 'eng': 'CC BY-NC-ND 2.0 Generic' }, 'img': 'cc-by-nc-nd.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc-sa/2.0/', 'skos:notation': ['26'], 'skos:prefLabel': { 'eng': 'CC BY-NC-SA 2.0 Generic' }, 'img': 'cc-by-nc-sa.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nd/2.0/', 'skos:notation': ['25'], 'skos:prefLabel': { 'eng': 'CC BY-ND 2.0 Generic' }, 'img': 'cc-by-nd.png' },
          { '@id': 'http://creativecommons.org/licenses/by-sa/2.0/', 'skos:notation': ['23'], 'skos:prefLabel': { 'eng': 'CC BY-SA 2.0 Generic' }, 'img': 'cc-by-sa.png' },
          { '@id': 'http://creativecommons.org/licenses/by/2.0/at/', 'skos:notation': ['2'], 'skos:prefLabel': { 'eng': 'CC BY 2.0 Austria' }, 'img': 'cc-by.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc/2.0/at/', 'skos:notation': ['3'], 'skos:prefLabel': { 'eng': 'CC BY-NC 2.0 Austria' }, 'img': 'cc-by-nc.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc-nd/2.0/at/', 'skos:notation': ['4'], 'skos:prefLabel': { 'eng': 'CC BY-NC-ND 2.0 Austria' }, 'img': 'cc-by-nc-nd.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nc-sa/2.0/at/', 'skos:notation': ['5'], 'skos:prefLabel': { 'eng': 'CC BY-NC-SA 2.0 Austria' }, 'img': 'cc-by-nc-sa.png' },
          { '@id': 'http://creativecommons.org/licenses/by-nd/2.0/at/', 'skos:notation': ['6'], 'skos:prefLabel': { 'eng': 'CC BY-ND 2.0 Austria' }, 'img': 'cc-by-nd.png' },
          { '@id': 'http://creativecommons.org/licenses/by-sa/2.0/at/', 'skos:notation': ['7'], 'skos:prefLabel': { 'eng': 'CC BY-SA 2.0 Austria' }, 'img': 'cc-by-sa.png' }
        ],
        loaded: true
      },
      'uncefact': {
        terms: [
          { '@id': 'MTR', 'skos:prefLabel': { 'eng': 'm' } },
          { '@id': 'CMT', 'skos:prefLabel': { 'eng': 'cm' } },
          { '@id': 'MMT', 'skos:prefLabel': { 'eng': 'mm' } },
          { '@id': 'GRM', 'skos:prefLabel': { 'eng': 'g' } },
          { '@id': 'KGM', 'skos:prefLabel': { 'eng': 'kg' } }
        ],
        loaded: true
      },
      'uncefactsize': {
        terms: [
          { '@id': 'MTR', 'skos:prefLabel': { 'eng': 'm' } },
          { '@id': 'CMT', 'skos:prefLabel': { 'eng': 'cm' } },
          { '@id': 'MMT', 'skos:prefLabel': { 'eng': 'mm' } }
        ],
        loaded: true
      },
      'uncefactweight': {
        terms: [
          { '@id': 'GRM', 'skos:prefLabel': { 'eng': 'g' } },
          { '@id': 'KGM', 'skos:prefLabel': { 'eng': 'kg' } }
        ],
        loaded: true
      },
      'carriertype': {
        terms: [
          { '@id': ns + '2FTX-ZPZV', 'skos:prefLabel': { 'eng': 'ADAT' } },
          { '@id': ns + 'A3BG-65F5', 'skos:prefLabel': { 'eng': 'CD' } },
          { '@id': ns + '4CQF-7HHF', 'skos:prefLabel': { 'eng': 'DAT' } },
          { '@id': ns + 'HXSS-NBZ4', 'skos:prefLabel': { 'eng': 'audiocassette' } },
          { '@id': ns + 'X627-FCV9', 'skos:prefLabel': { 'eng': 'tape' } },
          { '@id': ns + 'C36Q-N42M', 'skos:prefLabel': { 'eng': 'lantern slide', 'deu': 'Glasplattendia' } }
        ],
        loaded: true
      },
      'resourcetype': {
        terms: [
          { '@id': ns + '44TN-P1S0', 'skos:prefLabel': { 'eng': 'image' } },
          { '@id': ns + '69ZZ-2KGX', 'skos:prefLabel': { 'eng': 'text' } },
          { '@id': ns + 'GXS7-ENXJ', 'skos:prefLabel': { 'eng': 'collection' } },
          { '@id': ns + 'B0Y6-GYT8', 'skos:prefLabel': { 'eng': 'video' } },
          { '@id': ns + '7AVS-Y482', 'skos:prefLabel': { 'eng': 'data' } },
          { '@id': ns + '8YB5-1M0J', 'skos:prefLabel': { 'eng': 'sound' } },
          { '@id': ns + '8MY0-BQDQ', 'skos:prefLabel': { 'eng': 'container' } },
          { '@id': ns + 'T8GH-F4V8', 'skos:prefLabel': { 'eng': 'resource' } }
        ],
        loaded: true
      },
      'resourcetypenocontainer': {
        terms: [
          { '@id': ns + '44TN-P1S0', 'skos:prefLabel': { 'eng': 'image' } },
          { '@id': ns + '69ZZ-2KGX', 'skos:prefLabel': { 'eng': 'text' } },
          { '@id': ns + 'GXS7-ENXJ', 'skos:prefLabel': { 'eng': 'collection' } },
          { '@id': ns + 'B0Y6-GYT8', 'skos:prefLabel': { 'eng': 'video' } },
          { '@id': ns + '7AVS-Y482', 'skos:prefLabel': { 'eng': 'data' } },
          { '@id': ns + '8YB5-1M0J', 'skos:prefLabel': { 'eng': 'sound' } },
          { '@id': ns + 'T8GH-F4V8', 'skos:prefLabel': { 'eng': 'resource' } }
        ],
        loaded: true
      },
      'genre': {
        terms: [
          { '@id': ns + '9E94-E3F8', 'skos:prefLabel': { 'eng': 'Diplomarbeit' } },
          { '@id': ns + 'P2YP-BMND', 'skos:prefLabel': { 'eng': 'Masterarbeit' } },
          { '@id': ns + '1PHE-7VMS', 'skos:prefLabel': { 'eng': 'Dissertation' } },
          { '@id': ns + 'ST05-F6SP', 'skos:prefLabel': { 'eng': 'Magisterarbeit' } },
          { '@id': ns + '9ZSV-CVJH', 'skos:prefLabel': { 'eng': 'Habilitation' } },
          { '@id': ns + 'H1TF-SDX1', 'skos:prefLabel': { 'eng': 'Master-Thesis (ULG)' } },
          { '@id': ns + 'QNV1-N1EC', 'skos:prefLabel': { 'eng': 'action' } },
          { '@id': ns + '31DA-295K', 'skos:prefLabel': { 'eng': 'anime' } },
          { '@id': ns + 'DB5C-1Y4H', 'skos:prefLabel': { 'eng': 'biopic' } },
          { '@id': ns + 'MKKZ-BH2Q', 'skos:prefLabel': { 'eng': 'discussion' } },
          { '@id': ns + 'WVGH-KT47', 'skos:prefLabel': { 'eng': 'documentary film' } },
          { '@id': ns + 'XFDY-E13E', 'skos:prefLabel': { 'eng': 'drama' } },
          { '@id': ns + 'GZQE-YK3K', 'skos:prefLabel': { 'eng': 'fantasy' } },
          { '@id': ns + 'KM7A-FYPP', 'skos:prefLabel': { 'eng': 'television film' } },
          { '@id': ns + 'MN1Y-YFCF', 'skos:prefLabel': { 'eng': 'historical film' } },
          { '@id': ns + 'G2VQ-GEEK', 'skos:prefLabel': { 'eng': 'horror' } },
          { '@id': ns + 'GFM4-2J48', 'skos:prefLabel': { 'eng': 'comedy' } },
          { '@id': ns + 'NQVM-6B2Y', 'skos:prefLabel': { 'eng': 'crime' } },
          { '@id': ns + 'BPAJ-NQ8N', 'skos:prefLabel': { 'eng': 'short film' } },
          { '@id': ns + 'AHWA-YKFH', 'skos:prefLabel': { 'eng': 'romance film' } },
          { '@id': ns + '7RZF-5216', 'skos:prefLabel': { 'eng': 'musical' } },
          { '@id': ns + 'A1B4-K5MK', 'skos:prefLabel': { 'eng': 'newscast' } },
          { '@id': ns + '8QDK-T11S', 'skos:prefLabel': { 'eng': 'opera' } },
          { '@id': ns + 'B4R8-Z419', 'skos:prefLabel': { 'eng': 'romance' } },
          { '@id': ns + 'XZ5S-JEJ5', 'skos:prefLabel': { 'eng': 'satire' } },
          { '@id': ns + 'YV6T-SWAF', 'skos:prefLabel': { 'eng': 'science fiction' } },
          { '@id': ns + 'A8HT-N1QB', 'skos:prefLabel': { 'eng': 'series' } },
          { '@id': ns + '1VZT-KE1S', 'skos:prefLabel': { 'eng': 'thriller' } },
          { '@id': ns + 'PCK6-NYPG', 'skos:prefLabel': { 'eng': 'tragicomedy' } },
          { '@id': ns + '2PV5-5V2H', 'skos:prefLabel': { 'eng': 'entertainment' } },
          { '@id': ns + 'G7EY-YXQR', 'skos:prefLabel': { 'eng': 'adventure' } },
          { '@id': ns + 'W2SK-Q08A', 'skos:prefLabel': { 'eng': 'animation' } },
          { '@id': ns + 'QHJ1-PVEB', 'skos:prefLabel': { 'eng': 'family' } },
          { '@id': ns + 'D8B5-D0YT', 'skos:prefLabel': { 'eng': 'mystery' } },
          { '@id': ns + 'R8VJ-TMTB', 'skos:prefLabel': { 'eng': 'war' } },
          { '@id': ns + 'WZMQ-2NG6', 'skos:prefLabel': { 'eng': 'western' } }
        ],
        loaded: true
      },
      'thesisgenre': {
        terms: [
          { '@id': ns + '9E94-E3F8', 'skos:prefLabel': { 'eng': 'Diplomarbeit' } },
          { '@id': ns + 'P2YP-BMND', 'skos:prefLabel': { 'eng': 'Masterarbeit' } },
          { '@id': ns + '1PHE-7VMS', 'skos:prefLabel': { 'eng': 'Dissertation' } },
          { '@id': ns + 'ST05-F6SP', 'skos:prefLabel': { 'eng': 'Magisterarbeit' } },
          { '@id': ns + '9ZSV-CVJH', 'skos:prefLabel': { 'eng': 'Habilitation' } },
          { '@id': ns + 'H1TF-SDX1', 'skos:prefLabel': { 'eng': 'Master-Thesis (ULG)' } }
        ],
        loaded: true
      },
      'moviegenre': {
        terms: [
          { '@id': ns + 'QNV1-N1EC', 'skos:prefLabel': { 'eng': 'action' } },
          { '@id': ns + '31DA-295K', 'skos:prefLabel': { 'eng': 'anime' } },
          { '@id': ns + 'DB5C-1Y4H', 'skos:prefLabel': { 'eng': 'biopic' } },
          { '@id': ns + 'MKKZ-BH2Q', 'skos:prefLabel': { 'eng': 'discussion' } },
          { '@id': ns + 'WVGH-KT47', 'skos:prefLabel': { 'eng': 'documentary film' } },
          { '@id': ns + 'XFDY-E13E', 'skos:prefLabel': { 'eng': 'drama' } },
          { '@id': ns + 'GZQE-YK3K', 'skos:prefLabel': { 'eng': 'fantasy' } },
          { '@id': ns + 'KM7A-FYPP', 'skos:prefLabel': { 'eng': 'television film' } },
          { '@id': ns + 'MN1Y-YFCF', 'skos:prefLabel': { 'eng': 'historical film' } },
          { '@id': ns + 'G2VQ-GEEK', 'skos:prefLabel': { 'eng': 'horror' } },
          { '@id': ns + 'GFM4-2J48', 'skos:prefLabel': { 'eng': 'comedy' } },
          { '@id': ns + 'NQVM-6B2Y', 'skos:prefLabel': { 'eng': 'crime' } },
          { '@id': ns + 'BPAJ-NQ8N', 'skos:prefLabel': { 'eng': 'short film' } },
          { '@id': ns + 'AHWA-YKFH', 'skos:prefLabel': { 'eng': 'romance film' } },
          { '@id': ns + '7RZF-5216', 'skos:prefLabel': { 'eng': 'musical' } },
          { '@id': ns + 'A1B4-K5MK', 'skos:prefLabel': { 'eng': 'newscast' } },
          { '@id': ns + '8QDK-T11S', 'skos:prefLabel': { 'eng': 'opera' } },
          { '@id': ns + 'B4R8-Z419', 'skos:prefLabel': { 'eng': 'romance' } },
          { '@id': ns + 'XZ5S-JEJ5', 'skos:prefLabel': { 'eng': 'satire' } },
          { '@id': ns + 'YV6T-SWAF', 'skos:prefLabel': { 'eng': 'science fiction' } },
          { '@id': ns + 'A8HT-N1QB', 'skos:prefLabel': { 'eng': 'series' } },
          { '@id': ns + '1VZT-KE1S', 'skos:prefLabel': { 'eng': 'thriller' } },
          { '@id': ns + 'PCK6-NYPG', 'skos:prefLabel': { 'eng': 'tragicomedy' } },
          { '@id': ns + '2PV5-5V2H', 'skos:prefLabel': { 'eng': 'entertainment' } },
          { '@id': ns + 'G7EY-YXQR', 'skos:prefLabel': { 'eng': 'adventure' } },
          { '@id': ns + 'W2SK-Q08A', 'skos:prefLabel': { 'eng': 'animation' } },
          { '@id': ns + 'QHJ1-PVEB', 'skos:prefLabel': { 'eng': 'family' } },
          { '@id': ns + 'D8B5-D0YT', 'skos:prefLabel': { 'eng': 'mystery' } },
          { '@id': ns + 'R8VJ-TMTB', 'skos:prefLabel': { 'eng': 'war' } },
          { '@id': ns + 'WZMQ-2NG6', 'skos:prefLabel': { 'eng': 'western' } }
        ],
        loaded: true
      },
      'objecttypeuwm': {
        terms: [
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1552257', 'skos:prefLabel': { 'eng': 'Book', 'deu': 'Buch' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1556244', 'skos:prefLabel': { 'eng': 'Patent', 'deu': 'Patent' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1556237', 'skos:prefLabel': { 'eng': 'Conference Object', 'deu': 'Conference Object' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1552259', 'skos:prefLabel': { 'eng': 'Multimedia', 'deu': 'Multimedia' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1552260', 'skos:prefLabel': { 'eng': 'other', 'deu': 'sonstige' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1742', 'skos:prefLabel': { 'eng': 'Dissertation', 'deu': 'Dissertation' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1552261', 'skos:prefLabel': { 'eng': 'Lecture series (one person)', 'deu': 'Vortragsserie (eine Person)' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1552253', 'skos:prefLabel': { 'eng': 'Article', 'deu': 'Artikel in Zeitschrift' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1743', 'skos:prefLabel': { 'eng': 'Professorial Dissertation', 'deu': 'Habilitationsschrift' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1556239', 'skos:prefLabel': { 'eng': 'Working Paper', 'deu': 'Working Paper' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1556236', 'skos:prefLabel': { 'eng': 'Review', 'deu': 'Review' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1556242', 'skos:prefLabel': { 'eng': 'Annotation', 'deu': 'Annotation' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1557090', 'skos:prefLabel': { 'eng': 'Research Data', 'deu': 'Forschungsdaten' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1739', 'skos:prefLabel': { 'eng': 'Master\'s Dissertation', 'deu': 'Masterarbeit' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1556235', 'skos:prefLabel': { 'eng': 'Book Part', 'deu': 'Book Part' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1740', 'skos:prefLabel': { 'eng': 'Diploma Dissertation', 'deu': 'Diplomarbeit' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1556240', 'skos:prefLabel': { 'eng': 'Preprint', 'deu': 'Preprint' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1552258', 'skos:prefLabel': { 'eng': 'Theses', 'deu': 'Hochschulschrift' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1741', 'skos:prefLabel': { 'eng': 'Master\'s (Austria) Dissertation', 'deu': 'Magisterarbeit' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1738', 'skos:prefLabel': { 'eng': 'Baccalaureate Dissertation', 'deu': 'Bakkalaureatsarbeit' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1552262', 'skos:prefLabel': { 'eng': 'Lecture', 'deu': 'Vortrag' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1556241', 'skos:prefLabel': { 'eng': 'Report', 'deu': 'Report' } },
          { '@id': 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_17/1552263', 'skos:prefLabel': { 'eng': 'Article in collected edition', 'deu': 'Beitrag im Sammelwerk' } }
        ],
        loaded: true
      },
      'objecttype': {
        terms: [
          { '@id': ns + '9E94-E3F8', 'skos:prefLabel': { 'eng': 'Diplomarbeit' } },
          { '@id': ns + 'P2YP-BMND', 'skos:prefLabel': { 'eng': 'Masterarbeit' } },
          { '@id': ns + '1PHE-7VMS', 'skos:prefLabel': { 'eng': 'Dissertation' } },
          { '@id': ns + 'ST05-F6SP', 'skos:prefLabel': { 'eng': 'Magisterarbeit' } },
          { '@id': ns + '9ZSV-CVJH', 'skos:prefLabel': { 'eng': 'Habilitation' } },
          { '@id': ns + 'H1TF-SDX1', 'skos:prefLabel': { 'eng': 'Master-Thesis (ULG)' } },
          { '@id': ns + '985A-GCQJ', 'skos:prefLabel': { 'eng': 'album cover', 'deu': 'Albumcover' } },
          { '@id': ns + 'N35H-PDEE', 'skos:prefLabel': { 'eng': 'annotation', 'deu': 'Anmerkung' } },
          { '@id': ns + '8EBX-CA9X', 'skos:prefLabel': { 'eng': 'annual report', 'deu': 'Jahresbericht' } },
          { '@id': ns + '2WRQ-GSE9', 'skos:prefLabel': { 'eng': 'arrangement (music)', 'deu': 'Arrangement (Musik)' } },
          { '@id': ns + '9J46-2X9E', 'skos:prefLabel': { 'eng': 'atlas', 'deu': 'Atlas' } },
          { '@id': ns + '47QB-8QF1', 'skos:prefLabel': { 'eng': 'book', 'deu': 'Buch' } },
          { '@id': ns + 'XA52-09WA', 'skos:prefLabel': { 'eng': 'book part', 'deu': 'Buchkapitel' } },
          { '@id': ns + 'VP4W-DQ1P', 'skos:prefLabel': { 'eng': 'book review', 'deu': 'Buchrezension' } },
          { '@id': ns + '62RJ-SFV2', 'skos:prefLabel': { 'eng': 'cartographic material', 'deu': 'kartographisches Material' } },
          { '@id': ns + 'QKDF-E5HA', 'skos:prefLabel': { 'eng': 'conference object', 'deu': 'Konferenzveröffentlichung' } },
          { '@id': ns + 'MF25-FDGW', 'skos:prefLabel': { 'eng': 'contribution to journal', 'deu': 'Zeitschriftenbeitrag' } },
          { '@id': ns + 'CEET-8C4S', 'skos:prefLabel': { 'eng': 'cover', 'deu': 'Abdeckung' } },
          { '@id': ns + 'CPVB-YXG6', 'skos:prefLabel': { 'eng': 'cultural artifact', 'deu': 'Kulturartefakt' } },
          { '@id': ns + 'W2Z3-3YA6', 'skos:prefLabel': { 'eng': 'data management plan', 'deu': 'Datenmanagementplan' } },
          { '@id': ns + 'KW6N-2VTP', 'skos:prefLabel': { 'eng': 'dataset', 'deu': 'Dataset' } },
          { '@id': ns + 'A9K1-3WQA', 'skos:prefLabel': { 'eng': 'diary', 'deu': 'Tagebuch' } },
          { '@id': ns + '85QM-7TZ3', 'skos:prefLabel': { 'eng': 'drawing', 'deu': 'Zeichnung' } },
          { '@id': ns + 'QXRQ-Z2PJ', 'skos:prefLabel': { 'eng': 'internal report', 'deu': 'interner Bericht' } },
          { '@id': ns + '8KGA-CH97', 'skos:prefLabel': { 'eng': 'interview', 'deu': 'Interview' } },
          { '@id': ns + 'VKA6-9XTY', 'skos:prefLabel': { 'eng': 'journal article', 'deu': 'Wissenschaftlicher Artikel' } },
          { '@id': ns + 'YA8R-1M0D', 'skos:prefLabel': { 'eng': 'learning object', 'deu': 'Lernobjekt' } },
          { '@id': ns + 'F4JN-ZST0', 'skos:prefLabel': { 'eng': 'lecture', 'deu': 'Vortrag' } },
          { '@id': ns + 'GBWA-JJP8', 'skos:prefLabel': { 'eng': 'letter (correspondence)', 'deu': 'Brief' } },
          { '@id': ns + 'EHPQ-XYA3', 'skos:prefLabel': { 'eng': 'magazine', 'deu': 'Informationszeitschrift' } },
          { '@id': ns + 'KMRH-NFR9', 'skos:prefLabel': { 'eng': 'manuscript', 'deu': 'Manuskript' } },
          { '@id': ns + 'A52A-CWMM', 'skos:prefLabel': { 'eng': 'map', 'deu': 'Karte' } },
          { '@id': ns + 'MCN9-1NSA', 'skos:prefLabel': { 'eng': 'memorandum', 'deu': 'Memorandum' } },
          { '@id': ns + 'M789-K5E0', 'skos:prefLabel': { 'eng': 'music album', 'deu': 'Musikalbum' } },
          { '@id': ns + 'EWZ9-3MPH', 'skos:prefLabel': { 'eng': 'musical composition', 'deu': 'musikalische Komposition' } },
          { '@id': ns + '8A6X-FKB1', 'skos:prefLabel': { 'eng': 'musical notation', 'deu': 'Musiknotation' } },
          { '@id': ns + '9W35-5Q94', 'skos:prefLabel': { 'eng': 'negative', 'deu': 'Negativ' } },
          { '@id': ns + 'DCHD-W3GM', 'skos:prefLabel': { 'eng': 'newspaper', 'deu': 'Zeitung' } },
          { '@id': ns + 'CJJG-VKRQ', 'skos:prefLabel': { 'eng': 'newspaper article', 'deu': 'Zeitungsartikel' } },
          { '@id': ns + 'PYRE-RAWJ', 'skos:prefLabel': { 'eng': 'other', 'deu': 'sonstige' } },
          { '@id': ns + '6QRG-9GN2', 'skos:prefLabel': { 'eng': 'other type of report', 'deu': 'Sonstiger Bericht' } },
          { '@id': ns + 'WWS3-0ACP', 'skos:prefLabel': { 'eng': 'painting', 'deu': 'Malerei' } },
          { '@id': ns + 'GY3Z-50FT', 'skos:prefLabel': { 'eng': 'periodical', 'deu': 'Periodikum' } },
          { '@id': ns + '7CAB-P987', 'skos:prefLabel': { 'eng': 'photograph', 'deu': 'Fotografie' } },
          { '@id': ns + 'R4W3-ZQ76', 'skos:prefLabel': { 'eng': 'picture', 'deu': 'Bild' } },
          { '@id': ns + 'JF85-NYRJ', 'skos:prefLabel': { 'eng': 'podcast', 'deu': 'Podcast' } },
          { '@id': ns + 'XWWK-533P', 'skos:prefLabel': { 'eng': 'policy report', 'deu': 'politischer Bericht' } },
          { '@id': ns + 'Q4Q5-3554', 'skos:prefLabel': { 'eng': 'postcard', 'deu': 'Postkarte' } },
          { '@id': ns + '6EFK-BRQD', 'skos:prefLabel': { 'eng': 'poster', 'deu': 'Plakat' } },
          { '@id': ns + 'T023-BGTD', 'skos:prefLabel': { 'eng': 'preprint', 'deu': 'Preprint' } },
          { '@id': ns + '7WYH-AZ8C', 'skos:prefLabel': { 'eng': 'print', 'deu': 'druckgraphisches Blatt' } },
          { '@id': ns + 'T8PK-GADB', 'skos:prefLabel': { 'eng': 'project deliverable', 'deu': 'Projektergebnis' } },
          { '@id': ns + 'MZ2Q-R099', 'skos:prefLabel': { 'eng': 'questionnaire', 'deu': 'Fragebogen' } },
          { '@id': ns + 'JMAV-7F3R', 'skos:prefLabel': { 'eng': 'report', 'deu': 'Bericht' } },
          { '@id': ns + 'PHQ7-BGFA', 'skos:prefLabel': { 'eng': 'report part', 'deu': 'Teilbericht' } },
          { '@id': ns + 'APV5-CJSF', 'skos:prefLabel': { 'eng': 'report to funding agency', 'deu': 'Bericht an Förderorganisation' } },
          { '@id': ns + '7J0J-HC61', 'skos:prefLabel': { 'eng': 'research report', 'deu': 'Forschungsbericht' } },
          { '@id': ns + 'VM3E-HXE6', 'skos:prefLabel': { 'eng': 'research software', 'deu': 'Forschungssoftware' } },
          { '@id': ns + 'JJKV-B1CG', 'skos:prefLabel': { 'eng': 'review', 'deu': 'Rezension' } },
          { '@id': ns + 'XTVH-3MG3', 'skos:prefLabel': { 'eng': 'score', 'deu': 'Partitur' } },
          { '@id': ns + '21HZ-XP29', 'skos:prefLabel': { 'eng': 'sculpture', 'deu': 'Skulptur' } },
          { '@id': ns + '431H-5YSA', 'skos:prefLabel': { 'eng': 'slide', 'deu': 'Diapositiv' } },
          { '@id': ns + '6KMM-SD3M', 'skos:prefLabel': { 'eng': 'dianegative', 'deu': 'Dianegativ' } },
          { '@id': ns + '622D-CM27', 'skos:prefLabel': { 'eng': 'software', 'deu': 'Software' } },
          { '@id': ns + 'DF69-TVE8', 'skos:prefLabel': { 'eng': 'technical report', 'deu': 'technischer Bericht' } },
          { '@id': ns + '6FG3-514E', 'skos:prefLabel': { 'eng': 'transcript', 'deu': 'Transkript' } },
          { '@id': ns + 'QM0R-ZTAA', 'skos:prefLabel': { 'eng': 'wall chart', 'deu': 'Wandtafel' } },
          { '@id': ns + 'R1WF-V45Y', 'skos:prefLabel': { 'eng': 'website', 'deu': 'Website' } },
          { '@id': ns + '489N-Y6VX', 'skos:prefLabel': { 'eng': 'working paper', 'deu': 'Arbeitspapier' } },
          { '@id': ns + 'HARH-6R3C', 'skos:prefLabel': { 'eng': 'yearbook', 'deu': 'Jahrbuch' } },
          { '@id': ns + 'C36Q-N42M', 'skos:prefLabel': { 'eng': 'lantern slide', 'deu': 'Glasplattendia' } }
        ],
        loaded: true
      },
      'irobjecttype': {
        terms: [
          { '@id': ns + 'VKA6-9XTY', 'skos:prefLabel': { 'eng': 'journal article' }, 'skos:definition': { 'deu': 'Ein Artikel zu einem bestimmten Thema, der im Heft einer Zeitschrift veröffentlicht wurde', 'eng': 'An article on a particular topic and published in a journal issue.' } },
          { '@id': ns + 'T023-BGTD', 'skos:prefLabel': { 'eng': 'preprint' }, 'skos:definition': { 'eng': 'Pre-print describes the first draft of the article - before peer-review, even before any contact with a publisher. This use is common amongst academics for whom the key modification of an article is the peer-review process. Another use of the term pre-print is for the finished article, reviewed and amended, ready and accepted for publication - but separate from the version that is type-set or formatted by the publisher. This use is more common amongst publishers, for whom the final and significant stage of modification to an article is the arrangement of the material for putting to print.' } },
          { '@id': ns + '489N-Y6VX', 'skos:prefLabel': { 'eng': 'working paper' }, 'skos:definition': { 'eng': 'An unpublished paper, usually circulated privately among a small group of peers, to provide information or with a request for comments or editorial improvement.' } },
          { '@id': ns + 'JMAV-7F3R', 'skos:prefLabel': { 'eng': 'report' }, 'skos:definition': { 'deu': 'Ein Bericht ist eine separat veröffentlichte Aufzeichnung von Forschungsergebnissen, noch laufender Forschung oder anderen technischen Ergebnissen, die normalerweise eine Berichtsnummer und manchmal eine von den Fördergebern zugewiesene Projektnummer tragen. Außerdem eine offizielle Aufzeichnung der Aktivitäten eines Ausschusses oder eines Unternehmens, der Bericht einer Regierungsbehörde oder eine Untersuchung durch eine Agentur, ob veröffentlicht oder privat, die normalerweise freiwillig oder unter einem Mandat archiviert oder einer höheren Behörde vorgelegt wird. Im allgemeineren Sinne jede formelle Darstellung von Fakten oder Informationen in Bezug auf ein bestimmtes Ereignis oder Phänomen, die manchmal in regelmäßigen Abständen erfolgt.', 'eng': 'A report is a separately published record of research findings, research still in progress, or other technical findings, usually bearing a report number and sometimes a grant number assigned by the funding agency. Also, an official record of the activities of a committee or corporate entity, the proceedings of a government body, or an investigation by an agency, whether published or private, usually archived or submitted to a higher authority, voluntarily or under mandate. In a more general sense, any formal account of facts or information related to a specific event or phenomenon, sometimes given at regular intervals.' } },
          { '@id': ns + 'JJKV-B1CG', 'skos:prefLabel': { 'eng': 'review' }, 'skos:definition': { 'deu': 'Eine Rezension oder ein Gutachten der veröffentlichten oder gespielten Werke anderer (z. B. Bücher, Filme, Tonaufnahmen, Theater usw.).', 'eng': 'A review of others\' published or performed works (e.g., books, films, sound recordings, theater, etc.).' } },
          { '@id': ns + 'MF25-FDGW', 'skos:prefLabel': { 'eng': 'contribution to journal' }, 'skos:definition': { 'eng': 'A contribution to a journal denotes a work published in a journal. If applicable sub-terms should be chosen.' } },
          { '@id': ns + '47QB-8QF1', 'skos:prefLabel': { 'eng': 'book' }, 'skos:definition': { 'eng': 'Items comprising a collection of leaves of paper, parchment, wood, stiffened textile, ivory, metal tablets, or other flat material, that are blank, written on, or printed, and are strung or bound together in a volume.' } },
          { '@id': ns + 'XA52-09WA', 'skos:prefLabel': { 'eng': 'book part' }, 'skos:definition': { 'eng': 'A defined chapter or section of a book, usually with a separate title or number.' } },
          { '@id': ns + '1PHE-7VMS', 'skos:prefLabel': { 'eng': 'dissertation' }, 'skos:definition': { 'eng': 'dissertation' } },
          { '@id': ns + 'QKDF-E5HA', 'skos:prefLabel': { 'eng': 'conference object' }, 'skos:definition': { 'eng': 'All kind of digital resources contributed to a conference, like conference presentation (slides), conference report, conference lecture, abstracts, demonstrations.' } },
          { '@id': ns + 'F4JN-ZST0', 'skos:prefLabel': { 'eng': 'lecture' }, 'skos:definition': { 'eng': 'Expositions of a given subject delivered before an audience or class, especially for the purposes of instruction.' } },
          { '@id': ns + 'KW6N-2VTP', 'skos:prefLabel': { 'eng': 'dataset' }, 'skos:definition': { 'eng': 'A collection of related facts and data encoded in a defined structure.' } },
          { '@id': ns + 'N35H-PDEE', 'skos:prefLabel': { 'eng': 'annotation' }, 'skos:definition': { 'eng': 'An annotation in the sense of a legal note is a legally explanatory comment on a decision handed down by a court or arbitral tribunal.' } },
          { '@id': ns + 'PYRE-RAWJ', 'skos:prefLabel': { 'eng': 'other' }, 'skos:definition': { 'deu': 'Ein Objekttyp, der in keinem Konzept dieses Vokabulars explizit angesprochen wird.', 'eng': 'An object type not explicitly addressed in any concept in this vocabulary.' } }
        ],
        loaded: true
      },
      'irobjecttypearticle': {
        terms: [
          { '@id': ns + 'VKA6-9XTY', 'skos:prefLabel': { 'eng': 'journal article' }, 'skos:definition': { 'deu': 'Ein Artikel zu einem bestimmten Thema, der im Heft einer Zeitschrift veröffentlicht wurde', 'eng': 'An article on a particular topic and published in a journal issue.' } },
          { '@id': ns + 'JMAV-7F3R', 'skos:prefLabel': { 'eng': 'report' }, 'skos:definition': { 'deu': 'Ein Bericht ist eine separat veröffentlichte Aufzeichnung von Forschungsergebnissen, noch laufender Forschung oder anderen technischen Ergebnissen, die normalerweise eine Berichtsnummer und manchmal eine von den Fördergebern zugewiesene Projektnummer tragen. Außerdem eine offizielle Aufzeichnung der Aktivitäten eines Ausschusses oder eines Unternehmens, der Bericht einer Regierungsbehörde oder eine Untersuchung durch eine Agentur, ob veröffentlicht oder privat, die normalerweise freiwillig oder unter einem Mandat archiviert oder einer höheren Behörde vorgelegt wird. Im allgemeineren Sinne jede formelle Darstellung von Fakten oder Informationen in Bezug auf ein bestimmtes Ereignis oder Phänomen, die manchmal in regelmäßigen Abständen erfolgt.', 'eng': 'A report is a separately published record of research findings, research still in progress, or other technical findings, usually bearing a report number and sometimes a grant number assigned by the funding agency. Also, an official record of the activities of a committee or corporate entity, the proceedings of a government body, or an investigation by an agency, whether published or private, usually archived or submitted to a higher authority, voluntarily or under mandate. In a more general sense, any formal account of facts or information related to a specific event or phenomenon, sometimes given at regular intervals.' } },
          { '@id': ns + 'JJKV-B1CG', 'skos:prefLabel': { 'eng': 'review' }, 'skos:definition': { 'deu': 'Eine Rezension oder ein Gutachten der veröffentlichten oder gespielten Werke anderer (z. B. Bücher, Filme, Tonaufnahmen, Theater usw.).', 'eng': 'A review of others\' published or performed works (e.g., books, films, sound recordings, theater, etc.).' } },
          { '@id': ns + 'PYRE-RAWJ', 'skos:prefLabel': { 'eng': 'other' }, 'skos:definition': { 'deu': 'Ein Objekttyp, der in keinem Konzept dieses Vokabulars explizit angesprochen wird.', 'eng': 'An object type not explicitly addressed in any concept in this vocabulary.' } }
        ],
        loaded: true
      },
      'accessright': {
        terms: [
          { '@id': ns + 'QW5R-NG4J', 'skos:prefLabel': { 'eng': 'open access' }, 'skos:definition': { 'eng': 'Open access refers to a resource that is immediately and permanently online, and free for all on the Web, without financial and technical barriers.The resource is either stored in the repository or referenced to an external journal or trustworthy archive.' } },
          { '@id': ns + 'AVFC-ZZSZ', 'skos:prefLabel': { 'eng': 'embargoed access' }, 'skos:definition': { 'eng': 'Embargoed access refers to a resource that is metadata only access until released for open access on a certain date. Embargoes can be required by publishers and funders policies, or set by the author (e.g such as in the case of theses and dissertations).' } },
          { '@id': ns + 'KC3K-CCGM', 'skos:prefLabel': { 'eng': 'restricted access' }, 'skos:definition': { 'eng': 'Restricted access refers to a resource that is available in a system but with some type of restriction for full open access. This type of access can occur in a number of different situations. Some examples are described below: The user must log-in to the system in order to access the resource The user must send an email to the author or system administrator to access the resource Access to the resource is restricted to a specific community (e.g. limited to a university community).' } },
          { '@id': ns + 'QNGE-V02H', 'skos:prefLabel': { 'eng': 'metadata only access' }, 'skos:definition': { 'eng': 'Metadata only access refers to a resource in which access is limited to metadata only. The resource itself is described by the metadata, but neither is directly available through the system or platform nor can be referenced to an open access copy in an external journal or trustworthy archive.' } }
        ],
        loaded: true
      },
      'iraccessright': {
        terms: [
          { '@id': ns + 'QW5R-NG4J', 'skos:prefLabel': { 'eng': 'open access' }, 'skos:definition': { 'deu': 'Der Zugriff auf die Ressource wird ohne Einschränkungen angeboten.', 'eng': 'Access to the resource is offered without any restrictions.' } },
          { '@id': ns + 'AVFC-ZZSZ', 'skos:prefLabel': { 'eng': 'embargoed access' }, 'skos:definition': { 'deu': 'Auf die Ressource kann erst zu einem bestimmten Zeitpunkt zugegriffen werden, an dem sie für die Öffentlichkeit freigegeben wird. Um eine Kopie kann per E-Mail angefragt werden.', 'eng': 'The resource cannot be accessed until a given date on which it will be released for open access. A copy can be requested via e-mail.' } },
          { '@id': ns + 'KC3K-CCGM', 'skos:prefLabel': { 'eng': 'restricted access' }, 'skos:definition': { 'deu': 'Der Zugang zu Volltexten und Materialien ist auf Personen oder Personengruppen beschränkt, die mit der Universität verbunden sind. Detaillierte Regelungen dazu können mit uns vereinbart werden. Um eine Kopie kann per E-Mail angefragt werden.', 'eng': 'Access to full texts and materials is restricted to persons or groups of persons affiliated with the University that we can specify as per your instructions. Others may request a copy via e-mail.' } },
          { '@id': ns + 'QNGE-V02H', 'skos:prefLabel': { 'eng': 'metadata only access' }, 'skos:definition': { 'deu': 'Der Zugriff auf Volltexte und Materialien ist Ihnen vorbehalten.', 'eng': 'Access to full texts and materials is restricted to you.' } }
        ],
        loaded: true
      },
      'versiontypes': {
        terms: [
          { '@id': ns + 'TV31-080M', 'skos:notation': ['AO'], 'skos:prefLabel': { 'eng': 'author\'s original' }, 'skos:definition': { 'deu': 'Die Version eines Textes, deren Qualität Autor*innen für ausreichend befinden, um ihn einem förmlichen Peer Review-Prozess unterziehen zu lassen. Autor*innen übernehmen die volle Verantwortung für den Text. Kann eine Versionsnummer oder einen Datumsstempel haben. Inhalt und Layout werden von den Autor*innen festgelegt.', 'eng': 'Any version of a resource that is considered by the author to be of sufficient quality to be submitted for formal peer review by a second party. The author accepts full responsibility for the resource . May have a version number or date stamp. Content and layout as set out by the author.' } },
          { '@id': ns + 'JTD4-R26P', 'skos:notation': ['SMUR'], 'skos:prefLabel': { 'eng': 'submitted manuscript under review' }, 'skos:definition': { 'deu': 'Die Version eines Textes, die bereits einer förmlichen Begutachtung seitens eines allgemein anerkannten Publikationsorgans unterzogen wird. Dieses erkennt seine Verantwortung an, für eine objektive Fachbegutachtung zu sorgen, den Autor*innen ein Feedback zu geben und letztendlich die Eignung des Textes für die Veröffentlichung entweder mit  „akzeptiert“ oder „abgelehnt“ zu beurteilen. Kann eine Versionsnummer oder einen Datumsstempel haben. Inhalt und Layout entsprechen den Einreichungsanforderungen des Herausgebers.', 'eng': 'Any version of a resource that is under formal review managed by a socially recognized publishing entity. The entity recognizes its responsibility to provide objective expert review and feedback to the author, and, ultimately, to pass judgment on the fitness of the resource for publication with an “accept” or “reject” decision. May have a version number or date stamp. Content and layout follow publisher’s submission requirements.' } },
          { '@id': ns + 'PHXV-R6B3', 'skos:notation': ['AM'], 'skos:prefLabel': { 'eng': 'accepted version' }, 'skos:definition': { 'deu': 'Die Version eines Textes, die zur Veröffentlichung angenommen wurde. Eine zweite Partei übernimmt die dauerhafte Verantwortung für den Text. Inhalt und Layout entsprechen den Einreichungsanforderungen des Herausgebers.', 'eng': 'The version of a resource that has been accepted for publication. A second party takes permanent responsibility for the resource. Content and layout follow publisher’s submission requirements.' } },
          { '@id': ns + '83ZP-CPP2', 'skos:notation': ['P'], 'skos:prefLabel': { 'eng': 'proof' }, 'skos:definition': { 'deu': 'Die Version eines Textes, die im Rahmen des Veröffentlichungsprozesses erstellt wird. Dies umfasst das korrekturgelesene Manuskript, Korrekturabzüge (d. h. eine gesetzte Version ohne endgültigen Seitenumbruch), Korrekturbögen und überarbeitete Druckfahnen. Einige dieser Versionen können im Wesentlichen dem internen Bearbeitungsablauf vorbehalten sein, andere werden jedoch üblicherweise freigegeben (z. B. an Autor*innen gesendet) und können daher öffentlich werden, obwohl sie dafür nicht autorisiert sind. Der Inhalt wurde gegenüber dem angenommenen Manuskript (Accepted Manuscript) geändert. Layout ist das des Herausgebers.', 'eng': 'A version of a resource that is created as part of the publication process. This includes the copy-edited manuscript, galley proofs (i.e., a typeset version that has not been made up into pages), page proofs, and revised proofs. Some of these versions may remain essentially internal process versions, but others are commonly released from the internal environment (e.g., proofs are sent to authors) and may thus become public, even though they are not authorized to be so. Content has been changed from Accepted Manuscript; layout is the publisher’s.' } },
          { '@id': ns + 'PMR8-3C8D', 'skos:notation': ['VoR'], 'skos:prefLabel': { 'eng': 'version of record (published version)' }, 'skos:definition': { 'deu': 'Die fertige (publizierte) Version eines Textes, die von einer als Herausgeber fungierenden Organisation zur Verfügung gestellt und formell und definitiv als "veröffentlicht" deklariert wurde. Dies schließt eine "vorab" veröffentlichte Version, die förmlich als veröffentlicht bezeichnet ist, auch schon vor der Erstellung eines Zeitschriftenbandes bzw. -heftes und der Zuweisung zugehöriger Metadaten ein, sofern sie über (einen) permanente(n) Identifikator(en) zitierbar ist. Dies schließt keine "Vorab-Version" ein, die noch nicht durch Prozesse „fixiert“ wurde, die noch angewendet werden müssen, wie z. B. das Editieren, Korrekturlesen, Layout und Satz.', 'eng': 'A fixed version of a resource that has been made available by any organization that acts as a publisher by formally and exclusively declaring the resource “published”. This includes any “early release” resource that is formally identified as being published even before the compilation of a volume issue and assignment of associated metadata, as long as it is citable via some permanent identifier(s). This does not include any “early release” resource that has not yet been “fixed” by processes that are still to be applied, such as copy-editing, proof corrections, layout, and typesetting.' } },
          { '@id': ns + 'MT1G-APSB', 'skos:notation': ['CVoR'], 'skos:prefLabel': { 'eng': 'corrected version of record' }, 'skos:definition': { 'deu': 'Eine Version der "publizierten Version" eines Textes, in der Fehler in der "publizierten Version" korrigiert wurden ["Errata" oder "Corrigenda"]. Es kann sich um Fehler von Autor*innen, Herausgeber*innen oder andere Fehler handeln, die im Lauf der Bearbeitung entstanden sind.', 'eng': 'A version of the Version of Record of a resource that has been updated or enhanced by the provision of supplementary material.' } },
          { '@id': ns + 'SSQW-AP1S', 'skos:notation': ['EVoR'], 'skos:prefLabel': { 'eng': 'enhanced version of record' }, 'skos:definition': { 'deu': 'Eine Version der "publizierten Version" eines Textes, die durch Hinzufügen von ergänzendem und/oder zusätzlichem Material auf den aktuellen Stand gebracht bzw. erweitert wurde.', 'eng': 'A version of the Version of Record of a resource that has been updated or enhanced by the provision of supplementary material.' } },
          { '@id': ns + 'KZB5-0F5G', 'skos:notation': ['NA'], 'skos:prefLabel': { 'eng': 'not applicable (or unknown)' }, 'skos:definition': { 'deu': 'Nicht anwendbar (oder unbekannt).', 'eng': 'Not Applicable (or Unknown).' } }
        ],
        loaded: true
      },
      'irfunders': {
        terms: [
          { '@id': ns + 'N3C4-ZVR0', 'skos:prefLabel': { 'eng': 'Austrian Science Fund (FWF)' } },
          { '@id': ns + 'EYN2-KEW2', 'skos:prefLabel': { 'eng': 'Bundesministerium für Bildung, Wissenschaft und Forschung (BMBWF)' } },
          { '@id': ns + '74ZM-RFR6', 'skos:prefLabel': { 'eng': 'European Science Foundation (ESF)' } },
          { '@id': ns + 'RDY6-W6C3', 'skos:prefLabel': { 'eng': 'European Union (all programmes)' } },
          { '@id': ns + 'APPY-SKP2', 'skos:prefLabel': { 'eng': 'Jubiläumsfonds der Österreichischen Nationalbank' } },
          { '@id': ns + 'TF8A-AS8X', 'skos:prefLabel': { 'eng': 'Österreichische Akademie der Wissenschaften (ÖAW)' } },
          { '@id': ns + 'RX5K-E2KX', 'skos:prefLabel': { 'eng': 'Österreichische Forschungsförderungsgesellschaft mbH (FFG)' } },
          { '@id': ns + 'RESE-5QGF', 'skos:prefLabel': { 'eng': 'Österreichische Forschungsgemeinschaft (ÖFG)' } },
          { '@id': ns + 'SN0W-4T4J', 'skos:prefLabel': { 'eng': 'Österreichischer Austauschdienst (OeAD)' } },
          { '@id': ns + 'S9R7-X1M2', 'skos:prefLabel': { 'eng': 'Österreichischer Nationalfonds für Opfer des Nationalsozialismus' } },
          { '@id': ns + 'X4EX-JK51', 'skos:prefLabel': { 'eng': 'University of Vienna' } },
          { '@id': ns + 'XMYF-893X', 'skos:prefLabel': { 'eng': 'Vienna Science and Technology Fund (WWTF)' } },
          { '@id': ns + '6HPQ-MTZV', 'skos:prefLabel': { 'eng': 'Zukunftsfonds der Republik Österreich' } },
          { '@id': 'other', 'skos:prefLabel': { 'eng': 'Other' } }
        ],
        loaded: true
      },
      'funders': {
        terms: [
          { '@id': ns + 'N3C4-ZVR0', 'skos:prefLabel': { 'eng': 'Austrian Science Fund (FWF)' } },
          { '@id': ns + 'EYN2-KEW2', 'skos:prefLabel': { 'eng': 'Bundesministerium für Bildung, Wissenschaft und Forschung (BMBWF)' } },
          { '@id': ns + '74ZM-RFR6', 'skos:prefLabel': { 'eng': 'European Science Foundation (ESF)' } },
          { '@id': ns + 'RDY6-W6C3', 'skos:prefLabel': { 'eng': 'European Union (all programmes)' } },
          { '@id': ns + 'APPY-SKP2', 'skos:prefLabel': { 'eng': 'Jubiläumsfonds der Österreichischen Nationalbank' } },
          { '@id': ns + 'TF8A-AS8X', 'skos:prefLabel': { 'eng': 'Österreichische Akademie der Wissenschaften (ÖAW)' } },
          { '@id': ns + 'RX5K-E2KX', 'skos:prefLabel': { 'eng': 'Österreichische Forschungsförderungsgesellschaft mbH (FFG)' } },
          { '@id': ns + 'RESE-5QGF', 'skos:prefLabel': { 'eng': 'Österreichische Forschungsgemeinschaft (ÖFG)' } },
          { '@id': ns + 'SN0W-4T4J', 'skos:prefLabel': { 'eng': 'Österreichischer Austauschdienst (OeAD)' } },
          { '@id': ns + 'S9R7-X1M2', 'skos:prefLabel': { 'eng': 'Österreichischer Nationalfonds für Opfer des Nationalsozialismus' } },
          { '@id': ns + 'X4EX-JK51', 'skos:prefLabel': { 'eng': 'University of Vienna' } },
          { '@id': ns + 'XMYF-893X', 'skos:prefLabel': { 'eng': 'Vienna Science and Technology Fund (WWTF)' } },
          { '@id': ns + '6HPQ-MTZV', 'skos:prefLabel': { 'eng': 'Zukunftsfonds der Republik Österreich' } }
        ],
        loaded: true
      },
      'technique': {
        terms: [
          { '@id': ns + 'NZ42-TTZT', 'skos:prefLabel': { 'eng': 'black-and-white photography' } },
          { '@id': ns + 'DC1W-JWNP', 'skos:prefLabel': { 'eng': 'color photography' } },
          { '@id': ns + '431H-5YSA', 'skos:prefLabel': { 'eng': 'slide', 'deu': 'Diapositiv' } },
          { '@id': ns + 'VZ88-24TF', 'skos:prefLabel': { 'eng': 'black-and-white slide', 'deu': 'Schwarzweiß-Dia' } },
          { '@id': ns + '96PV-FFAT', 'skos:prefLabel': { 'eng': 'color slide' } },
          { '@id': ns + 'AH0S-F3BV', 'skos:prefLabel': { 'eng': 'black-and-white film' } },
          { '@id': ns + 'K818-FSM5', 'skos:prefLabel': { 'eng': 'color film' } },
          { '@id': ns + '748F-SQW9', 'skos:prefLabel': { 'eng': 'silent film' } },
          { '@id': ns + '1K09-VXQ4', 'skos:prefLabel': { 'eng': 'sound film' } }
        ],
        loaded: true
      },
      'material': {
        terms: [
          { '@id': ns + 'C36Q-N42M', 'skos:prefLabel': { 'eng': 'lantern slide', 'deu': 'Glasplattendia' } },
          { '@id': ns + '431H-5YSA', 'skos:prefLabel': { 'eng': 'slide', 'deu': 'Diapositiv' } },
          { '@id': ns + '6KMM-SD3M', 'skos:prefLabel': { 'eng': 'dianegative', 'deu': 'Dianegativ' } },
          { '@id': ns + 'NWNQ-GW5N', 'skos:prefLabel': { 'eng': 'Dianegativ mit Deckglas', 'deu': 'Dianegativ mit Deckglas' } },
          { '@id': ns + '5418-GWAY', 'skos:prefLabel': { 'eng': 'Diapositiv mit Deckglas', 'deu': 'Diapositiv mit Deckglas' } },
          { '@id': ns + 'HV4N-RC72', 'skos:prefLabel': { 'eng': 'Diapositiv mit Deckglas, dazwischen Folie', 'deu': 'Diapositiv mit Deckglas, dazwischen Folie' } },
          { '@id': ns + 'NQF1-2T8V', 'skos:prefLabel': { 'eng': 'Diapositiv mit Deckglas, Zeichnung auf Papier', 'deu': 'Diapositiv mit Deckglas, Zeichnung auf Papier' } },
          { '@id': ns + '45E3-JTA6', 'skos:prefLabel': { 'eng': 'Diapositiv mit Deckglas, Zeichnung auf Glas', 'deu': 'Diapositiv mit Deckglas, Zeichnung auf Glas' } },
          { '@id': ns + '440Z-1BPF', 'skos:prefLabel': { 'eng': 'Diapositiv mit Zeichnung auf Glas', 'deu': 'Diapositiv mit Zeichnung auf Glas' } },
          { '@id': ns + '2ESS-0GPG', 'skos:prefLabel': { 'eng': 'Diapositiv mit Folie', 'deu': 'Diapositiv mit Folie' } },
          { '@id': ns + '7AS5-4Q5Q', 'skos:prefLabel': { 'eng': 'Diapositiv mit Zeichnung auf Papier', 'deu': 'Diapositiv mit Zeichnung auf Papier' } }
        ],
        loaded: true
      },
      'reproduction': {
        terms: [
          { '@id': ns + 'AYRE-RQAS', 'skos:prefLabel': { 'eng': 'original' } },
          { '@id': ns + 'BD33-7WA2', 'skos:prefLabel': { 'eng': 'copy' } }
        ],
        loaded: true
      },
      'audience': {
        terms: [
          { '@id': ns + 'TEPR-J4EZ', 'skos:prefLabel': { 'eng': 'FSK ab 0 freigegeben' } },
          { '@id': ns + '7ANY-9744', 'skos:prefLabel': { 'eng': 'FSK ab 6 freigegeben' } },
          { '@id': ns + '4DQY-TNPT', 'skos:prefLabel': { 'eng': 'FSK ab 12 freigegeben' } },
          { '@id': ns + 'HSDH-MD0J', 'skos:prefLabel': { 'eng': 'FSK ab 16 freigegeben' } },
          { '@id': ns + 'F2VP-9Z07', 'skos:prefLabel': { 'eng': 'FSK ab 18 freigegeben' } },
          { '@id': ns + 'C2TK-3DTQ', 'skos:prefLabel': { 'eng': 'Freigegeben gemäß §14 JuSchG FSK' } }
        ],
        loaded: true
      },
      'regionalencoding': {
        terms: [
          { '@id': ns + 'AR9M-B9J4', 'skos:prefLabel': { 'eng': '1' } },
          { '@id': ns + '6Z5R-XEG2', 'skos:prefLabel': { 'eng': '2' } },
          { '@id': ns + '2YZZ-TX6M', 'skos:prefLabel': { 'eng': '3' } },
          { '@id': ns + '36BC-K989', 'skos:prefLabel': { 'eng': '4' } },
          { '@id': ns + 'ADS3-D2RC', 'skos:prefLabel': { 'eng': '5' } },
          { '@id': ns + '9NQT-YAJ4', 'skos:prefLabel': { 'eng': '6' } },
          { '@id': ns + 'QN10-XAKZ', 'skos:prefLabel': { 'eng': '7' } },
          { '@id': ns + 'KE1K-8NT7', 'skos:prefLabel': { 'eng': '8' } },
          { '@id': ns + 'GSVQ-6H7P', 'skos:prefLabel': { 'eng': 'A/1' } },
          { '@id': ns + '149W-4F0N', 'skos:prefLabel': { 'eng': 'B/2' } },
          { '@id': ns + 'VHCV-2WY3', 'skos:prefLabel': { 'eng': 'C/3' } },
          { '@id': ns + '3MQF-RDQQ', 'skos:prefLabel': { 'eng': 'region free' } }
        ],
        loaded: true
      },
      'dceformat': {
        terms: [
          { '@id': ns + 'J6JG-69V6', 'skos:prefLabel': { 'eng': '3gp' } },
          { '@id': ns + '3F67-KMTM', 'skos:prefLabel': { 'eng': 'AAC+' } },
          { '@id': ns + '7A81-FXCX', 'skos:prefLabel': { 'eng': 'Barco Auro' } },
          { '@id': ns + 'FRJJ-4376', 'skos:prefLabel': { 'eng': 'DTS' } },
          { '@id': ns + 'EHF7-FEAP', 'skos:prefLabel': { 'eng': 'DTS 96/24' } },
          { '@id': ns + 'T5SX-Z04Y', 'skos:prefLabel': { 'eng': 'DTS Discrete 5.1' } },
          { '@id': ns + '9FGJ-Z8DH', 'skos:prefLabel': { 'eng': 'DTS ES Discrete 6.1' } },
          { '@id': ns + 'ESQT-3YY5', 'skos:prefLabel': { 'eng': 'DTS ES Matrix 6.1' } },
          { '@id': ns + '348K-MZZ6', 'skos:prefLabel': { 'eng': 'DTS HD' } },
          { '@id': ns + 'EN75-Q4HC', 'skos:prefLabel': { 'eng': 'DTS NEO:6' } },
          { '@id': ns + 'T7Q0-M2FS', 'skos:prefLabel': { 'eng': 'DTS++' } },
          { '@id': ns + '28X4-0935', 'skos:prefLabel': { 'eng': 'DTS:X' } },
          { '@id': ns + '3W6M-5MP3', 'skos:prefLabel': { 'eng': 'Datasat' } },
          { '@id': ns + 'MCQ6-HPAH', 'skos:prefLabel': { 'eng': 'Digital Surround 7.1' } },
          { '@id': ns + '8T8J-936P', 'skos:prefLabel': { 'eng': 'Dolby Atmos' } },
          { '@id': ns + '9SHY-VVN6', 'skos:prefLabel': { 'eng': 'Dolby Digital' } },
          { '@id': ns + '61PF-1NEJ', 'skos:prefLabel': { 'eng': 'Dolby Digital 5.1' } },
          { '@id': ns + 'GHEV-3W1J', 'skos:prefLabel': { 'eng': 'Dolby Digital EX' } },
          { '@id': ns + 'VN51-WRAF', 'skos:prefLabel': { 'eng': 'Dolby Digital Plus' } },
          { '@id': ns + '8RFW-88Q3', 'skos:prefLabel': { 'eng': 'Dolby Pro Logic II' } },
          { '@id': ns + '55WB-XQ4P', 'skos:prefLabel': { 'eng': 'Dolby SR-D' } },
          { '@id': ns + '2JPY-C523', 'skos:prefLabel': { 'eng': 'Dolby SR-D-EX' } },
          { '@id': ns + 'XZNA-QKBP', 'skos:prefLabel': { 'eng': 'Dolby Stereo' } },
          { '@id': ns + 'W56N-VX1X', 'skos:prefLabel': { 'eng': 'Dolby Surround' } },
          { '@id': ns + 'DCZS-VZ7X', 'skos:prefLabel': { 'eng': 'Dolby TrueHD' } },
          { '@id': ns + 'SDE9-JMJJ', 'skos:prefLabel': { 'eng': 'Dolby-SR' } },
          { '@id': ns + '1DE8-XDG2', 'skos:prefLabel': { 'eng': 'MPEG-4 ALS' } },
          { '@id': ns + 'K9BD-K8GP', 'skos:prefLabel': { 'eng': 'Mono' } },
          { '@id': ns + '2BCB-S1B5', 'skos:prefLabel': { 'eng': 'SDDS' } },
          { '@id': ns + '7FMD-95WA', 'skos:prefLabel': { 'eng': 'Stereo' } },
          { '@id': ns + 'KCDR-Q08F', 'skos:prefLabel': { 'eng': 'Stereo 2.0' } },
          { '@id': ns + 'DBKT-3BQ3', 'skos:prefLabel': { 'eng': 'Surround 5.1' } },
          { '@id': ns + 'G1KV-MAFP', 'skos:prefLabel': { 'eng': 'VCD' } },
          { '@id': ns + 'RQK2-8156', 'skos:prefLabel': { 'eng': 'aif' } },
          { '@id': ns + '52G8-44YX', 'skos:prefLabel': { 'eng': 'ape' } },
          { '@id': ns + 'C5G1-JQQZ', 'skos:prefLabel': { 'eng': 'asf' } },
          { '@id': ns + 'AFZ7-4AY9', 'skos:prefLabel': { 'eng': 'au' } },
          { '@id': ns + 'KF60-K40F', 'skos:prefLabel': { 'eng': 'avi' } },
          { '@id': ns + '44YA-6HGK', 'skos:prefLabel': { 'eng': 'divx' } },
          { '@id': ns + 'GDTY-V9H4', 'skos:prefLabel': { 'eng': 'dv' } },
          { '@id': ns + 'GW3R-K19G', 'skos:prefLabel': { 'eng': 'evo' } },
          { '@id': ns + 'D3GB-MPSY', 'skos:prefLabel': { 'eng': 'fla' } },
          { '@id': ns + 'E2EJ-277K', 'skos:prefLabel': { 'eng': 'flac' } },
          { '@id': ns + '29PG-5AKN', 'skos:prefLabel': { 'eng': 'flv' } },
          { '@id': ns + '2CRY-PD3C', 'skos:prefLabel': { 'eng': 'ggf' } },
          { '@id': ns + 'KPT0-47XA', 'skos:prefLabel': { 'eng': 'm2ts' } },
          { '@id': ns + 'YK2W-SAFC', 'skos:prefLabel': { 'eng': 'm4a' } },
          { '@id': ns + 'S9PM-AGHF', 'skos:prefLabel': { 'eng': 'mac' } },
          { '@id': ns + '9594-QH49', 'skos:prefLabel': { 'eng': 'mka' } },
          { '@id': ns + 'RRWW-7W5N', 'skos:prefLabel': { 'eng': 'mkv' } },
          { '@id': ns + '15DS-TAGX', 'skos:prefLabel': { 'eng': 'mp3' } },
          { '@id': ns + 'F487-H20C', 'skos:prefLabel': { 'eng': 'mp3HD' } },
          { '@id': ns + 'AFA0-APVK', 'skos:prefLabel': { 'eng': 'mpeg' } },
          { '@id': ns + 'DT3X-PH6D', 'skos:prefLabel': { 'eng': 'mpeg-1' } },
          { '@id': ns + 'B008-MRZD', 'skos:prefLabel': { 'eng': 'mpeg-2' } },
          { '@id': ns + 'PQ4H-JT2Y', 'skos:prefLabel': { 'eng': 'mpeg-4' } },
          { '@id': ns + '26M9-M5MR', 'skos:prefLabel': { 'eng': 'mpg' } },
          { '@id': ns + 'NZKM-SH76', 'skos:prefLabel': { 'eng': 'mts' } },
          { '@id': ns + 'T59Z-PCFE', 'skos:prefLabel': { 'eng': 'mxf' } },
          { '@id': ns + 'TR4G-6P0B', 'skos:prefLabel': { 'eng': 'ogg' } },
          { '@id': ns + '7ZVE-WQQ2', 'skos:prefLabel': { 'eng': 'ra' } },
          { '@id': ns + 'J5QX-S86N', 'skos:prefLabel': { 'eng': 'ram' } },
          { '@id': ns + 'P66F-9ERB', 'skos:prefLabel': { 'eng': 'rm' } },
          { '@id': ns + 'BJDK-FC30', 'skos:prefLabel': { 'eng': 'snd' } },
          { '@id': ns + 'N0QE-B24V', 'skos:prefLabel': { 'eng': 'vob' } },
          { '@id': ns + 'X2ZR-7C1F', 'skos:prefLabel': { 'eng': 'voc' } },
          { '@id': ns + 'QYGZ-K8W4', 'skos:prefLabel': { 'eng': 'wav' } },
          { '@id': ns + '6S1H-S5GF', 'skos:prefLabel': { 'eng': 'webm' } },
          { '@id': ns + '783J-J5PD', 'skos:prefLabel': { 'eng': 'wma' } },
          { '@id': ns + '7B2N-07A7', 'skos:prefLabel': { 'eng': 'wmv' } },
          { '@id': ns + 'VTY6-58WQ', 'skos:prefLabel': { 'eng': 'xvid' } }
        ],
        loaded: true
      },
      'lang_vocab': {
        terms: [
          { '@id': ns + 'KJ67-VB82', 'skos:prefLabel': { 'eng': 'Castilian', 'deu': 'Kastilisch' } },
          { '@id': ns + 'MKXZ-SARM', 'skos:prefLabel': { 'eng': 'Lebanese', 'deu': 'Libanesisch-Arabisch' } }
        ],
        loaded: true
      },
      'lang': {
        terms: [],
        sorted: { deu: [], eng: [] },
        loaded: false
      },
      'orgunits': {
        terms: [],
        tree: [],
        loaded: false,
        linked: false,
        sorted: ''
      },
      'oefos': {
        terms: [],
        tree: [],
        loaded: false,
        sorted: ''
      }
    }
  },
  info: {
    metadataFieldsOverview: [
      {
        title: 'Descriptive metadata',
        open: true,
        fields: [
          {
            title: 'Abstract',
            predicate: 'bf:Summary',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content: 'Summary or abstract of the described resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'In case of textual resources as articles, reviews, etc., you may provide an abstract of the content.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Accession number',
            predicate: 'opaque:cco_accessionNumber',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'The identification number assigned to a particular donation or acquisition of the analogue object.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Enter the identification number assigned to a particular donation or acquisition of the object.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Associated with',
            predicate: 'rdax:P00009',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content: 'The corporate body associated with the object.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Specify the corporate body associated with your resource. <br> You have two options: you can select the value from the drop-down list, or you can click on the diagram icon on the right and navigate the organizational structure of the University of Vienna.',
                  level2: '',
                  level3:
                    'Tracking down people and institutions associated with the resource can be useful to allow reuse, especially if data has restricted access or it is no longer available. These are cases where human intervention is involved (e.g. sending an email to the metadata owner or calling to receive instructions). Fill in the field to provide an explicit contact in the metadata.'
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="https://pid.phaidra.org/univie-org/"> University Vienna Organization Structure </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: 'Required'
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Available language',
            predicate: 'schema:availableLanguage',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'An additional available language someone may use with audio and video resources.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Use this field when your resource can be additionally viewed, played, run, etc., in languages other than the main one.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="http://id.loc.gov/vocabulary/languages"> MARC List for Languages </a> <br> <a href="https://vocab.phaidra.org/vocabulary/WKFZ-VG0C"> Language Phaidra Vocabulary </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Audience',
            predicate: 'dcterms:audience',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'The entity for whom the resource is intended or useful.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Specify the class of target people (e.g. a restriction by age) for whom the object is intended or useful. <br> You can either enter your own value or select it from the controlled list.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="https://vocab.phaidra.org/vocabulary/en/collections/T465-XDJS.html">Audience Phaidra Vocabulary </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Awards',
            predicate: 'bf:awards',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Information on awards associated with the described resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'If existing, you can provide information on an award associated with the described resource.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Carrier type',
            predicate: 'rdau:P60048',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content: 'The format of a storage medium.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'This field expresses the storage medium of the physical source. <br>Select a value from the drop-down list. In case the value you want to select is not in the list, choose <i>Other</i> and notify the metadata administrators.', // NB: there's no "Other" in the list rigtht now
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="https://vocab.phaidra.org/vocabulary/YGE3-S9WD"> Carrier type Phaidra Vocabulary </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Citation',
            predicate: 'cito:cites cito:isCitedBy', // there are 2 predicates here. I didn't know how to encode them
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'A reference to another resource. A citation may be either direct and explicit (as in the reference list of a journal article), indirect (e.g. a citation to a more recent paper by the same research group on the same topic), or implicit (e.g. as in artistic quotations or parodies, or in cases of plagiarism).'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'With this field you can provide a bibliographic reference for your resource. You first need to specify the type of citation (Cites or Is cited by) and then format the citation in the available subfields.',
                  level2:
                    'When the resource you are uploading is research data, make sure you state the scholarly output of your dataset. Explicitly defining the link between dataset and the related publication is in compliance with Open Access policies. It also ensures faster exposure of the dataset in the OpenAIRE portal, to which Phaidra metadata are exposed.',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Condition',
            predicate: 'arm:ConditionAssessment',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Assessment and/or documentation of the physical condition of an item, including damage, material vulnerabilities, special storage requirements, etc.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'If relevant, provide an assessment regarding the physical condition of the resource, including damage, material vulnerabilities, etc.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Contribution',
            predicate: 'role:',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Information about any person or organization involved in the lifecycle of the resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'You are required to provide the name of at least one person involved in the lifecycle of the object. <br> This field consists of four parts: <ul> <br> <li><b>Contributor role</b>: <br> You can choose the type of role from the list offered to you through the suggester. On the right, specify if the role refers to a person (<i>Personal</i>) or an organization (<i>Corporate</i>).</li><br><li><b>Contributor name</b>: <br> Name and surname of the person or organization related to the role you previously selected. In case of an organization, select the unit of the University of Vienna from the drop-down list or enter the value manually if it is an external organization. </li><br><li><b>Contributor identifier</b>: <br> Where available, it is recommended to add an identifier. Choose the type of identifier from the drop-down list and write the code on the right.</li><br><li><b>Contributor affiliation</b>: <br> You can specify which organization the person is affiliated to. In case of an organizational unit of the University of Vienna, select the value from the list.</ul> <br> If you have more than one contributors, press on the right of the section to duplicate the section. You can also modify the order of the contributors by using the arrows.',
                  level2: '',
                  level3:
                    'A persistent author identifier can help computers to interpret your data in a meaningful way, to create links between datasets, publications and researchers, and to increase discoverability. To make your data Findable, reference author identifiers when describing your resource.'
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="https://www.loc.gov/marc/relators/relaterm.html">MARC Code List for Relators </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: 'Required'
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Date',
            predicate: 'dcterms:date', // should we add the whole list of predicates?
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'A point or period of time associated with an event in the lifecycle of the resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Each resource is bounded to a time span, whatever type of event it refers to (e.g. creation, production, publication or modification, acquisition). When you describe your resource, it is thus highly recommended to provide any chronological indication of its life cycle. <br><b>Note:</b> This field should not express a date associated with the intellectual content of the resource. If you refer to this type of information, use instead the <i>Temporal coverage</i> field. <br> Phaidra Editor provides you with many types of dates that you can choose from: <br> <ul><li><b>Date</b>: <br> A point or period of time associated with an event in the lifecycle of the resource.</li> <li><b>Date created</b>: <br>Date of creation of the resource.</li> <li><b>Date modified</b>: <br> Date on which the resource was changed. </li><li><b>Date available</b>: <br> Date (often a range) that the resource became or will become available.</li> <li><b>Date issued</b>: <br> Date of formal issuance (e.g. publication) of the resource</li> <li><b>Date valid</b>: <br>Date (often a range) of validity of a resource.</li> <li><b> Date accepted </b>: <br>Date of acceptance of the resource.</li> <li><b>Date copyrighted</b>: <br> Date of copyright.</li> <li><b>Date submitted</b>: <br>Date of submission of the resource.</li> <li><b>Date of production:</b> <br>Date of the inscription, fabrication, construction, etc., of an unpublished resource.</li> <li><b>Date accessioned</b>: <br> Date on which an identification number was assigned to a particular donation or acquisition of the analogue object.</li> </ul> <br>If you need more than one type of date, duplicate the field.',
                  level2:
                    'Enriching the contextual knowledge about the data should be done in a machine-actionable way in order to foster its discovery. This means that selecting a specific Date which conforms to the context you are referring to (e.g. <i>Date created</i> or <i>Date issued</i>) should be preferrable to the more general <i>Date</i>. The more accurate and meaningful your metadata is, the more findable, interoperable and reusable your resource is. ',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Depicted/represented place',
            predicate: 'dcterms:spatial',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'The geographic area represented in the content of the resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Use this field when the intellectual or artistic content of your object is about or is depicting a place. E.g. the place represented in a photograph or the place which the research data refer to. <br> Use the suggester to find the suitable place or add your own value. If needed, you can duplicate the field. <br> <b>Note:</b> This field describes the place covered or represented by the content of the resource, not the place where the resource was created or published. For the latter type of information, use the other available fields.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="http://vocab.getty.edu/tgn/"> Thesaurus of Geographic Names </a> <br> <a href="https://www.geonames.org/"> GeoNames </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Depth',
            predicate: 'schema:depth',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content: 'The depth of the item.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Specify the depth of the object, choosing the measurement unit.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Description',
            predicate: 'bf:Note',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Information, usually in textual form, on attributes of a resource or some aspect of a resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Enter a brief, general description of the resource.<br> This field is intended to give the user an overall account of the intellectual content of the resource.',
                  level2:
                    'When describing your object, remember that using a specific field instead of combining information in a free-text general description will improve the quality of your metadata and would let your resource be more easily found and accessed in the <i>Linked Open Data</i> network. Before entering plain text, make sure to first check all the available fields, so you can granularly specify the content of the object in terms of topic, time and space. In case you have additional contextual details to mention (e.g. the linking to a project), we recommend you to press the button at the bottom of the submit form and check the list of additional fields if there is any that fits your needs. <br> Provide the description of your resource in another relevant language. Enriching your metadata by adding a translation makes the resource more findable for people speaking different languages and allows its reuse in a multilingual environment.',
                  level3:
                    'All the above suggestions are pivotal to accomplish the goal of creating a FAIR digital resource. Accurate attributes and relationships specified in a machine-readable way (e.g. <i>X depicts Y</i>) ensure that the metadata you are creating are meaningful. Keep in mind that the more detail you put in your metadata, higher is the chance that your data will be further discovered and reused.'
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: 'Required'
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Diameter',
            predicate: 'vra:diameter',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content: 'The diameter of the item.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Specify the diameter of the object, choosing the measurement unit.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Digitization note',
            predicate: 'phaidra:DigitizationNote',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Information regarding the digitization process (e.g. scanner, OCR process, etc.).'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Use this field to record technical information about the digitization of the resource, e.g. the hardware, software, resolution, color settings, equipment and formats used for the digitization process.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Extent',
            predicate: 'rdau:P60550',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'A type, number, and measurement unit that quantify an aspect of the extent of a resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Record the extent (size or dimension) of the object by giving the number of units and the type of unit (e.g. "4 folders", "4 boxes"). <br> Use this field only when the resource needs to be described in a measuring unit other than meter (m). If this is not the case, please consider the fields <i>Height</i>, <i>Width</i>, <i>Weight</i>, <i>Depth</i>, <i>Diameter</i>.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Funder',
            predicate: 'frapo:hasFundingAgency',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'The funding agency that provides funding for the research or project related to the object.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Specify the name of the Project Funder related to your data, providing its identifier where available.',
                  level2: '',
                  level3:
                    'A persistent author identifier can help computers to interpret your data in a meaningful way, to create links between datasets, publications and researchers, and to increase discoverability. To make your data Findable, reference the Funder identifier when describing your resource.'
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="https://pid.phaidra.org/vocabulary/en/collections/BBDA-1SJY.html"> Funders Phaidra Vocabulary </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Genre',
            predicate: 'schema:genre',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content: 'Genre of the resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'In some cases, as for example a music album, a specification of the genre (e.g. &#34;pop&#34;) may be helpful to provide a more granular context to the resource. <br> Select the value from the drop-down list. If this is not in the list, choose <i>Other</i> and notify the metadata administrators.', // right now the value "Other" is not in the list
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="https://vocab.phaidra.org/vocabulary/2H73-WG6Y">Genre Phaidra Vocabulary </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Height',
            predicate: 'schema:height',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content: 'The height of the item.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Specify the height of the object, choosing the measurement unit.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Inscription',
            predicate: 'vra:hasInscription',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'All marks or written words added to the object at the time of production or in its subsequent history, including signatures, dates, dedications, texts, and colophons, as well as marks, such as the stamps of silversmiths, publishers, or printers.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Enter any marks or written words added to the image at the time of production or in its subsequent history, including signatures, dates, dedications, texts, and colophons, as well as marks, such as the stamps of silversmiths, publishers, or printers.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Is contained in',
            predicate: 'rdau:P60101',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Information about the larger resource of which the described resource is a discrete component.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'In case the object you are describing is part of a larger resource (for example, book chapters, multi-volume-books or maps within atlases), you can use this field to register information about the resource of which the object is a component.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Is in series',
            predicate: 'rdau:P60193',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Information about the resource in which the described item has been issued as a part of a series.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'If you are uploading objects published periodically, with no defined end at the start, you can use this field for describing contextual information about. Additionally to article in journals, this field could also refer to films or television episodes which are part of a series.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Keywords',
            predicate: 'dce:subject',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'The topic of the resource, represented using keywords.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Add useful keywords to represent the topic of the resource, specifying their language on the right.',
                  level2:
                    'This field is particularly important to help users locate and retrieve the resource. The format of the values you put within the field thus plays an important role. To avoid the ambiguity that arises from synonymous terms, homonyms, variant spellings and other pitfalls, controlled vocabularies or authority files can be useful resources to look at. <br> If possible, duplicate the field in another relevant language. Providing keywords in more than one language makes the resource more findable for people speaking different languages and allows its reuse in a multilingual environment.',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: 'Required'
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Language',
            predicate: 'dcterms:language',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'A designation of the language in which the content of the resource is expressed.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Specify the language of the resource, choosing the value from the drop-down list. Make sure you are referring to the language of the resource, not the language of the metadata. <br>If the content of the resource is in more than one language, duplicate the field.',
                  level2:
                    'The language of an object provides relevant context to the user. We highly encourage you to fill in this field if your resource contains text or speech.',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="http://id.loc.gov/vocabulary/languages"> MARC List for Languages </a> <br> <a href="https://vocab.phaidra.org/vocabulary/WKFZ-VG0C"> Language Phaidra Vocabulary </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Language of subtitles',
            predicate: 'schema:subtitleLanguage',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Languages in which subtitles/captions are available.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'If the resource (e.g. an audio or video file) is provided of subtitles, specify their language choosing the value from the list. <br> If subtitles are given in more than one language, duplicate the field.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="http://id.loc.gov/vocabulary/languages"> MARC List for Languages </a> <br> <a href="https://vocab.phaidra.org/vocabulary/WKFZ-VG0C"> Language Phaidra Vocabulary </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Material',
            predicate: 'vra:material',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'The substance of which a work or an image is composed.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Provide information about the material of the physical resource. <br> You have two options to do that: you can manually enter the value using the first field <i>Material</i> or you can select a pre-filtered value from the drop-down list in the second field <i>Material</i>.', // review this guideline
                  level2:
                    'The use of controlled vocabularies helps to better integrate your data with other resources in the Linked Open Data network. As best practice, check first the drop-down list of the field to see if the value you need is there.',
                  level3:
                    'Controlled vocabularies that have globally unique and persistent identifiers are key to the vision of FAIR data. They remove ambiguity in the meaning of your published data, helping people and computers to understand exactly the concept you are referring to and ensuring access and interoperability. To render your data FAIR, choose a value for Material from the controlled list.'
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="https://vocab.phaidra.org/vocabulary/VPSR-KHRC"> Material Phaidra Vocabulary </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Motion picture adaptation of',
            predicate: 'rdau:P60227',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'A relationship that links the object with a resource that is adapted as a motion picture.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Use this field when the the object you are describing is a motion picture that has been adapted from another resource. <br> In this field you can give information about the original resource:<ul><br><li>Title</li> <br> <li>Role: <br>Choose the type of role from the suggester and add the name and surname of the person related to the role you previously selected.</li></ul> ',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Number of pages',
            predicate: 'schema:numberOfPages',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content: 'The number of pages in the resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1: 'Enter the number of pages of the object.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Object type',
            predicate: 'edm:hasType',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'The physical form or intellectual content of the object being described. It is a more detailed sub-type refining the broader <i>Resource type</i> field.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'These controlled terms are useful for filtering search results. <br> Select a value from the drop-down list. If the resource involves more than one type, duplicate the field. In case the term you want to select is not in the list, choose <i>Other</i> and notify the metadata administrators. <br> If you are describing an audio or video resource, take into consideration also the <i>Carrier type</i> field.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="https://vocab.phaidra.org/vocabulary/NB34-DPJR"> Object type Phaidra Vocabulary </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: 'Required'
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Page end',
            predicate: 'schema:pageEnd',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content: 'The page on which the work ends.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1: 'Enter the page end of the object.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Page start',
            predicate: 'schema:pageStart',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content: 'The page on which the work starts.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1: 'Enter the page start of the object.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Parallel title',
            predicate: 'bf:ParallelTitle',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content: 'An alternative name for the resource.' // TO-DO description
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Enter the title used as a substitute or alternative to the formal title of the resource. These are usually secondary titles, abbreviations, titles with different transliterations, translations of a title, etc. <br> The parallel title does not refer to the translation supplied by the cataloguer.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Place of creation',
            predicate: 'vra:placeOfCreation',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Place where the work or its components was or were created, designed, or produced. It may also be the presumed original location of the work.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Indicate the place where the resource was created. Use the suggester to find the suitable value or write your own value.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="http://vocab.getty.edu/tgn/"> Thesaurus of Geographic Names </a> <br> <a href="https://www.geonames.org/"> GeoNames </a> '
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Place of site',
            predicate: 'vra:placeOfSite',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Geographic location where built works (architecture) or monumental works are found.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Indicate the place where the built work is located or where the monumental work is found. Use the suggester to find the suitable value or write your own value.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="http://vocab.getty.edu/tgn/"> Thesaurus of Geographic Names </a> <br> <a href="https://www.geonames.org/"> GeoNames </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Physical location',
            predicate: 'bf:physicalLocation',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Location in the holding agency where the item is shelved or stored.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1: 'Indicate the place where the resource is stored.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Project',
            predicate: 'frapo:isOutputOf',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content: 'The project that is associated with the resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'This field gathers information about the project which your resource is related to. <br>It consists of:<br> <br><ul><li> Project name: <br> Name of the project.</li> <br><li>Project description: <br> Brief description of the project.</li> <br> <li>Project identifier: <br>The project identification number.</li> <br> <li>Project homepage: <br> The main link to the project.</li> <br> <li> Funder name: <br> The name of the project funder, providing its identifier where available.</li></ul>',
                  level2:
                    'Explicit EC or national funding information adheres to Open Access policies and meets the requirements of the <i>OpenAIRE</i> infrastructure. Where applicable, fill in the field to improve discoverability of your resource in the <i>OpenAIRE</i> portal.',
                  level3:
                    'Globally unique and persistent identifiers can help computers to interpret your data in a meaningful way, to create automatic links between datasets, publications and researchers, and to increase discoverability. To make your data Findable, reference Project and Funder identifiers when describing your resource.'
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Provenance',
            predicate: 'dcterms:provenance',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'A statement of any changes in ownership and custody of the resource since its creation that are significant for its authenticity, integrity, and interpretation. The statement may include a description of any changes successive custodians made to the resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'You may use this field to record any changes in ownership and custody of the resource since its creation that are significant for its authenticity, integrity, and interpretation. The statement may include a description of any changes successive custodians made to the resource.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Publisher',
            predicate: 'bf:provisionActivity',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Information about the agent or place relating to the publication, printing, distribution, issue, release, or production of a resource. Not to be used for the entity responsible for digitizing or making the digital representation available.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Use this field for objects which have known publisher and publication date. Enter the name of the publisher, the place and date of the publication. <br> When only the publication date is available, use the <i> Date issued </i> field.', // TO-DO usage notes
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Regional encoding',
            predicate: 'rdau:P60059',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'A designation for one or more regions of the world for which a videodisc or video game carrier is encoded, indicating that playback is restricted to a device configured to decode it.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'By selecting the value from the drop-down menu, provide a designation for one or more regions of the world for which a videodisc or video game carrier is encoded.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="https://vocab.phaidra.org/vocabulary/HHB2-GXRZ"> Regional encoding Phaidra Vocabulary </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Remark',
            predicate: 'phaidra:Remark',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Additional information that could be relevant for the identification of the resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'You may use this field to add information that generally relates to the resource as a whole. For example, contextual information about the item or the creator of the item, or any dissimilarity between the file you are uploading and a previous version.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Reproduction note',
            predicate: 'phaidra:ReproductionNote',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'A note stating if the analogue object is a copy or an original.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'This field helps to make clear whether the analogue object is a copy or an original. Write the value <i>copy</i> or <i>original</i>.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="https://vocab.phaidra.org/vocabulary/8MPB-RN23"> Reproduction note Phaidra Vocabulary </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Scale',
            predicate: 'bf:scale',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Ratio of the dimensions of a form contained or embodied in a resource to the dimensions of the entity it represents, e.g., for images or cartographic resources.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1: 'Specify the scale of your cartographic resource.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'See also',
            predicate: 'rdfs:seeAlso',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'A URL linking to a related resource that might provide additional information about the subject resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Use this field whenever you want to enter a link to other material related to the resource. <br> Filling in this separate field, instead of adding the URL in a free-text field, makes your data more machine-readable.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Shelf mark',
            predicate: 'bf:shelfMark',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Piece identifier, such as a call or other type of number.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Enter the piece identifier. This could be a call number or a shelf. <br> When filling in this field, make sure to record the physical location in the <i>Physical location</i> field as well.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Subject',
            predicate: 'dcterms:subject',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'The topic of the resource, represented using terms from formal, controlled vocabularies.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'This field makes use of many subject classifications available in the Web, as for example the <i>GND (Gemeinsame Normdatei)</i>, a national authority file used by German-speaking libraries, museums and archives. <br> Use the suggester on this field to find the suitable terms that best describe the object. Choose as many terms as necessary by duplicating the field.',
                  level2:
                    'The use of controlled vocabularies provides greater consistency helping your data to be searched and integrated with other resources in the <i>Linked Open Data</i> network. As best practice, fill in this field with as many terms as needed.',
                  level3:
                    'Controlled vocabularies with globally unique and persistent identifiers are one of the keys to machine-understandability of (meta)data, which is what FAIR guidelines are all about. Metadata expressed in this format is unequivocably read and processed by computers, enabling your resource to be linked with other data, accessed or/and shared. Provide a meaningful classification filling in this field so that you can ensure a broad interoperability of your resource.'
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'Many'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Subtitle',
            predicate: 'bf:subtitle',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Word, character, or group of words and/or characters that contains the remainder of the title after the main title.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Add the secondary title as it appears in your resource or provide one that allows to complete the main title.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Supplementary material',
            predicate: 'bf:supplementaryContent',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Material such as an index, bibliography, appendix, intended to supplement the primary content of a resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'You may use this field to describe any other material which supplements the primary content of the resource, for example alternate endings or an audio commentary that could be provided as special features on a DVD.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Table of contents',
            predicate: 'bf:TableOfContents',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content: 'A structured list of the contents of the resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'If any, provide a list of subunits of the resource, e.g. the list of tracks on a CD or a list of chapters in a book.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Technique',
            predicate: 'vra:hasTechnique',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'The production or manufacturing processes, techniques, and methods incorporated in the fabrication or alteration of the work or image.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'To specify the technique used for the creation of the object, you can either enter your own value (in the first occurrence of the field) or select it from a controlled list (in the second occurrence).',
                  level2:
                    'The use of controlled vocabularies provides greater consistency helping your data to be searched and integrated with other resources in the <i>Linked Open Data </i> network. As best practice, check first the drop-down list of the field to see if the value you need is there.',
                  level3:
                    'Controlled vocabularies which have globally unique and persistent identifiers are key to the vision of FAIR data. They remove ambiguity in the meaning of your published data, helping people and computers to understand exactly the concept you are referring to and ensuring access and interoperability. To render your data FAIR, choose a value for <i>Technique</i> from the controlled list.'
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="https://vocab.phaidra.org/vocabulary/W6R8-EAQS"> Technique Phaidra Vocabulary </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Temporal coverage',
            predicate: 'dcterms:temporal',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'The time period that the content applies to, i.e. that it describes.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Describe the temporal characteristics of the intellectual content of the resource, i.e. what the resource is about (or depicts) in terms of time. You can enter either a formatted date, a range of dates or a period label (e.g. &#34;Neolithic period&#34;). Duplicate this field if needed. <br> <b>Note:</b> This field describes the time period covered or represented by the content of the resource, not the date when the resource was created or published. For this kind of information, use the <i>Date</i> field.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="http://vocab.getty.edu/aat/"> Art and Architecture Thesaurus </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Title',
            predicate: 'dce:title',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'A name given to the resource. Typically, a title will be a name by which the resource is formally known.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'As an important access point for digital resources, you are required to provide a title to your resource. <br> If the resource has more than one title, choose the main one and use the <i>Parallel title</i> field for the alternative one. <br> If there is no formal title, formulate an adequate one that could uniquely identify the object in terms of content (e.g. people, events, activities), geographical location or period of time. Whenever possible, a descriptive and informative title is preferred against more general titles as &#34;unknown&#34; or id numbers. <br>Since titles are nearly always utilized for search, consider incorporating important keywords into the text. Also, make sure the object has its own unique title against the collection it is part of.',
                  level2:
                    'Where possible, provide a translation of the title in another relevant language. Enriching your metadata by adding a translation makes the resource more findable for people speaking different languages and allows its reuse in a multilingual environment.',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: 'Required'
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Weight',
            predicate: 'schema:weight',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content: 'The weight of the item.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Specify the weight of the object, choosing the measurement unit.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Width',
            predicate: 'schema:width',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content: 'The width of the item.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Specify the width of the object, choosing the measurement unit.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          }
        ]
      },
      {
        title: 'Technical metadata',
        open: true,
        fields: [
          {
            title: 'Alternate identifier',
            predicate: 'rdam:P30004',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'An identification that consists of a code, number, or other string, usually independent of natural language and social naming conventions, used to identify a resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'If any, add an alternative identifier (other than Phaidra persistent identifier) that the resource might be provided of. The types of identifiers could be: DOI, Handle, URI, URN, AC-Number. <br> If you have more than one, duplicate the field.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="http://id.loc.gov/vocabulary/identifiers.html"> Standard Identifier Scheme </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Duration',
            predicate: 'schema:duration',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'The duration of the item (movie, audio recording, event, etc.) in ISO 8601 date and time format.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1: 'Specify the duration of the item.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'ISO 8601 date and time format'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'File name',
            predicate: 'ebucore:filename',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content: 'The name of the file containing the resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'The value of this field is automatically filled in when the user uploads the object. The name can still be changed by the user afterwards.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: 'Required'
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Format',
            predicate: 'dce:format',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Technical specification relating to the encoding of a resource.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'This field expresses technical specifications relating to the encoding of a resource, as for example "Dolby Digital 5.1". <br> Select the value from the controlled list.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="https://vocab.phaidra.org/vocabulary/FDVS-NMG1">DC Format Phaidra Vocabulary</a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'MIME type',
            predicate: 'ebucore:hasMimeType',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'The file format, expressed as an authorized term from the <i>Internet Media Types (IMT) </i> controlled vocabulary.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'The information about the file format can be relevant to determine the equipment needed to display or operate a resource (e.g. if the described resource has format PDF, you need a PDF reader to use it). <br> Once you upload the file, the value is pre-selected by the system. Check if this value fits your digital object. If not, choose the right one from the drop-down menu. <br><b>Note:</b> If possible, before uploading the file consider file formats that are widely used and supported by the most commonly used software and tools. A list of the formats recommended by Phaidra can be found <a href="https://datamanagement.univie.ac.at/en/about-phaidra/formats/">here</a>. ',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="https://www.iana.org/assignments/media-types/media-types.xhtml"> Internet Media Types (IMT) </a> '
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: 'Required'
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Resource type',
            predicate: 'dcterms:type',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'A term that specifies the characteristic and general type of content of the resource. This information characterizes the resource at a higher level than the <i>Object type</i> field.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'This field is automatically generated by the system once the content-specific submit form is selected.',
                  level2: '',
                  level3: ''
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="https://vocab.phaidra.org/vocabulary/7E4S-MA30"> Resource type Phaidra Vocabulary </a> '
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: 'Required'
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          }
        ]
      },
      {
        title: 'Rights metadata',
        open: true,
        fields: [
          {
            title: 'Access rights',
            predicate: 'dcterms:accessRights',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Information about who can access the resource or an indication of its security status. <br>The Access rights vocabulary here implemented builds on <i>COAR Access Rights Vocabulary</i>.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'Declare the access status of a resource by selecting the value from the drop-down list.',
                  level2: '',
                  level3:
                    'Well-defined conditions under which data are accessible help a machine automatically understand the requirements and tell the user how he may access the resource. Make sure you are clearly stating accessibility, choosing <i>Open Access</i> when possible.'
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="https://pid.phaidra.org/vocabulary/PY38-5KQZ"> Access rights Phaidra Vocabulary </a>'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'License',
            predicate: 'edm:rights',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'The copyright, usage and access rights that apply to the digital representation.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'You are required to select the license from a controlled list. If you need to learn more about differences between these licenses, read the <a href="https://creativecommons.org/about/cclicenses/"> Creative Commons webpage</a>.',
                  level2: '',
                  level3:
                    'To increase the reusability of your data, make sure you know who the data rights holder is before uploading the resource. It should also be clear what license applies.'
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content:
                  '<a href="https://creativecommons.org/licenses/"> Creative Commons licenses </a> '
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: 'Required'
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          },
          {
            title: 'Rights statement',
            predicate: 'dce:rights',
            open: false,
            sections: [
              {
                id: 'description',
                title: 'Description',
                content:
                  'Information about rights held in and over the resource. Typically, rights information includes a statement about various property rights associated with the resource, including intellectual property rights.'
              },
              {
                id: 'usagenotes',
                title: 'Usage notes',
                content: {
                  level1:
                    'You can use this field to give supplemental information on intellectual property rights or access arrangements that is additional to the license you selected. For instance, you could specify details concerning accessibility, reproduction, copyright holder, restrictions, or securing permissions for use.',
                  level2: '',
                  level3:
                    'In addition to machine-understandable license information, a human-readable text concerning the conditions (e.g. obligations, restrictions) under which data can be reused can still be significant to the user to prevent ambiguity on your data. When you think a further specification might be useful, consider fill in the field.'
                }
              },
              {
                id: 'vocabulary',
                title: 'Vocabulary',
                content: 'None'
              },
              {
                id: 'obligation',
                title: 'Obligation',
                content: ''
              },
              {
                id: 'occurrence',
                title: 'Occurrence',
                content: ''
              },
              {
                id: 'exampleHR',
                title: 'Example',
                content: ''
              }
            ]
          }
        ]
      }
    ]
  }

})

export const mutations = {
  updateBreadcrumbs (state, transition) {
    state.breadcrumbs = [
      {
        text: state.instanceconfig.institution,
        external: true,
        to: state.instanceconfig.institutionurl
      },
      {
        text: state.instanceconfig.title,
        to: transition.localePath('/')
      }
    ]
    if (transition.to.path.includes('/repostats')) {
      state.breadcrumbs.push(
        {
          text: 'Repository statistics',
          to: transition.to.name,
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('/metadata-fields-help')) {
      state.breadcrumbs.push(
        {
          text: 'Metadata fields overview',
          to: transition.to.name,
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('/impressum')) {
      state.breadcrumbs.push(
        {
          text: 'Impressum',
          to: transition.to.name,
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('/search')) {
      state.breadcrumbs.push(
        {
          text: 'Search',
          to: transition.to.path,
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('detail')) {
      if (transition.from.path.includes('/search')) {
        state.breadcrumbs.push(
          {
            text: 'Search',
            to: transition.from.path
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Detail ' + transition.to.params.pid,
          to: { name: transition.to.path, params: { pid: transition.to.params.pid } },
          disabled: true
        }
      )
    }
    if (transition.to.name.includes('uwmetadataeditor')) {
      if (transition.from.name.includes('detail')) {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Metadata editor ' + transition.to.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('/metadata') && !transition.to.path.includes('edit') && !transition.to.path.includes('help')) {
      if (transition.from.path.includes('detail')) {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Metadata ' + transition.to.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('metadata') && transition.to.path.includes('edit') && !transition.to.path.includes('help')) {
      if (transition.from.path.includes('detail')) {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Metadata editor ' + transition.to.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('rights')) {
      if (transition.from.path.includes('detail')) {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Access rights ' + transition.to.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.name === 'sort') {
      if (transition.from.name === 'detail') {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Sort ' + transition.to.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('relationships')) {
      if (transition.from.path.includes('detail')) {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Relationships of ' + transition.to.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('delete')) {
      if (transition.from.path.includes('detail')) {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Delete of ' + transition.to.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('upload-webversion')) {
      if (transition.from.path.includes('detail')) {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path}
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Upload web version of ' + transition.to.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.name === 'submit-related') {
      if (transition.from.name === 'detail') {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Submit of an object related to ' + transition.from.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('stats')) {
      if (transition.from.path.includes('detail')) {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Usage statistics for ' + transition.from.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }

    if (transition.to.path.includes('submit') && transition.to.params && transition.to.params.cmodel && !transition.to.params.submitform) {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: transition.from.path
        }
      )
      state.breadcrumbs.push(
        {
          text: 'Submit ' + transition.to.params.cmodel,
          disabled: true
        }
      )
    } else if (transition.to.path.includes('submit') && transition.to.params && transition.to.params.cmodel && transition.to.params.submitform) {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: transition.from.path
        }
      )
      if (transition.to.params.cmodel !== 'resource') {
        state.breadcrumbs.push(
          {
            text: 'Submit ' + transition.to.params.cmodel,
            to: { path: transition.from.path}
          }
        )
      }
      if (transition.to.params.submitform !== 'general') {
        state.breadcrumbs.push(
          {
            text: 'Submit ' + transition.to.params.cmodel + ' ' + transition.to.params.submitform,
            disabled: true
          }
        )
      } else {
        state.breadcrumbs.push(
          {
            text: 'Submit ' + transition.to.params.cmodel,
            disabled: true
          }
        )
      }
    } else if (transition.to.path.includes('submit/simple')) {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: transition.from.path
        }
      )
      state.breadcrumbs.push(
        {
          text: 'Simple submit',
          disabled: true
        }
      )
    } else if (transition.to.name === 'submit-custom') {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: transition.from.path
        }
      )
      state.breadcrumbs.push(
        {
          text: 'Submit template ' + transition.to.params.templateid,
          disabled: true
        }
      )
    } else if (transition.to.path.includes('submit/uwm')) {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: transition.from.path
        }
      )
      state.breadcrumbs.push(
        {
          text: 'Legacy submit (UWMetadata)',
          disabled: true
        }
      )
    } else if (transition.to.path.includes('/submit/empty')) {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: transition.from.path
        }
      )
      state.breadcrumbs.push(
        {
          text: 'New template',
          disabled: true
        }
      )
    } else  if (transition.to.path.includes('submit/ksa-eda')) {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: transition.from.path
        }
      )
      state.breadcrumbs.push(
        {
          text: 'KSA EDA',
          disabled: true
        }
      )
    } else if (transition.to.path.includes('submit/bruckneruni')) {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: transition.from.path
        }
      )
      state.breadcrumbs.push(
        {
          text: 'Bruckneruni',
          disabled: true
        }
      )
    } else if (transition.to.name.includes('submit')) {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          disabled: true
        }
      )
    }
  },
  setLoading (state, loading) {
    state.loading = loading
  },
  setGroups (state, groups) {
    state.groups = groups
  },
  setObjectInfo (state, objectInfo) {
    state.objectInfo = objectInfo
  },
  setObjectMembers (state, objectMembers) {
    state.objectMembers = objectMembers
  },
  switchInstance (state, instance) {
    state.instance = state.config.instances[instance]
  },
  hideSnackbar (state) {
    state.snackbar = false
  },
  setAlerts (state, alerts) {
    for (let a of alerts) {
      if (a.type === 'success') {
        state.snackbar = true
      }
    }
    state.alerts = alerts
  },
  clearAlert (state, alert) {
    state.alerts = state.alerts.filter(e => e !== alert)
  },
  setUserData (state, user) {
    let data = {
      ...state.user,
      ...user
    }
    state.user = data
    if(user) {
      localStorage.setItem('user',JSON.stringify(user))
    }
  },
  setUserToken (state, token) {
    let data = {
      ...state.user,
      token
    }
    state.user = data
    if(token)  {
      localStorage.setItem('token', token)
    }
  },
  setUsername (state, username) {
    Vue.set(state.user, 'username', username)
  },
  setToken (state, token) {
    localStorage.setItem('token', token)
    Vue.set(state.user, 'token', token)
  },
  setLoginData (state, logindata) {
    let user = {
      username: logindata.username,
      firstname: logindata.firstname,
      lastname: logindata.lastname,
      email: logindata.email,
      org_units_l1: logindata.org_units_l1,
      org_units_l2: logindata.org_units_l2
    }
    let data = {
      ...state.user,
      ...user
    }
    state.user = data
    localStorage.setItem('user', JSON.stringify(user))
  },
  clearUser (state) {
    state.user = {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  clearStore (state) {
    state.alerts = []
    state.objectInfo = null
    state.objectMembers = []
    state.user = {}
    state.groups = []
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // document.cookie = 'X-XSRF-TOKEN='
  },
  sortOrgUnits (state, locale) {
    if (state.vocabulary.vocabularies['orgunits'].sorted !== locale) {
      if (state.vocabulary.vocabularies['orgunits']['terms']) {
        if (state.vocabulary.vocabularies['orgunits']['terms'][0]) {
          if (state.vocabulary.vocabularies['orgunits']['terms'][0]['phaidra:unitOrdinal']) {
            if (state.vocabulary.vocabularies['orgunits']['terms'][0]['phaidra:groupOrdinal']) {
              // if there are groups, sort groups first, then units within groups...
              let groups = []
              for (let u of state.vocabulary.vocabularies['orgunits']['terms']) {
                if (u['phaidra:orgGroupOrdinal']) {
                  if (!Array.isArray(groups[u['phaidra:orgGroupOrdinal']])) {
                    groups[u['phaidra:orgGroupOrdinal']] = []
                  }
                  groups[u['phaidra:orgGroupOrdinal']].push(u)
                }
              }
              let groupedUnits = []
              for (let g of groups) {
                if (g) {
                  g.sort(function (a, b) {
                    return a['phaidra:unitOrdinal'] - b['phaidra:unitOrdinal']
                  })
                  groupedUnits.push(g)
                }
              }
              state.vocabulary.vocabularies['orgunits']['terms'] = groupedUnits
            } else {
              // ... otherwise sort units only
              state.vocabulary.vocabularies['orgunits']['terms'].sort(function (a, b) {
                return a['phaidra:unitOrdinal'] - b['phaidra:unitOrdinal']
              })
            }
          } else {
            state.vocabulary.vocabularies['orgunits']['terms'].sort(function (a, b) {
              if ((a['skos:prefLabel'][locale]) && (b['skos:prefLabel'][locale])) {
                return a['skos:prefLabel'][locale].localeCompare(b['skos:prefLabel'][locale], locale)
              }
              return 0
            })
          }
        }
      }
      orgunits.sortOrgUnitsTree(state.vocabulary.vocabularies['orgunits']['tree'], locale)
      state.vocabulary.vocabularies['orgunits'].sorted = locale
    }
  },
  setOrgUnits (state, data) {
    if (state.vocabulary.vocabularies['orgunits']['loaded'] === false) {
      state.vocabulary.vocabularies['orgunits']['tree'] = data.tree
      state.vocabulary.vocabularies['orgunits']['terms'] = data.terms
      state.vocabulary.vocabularies['orgunits']['loaded'] = true
    }
  },
  sortRoles (state, locale) {
    state.vocabulary.vocabularies['rolepredicate']['terms'].sort(function (a, b) {
      return a['skos:prefLabel'][locale].localeCompare(b['skos:prefLabel'][locale], locale)
    })
  },
  setOefos (state, data) {
    if (state.vocabulary.vocabularies['oefos']['loaded'] === false) {
      state.vocabulary.vocabularies['oefos']['tree'] = data.tree
      state.vocabulary.vocabularies['oefos']['terms'] = data.terms
      state.vocabulary.vocabularies['oefos']['loaded'] = true
    }
  },
  sortOefos (state, locale) {
    if (state.vocabulary.vocabularies['oefos'].sorted !== locale) {
      if (state.vocabulary.vocabularies['oefos']['terms']) {
        if (state.vocabulary.vocabularies['oefos']['terms'][0]) {
          state.vocabulary.vocabularies['oefos']['terms'].sort(function (a, b) {
            return a['skos:prefLabel'][locale].localeCompare(b['skos:prefLabel'][locale], locale)
          })
        }
      }
      if (state.vocabulary.vocabularies['oefos']['tree']) {
        oefos.sortOefosTree(state.vocabulary.vocabularies['oefos']['tree'], locale)
      }
      state.vocabulary.vocabularies['oefos'].sorted = locale
    }
  },
  setLangTerms (state, data) {
    if (state.vocabulary.vocabularies['lang']['loaded'] === false) {
      state.vocabulary.vocabularies['lang']['terms'] = data
      state.vocabulary.vocabularies['lang']['loaded'] = true
    }
  },
  disableVocabularyTerms (state, vocandterms) {
    if (state.vocabulary.vocabularies[vocandterms.vocabulary]) {
      for (let t of state.vocabulary.vocabularies[vocandterms.vocabulary].terms) {
        for (let termid of vocandterms.termids) {
          if (t['@id'] === termid) {
            t.disabled = true
          }
        }
      }
    }
  },
  enableAllVocabularyTerms (state, vocabulary) {
    if (state.vocabulary.vocabularies[vocabulary]) {
      for (let t of state.vocabulary.vocabularies[vocabulary].terms) {
        t.disabled = false
      }
    }
  },
  loadVocabulary (state, payload) {
    let id = payload.id
    let data = payload.data

    let terms = []

    for (let lab of data.results.bindings) {
      // TODO: remove replace once pid. is exported to triplestore instead of vocab.
      let id = lab.id.value.replace('vocab.phaidra.org', 'pid.phaidra.org')
      let lang = lang2to3map[lab.label['xml:lang']]
      let found = false
      for (let term of terms) {
        if (term['@id'] === id) {
          term['skos:prefLabel'][lang] = lab.label.value
          found = true
          break
        }
      }
      if (!found) {
        let term = {
          '@id': id,
          'skos:prefLabel': {}
        }
        term['skos:prefLabel'][lang] = lab.label.value
        terms.push(term)
      }
    }
    Vue.set(state.vocabulary.vocabularies, id, {
      terms: terms,
      loaded: true
    })
  },
  sortFieldsOverview (state, locale) {
    for (let section of state.info.metadataFieldsOverview) {
      if (locale !== 'eng') {
        section.fields.sort((a, b) => i18n.t(a.title).localeCompare(i18n.t(b.title), locale))
      } else {
        section.fields.sort((a, b) => a.title.localeCompare(b.title, locale))
      }
    }
  },
  initFieldsOverview (state) {
    state.info.metadataFieldsOverview[0].fields[0].open = true
  },
  switchFieldsOverview (state, id) {
    for (let cat of state.info.metadataFieldsOverview) {
      for (let f of cat.fields) {
        if (f.id === id) {
          f.open = true
        } else {
          f.open = false
        }
      }
    }
  }

}

export const getters = {
  getLocalizedTermLabel: (state) => (voc, id, lang) => {
    let terms = state.vocabulary.vocabularies[voc].terms
    for (let i = 0; i < terms.length; i++) {
      if (terms[i]['@id'] === id) {
        return terms[i]['skos:prefLabel'][lang] ? terms[i]['skos:prefLabel'][lang] : terms[i]['skos:prefLabel']['eng'] ? terms[i]['skos:prefLabel']['eng'] : terms[i]['skos:prefLabel']['deu']
      }
    }
  },
  getLocalizedTermLabelByNotation: (state) => (voc, notation, lang) => {
    let terms = state.vocabulary.vocabularies[voc].terms
    for (let i = 0; i < terms.length; i++) {
      if (Array.isArray(terms[i]['skos:notation'])) {
        for (let n of terms[i]['skos:notation']) {
          if (n === notation) {
            return terms[i]['skos:prefLabel'][lang] ? terms[i]['skos:prefLabel'][lang] : terms[i]['skos:prefLabel']['eng'] ? terms[i]['skos:prefLabel']['eng'] : terms[i]['skos:prefLabel']['deu']
          }
        }
      } else {
        if (terms[i]['skos:notation'] === notation) {
          return terms[i]['skos:prefLabel'][lang] ? terms[i]['skos:prefLabel'][lang] : terms[i]['skos:prefLabel']['eng'] ? terms[i]['skos:prefLabel']['eng'] : terms[i]['skos:prefLabel']['deu']
        }
      }
    }
  },
  getTerm: (state) => (voc, id) => {
    let terms = state.vocabulary.vocabularies[voc].terms
    for (let i = 0; i < terms.length; i++) {
      if (terms[i]['@id'] === id) {
        return terms[i]
      }
    }
  },
  getTermProperty: (state) => (voc, id, prop) => {
    let terms = state.vocabulary.vocabularies[voc].terms
    for (let i = 0; i < terms.length; i++) {
      if (terms[i]['@id'] === id) {
        return terms[i][prop]
      }
    }
  },
  getObjectTypeForResourceType: (state) => (rtId) => {
    let arr = []
    if (rtId !== ns + 'GXS7-ENXJ') {
      for (let otId of ot4rt[rtId]) {
        for (let term of state.vocabulary.vocabularies['objecttype'].terms) {
          if (term['@id'] === otId) {
            arr.push(term)
          }
        }
      }
    }
    return arr
  }

}

export const actions = {

  async fetchObjectInfo ({ commit, state }, pid) {
    console.log('[' + pid + '] fetching object info')
    try {
      let response
      if (state.user.token) {
        response = await axios.get(state.instanceconfig.api + '/object/' + pid + '/info',
          {
            headers: {
              'X-XSRF-TOKEN': state.user.token
            }
          }
        )
      } else {
        response = await axios.get(state.instanceconfig.api + '/object/' + pid + '/info')
      }
      console.log('[' + pid + '] fetching object info done')
      commit('setObjectInfo', response.data.info)
    } catch (error) {
      console.log(error)
    }
  },
  async fetchObjectMembers ({ dispatch, commit, state }, parent) {
    console.log('[' + parent.pid + '] fetching object members')
    commit('setObjectMembers', [])
    try {
      if (parent.members.length > 0) {
        let members = []
        for (let doc of parent.members) {
          console.log('[' + parent.pid + '] fetching object info of member ' + doc.pid)
          let memresponse
          if (state.user.token) {
            memresponse = await axios.get(state.instanceconfig.api + '/object/' + doc.pid + '/info',
              {
                headers: {
                  'X-XSRF-TOKEN': state.user.token
                }
              }
            )
          } else {
            memresponse = await axios.get(state.instanceconfig.api + '/object/' + doc.pid + '/info')
          }
          console.log('[' + parent.pid + '] fetching object info of member ' + doc.pid + ' done')
          members.push(memresponse.data.info)
        }
        commit('setObjectMembers', members)
      } else {
        commit('setObjectMembers', [])
      }
    } catch (error) {
      console.log(error)
    }
  },
  async getLoginData ({ commit, dispatch, state }) {
    try {
      let response = await axios.get(state.instanceconfig.api + '/directory/user/data', {
        headers: {
          'X-XSRF-TOKEN': state.user.token
        }
      })
      if (response.data.alerts && response.data.alerts.length > 0) {
        commit('setAlerts', response.data.alerts)
      }
      console.log('[' + state.user.username + '] got user data firstname[' + response.data.user_data.firstname + '] lastname[' + response.data.user_data.lastname + '] email[' + response.data.user_data.email + ']')
      commit('setLoginData', response.data.user_data)
    } catch (error) {
      if (error.response.status === 401) {
        commit('setAlerts', [ { type: 'danger', msg: 'You have been logged out' } ])
        commit('setToken', null)
        commit('setLoginData', { username: null, firstname: null, lastname: null, email: null, org_units_l1: null, org_units_l2: null })
        if (process.browser) {
          document.cookie = 'X-XSRF-TOKEN=; domain=' + window.location.hostname + '; path=/; secure; samesite=strict; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        }
      }
      console.log(error)
    }
  },
  async login ({ commit, dispatch, state }, credentials) {
    console.log('[' + credentials.username + '] logging in')
    commit('clearStore')
    commit('setUsername', credentials.username)
    try {
      let response = await axios.get(state.instanceconfig.api + '/signin', {
        headers: {
          'Authorization': 'Basic ' + btoa(credentials.username + ':' + credentials.password)
        }
      })
      if (response.data.alerts && response.data.alerts.length > 0) {
        commit('setAlerts', response.data.alerts)
      }
      if (response.status === 200) {
        console.log('[' + state.user.username + '] login successful token[' + response.data['XSRF-TOKEN'] + '], fetching user data')
        if (process.browser) {
          document.cookie = 'X-XSRF-TOKEN=' + response.data['XSRF-TOKEN'] + '; domain=' + window.location.hostname + '; path=/; secure; samesite=strict'
        }
        commit('setToken', response.data['XSRF-TOKEN'])
        dispatch('getLoginData')
      }
    } catch (error) {
      console.log(error)
    }
  },
  async logout ({ commit, dispatch, state }) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    commit('clearStore')
    if (process.browser) {
      document.cookie = 'X-XSRF-TOKEN=; domain=' + window.location.hostname + '; path=/; secure; samesite=strict; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    }
    try {
      let response = await axios.get(state.instanceconfig.api + '/signout', {
        headers: {
          'X-XSRF-TOKEN': state.user.token
        }
      })
      commit('clearStore')
      if (response.data.alerts && response.data.alerts.length > 0) {
        // commit('setAlerts', response.data.alerts)
      }
    } catch (error) {
      commit('clearStore')
      console.log(error)
    }
  },
  async getUserGroups ({ commit, state }) {
    commit('clearAlerts')
    try {
      let response = await axios.get(state.instanceconfig.api + '/groups', {
        headers: {
          'X-XSRF-TOKEN': state.user.token
        }
      })
      if (response.data.alerts && response.data.alerts.length > 0) {
        commit('setAlerts', response.data.alerts)
      }
      commit('setGroups', response.data.groups)
    } catch (error) {
      console.log(error)
    }
  },
  switchInstance ({ commit }, instance) {
    commit('switchInstance', instance)
  },
  loadLanguages ({ commit, state }, locale) {
    console.log('commit, state', commit, state)
    if (state.vocabulary.vocabularies['lang']['terms'].length < 1) {
      let langterms = languages.get_lang()
      langterms.sort((a, b) => a['skos:prefLabel'][locale].localeCompare(b['skos:prefLabel'][locale], locale))
      commit('setLangTerms', langterms)
    }
  },
  async loadOrgUnits ({ commit, rootState, state }, locale) {
    if (state.vocabulary.vocabularies['orgunits']['loaded'] === false) {
      try {
        let response = await axios.request({
          method: 'GET',
          url: rootState.instanceconfig.api + '/directory/org_get_units'
        })
        if (response.data.alerts && response.data.alerts.length > 0) {
          commit('setAlerts', response.data.alerts)
        }
        let terms = []
        orgunits.getOrgUnitsTerms(terms, response.data.units, null)
        commit('setOrgUnits', { tree: response.data.units, terms: terms, locale: locale })
        commit('sortOrgUnits', locale)
      } catch (error) {
        console.log(error)
        commit('setAlerts', [ { type: 'danger', msg: 'Failed to fetch org units: ' + error } ])
      }
    } else {
      if (state.vocabulary.vocabularies['orgunits']['locale'] !== locale) {
        commit('sortOrgUnits', locale)
      }
    }
  },
  async loadOefos ({ commit, rootState, state }, locale) {
    if (state.vocabulary.vocabularies['oefos']['loaded'] === false) {
      try {
        let response = await axios.request({
          method: 'GET',
          url: rootState.instanceconfig.api + '/vocabulary?uri=oefos2012'
        })
        if (response.data.alerts && response.data.alerts.length > 0) {
          commit('setAlerts', response.data.alerts)
        }
        let terms = []
        oefos.getOefosTerms(terms, response.data.vocabulary, null)
        commit('setOefos', { tree: response.data.vocabulary, terms: terms, locale: locale })
        // commit('sortOefos', locale)
      } catch (error) {
        console.log(error)
        commit('setAlerts', [ { type: 'danger', msg: 'Failed to fetch oefos: ' + error } ])
      }
    } else {
      if (state.vocabulary.vocabularies['oefos']['locale'] !== locale) {
        commit('sortOefos', locale)
      }
    }
  },
  async loadVocabulary ({ commit, state, rootState }, vocabId) {
    if (state.vocabulary.vocabularies[vocabId]) {
      if (state.vocabulary.vocabularies[vocabId].loaded) {
        return
      }
    }
    try {
      var raw = 'PREFIX v: <' + rootState.appconfig.apis.vocserver.ns + '> PREFIX : <' + rootState.appconfig.apis.vocserver.ns + 'schema#> PREFIX skos: <http://www.w3.org/2004/02/skos/core#> SELECT ?id ?label ?exp WHERE { graph ?g { ?id v:memberOf  v:' + vocabId + ' . ?id skos:prefLabel ?label . OPTIONAL { ?id :expires ?exp . } } }'
      let response = await axios.request({
        method: 'POST',
        url: rootState.appconfig.apis.vocserver.url + rootState.appconfig.apis.vocserver.dataset + '/query',
        headers: { 'Content-Type': 'application/sparql-query' },
        data: raw
      })
      if (response.data && response.data.results && response.data.results.bindings) {
        commit('loadVocabulary', { id: vocabId, data: response.data })
      } else {
        console.log('Failed to fetch vocabulary ' + vocabId)
        commit('setAlerts', [ { type: 'danger', msg: 'Failed to fetch vocabulary ' + vocabId } ])
      }
    } catch (error) {
      console.log(error)
      commit('setAlerts', [ { type: 'danger', msg: 'Failed to fetch vocabulary ' + vocabId + ': ' + error } ])
    }
  },
  localeChange ({ commit, state }, locale) {
    commit('sortFieldsOverview', locale)
  }

}
