import Quill from 'quill';

interface CounterOpts {
  container: HTMLElement | null;
  imageWeight?: number;
  max?: number | null;
  unit?: 'character' | 'word';
}

export class Counter {
  public constructor(quill: Quill, opts: CounterOpts) {
    this.quill = quill;
    this.el = opts.container ?? null;
    this.unit = opts.unit ?? 'character';
    this.max = opts.max ?? null;
    this.imageWeight = opts.imageWeight ?? 0;

    this.quill.on('text-change', this.update);
    this.update();
  }

  private quill: Quill;
  private el: HTMLElement | null;
  private unit: 'character' | 'word';
  private max: number | null;
  private imageWeight: number;

  private update = (): void => {
    if (!this.el) return;

    const delta = this.quill.getContents();
    let buffer = '';
    let imageCount = 0;

    const isImageEmbed = (val: unknown): val is { image: unknown } =>
      typeof val === 'object' && val !== null && 'image' in val;

    for (const op of delta.ops ?? []) {
      if (typeof op.insert === 'string') {
        buffer += op.insert.replace(/\n/g, ' ');
      } else if (isImageEmbed(op.insert)) {
        imageCount += 1;
      }
    }

    const normalized = buffer.replace(/\s+/g, ' ').trim();
    const charCount =
      Array.from(normalized).length + imageCount * this.imageWeight;
    const wordCount = normalized ? normalized.split(/\s+/).length : 0;

    const count = this.unit === 'word' ? wordCount : charCount;
    const hint = this.max !== null ? `${count}/${this.max}` : String(count);

    this.el.textContent = `Max of ${hint} ${this.unit}s`;
    this.el.classList.toggle('over', this.max !== null && count > this.max);
    this.el.classList.toggle(
      'near',
      this.max !== null && count >= Math.floor(this.max * 0.9),
    );
  };
}
