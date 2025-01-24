import {Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {NutritionGuideComponent} from './pages/nutrition-guide/nutrition-guide.component';
import {EditComponent} from './pages/edit/edit.component';

export const routes: Routes = [
  {
    path: '',
    component: NutritionGuideComponent
  },
  {
    path: 'edit',
    component: EditComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
];
