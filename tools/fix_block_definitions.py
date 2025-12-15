import json
import re
from pathlib import Path

# Configuration
BLOCK_DEFS_PATH = Path('web_ui/src/blocks/bf6portal_expanded.ts')

# --- Categorization of Blocks ---
# These lists are derived from the codebase_investigator analysis
# and general understanding of Blockly block types.

# Blocks that perform actions or control flow. They have previous/next connections.
STATEMENT_BLOCKS = {
    'CONDITION_BLOCK', 'ACTION_BLOCK', 'SUBROUTINE_BLOCK', 'SUBROUTINE_REFERENCE_BLOCK',
    'CONTROL_ACTION_BLOCK', 'SETAIBEHAVIOR', 'DEPLOYAI', 'DESPAWNAI',
    'SETAISPAWNLOCATION', 'SETAIHEALTH', 'SETAITEAM', 'AIBATTLEFIELDBEHAVIOR',
    'AIDEFENDPOSITIONBEHAVIOR', 'AIIDLEBEHAVIOR', 'AIMOVETOBEHAVIOR',
    'AIPARACHUTEBEHAVIOR', 'AIWAYPOINTIDLEBEHAVIOR', 'AIFOLLOWPLAYER',
    'AIHOLDPOSITION', 'AIATTACKTARGET', 'AIVALIDATEMOVETOBEHAVIOUR',
    'AILOSMOVETOBEHAVIOUR', # AI BEHAVIOUR (UK spelling)
    'CREATEARRAY', 'SETELEMENT', 'APPENDTOARRAY', 'REMOVEFROMARRAY',
    'SORTARRAY', 'LOADMUSIC', 'PLAYMUSIC', 'SETMUSICPARAM', 'UNLOADMUSIC',
    'PLAYSOUND', 'PLAYVO', 'STOPSOUND', 'SETPLAYERCAMERA', 'LOCKCAMERATOTARGET',
    'CAMERASHAKE', 'SETCAMERAFOV', 'RESETCAMERA', 'PLAYEFFECT', 'STOPEFFECT',
    'PARTICLEEFFECT', 'EXPLOSIONEFFECT', 'SCREENFLASH', 'SCREENFADE',
    'APPLYSCREENFILTER', 'DEPLOYEMPLACEMENT', 'ON_START', 'ON_PLAYER_JOIN',
    'ENDROUND', 'PAUSEROUND', 'SETGAMEMODE', 'ENABLEFRIENDLYFIRE', 'SETSCORE',
    'SETTIMELIMIT', 'IF', 'WHILE', 'FORVARIABLE', 'WAIT', 'WAITUNTIL', 'BREAK',
    'CONTINUE', 'COMMENT', 'TELEPORTPLAYER', 'KILLPLAYER', 'SETPLAYERTEAM',
    'SETPLAYERHEALTH', 'SETPLAYERLOADOUT', 'SHOWMESSAGE', 'SHOWBIGMESSAGE',
    'SHOWNOTIFICATION', 'SETHUDVISIBLE', 'UPDATEHUDTEXT', 'UPDATESCOREBOARD',
    'SHOWSCOREBOARD', 'CREATECUSTOMHUD', 'CREATEWORLDMARKER', 'REMOVEWORLDMARKER',
    'SETOBJECTIVEMARKER', 'SETOBJECTIVESTATE', 'SET_SCOREBOARD_COLUMN_WIDTHS'
}

