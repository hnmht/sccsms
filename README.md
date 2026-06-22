<p align="center">
  <a href="https://github.com/hnmht" target="_blank"><img width="128" height="128" src="sccsmsweb/public/static/img/brands/seacloud.png" alt="Material UI logo"></a>
</p>
<h1 align="center">Sea&Cloud Construction Site Management System</h1>
<h1 align="center" style="color:#84ea78"> Zero Harm, Built on Transparency.</h1>

# Why We Built This
This project originated in 2015, born from a critical need to improve safety protocols within a large mining group. At that time, the group faced a dire safety record, with multiple fatal accidents occurring annually. Despite frequent safety campaigns, the root causes of these accidents-entrenched chaos and a lack of accountability in field management-remained unaddressed.

I observed that safety protocols were often ignored. Underground, workers and managers operated in silos, leaving critical safety checks-such as monitoring carbon monoxide levels, ensuring 36V lighting, or verifying rock stability-to mere formalities, Procedures were frequently bypassed to save time, and papaer-based records were easily falsified.

I proposed and developed a web-based, B/S architecture management system to digitize every step of the site workflow, By breaking down complex operations into mandatory digital checklists, the system required field personnel to verify each safety measure and upload photographic evidence directly.Any discrepancies were flagged, and automated emails were dispatched to ensure immediate accountability and rectification.

A key innovation was absolute transparency: every form and photo was accessible to all, with every view logged. This environment of mutual oversight meant that field personnel knew their was visible, while leadership could intervene in real-time.

Within three months of implementation, the site was transformed. Long-standing safety hazards were resolved swiftly. From the system's launch in September 2015 through the subsequent years, the mining group achieved a record of zero fatal accidents.

After leaving the group, I open-sourced this system as the **Sea&Cloud Construction Site Management System**. now enhanced with mobile capabilities. My mission is to share this proven framework with the mining and construction industries worldwide, empowering teams to eliminate risks and, most importantly, save lives.

# Key Features

## 🔒 On-Premises & Private Deployment
SCCSMS is a fully self-hosted solution. You have complete control over you infrastructure-deploy it on you own cloud servers or internal hardware. Enterprise data, user accounts, and files remain entirely under your management, ensuring complete isolation from any third party. Your data remains yours. period.
## ☔ Built for Harsh Environments(Offline Capability)
Designed for the unique challenges of underground mines and remote areas, our mobile app features robust ***offline mode support***. Utilizing advanced local storage and mobile database technology, field personnel can continue their work and sync data whenever connectivity is restored.
## 😁 Lightweight & High Performance
The backend is built with ***Go(Golang)***, known for its exceptional concurrency and minimal resource footprint. The system is highly optimized for network efficiency, allowing it to run smoothly even on modest office hardware while supporting multiple concurrent users.
## ✅ Zero Licensing Costs
We believe in the power of open-source. SCCSMS is designed to run exclusively on mature, proven, and free technologies, including ***Linux, PostgreSQL, Minio/RustFS, Redis, and Nginx***, There are no hidden fees or proprietary licensing costs for the core infrastructure.
## 🍱 Optimized Storage & Traffic
By leveraging ***file hashing technology***, the system ensures the uniqueness of every uploaded file. This effectively eliminates data redundancy, significantly reducing storage consumption and network bandwidth usage.
## ✨ Field-Oriented Usability
We prioritize the end-user experience. The mobile interface is specifically engineered for On-site environments, featuring intuitive input patterns such as ***reference-base entry and one-handed operation modes*** to facilitate quick and accurate data collection in the field.

# Installation Guide

## Prerequisites
- **Supported Operating System:**
  - ***Linux:*** Debian 12+ (64-bit) 
  - ***Windows:*** Windows 10+ (64-bit)

- **Dependencies:**
  - **Database:** [PostgreSQL](https://www.postgresql.org/) 12+
  - **Storage:** S3-compatible storage (e.g., [Minio](https://min.io) or [RustFS](https://rustfs.com/) )
  - **Redis:** [Redis](https://redis.io/) 6+ (Optional: Only required for clustered deployments.)
  - **Nginx:** [Nginx](https://nginx.org) (Optional: Only required for clustered deployments.)

## Installation

### [Setting up on linux](document/settingUp/settingUpOnLinux.md)
### [Setting up on windwos](document/settingUp/settingUpOnWindows.md)



## [Project Architecture & Directory Overview](document/architectureAndDirectory.md)

