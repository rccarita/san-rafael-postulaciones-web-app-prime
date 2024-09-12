export interface JobPosition {
    id: number;
    requestId: number;
    jobPositionName: string;
    jobPositionId: number;
    quantity: number;
    companyId: number;
    companyNumdoc: string;
    companyName: string;
    startDate: number;
    endDate: number;
    molTypeId: number;
    molTypeName: string;
    statusId: number;
    statusName: string;
    hasCurrentPostulantion: boolean | null;
}