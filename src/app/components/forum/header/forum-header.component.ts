import { ForumCategoryEnum } from 'src/app/enums';
import { ForumPost, PipUser } from 'src/app/models';
import { CATEGORY_TO_SLUG } from 'src/app/routing';
import { AuthService } from 'src/app/services';

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { Component, Input, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  selector: 'pip-forum-header[user]',
  templateUrl: './forum-header.component.html',
  imports: [CommonModule, MatIconModule, RouterModule],
  styleUrl: './forum-header.component.scss',
  standalone: true,
})
export class ForumHeaderComponent {
  private readonly authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  protected readonly loginLink = loginLink;
  protected readonly forumLink = forumLink;
  protected readonly forumNewPostLink = forumNewPostLink;

  @Input({ required: false, transform: coerceBooleanProperty })
  public isCreate = false;

  public readonly category = input<ForumCategoryEnum | null>(null);
  public readonly post = input<ForumPost | null>(null);
  public readonly user = input.required<PipUser | null>();

  protected readonly categoryUrl = computed(() =>
    this.category()
      ? forumCategoryLink.replace(':id', CATEGORY_TO_SLUG[this.category()!])
      : null,
  );

  protected getReturnUrlQueryParams(): object {
    return { returnUrl: window.location.pathname };
  }
}

const forumLink = '/' + ('forum' satisfies PageUrl);
const forumCategoryLink = '/' + ('forum/category/:id' satisfies PageUrl);
const forumNewPostLink = '/' + ('forum/post' satisfies PageUrl);
const loginLink = '/' + ('login' satisfies PageUrl);
