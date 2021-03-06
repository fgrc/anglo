// Serie Interface

export interface ISerie {
    title: String;
    options:   {title: string, value: boolean} [], 
    visible:   {title: string, value: boolean} [], 
    measure:   {title: string, value: boolean} [], 
    locations: {title: string, value: boolean} [],
    scenarios: {title: string, value: boolean} []
}

export class Serie implements ISerie{
    title:     '';
    options:   [{title: 'Count', value:false},{title: 'AVG', value:true}, {title: 'Sum', value:false}];
    show:      boolean;
    measure:   [{title: '', value: false}];
    locations: [{title: '', value: false}];
    visible:   [{title: 'Only', value: false}, {title: 'Hide', value: false}];
    scenarios: [{title: 'Budget', value: false },{title: 'Real', value: true },{title: 'Predcción', value: false }];
    constructor(_measure: any, _location: any, _scenarios: any)
    {
        this.title     = '';
        this.options   = [{title: 'Count', value:false},{title: 'AVG', value:true}, {title: 'Sum', value:false}];
        this.measure   = _measure;
        this.locations = _location;
        this.scenarios = _scenarios;
        this.visible   = [{title: 'Only', value: false}, {title: 'Hide', value: false}];
        this.show      = true;
    }
}

// Chart Interface
export interface ICHart {
   serieId: number;
   title  : string;
   legend : string [];
   colors : string [];
   data   : {key: string, values: number [] } []; 
}

export class Chart implements ICHart{
   serieId: number;
   title  : string;
   legend : string [];
   colors  : string [];
   data: {key: string, values: number [] } [];
   constructor(_serieId, _title, _legend, _data){
    this.serieId = _serieId;
    this.title   = _title;
    this.legend  = _legend;
    this.data    = _data;
    this.colors  = [];
   }
}

// Crossfilter Interface
export interface ICrossfilter {
    title      : string;
    serieId    : number;
    data       : any;
    dimensions : {
        title     : string,
        dimension : any
    }[];
    groups     : any;
}

export class Crossfilter implements ICrossfilter{
    title      : string;
    serieId    : number;
    data       : any;
    dimensions : {
        title     : string,
        dimension : any
    }[];
    groups     : any;
    constructor(_title: string, _serieId: number, _data: any){
        this.title      = _title;
        this.serieId    = _serieId;
        this.data       = _data;
        this.dimensions = [];
        this.groups     = [];
    }
}
