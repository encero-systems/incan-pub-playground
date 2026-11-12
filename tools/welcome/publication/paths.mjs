// Resolve caller-supplied paths before the wrapper changes its working directory.
import {realpath,stat,access} from 'node:fs/promises';
import {constants} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

export async function inputPath(value, kind, cwd = process.cwd()) {
  if (!value || /[\x00-\x1f"\\]/.test(value)) throw Error('Unsupported external input path');
  const path = await realpath(resolve(cwd,value));
  if (/[\x00-\x1f"\\]/.test(path)) throw Error('Unsupported resolved input path');
  const metadata = await stat(path);
  if (kind === 'directory') {
    if (!metadata.isDirectory()) throw Error(`Expected directory: ${path}`);
  } else if (kind === 'executable') {
    if (!metadata.isFile()) throw Error(`Expected executable file: ${path}`);
    await access(path,constants.X_OK);
  } else throw Error('Expected directory or executable path kind');
  return path;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href)
  console.log(await inputPath(process.argv[3],process.argv[2]));
