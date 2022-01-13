import QuickChart from 'quickchart-js'

export const commonChart = {
  methods: {
    generateChartSrc (config, height = 330, title = false) {
      config.options.title.display = title
      const myChart = new QuickChart()
      myChart.setConfig(config)
      myChart.setHeight(height)
      return myChart.getUrl()
    },

    generateChartUrl (config, height) {
      config.options.title.display = true
      const myChart = new QuickChart()
      myChart.setFormat('pdf')
      if (height) {
        myChart.setHeight(height)
      } else {
        myChart.setHeight(330)
      }
      myChart.setConfig(config)

      const url = myChart.getUrl()
      fetch(url)
        .then(res => res.blob())
        .then((blob) => {
          const objectURL = URL.createObjectURL(blob)
          window.open(objectURL, { target: '_blank' })
        })
    }
  }
}
