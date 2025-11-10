export function extractDomainFromEmail(email: string): string | null {
  const match = email.match(/@([a-zA-Z0-9.-]+\.[a-z]{2,})$/);
  return match ? match[1] : null;
}
