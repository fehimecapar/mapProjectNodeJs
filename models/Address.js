const mongoose = require('mongoose')
const Schema = mongoose.Schema

const addressSchema = new mongoose.Schema({
    _id: {
        type: String,
        
    },
    il_adi: {
        type: String,
        
    },
    il_id: {
        type: String,
        
    },
    ilce_adi: {
        type: String,
        
    },
    ilce_id: {
        type: String,
        
    },
    mahalle_adi: {
        type: String,
        
    },
    
},
{collection: 'mahalleler'})

module.exports = mongoose.model('Mahalleler', addressSchema)

