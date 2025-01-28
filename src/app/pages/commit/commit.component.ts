import {Component, OnInit, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {SupabaseService} from '../../services/supabase.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {toHTML} from 'ngx-editor';

@Component({
  selector: 'app-commit',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgForOf
  ],
  templateUrl: './commit.component.html',
  styleUrl: './commit.component.scss'
})
export class CommitComponent implements OnInit, AfterViewInit {
  isAdmin: boolean = false;
  firstId: number = 0;
  secondId: number = 0;
  oldHtml: string = '';
  newHtml: string = '';

  @ViewChild('oldContent') oldContent!: ElementRef;
  @ViewChild('newContent') newContent!: ElementRef;

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  ngOnInit() {
    const url = this.router.url.split('/');
    this.firstId = parseInt(url[2]);
    this.secondId = parseInt(url[3]);

    this.supabaseService.getSession().subscribe((session) => {
      if (
        session.data.session?.user.email === 'edon_malushaj@hotmail.com' ||
        session.data.session?.user.email === 'xxnicerdicerxx@gmail.com' ||
        session.data.session?.user.email === 'natachan6@gmail.com'
      ) {
        this.isAdmin = true;
      } else {
        this.router.navigate(['/']);
      }
    });

    this.supabaseService.getCommitsToCompare(this.firstId, this.secondId).then((data) => {
      this.oldHtml = this.convert(data[0].description);
      this.newHtml = this.convert(data[1].description);

      this.highlightChanges();
    });
  }

  convert(data: string): string {
    let html = toHTML(JSON.parse(data) as String);
    return html.replace(/<img [^>]*>/g, '<img>');
  }

  highlightChanges() {
    const oldParser = new DOMParser().parseFromString(this.oldHtml, 'text/html');
    const newParser = new DOMParser().parseFromString(this.newHtml, 'text/html');

    const oldElements = Array.from(oldParser.body.children);
    const newElements = Array.from(newParser.body.children);

    let oldContent = '';
    let newContent = '';

    oldElements.forEach(oldEl => {
      const matchingNewEl = newElements.find(newEl => newEl.outerHTML === oldEl.outerHTML);
      if (!matchingNewEl) {
        oldEl.classList.add('removed');
      }
      oldContent += oldEl.outerHTML;
    });

    newElements.forEach(newEl => {
      const matchingOldEl = oldElements.find(oldEl => oldEl.outerHTML === newEl.outerHTML);
      if (!matchingOldEl) {
        newEl.classList.add('added');
      }
      newContent += newEl.outerHTML;
    });

    setTimeout(() => {
      this.oldContent.nativeElement.innerHTML = oldContent;
      this.newContent.nativeElement.innerHTML = newContent;
    }, 0);
  }

  ngAfterViewInit() {
    this.syncScrolling();
  }

  syncScrolling() {
    const oldEl = this.oldContent.nativeElement;
    const newEl = this.newContent.nativeElement;

    function syncScroll(event: Event) {
      if (event.target === oldEl) {
        newEl.scrollTop = oldEl.scrollTop;
      } else {
        oldEl.scrollTop = newEl.scrollTop;
      }
    }

    oldEl.addEventListener('scroll', syncScroll);
    newEl.addEventListener('scroll', syncScroll);
  }
}
