import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {MultijsDirective} from "../../shared/multijs.directive";
import {MutijsSelectComponent} from "../../shared/mutijs-select/mutijs-select.component";
import {SpinInputComponent} from "../../shared/spin-input/spin-input.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, BreadcrumbsComponent, FormsModule, NgbPagination, NgbTooltip, ReactiveFormsModule, NgbDropdownToggle, NgbDropdownMenu, NgbDropdown, NgSelectModule, MultijsDirective, MutijsSelectComponent, SpinInputComponent],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  breadCrumbItems: any[] = [];
  pagination = {page_no: 1, page_size: 20, total_count: 0};
  models: any[] = [];
  modelId = "";
  gForm!: UntypedFormGroup;
  private searchSubject: Subject<any> = new Subject();
  learnableBookForm!: UntypedFormGroup;
  allBooks: any[] = [];
  state: any = {key: ""};
  rechargeForm!: UntypedFormGroup;
  recoveryPasswordForm!: UntypedFormGroup;


  constructor(private rest: RestApiService, private modal: NgbModal, private formBuilder: UntypedFormBuilder,) {
    defineElement(lottie.loadAnimation);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      {label: '学员'},
      {label: '学生管理', active: true}
    ];

    this.gForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required]],
      grade: [''],
      status: [''],
      phone: ['']
    });

    this.learnableBookForm = this.formBuilder.group({
      student_id: ['', [Validators.required]],
      book_ids: [[], [Validators.required]]
    });

    this.rechargeForm = this.formBuilder.group({
      student_id: [''],
      student_name: [{value: '',  disabled: true}],
      student_acct_no: [{value: '',  disabled: true}],
      card_password: ['']
    });

    this.recoveryPasswordForm = this.formBuilder.group({
      id: [''],
      name: [{value: '',  disabled: true}],
      recovery_password: ['']
    });

    this.searchSubject.pipe(
      debounceTime(500),
      //distinctUntilChanged()
    ).subscribe(params => {
      this.loadPage();
    });

    this.loadPage();
  }

  search(event: Event) {
    this.pagination.page_no = 1;
    this.searchSubject.next(this.state);
  }

  get form() {
    return this.gForm.controls;
  }

  loadAllBooks() {
    this.rest.index('books', {per: 1000}).subscribe(res => {
      this.allBooks = res.data;
    });
  }

  loadLearnableBook(student_id: string) {
    this.rest.index('learnable_books', {student_id: student_id, per: 1000}).subscribe(res => {
      this.learnableBookForm.controls['book_ids'].setValue(res.data[0]?.book_ids || []);
    });
  }

  loadPage(params?: any) {
    this.state['page'] = this.pagination.page_no;
    this.state['per'] = this.pagination.page_size;
    this.rest.index('students', this.state).subscribe(body => {
      this.models = body.data;
      this.pagination = body.pagination || this.pagination;
    });
  }

  delConfirmDialog(id: any, content?: any) {
    this.modelId = id;
    this.modal.open(content, {centered: true});
  }

  openDialog(content: any, id?: string) {
    this.modal.open(content, {size: 'md', centered: true});
  }

  editDialog(content: any, id?: string) {
    this.modal.open(content, {size: 'md', centered: true});

    if (id) {
      let modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
      modelTitle.innerHTML = '编辑学生';

      let model = this.models.find(obj => obj.id === id);
      this.gForm.controls['id'].setValue(model.id);
      this.gForm.controls['name'].setValue(model.name);
      this.gForm.controls['grade'].setValue(model?.grade);
      this.gForm.controls['status'].setValue(model?.status);
      this.gForm.controls['phone'].setValue(model?.phone);
    }
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
      } else {
        this.rest.create('students', this.gForm.value).subscribe(body => {
          this.models.push(body.data);
          this.modal.dismissAll();
          this.gForm.reset();
        });
      }
    }
  }

  saveLearnableBook() {
    console.log(this.learnableBookForm.value);
    console.log(this.learnableBookForm.status);
    if (this.learnableBookForm.valid) {
      this.rest.create('learnable_books', this.learnableBookForm.value).subscribe(res => {
        this.modal.dismissAll();
      });
    }
  }

  // Default
  counter = 1;


  priex: string = "";
  grade: string = "";

  studentNames: string[] = [];

  add() {
    console.log(this.studentNames);
    let ns = [];
    if (this.counter === 1) {
      ns.push(this.priex);
    } else {
      for (let i = 1; i <= this.counter; i++) {
        ns.push(this.priex + i);
      }
    }
    this.studentNames = [...this.studentNames, ...ns];
  }

  mutilCreate() {
    let b: any[] = [];
    this.studentNames.forEach(n => {
      b.push({name: n, grade: this.grade});
    });
    this.rest.post('students/multi_create', {students: b}).subscribe(body => {
      this.models = body.data;
      console.log(body);
      this.modal.dismissAll();
    });
  }

  learnableBooDialog(content: any, student_id: string) {
    this.loadAllBooks();
    this.loadLearnableBook(student_id);
    this.learnableBookForm.controls['student_id'].setValue(student_id);

    this.modal.open(content, {size: 'md', centered: true});
  }

  bookKinds: any[] = [
    {id: 'PRIMARY', name: 'PRIMARY'},
    {id: 'HIGH', name: 'HIGH'},
    {id: 'COLLEGE', name: 'COLLEGE'},
    {id: 'MIDDLE', name: 'MIDDLE'},
    {id: 'FREE', name: 'FREE'},
    {id: 'BABY', name: 'BABY'},
    {id: 'COMMON', name: 'COMMON'},
    {id: 'GO_ABROAD', name: 'GO_ABROAD'}
  ];

  rechargeDialog(content: any, model: any) {
    this.rechargeForm.controls['student_id'].setValue(model.id);
    this.rechargeForm.controls['student_name'].setValue(model.name);
    this.rechargeForm.controls['student_acct_no'].setValue(model.acct_no);
    this.modal.open(content, {size: 'md', centered: true});
  }

  saveRecharge() {
    this.rest.post('students/recharge', this.rechargeForm.value).subscribe({
      next: res => {
        this.modal.dismissAll();
        this.rechargeForm.reset();

      },
      error: err => {
        this.modal.dismissAll();
        Swal.fire({text: err.error.error, confirmButtonColor: '#239eba',});
      }
    });
  }

  recoveryPasswordDialog(content: any, model: any) {
    this.recoveryPasswordForm.controls['id'].setValue(model.id);
    this.recoveryPasswordForm.controls['name'].setValue(model.name);
    this.modal.open(content, {size: 'md', centered: true});
  }

  saveRecoveryPassword() {
    if (this.recoveryPasswordForm.valid) {
      this.rest.post('users/recovery_password', this.recoveryPasswordForm.value).subscribe(res =>{
        this.modal.dismissAll();

      });

    }

  }


}
