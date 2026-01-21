import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: '',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'clientes',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./clientes/components/clientes-list.component').then(m => m.ClientesListComponent)
                    },
                    {
                        path: 'novo',
                        loadComponent: () => import('./clientes/components/cliente-form.component').then(m => m.ClienteFormComponent)
                    },
                    {
                        path: ':id/editar',
                        loadComponent: () => import('./clientes/components/cliente-form.component').then(m => m.ClienteFormComponent)
                    }
                ]
            },
            {
                path: 'livros',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./livros/components/livros-list.component').then(m => m.LivrosListComponent)
                    },
                    {
                        path: 'novo',
                        loadComponent: () => import('./livros/components/livro-form.component').then(m => m.LivroFormComponent)
                    },
                    {
                        path: ':id/editar',
                        loadComponent: () => import('./livros/components/livro-form.component').then(m => m.LivroFormComponent)
                    }
                ]
            },
            {
                path: 'reservas',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./reservas/components/reservas-list.component').then(m => m.ReservasListComponent)
                    },
                    {
                        path: 'nova',
                        loadComponent: () => import('./reservas/components/reserva-form.component').then(m => m.ReservaFormComponent)
                    }
                ]
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
