with open('/opt/sequencer/Cargo.toml', 'r') as f:
    content = f.read()

old = 'bzip2 = { version = "0.5.0", default-features = false }'
new = 'bzip2 = { version = "0.5.0", default-features = false, features = ["libbz2-rs-sys"] }'

if old in content:
    content = content.replace(old, new)
    with open('/opt/sequencer/Cargo.toml', 'w') as f:
        f.write(content)
    print('REPLACED OK')
else:
    print('NOT FOUND: ' + repr(old[:80]))
