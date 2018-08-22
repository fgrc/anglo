// Serie Interface

export interface ISerie {
    title: String;
    options:   {title: string, value: boolean} [], 
    visible:   {title: string, value: boolean} [], 
    measure:   {title: string, value: boolean} [], 
    locations:  {title: string, value: boolean} [],
    scenarios: {title: string, value: boolean} []
}

export class Serie implements ISerie{
    title:     '';
    options:   [{title: 'Count', value:false},{title: 'AVG', value:true}, {title: 'Sum', value:false}];
    measure:   [{title: '', value: false}];
    locations: [{title: '', value: false}];
    visible:   [{title: 'Only', value: false}, {title: 'Hide', value: false}];
    scenarios: [{title: 'Budget', value: false },{title: 'Real', value: true },{title: 'Predcción', value: false }];
    constructor(measureInput: any, locationInput: any, scenariosInput: any)
    {
        this.title     = '';
        this.options   = [{title: 'Count', value:false},{title: 'AVG', value:true}, {title: 'Sum', value:false}];
        this.measure   = measureInput;
        this.locations = locationInput;
        this.scenarios = scenariosInput;
        this.visible   = [{title: 'Only', value: false}, {title: 'Hide', value: false}];
    }
}

// Chart Interface
export interface ICHart {
   serieId: number;
   title: string;
   legend: string [];
   data: {date: Date, value: number [] } []; 
}

export class Chart implements ICHart{
   serieId: number;
   title: string;
   legend: string [];
   data: {date: Date, value: number [] } [];
   constructor(serieId, title, legend, data){
    this.serieId = serieId;
    this.title   = title;
    this.legend  = legend;
    this.data = data;
   }
}