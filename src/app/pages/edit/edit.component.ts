import {Component, OnDestroy, OnInit} from '@angular/core';
import {Editor, NgxEditorModule, Toolbar, Validators} from "ngx-editor";
import {SupabaseService} from '../../services/supabase.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NutritionGuide} from '../../types/types';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    NgxEditorModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit, OnDestroy {
  isAdmin: boolean = false;
  editor!: Editor;
  nutritionGuide: NutritionGuide = {
    description: '',
    editor: '',
    commit_message: ''
  };
  form = new FormGroup({
    editorContent: new FormControl('', Validators.required()),
  });

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(private supabaseService: SupabaseService, private router: Router) {
  }

  ngOnInit(): void {
    this.supabaseService.getSession().subscribe((session) => {
      if (session.data.session?.user.email === 'edon_malushaj@hotmail.com' ||
        session.data.session?.user.email === 'xxnicerdicerxx@gmail.com' ||
        session.data.session?.user.email === 'natachan6@gmail.com') {
        this.isAdmin = true;
      } else {
        this.router.navigate(['/']);
      }
    });
    this.editor = new Editor({keyboardShortcuts: true});
    this.supabaseService.getNutritionGuide().then((content) => {
      this.editor.setContent(JSON.parse(content as string));
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  async saveChanges() {
    if (this.isAdmin) {
      try {
        this.nutritionGuide.description = this.editor.view.state.doc.toJSON();
        await this.supabaseService.postNutritionGuide(this.nutritionGuide);
        alert('Ernährungsguide wurde erfolgreich aktualisiert!');
        this.nutritionGuide.commit_message = '';
      } catch (error) {
        console.error('Error saving changes:', error);
        alert('Fehler beim Speichern der Änderungen.');
      }
    } else {
      alert('Nicht autorisiert, um Änderungen vorzunehmen!');
    }
  }
}
