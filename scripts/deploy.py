#!/usr/bin/env python3
"""Publica dist/ en sgualda.com por SSH.

    python3 scripts/deploy.py            # despliega
    python3 scripts/deploy.py --dry-run  # solo dice que haria

No hay contraseña en ninguna parte. La conexion usa el alias `sgualda-deploy`
de ~/.ssh/config, que apunta a una clave privada que no sale de este ordenador.
Sustituye a una version anterior que abria FTPS con la contraseña guardada en
texto plano en .deploy/credentials.

Y solo viaja lo que ha cambiado. La version FTP subia los 175 ficheros en cada
despliegue, tardaba 3:20 y no borraba nunca nada; rsync compara antes de enviar.
"""
import os
import subprocess
import sys
import time

HOST = 'sgualda-deploy'

# Ruta absoluta de verdad. Por FTP era /domains/sgualda.com/public_html porque
# el servidor encerraba la sesion dentro de la carpeta del usuario; por SSH se
# ve el sistema de ficheros entero y esa ruta no existe. Importa que sea exacta:
# la cuenta aloja otros cuatro dominios (ecoco.es, glintale.com, uxerfy.com,
# uxerhub.com) y este script borra.
ROOT = 'domains/sgualda.com/public_html'
HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, '..', 'dist')

# .well-known guarda la validacion del certificado SSL y no lo genera ningun
# build, asi que para rsync es un fichero que sobra. Sin esta exclusion,
# --delete lo borraria y la renovacion del certificado fallaria en silencio
# semanas despues, cuando ya nadie relacione una cosa con la otra.
KEEP = ['.well-known']

DRY = '--dry-run' in sys.argv


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


if not os.path.isdir(DIST):
    sys.exit('  No hay dist/. Ejecuta antes: npm run build')

local = set()
for r, _, fs in os.walk(DIST, followlinks=True):
    for n in fs:
        local.add(os.path.relpath(os.path.join(r, n), DIST))

# Freno de mano. Sin esto, un build a medias le daria permiso a --delete para
# vaciar el sitio en produccion. Un build sano trae ~175 ficheros.
if len(local) < 100:
    sys.exit(f'  Solo {len(local)} ficheros en dist/. Un build sano trae ~175.\n'
             '  Abortado antes de tocar nada: --delete vaciaria el sitio.')

print(f'  build: {len(local)} ficheros')

# La lista de borrados se calcula aqui en lugar de leerla de rsync.
#
# El rsync de macOS es openrsync, y su --dry-run no imprime absolutamente nada
# sobre lo que va a borrar: comprobado en un directorio de prueba, donde borro
# lo que sobraba sin haberlo anunciado en la simulacion. El borrado en si es
# correcto y respeta --exclude. Lo que no se puede es revisarlo antes, que es
# justo lo que uno quiere de una simulacion, asi que se pregunta al servidor.
find = ' -o '.join(f"-name {k!r} -prune" for k in KEEP)
res = run(['ssh', '-o', 'BatchMode=yes', HOST,
           f"cd {ROOT} && find . \\( {find} \\) -o -type f -print"])
if res.returncode != 0:
    sys.exit(f'  No se pudo listar el servidor:\n{res.stderr.strip()}')

remote = {l[2:] for l in res.stdout.split('\n') if l.startswith('./')}
stale = sorted(remote - local)

print(f'  servidor: {len(remote)} ficheros')
if stale:
    print(f'  se borraran {len(stale)}:')
    for s in stale:
        print(f'      {s}')
else:
    print('  nada que borrar')
print(f'  se conserva sin tocar: {", ".join(KEEP)}')

if DRY:
    print('\n  SIMULACRO. No se ha enviado nada.')
    sys.exit(0)

t0 = time.time()
# -c compara por contenido, no por fecha y tamaño.
#
# Astro reescribe los 175 ficheros en cada build, asi que todos cambian de fecha
# aunque su contenido sea identico: con la comparacion por defecto, cada
# despliegue reenviaba el sitio entero y "solo viaja lo que ha cambiado" era
# falso. Con -c, un rebuild completo sin cambios reales envia 4 ficheros.
# Calcular los hashes de 5 MB cuesta menos que subirlos.
cmd = [
    'rsync', '-azc', '--delete', '--stats',
    *[f'--exclude={k}' for k in KEEP],
    '-e', 'ssh -o BatchMode=yes',
    DIST.rstrip('/') + '/', f'{HOST}:{ROOT}/',
]
res = run(cmd)
if res.returncode != 0:
    print(res.stdout)
    sys.exit(f'  rsync fallo ({res.returncode}):\n{res.stderr.strip()}')

sent = [l for l in res.stdout.split('\n') if 'sent' in l or 'Number of' in l]
for l in sent:
    print(f'  {l.strip()}')
print(f'\n  desplegado en {time.time() - t0:.1f}s')
