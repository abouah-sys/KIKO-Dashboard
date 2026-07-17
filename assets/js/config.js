/* ============================================================================
   KIKO KNOWLEDGE BASE — SITE SETTINGS
   ----------------------------------------------------------------------------
   Change the team password and branding here.

   -------------------------------------------------------------
   HOW TO CHANGE THE SHARED PASSWORD
   -------------------------------------------------------------
   The password is NOT stored here in plain text — it's stored as a
   "hash" (a scrambled fingerprint) so nobody can read it from the code.

   To set a new password:
     1. Open this page in your browser:  set-password.html
     2. Type the password you want and click "Generate".
     3. Copy the long line of text it gives you.
     4. Paste it below as the value of PASSWORD_HASH (keep the quotes).
     5. Save the file and re-deploy.

   The starter password is:  kiko2024
   (Please change it before sharing the site with your team.)
   ========================================================================== */

const KB_CONFIG = {
  // Branding shown across the site
  brandName: "KIKO",
  brandSubtitle: "Knowledge Base",

  // SHA-256 hash of the shared team password.
  // Default below is the hash of: kiko2024
  PASSWORD_HASH:
    "5bb0a54cd48ac3027d2c9bdbf1edaffbebc2caf77c1d393ae87ddfec9c7735f1",

  // How long a login stays active before the user must sign in again.
  // "session"  = until the browser tab is closed (most secure)
  // a number   = number of days to stay signed in (e.g. 7)
  sessionMode: "session",

  // Optional support contact shown on the login screen. Leave "" to hide.
  supportContact: "abouah@creativecfo.com"
};
