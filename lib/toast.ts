import { toast } from "sonner";

/**
 * Toast utility functions for consistent notification handling across the app
 * 
 * @example
 * // Basic success notification
 * showSuccessToast("Profile Updated", "Your changes have been saved successfully.");
 * 
 * @example
 * // Delete confirmation
 * showDeleteConfirmationToast({
 *   itemName: "My Studio",
 *   itemType: "studio profile",
 *   onConfirm: async () => {
 *     await deleteStudioProfile();
 *   }
 * });
 * 
 * @example
 * // Form validation error
 * showValidationErrorToast("Email address is required");
 * 
 * @example
 * // Save success with dynamic action
 * showSaveSuccessToast("My Studio", "created");
 */

// Success toast notifications
export const showSuccessToast = (title: string, description?: string) => {
  return toast.success(title, {
    description,
    cancel: {
      label: "✕",
      onClick: () => toast.dismiss()
    }
  });
};

// Error toast notifications
export const showErrorToast = (title: string, description?: string) => {
  return toast.error(title, {
    description,
    cancel: {
      label: "✕",
      onClick: () => toast.dismiss()
    }
  });
};

// Warning toast notifications
export const showWarningToast = (title: string, description?: string) => {
  return toast.warning(title, {
    description,
    cancel: {
      label: "✕",
      onClick: () => toast.dismiss()
    }
  });
};

// Info toast notifications
export const showInfoToast = (title: string, description?: string) => {
  return toast.info(title, {
    description,
    cancel: {
      label: "✕",
      onClick: () => toast.dismiss()
    }
  });
};

// Loading toast notifications
export const showLoadingToast = (title: string, description?: string) => {
  return toast.loading(title, {
    description
  });
};

// Confirmation toast with action buttons
export interface ConfirmationOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: "default" | "destructive";
  duration?: number;
}

export const showConfirmationToast = ({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  duration = 10000
}: ConfirmationOptions) => {
  const toastFunction = variant === "destructive" ? toast.error : toast.warning;
  
  return toastFunction(title, {
    description,
    action: {
      label: confirmLabel,
      onClick: async () => {
        try {
          await onConfirm();
        } catch (error) {
          console.error("Error in confirmation action:", error);
          showErrorToast("Action Failed", "An error occurred while performing the action.");
        }
      }
    },
    cancel: {
      label: cancelLabel,
      onClick: () => {
        if (onCancel) {
          onCancel();
        }
        toast.dismiss();
      }
    },
    duration
  });
};

// Delete confirmation toast (specialized for destructive actions)
export interface DeleteConfirmationOptions {
  itemName: string;
  itemType?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export const showDeleteConfirmationToast = ({
  itemName,
  itemType = "item",
  onConfirm,
  onCancel
}: DeleteConfirmationOptions) => {
  return showConfirmationToast({
    title: `Delete ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`,
    description: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    onConfirm,
    onCancel,
    variant: "destructive",
    duration: 10000
  });
};

// Form validation error toast
export const showValidationErrorToast = (message: string) => {
  return showErrorToast("Validation Error", message);
};

// Save success toast (for create/update operations)
export const showSaveSuccessToast = (itemName: string, action: "created" | "updated") => {
  const actionText = action === "created" ? "created" : "updated";
  return showSuccessToast(
    `Profile ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
    `${itemName} has been ${actionText} successfully.`
  );
};

// Delete success toast
export const showDeleteSuccessToast = (itemName: string, itemType?: string) => {
  const typeText = itemType ? `${itemType} ` : "";
  return showSuccessToast(
    `${typeText.charAt(0).toUpperCase() + typeText.slice(1)}Deleted`,
    `${itemName} has been deleted successfully.`
  );
};

// Generic operation success toast
export const showOperationSuccessToast = (operation: string, itemName?: string) => {
  const description = itemName ? `${itemName} ${operation} successfully.` : `${operation} completed successfully.`;
  return showSuccessToast(
    operation.charAt(0).toUpperCase() + operation.slice(1) + " Success",
    description
  );
};

// Generic operation error toast
export const showOperationErrorToast = (operation: string, error?: string) => {
  const description = error || `Failed to ${operation.toLowerCase()}. Please try again.`;
  return showErrorToast(
    `${operation.charAt(0).toUpperCase() + operation.slice(1)} Failed`,
    description
  );
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Dismiss specific toast
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};
