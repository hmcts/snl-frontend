import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  chosenView = 'main';

  setView(view) {
    this.chosenView = view;
  }
}
