"""
Help_System.py

Provides contextual help popups for blocks with usage instructions and examples.
Supports right-click help menu on any block type.
"""

import tkinter as tk
from tkinter import scrolledtext
import json
from pathlib import Path


class HelpSystem:
    """Manages help content and popups for block types."""
    
    def __init__(self, editor):
        """Initialize help system.
        
        Args:
            editor: Reference to BlockEditor instance
        """
        self.editor = editor
        self.help_data = {}
        self.example_data = {}
        self.load_help_data()
        self.load_example_data()
    
    def load_help_data(self):
        """Load help content from JSON file."""
        help_file = Path(__file__).parent.parent / "assets" / "block_help.json"
        try:
            if help_file.exists():
                with open(help_file, 'r', encoding='utf-8') as f:
                    self.help_data = json.load(f)
            else:
                # Default help content
                self.help_data = self._get_default_help()
        except Exception as e:
            print(f"Error loading help data: {e}")
            self.help_data = self._get_default_help()
    
    def load_example_data(self):
        """Load example block layouts from JSON file."""
        example_file = Path(__file__).parent.parent / "assets" / "block_examples.json"
        try:
            if example_file.exists():
                with open(example_file, 'r', encoding='utf-8') as f:
                    self.example_data = json.load(f)
            else:
                # Default examples
                self.example_data = self._get_default_examples()
        except Exception as e:
            print(f"Error loading example data: {e}")
            self.example_data = self._get_default_examples()
    
    def _get_default_help(self):
        """Get default help content for all block types."""
        return {
            "MOD": {
                "title": "MOD Block",
                "description": "The root container for all game logic. Every script must start with a MOD block.",
                "usage": [
                    "All RULES blocks must be placed inside a MOD block",
                    "Can contain multiple RULES and SUBROUTINE blocks",
                    "Defines the scope of your game mode modifications"
                ],
                "snap_info": "Purple snap point on left bar - RULES blocks snap here",
                "tips": [
                    "Start every project with a MOD block",
                    "Organize related RULES into the same MOD",
                    "Use descriptive names for your mod ID"
                ]
            },
            "RULES": {
                "title": "RULES Block",
                "description": "Defines a game rule with CONDITIONS and ACTIONS. Rules execute when their conditions are met.",
                "usage": [
                    "Must be placed inside a MOD block (snap to purple point)",
                    "Can contain CONDITIONS blocks (blue snap point)",
                    "Can contain ACTIONS blocks (yellow snap point)",
                    "Can contain SUBROUTINE blocks (brown snap point)"
                ],
                "snap_info": "Snaps to MOD's purple point. Has blue (CONDITIONS), yellow (ACTIONS), and brown (SUBROUTINE) snap points on left bar",
                "tips": [
                    "Name rules descriptively (e.g., 'OnPlayerSpawn', 'WhenTeamWins')",
                    "Keep rules focused on a single behavior",
                    "Test rules individually before combining"
                ]
            },
            "CONDITIONS": {
                "title": "CONDITIONS Block",
                "description": "Defines when a RULE should execute. All conditions must be true for the rule to activate.",
                "usage": [
                    "Must be placed inside a RULES block (snap to blue point)",
                    "Can contain EVENTS blocks (green snap point at bottom)",
                    "Multiple conditions are evaluated with AND logic"
                ],
                "snap_info": "Snaps to RULES blue point. Has green snap point at bottom for EVENTS",
                "tips": [
                    "Use specific conditions to avoid unnecessary rule firing",
                    "Combine multiple conditions for complex logic",
                    "Test edge cases where conditions might overlap"
                ]
            },
            "ACTIONS": {
                "title": "ACTIONS Block",
                "description": "Defines what happens when a RULE executes. Actions are performed in sequence.",
                "usage": [
                    "Must be placed inside a RULES block (snap to yellow point)",
                    "Can contain up to 3 EVENTS blocks (green snap points inside)",
                    "Actions execute in order from left to right"
                ],
                "snap_info": "Snaps to RULES yellow point. Has 3 green snap points inside block for EVENTS",
                "tips": [
                    "Order matters - actions execute sequentially",
                    "Use wait/delay actions for timing",
                    "Chain multiple ACTIONS blocks for complex sequences",
                    "Block expands to fit more EVENTS (coming soon)"
                ]
            },
            "EVENTS": {
                "title": "EVENTS Block",
                "description": "Specific game events or actions that trigger or execute within CONDITIONS/ACTIONS.",
                "usage": [
                    "Can snap to ACTIONS blocks (green points inside)",
                    "Can snap to CONDITIONS blocks (green point at bottom)",
                    "Defines specific game events (spawn, damage, score, etc.)"
                ],
                "snap_info": "Snaps to green points on ACTIONS or CONDITIONS blocks",
                "tips": [
                    "Choose events that match your rule's purpose",
                    "Some events have parameters you can configure",
                    "Events can be chained together for complex logic"
                ]
            },
            "SUBROUTINE": {
                "title": "SUBROUTINE Block",
                "description": "Reusable logic blocks that can be called from multiple places.",
                "usage": [
                    "Can snap to RULES block (brown snap point)",
                    "Can also snap to MOD block as standalone subroutines",
                    "Acts as a container for reusable rule logic"
                ],
                "snap_info": "Snaps to RULES brown point or MOD block",
                "tips": [
                    "Use for logic that repeats across multiple rules",
                    "Name subroutines clearly to show their purpose",
                    "Keep subroutines focused and modular"
                ]
            }
        }
    
    def _get_default_examples(self):
        """Get default example layouts for block types."""
        return {
            "MOD": {
                "title": "Basic MOD Structure",
                "description": "A simple mod with one rule",
                "layout": [
                    "MOD: 'MyGameMode'",
                    "  └─ RULES: 'OnPlayerSpawn'",
                    "       ├─ CONDITIONS: [Player Spawned]",
                    "       └─ ACTIONS: [Give Weapon, Set Health]"
                ]
            },
            "RULES": {
                "title": "Rule with Multiple Actions",
                "description": "A rule that triggers on player spawn",
                "layout": [
                    "RULES: 'OnPlayerSpawn'",
                    "  ├─ CONDITIONS: [Player Spawned]",
                    "  │    └─ EVENTS: OnSpawn",
                    "  └─ ACTIONS: [Setup Player]",
                    "       ├─ EVENTS: GiveWeapon",
                    "       ├─ EVENTS: SetHealth",
                    "       └─ EVENTS: DisplayMessage"
                ]
            },
            "CONDITIONS": {
                "title": "Multiple Conditions",
                "description": "Conditions that must all be true",
                "layout": [
                    "CONDITIONS: [Player and Team Check]",
                    "  ├─ EVENTS: IsPlayer",
                    "  ├─ EVENTS: TeamEquals(1)",
                    "  └─ EVENTS: HealthAbove(50)"
                ]
            },
            "ACTIONS": {
                "title": "Sequential Actions",
                "description": "Actions that execute in order",
                "layout": [
                    "ACTIONS: [Player Setup]",
                    "  ├─ EVENTS: GiveWeapon('Rifle')",
                    "  ├─ EVENTS: SetHealth(100)",
                    "  └─ EVENTS: TeleportTo(Spawn1)"
                ]
            },
            "EVENTS": {
                "title": "Event with Parameters",
                "description": "Events can have configurable parameters",
                "layout": [
                    "EVENTS: GiveWeapon",
                    "  Parameters:",
                    "    - Weapon: 'AssaultRifle'",
                    "    - Ammo: 300",
                    "    - Attachments: ['Scope', 'Grip']"
                ]
            },
            "SUBROUTINE": {
                "title": "Reusable Subroutine",
                "description": "Common logic used in multiple places",
                "layout": [
                    "SUBROUTINE: 'ResetPlayer'",
                    "  └─ ACTIONS: [Reset Logic]",
                    "       ├─ EVENTS: SetHealth(100)",
                    "       ├─ EVENTS: ClearInventory",
                    "       └─ EVENTS: TeleportToSpawn"
                ]
            }
        }
    
    def show_help(self, block_id):
        """Show help popup for a specific block.
        
        Args:
            block_id: ID of the block to show help for
        """
        if block_id not in self.editor.all_blocks:
            return
        
        block = self.editor.all_blocks[block_id]
        block_type = block.get("type", "UNKNOWN")
        
        # Get help content
        help_content = self.help_data.get(block_type, {
            "title": block_type,
            "description": "No help available for this block type.",
            "usage": [],
            "snap_info": "",
            "tips": []
        })
        
        # Get example content
        example_content = self.example_data.get(block_type, {
            "title": "No examples available",
            "description": "",
            "layout": []
        })
        
        # Create help window
        self._create_help_window(block_type, block.get("label", ""), help_content, example_content)
    
    def _create_help_window(self, block_type, block_label, help_content, example_content):
        """Create and display help window.
        
        Args:
            block_type: Type of block (MOD, RULES, etc.)
            block_label: Label/name of specific block instance
            help_content: Dictionary with help information
            example_content: Dictionary with example layout
        """
        # Create modal window
        help_window = tk.Toplevel(self.editor.master)
        help_window.title(f"Help: {help_content['title']}")
        help_window.geometry("700x600")
        help_window.configure(bg="#1e1e1e")
        
        # Make it modal
        help_window.transient(self.editor.master)
        help_window.grab_set()
        
        # Create notebook/tabbed interface
        notebook_frame = tk.Frame(help_window, bg="#1e1e1e")
        notebook_frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        # Tab buttons
        tab_frame = tk.Frame(notebook_frame, bg="#2d2d2d")
        tab_frame.pack(fill="x", pady=(0, 10))
        
        # Content frame
        content_frame = tk.Frame(notebook_frame, bg="#1e1e1e")
        content_frame.pack(fill="both", expand=True)
        
        # Variables to track active tab
        active_tab = {"current": "usage"}
        
        def show_tab(tab_name):
            """Switch to a different tab."""
            active_tab["current"] = tab_name
            
            # Clear content frame
            for widget in content_frame.winfo_children():
                widget.destroy()
            
            if tab_name == "usage":
                self._create_usage_tab(content_frame, help_content)
            elif tab_name == "examples":
                self._create_examples_tab(content_frame, example_content)
            elif tab_name == "tips":
                self._create_tips_tab(content_frame, help_content)
            
            # Update button styles
            for btn_name, btn in tab_buttons.items():
                if btn_name == tab_name:
                    btn.configure(bg="#4CAF50", fg="white")
                else:
                    btn.configure(bg="#2d2d2d", fg="#aaa")
        
        # Create tab buttons
        tab_buttons = {}
        for tab_name, tab_label in [("usage", "Usage"), ("examples", "Examples"), ("tips", "Tips")]:
            btn = tk.Button(
                tab_frame,
                text=tab_label,
                command=lambda t=tab_name: show_tab(t),
                bg="#2d2d2d",
                fg="#aaa",
                font=("Arial", 10, "bold"),
                bd=0,
                padx=20,
                pady=8
            )
            btn.pack(side="left", padx=2)
            tab_buttons[tab_name] = btn
        
        # Close button
        close_btn = tk.Button(
            help_window,
            text="Close",
            command=help_window.destroy,
            bg="#4CAF50",
            fg="white",
            font=("Arial", 10, "bold"),
            bd=0,
            padx=30,
            pady=10
        )
        close_btn.pack(pady=10)
        
        # Show initial tab
        show_tab("usage")
    
    def _create_usage_tab(self, parent, help_content):
        """Create usage information tab."""
        scroll_frame = scrolledtext.ScrolledText(
            parent,
            wrap="word",
            bg="#2d2d2d",
            fg="white",
            font=("Arial", 11),
            bd=0,
            padx=15,
            pady=15
        )
        scroll_frame.pack(fill="both", expand=True)
        
        # Title
        scroll_frame.insert("end", f"{help_content['title']}\n", "title")
        scroll_frame.insert("end", "=" * 50 + "\n\n", "separator")
        
        # Description
        scroll_frame.insert("end", "Description:\n", "heading")
        scroll_frame.insert("end", f"{help_content['description']}\n\n", "normal")
        
        # Usage
        if help_content.get("usage"):
            scroll_frame.insert("end", "How to Use:\n", "heading")
            for item in help_content["usage"]:
                scroll_frame.insert("end", f"  • {item}\n", "normal")
            scroll_frame.insert("end", "\n", "normal")
        
        # Snap info
        if help_content.get("snap_info"):
            scroll_frame.insert("end", "Snap Points:\n", "heading")
            scroll_frame.insert("end", f"  {help_content['snap_info']}\n\n", "snap")
        
        # Configure tags
        scroll_frame.tag_config("title", font=("Arial", 16, "bold"), foreground="#4CAF50")
        scroll_frame.tag_config("separator", foreground="#555")
        scroll_frame.tag_config("heading", font=("Arial", 12, "bold"), foreground="#2196F3")
        scroll_frame.tag_config("normal", font=("Arial", 11))
        scroll_frame.tag_config("snap", font=("Arial", 11), foreground="#FFEB3B")
        
        scroll_frame.config(state="disabled")
    
    def _create_examples_tab(self, parent, example_content):
        """Create examples tab with visual layout."""
        scroll_frame = scrolledtext.ScrolledText(
            parent,
            wrap="word",
            bg="#2d2d2d",
            fg="white",
            font=("Consolas", 10),
            bd=0,
            padx=15,
            pady=15
        )
        scroll_frame.pack(fill="both", expand=True)
        
        # Title
        scroll_frame.insert("end", f"{example_content['title']}\n", "title")
        scroll_frame.insert("end", "=" * 50 + "\n\n", "separator")
        
        # Description
        if example_content.get("description"):
            scroll_frame.insert("end", f"{example_content['description']}\n\n", "description")
        
        # Layout
        if example_content.get("layout"):
            scroll_frame.insert("end", "Block Layout:\n\n", "heading")
            for line in example_content["layout"]:
                scroll_frame.insert("end", f"{line}\n", "code")
        
        # Configure tags
        scroll_frame.tag_config("title", font=("Arial", 14, "bold"), foreground="#4CAF50")
        scroll_frame.tag_config("separator", foreground="#555")
        scroll_frame.tag_config("heading", font=("Arial", 12, "bold"), foreground="#2196F3")
        scroll_frame.tag_config("description", font=("Arial", 11), foreground="#ccc")
        scroll_frame.tag_config("code", font=("Consolas", 10), foreground="#A5D6A7")
        
        scroll_frame.config(state="disabled")
    
    def _create_tips_tab(self, parent, help_content):
        """Create tips and best practices tab."""
        scroll_frame = scrolledtext.ScrolledText(
            parent,
            wrap="word",
            bg="#2d2d2d",
            fg="white",
            font=("Arial", 11),
            bd=0,
            padx=15,
            pady=15
        )
        scroll_frame.pack(fill="both", expand=True)
        
        # Title
        scroll_frame.insert("end", "Tips & Best Practices\n", "title")
        scroll_frame.insert("end", "=" * 50 + "\n\n", "separator")
        
        # Tips
        if help_content.get("tips"):
            for i, tip in enumerate(help_content["tips"], 1):
                scroll_frame.insert("end", f"{i}. ", "number")
                scroll_frame.insert("end", f"{tip}\n\n", "tip")
        else:
            scroll_frame.insert("end", "No tips available yet.\n", "normal")
        
        # Configure tags
        scroll_frame.tag_config("title", font=("Arial", 14, "bold"), foreground="#4CAF50")
        scroll_frame.tag_config("separator", foreground="#555")
        scroll_frame.tag_config("number", font=("Arial", 11, "bold"), foreground="#FFEB3B")
        scroll_frame.tag_config("tip", font=("Arial", 11), foreground="#ccc")
        scroll_frame.tag_config("normal", font=("Arial", 11), foreground="#888")
        
        scroll_frame.config(state="disabled")
