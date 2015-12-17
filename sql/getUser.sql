SELECT username FROM "login"
WHERE username=$1
  AND password_hash IS NOT NULL
  AND password_hash=crypt($2, password_hash);

--PASSWORDS ARE NOT STORED AS PLAIN TEXT

--Use crypt with the plain text password
--provided by the user to see if the hash
--matches the one stored

--NEVER STORE PLAIN TEXT PASSWORDS
