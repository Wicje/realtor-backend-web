import { randomUUID } from "crypto";

const SENTRY_DSN = process.env.SENTRY_DSN;
const SENTRY_ENVIRONMENT = process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? "development";
const SENTRY_RELEASE = process.env.SENTRY_RELEASE;

interface ParsedDsn {
  protocol: string;
  host: string;
  projectId: string;
  publicKey: string;
}

const parseDsn = (dsn: string): ParsedDsn | null => {
  const match = dsn.match(/^(https?):\/\/([^@]+)@([^/]+)\/(\d+)$/);

  if (!match) return null;

  const [, protocol, publicKey, host, projectId] = match;
  return { protocol, host, projectId, publicKey };
};

const sendSentryEvent = async (level: "error" | "fatal", message: string, extra?: Record<string, unknown>) => {
  if (!SENTRY_DSN) return;

  const parsed = parseDsn(SENTRY_DSN);
  if (!parsed) return;

  const eventId = randomUUID().replace(/-/g, "");
  const timestamp = Math.floor(Date.now() / 1000);

  const body = {
    event_id: eventId,
    timestamp,
    level,
    platform: "node",
    environment: SENTRY_ENVIRONMENT,
    release: SENTRY_RELEASE,
    message,
    extra,
  };

  const endpoint = `${parsed.protocol}://${parsed.host}/api/${parsed.projectId}/store/`;
  const authHeader = `Sentry sentry_version=7, sentry_client=realtor-backend-web/1.0, sentry_key=${parsed.publicKey}`;

  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Sentry-Auth": authHeader,
      },
      body: JSON.stringify(body),
    });
  } catch {
    // Never break request handling if observability transport fails.
  }
};

export const reportErrorToSentry = async (error: unknown, context?: Record<string, unknown>) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  await sendSentryEvent("error", message, {
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  });
};

export const reportFatalToSentry = async (error: unknown, context?: Record<string, unknown>) => {
  const message = error instanceof Error ? error.message : "Unknown fatal error";
  await sendSentryEvent("fatal", message, {
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  });
};

export const isSentryConfigured = Boolean(SENTRY_DSN && parseDsn(SENTRY_DSN));
