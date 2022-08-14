import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { DataStorageService } from './shared/data-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private dataStorage: DataStorageService, private authService: AuthService){}

  ngOnInit(): void {
    this.dataStorage.fetchRecipes().subscribe();
    this.authService.autoLogin();
  }
}
