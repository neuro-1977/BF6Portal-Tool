window.TOOLBOX_CONFIG = {
  "kind": "categoryToolbox",
  "contents": [
    {
      "kind": "category",
      "name": "Home",
      "colour": "#333333",
      "contents": [
        {
          "kind": "category",
          "name": "Logic",
          "categorystyle": "logic_category",
          "contents": [
            {
              "kind": "block",
              "type": "controls_if"
            },
            {
              "kind": "block",
              "type": "logic_compare"
            },
            {
              "kind": "block",
              "type": "logic_operation"
            },
            {
              "kind": "block",
              "type": "logic_negate"
            },
            {
              "kind": "block",
              "type": "logic_boolean"
            },
            {
              "kind": "block",
              "type": "logic_null",
              "disabled": "true"
            },
            {
              "kind": "block",
              "type": "logic_ternary"
            }
          ]
        },
        {
          "kind": "category",
          "name": "Loops",
          "categorystyle": "loop_category",
          "contents": [
            {
              "kind": "block",
              "type": "controls_repeat_ext",
              "inputs": {
                "TIMES": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 10
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "controls_repeat",
              "disabled": "true"
            },
            {
              "kind": "block",
              "type": "controls_whileUntil"
            },
            {
              "kind": "block",
              "type": "controls_for",
              "inputs": {
                "FROM": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 1
                    }
                  }
                },
                "TO": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 10
                    }
                  }
                },
                "BY": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 1
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "controls_forEach"
            },
            {
              "kind": "block",
              "type": "controls_flow_statements"
            }
          ]
        },
        {
          "kind": "category",
          "name": "Math",
          "categorystyle": "math_category",
          "contents": [
            {
              "kind": "block",
              "type": "math_number",
              "fields": {
                "NUM": 123
              }
            },
            {
              "kind": "block",
              "type": "math_arithmetic",
              "inputs": {
                "A": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 1
                    }
                  }
                },
                "B": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 1
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "math_single",
              "inputs": {
                "NUM": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 9
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "math_trig",
              "inputs": {
                "NUM": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 45
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "math_constant"
            },
            {
              "kind": "block",
              "type": "math_number_property",
              "inputs": {
                "NUMBER_TO_CHECK": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 0
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "math_round",
              "inputs": {
                "NUM": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 3.1
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "math_on_list"
            },
            {
              "kind": "block",
              "type": "math_modulo",
              "inputs": {
                "DIVIDEND": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 64
                    }
                  }
                },
                "DIVISOR": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 10
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "math_constrain",
              "inputs": {
                "VALUE": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 50
                    }
                  }
                },
                "LOW": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 1
                    }
                  }
                },
                "HIGH": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 100
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "math_random_int",
              "inputs": {
                "FROM": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 1
                    }
                  }
                },
                "TO": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 100
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "math_random_float"
            },
            {
              "kind": "block",
              "type": "math_atan2",
              "inputs": {
                "X": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 1
                    }
                  }
                },
                "Y": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 1
                    }
                  }
                }
              }
            }
          ]
        },
        {
          "kind": "category",
          "name": "Text",
          "categorystyle": "text_category",
          "contents": [
            {
              "kind": "block",
              "type": "text"
            },
            {
              "kind": "block",
              "type": "text_join"
            },
            {
              "kind": "block",
              "type": "text_append",
              "inputs": {
                "TEXT": {
                  "shadow": {
                    "type": "text"
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "text_length",
              "inputs": {
                "VALUE": {
                  "shadow": {
                    "type": "text",
                    "fields": {
                      "TEXT": "abc"
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "text_isEmpty",
              "inputs": {
                "VALUE": {
                  "shadow": {
                    "type": "text",
                    "fields": {
                      "TEXT": ""
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "text_indexOf",
              "inputs": {
                "VALUE": {
                  "block": {
                    "type": "text",
                    "fields": {
                      "TEXT": "abc"
                    }
                  }
                },
                "FIND": {
                  "shadow": {
                    "type": "text",
                    "fields": {
                      "TEXT": "b"
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "text_charAt",
              "inputs": {
                "VALUE": {
                  "block": {
                    "type": "text",
                    "fields": {
                      "TEXT": "abc"
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "text_getSubstring",
              "inputs": {
                "STRING": {
                  "block": {
                    "type": "text",
                    "fields": {
                      "TEXT": "abc"
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "text_changeCase",
              "inputs": {
                "TEXT": {
                  "shadow": {
                    "type": "text",
                    "fields": {
                      "TEXT": "abc"
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "text_trim",
              "inputs": {
                "TEXT": {
                  "shadow": {
                    "type": "text",
                    "fields": {
                      "TEXT": "abc"
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "text_print",
              "inputs": {
                "TEXT": {
                  "shadow": {
                    "type": "text",
                    "fields": {
                      "TEXT": "abc"
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "text_prompt_ext",
              "inputs": {
                "TEXT": {
                  "shadow": {
                    "type": "text",
                    "fields": {
                      "TEXT": "abc"
                    }
                  }
                }
              }
            }
          ]
        },
        {
          "kind": "category",
          "name": "Lists",
          "categorystyle": "list_category",
          "contents": [
            {
              "kind": "block",
              "type": "lists_create_with",
              "mutation": {
                "items": "0"
              }
            },
            {
              "kind": "block",
              "type": "lists_create_with"
            },
            {
              "kind": "block",
              "type": "lists_repeat",
              "inputs": {
                "NUM": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 5
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "lists_length"
            },
            {
              "kind": "block",
              "type": "lists_isEmpty"
            },
            {
              "kind": "block",
              "type": "lists_indexOf"
            },
            {
              "kind": "block",
              "type": "lists_getIndex"
            },
            {
              "kind": "block",
              "type": "lists_setIndex"
            },
            {
              "kind": "block",
              "type": "lists_getSublist"
            },
            {
              "kind": "block",
              "type": "lists_split",
              "inputs": {
                "DELIM": {
                  "shadow": {
                    "type": "text",
                    "fields": {
                      "TEXT": ","
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "lists_sort"
            }
          ]
        },
        {
          "kind": "category",
          "name": "Colour",
          "categorystyle": "colour_category",
          "contents": [
            {
              "kind": "block",
              "type": "colour_picker"
            },
            {
              "kind": "block",
              "type": "colour_random"
            },
            {
              "kind": "block",
              "type": "colour_rgb",
              "inputs": {
                "RED": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 100
                    }
                  }
                },
                "GREEN": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 50
                    }
                  }
                },
                "BLUE": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 0
                    }
                  }
                }
              }
            },
            {
              "kind": "block",
              "type": "colour_blend",
              "inputs": {
                "COLOUR1": {
                  "shadow": {
                    "type": "colour_picker",
                    "fields": {
                      "COLOUR": "#ff0000"
                    }
                  }
                },
                "COLOUR2": {
                  "shadow": {
                    "type": "colour_picker",
                    "fields": {
                      "COLOUR": "#3333ff"
                    }
                  }
                },
                "RATIO": {
                  "shadow": {
                    "type": "math_number",
                    "fields": {
                      "NUM": 0.5
                    }
                  }
                }
              }
            }
          ]
        },
        {
          "kind": "sep"
        },
        {
          "kind": "category",
          "name": "Variables",
          "categorystyle": "variable_category",
          "custom": "VARIABLE",
          "contents": [
            {
              "kind": "button",
              "text": "Manage Variables",
              "callbackkey": "manageVariables"
            }
          ]
        },
        {
          "kind": "category",
          "name": "Functions",
          "categorystyle": "procedure_category",
          "custom": "PROCEDURE"
        }
      ]
    },
    {
      "kind": "category",
      "name": "BF6 Portal",
      "contents": [
        {
          "kind": "category",
          "name": "ACTIONS",
          "categorystyle": "actions_category",
          "contents": [
            {
              "kind": "category",
              "name": "AI",
              "categorystyle": "actions_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "AIBATTLEFIELDBEHAVIOUR"
                },
                {
                  "kind": "block",
                  "type": "AIDEFENDPOSITIONBEHAVIOUR"
                },
                {
                  "kind": "block",
                  "type": "AIIDLEBEHAVIOUR"
                },
                {
                  "kind": "block",
                  "type": "AILOSMOVETOBEHAVIOUR"
                },
                {
                  "kind": "block",
                  "type": "AIMOVETOBEHAVIOUR"
                },
                {
                  "kind": "block",
                  "type": "AIPARACHUTEBEHAVIOUR"
                },
                {
                  "kind": "block",
                  "type": "AIVALIDATEMOVETOBEHAVIOUR"
                },
                {
                  "kind": "block",
                  "type": "AIWAYPOINTIDLEBEHAVIOUR"
                }
              ]
            },
            {
              "kind": "category",
              "name": "Player",
              "categorystyle": "actions_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "SETPLAYERHEALTH"
                },
                {
                  "kind": "block",
                  "type": "SETPLAYERLOADOUT"
                },
                {
                  "kind": "block",
                  "type": "TELEPORT"
                }
              ]
            },
            {
              "kind": "category",
              "name": "Game",
              "categorystyle": "actions_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "ENDROUND"
                },
                {
                  "kind": "block",
                  "type": "PAUSEROUND"
                }
              ]
            },
            {
              "kind": "block",
              "type": "ACTION_BLOCK"
            },
            {
              "kind": "block",
              "type": "CONTROL_ACTION_BLOCK"
            }
          ]
        },
        {
          "kind": "category",
          "name": "AI",
          "categorystyle": "ai_category",
          "contents": [
            {
              "kind": "category",
              "name": "BEHAVIOR",
              "categorystyle": "ai_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "AIBATTLEFIELDBEHAVIOR"
                },
                {
                  "kind": "block",
                  "type": "AIDEFENDPOSITIONBEHAVIOR"
                },
                {
                  "kind": "block",
                  "type": "AIIDLEBEHAVIOR"
                },
                {
                  "kind": "block",
                  "type": "AIMOVETOBEHAVIOR"
                },
                {
                  "kind": "block",
                  "type": "AIPARACHUTEBEHAVIOR"
                },
                {
                  "kind": "block",
                  "type": "AIWAYPOINTIDLEBEHAVIOR"
                },
                {
                  "kind": "block",
                  "type": "AIFOLLOWPLAYER"
                },
                {
                  "kind": "block",
                  "type": "AIHOLDPOSITION"
                },
                {
                  "kind": "block",
                  "type": "AIATTACKTARGET"
                },
                {
                  "kind": "block",
                  "type": "SETAIBEHAVIOR"
                }
              ]
            },
            {
              "kind": "category",
              "name": "SPAWNING",
              "categorystyle": "ai_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "DEPLOYAI"
                },
                {
                  "kind": "block",
                  "type": "DESPAWNAI"
                },
                {
                  "kind": "block",
                  "type": "SETAISPAWNLOCATION"
                }
              ]
            },
            {
              "kind": "category",
              "name": "STATE",
              "categorystyle": "ai_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "SETAIHEALTH"
                },
                {
                  "kind": "block",
                  "type": "SETAITEAM"
                },
                {
                  "kind": "block",
                  "type": "GETAIHEALTH"
                },
                {
                  "kind": "block",
                  "type": "GETAITEAM"
                },
                {
                  "kind": "block",
                  "type": "AIISALIVE"
                }
              ]
            }
          ]
        },
        {
          "kind": "category",
          "name": "ARRAYS",
          "categorystyle": "arrays_category",
          "contents": [
            {
              "kind": "block",
              "type": "CREATEARRAY"
            },
            {
              "kind": "block",
              "type": "ARRAYLENGTH"
            },
            {
              "kind": "block",
              "type": "GETELEMENT"
            },
            {
              "kind": "block",
              "type": "SETELEMENT"
            },
            {
              "kind": "block",
              "type": "APPENDTOARRAY"
            },
            {
              "kind": "block",
              "type": "REMOVEFROMARRAY"
            },
            {
              "kind": "block",
              "type": "FINDFIRST"
            },
            {
              "kind": "block",
              "type": "SORTARRAY"
            }
          ]
        },
        {
          "kind": "category",
          "name": "AUDIO",
          "categorystyle": "audio_category",
          "contents": [
            {
              "kind": "category",
              "name": "GENERAL",
              "categorystyle": "audio_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "LOADMUSIC"
                },
                {
                  "kind": "block",
                  "type": "PLAYMUSIC"
                },
                {
                  "kind": "block",
                  "type": "SETMUSICPARAM"
                },
                {
                  "kind": "block",
                  "type": "UNLOADMUSIC"
                },
                {
                  "kind": "block",
                  "type": "PLAYSOUND"
                },
                {
                  "kind": "block",
                  "type": "PLAYVO"
                },
                {
                  "kind": "block",
                  "type": "STOPSOUND"
                }
              ]
            }
          ]
        },
        {
          "kind": "category",
          "name": "CAMERA",
          "categorystyle": "camera_category",
          "contents": [
            {
              "kind": "category",
              "name": "Camera Control",
              "categorystyle": "camera_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "SETPLAYERCAMERA"
                },
                {
                  "kind": "block",
                  "type": "LOCKCAMERATOTARGET"
                },
                {
                  "kind": "block",
                  "type": "CAMERASHAKE"
                },
                {
                  "kind": "block",
                  "type": "SETCAMERAFOV"
                },
                {
                  "kind": "block",
                  "type": "RESETCAMERA"
                }
              ]
            },
            {
              "kind": "category",
              "name": "Camera Modes",
              "categorystyle": "camera_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "FIRSTPERSONCAMERA"
                },
                {
                  "kind": "block",
                  "type": "THIRDPERSONCAMERA"
                },
                {
                  "kind": "block",
                  "type": "FREECAMERA"
                },
                {
                  "kind": "block",
                  "type": "SPECTATORCAMERA"
                }
              ]
            }
          ]
        },
        {
          "kind": "category",
          "name": "CONDITIONS",
          "categorystyle": "conditions_category",
          "contents": [
            {
              "kind": "category",
              "name": "Comparisons",
              "categorystyle": "conditions_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "EQUAL"
                },
                {
                  "kind": "block",
                  "type": "NOTEQUAL"
                },
                {
                  "kind": "block",
                  "type": "LESSTHAN"
                },
                {
                  "kind": "block",
                  "type": "LESSTHANOREQUAL"
                },
                {
                  "kind": "block",
                  "type": "GREATERTHAN"
                },
                {
                  "kind": "block",
                  "type": "GREATERTHANOREQUAL"
                }
              ]
            },
            {
              "kind": "block",
              "type": "CONDITION_BLOCK"
            }
          ]
        },
        {
          "kind": "category",
          "name": "EFFECTS",
          "categorystyle": "effects_category",
          "contents": [
            {
              "kind": "category",
              "name": "Visual Effects",
              "categorystyle": "effects_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "PLAYEFFECT"
                },
                {
                  "kind": "block",
                  "type": "STOPEFFECT"
                },
                {
                  "kind": "block",
                  "type": "PARTICLEEFFECT"
                },
                {
                  "kind": "block",
                  "type": "EXPLOSIONEFFECT"
                }
              ]
            },
            {
              "kind": "category",
              "name": "Screen Effects",
              "categorystyle": "effects_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "SCREENFLASH"
                },
                {
                  "kind": "block",
                  "type": "SCREENFADE"
                },
                {
                  "kind": "block",
                  "type": "APPLYSCREENFILTER"
                }
              ]
            }
          ]
        },
        {
          "kind": "category",
          "name": "EMPLACEMENTS",
          "categorystyle": "emplacements_category",
          "contents": [
            {
              "kind": "category",
              "name": "GENERAL",
              "categorystyle": "emplacements_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "DEPLOYEMPLACEMENT"
                }
              ]
            }
          ]
        },
        {
          "kind": "category",
          "name": "EVENTS",
          "categorystyle": "events_category",
          "contents": [
            {
              "kind": "category",
              "name": "Game Events",
              "categorystyle": "events_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "ON_START"
                },
                {
                  "kind": "block",
                  "type": "ON_PLAYER_JOIN"
                }
              ]
            },
            {
              "kind": "category",
              "name": "Event Payloads",
              "categorystyle": "events_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "EVENTATTACKER"
                },
                {
                  "kind": "block",
                  "type": "EVENTDAMAGE"
                },
                {
                  "kind": "block",
                  "type": "EVENTLOCATION"
                },
                {
                  "kind": "block",
                  "type": "EVENTPLAYER"
                },
                {
                  "kind": "block",
                  "type": "EVENTTEAM"
                },
                {
                  "kind": "block",
                  "type": "EVENTVICTIM"
                },
                {
                  "kind": "block",
                  "type": "EVENTWEAPON"
                }
              ]
            }
          ]
        },
        {
          "kind": "category",
          "name": "GAMEPLAY",
          "categorystyle": "gameplay_category",
          "contents": [
            {
              "kind": "block",
              "type": "ENDROUND"
            },
            {
              "kind": "block",
              "type": "GETGAMEMODE"
            },
            {
              "kind": "block",
              "type": "SETGAMEMODE"
            },
            {
              "kind": "block",
              "type": "ENABLEFRIENDLYFIRE"
            },
            {
              "kind": "block",
              "type": "SETSCORE"
            },
            {
              "kind": "block",
              "type": "GETSCORE"
            },
            {
              "kind": "block",
              "type": "SETTIMELIMIT"
            },
            {
              "kind": "block",
              "type": "GETTIMELIMIT"
            }
          ]
        },
        {
          "kind": "category",
          "name": "LOGIC",
          "categorystyle": "logic_category",
          "contents": [
            {
              "kind": "category",
              "name": "Control Flow",
              "categorystyle": "logic_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "WAIT"
                },
                {
                  "kind": "block",
                  "type": "WAITUNTIL"
                },
                {
                  "kind": "block",
                  "type": "BREAK"
                },
                {
                  "kind": "block",
                  "type": "CONTINUE"
                },
                {
                  "kind": "block",
                  "type": "IF"
                },
                {
                  "kind": "block",
                  "type": "WHILE"
                }
              ]
            },
            {
              "kind": "category",
              "name": "Boolean Logic",
              "categorystyle": "logic_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "AND"
                },
                {
                  "kind": "block",
                  "type": "OR"
                },
                {
                  "kind": "block",
                  "type": "NOT"
                },
                {
                  "kind": "block",
                  "type": "TRUE"
                },
                {
                  "kind": "block",
                  "type": "FALSE"
                }
              ]
            },
            {
              "kind": "category",
              "name": "Comparison",
              "categorystyle": "logic_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "EQUAL"
                },
                {
                  "kind": "block",
                  "type": "NOTEQUAL"
                },
                {
                  "kind": "block",
                  "type": "GREATERTHAN"
                },
                {
                  "kind": "block",
                  "type": "LESSTHAN"
                },
                {
                  "kind": "block",
                  "type": "GREATERTHANEQUAL"
                },
                {
                  "kind": "block",
                  "type": "LESSTHANEQUAL"
                }
              ]
            },
            {
              "kind": "category",
              "name": "Loops",
              "categorystyle": "logic_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "FORVARIABLE"
                }
              ]
            }
          ]
        },
        {
          "kind": "category",
          "name": "MATH",
          "categorystyle": "math_category",
          "contents": [
            {
              "kind": "block",
              "type": "ADD"
            },
            {
              "kind": "block",
              "type": "SUBTRACT"
            },
            {
              "kind": "block",
              "type": "MULTIPLY"
            },
            {
              "kind": "block",
              "type": "DIVIDE"
            },
            {
              "kind": "block",
              "type": "POWER"
            },
            {
              "kind": "block",
              "type": "SQUAREROOT"
            },
            {
              "kind": "block",
              "type": "ABSOLUTE"
            },
            {
              "kind": "block",
              "type": "MODULO"
            }
          ]
        },
        {
          "kind": "category",
          "name": "MOD",
          "categorystyle": "mod_category",
          "contents": [
            {
              "kind": "category",
              "name": "Game Mode",
              "categorystyle": "mod_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "MOD_BLOCK"
                }
              ]
            },
            {
              "kind": "block",
              "type": "MOD_BLOCK"
            }
          ]
        },
        {
          "kind": "category",
          "name": "OBJECTIVE",
          "categorystyle": "objective_category",
          "contents": [
            {
              "kind": "category",
              "name": "GENERAL",
              "categorystyle": "objective_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "SETOBJECTIVESTATE"
                },
                {
                  "kind": "block",
                  "type": "GETOBJECTIVESTATE"
                }
              ]
            }
          ]
        },
        {
          "kind": "category",
          "name": "OTHER",
          "categorystyle": "other_category",
          "contents": [
            {
              "kind": "category",
              "name": "GENERAL",
              "categorystyle": "other_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "COMMENT"
                }
              ]
            }
          ]
        },
        {
          "kind": "category",
          "name": "PLAYER",
          "categorystyle": "player_category",
          "contents": [
            {
              "kind": "block",
              "type": "GETPLAYERBYID"
            },
            {
              "kind": "block",
              "type": "GETPLAYERNAME"
            },
            {
              "kind": "block",
              "type": "GETPLAYERHEALTH"
            },
            {
              "kind": "block",
              "type": "SETPLAYERHEALTH"
            },
            {
              "kind": "block",
              "type": "TELEPORTPLAYER"
            },
            {
              "kind": "block",
              "type": "KILLPLAYER"
            },
            {
              "kind": "block",
              "type": "GETPLAYERTEAM"
            },
            {
              "kind": "block",
              "type": "SETPLAYERTEAM"
            }
          ]
        },
        {
          "kind": "category",
          "name": "RULES",
          "categorystyle": "rules_category",
          "contents": [
            {
              "kind": "category",
              "name": "Rule Definition",
              "categorystyle": "rules_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "RULE_HEADER"
                }
              ]
            },
            {
              "kind": "block",
              "type": "RULE_HEADER"
            },
            {
              "kind": "block",
              "type": "CONDITION_BLOCK"
            }
          ]
        },
        {
          "kind": "category",
          "name": "SUBROUTINE",
          "categorystyle": "subroutine_category",
          "contents": [
            {
              "kind": "category",
              "name": "Subroutine Definition",
              "categorystyle": "subroutine_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "SUBROUTINE_BLOCK"
                }
              ]
            },
            {
              "kind": "category",
              "name": "Call Subroutine",
              "categorystyle": "subroutine_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "CALLSUBROUTINE"
                },
                {
                  "kind": "block",
                  "type": "RETURN"
                }
              ]
            }
          ]
        },
        {
          "kind": "category",
          "name": "TRANSFORM",
          "categorystyle": "transform_category",
          "contents": [
            {
              "kind": "category",
              "name": "Position",
              "categorystyle": "transform_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "VECTOR"
                },
                {
                  "kind": "block",
                  "type": "VECTORTOWARDS"
                },
                {
                  "kind": "block",
                  "type": "DISTANCEBETWEEN"
                },
                {
                  "kind": "block",
                  "type": "XCOMPONENTOF"
                },
                {
                  "kind": "block",
                  "type": "YCOMPONENTOF"
                },
                {
                  "kind": "block",
                  "type": "ZCOMPONENTOF"
                }
              ]
            },
            {
              "kind": "category",
              "name": "Vector Operations",
              "categorystyle": "transform_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "NORMALIZE"
                },
                {
                  "kind": "block",
                  "type": "DOTPRODUCT"
                },
                {
                  "kind": "block",
                  "type": "CROSSPRODUCT"
                },
                {
                  "kind": "block",
                  "type": "VECTORMAGNITUDE"
                }
              ]
            },
            {
              "kind": "category",
              "name": "Directions",
              "categorystyle": "transform_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "UP"
                },
                {
                  "kind": "block",
                  "type": "DOWN"
                },
                {
                  "kind": "block",
                  "type": "LEFT"
                },
                {
                  "kind": "block",
                  "type": "RIGHT"
                },
                {
                  "kind": "block",
                  "type": "FORWARD"
                },
                {
                  "kind": "block",
                  "type": "BACKWARD"
                }
              ]
            }
          ]
        },
        {
          "kind": "category",
          "name": "UI",
          "categorystyle": "ui_category",
          "contents": [
            {
              "kind": "category",
              "name": "Messages",
              "categorystyle": "ui_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "SHOWMESSAGE"
                },
                {
                  "kind": "block",
                  "type": "SHOWBIGMESSAGE"
                },
                {
                  "kind": "block",
                  "type": "SHOWNOTIFICATION"
                }
              ]
            },
            {
              "kind": "category",
              "name": "HUD Elements",
              "categorystyle": "ui_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "SETHUDVISIBLE"
                },
                {
                  "kind": "block",
                  "type": "UPDATEHUDTEXT"
                },
                {
                  "kind": "block",
                  "type": "CREATECUSTOMHUD"
                }
              ]
            },
            {
              "kind": "category",
              "name": "Indicators",
              "categorystyle": "ui_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "CREATEWORLDMARKER"
                },
                {
                  "kind": "block",
                  "type": "REMOVEWORLDMARKER"
                },
                {
                  "kind": "block",
                  "type": "SETOBJECTIVEMARKER"
                }
              ]
            },
            {
              "kind": "category",
              "name": "Scoreboard",
              "categorystyle": "ui_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "UPDATESCOREBOARD"
                },
                {
                  "kind": "block",
                  "type": "SHOWSCOREBOARD"
                }
              ]
            }
          ]
        },
        {
          "kind": "category",
          "contents": [
            {
              "kind": "block",
              "type": "NUMBER"
            },
            {
              "kind": "block",
              "type": "STRING"
            },
            {
              "kind": "block",
              "type": "BOOLEAN"
            }
          ]
        },
        {
          "kind": "category",
          "name": "VARIABLES (BF6)",
          "categorystyle": "variables_category",
          "contents": [
            {
              "kind": "block",
              "type": "SETVARIABLE"
            },
            {
              "kind": "block",
              "type": "GETVARIABLE"
            }
          ]
        },
        {
          "kind": "category",
          "name": "VEHICLES",
          "categorystyle": "vehicles_category",
          "contents": [
            {
              "kind": "category",
              "name": "Vehicle Spawning",
              "categorystyle": "vehicles_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "SPAWNVEHICLE"
                },
                {
                  "kind": "block",
                  "type": "DESPAWNVEHICLE"
                }
              ]
            },
            {
              "kind": "category",
              "name": "Vehicle Types",
              "categorystyle": "vehicles_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "VEHICLETYPETANK"
                },
                {
                  "kind": "block",
                  "type": "VEHICLETYPEAPC"
                },
                {
                  "kind": "block",
                  "type": "VEHICLETYPEHELICOPTER"
                },
                {
                  "kind": "block",
                  "type": "VEHICLETYPEJET"
                },
                {
                  "kind": "block",
                  "type": "VEHICLETYPETRANSPORT"
                }
              ]
            },
            {
              "kind": "category",
              "name": "Vehicle Properties",
              "categorystyle": "vehicles_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "GETVEHICLEHEALTH"
                },
                {
                  "kind": "block",
                  "type": "SETVEHICLEHEALTH"
                },
                {
                  "kind": "block",
                  "type": "GETVEHICLEDRIVER"
                },
                {
                  "kind": "block",
                  "type": "EJECTFROMVEHICLE"
                },
                {
                  "kind": "block",
                  "type": "LOCKVEHICLE"
                }
              ]
            },
            {
              "kind": "category",
              "name": "Vehicle Control",
              "categorystyle": "vehicles_category",
              "contents": [
                {
                  "kind": "block",
                  "type": "SETVEHICLESPEED"
                },
                {
                  "kind": "block",
                  "type": "DISABLEVEHICLE"
                },
                {
                  "kind": "block",
                  "type": "ENABLEVEHICLE"
                }
              ]
            }
          ]
        },
        {
          "kind": "category",
          "name": "SUBROUTINES",
          "categorystyle": "subroutines_category",
          "contents": [
            {
              "kind": "block",
              "type": "SUBROUTINE_BLOCK"
            },
            {
              "kind": "block",
              "type": "SUBROUTINE_REFERENCE_BLOCK"
            }
          ]
        }
      ]
    }
  ]
};