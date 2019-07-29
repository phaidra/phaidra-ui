import PBreadcrumbs from '@/components/PBreadcrumbs'

export const breadcrumbs = {
  components: {
    PBreadcrumbs
  },
  methods: {
    getRootBreadcrumbs: function() {
      return [
        {
          text: this.$t(this.$store.state.settings.instance.institution),
          disabled: false,
          external: true,
          to: 'https://www.univie.ac.at'
        },
        {
          text: this.$t(this.$store.state.settings.instance.title),
          disabled: false,
          to: '/'
        }
      ]
    }
  },
  data () {
    return {
      breadcrumbs: []
    }
  }
}