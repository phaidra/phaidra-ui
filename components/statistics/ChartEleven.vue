<template>
  <div>
    <div style="margin: 15% 0 6%">
      <div class="row">
        <h3 class="font-weight-light primary--text">Unidam</h3>
      </div>
        <div class="row" style="justifyContent: space-between; alignItems: center">
          <div class="titletext primary--text">11. Zuwachs des Objekte über die Jahre</div>
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
        type: "line",
        data: {
          labels: ['Initial', 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018],
          datasets: [
            {
              data: [1800, 2000, 3000, 3900, 4500, 5500, 6000, 6500, 7000, 7500, 7700, 7800, 7900],
              fill: true,
              backgroundColor: 'rgb(243, 166, 29)',
              borderColor: 'rgb(243, 166, 29)',
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
            text: '11. Zuwachs des Objekte über die Jahre',
            display: true
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
      chartSrc: ""
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

