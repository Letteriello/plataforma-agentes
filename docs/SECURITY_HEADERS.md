# Security Headers Best Practices

Properly configured security headers are crucial for protecting web applications against a variety of common attacks. This document outlines recommended headers and provides guidance on their implementation.

## Recommended Security Headers

### 1. Content-Security-Policy (CSP)

*   **Purpose:** CSP helps to detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection attacks. It allows you to define which sources of content (scripts, styles, images, etc.) are approved and can be loaded by the browser.
*   **Example Policy (Strict):**
    ```
    Content-Security-Policy: default-src 'self'; img-src 'self' https: data:; script-src 'self' 'nonce-YOUR_SERVER_GENERATED_NONCE'; style-src 'self' 'nonce-YOUR_SERVER_GENERATED_NONCE'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';
    ```
    *   `default-src 'self'`: Restricts everything to the same origin by default.
    *   `img-src 'self' https: data:`: Allows images from the same origin, HTTPS sources, and data URIs.
    *   `script-src 'self' 'nonce-YOUR_SERVER_GENERATED_NONCE'`: Allows scripts from the same origin and those with a server-generated nonce.
    *   `style-src 'self' 'nonce-YOUR_SERVER_GENERATED_NONCE'`: Allows stylesheets from the same origin and those with a server-generated nonce.
    *   `object-src 'none'`: Disallows plugins like Flash.
    *   `base-uri 'self'`: Restricts the URLs that can be used in a document's `<base>` element.
    *   `form-action 'self'`: Restricts the URLs which the forms can submit to.
    *   `frame-ancestors 'none'`: Prevents the page from being embedded in iframes (similar to X-Frame-Options: DENY).

*   **Nonces and Hashes:**
    *   If you must use inline scripts or styles, CSP allows whitelisting them using a `nonce` (a random, server-generated token used once) or a `hash` (a cryptographic hash of the inline code).
    *   **Nonce Example:**
        *   Header: `script-src 'self' 'nonce-R4nd0mValu3'`.
        *   HTML: `<script nonce="R4nd0mValu3">doSomething();</script>`.
        *   The nonce must be unique for each request.
    *   **Hash Example:**
        *   Header: `script-src 'self' 'sha256-AbCdEfGhIjKlMnOpQrStUvWxYz1234567890=='`.
        *   The hash is of the actual inline script content.
    *   Avoid `'unsafe-inline'` and `'unsafe-eval'` if possible.

### 2. X-Content-Type-Options

*   **Purpose:** Prevents the browser from MIME-sniffing a response away from the declared content-type. This helps to mitigate attacks where a file might be misinterpreted (e.g., an image being treated as a script).
*   **Recommended Value:**
    ```
    X-Content-Type-Options: nosniff
    ```

### 3. X-Frame-Options

*   **Purpose:** Protects your site against clickjacking attacks by controlling whether your site can be embedded in `<frame>`, `<iframe>`, `<embed>`, or `<object>` elements on other sites.
*   **Recommended Values:**
    *   `DENY`: Prevents the page from being rendered in a frame, regardless of the site attempting to do so.
        ```
        X-Frame-Options: DENY
        ```
    *   `SAMEORIGIN`: Allows the page to be framed by pages from the same origin.
        ```
        X-Frame-Options: SAMEORIGIN
        ```
    *   Note: `frame-ancestors` in CSP is more flexible and is generally preferred if CSP is being implemented.

### 4. Strict-Transport-Security (HSTS)

*   **Purpose:** Enforces secure (HTTPS) connections to the server. It tells the browser to only communicate with the site using HTTPS, preventing downgrade attacks.
*   **Example Value:**
    ```
    Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
    ```
    *   `max-age=31536000`: Tells the browser to remember to enforce HTTPS for one year (in seconds).
    *   `includeSubDomains`: Applies the rule to all subdomains as well.
    *   `preload`: Indicates your site's willingness to be included in browser HSTS preload lists. This is a strong commitment and should only be done if you are sure you can maintain HTTPS for your entire site and all subdomains long-term.
*   **Important Considerations:**
    *   A valid SSL certificate must be properly configured on your server.
    *   Start with a small `max-age` (e.g., `max-age=3600` for one hour) and gradually increase it as you confirm everything works correctly.
    *   Understand the implications of `preload` before using it. Removal from preload lists can be a lengthy process.

### 5. Referrer-Policy

