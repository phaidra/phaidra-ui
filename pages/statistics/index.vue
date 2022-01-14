<template>
  <div v-if="phaidraData.length && localPhaidraData">
    <v-btn
      class="my-5"
      @click="exporCharts"
      color="primary"
      raised
      >{{ $t("Export All") }}</v-btn
    >
    <StatisticsChartOne v-if="localPhaidraData" :phaidraData="phaidraData" :localPhaidraData="localPhaidraData"/>
    <StatisticsChartTwo :chartData="groupedbyYear" />
    <StatisticsChartThree :chartData="groupedbyYear" />
    <StatisticsChartFour :chartData="groupedbyObjects"/>
    <StatisticsChartFive :chartData="groupedbyObjects"/>
    <StatisticsChartSix />
    <StatisticsChartSeven :chartData="groupedbyYear"/>
    <StatisticsChartEight :chartData="groupedbyYear"/>
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
      phaidraData: [],
      localPhaidraData: null,
      groupedbyYear: {},
      groupedbyObjects: {},
      phaidraLocalUrl: 'https://services.phaidra-temp.univie.ac.at/api/stats/aggregates'
    };
  },
  methods: {
    exporCharts() {
      this.allCharts = this.$store.state.chartsUrl;
      var doc = new jsPDF("p", "mm", [1380, 215]);
      let yAxis = 30;
      this.allCharts.forEach((elem, index) => {
        var img = new Image();
        img.src = elem;
        img.crossOrigin = "";

        if(index == 3 || index == 4) {
          doc.addImage(img, "JPEG", 10, yAxis, 180, 155);
          yAxis = yAxis + 150;
        }
        else if(index == 9) {
          doc.addImage(img, "JPEG", 10, yAxis, 180, 80);
          yAxis = yAxis + 90;
        }
        else {
          doc.addImage(img, "JPEG", 10, yAxis, 180, 100);
          yAxis = yAxis + 120;
        }
      });

      window.open(doc.output("bloburl"), "_blank");
      // doc.save("abc.pdf");
    },

    groupbyYear() {
      const group = this.phaidraData.reduce((r, a) => {
        r[a.upload_date] = [...(r[a.upload_date] || []), a];
        return r;
      }, {});
      this.groupedbyYear = group;

      console.log('group', group)
    },

    groupbyObjects() {
      const group = this.phaidraData.reduce((r, a) => {
        r[a.model] = [...(r[a.model] || []), a];
        return r;
      }, {});
      this.groupedbyObjects = group;
    },

    async getLocalPhaidraData() {
      try {
        let res = await axios.get(this.phaidraLocalUrl);
        if (res.status == 200) {
          console.log(res.data.stats);
          this.localPhaidraData = res.data.stats;
        }
        this.$store.commit("setLoading", false);
      } catch (err) {
        this.localPhaidraData = []
        this.$store.commit("setLoading", false);
        console.log(err);
      }
    },


    async getPhaidraData() {
      try {
        this.$store.commit("setLoading", true);
        let res = await axios.get(
          configjs.instances[configjs.defaultinstance].api + "/stats/aggregates"
        );
        if (res.status == 200) {
          console.log(res.data.stats);
          this.phaidraData = res.data.stats;

          this.getLocalPhaidraData()
          //groupbyYear
          this.groupbyYear();
          this.groupbyObjects()
        }
      } catch (err) {
        this.$store.commit("setLoading", false);
        console.log(err);
      }
    }
  },
  mounted() {
    this.getPhaidraData();
  },
};
</script>
