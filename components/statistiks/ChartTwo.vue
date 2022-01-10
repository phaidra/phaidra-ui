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
              backgroundColor: "rgb(1,92,162)",
            },
          ],
        },
        options: {
          title: {
            text: "2. Objekte pro Jahr in Phaidra LZA",
            display: true,
          },
          legend: {
            display: false,
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
      let chartSrc = this.generateChartSrc(this.chartConfig);
      this.$store.dispatch("setCharts", chartSrc);
      this.chartSrc = chartSrc;
    },
    populateData() {
      let labels = [];
      let objCount = []
      for (let key in this.chartData) {
        labels.push(+key);
        let keyValue = this.chartData[key]
        let count = 0
        keyValue.forEach(element => {
          count = count + element.obj_count
        });
        objCount.push(count)
      }
      this.chartConfig.data.labels = labels;
      this.chartConfig.data.datasets[0].data = objCount
    }
  },
  mounted() {
    this.populateData();
    this.getChartSrc();
  },
};
</script>
