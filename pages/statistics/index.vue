<template>
  <div v-if="chartData.length">
    <v-btn
      class="my-5"
      @click="exporCharts"
      color="primary"
      raised
      >{{ $t("Export All") }}</v-btn
    >
    <StatisticsChartOne />
    <StatisticsChartTwo :chartData="groupedbyYear" />
    <StatisticsChartThree :chartData="groupedbyYear" />
    <StatisticsChartFour :chartData="groupedbyObjects"/>
    <StatisticsChartFive :chartData="groupedbyObjects"/>
    <StatisticsChartSix />
    <StatisticsChartSeven />
    <StatisticsChartEight />
    <StatisticsChartNine />
    <StatisticsChartTen />
    <StatisticsChartEleven />
  </div>
</template>

<script>
import configjs from "../../config/phaidra-ui";
import axios from "axios";
const { jsPDF } = require("jspdf");
export default {
  data() {
    return {
      allCharts: [],
      chartData: [],
      groupedbyYear: {},
      groupedbyObjects: {},
    };
  },
  methods: {
    exporCharts() {
      this.allCharts = this.$store.state.chartsUrl;
      var doc = new jsPDF("p", "mm", [1250, 215]);
      let yAxis = 30;
      this.allCharts.forEach((elem, index) => {
        var img = new Image();
        img.src = elem;
        img.crossOrigin = "";

        if(index == 3 || index == 4) {
          doc.addImage(img, "JPEG", 10, yAxis, 180, 180);
          yAxis = yAxis + 40;
        } else {
          doc.addImage(img, "JPEG", 10, yAxis, 180, 100);
        }
        yAxis = yAxis + 110;
      });

      window.open(doc.output("bloburl"), "_blank");
      // doc.save("abc.pdf");
    },

    groupbyYear() {
      const group = this.chartData.reduce((r, a) => {
        r[a.upload_date] = [...(r[a.upload_date] || []), a];
        return r;
      }, {});
      this.groupedbyYear = group;
    },

    groupbyObjects() {
      const group = this.chartData.reduce((r, a) => {
        r[a.model] = [...(r[a.model] || []), a];
        return r;
      }, {});
      this.groupedbyObjects = group;
    },

    async getChartData() {
      try {
        let res = await axios.get(
          configjs.instances[configjs.defaultinstance].api + "/stats/aggregates"
        );
        if (res.status == 200) {
          console.log(res.data.stats);
          this.chartData = res.data.stats;

          //groupbyYear
          this.groupbyYear();
          this.groupbyObjects()
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  mounted() {
    this.getChartData();
  },
};
</script>
