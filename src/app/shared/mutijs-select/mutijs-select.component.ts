import {Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-mutijs-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mutijs-select.component.html',
  styleUrls: ['./mutijs-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MutijsSelectComponent),
      multi: true
    }
  ]
})
export class MutijsSelectComponent implements ControlValueAccessor, OnInit, OnChanges  {
  @Input('items')
  _items: any[] = [];

  @Input('groups')
  _groups: any[] = [];


  selectedItems: any[] = [];

  @Input('value') _value: string[] = [];
  private _onTouchedCallback: () => void = () => {};
  private _onChangeCallback: (_: any) => void = () => {};
  private key: string = "";

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) :void {
    if (changes['_items']) {
      this.selectedItems = this._items.filter(i => this._value.includes(i.id));
    }
  }

  registerOnChange(fn: any): void {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouchedCallback = fn;
  }

  writeValue(value: string[]): void {
    this._value = value;
    this._onChangeCallback(value);
  }

  search(event: Event) {
    this.key = (event.target as HTMLInputElement).value;
    console.log(this.key);
  }

  // get items(): any[] {
  //   return this.findItems();
  // }
  findItems(groupId?: string): any[] {
    if(groupId) {
      return this._items.filter(i => i.name.toString().includes(this.key) && i.kind === groupId);
    }
    return this._items.filter(i => i.name.toString().includes(this.key));
  }

  forward_move(id: string) {
    let item = this._items.find(i => i.id === id);
    this.selectedItems.push(item);
    this.writeValue(this.selectedItems.map(i => i.id));
  }

  reverse_move(id: string) {
    let index = this.selectedItems.findIndex(d => d.id === id);
    this.selectedItems.splice(index, 1);
    this.writeValue(this.selectedItems.map(i => i.id));
  }

  move_group(groupId: string) {
    let items: any[] = this.findItems(groupId);
    for(let item of items) {
      if(!this.selectedItems.find(i => i.id === item.id)) {
        this.selectedItems.push(item);
      }
    }
    this.writeValue(this.selectedItems.map(i => i.id));
  }

  hasSelectedItems(value: string): boolean {
    return this._value.includes(value);
  }

  ngOnInit(): void {
  }

}
