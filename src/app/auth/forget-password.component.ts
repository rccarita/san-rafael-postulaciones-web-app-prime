import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [TabViewModule],
  template: `
  <p-tabView>
    <p-tabPanel header="DNI Azul">
        <img class="w-full rounded-2xl" src="../../../../../../../assets/images/dni_azul.jpeg" alt="dni" />
    </p-tabPanel>
    <p-tabPanel header="DNI Electrónico">
        <img class="w-full rounded-2xl" src="../../../../../../../assets/images/dni_electronico.jpeg" alt="dniE" />
    </p-tabPanel>
</p-tabView>
  `,
})
export class ForgetPasswordComponent {

}
