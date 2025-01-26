import {Injectable} from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '../../environments/environment.development';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);

  constructor() {
  }

  getNutritionGuide(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.supabase
        .from('nutrition_guide')
        .select('*')
        .order('id', {ascending: false})
        .limit(1)
        .then((response) => {
          if (response.error) {
            reject(response.error.message);
          } else if (response.data && response.data.length > 0) {
            resolve(response.data[0].description);
          } else {
            reject('No data found in the nutrition_guide table');
          }
        });
    });
  }


  async postNutritionGuide(content: string): Promise<void> {
    this.getSession().subscribe(async (session) => {
      let editor = session.data.session.user.email;

      await this.supabase
        .from('nutrition_guide')
        .upsert([{description: content, editor: editor}]);
    })
  }


  async handleGoogleLogin() {
    await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  }

  async logout() {
    await this.supabase.auth.signOut();
  }

  getSession(): Observable<any> {
    return new Observable((observer) => {
      this.supabase.auth.getSession().then((session) => {
        observer.next(session);
      });
    });
  }
}
