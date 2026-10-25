// Inspect emitted HTML traversal. This checks output; it does not render or parse Markdown.
import {readFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const pagePath = page => page.current_url.slice('https://incan.io/dev/'.length)+'index.html';
const hrefs = html => [...html.matchAll(/\bhref="([^"]+)"/g)].map(match => match[1].replaceAll('&amp;','&'));

export async function inspectOutput(root,map) {
  const problems = [], loaded = new Map();
  async function links(path) {
    if (!loaded.has(path)) {
      try {loaded.set(path,hrefs(await readFile(join(root,path),'utf8')));}
      catch(error){problems.push(`${path}: ${error.code ?? error.message}`);loaded.set(path,[]);}
    }
    return loaded.get(path);
  }
  function requireLink(path,actual,target) {
    if (!actual.includes(target)) problems.push(`${path}: missing navigation ${target}`);
  }
  const overview = 'navigation/index.html';
  const home = await links(overview);
  for (const section of map.sections) {
    const path = `navigation/nav-${section.key}.html`;
    requireLink(overview,home,'/corpus/'+path);
    const topic = await links(path);
    if (section.key !== 'library') for (const page of map.pages.filter(p=>p.role!=='support' && p.section===section.key && p.action!=='replace-hub'))
      requireLink(path,topic,'/corpus/'+pagePath(page));
  }
  for (const page of map.pages.filter(p=>p.role!=='support')) {
    const path = pagePath(page), actual = await links(path);
    requireLink(path,actual,'/corpus/navigation/index.html');
    requireLink(path,actual,`/corpus/navigation/nav-${page.section}.html`);
  }
  for (const module of map.library_modules) {
    const path = `navigation/module-${module.key}.html`, actual = await links(path);
    requireLink('navigation/nav-library.html',await links('navigation/nav-library.html'),'/corpus/'+path);
    const reference = map.pages.find(p=>p.source===module.reference);
    if (!reference) problems.push(`${path}: undeclared module reference`);
    else requireLink(path,actual,'/corpus/'+pagePath(reference));
  }
  // Every staged navigation target must stay in the staged indexes. Authored chapter pilots may stay in /docs/.
  for (const [path,actual] of loaded) for (const target of actual) {
    if (/^\/docs\/(?:index\.html|nav-|module-)/.test(target)) problems.push(`${path}: old navigation target ${target}`);
    if (!target.startsWith('/corpus/')) continue;
    let relative;
    try {relative = decodeURIComponent(target.slice(8).split(/[?#]/)[0]);}catch{problems.push(`${path}: invalid URL ${target}`);continue;}
    if (!relative || relative.endsWith('/')) relative += 'index.html';
    if (relative.startsWith('/') || relative.split('/').includes('..') || relative.includes('\\')) {
      problems.push(`${path}: escaping target ${target}`);continue;
    }
    if (!loaded.has(relative)) {
      try {await readFile(join(root,relative));}
      catch(error){problems.push(`${path}: missing target ${target} (${error.code ?? error.message})`);}
    }
  }
  return {pages:map.pages.filter(p=>p.role!=='support').length,navigation:1+map.sections.length+map.library_modules.length,problems};
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const map = JSON.parse(await readFile(process.argv[3],'utf8'));
  const result = await inspectOutput(process.argv[2],map);
  console.log(JSON.stringify(result,null,2));
  process.exitCode = result.problems.length ? 1 : 0;
}
