# Setting up on Linux

Follow these steps to deploy the system on **Debian 12+ (64-bit)**

## Prerequisites

- A server or VM running **Debian 12+ (64-bit)**
- Root or sudo access
- Internet connectivity to download packages

## 1.Update the package list:

Start by updating all system packages to the latest versions:
```bash
sudo apt update && apt upgrade -y
```
Reboot iff a kernel update was applied.
```bash
[ -f /var/run/reboot-required ] && sudo reboot -f
```

## 2. Install Postgresql 17

### 2.1: Add the PGDG Repository

**Debian 13** already includes PostgreSQL 17 in its default repositories, so the PGDG repo is optional (useful if you want the absolute latest patch release before Debian packages it).

**Debian 12** ships PostgreSQL by default, which means the PGDG repository is required to get PostgreSQL 17. If you also work with PostgreSQL 17 on Ubuntu, the same PGDG repository approach applies.

On **Debian 12**(and optionally Debian 13), install the required dependencies for adding the PGDG repository:
```bash
sudo apt install -y curl ca-certificates gnupg
```
Import the PGDG repository signning key.
```bash
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /usr/share/keyrings/postgresql-archive-keyring.gpg
```
Add the PGDG repository to your sources list.
```bash
echo "deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list
```
Update the package index to pull in packages from the new repository.
```bash
sudo apt update
```