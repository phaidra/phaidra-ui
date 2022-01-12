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
              data: [93, 4, 1, 1, 1, 1],
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
            "Historisch-Kulturwissenschaftliche Fakultät",
            "Philologisch-Kulturwissenschaftliche Fakultät",
            "Evangelisch-Theologische Fakultät",
            "Sozialwissenschaftliche Fakultät",
            "Zentrum für Sportwissenschaften",
            "Fakultät für Geowissenschaften, Geographie und Astronomie",
          ],
        },
        options: {
          title: {
            text: "10. Objekte verteilt nach Fakultäten",
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
      chartSrc: ''
    };
  },
  mixins: [commonChart],
  methods: {
    exportChart() {
      this.generateChartUrl(this.chartConfig, 230);
    },
    getChartSrc() {
      let chartSrc = this.generateChartSrc(this.chartConfig, 230);
      this.$store.dispatch("setCharts", chartSrc);
      this.chartSrc = chartSrc;
    },
  },
  mounted() {
    this.getChartSrc();
  },
};
</script>
