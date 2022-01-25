<template>
  <div>
    <div style="margin: 15% 0 1%">
      <div class="row">
        <h3 class="font-weight-light primary--text">Unidam</h3>
      </div>
        <div class="row" style="justifyContent: space-between; alignItems: center">
          <div class="titletext primary--text">9. Objekte verteilt nach Objekttypen kttype</div>
          <div style="float: right">
            <v-btn
              style="float: right"
              @click="exportChart"
              color="primary"
              raised
              >{{ $t("Export") }}</v-btn
            >
          </div>
        </div>
    </div>
      <img v-if="chartSrc" :src="chartSrc" />
  </div>
</template>

<script>
import { commonChart } from "../../mixins/commonChart";
export default {
  props: ["chartData"],
  data() {
    return {
      chartConfig: {
        type: "outlabeledPie",
        data: {
          datasets: [
            {
              data: [],
                backgroundColor: [
                "rgb(1, 92, 162)",
                "rgb(244, 166, 29)",
                "rgb(148, 193, 84)",
                "rgb(167, 28, 73)",
                "rgb(107, 33, 133)",
                "rgb(244, 166, 29)",
                "rgb(1, 92, 162)",
                "rgb(255, 153, 153)",
                "rgb(233,150,122)",
                "rgb(219, 65, 37)"
              ],
            },
          ],
          labels: [],
        },
        options: {
          title: {
            text: "9. Objekte verteilt nach Objekttypen kttype",
            display: true,
          },
            plugins: {
            legend: false,
            outlabels: {
              color: "white",
              stretch: 10,
              font: {
                resizable: true,
                minSize: 8,
                maxSize: 8,
              },
            },
          },
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
            },
          },
        },
      },
      chartSrc: "",
    };
  },
  mixins: [commonChart],
  methods: {
    exportChart() {
      this.generateChartUrl(this.chartConfig);
    },
   getChartSrc() {
      this.chartSrc = this.generateChartSrc(this.chartConfig);
      this.$store.dispatch("setCharts", this.generateChartSrc(this.chartConfig, null, true));
    },
     populateData() {
      let labels = [];
      let objCount = [];
      let totalCount = 0;
      for (let key in this.chartData) {
        if(key && key !== 'all' && key !== 'start') {
          let keyValue = this.chartData[key];
          let count = 0;
          keyValue.forEach((element) => {
            count = count + element.obj_count;
          });
          totalCount = totalCount + count;
          if (count) {
            objCount.push(count);
            if(key == 'Jelinek-Katalog gesamt') {
              key = 'katalogdaten '
            }
            labels.push(key);
          }
        }
      }

      let objPerCentArr = []
      let labelsArr = []
      objCount.forEach((elem, index) => {
        let perecentValue= elem/totalCount * 100
        if(Math.round(perecentValue) > 0) {
          objPerCentArr.push(perecentValue)
          labelsArr.push(labels[index])
        }
      })

      // Rename as bilder
      let finalLabelsArr = []
      let finalObjPercentArr = []
      let bilderTotal = 0

      labelsArr.forEach((elem, index) => {
        if(elem == 'Bilder gesamt' || elem == 'Evolutionäre Anthropologie Bilder gesamt') {
          bilderTotal = bilderTotal + objPerCentArr[index]
        } else {
          finalLabelsArr.push(elem)
          finalObjPercentArr.push(objPerCentArr[index])
        }
      })
      finalLabelsArr.push('Bilder')
      finalObjPercentArr.push(bilderTotal)


      this.chartConfig.data.labels = finalLabelsArr;
      this.chartConfig.data.datasets[0].data = finalObjPercentArr;
    },
  },
  mounted() {
    this.populateData()
    this.getChartSrc();
  },
};
</script>

<style scoped>
h3 {
  font-size: 28px;
  margin-bottom: 6px;
}
.titletext {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.0125em
}
</style>
