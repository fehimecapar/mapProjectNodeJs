const Coordinate = require('../models/Cordinates')
const { MongoClient, ConnectionClosedEvent } = require("mongodb");
const unidecode = require('unidecode');

var url = "mongodb://localhost:27017/sampledata?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const client = new MongoClient(url)//mongoClient çağırarak arka tarafta mongodb açılır

// Get all Address
exports.getCoordinate = async (req, reply) => {
  await client.connect();//connection
  try {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("sampledata");
      dbo.collection("alldata2").find({}).toArray(function (err, result) {
        if (err) throw err;
        const lat = result[1].addressdetails[0].data.lat;
        const lng = result[1].addressdetails[0].data.lng;
        const mahalle_id = result[1].addressdetails[0].data.mahalle_id;
        console.log(lat, lng, mahalle_id);
        dbo.collection("mahalleler").find({}).toArray(function (err, result_mhl) {
          if (err) throw err;
          const id_mahalleler = result_mhl[1]._id;
          console.log("mahalle_id:", id_mahalleler)
          if (mahalle_id == id_mahalleler) {
            const sehir = result_mhl[1].il_adi;
            const ilce = result_mhl[1].ilce_adi;
            const mahalle = result_mhl[1].mahalle_adi;
            reply.send({ "il": sehir, "ilce": ilce, "mahalle": mahalle, "lat": lat, "lng": lng });
          }
        });
      });
    });

  } catch (err) {
    console.log(err);
  }
}
exports.postCoordinate = async (req, reply) => {
  await client.connect();//connection
  try {

    MongoClient.connect(url, async function (err, db) {
      if (err) throw err;

      var dbo = db.db("sampledata");
      //console.log(req.body);

      let key = unidecode(req.body.key1);
      let split_string = key.split(" ");//parçalanan string diziye atanır
      console.log(split_string.includes("mahallesi"));//how to use includes methods
      console.log(split_string);
      console.log(key)
      let city = "";
      let district = "";
      let town = "";
      let split_string_length = split_string.length;//dizinin uzunluğu bulunur
      console.log(split_string_length);
      if (split_string.includes("mahallesi") == true || split_string.includes("mahallesı") == true || split_string.includes("MAHALLESİ") == true || split_string.includes("MAHALLESI") == true) {
        //await 
        for (var i = 0; i < split_string_length; i++) {
          let deger = split_string[i];
          if(city == "" || district == ""){
          await dbo.collection("alldata2").find({ il_adi: deger.toUpperCase() }).limit(1).toArray(function (err, result) {
            if (result != [] && city == "") {
              console.log("atama öncesi city: ", city);
              city = deger;
              console.log("atama sonrası city: ", city);
              result = [];
            }
          });
          await dbo.collection("alldata2").find({ ilce_adi: deger.toUpperCase() }).limit(1).toArray(function (err, result) {
            if (result != [] && district == "") {
              console.log("atama öncesi district: ", district)
              district = deger;
              console.log("atama sonrası district: ", district); 
              result = [] ;
            }
          });
        
        }
          
        }
        console.log("for dışı district: ",district);
        if(district == '' && city == '') {
          dbo.collection("alldata2").find({ mahalle_adi: key.toUpperCase() }).limit(1).toArray(function (err, result) {
            if (result != []) {
              reply.send(result);
            }
          });
        }
        else if(district != '' && city == '') {
          console.log("buraya girmesi gerek");
          console.log("atama sonrası district 2: ", district);
          key = key.replace(district, '');
          console.log("district cikarilince key: ", key);
          dbo.collection("alldata2").find({ $and: [{ ilce_adi: district.toUpperCase() }, { mahalle_adi: key.toUpperCase() }] }).limit(1).toArray(function (err, result) {
            reply.send(result);
          });
        }
        else if(district == '' && city != '') {
          console.log("atama sonrası city 2: ", city);
          key = key.replace(city, '');
          console.log("city cikarilinca: ", key);
          dbo.collection("alldata2").find({ $and: [{ il_adi: city.toUpperCase() }, { mahalle_adi: key.toUpperCase() }] }).limit(1).toArray(function (err, result) {
            reply.send(result);
          });
        }
        else{
          console.log(city);
          console.log(district);
          key = key.replace(city, '');
          key = key.replace(district, '');
          console.log("city ve district çıkarılınca ", key);
          dbo.collection("alldata2").find({ $and: [{ il_adi: city.toUpperCase() }, { ilce_adi: district.toUpperCase() }, { mahalle_adi: key.toUpperCase() }] }).limit(1).toArray(function (err, result) {
            reply.send(result);
          });
        }
      }
      else {
        dbo.collection("alldata2").find({ $or: [{ il_adi: key.toUpperCase() }, { ilce_adi: key.toUpperCase() }, { mahalle_adi: key.toUpperCase() }] }).limit(1).toArray(function (err, result) {
          //burada bir şeyler yapacağım
          if (result != []) {
            reply.send(result);
          }
        });
      }

      //vue tarafından gelen obj içinde key isimlerinin varlığı kontrol edilir.
      // if ("key1" in req.body == true && "key2" in req.body == false && "key3" in req.body == false) {
      //   let key1 = unidecode(req.body.key1);
      //   dbo.collection("alldata2").find({ $or: [{ il_adi: key1.toUpperCase() }, { ilce_adi: key1.toUpperCase() }, { mahalle_adi: key1.toUpperCase() }] }).limit(1).toArray(function (err, result) {
      //    //burada bir şeyler yapacağım
      //     console.log(result);
      //     reply.send(result);  
      //   });
      // }
      // //şimdilik buraları pas geç
      // //db'ye git il ve ilçeyi çıkar geri kalan sonuç senin mahalle değerin olacak.
      // else if ("key1" in req.body == true && "key2" in req.body == true && "key3" in req.body == false) {
      //   let key1 = unidecode(req.body.key1);
      //   let key2 = unidecode(req.body.key2);

      //   dbo.collection("alldata2").find({ $or: [{ $and: [{ il_adi: key1.toUpperCase() }, { ilce_adi: key2.toUpperCase() }] }, { $and: [{ il_adi: key2.toUpperCase() }, { ilce_adi: key1.toUpperCase() }] }, { $and: [{ il_adi: key1.toUpperCase() }, { mahalle_adi: unidecode(key2 + ' mahallesi').toUpperCase() }] }, { $and: [{ il_adi: key2.toUpperCase() }, { mahalle_adi: unidecode(key1 + ' mahallesi').toUpperCase() }] }, { $and: [{ ilce_adi: key1.toUpperCase() }, { mahalle_adi: unidecode(key2 + ' mahallesi').toUpperCase() }] }, { $and: [{ ilce_adi: key2.toUpperCase() }, { mahalle_adi: unidecode(key1 + ' mahallesi').toUpperCase() }] }] }).limit(1).toArray(function (err, result) {
      //     console.log();
      //     if(result == []){
      //       var mahalle_adi = unidecode(key1 + key2 + 'mahallesi');
      //       console.log(mahalle_adi);
      //       dbo.collection("alldata2").find({mahalle_adi: mahalle_adi.toUpperCase()}).limit(1).toArray(function (err, result) {
      //         console.log(result);
      //         reply.send(result);
      //       });
      //     }
      //     else{
      //       reply.send(result);
      //     }
      //   });
      // }
      // else {
      //   let key1 = unidecode(req.body.key1);
      //   let key2 = unidecode(req.body.key2);
      //   let key3 = unidecode(req.body.key3);

      //   dbo.collection("alldata2").find({ $or: [{ $and: [{ il_adi: key1.toUpperCase() }, { ilce_adi: key2.toUpperCase() }, { mahalle_adi: unidecode(key3 + ' mahallesi').toUpperCase() }] }, { $and: [{ il_adi: key1.toUpperCase() }, { ilce_adi: key3.toUpperCase() }, { mahalle_adi: unidecode(key2 + ' mahallesi').toUpperCase() }] }, { $and: [{ il_adi: key2.toUpperCase() }, { ilce_adi: key1.toUpperCase() }, { mahalle_adi: unidecode(key3 + ' mahallesi').toUpperCase() }] }, { $and: [{ il_adi: key2.toUpperCase() }, { ilce_adi: key3.toUpperCase() }, { mahalle_adi: unidecode(key1 + ' mahallesi').toUpperCase() }] }, { $and: [{ il_adi: key3.toUpperCase() }, { ilce_adi: key2.toUpperCase() }, { mahalle_adi: unidecode(key1 + ' mahallesi').toUpperCase() }] }, { $and: [{ il_adi: key3.toUpperCase() }, { ilce_adi: key1.toUpperCase() }, { mahalle_adi: unidecode(key2 + ' mahallesi').toUpperCase() }] }] }).limit(1).toArray(function (err, result) {
      //     console.log(result);
      //     reply.send(result);
      //   });
      // }
    });

  } catch (err) {
    console.log(err);
  }

}
exports.getDataSearch = async (req, reply) => {
  await client.connect();//connection
  try {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("sampledata");
      //console.log(req.query.q);
      var key_value = req.query.q.toUpperCase();
      //.distinct( "il_adi" ) --> aynı il adı geldiğinde ezsin diye bunu kullanmam gerekecek ama bu şu an doğru değil
      dbo.collection("alldata2").find({ "il_adi": { $regex: "^" + key_value + ".*" } }).limit(10).toArray(function (err, result) {
        reply.send(result)
        //console.log(result)
      });
    });
  } catch (err) {
    console.log(err);
  }
}
// Async await
// Promise
// Bunlar asenkron methodlar
// Bunlara await diyorsun
// Bekliyor işlem yaparken