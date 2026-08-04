#!/usr/bin/env python3
"""Borra WordPress de /domains/sgualda.com/public_html.

Opera SOLO sobre una lista blanca explicita. Cualquier ruta que no empiece por
uno de esos prefijos aborta el programa en lugar de borrarse: el fallo de este
script tiene que ser detenerse, nunca borrar de mas.

  python3 purge-wp.py          -> simulacro, no borra nada
  python3 purge-wp.py --apply  -> borra
"""
import os, ssl, sys, time
from ftplib import FTP_TLS, all_errors

ROOT = '/domains/sgualda.com/public_html'
APPLY = '--apply' in sys.argv

# Directorios de WordPress, borrados enteros y recursivamente.
DIRS = ['wp-admin', 'wp-includes', 'wp-content']

# Ficheros sueltos, nombrados uno a uno. Nada de comodines.
FILES = [
    'wp-activate.php', 'wp-blog-header.php', 'wp-comments-post.php',
    'wp-config.php', 'wp-config-sample.php', 'wp-cron.php', 'wp-links-opml.php',
    'wp-load.php', 'wp-login.php', 'wp-mail.php', 'wp-settings.php',
    'wp-signup.php', 'wp-trackback.php', 'xmlrpc.php', 'index.php',
    'license.txt', 'readme.html',
    'default.php', 'default.php.bak',
    '.htaccess.bk', '.htaccess.old-1738706908', '.htaccess_original',
]

# Se queda. .well-known guarda la validacion del certificado SSL: borrarlo
# rompe la renovacion. El resto son los ficheros del sitio nuevo.
KEEP = {'.well-known', '.htaccess', 'index.html', 'robots.txt'}

def guard(path):
    """Aborta si la ruta no cae dentro de lo declarado arriba."""
    if not path.startswith(ROOT + '/'):
        sys.exit(f'ABORTADO: fuera de la raiz -> {path}')
    rel = path[len(ROOT) + 1:]
    top = rel.split('/')[0]
    if top in KEEP:
        sys.exit(f'ABORTADO: intento de tocar algo preservado -> {path}')
    if top not in DIRS and top not in FILES:
        sys.exit(f'ABORTADO: no esta en la lista blanca -> {path}')
    return path

HERE = os.path.dirname(os.path.abspath(__file__))
cred = {}
for line in open(os.path.join(HERE, '..', '.deploy', 'credentials')):
    line = line.strip()
    if '=' in line and not line.startswith('#'):
        k, v = line.split('=', 1)
        cred[k.strip()] = v.strip().strip('"\'')

ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
def connect():
    f = FTP_TLS(context=ctx, timeout=90)
    f.connect(cred['HOST'].replace('ftp://', ''), 21)
    f.login(cred['USER'], cred['PASS']); f.prot_p(); f.set_pasv(True)
    return f

ftp = connect()
files, dirs = [], []
seen = 0

def walk(path):
    global ftp, seen
    guard(path)
    entries = []
    for attempt in (1, 2, 3):
        try:
            entries = list(ftp.mlsd(path))
            break
        except all_errors as e:
            if attempt == 3:
                print(f'\n  ! no se pudo listar {path}: {str(e)[:60]}')
                return
            try: ftp.quit()
            except all_errors: pass
            ftp = connect()
    for name, facts in entries:
        if name in ('.', '..'):
            continue
        p = f'{path}/{name}'
        if facts.get('type') == 'dir':
            walk(p)
        else:
            files.append(guard(p))
            seen += 1
            if seen % 250 == 0:
                print(f'\r  explorando... {seen} ficheros', end='', flush=True)
    dirs.append(path)          # los hijos primero, el padre despues

for d in DIRS:
    walk(f'{ROOT}/{d}')

# Ficheros sueltos: solo los que existen de verdad.
root_now = {n for n, _ in ftp.mlsd(ROOT)}
loose = [guard(f'{ROOT}/{f}') for f in FILES if f in root_now]

print(f'\r  a borrar: {len(files) + len(loose)} ficheros, {len(dirs)} carpetas' + ' ' * 20)
print(f'  se conserva: {", ".join(sorted(KEEP))}')
print(f'  ficheros sueltos en la raiz: {", ".join(sorted(n.rsplit("/",1)[1] for n in loose))}')

if not APPLY:
    print('\n  SIMULACRO. Nada borrado. Anade --apply para ejecutar.')
    ftp.quit(); sys.exit(0)

total = len(files) + len(loose)
done = err = 0
missing = []

# El bucle reconecta, igual que el de exploracion.
#
# En la primera pasada no lo hacia: la sesion se cayo a mitad del arbol y las
# 1.797 llamadas siguientes fallaron todas contra un socket muerto, contadas
# como errores individuales cuando en realidad eran un unico fallo repetido.
# Un borrado de 11.000 ficheros dura lo suficiente como para que la conexion se
# caiga al menos una vez; darlo por supuesto es mas barato que descubrirlo.
for p in files + loose:
    guard(p)
    for attempt in (1, 2, 3):
        try:
            ftp.delete(p); done += 1
            break
        except all_errors as e:
            msg = str(e)
            # 550 es "no existe": ya se borro en una pasada anterior. No es un
            # fallo, y reintentarlo solo gasta tiempo.
            if msg.startswith('550'):
                missing.append(p); break
            if attempt == 3:
                err += 1
                if err <= 10: print(f'\n  x {p}: {msg[:60]}')
                break
            time.sleep(2 * attempt)
            try: ftp.quit()
            except all_errors: pass
            try: ftp = connect()
            except all_errors: time.sleep(5); ftp = connect()
    if (done + len(missing)) % 200 == 0:
        print(f'\r  borrados {done}/{total}', end='', flush=True)

for p in sorted(dirs, key=lambda s: -s.count('/')):
    guard(p)
    try: ftp.rmd(p)
    except all_errors: pass

print(f'\r  borrados {done}, ya ausentes {len(missing)}, errores {err}, total {total}' + ' ' * 20)
try: ftp.quit()
except all_errors: pass
sys.exit(1 if err else 0)
