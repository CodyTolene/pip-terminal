import { TestBed } from '@angular/core/testing';

import { PipModTerminalComponent } from './pip.component';

describe('PipModTerminalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipModTerminalComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(PipModTerminalComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(PipModTerminalComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Hello, pip-boy-mod-terminal',
    );
  });
});
