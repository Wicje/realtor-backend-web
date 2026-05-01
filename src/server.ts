import app from "./app";
import { isSentryConfigured, reportFatalToSentry } from "./config/sentry";

const PORT = Number(process.env.PORT ?? 5000);

process.on("unhandledRejection", async (reason) => {
  await reportFatalToSentry(reason, { channel: "unhandledRejection" });
});

process.on("uncaughtException", async (error) => {
  await reportFatalToSentry(error, { channel: "uncaughtException" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Sentry status: ${isSentryConfigured ? "configured" : "disabled"}`);

const PORT = Number(process.env.PORT ?? 5000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
