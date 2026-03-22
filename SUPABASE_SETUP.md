## Supabase Setup

1. Open Supabase SQL Editor and run [schema.sql](c:\Users\user\OneDrive\Desktop\NAAMIN\naaminlet1\supabase\schema.sql).

2. In Supabase Auth, create your admin user with email/password.

3. In SQL Editor, add that auth user to the admin table:

```sql
insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'your-admin-email@example.com';
```

4. Open `admin.html`, sign in with that user, then click `Seed Default Content`.

5. The public site at `index.html` will start reading:
   - `site_sections`
   - `catalog_items`

6. Login and signup pages are now wired to Supabase Auth:
   - [login.html](c:\Users\user\OneDrive\Desktop\NAAMIN\naaminlet1\login.html)
   - [signup.html](c:\Users\user\OneDrive\Desktop\NAAMIN\naaminlet1\signup.html)

7. If you want Google login, enable Google in Supabase Auth and add these redirect URLs in Auth settings:
   - `http://127.0.0.1:5500/naaminlet1/login.html`
   - `http://127.0.0.1:5500/naaminlet1/signup.html`
   - plus your production URLs later

8. Public reads are protected by RLS:
   - only `published = true` / `is_published = true` rows are exposed publicly
   - only users in `admin_users` can write

9. Supabase client config is already wired in:
   - [supabase-client.js](c:\Users\user\OneDrive\Desktop\NAAMIN\naaminlet1\js\supabase-client.js)

Note: because this is a static site, the publishable key is client-side. RLS must remain enabled.
