const assert = require('assert');
const { analizar } = require('./comprobador.js');
const ids = (t, a = 'proyecto') => analizar(t, a).hallazgos.map((x) => x.id);
assert.ok(analizar('{ "a": 1, }', 'usuario').error);
assert.ok(analizar('[]', 'usuario').error);
assert.ok(ids('{"permissions":{"defaultMode":"bypassPermissions"}}', 'usuario').includes('R01'));
assert.strictEqual(analizar('{"permissions":{"defaultMode":"bypassPermissions"}}', 'proyecto').hallazgos.find((x) => x.id === 'R01').nivel, 'info');
assert.ok(ids('{"permissions":{"allow":["Bash"]}}').includes('R05'));
for (const r of ['Bash(python3 *)', 'Bash(node *)', 'Bash(npx *)', 'Bash(bash -c *)', 'Bash(git *)', 'Bash(docker exec *)', 'Bash(uv run *)', 'Bash(make:*)'])
  assert.ok(ids(JSON.stringify({ permissions: { allow: [r] } })).includes('R06'), r);
for (const r of ['Bash(python3 -m pytest *)', 'Bash(npm run test)', 'Bash(git status *)', 'Bash(npx tsc --noEmit)', 'Bash(git log *)'])
  assert.ok(!ids(JSON.stringify({ permissions: { allow: [r] } })).includes('R06'), r);
assert.ok(ids('{"permissions":{"allow":["Bash(git * main)"]}}').includes('R07'));
assert.ok(ids('{"permissions":{"allow":["Bash(ls*)"]}}').includes('R08'));
assert.ok(ids('{}').includes('R09'));
assert.ok(!ids('{"permissions":{"deny":["Read(.env)","Read(.env.*)"]}}').includes('R09'));
assert.ok(ids('{"permissions":{"deny":["Read(./.env)"]}}').includes('R10'));
assert.ok(ids('{"permissions":{"deny":["Bash(curl *)"]}}').includes('R11'));
assert.ok(ids('{"permissions":{"deny":["Write(./secrets/**)"]}}').includes('R12'));
assert.ok(ids('{"enableAllProjectMcpServers":true}').includes('R13'));
assert.ok(ids('{"permissions":{"allow":["mcp__*","WebFetch"]}}').includes('R14'));
assert.ok(ids('{"permissions":{"additionalDirectories":["~/"]}}').includes('R16'));
assert.strictEqual(analizar('{"env":{"OPENAI_API_KEY":"sk-123456789"}}', 'proyecto').hallazgos.find((x) => x.id === 'R17').nivel, 'crítico');
assert.ok(ids('{"hooks":{}}').includes('R18'));
assert.ok(ids('{"sandbox":{"enabled":true}}').includes('R20'));
// Los archivos del repositorio: el ejemplo saca los hallazgos documentados y el punto de partida no tiene altos ni críticos
const fs = require('fs');
assert.deepStrictEqual(ids(fs.readFileSync(__dirname + '/ejemplo.json', 'utf8')), ['R06', 'R07', 'R09', 'R11', 'R12', 'R13', 'R15', 'R17', 'R19', 'R21']);
for (const a of ['proyecto', 'local'])
  assert.ok(!analizar(fs.readFileSync(__dirname + '/punto-de-partida.json', 'utf8'), a).hallazgos.some((x) => x.nivel === 'crítico' || x.nivel === 'alto'), a);
assert.ok(ids('{"permissions":{"defaultMode":"auto"}}').includes('R02'));
assert.ok(ids('{"skipDangerousModePermissionPrompt":true}', 'usuario').includes('R03'));
assert.ok(ids('{}', 'usuario').includes('R04'));
assert.ok(ids('{"permissions":{"allow":["WebFetch"]}}').includes('R15'));
assert.ok(!ids('{"permissions":{"allow":["WebFetch(domain:docs.python.org)"]}}').includes('R15'));
assert.ok(analizar('{"permissions":{"allow":["Bash(npm run test)"]}}', 'proyecto').hallazgos.every((x) => /^https:\/\/code\.claude\.com\/docs\/en\//.test(x.doc)));
console.log('ok: comprobador');
