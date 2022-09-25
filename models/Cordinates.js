const mongoose = require('mongoose')
const cordinateSchema = new mongoose.Schema({
    _id: {
        type: String,
        
    },
    data: [{
        lat:{
            type: String,
        },
        lng:{
            type: String,
        }  ,
        mahalle_id:{
            type: String,
        },
    }],
  
},
{collection: 'latlng_mahalleler'})
module.exports = mongoose.model('Latlng_mahalleler', cordinateSchema)