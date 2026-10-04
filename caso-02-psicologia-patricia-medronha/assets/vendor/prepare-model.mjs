// Optional maintainer utility. Node 22.13+; the delivered site needs no build.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';

const model = new URL('./macbook-studio/', import.meta.url);
const keyboardPath = new URL('keyboard.ts', model);
let keyboard = readFileSync(keyboardPath, 'utf8');
keyboard = keyboard.replace("import { functionKeySymbols } from './function-key-symbols';\n", '');
keyboard = keyboard.replace('  symbol?: (typeof functionKeySymbols)[number];\n', '');
keyboard = keyboard.replace(/    \.\.\.functionKeySymbols\.map\(\(symbol\) => \(\{[\s\S]*?    \}\)\),/, "    ...Array.from({ length: 12 }, (_, i) => key(`F${i + 1}`)),");
keyboard = keyboard.replace(/      if \(k\.symbol\) \{[\s\S]*?      if \(k\.secondary\)/, "      ctx.font = '23px Arial, sans-serif';\n      ctx.fillText(k.label, cx + 64, cy + 70);\n      if (k.secondary)");
writeFileSync(keyboardPath, keyboard);
for (const filename of readdirSync(model).filter(name => name.endsWith('.ts'))) {
  const source = readFileSync(new URL(filename, model), 'utf8');
  let js = stripTypeScriptTypes(source);
  js = js.replace(/from 'three'/g, "from '../three/three.module.min.js'");
  js = js.replace(/from '(\.\/[\w-]+)'/g, "from '$1.js'");
  writeFileSync(new URL(filename.replace(/\.ts$/, '.js'), model), '// Adapted from MacBook Studio (MIT); see ../../licenses/macbook-studio-MIT.txt\n' + js);
}
const roomPath = new URL('./three/RoomEnvironment.js', import.meta.url);
writeFileSync(roomPath, readFileSync(roomPath, 'utf8').replace("from 'three'", "from './three.module.min.js'"));
console.log('Local browser modules prepared. Function keys use plain F1–F12 labels.');
