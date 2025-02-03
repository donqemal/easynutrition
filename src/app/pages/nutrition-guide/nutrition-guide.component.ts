import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('container') div!: ElementRef;

  isAdmin: boolean = false;
  nutritionGuide: SafeHtml = '';

  constructor(private supabase: SupabaseService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.setAdmins();
    this.supabase.getNutritionGuide().then((content) => {
      const html = toHTML(JSON.parse(content as string));
      this.nutritionGuide = this.sanitizer.bypassSecurityTrustHtml(html);
      this.observeContainerLoading();
    });
  }

  private observeContainerLoading() {
    const observer = new MutationObserver(() => {
      if (this.div) {
        const element = this.div.nativeElement;

        element.style.height = '0px';
        element.style.overflow = 'hidden';
        element.style.transition = 'height 2s ease-in-out';

        setTimeout(() => {
          this.expandToFullHeight(element, true);
        }, 50);

        window.addEventListener('resize', () => this.expandToFullHeight(element, false));
      }
    });

    observer.observe(document.body, {childList: true, subtree: true});
  }

  private expandToFullHeight(element: HTMLElement, isFirstTime: boolean) {
    if (isFirstTime) {
      const fullHeight = element.scrollHeight;
      element.style.height = `${fullHeight}px`;
    } else {
      element.style.height = 'auto';
    }
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
