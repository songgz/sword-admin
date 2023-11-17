import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterOutlet} from "@angular/router";
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {NgbCarousel, NgbSlide} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../core/services/auth.service";
import {RestApiService} from "../../core/services/rest-api.service";

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
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;

  constructor(private formBuilder: UntypedFormBuilder, private rest: RestApiService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {

    // Login Api
    this.rest.post('auths/sign_in', this.loginForm.value).subscribe(res => {
      console.log(res);
      if(res){
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
