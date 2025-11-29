# Important Decisions

- Web UI and Blockly are now the primary interface; legacy Tkinter is legacy only.
- All controls must be vertically stacked and centered for clarity and usability.
- Splash/boot and blockly desktop logic/styles must remain separate to avoid interference.
- Ticker must cycle quirky, community-driven comments on splash screen.
- Error/status reporting must be robust and visible in both splash and main UI.
- VS Code workspace is configured to autoload the web UI server and open the browser on start.
- Persistent session summaries and chat notes are now stored in /memories and knowledgebase/session_db.
- Documentation and UI mockups must always reflect the current UI state and load order.
- All future changes should reference the master prompt and session_db for context.
