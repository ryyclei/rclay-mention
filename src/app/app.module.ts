import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {
  NbThemeModule,
  NbButtonModule,
  NbLayoutModule,
  NbIconModule,
  NbTabsetModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbListModule,
  NbTagModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

import { AppComponent } from './app.component';
import { MentionDirective } from './mention/mention.directive';
import { MentionListComponent } from './mention/mention-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, MentionDirective, MentionListComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NbButtonModule,
    NbLayoutModule,
    NbIconModule,
    NbTabsetModule,
    NbCardModule,
    NbInputModule,
    NbSelectModule,
    NbListModule,
    NbTagModule,
    NbEvaIconsModule,
    NbThemeModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
