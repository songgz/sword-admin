import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {BreadcrumbsComponent} from "../../shared/breadcrumbs/breadcrumbs.component";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbModal,
  NgbPagination,
  NgbTooltip
} from "@ng-bootstrap/ng-bootstrap";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {RestApiService} from "../../core/services/rest-api.service";
import {defineElement} from "@lordicon/element";
import lottie from "lottie-web";
import {NgSelectModule} from "@ng-select/ng-select";

@Component({
  selector: 'app-student',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, BreadcrumbsComponent, FormsModule, NgbPagination, NgbTooltip, ReactiveFormsModule, NgbDropdownToggle, NgbDropdownMenu, NgbDropdown, NgSelectModule],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
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
      { label: '学员' },
      { label: '学生管理', active: true }
    ];

    this.gForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required]],
      grade: [''],
      avatar: [''],
      phone: ['']
    });

    this.searchUpdated.pipe(
      debounceTime(500),
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
    this.rest.index('students', params).subscribe(body => {
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
    modelTitle.innerHTML = '编辑学生';

    let model = this.models.find(obj => obj.id === id);
    this.gForm.controls['id'].setValue(model.id);
    this.gForm.controls['name'].setValue(model.name);
    this.gForm.controls['grade'].setValue(model?.grade);
    this.gForm.controls['avatar'].setValue(model?.avatar);
    this.gForm.controls['phone'].setValue(model?.phone);
  }

  destroy(id: any) {
    this.rest.destroy('students/' + id).subscribe({
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
        this.rest.update('students/' + id, this.gForm.value).subscribe(body => {
          const i = this.models.findIndex(obj => obj.id === id);
          this.models[i] = body.data;
          this.modal.dismissAll();
          this.gForm.reset();
        });
      }else{
        this.rest.create('students', this.gForm.value).subscribe(body => {
          this.models.push(body.data);
          this.modal.dismissAll();
          this.gForm.reset();
        });
      }
    }
  }

  // Default
  counter = 1;
  increment() {
    this.counter++;
  }

  decrement() {
    this.counter--;
  }




  priex :string = "";
  grade :string = "";

  studentNames :string[] = [];

  add() {
    console.log(this.studentNames);
    let ns = [];
    if(this.counter === 1) {
      ns.push(this.priex);
    }else{
      for (let i = 1; i <= this.counter; i++) {
        ns.push(this.priex + i);
      }
    }
    this.studentNames = [...this.studentNames, ...ns];
  }

  mutilCreate() {
    let b :any[] = [];
    this.studentNames.forEach(n => {
      b.push({name: n, grade: this.grade});
    });
    this.rest.post('students/multi_create', {students: b}).subscribe(body => {
      this.models = body.data;
      console.log(body);
      this.modal.dismissAll();
    });
  }
}
