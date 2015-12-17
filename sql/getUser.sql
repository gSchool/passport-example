SELECT username FROM "login"
WHERE username=$1
  AND password_hash IS NOT NULL
  AND password_hash=crypt($2, password_hash);
