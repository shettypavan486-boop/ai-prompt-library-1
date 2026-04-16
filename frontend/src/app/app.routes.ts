import { Routes } from '@angular/router';
import { PromptListComponent } from './components/prompt-list/prompt-list';
import { PromptDetailComponent } from './components/prompt-detail/prompt-detail';
import { AddPromptComponent } from './components/add-prompt/add-prompt';

export const routes: Routes = [
  { path: '', redirectTo: 'prompts', pathMatch: 'full' },
  { path: 'prompts', component: PromptListComponent },
  { path: 'prompts/:id', component: PromptDetailComponent },
  { path: 'add-prompt', component: AddPromptComponent }
];
