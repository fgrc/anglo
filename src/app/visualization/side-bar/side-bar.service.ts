import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarStateListener = new Subject<boolean>();
  private sidebarState: string = 'open';

  getSidebarState(){
    return this.sidebarState;
  }
  getSidebarStateStatusListener(){
    return this.sidebarStateListener.asObservable();
  }
  toggleSidebarState(){
    if (this.sidebarState === 'open'){
      this.sidebarState = 'close';
      this.sidebarStateListener.next(false);
    }else{
      this.sidebarState = 'open';
      this.sidebarStateListener.next(true);
    }
  }
  setSidebarState(state:string){
    this.sidebarState=state;
    return this.sidebarState;
  }
}
