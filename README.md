# ctrlia-comprobador-settings

Comprobador de **settings.json de Claude Code**. Pegas un `.claude/settings.json`, `~/.claude/settings.json` o `settings.local.json`, eliges de qué archivo es (usuario, proyecto o local) y te marca cada riesgo de permisos por nivel (crítico, alto, medio, bajo, info), con la explicación en español y el enlace a la documentación oficial que lo respalda. 21 reglas, todas con pruebas.

Todo ocurre en el navegador: sin servidor, sin `fetch`, sin almacenamiento y sin dependencias. El JSON se lee con `JSON.parse` (nunca `eval`) y los resultados se pintan con `textContent`.

- Úsalo en línea: https://ctrlia.dev/recetas/comprobador-settings.html
- English: https://ctrlia.dev/en/recetas/comprobador-settings.html

Reglas basadas en la documentación oficial de permisos, modos de permiso, sandbox y referencia de ajustes de Claude Code **2.1.316**.

## Archivos

| Archivo | Qué es |
| --- | --- |
| `comprobador.js` | La función pura `analizar(texto, ambito)` (21 reglas) + interfaz. Sin dependencias ni código en línea (compatible con una CSP estricta) |
| `index.html` | Página de ejemplo, que carga `comprobador.js` con `<script src>` |
| `pruebas.js` | Comprobaciones con Node |
| `ejemplo.json` | Un `.claude/settings.json` con errores típicos |
| `punto-de-partida.json` | Configuración de partida que pasa sin avisos altos ni críticos |

## Cómo usarlo

```bash
git clone https://github.com/carlosp5751258-lgtm/ctrlia-comprobador-settings
cd ctrlia-comprobador-settings
node pruebas.js      # debe imprimir «ok: comprobador»
```

Abre `index.html` en el navegador, elige el ámbito, pega tu archivo y pulsa «Comprobar». Desde Node:

```js
const { analizar } = require('./comprobador.js');
const r = analizar(require('fs').readFileSync('ejemplo.json', 'utf8'), 'proyecto');   // 'usuario' | 'proyecto' | 'local'
console.log(r.error || r.hallazgos);   // [{ id: 'R06', nivel: 'alto', texto: '…', doc: 'https://code.claude.com/docs/en/…' }]
```

## Límites

Revisa el texto de las reglas, no tu sistema: no lee hooks ni scripts, no combina los cuatro ámbitos como hace Claude Code (comprueba también `/permissions`) y «sin hallazgos» no significa seguro.

## Licencia

MIT. Ver [LICENSE](LICENSE).
