<template>
  <div>
    <div style="margin: 15% 0 6%">
      <div class="row">
        <h3 class="font-weight-light primary--text">Unidam</h3>
      </div>
        <div class="row" style="justifyContent: space-between; alignItems: center">
          <div class="titletext primary--text">3. Objekte pro Jahr in Unidam</div>
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
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              label: "Objects",
              data: [],
              backgroundColor: "rgb(243, 167, 29)",
            },
          ],
        },
        options: {
          title: {
            text: "3. Objekte pro Jahr in Unidam",
            display: true,
          },
          legend: {
            display: false,
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
    populateData() {
      let labels = [];
      let objCount = [];
      for (let key in this.chartData) {
        labels.push(+key);
        let keyValue = this.chartData[key];
        let count = 0;
        keyValue.forEach((element) => {
          count = count + element.obj_count;
        });
        objCount.push(count);
      }
      this.chartConfig.data.labels = labels;
      this.chartConfig.data.datasets[0].data = objCount;
    },
  },
  mounted() {
    this.populateData();
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
