import { Component } from '@angular/core';
import { CurrentCallsComponent } from './current-calls/current-calls.component';
import { HistoryCallsComponent } from './history-calls/history-calls.component';
import { TabViewModule } from 'primeng/tabview';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CurrentCallsComponent,
    HistoryCallsComponent,
    TabViewModule
  ],
  templateUrl: './home.component.html',
  styles: `
  .p-tabview-nav-container {
    display: flex;
    justify-content: center;

    .p-tabview-nav li {
        border: 1px solid #000000;

        .p-tabview-nav-link {
            border-top-right-radius: 0px;
            border-top-left-radius: 0px;
        }
    }
}`
})
export class HomeComponent {

}
