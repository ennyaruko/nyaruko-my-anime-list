#!/usr/bin/env node

const [url, ...extraArgs] = process.argv.slice(2);

if (!url || extraArgs.length > 0) {
  console.error('Usage: npm run encode:endpoint -- "https://example.com/path/:id"');
  process.exit(1);
}

try {
  const parsedUrl = new URL(url);

  if (parsedUrl.protocol !== "https:") {
    throw new Error("URL must use HTTPS.");
  }

  if (parsedUrl.username || parsedUrl.password) {
    throw new Error("URL must not contain a username or password.");
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : "Invalid URL.");
  process.exit(1);
}

console.log(Buffer.from(url, "utf8").toString("base64"));
