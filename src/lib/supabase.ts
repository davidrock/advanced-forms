import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://rqkucoqjucfqnfijqesd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxa3Vjb3FqdWNmcW5maWpxZXNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTIzMjExOCwiZXhwIjoxOTk2ODA4MTE4fQ.JlWykeZWkTM7SCFYPrQt58Ded29ilshGNLrK8oqgLAQ"
);

