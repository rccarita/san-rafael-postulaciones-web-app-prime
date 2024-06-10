import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../core/services/common.service';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ImageModule } from 'primeng/image';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    MenubarModule,
    TieredMenuModule,
    ImageModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  scrolled = false;
  existSession: boolean = false;
  personInfo: any = {};
  showLogoutLink = false;

  toggleLogoutLink(): void {
    this.showLogoutLink = !this.showLogoutLink;
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.scrollY > 5) {
      this.scrolled = true;
    } else {
      this.scrolled = false;
    }
  }

  constructor(private service: CommonService,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getSession();
    this.getUserInfoSession();
  }

  closeSession() {
    this.spinner.show();
    setTimeout(() => {
      this.service.removeSession();
      this.router.navigate(['/login']);
      this.spinner.hide();
    }, 1000);
  }


  getSession() {
    const token = this.service.getToken();
    this.existSession = !!token;
  }

  getUserInfoSession() {
    this.personInfo = this.service.getUserInfoSession();
  }
}
