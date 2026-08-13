---
date: '2026-08-03'
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

CryptoChat is an encrypted peer-to-peer messaging project focused on practical secure communication concepts, including key exchange, authenticated encryption, and trust-on-first-use fingerprint verification.

The project demonstrates how two peers can establish a shared secret, derive encryption keys, verify identities through fingerprints, and exchange encrypted messages over TCP while validating the result with packet-level inspection.
