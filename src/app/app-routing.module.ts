import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoCallComponent } from './components/video-call/video-call.component';

const routes: Routes = [
  { path: '', redirectTo: '/call', pathMatch: 'full' },
  // { path: 'home', component: HomeComponent },
  { path: 'call', component: VideoCallComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
