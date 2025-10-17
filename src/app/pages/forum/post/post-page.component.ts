import { PipFooterComponent } from 'src/app/layout';
import { AuthService, ForumPostsService } from 'src/app/services';
import { shareSingleReplay } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ForumHeaderComponent } from 'src/app/components/forum/header/forum-header.component';
import { PipForumPostFormComponent } from 'src/app/components/forum/post/post-form.component';
import { PipPanelComponent } from 'src/app/components/panel/panel.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

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
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
})
export class ForumPostPageComponent {
  private readonly authService = inject(AuthService);

  protected readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());
}
