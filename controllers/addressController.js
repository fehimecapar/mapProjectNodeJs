const Address = require('../models/Address')
const Coordinate = require('../models/Cordinates')

const { MongoClient } = require("mongodb");
// Get all Address
exports.getAddress = async (req, reply) => {
  var url = "mongodb://localhost:27017/sampledata?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
  const client = new MongoClient(url)//mongoClient çağırarak arka tarafta mongodb açılır
  await client.connect();//connection
  try {

    /*
    bu kodları 1 kere çalıştırarak mahalleler ve latln_mahalleler tablolarını lookup fonksiyonunu kullanarak birleştirdim
    daha sonra aggregate fonksiyonunun sonunda sampledata db'si içinde alldata şeklinde collection oluşturdum. bu collection içine
    verilerin birleştirilmesiyle oluşan tabloyu ekledim. Bunu için insertMany fonksiyonunu kullandım. Bu kod satırlarını sadece 1 kere
    çslıştırarak tablo birleştirme ve mongo'ya ekleme işlemi yapılabilir. Birden fazla kez çalıştırmak gerek değildir.
    */
    // const database = client.db("sampledata");
    // const data = database.collection('mahalleler').aggregate([
    //           { $lookup:
    //             {
    //               from: 'latlng_mahalleler',
    //               localField: '_id',
    //               foreignField: '_id',
    //               as: 'addressdetails'
    //             }
    //           }
    //         ]).toArray(function(err, res) {
    //                 if (err) throw err;
    //                 const data2 = database.collection('alldata2').insertMany(res, function(err, res2) {
    //                   if (err) throw err;
    //                   console.log("Number of documents inserted: " + res2.insertedCount);

    //                 });
    //                 reply.send(res)//response değeer olarak veriler döndürülür
    //               });



  }
  catch (err) {
    console.log(err);
  }
}