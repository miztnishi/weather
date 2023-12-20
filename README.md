## フロント
1.  国土地理院からファイルのダウンロード
   
    ```cd front```  
    ```curl https://maps.gsi.go.jp/js/muni.js -o muni.js ```
        muni.jsをtsファイルに変更
        中身をオブジェクトに変更
3. パッケージのダウンロード
	```npm i```
4. 起動
	```npm run dev```

## バックエンド
1. 国土地理院からファイルのダウンロード(https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html)
	都道府県のデータをダウンロード。server/geo-jsons/以下に保存

2. パッケージのダウンロード
	```npm i```

3. サーバー起動
	```node app.js```


https://github.com/miztnishi/weather/assets/45161913/5ebd316e-e9e7-4eb9-84aa-44d0bb6abe32

