<template>
  <div>
    <div style="margin: 0">
        <div class="row" style="justifyContent: space-between; alignItems: center">
          <div class="titletext primary--text">10. Objekte verteilt nach Fakultäten</div>
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
        type: "pie",
        data: {
          datasets: [
            {
              data: [],
              backgroundColor: [
                "rgb(1, 92, 162)",
                "rgb(162, 27, 65)",
                "rgb(244, 166, 29)",
                "rgb(1, 133, 117)",
                "rgb(219, 65, 37)",
                "rgb(143, 192, 72)",
              ],
            },
          ],
          labels: [],
        },
        options: {
          title: {
            text: "10. Objekte verteilt nach Fakultäten",
            display: true,
          },
          plugins: {
            datalabels: {
              display: false,
            },
          },
          legend: {
            position: "right",
            labels: {
              usePointStyle: true,
            },
          },
        },
      },
      chartSrc: ''
    };
  },
  mixins: [commonChart],
  methods: {
    exportChart() {
      this.generateChartUrl(this.chartConfig, 230);
    },
    getChartSrc() {
      this.chartSrc = this.generateChartSrc(this.chartConfig, 230);
      this.$store.dispatch("setCharts", this.generateChartSrc(this.chartConfig, 230, true));
    },
    populateData() {
      let labels = [];
      let objCount = [];
      let totalCount = 0;
      for (let key in this.chartData) {
        if(key) {
          let keyValue = this.chartData[key];
          let count = 0;
          keyValue.forEach((element) => {
            count = count + element.obj_count;
          });
          if (count) {
            totalCount = totalCount + count;
            objCount.push(count);
            labels.push(key);
          }
        }
      }
      let objCountinPrecentage = objCount.map((elem) => {
         return Math.round((elem / totalCount) * 100)
      })
       let labelswithPercentage = labels.map((elem, index) => {
         return `${elem} - ${objCountinPrecentage[index]}%`
      })
      this.chartConfig.data.labels = labelswithPercentage;
      this.chartConfig.data.datasets[0].data = objCountinPrecentage;
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