*   **Purpose:** Controls how much referrer information (the URL of the previous page) is sent with requests. This can enhance user privacy.
*   **Recommended Values:**
    *   `strict-origin-when-cross-origin`: Sends the full URL for same-origin requests, but only the origin for cross-origin requests. This is a good balance of utility and privacy.
        ```
        Referrer-Policy: strict-origin-when-cross-origin
        ```
    *   `no-referrer`: Sends no referrer information.
        ```
        Referrer-Policy: no-referrer
        ```
    *   Other values like `same-origin`, `origin`, `strict-origin` offer different levels of detail.

### 6. Permissions-Policy (formerly Feature-Policy)

*   **Purpose:** Allows you to selectively enable, disable, and modify the behavior of certain browser features and APIs on your website. This can prevent unwanted access to sensitive features like camera, microphone, geolocation, etc.
*   **Example (Disabling some features):**
    ```
    Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), oversized-images=(self), sync-xhr=(self)
    ```
    *   `geolocation=()`: Disables geolocation for all origins (including self).
    *   `microphone=()`: Disables microphone access.
    *   `camera=()`: Disables camera access.
    *   `oversized-images=(self)`: Allows oversized images only from the same origin.
    *   `sync-xhr=(self)`: Allows synchronous XMLHttpRequest only from the same origin.
*   You can also specify origins that are allowed, e.g., `geolocation=(self "https://example.com")`.

## Implementation Guidance

Security headers are typically set at the web server or application level.

### Common Web Servers

*   **Nginx:** Headers are usually added in the `server` block using the `add_header` directive.
    ```nginx
    server {
        listen 443 ssl;
        # ... other configurations ...

        add_header Content-Security-Policy "default-src 'self'; object-src 'none';" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "DENY" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Permissions-Policy "geolocation=(), microphone=()" always;
        # ...
    }
    ```
*   **Apache:** Headers can be set using the `Header` directive in your `.htaccess` file or server configuration.
    ```apache
    Header always set Content-Security-Policy "default-src 'self'; object-src 'none';"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "DENY"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=()"
    ```

### Node.js/Express Example

For Node.js applications using the Express framework, you can set headers using middleware:

```javascript
// Example for Express
const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' https: data:; script-src 'self' 'nonce-YOUR_NONCE'; style-src 'self' 'nonce-YOUR_NONCE'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY'); // Or 'SAMEORIGIN'
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload'); // Ensure HTTPS is properly set up
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', "geolocation=(), microphone=(), camera=()"); // Example: disable geo, mic, camera
  next();
});

// ... rest of your server setup (routes, etc.)

// Example: Start the server
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });
```
**Note on Nonces with Express:** For CSP nonces, you'd typically generate a unique nonce per request, make it available to your templating engine (if used), and include it in the CSP header.

### Platform-as-a-Service (PaaS) / Hosting Providers

Many modern hosting platforms provide ways to configure headers without directly modifying server configuration files:

*   **Vercel:** Use a `vercel.json` file in your project's root.
    ```json
    {
      "headers": [
        {
          "source": "/(.*)",
          "headers": [
            { "key": "Content-Security-Policy", "value": "default-src 'self'; img-src 'self' https: data:; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';" },
            { "key": "X-Content-Type-Options", "value": "nosniff" },
            { "key": "X-Frame-Options", "value": "DENY" },
            { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains; preload" },
            { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
            { "key": "Permissions-Policy", "value": "geolocation=(), microphone=(), camera=()" }
          ]
        }
      ]
    }
    ```
    *Note: For a Vercel-hosted Next.js app, you might use `next.config.js` for more dynamic header generation, especially for CSP nonces.*

*   **Netlify:** Use a `_headers` file or a `netlify.toml` file.
    *   `_headers` file example:
        ```
        /*
          Content-Security-Policy: default-src 'self'; object-src 'none';
          X-Content-Type-Options: nosniff
          X-Frame-Options: DENY
          Strict-Transport-Security: max-age=31536000; includeSubDomains
          Referrer-Policy: strict-origin-when-cross-origin
          Permissions-Policy: geolocation=(), microphone=()
        ```
    *   `netlify.toml` example:
        ```toml
        [[headers]]
          for = "/*"
          [headers.values]
            Content-Security-Policy = "default-src 'self'; object-src 'none';"
            X-Content-Type-Options = "nosniff"
            X-Frame-Options = "DENY"
            Strict-Transport-Security = "max-age=31536000; includeSubDomains"
            Referrer-Policy = "strict-origin-when-cross-origin"
            Permissions-Policy = "geolocation=(), microphone=()"
        ```

Always test your header configurations thoroughly to ensure they provide the intended security benefits without breaking your site's functionality. Tools like [Security Headers by Probely](https://securityheaders.com/) or browser developer tools can help you check your site's headers.
