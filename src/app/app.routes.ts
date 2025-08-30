import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductoComponent } from './features/producto/producto.component';
import { PersonaComponent } from './features/persona/persona.component';
import { CarritoComponent } from './features/carrito/carrito.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthComponent } from './auth/login/auth.component';
import { RegisterComponent } from './auth/register/register.component';
import { SexoComponent } from './features/sexo/sexo.component';
import { RolComponent } from './features/rol/rol.component';
import { UsuarioComponent } from './features/usuario/usuario.component';
import { UnidadMedidaComponent } from './features/unidad-medida/unidad-medida.component';
import { CategoriaComponent } from './features/categoria/categoria.component';
import { PersonaModalComponent } from './features/persona/persona-modal.component';
import { PagoexitosoComponent } from './shared/pagos/pagoexitoso/pagoexitoso.component';
import { PedidosComponent } from './features/pedidos/pedidos.component';
import { RoleGuard } from './core/guards/rol.guard';
import { DeniedAccessComponent } from './shared/denied-access/denied-access.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { DashboardresumenComponent } from './featuresPages/dashboardresumen/dashboardresumen.component';
import { SobrenosotrosComponent } from './featuresPages/sobrenosotros/sobrenosotros.component';
import { EstadoComponent } from './features/estado/estado.component';

export const routes: Routes = [
  {
    path: '',
    //rutas con layout
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'producto',
        component: ProductoComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      {
        path: 'persona',
        component: PersonaComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      {
        path: 'rol',
        component: RolComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      {
        path: 'usuario',
        component: UsuarioComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      {
        path: 'unidadMedida',
        component: UnidadMedidaComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      {
        path: 'categoria',
        component: CategoriaComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      {
        path: 'sexo',
        component: SexoComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      { path: 'carrito', component: CarritoComponent },
      { path: 'home', component: HomeComponent },
      { path: 'success', component: PagoexitosoComponent },
      { path: 'pedidos', component: PedidosComponent },
      { path: 'dashresumen', component: DashboardresumenComponent },
      { path: 'nosotros', component: SobrenosotrosComponent },
      { path: 'estado', component: EstadoComponent },
    ],
  },

  //rutas sin layouts

  { path: 'login', component: AuthComponent },
  { path: 'personaregistro', component: PersonaModalComponent },

  { path: 'register', component: RegisterComponent },

  {
    path: 'acceso-denegado',
    component: DeniedAccessComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
