import {AfterViewInit, Directive, ElementRef, Input, OnInit, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appMultijs]',
  standalone: true
})
export class MultijsDirective implements OnInit {
  non_selected: ElementRef | undefined;
  selected: ElementRef | undefined;
  options: ElementRef[] | undefined
  pre_len: number = 0;

  @Input() items: any[] = [];

  constructor(private readonly el: ElementRef, readonly renderer: Renderer2) {

  }

  ngOnInit() {
    const search = this.renderer.createElement('input');
    this.renderer.addClass(search, "search-input");

    let non_selected = this.non_selected = this.renderer.createElement('div');
    this.renderer.addClass(this.non_selected, "non-selected-wrapper");
    const text1 = this.renderer.createText('未指派');
    const non_head = this.renderer.createElement('div');
    this.renderer.appendChild(non_head, text1);
    this.renderer.addClass(non_head, "header");
    this.selected = this.renderer.createElement('div');
    this.renderer.addClass(this.selected, "selected-wrapper");
    const text2 = this.renderer.createText('已指派');
    const head = this.renderer.createElement('div');
    this.renderer.appendChild(head, text2);
    this.renderer.addClass(head, "header");
    const wrapper = this.renderer.createElement('div');
    this.renderer.addClass(wrapper, "multi-wrapper");
    this.renderer.appendChild(wrapper, search);
    this.renderer.appendChild(this.non_selected, non_head);
    this.renderer.appendChild(wrapper, this.non_selected);
    this.renderer.appendChild(this.selected, head);
    this.renderer.appendChild(wrapper, this.selected);
    this.renderer.appendChild(this.el.nativeElement.parentElement, wrapper);
    this.renderer.listen(search, 'input', event => {
      console.log(event.data);
      non_selected.innerHTML = '';

      for(let o of this.el.nativeElement.options) {
        console.log(o.text);
        console.log(o.text.toString().includes(event.data.toString()));
        if (event.data.search(o.text))  {
          let a = this.createA(o);
          this.renderer.appendChild(non_selected, a);
        }

      }

    });
  }

  ngDoCheck(): void {
    let options = this.el.nativeElement.options;
    console.log(options.length);
    if (options.length !== this.pre_len) {
      this.pre_len = options.length;
      for (let option of options) {
        let a = this.createA(option);
        if (option.hasAttribute("selected")) {
          this.renderer.appendChild(this.selected, a);
        } else {
          this.renderer.appendChild(this.non_selected, a);
        }
      }
    }
  }

  createA(option: any) {
    let a = this.renderer.createElement('a');
    this.renderer.addClass(a, "item");
    this.renderer.setAttribute(a, "data-value", option.text);
    let t = this.renderer.createText(option.text);
    this.renderer.appendChild(a, t);
    this.renderer.listen(a, 'click', event => {
      event.stopPropagation();
      this.move(a);
    });
    return a
  }

  move(a: any) {
    for (let o of this.el.nativeElement.options) {
      if (o.text == a.text) {
        if (o.hasAttribute("selected")) {
          this.renderer.removeChild(this.selected, a);
          this.renderer.appendChild(this.non_selected, a);
          this.renderer.removeAttribute(o, "selected");
        } else {
          this.renderer.removeChild(this.non_selected, a);
          this.renderer.appendChild(this.selected, a);
          this.renderer.setAttribute(o, "selected", "");
        }
      }
    }
  }


}
