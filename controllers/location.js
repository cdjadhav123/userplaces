var gapikey = process.env.GAPI_KEY;
var qapikey = process.env.QAPI_KEY;
var https = require('follow-redirects').https;
const History = require('../models/history');

module.exports = {
    places: (req, res) => {

        //Step 1: Get coordinates based on the entered place name and location of the User.
        const location = req.body? req.body.location : 0;
        const searchTag = req.body? req.body.searchParam : 0;

        var placeDetails = function() {
            this.places = [];
        }

        https.request({
                host: 'www.mapquestapi.com',
                path: encodeURI('/geocoding/v1/address?key=' + qapikey + '&location=' + location),
                method: 'GET'},
            CoordinateResponse).end();


        //Step 2: Get Latitude and Longitude of the entered place.
        function CoordinateResponse(response) {
            var data = "";
            var sdata = "";
            var latitude = "";
            var longitude = "";

            response.on('data', function(chunk) {
                data += chunk;
            });

            response.on('end', function() {
                sdata = JSON.parse(data);
                latitude = sdata.results[0].locations[0].displayLatLng.lat;
                longitude = sdata.results[0].locations[0].displayLatLng.lng;
                placeSearch(latitude, longitude, 50000);
            });
        }

        //Step 3: Find places within the specified radius, based on the coordinates provided by the getCoordinates function.

        function placeSearch(latitude, longitude, radius) {
            //Uncomment if using Google API
            // let link = '/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&radius=' + radius + '&type=' + searchTag +'&key=' + gapikey;
            // https.request({
            //         host: 'maps.googleapis.com',
            //         path: link,
            //         method: 'GET'},
            //     PlaceResponse).end();

            // Mapquest API
            let path_name = '/search/v2/radius?key=' + qapikey +'&maxMatches=4&origin=' + latitude + ',' + longitude + '&hostedData=mqap.ntpois|name LIKE ?|%'+ searchTag + '%';
            https.request({
                    host: 'www.mapquestapi.com',
                    path: encodeURI(path_name),
                    method: 'GET'},
                PlaceResponse).end();
        }

        //Step 4: Get the places nearby the user location and store the result in database.

        function PlaceResponse(response) {
            var p;
            var data = "";
            var sdata = "";
            var PD = new placeDetails();
            let result = {};
            let status = 201;

            response.on('data', function(chunk) {
                data += chunk;
            });
            response.on('end',async function() {
                sdata = JSON.parse(data);
                if (sdata.info.statusCode === 0) {
                    if(sdata.resultsCount !== 0)
                    {
                        for (p = 0; p < sdata.searchResults.length; p++) {
                            let name = sdata.searchResults[p].name;
                            let vicinity = sdata.searchResults[p].fields.address;
                            let rating = 10;
                            let resultObj = {
                                name: name,
                                vicinity: vicinity,
                                rating: rating
                            }
                            PD.places.push(resultObj);
                        }

                        const userData = req.decoded;
                        const userLocation = req.body.location;
                        const searchTerm = req.body.searchParam;
                        const userId = userData.id;
                        const searchRecord = {
                            userLocation:userLocation,
                            searchfor:searchTerm,
                            searchResults: PD.places
                        };

                        const query = {userid:userId};
                        const updateHistory = await History.findOneAndUpdate(query, { $push: { searchHistory: searchRecord }}, { new: true });

                        if(updateHistory) {
                            result.status = status;
                            result.result = updateHistory;
                            res.status(status).send(result);
                        } else {
                            let history = new History({
                                userid:userId,
                                searchHistory : [searchRecord]
                            });
                            history.save((err, history) => {
                                if (!err) {
                                    result.status = status;
                                    result.result = history;
                                } else {
                                    status = 500;
                                    result.status = status;
                                    result.error = err;
                                }
                                res.status(status).send(result);
                            });
                        }
                    }
                    else
                    {
                        res.json('No results found');
                    }
                } else {
                    console.log(sdata.info.statusCode);
                }

            });
        }


    }


}