import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //title = 'demo-app'
  title : string = 'demo app';

  buttonCkicked() : void{
    alert(this.title)
  }
}
                  