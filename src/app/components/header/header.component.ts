import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {SupabaseService} from '../../services/supabase.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  @ViewChild('menu', {static: false}) menu!: ElementRef;

  isAdmin: boolean = false;
  showMenu: boolean = false;

  constructor(private supabase: SupabaseService, private router: Router) {
  }

  ngOnInit() {
    this.supabase.getSession().subscribe((session) => {
      if (session.data.session?.user.email === 'edon_malushaj@hotmail.com' ||
        session.data.session?.user.email === 'xxnicerdicerxx@gmail.com' ||
        session.data.session?.user.email === 'natachan6@gmail.com') {
        this.isAdmin = true;
      }
    });
  }

  routeTo(route: string) {
    this.router.navigate([route]);
    this.toggleMenu();
  }

  toggleMenu() {
    window.scrollTo(0, 0);
    this.showMenu = !this.showMenu;
  }

  @HostListener('window:scroll', ['$event'])
  onScrollEvent(event: any) {
    if (this.menu && this.menu.nativeElement && !this.menu.nativeElement.contains(event.target)) {
      this.showMenu = false;
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    if (this.menu && this.menu.nativeElement && !this.menu.nativeElement.contains(event.target)) {
      this.showMenu = false;
    }
  }
}
