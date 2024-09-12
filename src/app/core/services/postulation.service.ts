import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CollectionQueryParams } from '../interfaces/collection-query-params';
import { HttpListService } from '../http/http-list.service';
import { ApiResponse } from '../interfaces/api-response';
import { JobPosition } from '../../models/job-position';

@Injectable({
    providedIn: 'root'
})
export class PostulationService {

    private baseUrl = `${environment.baseUrl}/api/mol/public/request`;
    private authUrl = `${environment.baseUrl}/api/auth/j_spring_security_check_simple`;
    private baseAdminUrl = `${environment.baseUrl}/api/admin`;
    private baseEducation = `${environment.baseUrl}/api/stakeholder/education`;
    private baseTraining = `${environment.baseUrl}/api/stakeholder/training`;
    private baseExperience = `${environment.baseUrl}/api/stakeholder/employment`;
    private baseFileUrl = `${environment.baseUrl}/api/resource/file/content`;

    constructor(private http: HttpClient, private commonService: CommonService,
        private httpListService: HttpListService,
    ) { }

    private getHeaders(): HttpHeaders {
        const token = this.commonService.getToken();
        return new HttpHeaders({ Authorization: token });
    }

    private getParams(date: Date): HttpParams {
        return new HttpParams().set('_dc', date.getTime());
    }

    public getOffers(queryParams?: CollectionQueryParams): Observable<ApiResponse<JobPosition[]>> {
        return this.httpListService
            .get<ApiResponse<JobPosition[]>>(this.baseUrl + '/work-offers', queryParams);
    }

    public getOffersHistory(queryParams?: CollectionQueryParams): Observable<ApiResponse<JobPosition[]>> {
        return this.httpListService.get<ApiResponse<JobPosition[]>>(this.baseUrl + '/work-offers-history', queryParams);
    }

    public authentication(body: any) {
        const url = `${this.authUrl}`;
        return this.http.post<any>(url, body);
    }

    public saveInfoPersona(body: any) {
        const url = `${this.baseUrl}/application`;
        return this.http.post<any>(url, body);
    }

    public getInfoPersona(personaId: number) {
        const url = `${this.baseUrl}/work-person/${personaId}`;
        const headers = this.getHeaders();
        const params = this.getParams(new Date());
        return this.http.get<any>(url, { headers: headers, params: params });
    }

    public updateInfoPersona(body: any, personaId: number) {
        const url = `${this.baseUrl}/work-person/${personaId}`;
        const headers = this.getHeaders();
        const params = this.getParams(new Date());
        return this.http.put<any>(url, body, { headers: headers, params: params });
    }

    public getLisParameters() {
        const url = `${this.baseAdminUrl}/load/json/list`;
        const headers = this.getHeaders();
        const params = this.getParams(new Date());
        return this.http.get<any>(url, { headers: headers, params: params });
    }

    public academicTrainingList(id: any, queryParams: CollectionQueryParams) {
        const url = `${this.baseEducation}/list/${id}`;
        let headers = this.getHeaders();
        let params = this.getParams(new Date());
        return this.httpListService.get<any>(url, queryParams, { headers: headers, params: params });
    }

    public academicTrainingSave(body: any) {
        const url = `${this.baseEducation}/add/0`;
        const headers = this.getHeaders();
        const params = this.getParams(new Date());
        return this.http.post<any>(url, body, { headers: headers, params: params });
    }

    public academicTrainingUpdate(id: any, body: any) {
        const url = `${this.baseEducation}/upd/${id}`;
        const headers = this.getHeaders();
        const params = this.getParams(new Date());
        return this.http.put<any>(url, body, { headers: headers, params: params });
    }

    saveAcademicTraining(body: any): Observable<any> {
        return body.id ? this.academicTrainingUpdate(body.id, body) : this.academicTrainingSave(body);
    }

    public academicTrainingDelete(id: any) {
        const url = `${this.baseEducation}/remove/${id}`;
        const headers = this.getHeaders();
        const params = this.getParams(new Date());
        return this.http.delete<any>(url, { headers: headers, params: params });
    }

    public trainingList(id: any, queryParams: CollectionQueryParams) {
        const url = `${this.baseTraining}/list/${id}`;
        const headers = this.getHeaders();
        let params = this.getParams(new Date());
        return this.httpListService.get<any>(url, queryParams, { headers: headers, params: params });
    }

    public trainingSave(body: any) {
        const url = `${this.baseTraining}/add/0`;
        const headers = this.getHeaders();
        const params = this.getParams(new Date());
        return this.http.post<any>(url, body, { headers: headers, params: params });
    }

    public trainingUpdate(id: any, body: any) {
        const url = `${this.baseTraining}/upd/${id}`;
        const headers = this.getHeaders();
        const params = this.getParams(new Date());
        return this.http.put<any>(url, body, { headers: headers, params: params });
    }

