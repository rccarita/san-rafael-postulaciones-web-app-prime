import { CboModel } from "../../core/interfaces/cbo-model";

export const DOCUMENT_TYPE: CboModel[] = [
    { id: 383, text: 'DNI', value: 'DNI', parentId: 0, active: true, shorttext: '' },
    { id: 4761, text: 'Carnet de extranjería', value: 'CEX', parentId: 0, active: true, shorttext: '' },
    { id: 384, text: 'DNI Menor de Edad', value: 'DNI Menor de Edad', parentId: 0, active: true, shorttext: '' },
    { id: 386, text: 'Pasaporte', value: 'PAS', parentId: 0, active: true, shorttext: '' },
    { id: 387, text: 'Libreta militar', value: 'Libreta militar', parentId: 0, active: true, shorttext: '' },
    { id: 388, text: 'Codigo de trabajador', value: 'Codigo de trabajador', parentId: 0, active: true, shorttext: '' },
];

export const GENDER: CboModel[] = [
    { id: 12, text: 'Masculino', value: 'M', parentId: 0, active: true, shorttext: '' },
    { id: 13, text: 'Femenino', value: 'F', parentId: 0, active: true, shorttext: '' },
];