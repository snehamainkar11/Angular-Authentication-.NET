import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { FirstkeyPipe } from '../../shared/pipes/firstkey.pipe';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule ,CommonModule,FirstkeyPipe , RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
 form: FormGroup;
 isSubmitted = false;

passwordmatchValidator: ValidatorFn = (control : AbstractControl):null =>{
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if( password && confirmPassword && password.value != confirmPassword.value)
    confirmPassword?.setErrors({passwordMismatch: true});
  else
    confirmPassword?.setErrors(null);
  return null;
}

 constructor(public formBuilder: FormBuilder, 
            private service: AuthService,
            private toastr :ToastrService) {
   this.form = this.formBuilder.group({
     fullname: ['' ,Validators.required],
     email: ['',[Validators.required, Validators.email]],
     password: ['',[Validators.required, Validators.minLength(6), Validators.pattern(/(?=.*[0-9])(?=.*[a-zA-Z])/)]],
     confirmPassword: [''],
   },{validators: this.passwordmatchValidator});
 }

 onSubmit() {
  this.isSubmitted = true;

  if (this.form.valid) {
    this.service.createUser(this.form.value).subscribe({
      next: (res: any) => {
        if (res.succeeded) {
          console.log(res);
          this.form.reset();
          this.isSubmitted = false;
          this.toastr.success('New user created!', 'Registration Successful');
        } else {
          res.error.errors.forEach((element: any) => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error('Username is already taken!', 'Registration Failed!');
                break;
              case 'DuplicateEmail':
                this.toastr.error('Email is already taken!', 'Registration Failed!');
                break;
              default:
                this.toastr.error('An unexpected error occurred. Please contact support.', 'Registration Failed!');
            }
          });
          this.isSubmitted = false; // Allow retry
        }
      },
      error: (err) => {
        this.isSubmitted = false; // Allow retry

        if (err.error && err.error.errors) {
          err.error.errors.forEach((element: any) => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error('Username is already taken!', 'Registration Failed!');
                break;
              case 'DuplicateEmail':
                this.toastr.error('Email is already taken!', 'Registration Failed!');
                break;
              default:
                this.toastr.error('An unexpected error occurred. Please contact support.', 'Registration Failed!');
            }
          });
        } else {
          this.toastr.error('Something went wrong. Please try again later.', 'Registration Failed!');
          console.error('Unhandled error:', err);
        }
      }
    });
  } else {
    this.toastr.error('Please fill out the form correctly.', 'Validation Error');
    this.isSubmitted = false;
  }
}


 hasDisplayableError(controlName: string) :Boolean{
  const control = this.form.get(controlName);
  return control?.invalid && (control?.touched || this.isSubmitted|| control?.dirty) ? true : false;
 }
}
