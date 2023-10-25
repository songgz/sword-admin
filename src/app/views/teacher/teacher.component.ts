import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {BreadcrumbsComponent} from "../../shared/breadcrumbs/breadcrumbs.component";
import {NgbModal, NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {RestApiService} from "../../core/services/rest-api.service";
import {defineElement} from "@lordicon/element";
import lottie from "lottie-web";

@Component({
  selector: 'app-teacher',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, BreadcrumbsComponent, NgbPagination, NgbTooltip, ReactiveFormsModule],
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  breadCrumbItems: any[] = [];
  pagination = {page_no: 1, page_size: 0, total_count: 0};
  models: any[] = [];
  modelId = "";
  gForm!: UntypedFormGroup;
  private searchUpdated: Subject<string> = new Subject();

  constructor(private rest: RestApiService, private modal: NgbModal,  private formBuilder: UntypedFormBuilder,) {
    defineElement(lottie.loadAnimation);
    this.loadPage();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: '校区' },
      { label: '教师', active: true }
    ];

    this.gForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      age: [''],
      avatar: [''],
      email: ['']
    });

    this.searchUpdated.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(key => {
      this.loadPage({key: key});
    });
  }

  search(event: Event) {
    this.searchUpdated.next((event.target as HTMLInputElement).value);
  }

  get form() {
    return this.gForm.controls;
  }

  loadPage(params: any = {}) {
    params['page'] = this.pagination.page_no
    this.rest.index('teachers', params).subscribe(body => {
      this.models = body.data;
      this.pagination = body.pagination || this.pagination;
    });
  }

  confirmModal(content: any, id: any) {
    this.modelId = id;
    this.modal.open(content, { centered: true });
  }

  openModal(content: any) {
    //this.submitted = false;
    this.modal.open(content, { size: 'md', centered: true });
  }

  editModal(id: any, content: any) {
    //this.modelId = id;
    this.modal.open(content, { size: 'md', centered: true });
    let modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = '编辑教师';

    let model = this.models.find(obj => obj.id === id);
    this.gForm.controls['id'].setValue(model.id);
    this.gForm.controls['name'].setValue(model.name);
    this.gForm.controls['gender'].setValue(model.gender);
    this.gForm.controls['age'].setValue(model?.age);
    this.gForm.controls['avatar'].setValue(model?.avatar);
    this.gForm.controls['email'].setValue(model?.email);
  }

  destroy(id: any) {
    this.rest.destroy('teachers/' + id).subscribe({
      next: body => {
        const i = this.models.findIndex(obj => obj.id === id);
        if (i !== -1) {
          this.models.splice(i, 1);
        }
      },
      error: err => {
        console.log(err);
        //this.content = JSON.parse(err.error).message;
      }
    });
  }

  save() {
    if (this.gForm.valid) {
      let id = this.gForm.get('id')?.value;
      if (id !== null) {
        this.rest.update('teachers/' + id, this.gForm.value).subscribe(body => {
          const i = this.models.findIndex(obj => obj.id === id);
          this.models[i] = body.data;
          this.modal.dismissAll();
          this.gForm.reset();
        });
      }else{
        this.rest.create('teachers', this.gForm.value).subscribe(body => {
          console.log(body);
          this.models.push(body.data);
          this.modal.dismissAll();
          this.gForm.reset();
        });
      }

    }

  }
}
