<template>
  <div style="margin-top: 35px">
    <v-btn
      class="my-5"
      style="float: right"
      @click="exportChart"
      color="primary"
      raised
      >{{ $t("Export") }}</v-btn
    >
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
      let chartSrc = this.generateChartSrc(this.chartConfig, 280);
      this.$store.dispatch("setCharts", chartSrc);
      this.chartSrc = chartSrc;
    },
  },
  mounted() {
    this.getChartSrc();
  },
};
</script>
