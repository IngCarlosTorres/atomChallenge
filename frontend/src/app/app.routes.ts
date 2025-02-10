import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/home",
        pathMatch: "full"
    },
    {
        path: "home",
        loadComponent: () => import("./modules/home-page/home-page.component").then((m) => m.HomePageComponent)

    },
    {
        path: "login",
        loadComponent: () => import("./modules/login/login.component").then((m) => m.LoginComponent)
    },
    {
        path: "dashboard",
        loadComponent: () => import("./modules/dashboard/dashboard.component").then((m) => m.DashboardComponent)
    },
    {
        path: "newtask",
        loadComponent: () => import("./modules/newtask/newtask.component").then((m) => m.NewtaskComponent)
    }
];
