<template>
  <div>
    <div style="margin: 15% 0 6%">
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
  data() {
    return {
      chartConfig: {
        type: "pie",
        data: {
          datasets: [
            {
              data: [99, 1],
              backgroundColor: ["rgb(1, 92, 162)", "rgb(143, 192, 72)"],
            },
          ],
          labels: ["Bilder", "Video"],
        },
        options: {
          title: {
            text: "9. Objekte verteilt nach Objekttypen kttype",
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
