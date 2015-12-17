INSERT INTO "login" VALUES
  ($1, crypt($2, gen_salt('bf')));
