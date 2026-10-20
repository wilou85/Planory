/**
 * Upsert up to 2 admin accounts from env (never commit passwords).
 *
 *   ADMIN_SEED_EMAIL_1=… ADMIN_SEED_PASSWORD_1=…
 *   ADMIN_SEED_EMAIL_2=… ADMIN_SEED_PASSWORD_2=…
 *   DATABASE_URL=…
 *
 * Usage: npm run admin:seed  (reads .env then .env.local, shell env wins)
 */
import bcrypt from "bcryptjs";
import pg from "pg";

const accounts = [
  {
    email: process.env.ADMIN_SEED_EMAIL_1?.trim(),
    password: process.env.ADMIN_SEED_PASSWORD_1,
  },
  {
    email: process.env.ADMIN_SEED_EMAIL_2?.trim(),
    password: process.env.ADMIN_SEED_PASSWORD_2,
  },
].filter((a) => a.email && a.password);

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required (set it in .env, .env.local or the shell)");
  process.exit(1);
}

if (accounts.length === 0) {
  console.error(
    "Provide ADMIN_SEED_EMAIL_1/PASSWORD_1 and optionally _2 (both email + password required per account)",
  );
  process.exit(1);
}

const ssl =
  process.env.DATABASE_SSL === "false"
    ? undefined
    : {
        rejectUnauthorized:
          process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
      };

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl, max: 2 });

try {
  for (const account of accounts) {
    const passwordHash = await bcrypt.hash(account.password, 12);
    const result = await pool.query(
      `
        INSERT INTO public.admin_users (email, password_hash, role)
        VALUES ($1, $2, 'admin')
        ON CONFLICT (email) DO UPDATE
          SET password_hash = EXCLUDED.password_hash,
              role = 'admin'
        RETURNING id, email, role
      `,
      [account.email.toLowerCase(), passwordHash],
    );
    console.log(`upserted ${result.rows[0].email} (${result.rows[0].id})`);
  }
} finally {
  await pool.end();
}
