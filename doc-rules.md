# apps rules

asdasdsad

## 

Sidebar
main
- Studio Profile (to manage studio profil) [admin]

account
- Account (to manage personal information)
- Log out (log out)



Page & Function

Page Studio Profile
    - Form to manage studio information
        - Studio (input) - Required field
        - Studio Tagline (input) - Optional field
        - Address (input) - Optional field
        - Save Changes button

    - Database Table: studio_profiles
        - id (UUID, Primary Key, Auto-generated)
        - studio_name (TEXT, NOT NULL) - Studio name
        - studio_tagline (TEXT, NULLABLE) - Studio tagline/slogan
        - address (TEXT, NULLABLE) - Studio address
        - created_at (TIMESTAMP, Auto-generated)
        - updated_at (TIMESTAMP, Auto-updated)
        
    - Access Control
        - Only admin users can view/edit studio profile
        - Row Level Security (RLS) enabled
        - Admin-only policies for all CRUD operations