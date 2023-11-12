import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-spin-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spin-input.component.html',
  styleUrls: ['./spin-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SpinInputComponent),
      multi: true
    }
  ]
})
export class SpinInputComponent implements ControlValueAccessor, OnInit {
  @Input('value') _value: number = 0;
  @Input('spin-class') _spinClass: string = "";
  @Input('min') _min: number = 0;
  @Input('max') _max: number = 0;

  private _onTouchedCallback: () => void = () => {};
  private _onChangeCallback: (_: any) => void = () => {};

  writeValue(obj: number): void {
    this._value = obj;
    this._onChangeCallback(obj);
    this._onTouchedCallback();
  }

  registerOnChange(fn: any): void {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouchedCallback = fn;
  }


  ngOnInit(): void {

  }

  increment() {
    this.writeValue(this._value + 1);
  }

  decrement() {
    this.writeValue(this._value - 1);
  }

}
