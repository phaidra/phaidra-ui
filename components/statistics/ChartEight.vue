<template>
  <div>
    <div style="margin: 15% 0 6%">
        <div class="row" style="justifyContent: space-between; alignItems: center">
          <div class="titletext primary--text">8. Zuwachs des Speicherplatzes über die Jahre</div>
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
        type: "line",
        data: {
          labels: [
            2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018,
          ],
          datasets: [
            {
              data: [
                0, 1000, 1500, 1950, 3000, 3800, 4200, 4500, 5000, 5900, 7500,
              ],
              fill: true,
              backgroundColor: "rgb(1, 92, 162)",
              borderWidth: 1,
              pointRadius: 0,
            },
          ],
        },
        options: {
          legend: {
            display: false,
          },
          title: {
            text: "8. Zuwachs des Speicherplatzes über die Jahre",
            display: true,
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: false,
                },
              },
            ],
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
