import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet} from '@angular/router';
import {VerticalComponent} from "./layouts/vertical/vertical.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, VerticalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sword-admin';
}
