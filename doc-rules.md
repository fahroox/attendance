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
        - useLocationMatch: React hook for location detection and matching
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

    - Enhanced Permission Handling System
        - Browser geolocation permission status tracking (unknown, granted, denied, prompt)
        - Automatic permission status detection on component mount
        - User-controlled location detection (no automatic requests)
        - Permission-specific error messages and user guidance
        - Graceful fallback when location access is denied
        - Retry functionality for failed permission requests

    - Location Permission Request Component
        - Professional modal interface for permission requests
        - Clear explanation of location feature benefits and usage
        - Privacy assurance messaging (client-side processing, no storage)
        - Visual status indicators with appropriate icons
        - User-friendly language and clear call-to-action buttons
        - Responsive design for mobile and desktop interfaces
        - Cancel and retry options for user control

    - Improved User Experience Features
        - "Find Studio" button instead of automatic detection
        - Modal-based permission request workflow
        - Visual status indicators (green pin for matched, red pin-off for denied)
        - Loading states with animated spinners during detection
        - Clear error messages with specific guidance for different scenarios
        - Multiple entry points for permission requests (header and sidebar)
        - Information card explaining location feature benefits

    - Enhanced Error Handling and User Guidance
        - Permission denied: Clear instructions to enable location in browser settings
        - Location unavailable: Guidance to check device location services
        - Timeout errors: Retry suggestions with timeout information
        - Browser compatibility: Fallback for unsupported browsers
        - Network errors: Clear error messages with retry options
        - Invalid coordinates: Validation and error recovery

    - Location Feature Information Component
        - Educational card explaining smart studio detection
        - Three-column layout highlighting key benefits:
            - Auto-Detection: 500-meter radius matching
            - Privacy Protected: Local processing, no server storage
            - Instant Matching: Real-time studio identification
        - Clear instructions on how to use the feature
        - Visual icons and professional design
        - Integration with main page layout

    - Permission Status Management
        - Real-time permission status tracking using navigator.permissions API
        - State management for permission lifecycle (unknown → prompt → granted/denied)
        - Visual feedback for different permission states
        - Automatic status updates when permissions change
        - Fallback handling for browsers without permissions API
        - Persistent permission status across component re-renders

    - Modal-Based Permission Workflow
        - Overlay modal for permission requests with backdrop
        - Professional card-based design with clear hierarchy
        - Step-by-step permission request process
        - Success and error state handling within modal
        - Easy dismissal with cancel button
        - Responsive modal sizing for different screen sizes
        - Accessibility considerations for modal interactions

    - Enhanced Visual Feedback System
        - Green location pin icon for successful studio matches
        - Red location pin-off icon for denied permissions
        - Animated loading spinners during location detection
        - Status text indicators (detecting, success, error states)
        - Color-coded buttons and status messages
        - Consistent iconography throughout the interface
        - Visual hierarchy for different types of information

    - User Control and Privacy Features
        - Manual permission request initiation (no automatic prompts)
        - Clear match functionality to reset location-based selection
        - Privacy-focused messaging about local processing
        - No persistent storage of user location data
        - Transparent explanation of data usage
        - User choice in enabling/disabling location features
        - Easy access to retry permission requests

    - Cross-Component Integration
        - LocationAwareHeader: Main page header with permission controls
        - LocationAwareDashboardSidebar: Dashboard sidebar with location features
        - LocationPermissionRequest: Dedicated permission request modal
        - LocationFeatureInfo: Educational information component
        - Consistent permission handling across all components
        - Shared permission status and state management
        - Unified user experience across different pages

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

    - Location Permission Gate System
        - App-wide location permission validation
        - Blocks access to main app without location permission
        - Shows "You can't access the app unless you allow location permission" message
        - Provides "Allow" button to request location access
        - Conditional protection - exempts auth pages from location requirement
        - Comprehensive permission state handling (granted, denied, prompt, unavailable, not-secure)
        - Clear instructions for enabling location access manually
        - Recovery options and retry functionality
        - Integration with main layout for app-wide protection

    - Automatic Location Permission Request
        - Auto-request permission on page load without user interaction
        - 1-second delay to ensure UI is ready before requesting
        - Smart detection - only requests when status is 'prompt'
        - Auto-trigger location detection when permission is granted
        - Seamless user experience across all pages
        - No manual button clicking required
        - Prevents duplicate requests with proper state management
        - useCallback optimization to prevent infinite re-renders

    - Enhanced User Experience Features
        - Real-time status monitoring with visual indicators
        - Comprehensive error handling with specific error messages
        - Loading states and animations during permission requests
        - Toast notifications for user feedback
        - Browser-specific guidance for permission settings
        - Graceful handling of local development vs production environments
        - Hydration-safe components to prevent server/client mismatches
        - Dynamic page rendering to handle authentication state

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
        - LocationPermissionGate component for app-wide protection
        - ConditionalLocationGate for smart page detection
        - LocationAccessIndicator with real-time status display
        - LocationAccessGuide with comprehensive setup instructions
        - Proper React hooks usage with useCallback and useEffect
        - TypeScript type safety with all permission states
        - ESLint compliance with no unused imports or unescaped entities
        - Hydration-safe rendering to prevent server/client mismatches
        - Dynamic rendering configuration for cookie handling