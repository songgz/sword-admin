import {Directive, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appNgMultijs]',
  standalone: true
})
export class NgMultijsDirective implements OnInit {
  template: string = `
    <a *ngFor="let i of items">{{i.name}}</a>
  `
  @Input() items: any[] = [];

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private renderer: Renderer2,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    const templateElement = this.renderer.createElement('ng-template');
    this.renderer.setProperty(templateElement, 'innerHTML', this.template);

    const embeddedViewRef = this.viewContainerRef.createEmbeddedView(this.templateRef);
    this.viewContainerRef.clear();
    this.viewContainerRef.insert(embeddedViewRef.rootNodes[0]);


    templateElement.context.$implicit = {items: this.items};
    templateElement.detectChanges();
  }

}
