### Note: Read this after bootstraping your ldaca portal instance


### UAT

```bash
ansible rocrate_playground -m ping -i hosts/ro-crate.ldaca.edu.au.prod
```
result:
```bash
demo.ldaca.edu.au | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
```

### Prep

Make filesystem if new disk/device
```bash
mkfs -t ext4 /dev/vdb 
```

Get UUID of mounted storage if defined
```bash
sudo blkid /dev/vdb 
```

Prep
```bash
ansible-playbook rocrate_playground.prep.yml -i hosts/ro-crate.ldaca.edu.au.prod
```

Install docker
```bash
ansible-playbook rocrate_playground.docker.yml -i hosts/ro-crate.ldaca.edu.au.prod
```

Install nginx
```bash
ansible-playbook rocrate_playground.nginx.yml -i hosts/ro-crate.ldaca.edu.au.prod
```

Install portal
```bash
ansible-playbook rocrate_playground.portal.yml -i hosts/ro-crate.ldaca.edu.au.prod
```

Install rclone
```bash
ansible-playbook rocrate_playground.rclone.yml -i hosts/ro-crate.ldaca.edu.au.prod
```

Copy repo data

```bash
ansible-playbook rocrate_playground.sync.yml -i hosts/ro-crate.ldaca.edu.au.prod --tags sync_cloudstor_misc
```

```bash
ansible-playbook rocrate_playground.sync.yml -i hosts/ro-crate.ldaca.edu.au.prod --tags sync_rclone_ldaca
```

Generate users ssh key
```bash
ssh-keygen -m PEM -t rsa -b 4096 -C "ansible@ldaca" -f "keys/ldaca.id_rsa"
```

## DATA:

COOEE
```bash
ansible-playbook corpus-cooee.yml -i hosts/ro-crate.ldaca.edu.au.prod
```

F2F
```bash
ansible-playbook corpus-f2f.yml -i hosts/ro-crate.ldaca.edu.au.prod
```

MultiLingual
```bash
ansible-playbook corpus-ml.yml -i hosts/ro-crate.ldaca.edu.au.prod
```

## Update

update
```bash
ansible-playbook rocrate_playground.portal.yml -i hosts/ro-crate.ldaca.edu.au.prod --tags update
```

reconfigure oni
```bash
ansible-playbook rocrate_playground.portal.yml -i hosts/ro-crate.ldaca.edu.au.prod --tags oni-config
```

re-index oni
```bash
ansible-playbook rocrate_playground.portal.yml -i hosts/ro-crate.ldaca.edu.au.prod --tags structural
```

re-index elastic
```bash
ansible-playbook rocrate_playground.portal.yml -i hosts/ro-crate.ldaca.edu.au.prod --tags elastic
```

re-index vocabs
```bash
ansible-playbook rocrate_playground.portal.yml -i hosts/ro-crate.ldaca.edu.au.prod --tags vocabs
```

re configure nginx
```bah
ansible-playbook rocrate_playground.nginx.yml -i hosts/ro-crate.ldaca.edu.au.prod --tags config
```
