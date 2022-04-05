import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DataService} from "../services/data.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {FileData} from "../interfaces/file-data";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  selectedFiles?: FileList;
  selectedThumbnail?: FileList;
  currentFile?: File;
  currentThumbnail?: File;
  progress = 0;
  message = '';
  XD = 0;
  fileInfos?: Observable<any>;

  ngOnInit() {}
  constructor(public http: HttpClient, private dataSvc: DataService) {
    this.fileInfos = this.dataSvc.getFiles();

  }

  selectThumbnail(event: any) {
    var thumbnailPreview = (<HTMLInputElement>document.getElementById("selected_thumbnail_preview"))
    thumbnailPreview.src = URL.createObjectURL(event.target.files[0]);
    this.selectedThumbnail = event.target.files;
  }

  selectFile(event: any): void {  
     var filePreview = (<HTMLInputElement>document.getElementById("selected_file_preview"))
     console.log(event.target.files[0]);
     if(event.target.files[0].type == "image/png")
     {
       console.log("Waaaw")
       this.selectThumbnail(event)
     }
     filePreview.src = URL.createObjectURL(event.target.files[0]);
    this.selectedFiles = event.target.files;
    
  }

  upload(): void {
    this.progress = 0;
    if (this.selectedFiles && this.selectedThumbnail) {
      const file: File | null = this.selectedFiles.item(0);
      const thumbnail: File | null = this.selectedThumbnail.item(0);
      if (file && thumbnail) {
        this.currentFile = file;
        this.currentThumbnail = thumbnail;
        this.dataSvc.upload(this.currentFile, this.currentThumbnail, "XD").subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.dataSvc.getFiles();
              this.fileInfos.subscribe(files => console.log(files))
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;
            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
            this.currentFile = undefined;
          }
        });
      }
      this.selectedFiles = undefined;
    }
  }

  sortList() {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("id01");
    switching = true;
    while (switching) {
      switching = false;
        // @ts-ignore
      b = list.getElementsByTagName("LI");
      for (i = 0; i < (b.length - 1); i++) {
        shouldSwitch = false;
        if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        // @ts-ignore
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
      }
    }
  }
  private isAscendingSort: Boolean = true;

  sortUser() {

    console.log('sorting!'); //just to check if sorting is beng called
    var files:FileData[] =[];
    this.fileInfos?.subscribe(values =>{files = values,
      this.testPromises(values)})
  }

  testPromises(files:FileData[]){
    for (const file of files) {
      console.log(file.name);
    }
  }

}
