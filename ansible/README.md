### Proof of Concept Deployment

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
