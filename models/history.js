const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

const historySchema = new Schema({
    userid: {
        type: 'String',
        required: true,
        trim: true,
        unique: true
    },
    searchHistory: [{
        userLocation: 'String',
        searchfor: 'String',
        searchResults: [{
            name: 'String',
            vicitiny: 'String',
            rating: 'String'
        }]
    }]
});


module.exports = mongoose.model('History', historySchema);