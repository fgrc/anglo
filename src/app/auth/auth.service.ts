import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

import { AuthData } from "./auth-data.model";
import {environment} from "../../environments/environment";

const BACKEND_URL=environment.apiUrl + "/auth";

@Injectable({
  providedIn:"root"
})
export class AuthService{
  private isAuthenticated =false;
  private token:string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer:any;
  private userId:string;
  constructor(private http:HttpClient,private router:Router){}

  getToken(){
    return this.token;
  }
  getUserId(){
    return this.userId;
  }
  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }
  getIsAuth(){
    return this.isAuthenticated;
  }
  createUser(email:string,password:string){
    const authData: AuthData ={
      email:email,
      password:password
    };
    this.http.post(BACKEND_URL+"/signup",authData)
              .subscribe(response=>{
                this.router.navigate(["/"]);
              },error=>{
                this.authStatusListener.next(false);
              });
  }

  login(email:string,password:string){
    const authData: AuthData ={
      email:email,
      password:password
    };
    this.http.post<{token:string,expiresIn:number, userId:string}>(BACKEND_URL+"/login",authData)
    .subscribe(response=>{
      const token = response.token;
      this.token=token;
      if(token){
        const expiresInDuration=response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated=true;
        this.userId=response.userId;
        this.authStatusListener.next(true);
        const now=new Date();
        const expirationDate=new Date(now.getTime()+expiresInDuration*1000);
        this.saveAuthData(token,expirationDate,this.userId);
        this.router.navigate(['/']);
      }
    },error=>{
      this.authStatusListener.next(false);
    });
  }

  autoAuthUser(){
    const information=this.getAuthData();
    if(!information){
      return ;
    }
    const now= new Date();
    const expiresIn = information.expirationDate.getTime()-now.getTime();
    if(expiresIn>0){
      this.token=information.token;
      this.isAuthenticated=true;
      this.userId=information.userId;
      this.setAuthTimer(expiresIn/1000);
      this.authStatusListener.next(true);
    }
  }

  logout(){
    this.token=null;
    this.isAuthenticated=false;
    this.authStatusListener.next(false);
    this.userId=null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration:number){
    this.tokenTimer=setTimeout(()=>{
      this.logout();
    },duration*1000);
  }

  private saveAuthData(token:string,expirationDate:Date, userId:string){
    localStorage.setItem('token',token);
    localStorage.setItem('userId',userId);
    localStorage.setItem('expiration',expirationDate.toISOString());
  }
  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiration');
  }
  private getAuthData(){
    const token= localStorage.getItem("token");
    const userId= localStorage.getItem("userId");
    const expirationDate= localStorage.getItem('expiration');
    if(!token||!expirationDate){
      return;
    }
    const data={
      token:token,
      expirationDate:new Date(expirationDate),
      userId:userId
    };
    return data;
  }
}