import {Component, OnInit} from '@angular/core';
import {SupabaseService} from '../../services/supabase.service';
import {NgxEditorModule, toHTML} from 'ngx-editor';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {FooterComponent} from '../../components/footer/footer.component';

@Component({
  selector: 'app-nutrition-guide',
  standalone: true,
  imports: [
    NgxEditorModule,
    FooterComponent
  ],
  templateUrl: './nutrition-guide.component.html',
  styleUrl: './nutrition-guide.component.scss'
})
export class NutritionGuideComponent implements OnInit {
  releaseTime: any;
  remainingTime: string = '';
  isAdmin: boolean = false;
  nutritionGuide: SafeHtml = '';

  constructor(private supabase: SupabaseService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.setAdmins();
    this.supabase.getNutritionGuide().then((content) => {
      const html = toHTML(JSON.parse(content as string));
      this.nutritionGuide = this.sanitizer.bypassSecurityTrustHtml(html);
    });
    this.releaseTime = setInterval(() => {
      let now = new Date();
      let end = new Date('2025-01-31T23:59:59'); // Release Date
      let diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(this.releaseTime);
        this.remainingTime = "00:00:00";
        this.isAdmin = true;
      }

      let totalSeconds = Math.floor(diff / 1000);
      let days = Math.floor(totalSeconds / (24 * 60 * 60));
      totalSeconds %= (24 * 60 * 60);
      let hours = Math.floor(totalSeconds / (60 * 60));
      totalSeconds %= (60 * 60);
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = totalSeconds % 60;

      this.remainingTime = `${days} ${days == 1 ? 'Tag' : 'Tage'}, ${this.pad(hours)} ${hours == 1 ? 'Stunde' : 'Stunden'}, ${this.pad(minutes)} ${minutes == 1 ? 'Minute' : 'Minuten'}, ${this.pad(seconds)} ${seconds <= 1 ? 'Sekunde' : 'Sekunden'}`;
    });
  }

  pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  setAdmins() {
    this.supabase.getSession().subscribe((session) => {
      if (session.data.session?.user.email === 'edon_malushaj@hotmail.com' ||
        session.data.session?.user.email === 'xxnicerdicerxx@gmail.com' ||
        session.data.session?.user.email === 'natachan6@gmail.com') {
        this.isAdmin = true;
      }
    });
  }
}
