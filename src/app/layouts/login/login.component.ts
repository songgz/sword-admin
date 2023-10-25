import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterOutlet} from "@angular/router";
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {NgbCarousel, NgbSlide} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgbCarousel, NgbSlide, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit  {
  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;

  constructor(private formBuilder: UntypedFormBuilder, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    /**
     * Form Validatyion
     */
    this.loginForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // Login Api
    this.auth.login(this.f['name'].value, this.f['password'].value).subscribe((data:any) => {
      console.log(data);
      if(data){
        this.router.navigate(['/']).then();
      } else {
        //this.toastService.show(data.data, { classname: 'bg-danger text-white', delay: 15000 });
      }
    });
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
