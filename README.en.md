# ctrlia-comprobador-settings

The Spanish version is at the repo root and in [README.md](README.md); the English files are in `en/`.

A **Claude Code settings.json** checker. You paste a `.claude/settings.json`, `~/.claude/settings.json` or `settings.local.json`, choose which file it is (user, project or local) and it flags every permission risk by level (critical, high, medium, low, info), with an explanation and the link to the official documentation that backs it. 21 rules, all tested.

Everything happens in the browser: no server, no `fetch`, no storage and no dependencies. The JSON is read with `JSON.parse` (never `eval`) and the results are rendered with `textContent`.

- Use it online: https://ctrlia.dev/en/recetas/comprobador-settings.html
- Español: https://ctrlia.dev/recetas/comprobador-settings.html

Rules based on the official Claude Code **2.1.316** documentation on permissions, permission modes, sandbox and settings reference.

## Files

| File | What it is |
| --- | --- |
| `en/checker.js` | The pure function `analyze(text, scope)` (21 rules) + interface. No dependencies and no inline code (works with a strict CSP) |
| `en/index.html` | Example page, loading `checker.js` with `<script src>` |
| `en/tests.js` | Node checks |
| `en/example.json` | A `.claude/settings.json` with typical mistakes |
| `en/starting-point.json` | A starting configuration with no high or critical findings |

## How to use it

```bash
git clone https://github.com/carlosp5751258-lgtm/ctrlia-comprobador-settings
cd ctrlia-comprobador-settings/en
node tests.js      # should print "ok: checker"
```

Open `en/index.html` in the browser, choose the scope, paste your file and press "Check". From Node:

```js
const { analyze } = require('./checker.js');
const r = analyze(require('fs').readFileSync('example.json', 'utf8'), 'project');   // 'user' | 'project' | 'local'
console.log(r.error || r.findings);   // [{ id: 'R06', level: 'high', text: '…', doc: 'https://code.claude.com/docs/en/…' }]
```

## Limits

It reviews the text of the rules, not your system: it does not read hooks or scripts, it does not merge the four scopes the way Claude Code does (also check `/permissions`) and "no findings" does not mean safe.

## License

MIT. See [LICENSE](LICENSE).
