// Chart Interface
export interface IFilter {
   serieId   : number;
   measure   : string;
   locations : string [];
   scenarios : string [];
}

export class Filter implements IFilter{
   serieId   : number;
   measure   : string;
   locations : string [];
   scenarios : string []; 
   constructor(_serieId, _measure, _locations, _scenarios){
    this.serieId   = _serieId;
    this.measure   = _measure;
    this.locations = _locations;
    this.scenarios = _scenarios;
   }
}