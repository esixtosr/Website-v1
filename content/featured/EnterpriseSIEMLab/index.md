---
date: '2026-08-04'
title: 'Enterprise SIEM Lab'
cover: './01-mitre-attack-dashboard.png'
gallery:
  - './02-role-based-vpn-siem-architecture.png'
  - './03-active-directory-role-based-groups.png'
  - './04-wazuh-endpoint-agents.png'
  - './05-failed-logon-detection-filter.png'
  - './06-failed-logon-event-details.png'
  - './07-dc01-endpoint-posture.png'
tech:
  - Wazuh
  - Active Directory
  - VPN
  - MITRE ATT&CK
  - Windows Server
  - SIEM
---

An enterprise-style SIEM lab built to monitor role-based VPN access, Active Directory groups, Windows endpoints, and security telemetry through Wazuh.

The lab maps user roles to access paths, collects endpoint agent data, and validates detections such as failed logons and endpoint posture from a centralized dashboard aligned with MITRE ATT&CK-style analysis.
