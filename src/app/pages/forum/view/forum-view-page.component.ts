import { PipFooterComponent } from 'src/app/layout';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  selector: 'pip-forum-view-page',
  standalone: true,
  imports: [
    CommonModule,
    // DateTimePipe,
    FormsModule,
    PipFooterComponent,
    RouterModule,
  ],
  templateUrl: './forum-view-page.component.html',
  styleUrls: ['./forum-view-page.component.scss'],
})
export class ForumViewPageComponent {
  protected readonly forumLink = '/' + ('forum' satisfies PageUrl);

  // TODO: Preload forum post
}
