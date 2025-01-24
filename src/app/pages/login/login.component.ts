import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SupabaseService} from '../../services/supabase.service';
import {Router} from '@angular/router';
import {FooterComponent} from '../../components/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FooterComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private supabase: SupabaseService, private router: Router, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.supabase.getSession().subscribe((session) => {
      if (session.data?.session) {
        this.isLoggedIn = true;
        this.cdr.detectChanges();
      }
    });
  }

  async login() {
    await this.supabase.handleGoogleLogin();
  }

  async logout() {
    await this.supabase.logout();
    window.location.href = '/';
  }
}
