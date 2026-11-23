# RO-Crate Playground

Status: the playground is in active development and deployed as a proof of concept in https://ro-crate.ldaca.edu.au,
please let report bugs using GitHub issues in this repository.

The ro-crate playground allows developers and users alike to write, run, and experiment with ro-crate directly in the
browser. This will serve quick prototyping, learning, and sharing ro-crate with others.

It is a place to learn basic use of RO-crate - zero risk play environment for techs and non-techs alike.

## Tools

The playground is nothing new however, it gathers ideas and technologies in the form of components from other projects.

- Crate-O https://github.com/Language-Research-Technology/crate-o
- ro-crate-js https://github.com/Language-Research-Technology/ro-crate-js
- ro-crate-html-js https://github.com/Language-Research-Technology/ro-crate-html-js
- json-editor-vue https://github.com/cloydlau/json-editor-vue

This playground uses a backend server to provide examples of ro-crates.

## TODO:

- Currently in development is the ability of uploading and or linking files to show how files can be linked and
  described in ro-crates


### Development

# Start the application and HTTPS Caddy reverse proxy
docker compose up --build

# Or run in background
docker compose up -d --build

The Compose stack serves `https://ro-crate.ldaca.edu.au` through Caddy. Caddy
obtains and renews the Let's Encrypt certificate automatically; ports 80 and
443 must be reachable from the internet and DNS for the hostname must point to
the Docker host. Certificate state is stored in the `caddy_data` volume.

For local development without SSL or public DNS, use the HTTP-only Compose
file:

```bash
docker compose -f docker-compose.local.yml up --build
```

Open http://localhost:8080. This local stack uses a separate network and
container names and does not bind ports 80 or 443.

### Deployment with Ansible

The Ansible app playbook runs the repository Compose stack, including Caddy.
Ensure the target host has Docker and the required Ansible collections
installed, and that DNS for `ro-crate.ldaca.edu.au` points to the host.

```bash
ansible-playbook ansible/rocrate_playground.prep.yml \
  -i ansible/hosts/ro-crate.ldaca.edu.au.prod
```

Ports 80 and 443 must be available on the target host. No data migration is
required; the Compose stack starts with its existing configuration and empty
upload volume.