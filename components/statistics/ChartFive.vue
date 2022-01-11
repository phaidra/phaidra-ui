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
        type: "outlabeledPie",
        data: {
          datasets: [
            {
              data: [],
              backgroundColor: [
                "rgb(238, 130, 238)",
                "rgb(148, 193, 84)",
                "rgb(167, 28, 73)",
                "rgb(102, 102, 102)",
                "rgb(107, 33, 133)",
                "rgb(244, 166, 29)",
                "rgb(1, 92, 162)",
                "rgb(255, 153, 153)",
                "rgb(233,150,122)"
              ],
            },
          ],
          labels: [],
        },
        options: {
          title: {
            text: "5. Objekte verteilt nach Speicherbedarf*",
            display: true,
          },
          plugins: {
            legend: false,
            outlabels: {
              text: "%l %p",
              color: "white",
              stretch: 5,
              font: {
                resizable: true,
                minSize: 8,
                maxSize: 8,
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
      chartSrc: "",
    };
  },
  mixins: [commonChart],
  methods: {
    exportChart() {
      this.generateChartUrl(this.chartConfig, 500);
    },
    getChartSrc() {
      let chartSrc = this.generateChartSrc(this.chartConfig, 500);
      this.$store.dispatch("setCharts", chartSrc);
      this.chartSrc = chartSrc;
    },
    populateData() {
      let labels = [];
      let objCount = [];
      let totalCount = 0;
      for (let key in this.chartData) {
        if(key !== 'LaTeXDocument' && key !== 'Paper' && key !== 'Zombie') {
          let keyValue = this.chartData[key];
          let count = 0;
          keyValue.forEach((element) => {
            count = count + element.obj_count;
          });
          totalCount = totalCount + count;
          if (count) {
            objCount.push(count);
            labels.push(key);
          }
        }
      }
      let bookIndex = labels.findIndex(elem => elem == 'Book')
      let paperIndex = labels.findIndex(elem => elem == 'Page')
      objCount[bookIndex] = +objCount[bookIndex] + objCount[paperIndex]
      objCount.splice(paperIndex, 1)
      labels = labels.filter(elem => elem !== 'Page')
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
