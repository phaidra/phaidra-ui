<template>
  <div>
    <div style="margin: 0% 0 6%">
        <div class="row" style="justifyContent: space-between; alignItems: center">
          <div class="titletext primary--text">6. Objekte verteilt nach Disziplinen</div>
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
import { commonChart } from '../../mixins/commonChart'
export default {
  data() {
    return {
      chartConfig: {
        type: "pie",
        data: {
          datasets: [
            {
              data: [65, 13, 11, 6, 6],
              backgroundColor: [
                "rgb(1, 92, 162)",
                "rgb(162, 27, 65)",
                "rgb(244, 166, 29)",
                "rgb(1, 133, 117)",
                "rgb(219, 65, 37)",
              ],
            },
          ],
          labels: [
            "Digital Humanities",
            "MINT Fächer",
            "Sozialwissenschaften",
            "Lebenswissenschaften",
            "Rest",
          ],
        },
        options: {
          title: {
            text: "6. Objekte verteilt nach Disziplinen",
            display: true,
          },
          plugins: {
            datalabels: {
              color: "white",
              formatter: (value) => {
                return value + "%";
              },
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
      chartSrc: ""
    };
  },
  mixins: [commonChart],
  methods: {
    exportChart() {
      this.generateChartUrl(this.chartConfig, 280);
    },
    getChartSrc() {
      this.chartSrc = this.generateChartSrc(this.chartConfig, 280);
      this.$store.dispatch("setCharts", this.generateChartSrc(this.chartConfig, 280, true));
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
