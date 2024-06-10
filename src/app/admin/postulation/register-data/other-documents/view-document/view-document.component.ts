import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-view-document',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './view-document.component.html',
})
export class ViewDocumentComponent implements OnInit {
  urlViewer: any;

  constructor(
    @Inject(DynamicDialogConfig) public data: any,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.urlViewer = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.data.urlViewer);
  }
}
