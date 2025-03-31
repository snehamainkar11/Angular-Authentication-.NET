import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule , ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
 form :FormGroup
 isSubmitted = false;
  constructor(public formBuilder: FormBuilder ,private service: AuthService ,private router: Router, private toaster:ToastrService) {
    this.form = this.formBuilder.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
    });
  }
  
  onSubmit() {
    this.isSubmitted = true;
    if(this.form.valid) {
      this.service.signin(this.form.value).subscribe({
        next: (res: any) => {
            localStorage.setItem('token',res.token);
            this.router.navigateByUrl('/dashboard');
          },
          error: (err) => {
            if(err.status == 400) {
              this.toaster.error('Invalid username or password!','Login Failed!');
            }
            else{
              this.toaster.error('Something went wrong!','Login Failed!');
            }
          }
        })
      }
  }

  hasDisplayableError(controlName: string) :Boolean{
    const control = this.form.get(controlName);
    return control?.invalid && (control?.touched || this.isSubmitted|| control?.dirty) ? true : false;
   }
}
