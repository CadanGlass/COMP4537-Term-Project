export const ADMIN_STRINGS = {
  TITLE: "Admin Dashboard",
  ERRORS: {
    NO_TOKEN: "No token found, please log in.",
    INVALID_TOKEN: "Invalid token.",
    ACCESS_DENIED: "Access denied. Admins only.",
    NO_USERS: "No users found or unable to fetch users.",
    UNAUTHORIZED: "Unauthorized access. Please log in as an admin.",
    ADMIN_ROUTE_ERROR: "Error accessing admin route.",
    PROMOTE_ERROR: "Failed to promote user to admin.",
    DELETE_ERROR: "Failed to delete user:",
    STATS_ERROR: "Failed to fetch endpoint statistics",
  },
  TABLE: {
    ID: "ID",
    EMAIL: "Email",
    ROLE: "Role",
    API_CALLS: "API Calls Remaining",
    ACTIONS: "Actions",
    NO_USERS_FOUND: "No users found.",
  },
  BUTTONS: {
    PROMOTE_TOOLTIP: "Promote to Admin",
    DELETE_TOOLTIP: "Delete User",
  },
  DIALOGS: {
    DELETE: {
      TITLE: "Confirm Delete",
      CONTENT: "Are you sure you want to delete this user? This action cannot be undone.",
      CANCEL: "Cancel",
      CONFIRM: "Delete",
    },
    PROMOTE: {
      TITLE: "Confirm Promotion",
      CONTENT: "Are you sure you want to promote this user to admin? This will give them full administrative privileges.",
      CANCEL: "Cancel",
      CONFIRM: "Promote",
      CONFIRMING: "Promoting...",
    },
  },
  NOTIFICATIONS: {
    PROMOTE_SUCCESS: "User successfully promoted to admin!",
    DELETE_SUCCESS: "User deleted successfully",
  },
  STATS: {
    TITLE: "Endpoint Statistics",
    TABLE: {
      METHOD: "Method",
      ENDPOINT: "Endpoint",
      REQUESTS: "Requests",
      NO_STATS: "No endpoint statistics available",
    },
  },
}; 