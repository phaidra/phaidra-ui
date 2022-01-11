import QuickChart from 'quickchart-js'

export const commonChart = {
  methods: {
    generateChartSrc (config, height) {
      const myChart = new QuickChart()
      myChart.setConfig(config)
      if (height) {
        myChart.setHeight(height)
      } else {
        myChart.setHeight(330)
      }
      return myChart.getUrl()
    },

    generateChartUrl (config, height) {
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
