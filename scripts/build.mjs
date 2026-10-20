import { mkdir, readFile, writeFile, copyFile, stat } from 'node:fs/promises';
import { dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const pages = ['index.html', 'style.css', 'script.js'];
const files = new Set(pages);

// Collect exact local references, including fonts declared in CSS.
for (const name of ['index.html', 'style.css']) {
  const text = await readFile(resolve(root, name), 'utf8');
  const references = name.endsWith('.html')
    ? [...text.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(match => match[1])
    : [...text.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g)].map(match => match[1]);
  for (const reference of references) {
    if (/^(?:#|https?:|mailto:|tel:|data:)/i.test(reference)) continue;
    const local = reference.split(/[?#]/)[0];
    const path = resolve(root, local);
    if (!path.startsWith(root + sep)) throw new Error(`Caminho inválido: ${reference}`);
    const info = await stat(path).catch(() => null);
    if (!info?.isFile() || !info.size) throw new Error(`Arquivo ausente ou vazio: ${reference}`);
    // Windows ignores filename case; Vercel/Linux does not.
    const { readdir } = await import('node:fs/promises');
    let parent = root;
    for (const part of relative(root, path).split(sep)) {
      if (!(await readdir(parent)).includes(part)) throw new Error(`Maiúsculas/minúsculas incorretas: ${reference}`);
      parent = resolve(parent, part);
    }
    files.add(relative(root, path));
  }
}

await mkdir(output, { recursive: true });
for (const name of files) {
  const destination = resolve(output, name);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(resolve(root, name), destination);
}
await writeFile(resolve(output, '404.html'), '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Página não encontrada</title><h1>Página não encontrada</h1><a href="/">Voltar ao portfólio</a></html>');
console.log(`Build concluído: ${files.size} arquivos, incluindo imagens e fontes, em dist/.`);
