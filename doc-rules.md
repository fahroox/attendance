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
        - Google Maps url (input) - Optional field
        - Save Changes button

    - Database Table: studio_profiles
        - id (UUID, Primary Key, Auto-generated)
        - studio_name (TEXT, NOT NULL) - Studio name
        - studio_tagline (TEXT, NULLABLE) - Studio tagline/slogan
        - google_maps_url (TEXT, NULLABLE) - Google Maps URL for studio location
        - longitude (DECIMAL(11,8), NULLABLE) - Longitude extracted from Google Maps URL (range: -180 to 180)
        - latitude (DECIMAL(10,8), NULLABLE) - Latitude extracted from Google Maps URL (range: -90 to 90)
        - created_at (TIMESTAMP, Auto-generated)
        - updated_at (TIMESTAMP, Auto-updated)
        
    - Coordinate Extraction Features
        - Automatic extraction of longitude and latitude from Google Maps URLs
        - Supports multiple Google Maps URL formats:
            - @lat,lng format (e.g., @40.7128,-74.0060)
            - ll=lat,lng format (e.g., ll=40.7128,-74.0060)
            - center=lat,lng format (e.g., center=40.7128,-74.0060)
            - q=lat,lng format (e.g., q=40.7128,-74.0060)
            - Place URL format (e.g., /place/Studio/@-8.0019522,112.6069239,19z/data=...)
            - Data parameter format (e.g., !8m2!3d-8.0019522!4d112.6069236!)
        - Real-time coordinate validation and display
        - Hidden form inputs for latitude and longitude values
        - Synchronized coordinate display showing extracted values
        - Visual feedback for successful coordinate extraction
        - Warning messages for invalid URLs
        - Direct link to open location in Google Maps
        - Proper database precision handling (DECIMAL(11,8) for longitude, DECIMAL(10,8) for latitude)
        
    - Form Implementation
        - Hidden input fields for latitude and longitude coordinates
        - Real-time coordinate extraction from Google Maps URL input
        - Synchronized display showing extracted coordinate values
        - Automatic population of hidden inputs when URL changes
        - Form submission uses hidden input values for database storage
        - Visual feedback with green success box for valid coordinates
        - Warning messages for invalid or unparseable URLs
        
    - Access Control
        - Only admin users can view/edit studio profile
        - Row Level Security (RLS) enabled
        - Admin-only policies for all CRUD operations