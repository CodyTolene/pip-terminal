import { Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

/** Service for managing application page meta. */
@Injectable({ providedIn: 'root' })
export class PageMetaService {
  public constructor(
    private readonly meta: Meta,
    private readonly title: Title,
  ) {}

  public setTitle(title: string): void {
    this.title.setTitle(`${title} - Pip-Boy Terminal`);
  }

  public setTags(): void {
    const tags = this.getTags();
    const existingTags = tags.filter((tag) => {
      const findBy = tag.name
        ? `name="${tag.name}"`
        : `property="${tag.property}"`;

      const existingTag = this.meta.getTag(findBy);
      return existingTag && existingTag.content === tag.content;
    });

    if (existingTags.length > 0) {
      console.warn('Meta tags already exist, skipping addition.');
      return;
    }

    this.meta.addTags(tags);
  }

  private getTags(): MetaDefinition[] {
    return [
      { name: 'robots', content: 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'date', content: new Date().toISOString().split('T')[0] },
      { charset: 'UTF-8' },
      { name: 'author', content: 'Pip Terminal' },
      { name: 'description', content: 'Pip Terminal' },
      {
        name: 'keywords',
        content: 'Pip-Boy, Pip-Boy Terminal, Pip Terminal, Pip, Pip-Terminal',
      },
      { name: 'theme-color', content: '#00ff00' },
      { property: 'og:title', content: this.title.getTitle() },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      {
        property: 'og:image',
        content:
          'https://pip-boy.com/images/favicon/android-chrome-512x512.png',
      },
      { property: 'og:image:type', content: 'image/png' },
    ];
  }
}
