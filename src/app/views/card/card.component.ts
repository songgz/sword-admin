import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {BreadcrumbsComponent} from "../../shared/breadcrumbs/breadcrumbs.component";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {NgbModal, NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {RestApiService} from "../../core/services/rest-api.service";
import {defineElement} from "@lordicon/element";
import lottie from "lottie-web";

@Component({
  selector: 'app-card',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, BreadcrumbsComponent, FormsModule, NgbPagination, NgbTooltip, ReactiveFormsModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  breadCrumbItems: any[] = [];
  pagination = {page_no: 1, page_size: 0, total_count: 0};
  models: any[] = [];
  gForm!: UntypedFormGroup;
  private searchUpdated: Subject<string> = new Subject();
  schools: any[] = [];

  constructor(private rest: RestApiService, private modal: NgbModal,  private formBuilder: UntypedFormBuilder,) {
    defineElement(lottie.loadAnimation);
  }

  loadSchools() {
    this.rest.index('schools').subscribe(body => {
      this.schools = body.data;
    });
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: '销售' },
      { label: '充值卡管理', active: true }
    ];

    this.gForm = this.formBuilder.group({
      school_id: [null, [Validators.required]],
      kind: ['HALF_YEAR', [Validators.required]],
      qty: ['1', [Validators.required]]
    });

    this.searchUpdated.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(key => {
      this.loadPage({key: key});
    });

    this.loadPage();
    this.loadSchools();
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
    this.modal.open(content, { size: 'md', centered: true });
  }


  // Default
  counter = 1;
  increment() {
    this.counter++;
  }

  decrement() {
    this.counter--;
  }

  genCard() {
    let cards :any[] =[];
    let v = this.gForm.value;
    if (this.gForm.valid) {
      for(let i = 0; i < this.counter; i++) {
        cards.push({school_id: v.school_id, kind: v.kind});
      }

      this.rest.post('cards/multi_create', {cards: cards}).subscribe(body => {
        this.models = body.data;
        this.modal.dismissAll();
      });
    }

  }
}
