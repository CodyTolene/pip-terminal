import { PipFooterComponent } from 'src/app/layout';
import { AuthService, ForumPostsService } from 'src/app/services';
import { shareSingleReplay } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ForumHeaderComponent } from 'src/app/components/forum/header/forum-header';
import { PipForumPostFormComponent } from 'src/app/components/forum/post/post-form';
import { PipPanelComponent } from 'src/app/components/panel/panel';
import { PipTitleComponent } from 'src/app/components/title/title';

@Component({
  selector: 'pip-forum-post-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ForumHeaderComponent,
    PipFooterComponent,
    PipForumPostFormComponent,
    PipPanelComponent,
    PipTitleComponent,
  ],
  providers: [ForumPostsService],
  templateUrl: './post-page.html',
  styleUrls: ['./post-page.scss'],
})
export class ForumPostPage {
  private readonly authService = inject(AuthService);

  protected readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());
}
