export function getId(): string {
  return `(typeof(Pip) == 'function' && Pip.getID) ? Pip.getID() : 'Unknown'`;
}
