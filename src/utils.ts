export function createUniqueSuffix() {
  return Date.now() + '-' + Math.round(Math.random() * 1e9);
}

export function createUniqueFileName(fileName: string) {
  return createUniqueSuffix() + '-' + fileName;
}
