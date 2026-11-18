-- Remove the legacy reversible password store. Credential hashes remain in Better Auth.
DROP TABLE IF EXISTS staff_password_copy;
