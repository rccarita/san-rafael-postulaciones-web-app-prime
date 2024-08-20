import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NotificationService } from '../../core/services/notification/notification.service';
import { PostulationService } from '../../core/services/postulation.service';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TEXT } from '../../constants/text';
import dayjs from 'dayjs';
import { ImportsModule } from '../../shared/import';
import { ForgetPasswordComponent } from '../forget-password.component';

export interface UserLogin {
  number: string;
  date: string;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    FooterComponent,
    CommonModule,
    FooterComponent,
    ImportsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [
    DialogService,
    ConfirmationService,
    PostulationService,
    NotificationService,
    MessageService,
  ]
})
export class LoginComponent {


  today = new Date();
  ref: DynamicDialogRef | undefined;
  userLoginForm!: FormGroup;
  userLogin: UserLogin = { number: '', date: '' };
  userInfo: any;
  msgError = 'Los datos ingresados no son válidos. Por favor, revisa los campos del formulario e inténtalo nuevamente';

  private router = inject(Router);
  private service = inject(PostulationService);
  private notificationService = inject(NotificationService);
  private dialogService = inject(DialogService);
  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);

  constructor() {
    this.createForm();
  }

  createForm() {
    this.userLoginForm = this.fb.group({
      number: [this.userLogin.number, [Validators.required]],
      date: [this.userLogin.date, Validators.required]
    });
  }

  login() {
    if (this.userLoginForm.invalid) {
      this.markAllControlsAsToucheAndDirty();
      this.showInvalidValuesMessage();
      return;
    }
    const credentials = this.userLoginForm.value;
    credentials.date = this.formatDate(credentials.date);

    this.service.authentication(credentials).subscribe({
      next: (data: any) => {
        this.userInfo = data.data;
        sessionStorage.setItem("userInfo", JSON.stringify(this.userInfo));
        this.redirectToRegister();
      },
      error: (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    });
  }

  private markAllControlsAsToucheAndDirty(): void {
    Object.values(this.userLoginForm.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
    });
  }

  openDialogForget(e: any): void {
    e.preventDefault();
    this.ref = this.dialogService.open(ForgetPasswordComponent, {
      width: '60vh',
      header: '',
      draggable: true,
      styleClass: 'custom-header-dialog'
    });
  }

  openDialogRegister(): void {
    this.ref = this.dialogService.open(RegisterDialogComponent, {
      width: '70%',
      header: TEXT.REGISTER_TITLE,
      contentStyle: { 'overflow': 'auto' },
      draggable: true,
      styleClass: 'custom-header-dialog'
    });
  }

  showInvalidValuesMessage(): void {
    this.confirmationService.confirm({
      message: this.msgError,
      header: '¡Error!',
      icon: 'pi pi-info-circle custom-icon',
      dismissableMask: true,
      rejectVisible: false,
      acceptVisible: false,
    });
  }

  redirectToRegister() {
    this.router.navigate(['/postulation']);
  }

  redirectToInit() {
    this.router.navigate(['/']);
  }

  private formatDate(fieldName: string): string {
    return dayjs(fieldName).format('DD/MM/YYYY');
  }
}
