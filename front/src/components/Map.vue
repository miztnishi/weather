<template>
  <div class="main d-flex flex-row">
    <v-row>
      <v-col cols="9">
        <div style="height:800px; width:auto">
          <l-map ref="map" v-model:zoom="zoom" :use-global-leaflet="false" :max-bounds="maxBounds" :center="center" @click="click">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
            <l-geo-json :geojson="geojson" :options-style="geoStyler" />
          </l-map>
        </div>
      </v-col>
      <v-col cols="3">

        <v-row no-gutters class="line">
          <span>緯度{{ geo.lat }}</span>
          <span> 経度:{{ geo.lng }} </span>
        </v-row>
        <v-row no-gutters>
          <span>{{ prefectureName }} </span>
        </v-row>
        <v-row no-gutters class="line">
          <span v-for="(n, index) in weather">
            {{ format(n) }}
          </span>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";
import axios from "axios"
import { MUNI } from '../../muni';
interface Datatype {
  zoom: number,
  center: number[],
  geo: { lat: number, lng: number },
  maxBounds: number[][],
  weather: { time: string, temperature: number }[],
  prefectureName: string,
  geojson: any,
  geoStyler: any
  // test: string
}
export default {
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },

  data(): Datatype {
    return {
      zoom: 5,
      center: [35.68630240145625, 139.77081298828128],
      geo: { lat: 0, lng: 0 },
      maxBounds: [
        [52.32191088594773, 157.92266776502268],
        [24.686952411999155, 124.10156250000001],
        [43.13306116240615, 145.76660156250003],
      ],
      weather: [],
      prefectureName: "",
      // test: ""
      geojson: undefined,
      geoStyler: (feature: { properties: { code: number; }; }) => ({
        opacity: feature.properties.code / 100000,
      }),

    };
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    format(value: { time: string, temperature: number }) {
      try {
        const dateType = (new Date(value.time))
        return `${dateType.getMonth() + 1}/${dateType.getDate()} ${dateType.getHours()}時 : ${value.temperature}℃`
      } catch (error) {
        return ""
      }
    },
    async click(e: any) {

      this.geo.lat = e.latlng.lat
      this.geo.lng = e.latlng.lng
      this.weather = []
      this.prefectureName = ""

      const prefectureRes = await axios.get(" https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress", {
        params: {
          "lat": this.geo.lat,
          "lon": this.geo.lng,
        }
      })

      if ("results" in prefectureRes.data as any) {
        const resMuniCd = (prefectureRes.data as any).results.muniCd
        // miniCdの先頭の0を削除が必要らしい
        const muniCd = resMuniCd.substring(0, 1) === "0" ? resMuniCd.slice(1) : resMuniCd;
        const muniArray = MUNI.OBJ[muniCd].split(",")
        this.prefectureName = `${muniArray[1]}: ${muniArray[3]}`

        this.geojson = (await axios.get(`http://localhost:8081/city/${resMuniCd}`)).data.result

        console.log(this.geojson)
        const weatherRes = await axios.get("https://api.open-meteo.com/v1/forecast", {
          params: {
            "latitude": this.geo.lat,
            "longitude": this.geo.lng,
            "hourly": "temperature_2m",
            "forecast_days": 1
          }
        })
        // this.test = (weatherRes.data as any)

        const weatherData = (weatherRes.data as any).hourly
        const times = (weatherData.time) as string[]
        const temperatures = (weatherData.temperature_2m) as number[]
        times.forEach((v, idx) => {
          this.weather.push({
            time: v,
            temperature: temperatures[idx]
          })
        })
      } else {
        this.prefectureName = "都道府県を選択してください"
      }
    }
  }
};
</script>

<style>
.line {
  width: 200px;
}
</style>
