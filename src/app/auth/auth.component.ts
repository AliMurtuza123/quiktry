import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { AuthResponseData, AuthService } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy{
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    private closeSub: Subscription;
    @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
    

    constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver){}

    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm){
        if(form.invalid){
            return;
        }
        const email = form.value.email;
        const password = form.value.password;
        let authObs: Observable<AuthResponseData>;

        this.isLoading = true;

        if(this.isLoginMode){
           authObs = this.authService.signIn(email,password);
        }
        else{
            authObs = this.authService.signUp(email,password);
        }
        authObs.subscribe(
            resData =>{
                console.log(resData);
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            },
            // errorRes => {
            //     console.log(errorRes);
            //     switch(errorRes.error.error.message){
            //         case 'EMAIL_EXISTS':
            //         this.error = 'This email already exists in our database';
            //     }
            //     this.isLoading = false;
            // }
            errorMessage => {
                console.log(errorMessage);
                this.error = errorMessage;
			this.showErrorAlert(errorMessage);
                this.isLoading = false;
            }
        );
        form.reset();
    }

    onHandleError(){
        this.error = null;
    }

    private showErrorAlert(message: string){
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();
        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(()=>{
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }

    ngOnDestroy(): void {
        if(this.closeSub){
        this.closeSub.unsubscribe();
    }
    }
}