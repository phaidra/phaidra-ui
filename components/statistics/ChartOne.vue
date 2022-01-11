<template>
  <div>
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
        type: "horizontalBar",
        data: {
          labels: ["Phaidra LZA", "Unidam"],
          datasets: [
            {
              label: "Objects",
              data: [878.713, 521.024],
              backgroundColor: "rgb(1,92,162)",
            }
          ],
        },
        options: {
          title: {
            text: "1. Anzahl der Objekt in den Repositorien",
            display: true,
          },
          legend: {
            display: false,
          },
          plugins: {
            datalabels: {
              anchor: "end",
              align: "center",
              color: "black",
            },
          },
        },
      },
      chartSrc: "",
    };
  },
  mixins: [commonChart],
  computed: {},
  methods: {
    exportChart() {
      this.generateChartUrl(this.chartConfig);
    },
    getChartSrc() {
      this.$store.dispatch("clearCharts");
      let chartSrc = this.generateChartSrc(this.chartConfig);
      this.$store.dispatch("setCharts", chartSrc);
      this.chartSrc = chartSrc;
    },
  },
  mounted() {
    this.getChartSrc();
  },
};
</script>
