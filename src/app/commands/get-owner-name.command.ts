export function getOwnerName(): string {
  return `typeof(settings)=='object' ? settings.userName || '<NONE>' : '<NONE>'`;
}
