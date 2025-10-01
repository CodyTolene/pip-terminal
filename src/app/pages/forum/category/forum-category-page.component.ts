import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'pip-forum-category-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forum-category-page.component.html',
  styleUrls: ['./forum-category-page.component.scss'],
})
export class ForumCategoryPageComponent {}
