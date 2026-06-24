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
Install required utilities.
```bash
sudo apt install -y curl nano unzip wget
```
Reboot iff a kernel update was applied.
```bash
[ -f /var/run/reboot-required ] && sudo reboot -f
```

## 2. Setting up PostgreSQL 17

### Step 1: Add the PGDG Repository

**Debian 13** already includes PostgreSQL 17 in its default repositories, so the PGDG repo is optional (useful if you want the absolute latest patch release before Debian packages it).

**Debian 12** ships PostgreSQL by default, which means the PGDG repository is required to get PostgreSQL 17. If you also work with PostgreSQL 17 on Ubuntu, the same PGDG repository approach applies.

On **Debian 12**(and optionally Debian 13), install the required dependencies for adding the PGDG repository:
```bash
sudo apt install -y ca-certificates gnupg
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
### Step 2: Install PostgreSQL 17
Install the PostgreSQL 17 server and client packages, This command works on both Debian 13(from default repos) and Debian 12(from PGDG):
```bash
sudo apt install -y postgresql-17 postgresql-client-17
```
The installation automatically initializes the database cluster, creates the **postgres** system user, and starts the service. Enable PostgreSQL to start on boot and verify the service is running.

```bash
sudo systemctl enable --now postgresql
```
Check the service status:
```bash
sudo systemctl status postgresql
```

```text
● postgresql.service - PostgreSQL RDBMS
     Loaded: loaded (/lib/systemd/system/postgresql.service; enabled; preset: enabled)
     Active: active (exited) since Fri 2026-06-19 11:20:15 CST; 2min 20s ago
   Main PID: 4918 (code=exited, status=0/SUCCESS)
        CPU: 3ms

Jun 19 11:20:15 iZ2zeer7gpxgn9kkrxfke4Z systemd[1]: Starting postgresql.service - PostgreSQL RDBMS...
Jun 19 11:20:15 iZ2zeer7gpxgn9kkrxfke4Z systemd[1]: Finished postgresql.service - PostgreSQL RDBMS.

