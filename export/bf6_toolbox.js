var TOOLBOX_CONFIG = {
  "kind": "categoryToolbox",
  "contents": [
  {
    "kind": "category",
    "name": "Actions",
    "colour": "#F9A825",
    "contents": [
      {
        "kind": "category",
        "name": "AI",
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
      }
    ]
  },
  {
    "kind": "category",
    "name": "Ai",
    "colour": "#D32F2F",
    "contents": [
      {
        "kind": "category",
        "name": "BEHAVIOR",
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
    "name": "Arrays",
    "colour": "#333",
    "contents": []
  },
  {
    "kind": "category",
    "name": "Audio",
    "colour": "#AB47BC",
    "contents": [
      {
        "kind": "category",
        "name": "GENERAL",
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
    "name": "Camera",
    "colour": "#00ACC1",
    "contents": [
      {
        "kind": "category",
        "name": "Camera Control",
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
    "name": "Conditions",
    "colour": "#0277BD",
    "contents": [
      {
        "kind": "category",
        "name": "Comparisons",
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
      }
    ]
  },
  {
    "kind": "category",
    "name": "Effects",
    "colour": "#FBC02D",
    "contents": [
      {
        "kind": "category",
        "name": "Visual Effects",
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
    "name": "Emplacements",
    "colour": "#2E7D32",
    "contents": [
      {
        "kind": "category",
        "name": "GENERAL",
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
    "name": "Events",
    "colour": "#2E7D32",
    "contents": [
      {
        "kind": "category",
        "name": "Game Events",
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
    "name": "Gameplay",
    "colour": "#333",
    "contents": []
  },
  {
    "kind": "category",
    "name": "Logic",
    "colour": "#0277BD",
    "contents": [
      {
        "kind": "category",
        "name": "Control Flow",
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
    "name": "Math",
    "colour": "#333",
    "contents": []
  },
  {
    "kind": "category",
    "name": "Mod",
    "colour": "#4A4A4A",
    "contents": [
      {
        "kind": "category",
        "name": "Game Mode",
        "contents": [
          {
            "kind": "block",
            "type": "MOD_BLOCK"
          }
        ]
      }
    ]
  },
  {
    "kind": "category",
    "name": "Objective",
    "colour": "#F9A825",
    "contents": [
      {
        "kind": "category",
        "name": "GENERAL",
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
    "name": "Other",
    "colour": "#757575",
    "contents": [
      {
        "kind": "category",
        "name": "GENERAL",
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
    "name": "Player",
    "colour": "#333",
    "contents": []
  },
  {
    "kind": "category",
    "name": "Rules",
    "colour": "#7E3F96",
    "contents": [
      {
        "kind": "category",
        "name": "Rule Definition",
        "contents": [
          {
            "kind": "block",
            "type": "RULE_HEADER"
          }
        ]
      }
    ]
  },
  {
    "kind": "category",
    "name": "Subroutine",
    "colour": "#7E3F96",
    "contents": [
      {
        "kind": "category",
        "name": "Subroutine Definition",
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
    "name": "Test",
    "colour": "#123456",
    "contents": [
      {
        "kind": "category",
        "name": "Test Subcategory",
        "contents": [
          {
            "kind": "block",
            "type": "TEST_UNKNOWN_BLOCK"
          }
        ]
      },
      {
        "kind": "category",
        "name": "Empty Subcategory",
        "contents": [
          {
            "kind": "block",
            "type": "EMPTY_EMPTY_SUBCATEGORY"
          }
        ]
      }
    ]
  },
  {
    "kind": "category",
    "name": "Transform",
    "colour": "#1565C0",
    "contents": [
      {
        "kind": "category",
        "name": "Position",
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
    "name": "Ui",
    "colour": "#039BE5",
    "contents": [
      {
        "kind": "category",
        "name": "Messages",
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
    "name": "Values",
    "colour": "#0277BD",
    "contents": [
      {
        "kind": "category",
        "name": "Literals",
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
        "name": "Variables",
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
      }
    ]
  },
  {
    "kind": "category",
    "name": "Vehicles",
    "colour": "#558B2F",
    "contents": [
      {
        "kind": "category",
        "name": "Vehicle Spawning",
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
  }
]
};
