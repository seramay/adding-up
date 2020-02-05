'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv')
const rl = readline.createInterface({'input':rs, 'output':{}});
const map = new Map();       //key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {
   const columns = lineString.split(',');
   const year = parseInt(columns[0]);
   const prefecture = columns[2];
   const popu = parseInt(columns[7]);
   if (year === 2010 || year === 2015){
       let value = map.get(prefecture);
       if (!value) {
           value = {
              popu10: 0,
              popu15: 0,
              change: null
          };
       }    
       if (year === 2010){
           value.popu10 += popu;
       }
       if (year === 2015){
           value.popu15 += popu;
       }
       map.set(prefecture, value);
   }
});
rl.resume();
rl.on('close', () => {                              // ここからの計算部分のコードを改変して減った割合のランキングにしていく
    for (let pair of map){
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;               //　昇順にする為 pair を入れ替え
    });
    const rankingString = rankingArray.map((pair, i) => {       //　第二引数[i]で各要素の添字を取得
        return (i + 1) + '位 ' + pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率' + pair[1].change;
    });　　　//添字は0からなので1足して順位の数値として表示。
    console.log(rankingString);
});

/* 　集計データと並べ替え時のコード

'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv')
const rl = readline.createInterface({'input':rs, 'output':{}});
const map = new Map();                      //key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {
   const columns = lineString.split(',');　　//置換1.の時点では無名関数の中身は　console.log(lineString);　のみ
   const year = parseInt(columns[0]);
   const prefecture = columns[2];
   const popu = parseInt(columns[7]);
   if (year === 2010 || year === 2015){
       let value = map.get(prefecture);     //置換2. console.log(year);
       if (!value) {                        //置換2. console.log(prefecture);
           value = {                         //置換2. console.log(popu);
              popu10: 0,
              popu15: 0,
              change: null
          };
       }    
       if (year === 2010){
           value.popu10 += popu;
       }
       if (year === 2015){
           value.popu15 += popu;
       }
       map.set(prefecture, value);
   }
});
rl.resume();
rl.on('close', () => {
    for (let pair of map){                                      //置換3. console.log(map);
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingString = rankingArray.map((pair) => {
        return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率' + pair[1].change;
    });
    console.log(rankingString);                                 //置換4. console.log(rankingArray);
});

*/