```
Verify the installed PostgreSQL version.

```bash
sudo -u postgres psql -c "SELECT version();"
```

On Debian 13, the output shows the native Debian build:
```text
 PostgreSQL 17.9 (Debian 17.9-0+deb13u1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
 ```

 On Debian 12 with the PGDG repository, it shows the PGDG build:
 ```text
 PostgreSQL 17.10 (Debian 17.10-1.pgdg12+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 12.2.0-14+deb12u1) 12.2.0, 64-bit
```
### Step 3: Create a Database and User

Switch to the postgres system user to run database administration commands.
```bash
sudo -i -u postgres
```

Create a new database user.

```bash
createuser sccsmsuser
```
Create a new database.

```bash
createdb sccsmsdb -O sccsmsuser
```

Connect to the PostgreSQL shell and set a password for the new user.

```bash
psql
```
Run the following SQL commands(replace **yourPassword** with a secure password).
```sql
ALTER USER sccsmsuser PASSWORD 'yourPassword';
GRANT ALL PRIVILEGES ON DATABASE sccsmsdb TO sccsmsuser;
```

Exit the shell and switch back to your reqular user.
```bash
\q
exit
```
Verify the connection with the new user.

```bash
psql -U sccsmsuser -d sccsmsdb -h 127.0.0.1 -W
```

You will be prompted to enter the password. A successful connection confirms the user and database are working(type **\q**  to exit).

## 3. Setting up RustFS

Note: In light of MinIO's strategic shift toward MinIO AIStor, we recommend adopting RustFS as an alternative for S3-compatible storage.

### Step 1: Quick Installation
Use the Quick Installation Script to install RustFS in Single Node Single Disk(SNSD) mode. (If you need to install RustFS in other modes, please see https://docs.rustfs.com/)
```bash
curl -O https://rustfs.com/install_rustfs.sh && bash install_rustfs.sh
```

### Step 2: Update **rustfsadmin** password
For security reasons, you must change the default password immediately after installation.
1. Open the configuration file:
```bash
nano /etc/default/rustfs
```

2. Locate the line **RUSTFS_SECRET_KEY=rustfsadmin** and update it to your own secure password.
```plaintext
# Change this to a secure password
RUSTFS_SECRET_KEY=yourPassword
```
Save the file (Ctrl+O, Enter) and exit (Ctrl+X).

3. Restart the RustFS services to apply the changes.
```bash
sudo systemctl restart rustfs
```

## 4. Setting up Sea&Cloud Construction Site Management System(SCCSMS)
### Step 1: Download SCCSMS Release
Create the application directory and navigate into it.
```bash
mkdir -p /usr/local/sccsms
cd /usr/local/sccsms
```
Download the latest release from GitHub.
```bash
wget https://github.com/hnmht/sccsms/releases/download/v1.0.0/sccsmsserver-linux-x86_64.zip
unzip sccsmsserver-linux-x86_64.zip
chmod +x sccsmsserver
```
Download the default configuration template.

```bash
wget https://raw.githubusercontent.com/hnmht/sccsms/main/document/yaml/config.yaml
```
### Step 2: Configuration
Edit the configuration file.
```bash
nano /usr/local/sccsms/config.yaml
```
Configure the following parameters to match your environment:
- postgresql：Update **dbname**, **username**,**password** according to the PostgreSQL 17 configuration in Step 2.
- s3storage: Update **endpoint**, **accesskeyid**, **secretaccesskey** to match the RustFS settings established in Step 3.

For detailed configuration documentation, please refer to [config.md](/document/yaml/config.md)

```yaml
addr: ""
name: "sccsmsserver"
mode: "release"
port: 10033
start_time: "2026-01-01"
machine_id: 101
tls: false
certificatefile: "cert.pem"
privatekeyfile: "key.pem"
userlockth: 5
iplockth: 10
iplockedminutes: 15

log:
  level: "debug"
  filename: "sccsmsserver.log"
  max_size: 200
  max_age: 30
  max_backups: 7

postgresql:
  host: "localhost"
  port: 5432
  dbname: "sccsmsdb"
  username: "sccsmsuser"
  password: "yourPassword"
  max_open_conns: 200
  max_idle_conns: 50
  max_record: 5000

s3storage:
  endpoint: "http://101.201.238.172:9000"
  accesskeyid: "rustfsadmin"
  secretaccesskey: "yourPassword"
  secure: false
  selfsigned: false
  defaultbucket: "sccsms"
  location: "ap-guangzhou"

redis:
  enabled: false
  host: "127.0.0.1"
  port: 6379
  db: 0
  password: "yourPassword"
  pool_size: 100
```
### Step 3: Create the SCCSMS Service

Create systemd service file.
```bash
nano /etc/systemd/system/sccsms.service
```
Add the following service configuration:
```plaintext
[Unit]
Description=Sea&Cloud Construction Site Management System
Documentation=https://github.com/hnmht/sccsms
Wants=network-online.target
After=network-online.target rustfs.service postgresql.service
Requires=rustfs.service postgresql.service

[Service]
WorkingDirectory=/usr/local/sccsms
ProtectProc=invisible
ExecStart=/usr/local/sccsms/sccsmsserver
# Let systemd restart this service always
Restart=always
# Specifies the maximum file descriptor number that can be opened by this process
LimitNOFILE=65536
# Specifies the maximum number of threads this process can create
TasksMax=infinity
# Disable timeout logic and wait until process is stopped
TimeoutStopSec=infinity
SendSIGKILL=no

[Install]
WantedBy=multi-user.target
```
Reload systemd and start the service.
```bash
sudo systemctl daemon-reload
sudo systemctl enable sccsms
sudo systemctl restart sccsms
sudo systemctl status sccsms
```
### Step 4: Accessing the System
You can access your SCCSMS instance via your server's IP address and the configured port(e.g., [http://101.201.238.172:10033](http://101.201.238.172:10033))

1. Open a modern web browser(e.g., Chrome or Edge).
2. Enter the URL(http://your-server-ip:port).
3. From the homepage, you can download the mobile client installer or click Login to access the system dashboard.

Default Credentials:
- **User Code:** admin
- **Password:** sc@123

**Security Note:** For security reasons, please change your password immediately after your first login.
