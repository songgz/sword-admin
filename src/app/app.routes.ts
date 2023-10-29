import { Routes } from '@angular/router';
import {VerticalComponent} from "./layouts/vertical/vertical.component";

export const routes: Routes = [
  {
    path: '',
    component: VerticalComponent,
    children: [
      {
        path: 'schools',
        loadComponent: () => import('./views/school/school.component').then((mod) => mod.SchoolComponent)
      },
      {
        path: 'books',
        loadComponent: () => import('./views/book/book.component').then((mod) => mod.BookComponent)
      },
      {
        path: 'units',
        loadComponent: () => import('./views/unit/unit.component').then((mod) => mod.UnitComponent)
      },
      {
        path: 'words',
        loadComponent: () => import('./views/word/word.component').then((mod) => mod.WordComponent)
      },
      {
        path: 'teachers',
        loadComponent: () => import('./views/teacher/teacher.component').then((mod) => mod.TeacherComponent)
      },
      {
        path: 'students',
        loadComponent: () => import('./views/student/student.component').then((mod) => mod.StudentComponent)
      },
      {
        path: 'cards',
        loadComponent: () => import('./views/card/card.component').then((mod) => mod.CardComponent)
      }


    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./layouts/login/login.component').then(mod => mod.LoginComponent)
  }


];
