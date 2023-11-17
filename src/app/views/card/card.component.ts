import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {BreadcrumbsComponent} from "../../shared/breadcrumbs/breadcrumbs.component";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {NgbModal, NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {RestApiService} from "../../core/services/rest-api.service";
import {defineElement} from "@lordicon/element";
import lottie from "lottie-web";
import {SpinInputComponent} from "../../shared/spin-input/spin-input.component";

@Component({
  selector: 'app-card',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, BreadcrumbsComponent, FormsModule, NgbPagination, NgbTooltip, ReactiveFormsModule, SpinInputComponent],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  breadCrumbItems: any[] = [];
  pagination = {page_no: 1, page_size: 0, total_count: 0};
  models: any[] = [];
  gForm!: UntypedFormGroup;
  private searchUpdated: Subject<string> = new Subject();

  constructor(private rest: RestApiService, private modal: NgbModal,  private formBuilder: UntypedFormBuilder,) {
    defineElement(lottie.loadAnimation);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: '销售' },
      { label: '充值卡管理', active: true }
    ];

    this.gForm = this.formBuilder.group({
      batch_no: [this.generateBatchNumber()],
      kind: ['HALF_YEAR', [Validators.required]],
      qty: [1, [Validators.required]]
    });

    this.searchUpdated.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(key => {
      this.loadPage({key: key});
    });

    this.loadPage();
  }

  generateBatchNumber(): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  search(event: Event) {
    this.searchUpdated.next((event.target as HTMLInputElement).value);
  }

  get form() {
    return this.gForm.controls;
  }

  loadPage(params: any = {}) {
    params['page'] = this.pagination.page_no
    this.rest.index('cards', params).subscribe(body => {
      this.models = body.data;
      this.pagination = body.pagination || this.pagination;
    });
  }


  openModal(content: any) {
    this.gForm.controls['batch_no'].setValue(this.generateBatchNumber());
    this.modal.open(content, { size: 'md', centered: true });
  }

  genCard() {
    let cards :any[] =[];
    let v = this.gForm.value;
    if (this.gForm.valid) {
      for(let i = 0; i < v.qty; i++) {
        cards.push({batch_no: v.batch_no, kind: v.kind});
      }

      this.rest.post('cards/multi_create', {cards: cards}).subscribe(res => {
        this.models = res.data;
        this.modal.dismissAll();
      });
    }

  }
}
