import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {PagInicialComponent} from "./componentes/pag-inicial/pag-inicial.component";
import {AgendarServicosComponent
} from "./componentes/agendar-servicos/agendar-servicos.component";
import {LoginComponent} from "./componentes/login/login.component";


const routes: Routes = [
  { path: "", redirectTo: "pag-inicial", pathMatch: "full" },
  { path: "pag-inicial", component: PagInicialComponent },
  { path: "agendar-servicos", component: AgendarServicosComponent },
  { path: "login", component: LoginComponent }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
