import {Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {NutritionGuideComponent} from './pages/nutrition-guide/nutrition-guide.component';
import {EditComponent} from './pages/edit/edit.component';
import {ChangeHistoryComponent} from './pages/change-history/change-history.component';
import {CommitComponent} from './pages/commit/commit.component';

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
    path: 'change-history',
    component: ChangeHistoryComponent
  },
  {
    path: 'commit/:id/:prevId',
    component: CommitComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
];
