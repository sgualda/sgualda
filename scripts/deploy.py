#!/usr/bin/env python3
"""Sube dist/ a la raiz web sobre una unica sesion FTPS. No borra nada."""
import os, ssl, sys, time
from ftplib import FTP_TLS, all_errors

HERE = os.path.dirname(os.path.abspath(__file__))
cred = {}
for line in open(os.path.join(HERE, '..', '.deploy', 'credentials')):
    line = line.strip()
    if '=' in line and not line.startswith('#'):
        k, v = line.split('=', 1)
        cred[k.strip()] = v.strip().strip('"\'')

HOST = cred['HOST'].replace('ftp://', '')
ROOT = '/domains/sgualda.com/public_html'
DIST = os.path.join(HERE, '..', 'dist')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def connect():
    f = FTP_TLS(context=ctx, timeout=60)
    f.connect(HOST, int(cred.get('PORT', 21)))
    f.login(cred['USER'], cred['PASS'])
    f.prot_p()          # cifra tambien el canal de datos
    f.set_pasv(True)
    return f

files = []
for dirpath, _, names in os.walk(DIST, followlinks=True):
    for n in names:
        p = os.path.join(dirpath, n)
        files.append((p, os.path.relpath(p, DIST)))
files.sort(key=lambda t: t[1])
# El .htaccess va el ultimo: es el interruptor entre WordPress y el sitio nuevo.
files.sort(key=lambda t: t[1] == '.htaccess')

made = set()
def ensure(ftp, d):
    if d in ('', '.') or d in made:
        return
    ensure(ftp, os.path.dirname(d))
    try:
        ftp.mkd(f'{ROOT}/{d}')
    except all_errors:
        pass                        # ya existe
    made.add(d)

ftp = connect()
ok = fail = 0
bad = []
for local, rel in files:
    remote = f'{ROOT}/{rel}'
    for attempt in (1, 2, 3):
        try:
            ensure(ftp, os.path.dirname(rel))
            with open(local, 'rb') as fh:
                ftp.storbinary(f'STOR {remote}', fh, blocksize=65536)
            ok += 1
            print(f'\r  subidos {ok}/{len(files)}  {rel[:58]:<58}', end='', flush=True)
            break
        except all_errors as e:
            if attempt == 3:
                fail += 1; bad.append((rel, str(e)[:70]))
                print(f'\n  x {rel}: {str(e)[:70]}')
            else:
                time.sleep(2 * attempt)
                try: ftp.quit()
                except all_errors: pass
                try: ftp = connect(); made.clear()
                except all_errors: time.sleep(5); ftp = connect(); made.clear()
print()

# Ficheros que sobran en el servidor.
#
# Subir nunca borra, asi que el servidor solo crece. Los nombres en _astro
# llevan hash del contenido: cada cambio en el CSS deja el fichero viejo ahi
# para siempre. Pero el caso que de verdad importa es otro — borrar un articulo
# deja su pagina publicada y indexada indefinidamente, diciendo algo que ya
# decidiste no decir.
#
# Asi que el servidor refleja el build, con dos frenos:
#
#  KEEP  .well-known guarda la validacion del certificado SSL y no lo genera
#        ningun build. Borrarlo rompe la renovacion, en silencio, semanas
#        despues. Tambien se conserva cualquier cosa que empiece por punto.
#
#  El limite de abajo: si el build salio a medias, esta funcion tendria
#        permiso para vaciar el sitio entero. Un build sano trae ~175 ficheros;
#        por debajo de 100 algo ha ido mal y no se borra nada.
KEEP_TOP = {'.well-known'}

pruned = 0
if len(files) < 100:
    print(f'  ! solo {len(files)} ficheros en el build: no se limpia nada por precaucion')
else:
    have = {rel.replace(os.sep, '/') for _, rel in files}
    stale = []

    def scan(path, rel=''):
        for name, facts in ftp.mlsd(path):
            if name in ('.', '..') or name in KEEP_TOP or name.startswith('.'):
                continue
            r = f'{rel}{name}'
            if facts.get('type') == 'dir':
                scan(f'{path}/{name}', f'{r}/')
            elif r not in have:
                stale.append(r)

    try:
        scan(ROOT)
        for r in stale:
            ftp.delete(f'{ROOT}/{r}')
            pruned += 1
            print(f'  sobrante borrado  {r}')
    except all_errors as e:
        print(f'  ! no se pudo limpiar: {str(e)[:60]}')

try: ftp.quit()
except all_errors: pass

print(f'\n  ok={ok}  fallos={fail}  total={len(files)}  sobrantes borrados={pruned}')
for rel, e in bad:
    print(f'    {rel}  <-  {e}')
sys.exit(1 if fail else 0)