    saveTraining(body: any): Observable<any> {
        return body.id ? this.trainingUpdate(body.id, body) : this.trainingSave(body);
    }

    public trainingDelete(id: any) {
        const url = `${this.baseTraining}/remove/${id}`;
        const headers = this.getHeaders();
        const params = this.getParams(new Date());
        return this.http.delete<any>(url, { headers: headers, params: params });
    }

    public workExperienceList(id: any, queryParams: CollectionQueryParams) {
        const url = `${this.baseExperience}/list/${id}`;
        const headers = this.getHeaders();
        let params = this.getParams(new Date());
        return this.httpListService.get<any>(url, queryParams, { headers: headers, params: params });
    }

    public workExperienceSave(body: any) {
        const url = `${this.baseExperience}/add/0`;
        const headers = this.getHeaders();
        const params = this.getParams(new Date());
        return this.http.post<any>(url, body, { headers: headers, params: params });
    }

    public workExperienceUpdate(id: any, body: any) {
        const url = `${this.baseExperience}/upd/${id}`;
        const headers = this.getHeaders();
        const params = this.getParams(new Date());
        return this.http.put<any>(url, body, { headers: headers, params: params });
    }

    saveWorkExperience(body: any): Observable<any> {
        return body.id ? this.workExperienceUpdate(body.id, body) : this.workExperienceSave(body);
    }

    public workExperienceDelete(id: any) {
        const url = `${this.baseExperience}/remove/${id}`;
        const headers = this.getHeaders();
        const params = this.getParams(new Date());
        return this.http.delete<any>(url, { headers: headers, params: params });
    }

    public getWorkOffers(id: any) {
        const url = `${this.baseUrl}/work-offers/${id}`;
        return this.http.get<any>(url);
    }

    //postulaciones
    public postulationList(personId: any, queryParams: CollectionQueryParams) {
        const url = `${this.baseUrl}/my-applications/${personId}`;
        const headers = this.getHeaders();
        let params = this.getParams(new Date());
        return this.httpListService.get<any>(url, queryParams, { headers: headers, params: params });
    }

    public myWorkOffersList(personId: any, queryParams: CollectionQueryParams) {
        const url = `${this.baseUrl}/my-work-offers/${personId}`;
        const headers = this.getHeaders();
        let params = this.getParams(new Date());
        return this.httpListService.get<any>(url, queryParams, { headers: headers, params: params });
    }

    public savePostulation(personId: any, offerId: any) {
        const url = `${this.baseUrl}/application/${personId}/${offerId}`;
        const headers = this.getHeaders();
        let params = this.getParams(new Date());
        return this.http.post<any>(url, null, { headers: headers, params: params });
    }

    public deletePostulation(id: any) {
        const url = `${this.baseUrl}/application/${id}`;
        const headers = this.getHeaders();
        let params = this.getParams(new Date());
        return this.http.delete<any>(url, { headers: headers, params: params });
    }

    public downloadCV(cvId: any) {
        const url = `${this.baseFileUrl}/${cvId}`;
        const headers = this.getHeaders();
        let params = this.getParams(new Date());
        return this.http.get(url, { headers: headers, params: params, responseType: 'blob' });
    }

    public uploadCV(file: any) {
        const url = `${this.baseUrl}/upload-cv`;
        let headers = this.getHeaders();
        headers = headers.append('Content-Type', 'multipart/form-data');
        console.log(headers)
        let params = this.getParams(new Date());
        return this.http.post(url, file, { headers: headers, params: params });
    }

    public getDocuments(uuid: string) {
        const url = `${this.baseUrl}/files/list/${uuid}?skip=0&take=100`;
        let headers = this.getHeaders();
        let params = this.getParams(new Date());
        return this.http.get<any>(url, { headers: headers, params: params });
    }

    public downloadDocument(uuid: string) {
        const url = `${this.baseFileUrl}/${uuid}`;
        let headers = this.getHeaders();
        let params = this.getParams(new Date());
        return this.http.get(url, { headers: headers, params: params, responseType: 'blob' });
    }

    public uploadDocument(file: any) {
        const url = `${this.baseUrl}/files/upload`;
        let headers = this.getHeaders();
        headers = headers.append('Content-Type', 'multipart/form-data');
        console.log(headers)
        let params = this.getParams(new Date());
        return this.http.post(url, file, { headers: headers, params: params });
    }

    public removeDocument(uuid: string) {
        const url = `${this.baseUrl}/files/remove/${uuid}`;
        let headers = this.getHeaders();
        let params = this.getParams(new Date());
        return this.http.delete(url, { headers: headers, params: params });
    }

}