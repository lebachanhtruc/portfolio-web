export const encodeMediaPath = (path: string) =>
  path
    .normalize('NFC')
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
