<template>
  <div>
    <div style="margin: 7% 0 6%">
        <div class="row" style="justifyContent: space-between; alignItems: center">
          <div class="titletext primary--text">1. Anzahl der Objekt in den Repositorien</div>
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
      this.chartSrc = this.generateChartSrc(this.chartConfig);
      this.$store.dispatch("setCharts", this.generateChartSrc(this.chartConfig, null, true));
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
