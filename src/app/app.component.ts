import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserInfo } from './interfaces/user-info';
import {DataService} from "./services/data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DataService],

})
export class AppComponent {
  title = 'Eria-Webpage';
  user?:UserInfo;
  avatar?:string
  userUsername?:string

  constructor(public http: HttpClient, private dataSvc: DataService) {

   this.oauthLogin();
    
  }

  oauthLogin(){
      this.dataSvc.oauthLogin().subscribe(x  => {
      this.user = x;
      console.log(x)
      var loginImage = (<HTMLInputElement>document.getElementById("login-image"));
      var usernameText = (<HTMLInputElement>document.getElementById("username"));
      if(this.user != null)
      {
        console.log("xd");
        loginImage.src= "https://cdn.discordapp.com/avatars/" + this.user.id +"/"+ this.user.profilePicture + ".jpg"
        this.userUsername = this.user.username;
      }
      });    
    console.log();    
  }
}
