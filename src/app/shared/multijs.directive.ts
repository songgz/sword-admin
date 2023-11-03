import {AfterViewInit, Directive, ElementRef, OnInit, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appMultijs]',
  standalone: true
})
export class MultijsDirective implements OnInit {
  non_selected: ElementRef | undefined;
  selected: ElementRef | undefined;
  pre_len: number = 0;

  constructor(private readonly el: ElementRef, readonly renderer: Renderer2) {

  }

  ngOnInit() {
    const search = this.renderer.createElement('input');
    this.renderer.addClass(search, "search-input");
    this.non_selected = this.renderer.createElement('div');
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
  }

  ngDoCheck(): void {

    let options = this.el.nativeElement.options;
    console.log(options.length);
    if (options.length !== this.pre_len) {
      this.pre_len = options.length;
      for (let option of options) {
        let a = this.renderer.createElement('a');
        this.renderer.addClass(a, "item");
        this.renderer.setAttribute(a, "data-value", option.text);
        let t = this.renderer.createText(option.text);
        this.renderer.appendChild(a, t);
        this.renderer.listen(a, 'click', event => {
          event.stopPropagation();
          for (let o of options) {
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
        });

        if (option.hasAttribute("selected")) {
          this.renderer.appendChild(this.selected, a);
        } else {
          this.renderer.appendChild(this.non_selected, a);
        }
      }
    }
  }

  private updateView(): void {

  }

}
