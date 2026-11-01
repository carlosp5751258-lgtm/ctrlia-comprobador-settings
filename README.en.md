# ctrlia-comprobador-settings

A **Claude Code settings.json** checker. You paste a `.claude/settings.json`, `~/.claude/settings.json` or `settings.local.json`, choose which file it is (user, project or local) and it flags every permission risk by level (critical, high, medium, low, info), with an explanation (in Spanish) and the link to the official documentation that backs it. 21 rules, all tested.

Everything happens in the browser: no server, no `fetch`, no storage and no dependencies. The JSON is read with `JSON.parse` (never `eval`) and the results are rendered with `textContent`.

- Use it online: https://ctrlia.dev/en/recetas/comprobador-settings.html
- Español: https://ctrlia.dev/recetas/comprobador-settings.html

Rules based on the official Claude Code **2.1.316** documentation on permissions, permission modes, sandbox and settings reference.

## Files

| File | What it is |
| --- | --- |
| `comprobador.js` | The pure function `analizar(texto, ambito)` (21 rules) + interface. No dependencies and no inline code (works with a strict CSP) |
| `index.html` | Example page, loading `comprobador.js` with `<script src>` |
| `pruebas.js` | Node checks |
| `ejemplo.json` | A `.claude/settings.json` with typical mistakes |
| `punto-de-partida.json` | A starting configuration with no high or critical findings |

## How to use it

```bash
git clone https://github.com/carlosp5751258-lgtm/ctrlia-comprobador-settings
cd ctrlia-comprobador-settings
node pruebas.js      # should print "ok: comprobador"
```

Open `index.html` in the browser, choose the scope, paste your file and press "Comprobar" (Check). From Node:

```js
const { analizar } = require('./comprobador.js');
const r = analizar(require('fs').readFileSync('ejemplo.json', 'utf8'), 'proyecto');   // 'usuario' | 'proyecto' | 'local'
console.log(r.error || r.hallazgos);   // [{ id: 'R06', nivel: 'alto', texto: '…', doc: 'https://code.claude.com/docs/en/…' }]
```

## Limits

It reviews the text of the rules, not your system: it does not read hooks or scripts, it does not merge the four scopes the way Claude Code does (also check `/permissions`) and "no findings" does not mean safe.

## License

MIT. See [LICENSE](LICENSE).
