---
date: '2026-08-04'
title: 'CryptoChat'
cover: './01-cryptochat-main-verified-chat.png'
gallery:
  - './02-cryptochat-fingerprint-verification.png'
  - './03-cryptochat-architecture.svg'
  - './04-cryptochat-wireshark-encrypted-traffic.png'
  - './05-cryptochat-collapsed-sidebar.png'
  - './06-cryptochat-disconnected-state.png'
github: 'https://github.com/esixtosr/CryptoChat'
tech:
  - Python
  - Cryptography
  - X25519
  - AES-GCM
  - TCP
  - Wireshark
---

CryptoChat is an encrypted peer-to-peer messaging project built to explore practical secure communication concepts, including key exchange, authenticated encryption, and fingerprint verification.

The project shows how two peers establish a shared secret, derive encryption keys, verify identities, and exchange encrypted messages over TCP, with packet-level validation in Wireshark.
