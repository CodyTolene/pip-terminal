import { StripInlineStylesDirective } from 'src/app/directives';
import { ContentComponent } from 'src/app/layout/content/content.component';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { SidenavComponent } from 'src/app/layout/navigation/sidenav.component';

import { Component } from '@angular/core';

@Component({
  selector: 'pip-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss',
  imports: [
    ContentComponent,
    HeaderComponent,
    SidenavComponent,
    StripInlineStylesDirective,
  ],
  standalone: true,
})
export class DefaultLayoutComponent {}
