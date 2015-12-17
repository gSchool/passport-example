INSERT INTO "login" VALUES
  ($1, crypt($2, gen_salt('bf')));

--NEVER STORE PASSWORDS AS PLAIN TEXT

--crypt and gen_salt work together to
--make the password not retrievable after
--it is stored.

--crypt and gen_salt are only available
--using the pgcrypto module
--enable with:
--CREATE MODULE pgcrypto;
