const assert = require('assert');
const { analyze } = require('./checker.js');
const ids = (t, a = 'project') => analyze(t, a).findings.map((x) => x.id);
assert.ok(analyze('{ "a": 1, }', 'user').error);
assert.ok(analyze('[]', 'user').error);
assert.ok(ids('{"permissions":{"defaultMode":"bypassPermissions"}}', 'user').includes('R01'));
assert.strictEqual(analyze('{"permissions":{"defaultMode":"bypassPermissions"}}', 'project').findings.find((x) => x.id === 'R01').level, 'info');
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
assert.strictEqual(analyze('{"env":{"OPENAI_API_KEY":"sk-123456789"}}', 'project').findings.find((x) => x.id === 'R17').level, 'critical');
assert.ok(ids('{"hooks":{}}').includes('R18'));
assert.ok(ids('{"sandbox":{"enabled":true}}').includes('R20'));
// The repository files: the example produces the documented findings and the starting point has no high or critical ones
const fs = require('fs');
assert.deepStrictEqual(ids(fs.readFileSync(__dirname + '/example.json', 'utf8')), ['R06', 'R07', 'R09', 'R11', 'R12', 'R13', 'R15', 'R17', 'R19', 'R21']);
for (const a of ['project', 'local'])
  assert.ok(!analyze(fs.readFileSync(__dirname + '/starting-point.json', 'utf8'), a).findings.some((x) => x.level === 'critical' || x.level === 'high'), a);
assert.ok(ids('{"permissions":{"defaultMode":"auto"}}').includes('R02'));
assert.ok(ids('{"skipDangerousModePermissionPrompt":true}', 'user').includes('R03'));
assert.ok(ids('{}', 'user').includes('R04'));
assert.ok(ids('{"permissions":{"allow":["WebFetch"]}}').includes('R15'));
assert.ok(!ids('{"permissions":{"allow":["WebFetch(domain:docs.python.org)"]}}').includes('R15'));
assert.ok(analyze('{"permissions":{"allow":["Bash(npm run test)"]}}', 'project').findings.every((x) => /^https:\/\/code\.claude\.com\/docs\/en\//.test(x.doc)));
console.log('ok: checker');
