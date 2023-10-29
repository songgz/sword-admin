import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RestApiService} from "../../core/services/rest-api.service";
import {BreadcrumbsComponent} from "../../shared/breadcrumbs/breadcrumbs.component";
import {NgbHighlight, NgbModal, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import { FlatpickrModule} from "angularx-flatpickr";
import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";

@Component({
  selector: 'app-book',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, BreadcrumbsComponent, FormsModule, NgbHighlight, FlatpickrModule, ReactiveFormsModule, NgbPagination],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  books: any[] = [];
  breadCrumbItems: any[] = [];
  submitted: boolean | undefined;
  customerForm!: UntypedFormGroup;
  pagination = {page_no: 1, page_size: 20, total_count: 0};

  constructor(private rest: RestApiService, private modal: NgbModal,  private formBuilder: UntypedFormBuilder,) {
    defineElement(lottie.loadAnimation);
  }

  // loadPage() {
  //   this.rest.get('books').subscribe(body => {
  //     this.books = body.data;
  //     this.pagination = body.pagination;
  //   });
  // }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: '教材' },
      { label: '课本', active: true }
    ];

    this.customerForm = this.formBuilder.group({
      ids: [''],
      customer: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      date: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });

    this.loadPage();
  }

  // Delete Data
  deleteData(id: any) {
      this.rest.destroy('books/' + id).subscribe({
        next: data => { },
        error: err => {
          this.content = JSON.parse(err.error).message;
        }
      });
      document.getElementById('c_' + id)?.remove();
  }

  get form() {
    return this.customerForm.controls;
  }


  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modal.open(content, { size: 'md', centered: true });
  }

  content: any;
  editDataGet(id: any, content: any) {
    // this.submitted = false;
    // this.modalService.open(content, { size: 'md', centered: true });
    //
    // var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    // modelTitle.innerHTML = 'Edit Customer';
    // var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    // updateBtn.innerHTML = "Update";
    //
    // this.restApiService.getSingleCustomerData(id).subscribe({
    //   next: data => {
    //     const users = JSON.parse(data);
    //     this.econtent = users.data;
    //     this.customerForm.controls['customer'].setValue(this.econtent.customer);
    //     this.customerForm.controls['email'].setValue(this.econtent.email);
    //     this.customerForm.controls['phone'].setValue(this.econtent.phone);
    //     this.customerForm.controls['date'].setValue(this.econtent.date);
    //     this.customerForm.controls['status'].setValue(this.econtent.status);
    //     this.customerForm.controls['ids'].setValue(this.econtent._id);
    //   },
    //   error: err => {
    //     this.content = JSON.parse(err.error).message;
    //   }
    // });

  }

  /**0
   * Confirmation mail model
   */
  modelId: any;

  confirm(content: any, id: any) {
    this.modelId = id;
    this.modal.open(content, { centered: true });
  }

  loadPage(params: any = {}) {
    params['page'] = this.pagination.page_no
    params['per'] = this.pagination.page_size
    this.rest.index('books', params).subscribe(body => {
      this.books = body.data;
      this.pagination = body.pagination || this.pagination;
    });
  }

  /**
   * Save user
   */
  saveUser() {
    // if (this.customerForm.valid) {
    //   if (this.customerForm.get('ids')?.value) {
    //     this.rest.patchCustomerData(this.customerForm.value).subscribe(
    //       (data: any) => {
    //         this.service.customers = this.content.map((order: { _id: any; }) => order._id === data.data.ids ? { ...order, ...data.data } : order);
    //         this.modal.dismissAll();
    //       }
    //     )
    //   }
    //   else {
    //     this.rest.postCustomerData(this.customerForm.value).subscribe(
    //       (data: any) => {
    //         this.service.customers.push(data.data);
    //         this.modal.dismissAll();
    //         let timerInterval: any;
    //         Swal.fire({
    //           title: 'Customers inserted successfully!',
    //           icon: 'success',
    //           timer: 2000,
    //           timerProgressBar: true,
    //           willClose: () => {
    //             clearInterval(timerInterval);
    //           },
    //         }).then((result) => {
    //           /* Read more about handling dismissals below */
    //           if (result.dismiss === Swal.DismissReason.timer) {
    //           }
    //         });
    //       },)
    //   }
    // }
    // setTimeout(() => {
    //   this.customerForm.reset();
    // }, 2000);
    // this.submitted = true
  }


}
