import {Component, TemplateRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {BreadcrumbsComponent} from "../../shared/breadcrumbs/breadcrumbs.component";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbModal, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {RestApiService} from "../../core/services/rest-api.service";
import {defineElement} from "@lordicon/element";
import lottie from "lottie-web";
import {env} from "../../../environments/environment";

@Component({
  selector: 'app-word',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, FormsModule, NgbPagination, ReactiveFormsModule, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu],
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent {
  breadCrumbItems: any[] = [];
  pagination = {page_no: 1, page_size: 20, total_count: 0, page_count: 0};
  models: any[] = [];
  modelId = "";
  gForm!: UntypedFormGroup;
  private searchSubject: Subject<any> = new Subject();
  state: any = {key: "", book_category: "ENGLISH_WORD"};
  @ViewChild('formTpl') formTpl: TemplateRef<any> | undefined;

  constructor(public rest: RestApiService, private modal: NgbModal,  private formBuilder: UntypedFormBuilder) {
    defineElement(lottie.loadAnimation);

  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: '教材' },
      { label: '单词管理', active: true }
    ];

    this.gForm = this.formBuilder.group({
      id: [null],
      word: ['', [Validators.required]],
      phonetic_symbol: [''],
      acceptation: [''],
      example: [''],
      picture: [''],
      parse: [''],
      pronunciation: [''],
      usage: [''],
      status: [''],
    });

    this.searchSubject.pipe(
      debounceTime(500)
      //distinctUntilChanged()
    ).subscribe(params => {
      this.loadPage();
    });
    this.loadPage();
  }

  search(event?: Event) {
    //console.log((event.target as HTMLInputElement).value);
    this.pagination.page_no = 1;
    this.searchSubject.next(this.state);
  }

  get form() {
    return this.gForm.controls;
  }

  loadPage(params?: {}) {
    this.state['page'] = this.pagination.page_no;
    this.state['per'] = this.pagination.page_size;
    this.rest.index('words', this.state).subscribe(body => {
      this.models = body.data;
      this.pagination = body.pagination || this.pagination;
    });
  }


  openModal(content: any) {
    this.gForm.reset();
    this.modal.open(content, { size: 'md', centered: true });
  }

  delConfirmDialog(id: any, content?: any) {
    this.modelId = id;
    this.modal.open(content, { centered: true });
  }

  editDialog(id: any, content?: any) {
    let model = this.models.find(obj => obj.id === id);
    this.gForm.controls['id'].setValue(model.id);
    this.gForm.controls['word'].setValue(model.word);
    this.gForm.controls['phonetic_symbol'].setValue(model?.phonetic_symbol);
    this.gForm.controls['acceptation'].setValue(model?.acceptation);
    this.gForm.controls['example'].setValue(model?.example);
    this.gForm.controls['picture'].setValue(model?.picture);
    this.gForm.controls['parse'].setValue(model?.parse);
    this.gForm.controls['pronunciation'].setValue(model?.pronunciation);
    this.gForm.controls['usage'].setValue(model?.usage);
    this.gForm.controls['status'].setValue(model?.status);

    this.modal.open(content || this.formTpl, { size: 'md', centered: true });
    let modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = '编辑单词';
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

  // File Upload
  imageURL: string | undefined;
  fileChange(event: any) {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    document.getElementById('')
    this.gForm.patchValue({
      // image_src: file.name
      image_src: 'brands/dribbble.png'
    });
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      (document.getElementById('companylogo-img') as HTMLImageElement).src = this.imageURL;
    }
    reader.readAsDataURL(file)
  }

  protected readonly env = env;
}
