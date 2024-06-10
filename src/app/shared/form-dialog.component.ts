import { AbstractControl, FormGroup } from '@angular/forms';
import { OnInit, Directive, Injector } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../core/services/notification/notification.service';
import { environment } from '../../environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FieldValidations, FormBuilderHelper, FormFields } from './form-builder-helper';

type ErrorCode = 'required' | 'minlength' | 'maxlength' | 'min' | 'max' | 'pattern';
/**
 * Form Component
 * EDITAR Y GUARDAR
 * Clase base para todos los formularios
 */
@Directive()
export abstract class FormDialogComponent<T> implements OnInit {

    cellPhoneErrorMessageText = 'El número de celular debe comenzar con 9.';
    emailErrorMessageText = 'Ingresar un correo electrónico válido.';
    msgSuccessfulModelCreationText = 'Registrado correctamente';
    msgSuccessfulModelUpdateText = 'Actualizado correctamente';
    minLengthErrorMessageTpl = 'Min {0} caracteres.';
    maxLengthErrorMessageTpl = 'Max {0} caracteres.';
    minErrorMessageTpl = 'Min {0}.';
    maxErrorMessageTpl = 'Max {0}.';
    mode: 'creation' | 'edition' = 'creation';
    /**
     * FormGrup asignado al formulario
     */
    formGroup!: FormGroup;
    /**
     * Si es true se usará el metodo getRawValue() obtener los valores del formulario
     * caso contrario solo se usará la propiedad value.
     */
    includeFormDisabledControls = false;
    /**
     * Llamar al metodo buildFormModel al inicio.
     */
    buildFormGroupOnInit: boolean = true;
    model!: T;
    modelIdProperty = 'id';
    _isSaving = false;

    protected formFields: FormFields = {};
    protected fbHelper: FormBuilderHelper;
    protected notificationService: NotificationService;
    protected confirmationService: ConfirmationService;
    protected messageService: MessageService;

    constructor(
        protected injector: Injector,
        protected dialogRef: DynamicDialogRef<any>,
        public inputData: any,
    ) {
        this.fbHelper = injector.get(FormBuilderHelper);
        this.notificationService = injector.get(NotificationService);
        this.confirmationService = injector.get(ConfirmationService);
        this.messageService = injector.get(MessageService);
        this.model = inputData?.data?.model ? inputData.data.model : this.createModel();
        this.setupFormFieldsDefinition();
    }

    isCreationMode(): boolean {
        return this.mode === 'creation';
    }

    isEditionMode(): boolean {
        return this.mode === 'edition';
    }

    getFormFieldsDefinition(): FormFields {
        return this.formFields;
    }

    ngOnInit(): void {
        const me = this;
        me.mode = me.model && (me.model as any)[me.modelIdProperty] ? 'edition' : 'creation';
        if (me.buildFormGroupOnInit) {
            me.buildFormGroup();
        }
    }

    buildFormGroup(): void {
        const me = this;
        me.formGroup = me.fbHelper.buildFormGroup(
            me.formFields,
            me.getFormGroupInitialValues(),
        );
    }

    createModel(): any {
        return {};
    }

    close(): void {
        this.dialogRef.close();
    }

    isSaving(): boolean {
        return this._isSaving;
    }

    setStatusSaving(): void {
        this._isSaving = true;
    }

    setStatusReady(): void {
        this._isSaving = false;
    }

    /**
     * Enviar datos
     */
    onSubmit(): void {
        const me = this;
        // Si esta guardando.
        if (me.isSaving()) {
            return;
        }
        //Invalid touched && dirty
        me.markAllControlsAsToucheAndDirty()
        // Si los datos son incorrectos
        if (!me.isValid()) {
            me.showInvalidValuesMessage();
            // Log error only in development mode
            me.log(me.getAllErrors());
            return;
        }
        me.setStatusSaving();
        const postModel = me.getPostData();
        me.getSaveService(postModel).subscribe({
            next: (rec) => {
                me.onSaveSuccess(rec);
            },
            error: (xhr) => {
                me.onSaveError(xhr);
            }
        });
    }

    private markAllControlsAsToucheAndDirty(): void {
        Object.values(this.formGroup.controls).forEach(control => {
            control.markAsTouched();
            control.markAsDirty();
        });
    }

