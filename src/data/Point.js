/*
* Data class responsible for keeping track of 
* the points a map is made of.
*/




export default class Point{

    constructor(lat, lng) {
        this.lat = lat;
        this.lng = lng;
    }

    /**
     * Returns an array of the lat and lng in that order
     */
    get latlng(){
        return [this.lat, this.lng]
    }

}
