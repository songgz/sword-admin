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
    this.renderer.setAttribute(search, "placeholder", "搜索...");

    let non_selected = this.non_selected = this.renderer.createElement('div');
    this.renderer.addClass(this.non_selected, "non-selected-wrapper");
    const text1 = this.renderer.createText('未分配');
    const non_head = this.renderer.createElement('div');
    this.renderer.appendChild(non_head, text1);
    this.renderer.addClass(non_head, "header");
    this.selected = this.renderer.createElement('div');
    this.renderer.addClass(this.selected, "selected-wrapper");
    const text2 = this.renderer.createText('已分配');
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
      non_selected.innerHTML = '';
      for(let o of this.el.nativeElement.options) {
        if (event.data === null || o.text.toString().includes(event.data.toString()))  {
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
      for (let o of options) {
        let a = this.createA(o);
        this.renderer.appendChild(this.non_selected, a);

        if (o.hasAttribute("selected")) {
          let a1 = this.createA(o);
          this.renderer.appendChild(this.selected, a1);
        }
      }
    }
    this.pre_len = options.length;
  }

  createA(option: any) {
    let a = this.renderer.createElement('a');
    this.renderer.addClass(a, "item");
    if (option.hasAttribute("selected")) {
      this.renderer.addClass(a, "selected");
    }
    this.renderer.setAttribute(a, "data-value", option.value);
    let t = this.renderer.createText(option.text);
    this.renderer.appendChild(a, t);
    this.renderer.listen(a, 'click', event => {
      event.stopPropagation();
      this.move(a);
    });
    return a
  }

  trigger_event(type: any, el: Element) {
    const event = new Event(type);
    let e = document.createEvent("HTMLEvents");
    e.initEvent(type, false, true);
    el.dispatchEvent(e);
  };
  move(a: any) {
    let option = this.el.nativeElement.querySelectorAll("option[value=\"" +a.getAttribute("data-value")+ "\"]")[0];
    let n = this.el.nativeElement.parentElement.querySelector('.non-selected-wrapper').querySelectorAll("a[data-value=\""+a.getAttribute("data-value")+"\"]")[0];

    if (option.hasAttribute("selected")) {
      this.renderer.removeAttribute(option, "selected");
      let s = this.el.nativeElement.parentElement.querySelector('.selected-wrapper').querySelectorAll("a[data-value=\""+a.getAttribute("data-value")+"\"]")[0];
      this.renderer.removeChild(this.selected, s);
      if(n){
        this.renderer.removeClass(n, "selected");
      }

    }else{
      this.renderer.setAttribute(option, "selected", "");
      this.renderer.addClass(n, "selected");
      let a1 = this.createA(option);
      this.renderer.appendChild(this.selected, a1);
    }
    const event = new Event("change");
    this.el.nativeElement.dispatchEvent(event);

    console.log(this.el.nativeElement.value);

  }


}
