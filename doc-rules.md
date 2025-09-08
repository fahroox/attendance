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

    - Studio Profile Management System
        - Dynamic display of multiple studio profiles
        - Grid layout with responsive design (1-3 columns based on screen size)
        - Profile cards showing studio information and metadata
        - Real-time UI updates without page refresh
        - Empty state handling with call-to-action for first profile creation

    - CRUD Operations
        - Create: Add new studio profiles with form validation
        - Read: Display all existing studio profiles in organized cards
        - Update: Edit existing profiles with pre-populated form data
        - Delete: Remove profiles with confirmation dialog
        - Optimistic updates for better user experience

    - User Interface Features
        - Add New Studio button to reveal creation form
        - Edit and Delete buttons on each profile card
        - Form state management (only one form active at a time)
        - Loading states and success indicators
        - Profile cards display:
            - Studio name and tagline
            - Google Maps link (if available)
            - Extracted coordinates (if available)
            - Creation and update timestamps
            - Active/Draft status badge

    - Toast Notification System
        - Centralized toast utility functions for consistent notifications
        - Success notifications for create/update/delete operations
        - Error notifications for validation and operation failures
        - Interactive confirmation dialogs for destructive actions
        - Form validation error notifications
        - Auto-dismiss functionality with configurable duration
        - Rich color system for visual hierarchy
        - Consistent cancel buttons (✕) on all notifications

    - Toast Utility Functions
        - showSuccessToast() - Green success notifications
        - showErrorToast() - Red error notifications
        - showWarningToast() - Yellow warning notifications
        - showInfoToast() - Blue info notifications
        - showLoadingToast() - Loading state notifications
        - showConfirmationToast() - Interactive confirmation dialogs
        - showDeleteConfirmationToast() - Specialized delete confirmations
        - showValidationErrorToast() - Form validation errors
        - showSaveSuccessToast() - Create/update success messages
        - showDeleteSuccessToast() - Delete success messages
        - showOperationSuccessToast() - Generic operation success
        - showOperationErrorToast() - Generic operation errors
        - dismissAllToasts() - Dismiss all active toasts
        - dismissToast() - Dismiss specific toast by ID

    - Enhanced Form Features
        - Dynamic button text (Create Profile vs Update Profile)
        - Cancel button when editing or creating new profiles
        - Improved error handling with specific error messages
        - Success feedback with contextual messages
        - Form state synchronization with parent components
        - Callback-based integration for real-time updates

    - Data Management
        - Efficient data retrieval with ordered results (newest first)
        - Local state management for immediate UI updates
        - Database synchronization with router refresh
        - Error handling with user-friendly messages
        - Loading states during operations
        - Optimistic updates for better perceived performance

    - Component Architecture
        - StudioProfilesManagerWithActions: Main container component with action integration
        - StudioProfileFormWithActions: Form component using useActionState
        - StudioProfileCard: Individual profile card component
        - Modular design with clear separation of concerns
        - TypeScript interfaces for type safety
        - Shared type definitions in lib/types.ts
        - Centralized toast utilities in lib/toast.ts

    - API Actions Architecture (Next.js 15.4.5)
        - Server Actions for all CRUD operations
        - fetchStudioProfiles(): Fetch all studio profiles with authentication
        - createStudioProfile(): Create new studio profile with validation
        - updateStudioProfile(): Update existing studio profile
        - deleteStudioProfile(): Delete studio profile with confirmation
        - Action state management with proper error handling
        - Automatic path revalidation after mutations
        - Type-safe action state interfaces

    - Modern React Patterns
        - useActionState hook for form submission and state management
        - useOptimistic hook for optimistic UI updates
        - useTransition hook for pending state management
        - Server-side form validation and error handling
        - Client-side optimistic updates for better UX
        - Proper loading states and error boundaries

    - Form Handling with useActionState
        - Form submission using Next.js Server Actions
        - Automatic form state management
        - Built-in pending state handling
        - Server-side validation with client-side feedback
        - Optimistic updates for immediate UI feedback
        - Error handling with toast notifications
        - Success feedback with contextual messages

    - Optimistic Updates Implementation
        - Immediate UI updates before server confirmation
        - Rollback capability on server errors
        - Smooth user experience during network operations
        - Visual feedback for pending operations
        - State synchronization between client and server
        - Error recovery and retry mechanisms

    - Location-Based Studio Matching System
        - Automatic user location detection using browser geolocation API
        - Real-time studio matching based on proximity (500m radius)
        - Dynamic header updates showing matched studio name
        - Distance calculation using Haversine formula for precise measurements
        - Toast notifications for matching results and errors
        - Manual location detection controls for user interaction

    - Location Detection Features
        - Browser geolocation API integration with high accuracy settings
        - Automatic location detection on page load
        - Fallback handling for location permission denied
        - Timeout and error handling for location services
        - Maximum age caching (5 minutes) for performance optimization
        - User-friendly error messages for different failure scenarios

    - Studio Matching Algorithm
        - Haversine formula for accurate distance calculations
        - 500-meter radius matching threshold
        - Closest studio selection when multiple matches found
        - Exclusion of studios without valid coordinates
        - Distance sorting (closest first) for optimal user experience
        - Support for multiple studio locations

    - Dynamic UI Updates
        - Header title replacement: "Design Studio Attendance" → matched studio name
        - Green location pin icon indicator when studio is matched
        - Location detection status indicators (detecting, success, error)
        - Manual retry and clear match functionality
        - Responsive design for mobile and desktop interfaces

    - Toast Notification System for Location
        - Success toast: "Studio Found!" with studio name and distance
        - Info toast: "No Studio Found" when no matches within 500m
        - Error toast: "Location Detection Failed" with specific error details
        - Auto-dismiss functionality with appropriate durations
        - Rich descriptions with contextual information

    - Location-Aware Components
        - LocationAwareHeader: Main page header with location matching
        - LocationAwareDashboardSidebar: Dashboard sidebar with location matching
        - Client-side studio profile fetching for public access
        - Integration with existing authentication and admin systems

    - Location Utilities and Functions
        - calculateDistance(): Haversine formula implementation
        - findNearbyStudios(): Studio matching with distance filtering
        - getUserLocation(): Browser geolocation API wrapper
        - formatDistance(): Distance formatting for display
        - fetchPublicStudioProfiles(): Client-side studio data fetching

    - Error Handling and Edge Cases
        - Geolocation not supported by browser
        - Location permission denied by user
        - Location services unavailable or timeout
        - No studios with valid coordinates in database
        - Network errors during studio profile fetching
        - Invalid coordinate data handling

    - Performance Optimizations
        - Efficient distance calculations with mathematical precision
        - Client-side caching of studio profiles
        - Debounced location detection to prevent excessive API calls
        - Optimistic UI updates for better perceived performance
        - Lazy loading of location-dependent components

    - Security and Privacy Considerations
        - Client-side location processing (no server-side location storage)
        - Public studio profile access without authentication requirements
        - No persistent storage of user location data
        - Browser-based geolocation with user consent
        - Secure coordinate validation and sanitization

    - Testing and Quality Assurance
        - Unit tests for distance calculation accuracy
        - Studio matching algorithm validation
        - Edge case testing (no coordinates, no matches, etc.)
        - Location detection error scenario testing
        - Cross-browser compatibility verification


    - TypeScript Type Safety and Compatibility
        - Complete StudioProfile type compatibility in location matching
        - Optional id field handling for database records
        - PermissionState type alignment with browser APIs
        - LocationMatch interface with all required StudioProfile fields
        - Type-safe distance calculation and studio matching functions
        - Proper error handling with typed error states
        - Full compatibility with Supabase database schema

    - Deployment and Build Optimization
        - ESLint error resolution for clean builds
        - TypeScript compilation fixes for production deployment
        - Unused variable cleanup and code optimization
        - Proper JSX entity escaping for React compliance
        - useEffect dependency management for React hooks
        - Component prop validation and type safety
        - Production-ready code with no build warnings

    - Error Resolution and Bug Fixes
        - Fixed LogoutButton component prop compatibility
        - Resolved PermissionState type mismatch issues
        - Fixed StudioProfile field compatibility in location matching
        - Corrected optional field handling in database operations
        - Resolved TypeScript compilation errors for deployment
        - Fixed React hook dependency warnings
        - Cleaned up unused variables and imports

    - Production Deployment Features
        - HTTPS-only location feature activation
        - Deployment testing guide and documentation
        - Clean build process with no errors or warnings
        - Optimized for Vercel, Netlify, and other hosting platforms
        - Environment-agnostic location detection
        - Secure context validation for geolocation API
        - Cross-browser compatibility and fallback handling



    - Security and Privacy Enhancements
        - HTTPS-only location feature activation
        - No persistent storage of user location data
        - Transparent explanation of data usage
        - User choice in enabling/disabling location features
        - Easy access to retry permission requests
        - Secure context validation for geolocation API
        - Cross-browser compatibility and fallback handling
        - Privacy-first approach with local processing only

    - Technical Implementation Details
        - Proper React hooks usage with useCallback and useEffect
        - TypeScript type safety with all permission states
        - ESLint compliance with no unused imports or unescaped entities
        - Hydration-safe rendering to prevent server/client mismatches
        - Dynamic rendering configuration for cookie handling

    - Admin Bypass System for Location Restrictions
        - Admin users can access the system regardless of location
        - Role-based access control (RBAC) with admin and team roles
        - Automatic location validation bypass for admin users
        - useUserRole hook for client-side role detection
        - Timeout handling for role detection with fallback to team role
        - Integration with existing location permission system
        - Admin users see "Admin Access" instead of location-based restrictions

    - Location Validation Removal
        - Complete removal of location-based access restrictions
        - All users can access the system without location requirements
        - Location features still available but not mandatory for access
        - Simplified app flow without location barriers

    - User Location Display on Dashboard
        - Real-time display of user's current latitude and longitude
        - Automatic geolocation detection on dashboard load
        - UserLocationDisplay component with location coordinates
        - Manual refresh button for location updates
        - Error handling for geolocation failures
        - Loading states during location detection
        - Integration with dashboard layout and styling

    - Nearest Studio Calculation and Display
        - Automatic calculation of nearest studio to user location
        - Distance calculation using Haversine formula (in meters)
        - Integration with UserLocationDisplay component
        - Real-time studio matching with distance display
        - Studio information display (name, tagline, coordinates)
        - Direct link to view studio on Google Maps
        - Green success styling for nearest studio information
        - Automatic detection on page load without user interaction

    - Landing Page Studio Matching System
        - LandingStudioMatcher component for unauthenticated users
        - Automatic studio detection based on user location
        - Header title replacement with nearest studio name
        - Distance display in meters/kilometers format
        - User location coordinates display below studio name
        - Debug information showing all studio distances
        - Automatic geolocation request on page load
        - Fallback to "Design Studio Attendance" when no studio found

    - Public Studio Access Policy
        - Row Level Security (RLS) policy for public studio profile access
        - Allows unauthenticated users to read studio profiles
        - Required for landing page studio matching functionality
        - Security maintained - only SELECT operations allowed
        - Admin-only policies remain for INSERT/UPDATE/DELETE operations
        - Database policy: "Public can view studio profiles for location matching"
        - Enables location-based features for all users

    - Sign-Up Form Simplification
        - Removed role selection field from sign-up form
        - New users automatically assigned default role (team)
        - Simplified sign-up process with essential fields only
        - Security enhancement - users cannot self-assign admin roles
        - Cleaner form UI without role dropdown
        - Automatic role assignment in user profile creation
        - Maintained email and password validation

    - Enhanced Coordinate Extraction System
        - Improved Google Maps URL parsing with multiple format support
        - Priority-based coordinate extraction (placePattern, atPattern, dataPattern)
        - Real-time coordinate validation and display
        - Hidden form inputs for automatic coordinate submission
        - Visual feedback with green success indicators
        - Warning messages for invalid URLs
        - Key-based React re-rendering for UI updates
        - Synchronized coordinate display and form submission

    - Debug and Development Features
        - Comprehensive console logging for studio loading and matching
        - On-page debug display showing studio distances
        - Real-time status indicators (loading, detecting, found/none)
        - Complete studio distance list with formatting
        - Error tracking and debugging information
        - Development-friendly logging for troubleshooting
        - Production-ready with optional debug features

    - Database Schema Updates
        - Public read access policy for studio_profiles table
        - Maintained admin-only write permissions
        - Enhanced coordinate precision handling
        - Default studio profile insertion
        - Row Level Security optimization for public access
        - Database migration scripts for policy updates

    - Component Architecture Updates
        - LandingStudioMatcher: New component for landing page
        - UserLocationDisplay: Enhanced with nearest studio calculation
        - SignUpForm: Simplified without role selection
        - LocationAwareHeader: Updated for landing page integration
        - Streamlined component hierarchy and dependencies

    - User Experience Improvements
        - Automatic location detection without user interaction
        - Real-time studio matching and display
        - Simplified sign-up process
        - Enhanced error handling and user feedback
        - Consistent styling across all location features
        - Mobile-responsive design for all components
        - Accessibility improvements for location features

    - Security and Privacy Enhancements
        - Role-based access control with admin bypass
        - Public read access for studio profiles only
        - No persistent storage of user location data
        - Client-side location processing
        - Secure coordinate validation and sanitization
        - HTTPS-only location feature activation
        - Privacy-first approach with local processing

    - Performance Optimizations
        - Efficient distance calculations with Haversine formula
        - Client-side caching of studio profiles
        - Optimized React re-rendering with key props
        - Debounced location detection
        - Lazy loading of location-dependent components
        - Reduced API calls with smart caching
        - Optimistic UI updates for better perceived performance

    - Error Handling and Edge Cases
        - Geolocation not supported by browser
        - Location permission denied by user
        - No studios with valid coordinates
        - Network errors during studio fetching
        - Invalid coordinate data handling
        - Role detection timeout scenarios
        - Database access permission errors
        - Form validation and submission errors

    - Deployment and Production Features
        - Clean build process with no ESLint errors
        - TypeScript compilation fixes
        - Production-ready error handling
        - Environment-agnostic location detection
        - Cross-browser compatibility
        - Vercel deployment optimization
        - HTTPS context validation
        - Secure context requirements for geolocation