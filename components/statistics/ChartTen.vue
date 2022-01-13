<template>
  <div>
    <div style="margin: 15% 0 0">
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
  data() {
    return {
      chartConfig: {
        type: "pie",
        data: {
          datasets: [
            {
              data: [92, 4, 1, 1, 1, 1],
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
          labels: [
            "Historisch-Kulturwissenschaftliche Fakultät - 92%",
            "Philologisch-Kulturwissenschaftliche Fakultät - 4%",
            "Evangelisch-Theologische Fakultät - 1%",
            "Sozialwissenschaftliche Fakultät - 1%",
            "Zentrum für Sportwissenschaften - 1%",
            "Fakultät für Geowissenschaften, Geographie und Astronomie - 1%",
          ],
        },
        options: {
          title: {
            text: "10. Objekte verteilt nach Fakultäten",
            display: true,
          },
          plugins: {
            datalabels: {
              display: false
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
  },
  mounted() {
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
