import { FormFields } from "../../shared/form-builder-helper";

export const REGISTER_DIALOG_FIELDS: FormFields = {
    numdoc: {
        required: true,
    },
    firstName: {
        required: true,
        maxLength: 100,
    },
    middleName: {
        maxLength: 100,
    },
    lastPatName: {
        required: true,
        maxLength: 100,
    },
    lastMatName: {
        required: true,
        maxLength: 100,
    },
    docTypeId: {
        required: true,
    },
    genderId: {
        required: true,
    },
    email: {
        required: true,
        maxLength: 80,
        emailPattern: true,
    },
    phoneNumber: {
        required: true,
        cellPhonePattern: true,
        minLength: 9,
        maxLength: 9,
    },

    level4Name: {
        required: true,
        maxLength: 80,
    },
    birthDate: {
        required: true,
    },
    comment: {
        required: true,
        maxLength: 200,
    },
};