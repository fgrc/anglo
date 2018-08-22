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
   constructor(serieId, measure, locations, scenarios){
    this.serieId   = serieId;
    this.measure   = measure;
    this.locations = locations;
    this.scenarios = scenarios;
   }
}