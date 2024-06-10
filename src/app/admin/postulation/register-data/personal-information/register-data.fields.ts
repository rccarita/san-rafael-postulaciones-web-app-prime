import { FormFields } from "../../../../shared/form-builder-helper";

export const PERSON_DATA_FIELDS: FormFields = {
    id: {},
    lastPatName: {
        required: true,
    },
    lastMatName: {
        required: true,
    },
    firstName: {
        required: true,
    },
    middleName: {
    },
    docTypeId: {
        disabled: true,
    },
    numdoc: {
        disabled: true,
    },
    birthDate: {
        disabled: true,
    },
    civilStatusId: {
        required: true,
    },
    genderId: {
        required: true,
    },
    phoneNumber: {
        required: true,
        maxLength: 9,
        minLength: 9,
    },
    licenceNumber: {
    },
    licenceTypeId: {
        required: true,
    },
    email: {
        required: true,
        emailPattern: true,
    },
};

export const PERSON_DATA_BIRTH_FIELDS: FormFields = {
    birthUbigeo: {
        id: {},
        level1Id: {
            disabled: true,
        },
        level2Id: {
            disabled: true,
        },
        level3Id: {
            disabled: true,
        },
        groupType: 'object',
    }
};

export const PERSON_DATA_UBIGEO_FIELDS: FormFields = {
    ubigeo: {
        id: {},
        level1Id: {
            disabled: true,
        },
        level2Id: {
            disabled: true,
        },
        level3Id: {
            disabled: true,
        },
        level4Name: {
            disabled: true,
        },
        level5Name: {
            disabled: true,
        },
        level6Name: {
            disabled: true,
        },
        groupType: 'object',
    }
};