    onSaveSuccess(rec: T): void {
        const me = this;
        const message = me.isCreationMode()
            ? me.getSuccessCreationMessage(rec)
            : me.getSuccessUpdateMessage(rec);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: `${message}`, life: 3000 });
        me.dialogRef.close(rec);
    }

    onSaveError(xhr: HttpErrorResponse): void {
        const me = this;
        if (xhr.status === 401) {
            me.dialogRef.close();
            return;
        }
        me.handleXhrError(xhr);
        me.setStatusReady();
    }

    handleXhrError(xhr: HttpErrorResponse): void {
        this.notificationService.handleXhrError(xhr);
    }

    getSuccessCreationMessage(rec: T): string {
        return this.msgSuccessfulModelCreationText;
    }

    getSuccessUpdateMessage(rec: T): string {
        return this.msgSuccessfulModelUpdateText;
    }

    showInvalidValuesMessage(): void {
        this.confirmationService.confirm({
            message: 'Los datos ingresados no son válidos. Por favor, revisa los campos del formulario e inténtalo nuevamente.',
            header: '¡Error!',
            icon: 'pi pi-info-circle custom-icon',
            dismissableMask: true,
            rejectVisible: false,
            acceptVisible: false,
        });
    }

    /**
     * Este metodo retorna los campos que son enviados al servidor
     */
    getPostData(): any {
        const me = this;
        if (this.includeFormDisabledControls) {
            return { ...me.model, ...me.formGroup.getRawValue() };
        }
        return { ...me.model, ...me.formGroup.value };
    }

    /**
     * Retorna el campo del formulario solicitado
     *
     * @param name
     */
    getFormControl(name: string): AbstractControl | null {
        return this.formGroup.get(name);
    }

    getFormFieldValue(field: string): any {
        return this.getFormControl(field)?.value;
    }

    getFormFieldValueChanges(field: string): any {
        return this.getFormControl(field)?.valueChanges;
    }

    setFormFieldValue(field: string, value: any): void {
        this.getFormControl(field)?.setValue(value);
    }

    setupValueChanges(field: string, fieldChange: string): void {
        this.getFormFieldValueChanges(field).subscribe((value: any) => {
            value ? this.getFormControl(fieldChange)?.enable() : this.getFormControl(fieldChange)?.disable();
        });
    }

    isValid(): boolean {
        return this.formGroup.valid;
    }

    hasError(field: string, errorCode: ErrorCode): any {
        return this.formGroup.get(field)?.hasError(errorCode);
    }

    getAllErrors(): any {
        const errors = [];
        for (const field of Object.keys(this.formGroup.controls)) {
            const controlErrors = this.formGroup.get(field)?.errors;
            if (controlErrors) {
                errors.push({ field, controlErrors });
            }
        }
        return errors;
    }

    getErrorMessages(fieldName: string): string[] {
        const control = this.formGroup.get(fieldName);
        const errors = control?.errors;
        if (!errors) {
            return [];
        }
        const errorMessages: string[] = [];

        if (errors['required'] && (control.touched || control.dirty)) {
            errorMessages.push('Requerido');
        }
        if (errors['minlength']) {
            errorMessages.push(this.getMinLengthErrorMessage(fieldName));
        }
        if (errors['maxlength']) {
            errorMessages.push(this.getMaxLengthErrorMessage(fieldName));
        }
        if (errors['min']) {
            errorMessages.push(this.getMinErrorMessage(fieldName));
        }
        if (errors['max']) {
            errorMessages.push(this.getMaxErrorMessage(fieldName));
        }
        if (errors['pattern']) {
            errorMessages.push(this.getPatternErrorMessage(fieldName));
        }
        return errorMessages;
    }

    generateErrorMessages(fieldName: string): string {
        const messages = this.getErrorMessages(fieldName);
        return messages.map(msg => `<small class="p-error block">${msg}</small>`).join('');
    }

    getPatternErrorMessage(fieldName: string): string {
        return this.patternErrorMessages[fieldName] || 'Formato inválido.';
    }

    patternErrorMessages: { [key: string]: string } = {
        email: this.emailErrorMessageText,
        phoneNumber: this.cellPhoneErrorMessageText,
    };

    getFieldProperty(fieldName: string, prop: keyof FieldValidations): any {
        return this.formFields[fieldName] ? this.formFields[fieldName][prop] : null;
    }

    getMinLengthErrorMessage(fieldName: string): string {
        const minLength = this.getFieldProperty(fieldName, 'minLength');
        return this.minLengthErrorMessageTpl.replace('{0}', minLength);
    }

    getMaxLengthErrorMessage(fieldName: string): string {
        const maxLength = this.getFieldProperty(fieldName, 'maxLength');
        return this.maxLengthErrorMessageTpl.replace('{0}', maxLength);
    }

    getMinErrorMessage(fieldName: string, messageTpl: string = ''): string {
        const tpl = messageTpl || this.minErrorMessageTpl;
        const min = this.getFieldProperty(fieldName, 'min');
        return tpl.replace('{0}', min);
    }

    getMaxErrorMessage(fieldName: string, messageTpl: string = ''): string {
        const tpl = messageTpl || this.maxErrorMessageTpl;
        const max = this.getFieldProperty(fieldName, 'max');
        return tpl.replace('{0}', max);
    }

    /**
     * Permite modificar los valores que se usarán para construir el formControl
     *
     * @param field
     * @returns
     */
    protected getFormGroupInitialValues(): any {
        return this.model;
    }

    /**
     * Permite modificar la definición original del campo antes de construir el formControl
     *
     * @param field
     * @returns
     */
    protected mapFormField(fieldName: string, field: FieldValidations): any {
        return field;
    }

    private setupFormFieldsDefinition(): void {
        this.formFields = this.getFormFieldsDefinition();
    }

    private log(message: any): void {
        if (!environment.production) {
            console.log(message);
        }
    }

    abstract getSaveService(model: T): Observable<any>;

}
