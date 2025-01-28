import {Injectable} from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '../../environments/environment.development';
import {Observable} from 'rxjs';
import {NutritionGuide} from '../types/types';

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
        .select('description')
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

  async postNutritionGuide(nutritionGuide: NutritionGuide): Promise<void> {
    try {
      const session = await this.supabase.auth.getSession();
      const editor = session.data.session?.user?.email;

      await this.supabase
        .from('nutrition_guide')
        .upsert([
          {
            description: nutritionGuide.description,
            editor: editor,
            commit_message: nutritionGuide.commit_message,
          },
        ]);
    } catch (error) {
      console.error('Error in postNutritionGuide:', error);
    }
  }

  getCommitsToCompare(id1: number, id2: number): Promise<NutritionGuide[]> {
    return new Promise((resolve, reject) => {
      this.supabase
        .from('nutrition_guide')
        .select('description')
        .in('id', [id1, id2])
        .then((response) => {
          if (response.error) {
            reject(response.error.message);
          } else if (response.data && response.data.length > 0) {
            resolve(response.data as NutritionGuide[]);
          } else {
            reject('No data found in the nutrition_guide table');
          }
        });
    });
  }

  async getChangeHistory(): Promise<NutritionGuide[]> {
    return new Promise((resolve, reject) => {
      this.supabase
        .from('nutrition_guide')
        .select('*')
        .order('created_at', {ascending: false})
        .then((response) => {
          if (response.error) {
            reject(response.error.message);
          } else if (response.data && response.data.length > 0) {
            resolve(response.data);
          } else {
            reject('No data found in the nutrition_guide table');
          }
        });
    });
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
