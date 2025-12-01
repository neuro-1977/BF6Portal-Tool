"""
Error_Logger.py

Comprehensive error logging and debugging system for the Block Editor.
Captures exceptions, warnings, and debug information to help identify issues.
"""

import sys
import traceback
from datetime import datetime
import tkinter as tk
from tkinter import messagebox


class ErrorLogger:
    """Handles error logging and exception reporting for the application."""
    
    def __init__(self, verbose=True):
        """Initialize error logger.
        
        Args:
            verbose: If True, print detailed error information to console
        """
        self.verbose = verbose
        self.error_count = 0
        self.warning_count = 0
        self.errors = []
        
    def log_error(self, error_type, message, exception=None, show_dialog=False):
        """Log an error with optional exception details.
        
        Args:
            error_type: Type/category of error (e.g., "Block Creation", "Snap Handler")
            message: Human-readable error message
            exception: Optional exception object for traceback
            show_dialog: If True, show error dialog to user
        """
        self.error_count += 1
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        error_entry = {
            "timestamp": timestamp,
            "type": error_type,
            "message": message,
            "exception": exception
        }
        self.errors.append(error_entry)
        
        # Print to console
        print(f"\n{'='*80}")
        print(f"ERROR #{self.error_count} [{timestamp}] - {error_type}")
        print(f"{'='*80}")
        print(f"Message: {message}")
        
        if exception:
            print(f"\nException Type: {type(exception).__name__}")
            print(f"Exception Details: {str(exception)}")
            print("\nFull Traceback:")
            traceback.print_exc()
        
        print(f"{'='*80}\n")
        
        if show_dialog:
            try:
                messagebox.showerror(
                    f"Error: {error_type}",
                    f"{message}\n\n{str(exception) if exception else ''}"
                )
            except:
                pass  # Don't let dialog errors crash the app
    
    def log_warning(self, warning_type, message):
        """Log a warning (non-critical issue).
        
        Args:
            warning_type: Type/category of warning
            message: Human-readable warning message
        """
        self.warning_count += 1
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        if self.verbose:
            print(f"\nWARNING [{timestamp}] - {warning_type}")
            print(f"  {message}\n")
    
    def log_info(self, info_type, message):
        """Log informational message for debugging.
        
        Args:
            info_type: Type/category of info
            message: Information message
        """
        if self.verbose:
            timestamp = datetime.now().strftime("%H:%M:%S")
            print(f"INFO [{timestamp}] {info_type}: {message}")
    
    def wrap_function(self, func, error_type):
        """Wrap a function to catch and log exceptions.
        
        Args:
            func: Function to wrap
            error_type: Error category for logging
            
        Returns:
            Wrapped function that logs exceptions
        """
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                self.log_error(
                    error_type,
                    f"Error in {func.__name__}",
                    e,
                    show_dialog=False
                )
                return None
        return wrapper
    
    def get_summary(self):
        """Get summary of logged errors and warnings.
        
        Returns:
            String summary of all logged issues
        """
        summary = f"\n{'='*80}\n"
        summary += f"ERROR SUMMARY\n"
        summary += f"{'='*80}\n"
        summary += f"Total Errors: {self.error_count}\n"
        summary += f"Total Warnings: {self.warning_count}\n"
        summary += f"{'='*80}\n"
        return summary
    
    def print_summary(self):
        """Print error summary to console."""
        print(self.get_summary())


# Global error logger instance
_global_logger = None


def get_logger(verbose=True):
    """Get or create the global error logger instance.
    
    Args:
        verbose: If True, enable verbose logging
        
    Returns:
        ErrorLogger instance
    """
    global _global_logger
    if _global_logger is None:
        _global_logger = ErrorLogger(verbose=verbose)
    return _global_logger


def setup_exception_handler():
    """Set up global exception handler to catch uncaught exceptions."""
    logger = get_logger()
    
    def handle_exception(exc_type, exc_value, exc_traceback):
        """Handle uncaught exceptions."""
        if issubclass(exc_type, KeyboardInterrupt):
            # Allow keyboard interrupt to work normally
            sys.__excepthook__(exc_type, exc_value, exc_traceback)
            return
        
        logger.log_error(
            "Uncaught Exception",
            f"An unexpected error occurred: {exc_value}",
            exc_value,
            show_dialog=True
        )
    
    sys.excepthook = handle_exception


def log_tkinter_errors(root):
    """Set up Tkinter error reporting.
    
    Args:
        root: Tkinter root window
    """
    logger = get_logger()
    
    def report_callback_exception(self, exc_type, exc_value, exc_traceback):
        """Handle Tkinter callback exceptions."""
        logger.log_error(
            "Tkinter Callback Error",
            f"Error in Tkinter callback: {exc_value}",
            exc_value,
            show_dialog=False
        )
    
    tk.Tk.report_callback_exception = report_callback_exception
