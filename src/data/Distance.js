export default class Distance{

    constructor(){
        this.meters = 0;
    }

    get m(){
        return this.meters;
    }

    get km(){
        return this.meters/1000;
    }

    static fromMeters(m){
        let d = new Distance();
        d.meters = m;
        return d;
    }

}