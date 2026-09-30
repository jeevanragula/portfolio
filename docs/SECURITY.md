# Security

## Scope

This is a public static portfolio. It currently has no backend, database, authentication system, or server-side application.

## Never Commit Secrets

Do not commit:

- API keys
- Access tokens
- Passwords
- Private certificates
- Cloud credentials
- Authentication secrets
- Customer information
- Confidential company information

## Public Information

Everything in `data/career.json` is intended to be public. Do not put confidential Zscaler, customer, internal architecture, source-code, incident, or operational information into the portfolio.

## External Links

Use HTTPS where supported and review links when they change.

## Contact Form

The current contact form is presentation-only and does not transmit data to a backend. Do not add a third-party endpoint or API key without documenting the integration and its security implications.

## Dependencies

The project intentionally has no runtime package dependencies. If dependencies are introduced, keep them minimal, review security advisories, and document why they are required.

## Reporting

For security issues, contact the repository owner through public contact information rather than publishing sensitive details in an issue.
