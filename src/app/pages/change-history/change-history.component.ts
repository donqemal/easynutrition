import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SupabaseService} from '../../services/supabase.service';
import {NutritionGuide} from '../../types/types';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-change-history',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './change-history.component.html',
  styleUrl: './change-history.component.scss'
})
export class ChangeHistoryComponent implements OnInit {
  isAdmin: boolean = false;
  changeHistory: NutritionGuide[] = [];

  constructor(private supabaseService: SupabaseService, private router: Router) {
  }

  ngOnInit() {
    this.supabaseService.getSession().subscribe((session) => {
      if (session.data.session?.user.email === 'edon_malushaj@hotmail.com' ||
        session.data.session?.user.email === 'xxnicerdicerxx@gmail.com' ||
        session.data.session?.user.email === 'natachan6@gmail.com') {
        this.isAdmin = true;
      } else {
        this.router.navigate(['/']);
      }
    });
    this.supabaseService.getChangeHistory().then((content) => {
      this.changeHistory = content;
    });
  }

  openCommit(change: NutritionGuide) {
    this.router.navigate(['/commit/' + change.id + '/' + (change.id! - 1)]);
  }
}
