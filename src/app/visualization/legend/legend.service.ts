import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class LegendService {
  private legendStateListener = new Subject<boolean>();
  private legendState: string = 'open';

  getLegendState(){
    return this.legendState;
  }
  getLegendStateStatusListener(){
    return this.legendStateListener.asObservable();
  }
  toggleLegendState(){
    if (this.legendState === 'open'){
      this.legendState = 'close';
      this.legendStateListener.next(false);
    }else{
      this.legendState = 'open';
      this.legendStateListener.next(true);
    }
  }
  setLegendState(state:string){
    this.legendState=state;
    return this.legendState;
  }
}
