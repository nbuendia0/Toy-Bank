# Toy Bank – CSRF Attack & Defense Demo

A small online banking app built in Node.js to demonstrate **Cross-Site Request Forgery (CSRF)** vulnerabilities and protections. The project includes a deliberately vulnerable server, a CSRF-protected server, and an attacker site with a fake prize page that performs an unauthorized money transfer when the victim is logged in.

GitHub renders this README using its default UI font stack (e.g., `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`), which this layout is optimized for.

---

## Features
- User registration and login  
- Initial balance of **$1,000** per user  
- Transfer funds between existing users  
- **Vulnerable server** without CSRF protection  
- **Protected server** using `csurf` middleware  
- **Attacker site** hosted on a separate HTTP server  
- Fake prize page that performs a hidden, forged transfer request  
- HTTPS bank server using self-signed TLS keys  

---

## Tech Stack
- **Node.js**, **Express**  
- **HTTPS** for the bank server (self-signed certificates)  
- **HTTP** for the attacker server  
- **csurf** for CSRF defense  
- Basic HTML and JavaScript frontend  

---

## Project Structure
```text
.
├── attacker/              # Fake prize page and attacker assets
│   └── fake-prize.html
├── public/                # Client-side code (index.html, scripts.js)
├── attacker.js            # Attacker HTTP server (port 3666)
├── key.pem                # TLS private key (development only)
├── req.pem                # TLS certificate (development only)
├── package.json           # Node.js dependencies and metadata
├── package-lock.json
├── protected-server.js    # CSRF-protected HTTPS bank server
├── vuln-server.js         # Vulnerable HTTPS bank server (no CSRF)
├── LICENSE
└── README.md
```

---

## Prerequisites
- Node.js (LTS recommended)  
- npm (comes bundled with Node)  
- The included TLS keys for local HTTPS testing  

---

## Setup
Install all required dependencies:

```bash
npm install
```

---

## Running the Vulnerable Bank Server
Start the insecure server:

```bash
node vuln-server.js
```

Expected output:

```text
HTTPS server running on port 3000
```

Open the app:

```
https://localhost:3000
```

> You will need to accept the browser's self-signed certificate warning.

---

## Running the Protected Bank Server (with CSRF Defense)
Shut down any other running server, then start the protected version:

```bash
node protected-server.js
```

Open:

```
https://localhost:3000
```

This version uses CSRF tokens via `csurf` to prevent forged transfer requests.

---

## Running the Attacker Server
In a separate terminal:

```bash
node attacker.js
```

Expected output:

```text
Attacker server running on port 3666
```

Visit the malicious page:

```
http://localhost:3666
```

The fake-prize page attempts to silently submit a transaction to the vulnerable server when the victim is logged in.

---

## Demo Flow
1. Start **`vuln-server.js`** on port **3000**  
2. Start **`attacker.js`** on port **3666**  
3. Register and log in at `https://localhost:3000`  
4. Visit the attacker page at `http://localhost:3666`  
5. Return to the bank app to see the balance changed (successful CSRF attack)  
6. Repeat using **`protected-server.js`**  
7. Observe that the CSRF attack fails due to token validation  

---

## Security Notes
- The TLS keys included in this project are for **local development only**  
- The vulnerable server intentionally lacks CSRF protection for demonstration purposes  
- Do **not** reuse this architecture in production environments  

---

## Project Status
**Status:** ✅ Complete
