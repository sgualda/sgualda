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

# Assets huerfanos de despliegues anteriores.
#
# Los nombres en _astro llevan hash del contenido, asi que cada cambio en el CSS
# deja el fichero viejo en el servidor para siempre: subir nunca borra. Nadie los
# referencia, pero se acumulan indefinidamente y hacen imposible mirar la carpeta
# y saber que sirve el sitio.
#
# Solo _astro, y solo ficheros que el build acaba de generar y por tanto conoce.
# Fuera de ahi no se borra nada desde aqui.
pruned = 0
try:
    have = set(os.listdir(os.path.join(DIST, '_astro')))
    for name, facts in ftp.mlsd(f'{ROOT}/_astro'):
        if facts.get('type') != 'file' or name in have:
            continue
        ftp.delete(f'{ROOT}/_astro/{name}')
        pruned += 1
        print(f'  huerfano borrado  {name}')
except all_errors as e:
    print(f'  ! no se pudo limpiar _astro: {str(e)[:60]}')

try: ftp.quit()
except all_errors: pass

print(f'\n  ok={ok}  fallos={fail}  total={len(files)}  huerfanos borrados={pruned}')
for rel, e in bad:
    print(f'    {rel}  <-  {e}')
sys.exit(1 if fail else 0)
