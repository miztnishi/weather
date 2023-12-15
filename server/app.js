const express = require('express')
const app = express()
const cors = require('cors');

const fs = require('fs')
app.use(cors())

app.listen(8081, () => {
    console.log("サーバー起動");
});


//GETリクエストの設定
//id:muniCd
app.get(`/city/:id`, (req, res) => {

    const muniCd = req.params.id
    const cityId = req.params.id.substring(0, 2)
    const filePath = `geo-jsons/N03-23_${cityId}_230101.json`
    const cityJson = JSON.parse(fs.readFileSync(filePath))
    const selectedCityGeoList = []
    for (const feature of cityJson["features"]) {
        if (feature["properties"]["N03_007"] === muniCd) {
            selectedCityGeoList.push(feature["geometry"])
        }
    }
    res.json({ result: selectedCityGeoList });
    res.end();
})