# Blocks that return a value to be plugged into other blocks. They have an output connection.
VALUE_BLOCKS = {
    'GETAIHEALTH', 'GETAITEAM', 'AIISALIVE', 'ARRAYLENGTH', 'GETELEMENT',
    'FINDFIRST', 'FIRSTPERSONCAMERA', 'THIRDPERSONCAMERA', 'FREECAMERA',
    'SPECTATORCAMERA', 'GETGAMEMODE', 'GETSCORE', 'GETTIMELIMIT',
    'EVENTATTACKER', 'EVENTDAMAGE', 'EVENTLOCATION', 'EVENTPLAYER',
    'EVENTTEAM', 'EVENTVICTIM', 'EVENTWEAPON', 'EQUAL', 'NOTEQUAL',
    'LESSTHAN', 'GREATERTHAN', 'LESSTHANOREQUAL', 'GREATERTHANEQUAL',
    'AND', 'OR', 'NOT', 'TRUE', 'FALSE', 'ADD', 'SUBTRACT', 'MULTIPLY',
    'DIVIDE', 'POWER', 'SQUAREROOT', 'ABSOLUTE', 'MODULO', 'VECTOR',
    'VECTORTOWARDS', 'DOTPRODUCT', 'CROSSPRODUCT', 'NORMALIZE',
    'VECTORMAGNITUDE', 'DISTANCEBETWEEN', 'XCOMPONENTOF', 'YCOMPONENTOF',
    'ZCOMPONENTOF', 'UP', 'DOWN', 'LEFT', 'RIGHT', 'FORWARD', 'BACKWARD',
    'GETOBJECTIVESTATE', 'GETPLAYERBYID', 'GETPLAYERNAME', 'GETPLAYERHEALTH',
    'GETPLAYERTEAM', 'VEHICLETYPEAPC', 'VEHICLETYPEHELICOPTER', 'VEHICLETYPEJET',
    'VEHICLETYPETANK', 'VEHICLETYPETRANSPORT', 'GETVEHICLEDRIVER', 'NUMBER',
    'STRING', 'BOOLEAN', 'GETVARIABLE', 'VEHICLE_LIST_ITEM'
}

# Ensure there's no overlap (for debugging/validation)
OVERLAP = STATEMENT_BLOCKS.intersection(VALUE_BLOCKS)
if OVERLAP:
    print(f"WARNING: Overlap found between STATEMENT_BLOCKS and VALUE_BLOCKS: {OVERLAP}")

def fix_block_definitions():
    """Reads bf6portal_expanded.ts, corrects block definitions, and writes back."""
    try:
        with open(BLOCK_DEFS_PATH, 'r', encoding='utf-8') as f:
            content = f.read()

        start_wrapper = """export const bf6PortalExpandedBlocks = Blockly.common.createBlockDefinitionsFromJsonArray(["""
        end_wrapper = """]);"""
        
        start_index = content.find(start_wrapper)
        end_index = content.rfind(end_wrapper)
        
        if start_index == -1 or end_index == -1:
            print("Error: Could not find TypeScript wrapper in bf6portal_expanded.ts")
            return
            
        json_array_str_raw = content[start_index + len(start_wrapper) : end_index].strip()
        
        # Split the string into individual block definitions
        # This is a bit heuristic, assuming blocks are separated by '}, {' or just '},'
        block_defs_str = re.findall(r'\{(?:[^\{\}]*|\{[^\{\}]*\})*?\}', json_array_str_raw, re.DOTALL)
        
        corrected_blocks = []
        for block_str in block_defs_str:
            try:
                block_json = json.loads(block_str)
                block_type = block_json.get('type')

                if block_type in VALUE_BLOCKS:
                    # Make it a Value block
                    block_json['output'] = block_type # Or infer more specific types later
                    block_json.pop('previousStatement', None)
                    block_json.pop('nextStatement', None)
                elif block_type in STATEMENT_BLOCKS:
                    # Make it a Statement block (ensure no output)
                    block_json.pop('output', None)
                    if 'previousStatement' not in block_json:
                         block_json['previousStatement'] = None
                    if 'nextStatement' not in block_json:
                        block_json['nextStatement'] = None
                
                corrected_blocks.append(block_json)

            except json.JSONDecodeError as e:
                print(f"Warning: Could not decode block JSON: {block_str[:100]}... Error: {e}")
            except Exception as e:
                print(f"Error processing block {block_str[:50]}...: {e}")

        # Reconstruct the file content
        new_json_array_str = "\n".join(json.dumps(b, indent=2) for b in corrected_blocks)
        new_content = f"{start_wrapper}\n{new_json_array_str}\n{end_wrapper}\n"

        with open(BLOCK_DEFS_PATH, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Successfully updated {BLOCK_DEFS_PATH} with corrected block definitions.")

    except Exception as e:
        print(f"Error in fix_block_definitions: {e}")

if __name__ == "__main__":
    # Small test to verify the lists
    print(f"Total Statement Blocks: {len(STATEMENT_BLOCKS)}")
    print(f"Total Value Blocks: {len(VALUE_BLOCKS)}")
    
    # Run the fix
    fix_block_definitions()
