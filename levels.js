(function(){
  "use strict";

  const levels=[
  {
    "id": "bell-basics",
    "act": 1,
    "number": 1,
    "title": "The Bridge of Embers",
    "subtitle": "The first missing Promise",
    "kind": "ember",
    "goal": "Light the bridge only for travelers carrying a living ember. Fear and noise do not change the Promise.",
    "intro": "The Welcome Flame is gone. The bridge is fading while ember-bearers race home from the Wilddark.",
    "outro": "The last ember-bearer crosses safely. In the bridge dust, Pip finds a curl of silver ash that did not come from the Heart.",
    "features": [
      {
        "key": "waits",
        "label": "carries a living ember"
      },
      {
        "key": "hungry",
        "label": "looks frightened"
      },
      {
        "key": "noisy",
        "label": "calls loudly"
      }
    ],
    "actions": [
      {
        "id": "act",
        "label": "Light the bridge",
        "shortLabel": "Light bridge",
        "description": "Give the traveler a safe path across.",
        "tone": "kind"
      },
      {
        "id": "hold",
        "label": "Hold the crossing",
        "shortLabel": "Hold",
        "description": "Keep the unstable bridge dark.",
        "tone": "cautious"
      }
    ],
    "budget": 4,
    "par": 2,
    "minLessons": 2,
    "challengeCount": 4,
    "targetRuleId": "waits",
    "proofRequirements": [
      {
        "id": "waiting-positive",
        "label": "Show an ember-bearer who should cross",
        "action": "act",
        "when": {
          "op": "truthy",
          "field": "waits"
        },
        "hint": "Use a traveler carrying a living ember."
      },
      {
        "id": "impatient-negative",
        "label": "Show someone who must wait",
        "action": "hold",
        "when": {
          "op": "falsy",
          "field": "waits"
        },
        "hint": "Use a traveler without a living ember."
      }
    ],
    "rules": [
      {
        "id": "all",
        "name": "light the bridge for everyone",
        "complexity": 0,
        "clauses": [],
        "fallback": "act",
        "description": "Every traveler receives a bridge of light.",
        "order": 0
      },
      {
        "id": "none",
        "name": "light the bridge for no one",
        "complexity": 0,
        "clauses": [],
        "fallback": "hold",
        "description": "The crossing stays dark for everyone.",
        "order": 1
      },
      {
        "id": "waits",
        "name": "light the bridge for ember-bearers",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "waits"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "The living ember is what makes the crossing safe.",
        "order": 0
      },
      {
        "id": "hungry",
        "name": "light the bridge for frightened travelers",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "hungry"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Fear is treated as the deciding clue.",
        "order": 0
      },
      {
        "id": "noisy",
        "name": "light the bridge for loud travelers",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "noisy"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Volume is treated as the deciding clue.",
        "order": 0
      },
      {
        "id": "quiet",
        "name": "light the bridge for quiet travelers",
        "complexity": 2,
        "clauses": [
          {
            "when": {
              "op": "falsy",
              "field": "noisy"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Quiet travelers receive the bridge.",
        "order": 0
      },
      {
        "id": "wait-hungry",
        "name": "light the bridge for frightened ember-bearers",
        "complexity": 2,
        "clauses": [
          {
            "when": {
              "op": "and",
              "args": [
                {
                  "op": "truthy",
                  "field": "waits"
                },
                {
                  "op": "truthy",
                  "field": "hungry"
                }
              ]
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Both the ember and fear are required.",
        "order": 0
      },
      {
        "id": "wait-or-hungry",
        "name": "light the bridge for ember-bearers or frightened travelers",
        "complexity": 3,
        "clauses": [
          {
            "when": {
              "op": "or",
              "args": [
                {
                  "op": "truthy",
                  "field": "waits"
                },
                {
                  "op": "truthy",
                  "field": "hungry"
                }
              ]
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Either an ember or fear is treated as enough.",
        "order": 0
      }
    ],
    "teachCases": [
      {
        "id": "snail",
        "name": "Ember Snail",
        "species": "snail",
        "palette": [
          "#8fb46d",
          "#d6b96b"
        ],
        "summary": "Carries a living ember and moves quietly.",
        "challengeWeight": 0,
        "waits": true,
        "hungry": false,
        "noisy": false
      },
      {
        "id": "crow",
        "name": "Frightened Crow",
        "species": "bird",
        "palette": [
          "#40506b",
          "#d7ad48"
        ],
        "summary": "Has no ember, but calls loudly in fear.",
        "challengeWeight": 0,
        "waits": false,
        "hungry": true,
        "noisy": true
      },
      {
        "id": "moth",
        "name": "Ash Moth Courier",
        "species": "moth",
        "palette": [
          "#79a46b",
          "#d7c780"
        ],
        "summary": "Carries an ember and looks frightened.",
        "challengeWeight": 0,
        "waits": true,
        "hungry": true,
        "noisy": false
      },
      {
        "id": "mouse",
        "name": "Lost Mouse",
        "species": "mouse",
        "palette": [
          "#a88c7a",
          "#e7cba6"
        ],
        "summary": "Looks frightened but carries no ember.",
        "challengeWeight": 0,
        "waits": false,
        "hungry": true,
        "noisy": false
      },
      {
        "id": "frog",
        "name": "Shouting Frog Scout",
        "species": "frog",
        "palette": [
          "#5c9f68",
          "#e2c55a"
        ],
        "summary": "Carries an ember while calling loudly.",
        "challengeWeight": 0,
        "waits": true,
        "hungry": true,
        "noisy": true
      },
      {
        "id": "squirrel",
        "name": "Rushing Squirrel",
        "species": "fox",
        "palette": [
          "#b66e43",
          "#f0c58d"
        ],
        "summary": "Has no ember and shouts for the bridge.",
        "challengeWeight": 0,
        "waits": false,
        "hungry": false,
        "noisy": true
      }
    ],
    "challengeCases": [
      {
        "id": "bat",
        "name": "Night Ember Bat",
        "species": "bat",
        "palette": [
          "#6e628d",
          "#d8b5a5"
        ],
        "summary": "Carries an ember and looks frightened.",
        "challengeWeight": 1,
        "waits": true,
        "hungry": true,
        "noisy": false
      },
      {
        "id": "jay",
        "name": "Calling Ember Jay",
        "species": "bird",
        "palette": [
          "#5d87ad",
          "#e6c55b"
        ],
        "summary": "Carries an ember while calling loudly.",
        "challengeWeight": 1,
        "waits": true,
        "hungry": false,
        "noisy": true
      },
      {
        "id": "cat",
        "name": "Frightened Garden Cat",
        "species": "cat",
        "palette": [
          "#a88b70",
          "#e4d0b1"
        ],
        "summary": "Looks frightened but carries no ember.",
        "challengeWeight": 1,
        "waits": false,
        "hungry": true,
        "noisy": false
      },
      {
        "id": "gecko",
        "name": "Quiet Gecko",
        "species": "lizard",
        "palette": [
          "#75a77d",
          "#d4d36f"
        ],
        "summary": "Carries no ember and waits silently.",
        "challengeWeight": 0,
        "waits": false,
        "hungry": false,
        "noisy": false
      },
      {
        "id": "foxlet",
        "name": "Young Ember Fox",
        "species": "fox",
        "palette": [
          "#be7048",
          "#efc69b"
        ],
        "summary": "Carries an ember without looking afraid.",
        "challengeWeight": 0,
        "waits": true,
        "hungry": false,
        "noisy": false
      },
      {
        "id": "beetle",
        "name": "Alarm Beetle",
        "species": "beetle",
        "palette": [
          "#485f55",
          "#d07b4f"
        ],
        "summary": "Has no ember and makes a great deal of noise.",
        "challengeWeight": 0,
        "waits": false,
        "hungry": true,
        "noisy": true
      }
    ],
    "scene": {
      "theme": "festival",
      "prop": "lantern-gate",
      "correctAct": "A ribbon of light forms beneath the living ember.",
      "correctHold": "The unstable bridge stays dark until a true ember arrives.",
      "wrongAct": "The bridge flares for the wrong traveler and loses another piece of light.",
      "wrongHold": "An ember-bearer reaches the fading edge with nowhere safe to step."
    },
    "reward": {
      "icon": "🔥",
      "name": "First Listener",
      "description": "Pip learns to ignore dramatic details and find the clue that makes the action safe."
    },
    "chapterTitle": "The Last Promise"
  },
  {
    "id": "thirsty-beds",
    "act": 1,
    "number": 2,
    "title": "The Wardroot's Two Wounds",
    "subtitle": "One need, two signs",
    "kind": "wardroot",
    "goal": "Bind a wardroot when its light is dim OR its bark is cracked.",
    "intro": "With the Garden Promise missing, the wardroots are failing in two different ways. Both can open a path for the Wilddark.",
    "outro": "The roots steady and their light returns. Juniper notices the same silver ash caught beneath two different wounds.",
    "features": [
      {
        "key": "dry",
        "label": "inner light is dim"
      },
      {
        "key": "drooping",
        "label": "bark is cracked"
      },
      {
        "key": "bee",
        "label": "a silver moth is nearby"
      }
    ],
    "actions": [
      {
        "id": "act",
        "label": "Bind the wardroot",
        "shortLabel": "Bind root",
        "description": "Wrap the root in a stabilizing green thread.",
        "tone": "kind"
      },
      {
        "id": "hold",
        "label": "Leave it stable",
        "shortLabel": "Leave stable",
        "description": "Do not disturb a healthy wardroot.",
        "tone": "cautious"
      }
    ],
    "budget": 5,
    "par": 3,
    "minLessons": 3,
    "challengeCount": 4,
    "targetRuleId": "dry-or-droop",
    "proofRequirements": [
      {
        "id": "dry-door",
        "label": "Show a root with dim light only",
        "action": "act",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "truthy",
              "field": "dry"
            },
            {
              "op": "falsy",
              "field": "drooping"
            }
          ]
        },
        "hint": "Use a root whose light is dim but bark is unbroken."
      },
      {
        "id": "droop-door",
        "label": "Show a root with cracked bark only",
        "action": "act",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "falsy",
              "field": "dry"
            },
            {
              "op": "truthy",
              "field": "drooping"
            }
          ]
        },
        "hint": "Use a root with cracked bark but a bright inner light."
      },
      {
        "id": "healthy-negative",
        "label": "Show a root that needs no binding",
        "action": "hold",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "falsy",
              "field": "dry"
            },
            {
              "op": "falsy",
              "field": "drooping"
            }
          ]
        },
        "hint": "Use a root with bright light and unbroken bark."
      }
    ],
    "rules": [
      {
        "id": "all",
        "name": "bind every wardroot",
        "complexity": 0,
        "clauses": [],
        "fallback": "act",
        "description": "Every root receives a binding.",
        "order": 0
      },
      {
        "id": "none",
        "name": "bind no wardroots",
        "complexity": 0,
        "clauses": [],
        "fallback": "hold",
        "description": "No root receives a binding.",
        "order": 1
      },
      {
        "id": "dry",
        "name": "bind roots with dim light",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "dry"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Dim light triggers the repair.",
        "order": 0
      },
      {
        "id": "droop",
        "name": "bind roots with cracked bark",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "drooping"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Cracked bark triggers the repair.",
        "order": 0
      },
      {
        "id": "bee",
        "name": "bind roots near silver moths",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "bee"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "The moth is treated as the cause.",
        "order": 0
      },
      {
        "id": "dry-and-droop",
        "name": "bind only roots with both wounds",
        "complexity": 2,
        "clauses": [
          {
            "when": {
              "op": "and",
              "args": [
                {
                  "op": "truthy",
                  "field": "dry"
                },
                {
                  "op": "truthy",
                  "field": "drooping"
                }
              ]
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Both signs are required.",
        "order": 0
      },
      {
        "id": "dry-or-droop",
        "name": "bind roots with dim light or cracked bark",
        "complexity": 3,
        "clauses": [
          {
            "when": {
              "op": "or",
              "args": [
                {
                  "op": "truthy",
                  "field": "dry"
                },
                {
                  "op": "truthy",
                  "field": "drooping"
                }
              ]
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Either wound is enough to require help.",
        "order": 0
      },
      {
        "id": "dry-no-bee",
        "name": "bind dim roots unless a moth is nearby",
        "complexity": 3,
        "clauses": [
          {
            "when": {
              "op": "and",
              "args": [
                {
                  "op": "truthy",
                  "field": "dry"
                },
                {
                  "op": "falsy",
                  "field": "bee"
                }
              ]
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "A nearby moth wrongly cancels the repair.",
        "order": 0
      }
    ],
    "teachCases": [
      {
        "id": "fern",
        "name": "Cracked Fernroot",
        "species": "plant",
        "palette": [
          "#4e9862",
          "#9bc56d"
        ],
        "summary": "Its bark is cracked, but its inner light is bright.",
        "challengeWeight": 0,
        "dry": false,
        "drooping": true,
        "bee": false
      },
      {
        "id": "sage",
        "name": "Dimming Sageroot",
        "species": "plant",
        "palette": [
          "#7ea174",
          "#c7c08b"
        ],
        "summary": "Its inner light is dim, but its bark is whole.",
        "challengeWeight": 0,
        "dry": true,
        "drooping": false,
        "bee": false
      },
      {
        "id": "mint",
        "name": "Steady Mintroot",
        "species": "plant",
        "palette": [
          "#58a66a",
          "#9bd482"
        ],
        "summary": "Its light is bright and its bark is whole.",
        "challengeWeight": 0,
        "dry": false,
        "drooping": false,
        "bee": false
      },
      {
        "id": "rose",
        "name": "Mothlit Roseroot",
        "species": "flower",
        "palette": [
          "#bd5f6d",
          "#e5b85e"
        ],
        "summary": "Healthy root with a silver moth resting nearby.",
        "challengeWeight": 0,
        "dry": false,
        "drooping": false,
        "bee": true
      },
      {
        "id": "daisy",
        "name": "Dimming Daisyroot",
        "species": "flower",
        "palette": [
          "#e0c65b",
          "#f2ece0"
        ],
        "summary": "Dim light, whole bark, and a nearby moth.",
        "challengeWeight": 0,
        "dry": true,
        "drooping": false,
        "bee": true
      },
      {
        "id": "ivy",
        "name": "Cracked Ivyroot",
        "species": "plant",
        "palette": [
          "#477f59",
          "#78a96d"
        ],
        "summary": "Cracked bark, bright light, and a nearby moth.",
        "challengeWeight": 0,
        "dry": false,
        "drooping": true,
        "bee": true
      }
    ],
    "challengeCases": [
      {
        "id": "basil",
        "name": "Dimming Basilroot",
        "species": "plant",
        "palette": [
          "#55915a",
          "#9bc07a"
        ],
        "summary": "Dim inner light and unbroken bark.",
        "challengeWeight": 1,
        "dry": true,
        "drooping": false,
        "bee": false
      },
      {
        "id": "clover",
        "name": "Split Cloverroot",
        "species": "flower",
        "palette": [
          "#55a66c",
          "#d8e5a1"
        ],
        "summary": "Bright inner light and cracked bark.",
        "challengeWeight": 1,
        "dry": false,
        "drooping": true,
        "bee": false
      },
      {
        "id": "tulip",
        "name": "Steady Tuliproot",
        "species": "flower",
        "palette": [
          "#d76f75",
          "#f1d36b"
        ],
        "summary": "Bright light and unbroken bark.",
        "challengeWeight": 1,
        "dry": false,
        "drooping": false,
        "bee": false
      },
      {
        "id": "poppy",
        "name": "Failing Poppyroot",
        "species": "flower",
        "palette": [
          "#c45150",
          "#292d35"
        ],
        "summary": "Dim light and cracked bark.",
        "challengeWeight": 0,
        "dry": true,
        "drooping": true,
        "bee": false
      },
      {
        "id": "lavender",
        "name": "Mothlit Lavenderroot",
        "species": "flower",
        "palette": [
          "#8467a4",
          "#d6b45c"
        ],
        "summary": "Healthy root with a silver moth nearby.",
        "challengeWeight": 0,
        "dry": false,
        "drooping": false,
        "bee": true
      },
      {
        "id": "thyme",
        "name": "Wounded Thymeroot",
        "species": "plant",
        "palette": [
          "#718f68",
          "#a9bb7a"
        ],
        "summary": "Both wounds, plus a silver moth.",
        "challengeWeight": 0,
        "dry": true,
        "drooping": true,
        "bee": true
      }
    ],
    "scene": {
      "theme": "water",
      "prop": "can",
      "correctAct": "Green thread closes the wound and the wardlight steadies.",
      "correctHold": "The healthy root continues humming beneath the soil.",
      "wrongAct": "A healthy root is wrapped so tightly that its light flickers.",
      "wrongHold": "The wound widens and a ribbon of Wilddark slips through."
    },
    "reward": {
      "icon": "🌿",
      "name": "Living Evidence",
      "description": "Pip learns that two different signs can reveal the same need."
    },
    "chapterTitle": "The Last Promise"
  },
  {
    "id": "seed-gate",
    "act": 1,
    "number": 3,
    "title": "The Rootgate Breach",
    "subtitle": "Two keys to one gate",
    "kind": "rootgate",
    "goal": "Open Rootgate for a Keeper seal OR a medicine satchel. Either is a real reason to enter the protected route.",
    "intro": "The stolen route leads through Rootgate. Keepers and medics both need access, and Pip must learn that one title is not the only kind of help.",
    "outro": "Both kinds of helpers pass. The gate records that someone used a service path known only to senior apprentices.",
    "features": [
      {
        "key": "seed",
        "label": "carries a Keeper seal"
      },
      {
        "key": "tool",
        "label": "carries medicine"
      }
    ],
    "actions": [
      {
        "id": "act",
        "label": "Open Rootgate",
        "shortLabel": "Open gate",
        "description": "Let the visitor enter the protected route.",
        "tone": "kind"
      },
      {
        "id": "hold",
        "label": "Keep roots closed",
        "shortLabel": "Keep closed",
        "description": "Hold the living roots together.",
        "tone": "cautious"
      }
    ],
    "budget": 5,
    "par": 3,
    "minLessons": 3,
    "challengeCount": 4,
    "targetRuleId": "seed-or-tool",
    "proofRequirements": [
      {
        "id": "seed-qualifies",
        "label": "Show a Keeper seal",
        "action": "act",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "truthy",
              "field": "seed"
            },
            {
              "op": "falsy",
              "field": "tool"
            }
          ]
        },
        "hint": "Use a visitor with a Keeper seal."
      },
      {
        "id": "tool-qualifies",
        "label": "Show a medicine carrier",
        "action": "act",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "falsy",
              "field": "seed"
            },
            {
              "op": "truthy",
              "field": "tool"
            }
          ]
        },
        "hint": "Use a visitor carrying medicine."
      },
      {
        "id": "empty-negative",
        "label": "Show someone with no reason to enter",
        "action": "hold",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "falsy",
              "field": "seed"
            },
            {
              "op": "falsy",
              "field": "tool"
            }
          ]
        },
        "hint": "Use a visitor with neither seal nor medicine."
      }
    ],
    "rules": [
      {
        "id": "all",
        "name": "open for everyone",
        "complexity": 0,
        "clauses": [],
        "fallback": "act",
        "description": "Every visitor enters Rootgate.",
        "order": 0
      },
      {
        "id": "none",
        "name": "open for no one",
        "complexity": 0,
        "clauses": [],
        "fallback": "hold",
        "description": "The gate remains closed to everyone.",
        "order": 1
      },
      {
        "id": "seed",
        "name": "open for Keeper seals",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "seed"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "A Keeper seal is the only path in.",
        "order": 0
      },
      {
        "id": "tool",
        "name": "open for medicine carriers",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "tool"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Medicine is the only path in.",
        "order": 0
      },
      {
        "id": "seed-or-tool",
        "name": "open for seals or medicine",
        "complexity": 3,
        "clauses": [
          {
            "when": {
              "op": "or",
              "args": [
                {
                  "op": "truthy",
                  "field": "seed"
                },
                {
                  "op": "truthy",
                  "field": "tool"
                }
              ]
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Either form of service is enough.",
        "order": 0
      },
      {
        "id": "both",
        "name": "open only for visitors carrying both",
        "complexity": 2,
        "clauses": [
          {
            "when": {
              "op": "and",
              "args": [
                {
                  "op": "truthy",
                  "field": "seed"
                },
                {
                  "op": "truthy",
                  "field": "tool"
                }
              ]
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "One kind of help is wrongly treated as insufficient.",
        "order": 0
      }
    ],
    "teachCases": [
      {
        "id": "finch",
        "name": "Seal Finch",
        "species": "bird",
        "palette": [
          "#7d8e5a",
          "#dfc15b"
        ],
        "summary": "Carries a Keeper seal.",
        "challengeWeight": 0,
        "seed": true,
        "tool": false
      },
      {
        "id": "mole",
        "name": "Medic Mole",
        "species": "mole",
        "palette": [
          "#6c655d",
          "#d4b27d"
        ],
        "summary": "Carries medicine.",
        "challengeWeight": 0,
        "seed": false,
        "tool": true
      },
      {
        "id": "rabbit",
        "name": "Lost Rabbit",
        "species": "rabbit",
        "palette": [
          "#d8c4ae",
          "#f0dfcb"
        ],
        "summary": "Carries neither a seal nor medicine.",
        "challengeWeight": 0,
        "seed": false,
        "tool": false
      },
      {
        "id": "goose",
        "name": "Dual Credential Responder",
        "species": "bird",
        "palette": [
          "#e9e6d6",
          "#df9d49"
        ],
        "summary": "Carries both forms of access.",
        "challengeWeight": 0,
        "seed": true,
        "tool": true
      },
      {
        "id": "beetle",
        "name": "Field Responder",
        "species": "beetle",
        "palette": [
          "#42534a",
          "#c56f45"
        ],
        "summary": "Carries a seal and medicine.",
        "challengeWeight": 0,
        "seed": true,
        "tool": true
      }
    ],
    "challengeCases": [
      {
        "id": "wren",
        "name": "Keeper Wren",
        "species": "bird",
        "palette": [
          "#846b55",
          "#d5b255"
        ],
        "summary": "Carries a Keeper seal.",
        "challengeWeight": 1,
        "seed": true,
        "tool": false
      },
      {
        "id": "otter",
        "name": "Medicine Otter",
        "species": "otter",
        "palette": [
          "#756052",
          "#d8b17e"
        ],
        "summary": "Carries medicine supplies.",
        "challengeWeight": 1,
        "seed": false,
        "tool": true
      },
      {
        "id": "turtle",
        "name": "Curious Turtle",
        "species": "turtle",
        "palette": [
          "#71855d",
          "#a9a66e"
        ],
        "summary": "Carries neither seal nor medicine.",
        "challengeWeight": 0,
        "seed": false,
        "tool": false
      },
      {
        "id": "magpie",
        "name": "Dual-marked Magpie",
        "species": "bird",
        "palette": [
          "#394d61",
          "#d9d3b4"
        ],
        "summary": "Carries both valid forms of access.",
        "challengeWeight": 0,
        "seed": true,
        "tool": true
      }
    ],
    "scene": {
      "theme": "festival",
      "prop": "lantern-gate",
      "correctAct": "The roots part just wide enough for a needed helper.",
      "correctHold": "The roots stay woven and the sleeping rootlings remain still.",
      "wrongAct": "An unverified visitor enters the protected route.",
      "wrongHold": "A needed helper waits while the protected route deteriorates."
    },
    "reward": {
      "icon": "⛩️",
      "name": "Two Keys",
      "description": "Pip learns that two different kinds of help can both be valid."
    },
    "chapterTitle": "The Last Promise"
  },
  {
    "id": "berry-basket",
    "act": 1,
    "number": 4,
    "title": "Two Sparks to Name a Ghost",
    "subtitle": "The exact amount matters",
    "kind": "forge",
    "goal": "Run the ash-reader when the forge holds at least two stable sparks.",
    "intro": "Lumi can identify the silver ash, but the old forge needs a stable charge. One spark flickers; two reveal the maker.",
    "outro": "The ash-reader burns Sable Vey's apprentice seal into the glass. Lumi recognizes it a heartbeat before she pretends not to.",
    "features": [
      {
        "key": "bundles",
        "label": "stable sparks"
      },
      {
        "key": "rainy",
        "label": "ash sample is wet"
      },
      {
        "key": "tiny",
        "label": "spark jar is cracked"
      }
    ],
    "actions": [
      {
        "id": "act",
        "label": "Read the silver ash",
        "shortLabel": "Read ash",
        "description": "Send the stable charge through the ash-reader.",
        "tone": "kind"
      },
      {
        "id": "hold",
        "label": "Gather more sparks",
        "shortLabel": "Gather more",
        "description": "Wait until the forge has enough stable power.",
        "tone": "cautious"
      }
    ],
    "budget": 5,
    "par": 3,
    "minLessons": 3,
    "challengeCount": 4,
    "targetRuleId": "two-plus",
    "proofRequirements": [
      {
        "id": "below-threshold",
        "label": "Show that one spark is not enough",
        "action": "hold",
        "when": {
          "op": "eq",
          "field": "bundles",
          "value": 1
        },
        "hint": "Use a forge charge with one stable spark."
      },
      {
        "id": "at-threshold",
        "label": "Show that two sparks are enough",
        "action": "act",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "eq",
              "field": "bundles",
              "value": 2
            },
            {
              "op": "falsy",
              "field": "rainy"
            },
            {
              "op": "falsy",
              "field": "tiny"
            }
          ]
        },
        "hint": "Use a forge charge with exactly two sparks."
      },
      {
        "id": "distractor-proof",
        "label": "Show that the charge matters more than the container",
        "action": "act",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "gte",
              "field": "bundles",
              "value": 2
            },
            {
              "op": "or",
              "args": [
                {
                  "op": "truthy",
                  "field": "rainy"
                },
                {
                  "op": "truthy",
                  "field": "tiny"
                }
              ]
            }
          ]
        },
        "hint": "Use at least two sparks in wet ash or a cracked jar."
      }
    ],
    "rules": [
      {
        "id": "all",
        "name": "read every ash sample",
        "complexity": 0,
        "clauses": [],
        "fallback": "act",
        "description": "Every sample is sent through the reader.",
        "order": 0
      },
      {
        "id": "none",
        "name": "read no ash samples",
        "complexity": 0,
        "clauses": [],
        "fallback": "hold",
        "description": "The reader is never used.",
        "order": 1
      },
      {
        "id": "one-plus",
        "name": "send baskets with at least one bundle",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "gte",
              "field": "bundles",
              "value": 1
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Any berries are enough.",
        "order": 0
      },
      {
        "id": "two-plus",
        "name": "read samples with at least two sparks",
        "complexity": 2,
        "clauses": [
          {
            "when": {
              "op": "gte",
              "field": "bundles",
              "value": 2
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Two stable sparks are the minimum charge.",
        "order": 0
      },
      {
        "id": "three-plus",
        "name": "send baskets with at least three bundles",
        "complexity": 2,
        "clauses": [
          {
            "when": {
              "op": "gte",
              "field": "bundles",
              "value": 3
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Three bundles are needed.",
        "order": 1
      },
      {
        "id": "rain",
        "name": "send rainy baskets",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "rainy"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Rain determines the trip.",
        "order": 0
      },
      {
        "id": "not-tiny",
        "name": "send large baskets",
        "complexity": 2,
        "clauses": [
          {
            "when": {
              "op": "falsy",
              "field": "tiny"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Basket size determines the trip.",
        "order": 0
      },
      {
        "id": "two-dry",
        "name": "read two-spark samples only when dry",
        "complexity": 4,
        "clauses": [
          {
            "when": {
              "op": "and",
              "args": [
                {
                  "op": "gte",
                  "field": "bundles",
                  "value": 2
                },
                {
                  "op": "falsy",
                  "field": "rainy"
                }
              ]
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Wet ash wrongly cancels a sufficient charge.",
        "order": 0
      }
    ],
    "teachCases": [
      {
        "id": "one",
        "name": "1 Spark",
        "species": "basket",
        "palette": [
          "#ad6a54",
          "#d2b47a"
        ],
        "summary": "One stable spark in a sound jar.",
        "challengeWeight": 0,
        "bundles": 1,
        "rainy": false,
        "tiny": false
      },
      {
        "id": "two",
        "name": "2 Sparks",
        "species": "basket",
        "palette": [
          "#a95d55",
          "#d8b66f"
        ],
        "summary": "Exactly two stable sparks in a sound jar.",
        "challengeWeight": 0,
        "bundles": 2,
        "rainy": false,
        "tiny": false
      },
      {
        "id": "zero-rain",
        "name": "Wet Ash, No Sparks",
        "species": "basket",
        "palette": [
          "#597d8d",
          "#b79c6f"
        ],
        "summary": "Wet silver ash with no stable charge.",
        "challengeWeight": 0,
        "bundles": 0,
        "rainy": true,
        "tiny": false
      },
      {
        "id": "three-tiny",
        "name": "3 Sparks in a Cracked Jar",
        "species": "basket",
        "palette": [
          "#b15c58",
          "#c8a461"
        ],
        "summary": "Three stable sparks in a cracked jar.",
        "challengeWeight": 0,
        "bundles": 3,
        "rainy": false,
        "tiny": true
      },
      {
        "id": "two-rain",
        "name": "Two Sparks, Wet Ash",
        "species": "basket",
        "palette": [
          "#6e7e91",
          "#d3ac67"
        ],
        "summary": "Two stable sparks with a wet ash sample.",
        "challengeWeight": 0,
        "bundles": 2,
        "rainy": true,
        "tiny": false
      },
      {
        "id": "one-tiny",
        "name": "One Spark, Cracked Jar",
        "species": "basket",
        "palette": [
          "#aa625b",
          "#c8a464"
        ],
        "summary": "One stable spark in a cracked jar.",
        "challengeWeight": 0,
        "bundles": 1,
        "rainy": false,
        "tiny": true
      }
    ],
    "challengeCases": [
      {
        "id": "zero",
        "name": "Cold Forge",
        "species": "basket",
        "palette": [
          "#8b6e55",
          "#c2a26e"
        ],
        "summary": "No stable sparks.",
        "challengeWeight": 1,
        "bundles": 0,
        "rainy": false,
        "tiny": false
      },
      {
        "id": "two-plain",
        "name": "Two Clear Sparks",
        "species": "basket",
        "palette": [
          "#aa5d56",
          "#d7b36c"
        ],
        "summary": "Exactly two stable sparks.",
        "challengeWeight": 2,
        "bundles": 2,
        "rainy": false,
        "tiny": false
      },
      {
        "id": "one-rain",
        "name": "One Spark, Wet Ash",
        "species": "basket",
        "palette": [
          "#627f8c",
          "#c5a56d"
        ],
        "summary": "One stable spark with wet ash.",
        "challengeWeight": 1,
        "bundles": 1,
        "rainy": true,
        "tiny": false
      },
      {
        "id": "two-tiny",
        "name": "Two Sparks, Cracked Jar",
        "species": "basket",
        "palette": [
          "#a85b56",
          "#caa866"
        ],
        "summary": "Two stable sparks in a cracked jar.",
        "challengeWeight": 1,
        "bundles": 2,
        "rainy": false,
        "tiny": true
      },
      {
        "id": "three",
        "name": "Three Clear Sparks",
        "species": "basket",
        "palette": [
          "#b65b55",
          "#d2ad67"
        ],
        "summary": "Three stable sparks.",
        "challengeWeight": 0,
        "bundles": 3,
        "rainy": false,
        "tiny": false
      },
      {
        "id": "four-rain",
        "name": "Four Sparks, Wet Ash",
        "species": "basket",
        "palette": [
          "#657c8c",
          "#d0a761"
        ],
        "summary": "Four stable sparks with wet ash.",
        "challengeWeight": 0,
        "bundles": 4,
        "rainy": true,
        "tiny": false
      },
      {
        "id": "zero-tiny",
        "name": "Cracked Empty Jar",
        "species": "basket",
        "palette": [
          "#8d745d",
          "#b89d70"
        ],
        "summary": "No sparks in a cracked jar.",
        "challengeWeight": 0,
        "bundles": 0,
        "rainy": false,
        "tiny": true
      }
    ],
    "scene": {
      "theme": "festival",
      "prop": "thermometer",
      "correctAct": "The reader flares and a silver apprentice seal appears in the glass.",
      "correctHold": "The forge waits instead of burning an incomplete answer into the evidence.",
      "wrongAct": "The reader coughs black smoke and smears the ash signature.",
      "wrongHold": "A stable charge fades while the group waits beside a ready machine."
    },
    "reward": {
      "icon": "⚡",
      "name": "Threshold Reader",
      "description": "Pip learns that “almost enough” and “enough” can lead to different outcomes."
    },
    "chapterTitle": "The Last Promise"
  },
  {
    "id": "knock-first",
    "act": 2,
    "number": 5,
    "title": "The Glassmaker's Oath",
    "subtitle": "The order changes the outcome",
    "kind": "glass",
    "goal": "Let a traveler cross the living glass only when they knock before entering.",
    "intro": "Sable crossed the old Glassworks. The panes remember the first action they feel: warned glass bends; surprised glass breaks.",
    "outro": "The last pane opens without a crack. Across its surface, Sable has written: “A rule that cannot hear why is only a lock.”",
    "features": [
      {
        "key": "route",
        "label": "order of actions"
      },
      {
        "key": "moon",
        "label": "crosses under moonlight"
      },
      {
        "key": "noisy",
        "label": "voice echoes loudly"
      }
    ],
    "actions": [
      {
        "id": "act",
        "label": "Let them cross",
        "shortLabel": "Let cross",
        "description": "Allow the traveler onto the living glass.",
        "tone": "kind"
      },
      {
        "id": "hold",
        "label": "Reset the glass",
        "shortLabel": "Reset glass",
        "description": "Ask the traveler to begin again safely.",
        "tone": "cautious"
      }
    ],
    "budget": 5,
    "par": 3,
    "minLessons": 3,
    "challengeCount": 4,
    "targetRuleId": "knock-before-enter",
    "proofRequirements": [
      {
        "id": "proper-order",
        "label": "Show knock before entering",
        "action": "act",
        "when": {
          "op": "before",
          "field": "route",
          "first": "knock",
          "second": "enter"
        },
        "hint": "Use a traveler who knocks before entering."
      },
      {
        "id": "reversed-order",
        "label": "Show entering before knocking",
        "action": "hold",
        "when": {
          "op": "before",
          "field": "route",
          "first": "enter",
          "second": "knock"
        },
        "hint": "Use a traveler who enters before knocking."
      },
      {
        "id": "knock-without-entry",
        "label": "Show that knocking alone is incomplete",
        "action": "hold",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "contains",
              "field": "route",
              "value": "knock"
            },
            {
              "op": "not",
              "arg": {
                "op": "contains",
                "field": "route",
                "value": "enter"
              }
            }
          ]
        },
        "hint": "Use a traveler who knocks but never enters."
      }
    ],
    "rules": [
      {
        "id": "all",
        "name": "let everyone cross",
        "complexity": 0,
        "clauses": [],
        "fallback": "act",
        "description": "Every traveler is allowed onto the glass.",
        "order": 0
      },
      {
        "id": "none",
        "name": "let no one cross",
        "complexity": 0,
        "clauses": [],
        "fallback": "hold",
        "description": "Every traveler must reset.",
        "order": 1
      },
      {
        "id": "has-knock",
        "name": "open whenever there is a knock",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "contains",
              "field": "route",
              "value": "knock"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Knocking anywhere is enough.",
        "order": 0
      },
      {
        "id": "has-bow",
        "name": "open whenever there is a bow",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "contains",
              "field": "route",
              "value": "bow"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "A bow is enough.",
        "order": 0
      },
      {
        "id": "knock-before-enter",
        "name": "cross only after knock before enter",
        "complexity": 3,
        "clauses": [
          {
            "when": {
              "op": "before",
              "field": "route",
              "first": "knock",
              "second": "enter"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "The warning must happen before the crossing.",
        "order": 0
      },
      {
        "id": "enter-before-knock",
        "name": "cross after enter before knock",
        "complexity": 3,
        "clauses": [
          {
            "when": {
              "op": "before",
              "field": "route",
              "first": "enter",
              "second": "knock"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "The dangerous reversed order is accepted.",
        "order": 0
      },
      {
        "id": "moon",
        "name": "cross only under moonlight",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "moon"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Moonlight is treated as the cause.",
        "order": 0
      },
      {
        "id": "quiet-knock",
        "name": "open for quiet arrivals who knock",
        "complexity": 3,
        "clauses": [
          {
            "when": {
              "op": "and",
              "args": [
                {
                  "op": "contains",
                  "field": "route",
                  "value": "knock"
                },
                {
                  "op": "falsy",
                  "field": "noisy"
                }
              ]
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Knocking and quietness both matter.",
        "order": 0
      }
    ],
    "teachCases": [
      {
        "id": "proper",
        "name": "Careful Apprentice",
        "species": "bird",
        "palette": [
          "#826951",
          "#d8b55e"
        ],
        "summary": "Knocks, enters, then bows.",
        "challengeWeight": 0,
        "route": [
          "knock",
          "enter",
          "bow"
        ],
        "moon": false,
        "noisy": false
      },
      {
        "id": "backward",
        "name": "Hasty Courier",
        "species": "badger",
        "palette": [
          "#4d5054",
          "#d5cfbd"
        ],
        "summary": "Enters first, then knocks.",
        "challengeWeight": 0,
        "route": [
          "enter",
          "knock",
          "bow"
        ],
        "moon": false,
        "noisy": false
      },
      {
        "id": "bow-only",
        "name": "Polite Moonwalker",
        "species": "rabbit",
        "palette": [
          "#d4c2ae",
          "#f0dfc7"
        ],
        "summary": "Bows and enters without knocking.",
        "challengeWeight": 0,
        "route": [
          "bow",
          "enter"
        ],
        "moon": true,
        "noisy": false
      },
      {
        "id": "loud-proper",
        "name": "Echoing Glassworker",
        "species": "bird",
        "palette": [
          "#537fa4",
          "#e4bc54"
        ],
        "summary": "Knocks before entering, though the voice echoes loudly.",
        "challengeWeight": 0,
        "route": [
          "knock",
          "enter"
        ],
        "moon": true,
        "noisy": true
      },
      {
        "id": "knock-leave",
        "name": "Cautious Messenger",
        "species": "mole",
        "palette": [
          "#6b635b",
          "#d4b37d"
        ],
        "summary": "Knocks, bows, and leaves without entering.",
        "challengeWeight": 0,
        "route": [
          "knock",
          "bow",
          "leave"
        ],
        "moon": false,
        "noisy": false
      },
      {
        "id": "quiet-enter",
        "name": "Silent Intruder",
        "species": "cat",
        "palette": [
          "#8f7a6e",
          "#e3ceb4"
        ],
        "summary": "Enters quietly without knocking.",
        "challengeWeight": 0,
        "route": [
          "enter",
          "bow"
        ],
        "moon": true,
        "noisy": false
      }
    ],
    "challengeCases": [
      {
        "id": "knock-enter",
        "name": "Night Apprentice",
        "species": "moth",
        "palette": [
          "#77916b",
          "#d8c57d"
        ],
        "summary": "Knocks before entering.",
        "challengeWeight": 1,
        "route": [
          "knock",
          "enter"
        ],
        "moon": true,
        "noisy": false
      },
      {
        "id": "enter-knock",
        "name": "Backward Courier",
        "species": "fox",
        "palette": [
          "#b46e49",
          "#efc798"
        ],
        "summary": "Enters before knocking.",
        "challengeWeight": 1,
        "route": [
          "enter",
          "knock"
        ],
        "moon": true,
        "noisy": false
      },
      {
        "id": "knock-bow-enter",
        "name": "Ceremonial Glassmaker",
        "species": "snail",
        "palette": [
          "#85a96c",
          "#d5b46f"
        ],
        "summary": "Knocks, bows, then enters.",
        "challengeWeight": 1,
        "route": [
          "knock",
          "bow",
          "enter"
        ],
        "moon": false,
        "noisy": false
      },
      {
        "id": "bow-knock-enter",
        "name": "Loud Artisan",
        "species": "otter",
        "palette": [
          "#715f51",
          "#d5b58a"
        ],
        "summary": "Bows, knocks, then enters while speaking loudly.",
        "challengeWeight": 0,
        "route": [
          "bow",
          "knock",
          "enter"
        ],
        "moon": false,
        "noisy": true
      },
      {
        "id": "enter-only",
        "name": "Unannounced Runner",
        "species": "beetle",
        "palette": [
          "#45564d",
          "#c87048"
        ],
        "summary": "Enters without warning.",
        "challengeWeight": 0,
        "route": [
          "enter"
        ],
        "moon": false,
        "noisy": false
      },
      {
        "id": "bow-enter",
        "name": "Polite Intruder",
        "species": "moth",
        "palette": [
          "#8a9367",
          "#e4c86e"
        ],
        "summary": "Bows and enters without knocking.",
        "challengeWeight": 2,
        "route": [
          "bow",
          "enter"
        ],
        "moon": false,
        "noisy": false
      },
      {
        "id": "knock-no-enter",
        "name": "Waiting Scout",
        "species": "turtle",
        "palette": [
          "#6d815d",
          "#aaa66f"
        ],
        "summary": "Knocks, then waits without entering.",
        "challengeWeight": 0,
        "route": [
          "knock",
          "wait"
        ],
        "moon": true,
        "noisy": false
      }
    ],
    "scene": {
      "theme": "moon",
      "prop": "lantern-gate",
      "correctAct": "The warned glass softens into a clear path beneath the traveler.",
      "correctHold": "The pane settles and waits for the safe sequence to begin.",
      "wrongAct": "The surprised pane fractures into a chorus of ringing shards.",
      "wrongHold": "A correctly warned pane closes before the traveler can cross."
    },
    "reward": {
      "icon": "→",
      "name": "Order Witness",
      "description": "Pip learns that correct actions can still fail when they happen in the wrong order."
    },
    "chapterTitle": "The Last Promise"
  },
  {
    "id": "rain-memory",
    "act": 2,
    "number": 6,
    "title": "The Second Morning",
    "subtitle": "The past changes the clue",
    "kind": "trail",
    "goal": "Follow a trail only after silver ash appears for two mornings in a row.",
    "intro": "Forge soot can mimic Sable's ash for one morning. A true Unbinder trail persists after the night wind clears ordinary dust.",
    "outro": "The second morning confirms the trail. Sable steps from the mist and asks Pip whether perfect obedience would have saved her brother.",
    "features": [
      {
        "key": "dryStreak",
        "label": "mornings with silver ash"
      },
      {
        "key": "drooping",
        "label": "trail bends toward the Heart"
      },
      {
        "key": "rainSoon",
        "label": "Black Rain is forecast"
      }
    ],
    "actions": [
      {
        "id": "act",
        "label": "Follow the trail",
        "shortLabel": "Follow trail",
        "description": "Mark this as Sable's real route.",
        "tone": "kind"
      },
      {
        "id": "hold",
        "label": "Keep watching",
        "shortLabel": "Keep watching",
        "description": "Wait for enough history to distinguish the trail.",
        "tone": "cautious"
      }
    ],
    "budget": 5,
    "par": 3,
    "minLessons": 3,
    "challengeCount": 4,
    "targetRuleId": "streak-two",
    "proofRequirements": [
      {
        "id": "first-morning",
        "label": "Show that one ash morning is too soon",
        "action": "hold",
        "when": {
          "op": "eq",
          "field": "dryStreak",
          "value": 1
        },
        "hint": "Use a trail with silver ash for one morning."
      },
      {
        "id": "second-morning",
        "label": "Show that two ash mornings confirm the trail",
        "action": "act",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "eq",
              "field": "dryStreak",
              "value": 2
            },
            {
              "op": "falsy",
              "field": "rainSoon"
            }
          ]
        },
        "hint": "Use a trail with silver ash for two mornings."
      },
      {
        "id": "history-over-forecast",
        "label": "Show that the history still matters before Black Rain",
        "action": "act",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "gte",
              "field": "dryStreak",
              "value": 2
            },
            {
              "op": "truthy",
              "field": "rainSoon"
            }
          ]
        },
        "hint": "Use a two-morning trail with Black Rain forecast."
      }
    ],
    "rules": [
      {
        "id": "all",
        "name": "follow every ash mark",
        "complexity": 0,
        "clauses": [],
        "fallback": "act",
        "description": "Every ash mark becomes a trail.",
        "order": 0
      },
      {
        "id": "none",
        "name": "follow no ash marks",
        "complexity": 0,
        "clauses": [],
        "fallback": "hold",
        "description": "No trail is ever followed.",
        "order": 1
      },
      {
        "id": "streak-one",
        "name": "mark after one morning",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "gte",
              "field": "dryStreak",
              "value": 1
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "One appearance is treated as proof.",
        "order": 0
      },
      {
        "id": "streak-two",
        "name": "follow after two ash mornings",
        "complexity": 2,
        "clauses": [
          {
            "when": {
              "op": "gte",
              "field": "dryStreak",
              "value": 2
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Two consecutive mornings confirm the trail.",
        "order": 0
      },
      {
        "id": "streak-three",
        "name": "follow only after three mornings",
        "complexity": 2,
        "clauses": [
          {
            "when": {
              "op": "gte",
              "field": "dryStreak",
              "value": 3
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "The group waits one morning too long.",
        "order": 1
      },
      {
        "id": "droop",
        "name": "follow trails that bend toward the Heart",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "drooping"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Direction is treated as the only clue.",
        "order": 0
      },
      {
        "id": "two-no-rain",
        "name": "follow two-morning trails only without rain",
        "complexity": 4,
        "clauses": [
          {
            "when": {
              "op": "and",
              "args": [
                {
                  "op": "gte",
                  "field": "dryStreak",
                  "value": 2
                },
                {
                  "op": "falsy",
                  "field": "rainSoon"
                }
              ]
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "The forecast wrongly cancels confirmed history.",
        "order": 0
      }
    ],
    "teachCases": [
      {
        "id": "first-dry",
        "name": "First Ash Morning",
        "species": "plant",
        "palette": [
          "#6f9963",
          "#b7bc72"
        ],
        "summary": "Silver ash has appeared for one morning.",
        "challengeWeight": 0,
        "dryStreak": 1,
        "drooping": false,
        "rainSoon": false
      },
      {
        "id": "second-dry",
        "name": "Second Ash Morning",
        "species": "plant",
        "palette": [
          "#77905d",
          "#c4a96f"
        ],
        "summary": "Silver ash has remained for two mornings.",
        "challengeWeight": 0,
        "dryStreak": 2,
        "drooping": false,
        "rainSoon": false
      },
      {
        "id": "wet",
        "name": "Wind-cleared Path",
        "species": "plant",
        "palette": [
          "#4d9368",
          "#83bd7a"
        ],
        "summary": "No silver ash remains this morning.",
        "challengeWeight": 0,
        "dryStreak": 0,
        "drooping": false,
        "rainSoon": false
      },
      {
        "id": "droop-one",
        "name": "Heartward Smudge",
        "species": "flower",
        "palette": [
          "#ad6672",
          "#dfc15c"
        ],
        "summary": "One ash morning on a path bending toward the Heart.",
        "challengeWeight": 0,
        "dryStreak": 1,
        "drooping": true,
        "rainSoon": false
      },
      {
        "id": "two-rain",
        "name": "Two Mornings Before Rain",
        "species": "plant",
        "palette": [
          "#607f76",
          "#a8ad70"
        ],
        "summary": "Two ash mornings with Black Rain forecast.",
        "challengeWeight": 0,
        "dryStreak": 2,
        "drooping": false,
        "rainSoon": true
      },
      {
        "id": "three",
        "name": "Three-morning Trail",
        "species": "plant",
        "palette": [
          "#7f8258",
          "#c19d67"
        ],
        "summary": "Three ash mornings on a path toward the Heart.",
        "challengeWeight": 0,
        "dryStreak": 3,
        "drooping": true,
        "rainSoon": false
      }
    ],
    "challengeCases": [
      {
        "id": "zero-droop",
        "name": "Clean Heartward Path",
        "species": "flower",
        "palette": [
          "#a96475",
          "#d9bc5d"
        ],
        "summary": "No ash, though the path bends toward the Heart.",
        "challengeWeight": 1,
        "dryStreak": 0,
        "drooping": true,
        "rainSoon": false
      },
      {
        "id": "one-rain",
        "name": "First Morning Before Rain",
        "species": "plant",
        "palette": [
          "#678a71",
          "#9fb978"
        ],
        "summary": "One ash morning with Black Rain forecast.",
        "challengeWeight": 1,
        "dryStreak": 1,
        "drooping": false,
        "rainSoon": true
      },
      {
        "id": "two-droop",
        "name": "Confirmed Heartward Trail",
        "species": "plant",
        "palette": [
          "#7b865b",
          "#c0a268"
        ],
        "summary": "Two ash mornings on the Heartward path.",
        "challengeWeight": 1,
        "dryStreak": 2,
        "drooping": true,
        "rainSoon": false
      },
      {
        "id": "three-rain",
        "name": "Three Mornings Before Rain",
        "species": "plant",
        "palette": [
          "#6c8070",
          "#b0a66e"
        ],
        "summary": "Three ash mornings with Black Rain forecast.",
        "challengeWeight": 0,
        "dryStreak": 3,
        "drooping": false,
        "rainSoon": true
      },
      {
        "id": "one",
        "name": "Single Ash Morning",
        "species": "plant",
        "palette": [
          "#6c9567",
          "#b7b874"
        ],
        "summary": "Silver ash for one morning.",
        "challengeWeight": 0,
        "dryStreak": 1,
        "drooping": false,
        "rainSoon": false
      },
      {
        "id": "two",
        "name": "Confirmed Ash Trail",
        "species": "plant",
        "palette": [
          "#7b8d60",
          "#c2a86f"
        ],
        "summary": "Silver ash for two mornings.",
        "challengeWeight": 0,
        "dryStreak": 2,
        "drooping": false,
        "rainSoon": false
      }
    ],
    "scene": {
      "theme": "rain",
      "prop": "calendar",
      "correctAct": "The two-day pattern shines into a clear route through the mist.",
      "correctHold": "Pip marks the morning and refuses to turn one clue into a certainty.",
      "wrongAct": "The group follows ordinary soot into a dead end as the real trail fades.",
      "wrongHold": "A confirmed trail disappears into the approaching Black Rain."
    },
    "reward": {
      "icon": "◫",
      "name": "Keeper of Memory",
      "description": "Pip learns that the present can only make sense when the past is remembered.",
      "accessory": "scarf"
    },
    "chapterTitle": "The Last Promise"
  },
  {
    "id": "care-first",
    "act": 2,
    "number": 7,
    "title": "Care Before the Flame",
    "subtitle": "The first true priority",
    "kind": "care",
    "goal": "Help anyone injured first. Otherwise secure a loose Promise Flame. If neither applies, hold position.",
    "intro": "Sable tears a Flame from the ward. The arch collapses, Juniper falls, and the Flame begins sliding toward the Wilddark.",
    "outro": "Pip reaches Juniper before the Flame. Sable stops—not because she was defeated, but because the new Promise chose a person first.",
    "features": [
      {
        "key": "injured",
        "label": "someone is injured"
      },
      {
        "key": "seed",
        "label": "a loose Promise Flame is present"
      },
      {
        "key": "noisy",
        "label": "alarms are sounding"
      }
    ],
    "actions": [
      {
        "id": "help",
        "label": "Help the injured",
        "shortLabel": "Help",
        "description": "Leave everything else and provide care.",
        "tone": "care"
      },
      {
        "id": "deliver",
        "label": "Secure the Flame",
        "shortLabel": "Secure Flame",
        "description": "Carry the loose Promise Flame to safety.",
        "tone": "work"
      },
      {
        "id": "wait",
        "label": "Hold position",
        "shortLabel": "Hold",
        "description": "Stay clear until help or recovery is needed.",
        "tone": "cautious"
      }
    ],
    "budget": 6,
    "par": 4,
    "minLessons": 4,
    "challengeCount": 4,
    "targetRuleId": "care-priority",
    "proofRequirements": [
      {
        "id": "care-branch",
        "label": "Show an injury with no loose Flame",
        "action": "help",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "truthy",
              "field": "injured"
            },
            {
              "op": "falsy",
              "field": "seed"
            }
          ]
        },
        "hint": "Use an injured person when no Flame is present.",
        "foilAction": "wait"
      },
      {
        "id": "work-branch",
        "label": "Show a loose Flame with no injury",
        "action": "deliver",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "falsy",
              "field": "injured"
            },
            {
              "op": "truthy",
              "field": "seed"
            }
          ]
        },
        "hint": "Use an unhurt scene with a loose Promise Flame.",
        "foilAction": "wait"
      },
      {
        "id": "priority-clash",
        "label": "Show that care comes first when both are present",
        "action": "help",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "truthy",
              "field": "injured"
            },
            {
              "op": "truthy",
              "field": "seed"
            }
          ]
        },
        "hint": "Use an injured person beside a loose Flame.",
        "foilAction": "deliver"
      },
      {
        "id": "fallback-branch",
        "label": "Show when Pip should hold position",
        "action": "wait",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "falsy",
              "field": "injured"
            },
            {
              "op": "falsy",
              "field": "seed"
            }
          ]
        },
        "hint": "Use a scene with neither injury nor loose Flame.",
        "foilAction": "deliver"
      }
    ],
    "rules": [
      {
        "id": "always-wait",
        "name": "always hold position",
        "complexity": 0,
        "clauses": [],
        "fallback": "wait",
        "description": "Pip never intervenes.",
        "order": 0
      },
      {
        "id": "always-seeds",
        "name": "always secure the Flame",
        "complexity": 0,
        "clauses": [],
        "fallback": "deliver",
        "description": "Every scene is treated as a Flame recovery.",
        "order": 1
      },
      {
        "id": "injury-only",
        "name": "help injuries, otherwise hold",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "injured"
            },
            "action": "help"
          }
        ],
        "fallback": "wait",
        "description": "Only injury matters.",
        "order": 0
      },
      {
        "id": "seed-only",
        "name": "secure Flames, otherwise hold",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "seed"
            },
            "action": "deliver"
          }
        ],
        "fallback": "wait",
        "description": "Only the Flame matters.",
        "order": 0
      },
      {
        "id": "seed-first",
        "name": "secure the Flame before helping",
        "complexity": 2,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "seed"
            },
            "action": "deliver"
          },
          {
            "when": {
              "op": "truthy",
              "field": "injured"
            },
            "action": "help"
          }
        ],
        "fallback": "wait",
        "description": "Property is protected before a person.",
        "order": 0
      },
      {
        "id": "care-priority",
        "name": "help first, otherwise secure the Flame",
        "complexity": 3,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "injured"
            },
            "action": "help"
          },
          {
            "when": {
              "op": "truthy",
              "field": "seed"
            },
            "action": "deliver"
          }
        ],
        "fallback": "wait",
        "description": "Urgent care comes before recovering the Flame.",
        "order": 0
      },
      {
        "id": "quiet-care",
        "name": "help only when alarms are quiet",
        "complexity": 4,
        "clauses": [
          {
            "when": {
              "op": "and",
              "args": [
                {
                  "op": "truthy",
                  "field": "injured"
                },
                {
                  "op": "falsy",
                  "field": "noisy"
                }
              ]
            },
            "action": "help"
          },
          {
            "when": {
              "op": "truthy",
              "field": "seed"
            },
            "action": "deliver"
          }
        ],
        "fallback": "wait",
        "description": "Noise wrongly cancels care.",
        "order": 0
      },
      {
        "id": "noise-wait",
        "name": "hold whenever alarms sound",
        "complexity": 5,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "noisy"
            },
            "action": "wait"
          },
          {
            "when": {
              "op": "truthy",
              "field": "injured"
            },
            "action": "help"
          },
          {
            "when": {
              "op": "truthy",
              "field": "seed"
            },
            "action": "deliver"
          }
        ],
        "fallback": "wait",
        "description": "Alarms override even an urgent injury.",
        "order": 0
      }
    ],
    "teachCases": [
      {
        "id": "injured",
        "name": "Bruised Rootkeeper",
        "species": "bird",
        "palette": [
          "#816a55",
          "#d4b65a"
        ],
        "summary": "Injured, with no loose Flame nearby.",
        "challengeWeight": 0,
        "injured": true,
        "seed": false,
        "noisy": false
      },
      {
        "id": "seed",
        "name": "Loose Promise Flame",
        "species": "mouse",
        "palette": [
          "#a58a77",
          "#e6c9a4"
        ],
        "summary": "A Flame is sliding free, but no one is injured.",
        "challengeWeight": 0,
        "injured": false,
        "seed": true,
        "noisy": false
      },
      {
        "id": "both",
        "name": "Juniper Beneath the Arch",
        "species": "bird",
        "palette": [
          "#788a5f",
          "#dbb956"
        ],
        "summary": "Juniper is injured beside a loose Promise Flame.",
        "challengeWeight": 0,
        "injured": true,
        "seed": true,
        "noisy": false
      },
      {
        "id": "neither",
        "name": "Clear Courtyard",
        "species": "snail",
        "palette": [
          "#8eac6b",
          "#d4b46e"
        ],
        "summary": "No injury and no loose Flame.",
        "challengeWeight": 0,
        "injured": false,
        "seed": false,
        "noisy": false
      },
      {
        "id": "both-noisy",
        "name": "Juniper, Alarms Ringing",
        "species": "fox",
        "palette": [
          "#b86d47",
          "#efc595"
        ],
        "summary": "Juniper is injured beside a Flame while alarms sound.",
        "challengeWeight": 0,
        "injured": true,
        "seed": true,
        "noisy": true
      },
      {
        "id": "seed-noisy",
        "name": "Ringing Flame Cradle",
        "species": "mole",
        "palette": [
          "#6b625a",
          "#d1af79"
        ],
        "summary": "A loose Flame is present and alarms are sounding, but no one is hurt.",
        "challengeWeight": 0,
        "injured": false,
        "seed": true,
        "noisy": true
      }
    ],
    "challengeCases": [
      {
        "id": "hurt-only",
        "name": "Fallen Warden",
        "species": "rabbit",
        "palette": [
          "#d4c0a9",
          "#f1dfc7"
        ],
        "summary": "Injured, with no loose Flame.",
        "challengeWeight": 1,
        "injured": true,
        "seed": false,
        "noisy": false
      },
      {
        "id": "delivery",
        "name": "Drifting Flame",
        "species": "beetle",
        "palette": [
          "#45574d",
          "#ca7449"
        ],
        "summary": "A loose Promise Flame with no injury.",
        "challengeWeight": 1,
        "injured": false,
        "seed": true,
        "noisy": false
      },
      {
        "id": "priority",
        "name": "Medic Under the Flame",
        "species": "bird",
        "palette": [
          "#a35d50",
          "#d9ad51"
        ],
        "summary": "An injured medic beside a loose Flame.",
        "challengeWeight": 2,
        "injured": true,
        "seed": true,
        "noisy": false
      },
      {
        "id": "idle",
        "name": "Stable Ward",
        "species": "cat",
        "palette": [
          "#9b816f",
          "#e4ccb0"
        ],
        "summary": "No injury and no loose Flame.",
        "challengeWeight": 0,
        "injured": false,
        "seed": false,
        "noisy": false
      },
      {
        "id": "loud-hurt",
        "name": "Crying Scout",
        "species": "otter",
        "palette": [
          "#715f52",
          "#d6b688"
        ],
        "summary": "Injured while alarms are sounding.",
        "challengeWeight": 0,
        "injured": true,
        "seed": false,
        "noisy": true
      },
      {
        "id": "loud-seed",
        "name": "Alarmed Flame Channel",
        "species": "turtle",
        "palette": [
          "#6d825d",
          "#aaa76c"
        ],
        "summary": "Loose Flame and loud alarms, but no injury.",
        "challengeWeight": 0,
        "injured": false,
        "seed": true,
        "noisy": true
      }
    ],
    "scene": {
      "theme": "care",
      "prop": "first-aid",
      "correctHelp": "Pip leaves the Flame and reaches the injured person first.",
      "correctDeliver": "With no one in danger, Pip guides the loose Flame into its cradle.",
      "correctWait": "Pip holds clear of a stable scene instead of inventing an emergency.",
      "wrong": "Pip protects the Flame while an injured person waits beneath it."
    },
    "reward": {
      "icon": "💚",
      "name": "Care Before Ceremony",
      "description": "Pip learns that the purpose of a Promise matters more than the object it protects."
    },
    "chapterTitle": "The Last Promise"
  },
  {
    "id": "moon-voices",
    "act": 2,
    "number": 8,
    "title": "Voices in the Moonhouse",
    "subtitle": "The setting changes the answer",
    "kind": "moonhouse",
    "goal": "At night, ask loud speakers to whisper. Welcome everyone else so Tovin's echo can answer safely.",
    "intro": "Tovin's unfinished intention lives in the Moonhouse. Strong voices wake echoes—but after sunset, strong voices also wake the lantern moths.",
    "outro": "The moths remain asleep and Tovin's echo completes its sentence: “I gave it away.” Rowan can no longer hide what the Gate failed to understand.",
    "features": [
      {
        "key": "night",
        "label": "speaks after sunset"
      },
      {
        "key": "noisy",
        "label": "speaks loudly"
      },
      {
        "key": "lantern",
        "label": "carries an echo lantern"
      }
    ],
    "actions": [
      {
        "id": "welcome",
        "label": "Speak normally",
        "shortLabel": "Speak",
        "description": "Let the voice enter the Moonhouse at full strength.",
        "tone": "kind"
      },
      {
        "id": "whisper",
        "label": "Whisper",
        "shortLabel": "Whisper",
        "description": "Lower the voice enough to protect the sleeping moths.",
        "tone": "cautious"
      },
      {
        "id": "wait",
        "label": "Stay silent",
        "shortLabel": "Silent",
        "description": "Do not wake the echo yet.",
        "tone": "firm"
      }
    ],
    "budget": 6,
    "par": 4,
    "minLessons": 4,
    "challengeCount": 4,
    "targetRuleId": "night-noise",
    "proofRequirements": [
      {
        "id": "day-noise",
        "label": "Show that a loud daytime voice is safe",
        "action": "welcome",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "falsy",
              "field": "night"
            },
            {
              "op": "truthy",
              "field": "noisy"
            }
          ]
        },
        "hint": "Use a loud speaker during daylight.",
        "foilAction": "whisper"
      },
      {
        "id": "night-noise",
        "label": "Show that a loud nighttime voice must whisper",
        "action": "whisper",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "truthy",
              "field": "night"
            },
            {
              "op": "truthy",
              "field": "noisy"
            },
            {
              "op": "falsy",
              "field": "lantern"
            }
          ]
        },
        "hint": "Use a loud speaker after sunset without relying on the lantern.",
        "foilAction": "welcome"
      },
      {
        "id": "night-quiet",
        "label": "Show that a quiet nighttime voice is safe",
        "action": "welcome",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "truthy",
              "field": "night"
            },
            {
              "op": "falsy",
              "field": "noisy"
            }
          ]
        },
        "hint": "Use a quiet speaker after sunset.",
        "foilAction": "whisper"
      },
      {
        "id": "lantern-irrelevant",
        "label": "Show that an echo lantern does not cancel the night rule",
        "action": "whisper",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "truthy",
              "field": "night"
            },
            {
              "op": "truthy",
              "field": "noisy"
            },
            {
              "op": "truthy",
              "field": "lantern"
            }
          ]
        },
        "hint": "Use a loud nighttime speaker carrying an echo lantern.",
        "foilAction": "welcome"
      }
    ],
    "rules": [
      {
        "id": "all-welcome",
        "name": "speak normally every time",
        "complexity": 0,
        "clauses": [],
        "fallback": "welcome",
        "description": "Every voice enters at full strength.",
        "order": 0
      },
      {
        "id": "all-whisper",
        "name": "whisper every time",
        "complexity": 0,
        "clauses": [],
        "fallback": "whisper",
        "description": "Every voice is lowered.",
        "order": 1
      },
      {
        "id": "noise",
        "name": "whisper for every loud voice",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "noisy"
            },
            "action": "whisper"
          }
        ],
        "fallback": "welcome",
        "description": "Volume matters at every hour.",
        "order": 0
      },
      {
        "id": "night-wait",
        "name": "stay silent after sunset",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "night"
            },
            "action": "wait"
          }
        ],
        "fallback": "welcome",
        "description": "Night closes the Moonhouse completely.",
        "order": 0
      },
      {
        "id": "lantern-welcome",
        "name": "speak normally only with an echo lantern",
        "complexity": 2,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "lantern"
            },
            "action": "welcome"
          }
        ],
        "fallback": "wait",
        "description": "The lantern is treated as permission.",
        "order": 0
      },
      {
        "id": "night-noise",
        "name": "whisper only for loud nighttime voices",
        "complexity": 3,
        "clauses": [
          {
            "when": {
              "op": "and",
              "args": [
                {
                  "op": "truthy",
                  "field": "night"
                },
                {
                  "op": "truthy",
                  "field": "noisy"
                }
              ]
            },
            "action": "whisper"
          }
        ],
        "fallback": "welcome",
        "description": "Both darkness and volume are required.",
        "order": 0
      },
      {
        "id": "night-quiet",
        "name": "whisper for quiet nighttime voices",
        "complexity": 3,
        "clauses": [
          {
            "when": {
              "op": "and",
              "args": [
                {
                  "op": "truthy",
                  "field": "night"
                },
                {
                  "op": "falsy",
                  "field": "noisy"
                }
              ]
            },
            "action": "whisper"
          }
        ],
        "fallback": "welcome",
        "description": "The volume condition is reversed.",
        "order": 0
      },
      {
        "id": "night-no-lantern",
        "name": "stay silent at night without a lantern",
        "complexity": 4,
        "clauses": [
          {
            "when": {
              "op": "and",
              "args": [
                {
                  "op": "truthy",
                  "field": "night"
                },
                {
                  "op": "falsy",
                  "field": "lantern"
                }
              ]
            },
            "action": "wait"
          },
          {
            "when": {
              "op": "truthy",
              "field": "noisy"
            },
            "action": "whisper"
          }
        ],
        "fallback": "welcome",
        "description": "A lantern is wrongly required.",
        "order": 0
      }
    ],
    "teachCases": [
      {
        "id": "day-loud",
        "name": "Rowan in Daylight",
        "species": "bird",
        "palette": [
          "#577fa1",
          "#ddba58"
        ],
        "summary": "Rowan speaks loudly during the day.",
        "challengeWeight": 0,
        "night": false,
        "noisy": true,
        "lantern": false
      },
      {
        "id": "night-loud",
        "name": "Lumi After Sunset",
        "species": "frog",
        "palette": [
          "#579463",
          "#d8c15a"
        ],
        "summary": "Lumi calls loudly after sunset.",
        "challengeWeight": 0,
        "night": true,
        "noisy": true,
        "lantern": false
      },
      {
        "id": "night-quiet",
        "name": "Juniper at Night",
        "species": "moth",
        "palette": [
          "#776f9b",
          "#d9c57b"
        ],
        "summary": "Juniper speaks quietly after sunset.",
        "challengeWeight": 0,
        "night": true,
        "noisy": false,
        "lantern": false
      },
      {
        "id": "day-quiet",
        "name": "Pip in Daylight",
        "species": "snail",
        "palette": [
          "#88a86b",
          "#d6b46d"
        ],
        "summary": "Pip speaks quietly during the day.",
        "challengeWeight": 0,
        "night": false,
        "noisy": false,
        "lantern": false
      },
      {
        "id": "night-lantern-loud",
        "name": "Rowan with Echo Lantern",
        "species": "fox",
        "palette": [
          "#b66d47",
          "#efc493"
        ],
        "summary": "Rowan speaks loudly at night while carrying an echo lantern.",
        "challengeWeight": 0,
        "night": true,
        "noisy": true,
        "lantern": true
      },
      {
        "id": "night-lantern-quiet",
        "name": "Lumi with Echo Lantern",
        "species": "mouse",
        "palette": [
          "#9f8774",
          "#e5c9a2"
        ],
        "summary": "Lumi speaks quietly at night with an echo lantern.",
        "challengeWeight": 0,
        "night": true,
        "noisy": false,
        "lantern": true
      }
    ],
    "challengeCases": [
      {
        "id": "owl",
        "name": "Quiet Night Witness",
        "species": "bird",
        "palette": [
          "#6b6674",
          "#d8bc65"
        ],
        "summary": "A quiet voice after sunset.",
        "challengeWeight": 1,
        "night": true,
        "noisy": false,
        "lantern": false
      },
      {
        "id": "jay-day",
        "name": "Daylight Herald",
        "species": "bird",
        "palette": [
          "#5c84a8",
          "#e1bc53"
        ],
        "summary": "A loud daytime voice carrying an echo lantern.",
        "challengeWeight": 1,
        "night": false,
        "noisy": true,
        "lantern": true
      },
      {
        "id": "bat-loud",
        "name": "Night Choir",
        "species": "bat",
        "palette": [
          "#6f628e",
          "#d5b39e"
        ],
        "summary": "A loud voice after sunset.",
        "challengeWeight": 2,
        "night": true,
        "noisy": true,
        "lantern": false
      },
      {
        "id": "rabbit-day",
        "name": "Quiet Day Witness",
        "species": "rabbit",
        "palette": [
          "#d4c1ab",
          "#eedec8"
        ],
        "summary": "A quiet daytime voice.",
        "challengeWeight": 0,
        "night": false,
        "noisy": false,
        "lantern": false
      },
      {
        "id": "goose-night",
        "name": "Lantern-Bearing Shout",
        "species": "bird",
        "palette": [
          "#e8e4d4",
          "#da9c49"
        ],
        "summary": "A loud nighttime voice with an echo lantern.",
        "challengeWeight": 0,
        "night": true,
        "noisy": true,
        "lantern": true
      },
      {
        "id": "beetle-day",
        "name": "Day Lantern Whisper",
        "species": "beetle",
        "palette": [
          "#45564d",
          "#c96f48"
        ],
        "summary": "A quiet daytime voice with an echo lantern.",
        "challengeWeight": 0,
        "night": false,
        "noisy": false,
        "lantern": true
      }
    ],
    "scene": {
      "theme": "moon",
      "prop": "calendar",
      "correctWelcome": "The voice reaches Tovin's echo without disturbing the room.",
      "correctWhisper": "The echo hears the words while the lantern moths remain folded in sleep.",
      "correctWait": "The Moonhouse stays still until a safe voice is ready.",
      "wrong": "The wrong volume wakes a storm of lantern moths and scatters the echo."
    },
    "reward": {
      "icon": "🌙",
      "name": "Context Listener",
      "description": "Pip learns that the same action can be right in one setting and harmful in another."
    },
    "chapterTitle": "The Last Promise"
  },
  {
    "id": "matching-tools",
    "act": 3,
    "number": 9,
    "title": "The Stolen Flames",
    "subtitle": "Match relationships, not appearances",
    "kind": "flames",
    "goal": "Return a Promise Flame only when its rune matches the Heart channel. Otherwise place it in the safe ring.",
    "intro": "Sable's Unbinding scatters Flames among nearly identical channels. A Flame's color is not enough; its rune must match the channel that remembers it.",
    "outro": "The matched Flames settle into their channels. Across Mossgrove, the first failed systems begin remembering themselves—but the final Flame remains with Sable.",
    "features": [
      {
        "key": "toolMark",
        "label": "Promise Flame rune"
      },
      {
        "key": "ownerMark",
        "label": "Heart channel rune"
      },
      {
        "key": "urgent",
        "label": "channel is flickering urgently"
      }
    ],
    "actions": [
      {
        "id": "act",
        "label": "Return the Flame",
        "shortLabel": "Return Flame",
        "description": "Place the Flame into this Heart channel.",
        "tone": "kind"
      },
      {
        "id": "hold",
        "label": "Use the safe ring",
        "shortLabel": "Safe ring",
        "description": "Keep the Flame separate until its channel is found.",
        "tone": "cautious"
      }
    ],
    "budget": 5,
    "par": 3,
    "minLessons": 3,
    "challengeCount": 4,
    "targetRuleId": "marks-match",
    "proofRequirements": [
      {
        "id": "nonblue-match",
        "label": "Show a matching rune pair that is not blue",
        "action": "act",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "sameFields",
              "left": "toolMark",
              "right": "ownerMark"
            },
            {
              "op": "neq",
              "field": "toolMark",
              "value": "blue"
            }
          ]
        },
        "hint": "Use a matching pair of another rune color."
      },
      {
        "id": "plain-mismatch",
        "label": "Show a Flame and channel that do not match",
        "action": "hold",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "differentFields",
              "left": "toolMark",
              "right": "ownerMark"
            },
            {
              "op": "falsy",
              "field": "urgent"
            }
          ]
        },
        "hint": "Use two different runes."
      },
      {
        "id": "urgent-mismatch",
        "label": "Show that urgency does not create a match",
        "action": "hold",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "differentFields",
              "left": "toolMark",
              "right": "ownerMark"
            },
            {
              "op": "truthy",
              "field": "urgent"
            }
          ]
        },
        "hint": "Use a flickering channel with the wrong Flame rune."
      }
    ],
    "rules": [
      {
        "id": "all",
        "name": "return every Flame",
        "complexity": 0,
        "clauses": [],
        "fallback": "act",
        "description": "Every Flame is placed into the shown channel.",
        "order": 0
      },
      {
        "id": "none",
        "name": "return no Flames",
        "complexity": 0,
        "clauses": [],
        "fallback": "hold",
        "description": "Every Flame stays in the safe ring.",
        "order": 1
      },
      {
        "id": "urgent",
        "name": "return Flames to urgent channels",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "urgent"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Flickering urgency is treated as proof.",
        "order": 0
      },
      {
        "id": "blue-tool",
        "name": "return blue-rune Flames",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "eq",
              "field": "toolMark",
              "value": "blue"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "The Flame rune alone decides.",
        "order": 0
      },
      {
        "id": "blue-owner",
        "name": "return Flames to blue-rune channels",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "eq",
              "field": "ownerMark",
              "value": "blue"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "The channel rune alone decides.",
        "order": 0
      },
      {
        "id": "marks-match",
        "name": "return Flames when the runes match",
        "complexity": 2,
        "clauses": [
          {
            "when": {
              "op": "sameFields",
              "left": "toolMark",
              "right": "ownerMark"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "The Flame and channel must correspond.",
        "order": 0
      },
      {
        "id": "marks-differ",
        "name": "restore when runes differ",
        "complexity": 2,
        "clauses": [
          {
            "when": {
              "op": "differentFields",
              "left": "toolMark",
              "right": "ownerMark"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Different runes are incorrectly treated as a match.",
        "order": 0
      },
      {
        "id": "match-or-urgent",
        "name": "return matching Flames or urgent channels",
        "complexity": 4,
        "clauses": [
          {
            "when": {
              "op": "or",
              "args": [
                {
                  "op": "sameFields",
                  "left": "toolMark",
                  "right": "ownerMark"
                },
                {
                  "op": "truthy",
                  "field": "urgent"
                }
              ]
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Urgency wrongly overrides a mismatch.",
        "order": 0
      }
    ],
    "teachCases": [
      {
        "id": "blue-blue",
        "name": "Blue Flame · Blue Channel",
        "species": "mole",
        "palette": [
          "#61718c",
          "#cfb17c"
        ],
        "summary": "Flame rune blue; channel rune blue.",
        "challengeWeight": 0,
        "toolMark": "blue",
        "ownerMark": "blue",
        "urgent": false
      },
      {
        "id": "blue-gold",
        "name": "Blue Flame · Gold Channel",
        "species": "fox",
        "palette": [
          "#b26b46",
          "#edc291"
        ],
        "summary": "Flame rune blue; channel rune gold; the channel is flickering urgently.",
        "challengeWeight": 0,
        "toolMark": "blue",
        "ownerMark": "gold",
        "urgent": true
      },
      {
        "id": "gold-gold",
        "name": "Gold Flame · Gold Channel",
        "species": "rabbit",
        "palette": [
          "#d2bfaa",
          "#ecddc7"
        ],
        "summary": "Flame rune gold; channel rune gold.",
        "challengeWeight": 0,
        "toolMark": "gold",
        "ownerMark": "gold",
        "urgent": false
      },
      {
        "id": "gold-blue",
        "name": "Gold Flame · Blue Channel",
        "species": "bird",
        "palette": [
          "#587da0",
          "#dbb957"
        ],
        "summary": "Flame rune gold; channel rune blue.",
        "challengeWeight": 0,
        "toolMark": "gold",
        "ownerMark": "blue",
        "urgent": false
      },
      {
        "id": "green-green",
        "name": "Green Flame · Green Channel",
        "species": "turtle",
        "palette": [
          "#70815d",
          "#aaa56d"
        ],
        "summary": "Flame rune green; channel rune green; the channel is flickering urgently.",
        "challengeWeight": 0,
        "toolMark": "green",
        "ownerMark": "green",
        "urgent": true
      },
      {
        "id": "green-gold",
        "name": "Green Flame · Gold Channel",
        "species": "cat",
        "palette": [
          "#967e6c",
          "#dfc9af"
        ],
        "summary": "Flame rune green; channel rune gold; the channel is flickering urgently.",
        "challengeWeight": 0,
        "toolMark": "green",
        "ownerMark": "gold",
        "urgent": true
      }
    ],
    "challengeCases": [
      {
        "id": "blue-match",
        "name": "Blue Flame · Blue Channel",
        "species": "bird",
        "palette": [
          "#687da1",
          "#dcb75a"
        ],
        "summary": "Flame rune blue; channel rune blue; the channel is flickering urgently.",
        "challengeWeight": 1,
        "toolMark": "blue",
        "ownerMark": "blue",
        "urgent": true
      },
      {
        "id": "gold-mismatch",
        "name": "Gold Flame · Blue Channel",
        "species": "otter",
        "palette": [
          "#756052",
          "#d5b486"
        ],
        "summary": "Flame rune gold; channel rune blue; the channel is flickering urgently.",
        "challengeWeight": 1,
        "toolMark": "gold",
        "ownerMark": "blue",
        "urgent": true
      },
      {
        "id": "green-match",
        "name": "Green Flame · Green Channel",
        "species": "beetle",
        "palette": [
          "#45584d",
          "#c77247"
        ],
        "summary": "Flame rune green; channel rune green.",
        "challengeWeight": 1,
        "toolMark": "green",
        "ownerMark": "green",
        "urgent": false
      },
      {
        "id": "blue-green",
        "name": "Blue Flame · Green Channel",
        "species": "snail",
        "palette": [
          "#89a96c",
          "#d6b46d"
        ],
        "summary": "Flame rune blue; channel rune green.",
        "challengeWeight": 0,
        "toolMark": "blue",
        "ownerMark": "green",
        "urgent": false
      },
      {
        "id": "gold-match",
        "name": "Gold Flame · Gold Channel",
        "species": "mouse",
        "palette": [
          "#a18a76",
          "#e5c9a1"
        ],
        "summary": "Flame rune gold; channel rune gold; the channel is flickering urgently.",
        "challengeWeight": 0,
        "toolMark": "gold",
        "ownerMark": "gold",
        "urgent": true
      },
      {
        "id": "green-blue",
        "name": "Green Flame · Blue Channel",
        "species": "badger",
        "palette": [
          "#4c4f53",
          "#d6d0bb"
        ],
        "summary": "Flame rune green; channel rune blue.",
        "challengeWeight": 0,
        "toolMark": "green",
        "ownerMark": "blue",
        "urgent": false
      }
    ],
    "scene": {
      "theme": "festival",
      "prop": "lantern-gate",
      "correctAct": "Matching runes lock together and the Promise Flame remembers its place.",
      "correctHold": "The mismatched Flame rests safely outside the Heart.",
      "wrongAct": "Two different Promises collide and send a false command through the valley.",
      "wrongHold": "A true match dims in the safe ring while its empty channel fails."
    },
    "reward": {
      "icon": "◇",
      "name": "Relationship Reader",
      "description": "Pip learns to compare two things directly instead of judging either one alone."
    },
    "chapterTitle": "The Last Promise"
  },
  {
    "id": "garden-rhythm",
    "act": 3,
    "number": 10,
    "title": "The Echo Procession",
    "subtitle": "Notice what changed",
    "kind": "echo",
    "goal": "Signal the real path when the current echo's sigil differs from the previous echo's sigil. Ignore exact repeats.",
    "intro": "Sable fills the procession road with repeating copies of the group. The real route only appears when the echo pattern changes.",
    "outro": "Pip ignores the perfect repeats and signals the true changes. Lumi recognizes Sable's hidden rhythm and chooses to lead the pursuit against her.",
    "features": [
      {
        "key": "currentTone",
        "label": "current echo sigil"
      },
      {
        "key": "lastTone",
        "label": "previous echo sigil"
      },
      {
        "key": "thirdVisit",
        "label": "is the third echo in the sequence"
      }
    ],
    "actions": [
      {
        "id": "act",
        "label": "Signal the change",
        "shortLabel": "Signal",
        "description": "Mark this echo as a real change in the route.",
        "tone": "kind"
      },
      {
        "id": "hold",
        "label": "Ignore the repeat",
        "shortLabel": "Ignore",
        "description": "Let an exact repetition fade away.",
        "tone": "cautious"
      }
    ],
    "budget": 5,
    "par": 3,
    "minLessons": 3,
    "challengeCount": 4,
    "targetRuleId": "tone-changed",
    "proofRequirements": [
      {
        "id": "high-after-low",
        "label": "Show a bright sigil after a dark one",
        "action": "act",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "eq",
              "field": "currentTone",
              "value": "high"
            },
            {
              "op": "eq",
              "field": "lastTone",
              "value": "low"
            }
          ]
        },
        "hint": "Use a current sigil that differs from the previous sigil."
      },
      {
        "id": "low-after-high",
        "label": "Show a dark sigil after a bright one",
        "action": "act",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "eq",
              "field": "currentTone",
              "value": "low"
            },
            {
              "op": "eq",
              "field": "lastTone",
              "value": "high"
            }
          ]
        },
        "hint": "Use the opposite kind of change."
      },
      {
        "id": "repeat-negative",
        "label": "Show that the same sigil is a repeat",
        "action": "hold",
        "when": {
          "op": "sameFields",
          "left": "currentTone",
          "right": "lastTone"
        },
        "hint": "Use matching current and previous sigils."
      }
    ],
    "rules": [
      {
        "id": "all",
        "name": "signal every echo",
        "complexity": 0,
        "clauses": [],
        "fallback": "act",
        "description": "Every echo is treated as a change.",
        "order": 0
      },
      {
        "id": "none",
        "name": "signal no echoes",
        "complexity": 0,
        "clauses": [],
        "fallback": "hold",
        "description": "Every echo is ignored.",
        "order": 1
      },
      {
        "id": "current-high",
        "name": "ring for high current signs",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "eq",
              "field": "currentTone",
              "value": "high"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Only the current sign matters.",
        "order": 0
      },
      {
        "id": "last-high",
        "name": "ring after high previous signs",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "eq",
              "field": "lastTone",
              "value": "high"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Only the previous sign matters.",
        "order": 0
      },
      {
        "id": "third",
        "name": "signal every third echo",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "thirdVisit"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Position in the sequence is treated as the cause.",
        "order": 0
      },
      {
        "id": "tone-changed",
        "name": "signal when the sigil changes",
        "complexity": 2,
        "clauses": [
          {
            "when": {
              "op": "differentFields",
              "left": "currentTone",
              "right": "lastTone"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "The current sigil must differ from the previous one.",
        "order": 0
      },
      {
        "id": "tone-same",
        "name": "signal exact repeats",
        "complexity": 2,
        "clauses": [
          {
            "when": {
              "op": "sameFields",
              "left": "currentTone",
              "right": "lastTone"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Matching sigils are treated as the real path.",
        "order": 0
      },
      {
        "id": "changed-third",
        "name": "signal changes only on the third echo",
        "complexity": 4,
        "clauses": [
          {
            "when": {
              "op": "and",
              "args": [
                {
                  "op": "differentFields",
                  "left": "currentTone",
                  "right": "lastTone"
                },
                {
                  "op": "truthy",
                  "field": "thirdVisit"
                }
              ]
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "A real change is ignored unless it happens third.",
        "order": 0
      }
    ],
    "teachCases": [
      {
        "id": "low-high",
        "name": "Bright → Dark Echo",
        "species": "bird",
        "palette": [
          "#6b84a3",
          "#d9b454"
        ],
        "summary": "Previous sigil bright; current sigil dark.",
        "challengeWeight": 0,
        "currentTone": "low",
        "lastTone": "high",
        "thirdVisit": false
      },
      {
        "id": "high-high",
        "name": "Bright → Bright Echo",
        "species": "frog",
        "palette": [
          "#5b9865",
          "#dec35a"
        ],
        "summary": "Previous sigil bright; current sigil bright.",
        "challengeWeight": 0,
        "currentTone": "high",
        "lastTone": "high",
        "thirdVisit": false
      },
      {
        "id": "high-low",
        "name": "Dark → Bright Echo",
        "species": "moth",
        "palette": [
          "#776c96",
          "#d9c47a"
        ],
        "summary": "Previous sigil dark; current sigil bright; third echo in the sequence.",
        "challengeWeight": 0,
        "currentTone": "high",
        "lastTone": "low",
        "thirdVisit": true
      },
      {
        "id": "low-low",
        "name": "Dark → Dark Echo",
        "species": "snail",
        "palette": [
          "#88a96b",
          "#d5b36c"
        ],
        "summary": "Previous sigil dark; current sigil dark; third echo in the sequence.",
        "challengeWeight": 0,
        "currentTone": "low",
        "lastTone": "low",
        "thirdVisit": true
      },
      {
        "id": "high-low-notthird",
        "name": "Dark → Bright Echo",
        "species": "fox",
        "palette": [
          "#b36b46",
          "#ecc08e"
        ],
        "summary": "Previous sigil dark; current sigil bright.",
        "challengeWeight": 0,
        "currentTone": "high",
        "lastTone": "low",
        "thirdVisit": false
      },
      {
        "id": "low-high-third",
        "name": "Bright → Dark Echo",
        "species": "mouse",
        "palette": [
          "#9e8673",
          "#e2c69f"
        ],
        "summary": "Previous sigil bright; current sigil dark; third echo in the sequence.",
        "challengeWeight": 0,
        "currentTone": "low",
        "lastTone": "high",
        "thirdVisit": true
      }
    ],
    "challengeCases": [
      {
        "id": "change-one",
        "name": "Dark → Bright Echo",
        "species": "bird",
        "palette": [
          "#5e7fa1",
          "#dcb75a"
        ],
        "summary": "Previous sigil dark; current sigil bright.",
        "challengeWeight": 1,
        "currentTone": "high",
        "lastTone": "low",
        "thirdVisit": false
      },
      {
        "id": "repeat-high",
        "name": "Bright → Bright Echo",
        "species": "frog",
        "palette": [
          "#599663",
          "#dec05a"
        ],
        "summary": "Previous sigil bright; current sigil bright; third echo in the sequence.",
        "challengeWeight": 1,
        "currentTone": "high",
        "lastTone": "high",
        "thirdVisit": true
      },
      {
        "id": "change-two",
        "name": "Bright → Dark Echo",
        "species": "moth",
        "palette": [
          "#776e98",
          "#d9c47b"
        ],
        "summary": "Previous sigil bright; current sigil dark; third echo in the sequence.",
        "challengeWeight": 1,
        "currentTone": "low",
        "lastTone": "high",
        "thirdVisit": true
      },
      {
        "id": "repeat-low",
        "name": "Dark → Dark Echo",
        "species": "snail",
        "palette": [
          "#87a76a",
          "#d5b36b"
        ],
        "summary": "Previous sigil dark; current sigil dark.",
        "challengeWeight": 0,
        "currentTone": "low",
        "lastTone": "low",
        "thirdVisit": false
      },
      {
        "id": "change-third",
        "name": "Dark → Bright Echo",
        "species": "fox",
        "palette": [
          "#b26b46",
          "#edc290"
        ],
        "summary": "Previous sigil dark; current sigil bright; third echo in the sequence.",
        "challengeWeight": 0,
        "currentTone": "high",
        "lastTone": "low",
        "thirdVisit": true
      },
      {
        "id": "repeat-third",
        "name": "Dark → Dark Echo",
        "species": "mouse",
        "palette": [
          "#a08874",
          "#e4c8a0"
        ],
        "summary": "Previous sigil dark; current sigil dark; third echo in the sequence.",
        "challengeWeight": 0,
        "currentTone": "low",
        "lastTone": "low",
        "thirdVisit": true
      }
    ],
    "scene": {
      "theme": "moon",
      "prop": "bell",
      "correctAct": "The changed sigil opens a real step through the echo road.",
      "correctHold": "The repeated copy folds into itself and disappears.",
      "wrongAct": "Pip follows a perfect repeat into another loop of the same road.",
      "wrongHold": "A true change fades before the group can take the path."
    },
    "reward": {
      "icon": "≠",
      "name": "Change Finder",
      "description": "Pip learns that the difference from what came before can matter more than either thing alone."
    },
    "chapterTitle": "The Last Promise"
  },
  {
    "id": "weather-wisdom",
    "act": 3,
    "number": 11,
    "title": "Before the Black Rain",
    "subtitle": "A threshold with an exception",
    "kind": "storm",
    "goal": "Cool the living arch at 28° or hotter, unless Black Rain is already coming.",
    "intro": "The path to the Heart is alive and overheating. Cooling saves it in clear heat, but Black Rain will cool it safely—and added water would make the arch split.",
    "outro": "Pip cools only the arches that truly need it. The path holds as the first black drops strike Mossgrove.",
    "features": [
      {
        "key": "temperature",
        "label": "arch temperature"
      },
      {
        "key": "rainSoon",
        "label": "Black Rain is coming"
      },
      {
        "key": "windy",
        "label": "Wilddark wind is strong"
      }
    ],
    "actions": [
      {
        "id": "act",
        "label": "Cool the arch",
        "shortLabel": "Cool arch",
        "description": "Release cooling water through the living stone.",
        "tone": "kind"
      },
      {
        "id": "hold",
        "label": "Trust the rain",
        "shortLabel": "Hold",
        "description": "Leave the arch dry and let the coming rain cool it.",
        "tone": "cautious"
      }
    ],
    "budget": 6,
    "par": 4,
    "minLessons": 4,
    "challengeCount": 4,
    "targetRuleId": "hot-no-rain",
    "proofRequirements": [
      {
        "id": "below-threshold",
        "label": "Show a clear arch below 28°",
        "action": "hold",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "lt",
              "field": "temperature",
              "value": 28
            },
            {
              "op": "falsy",
              "field": "rainSoon"
            }
          ]
        },
        "hint": "Use a clear-weather arch below the danger point."
      },
      {
        "id": "at-threshold",
        "label": "Show a clear arch at exactly 28°",
        "action": "act",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "eq",
              "field": "temperature",
              "value": 28
            },
            {
              "op": "falsy",
              "field": "rainSoon"
            }
          ]
        },
        "hint": "Use a clear-weather arch at the exact danger point."
      },
      {
        "id": "rain-override",
        "label": "Show that Black Rain stops cooling on a hot arch",
        "action": "hold",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "gte",
              "field": "temperature",
              "value": 28
            },
            {
              "op": "lte",
              "field": "temperature",
              "value": 31
            },
            {
              "op": "truthy",
              "field": "rainSoon"
            }
          ]
        },
        "hint": "Use a hot arch when Black Rain is coming."
      },
      {
        "id": "strong-override",
        "label": "Show that the rain exception still holds in extreme heat",
        "action": "hold",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "gte",
              "field": "temperature",
              "value": 32
            },
            {
              "op": "truthy",
              "field": "rainSoon"
            }
          ]
        },
        "hint": "Use a very hot arch with Black Rain coming."
      }
    ],
    "rules": [
      {
        "id": "all",
        "name": "cool every arch",
        "complexity": 0,
        "clauses": [],
        "fallback": "act",
        "description": "Every arch receives cooling water.",
        "order": 0
      },
      {
        "id": "none",
        "name": "cool no arches",
        "complexity": 0,
        "clauses": [],
        "fallback": "hold",
        "description": "No arch receives cooling.",
        "order": 1
      },
      {
        "id": "warm-24",
        "name": "water at 24° or higher",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "gte",
              "field": "temperature",
              "value": 24
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Water starts at 24°.",
        "order": 0
      },
      {
        "id": "hot-28",
        "name": "cool arches at 28° or hotter",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "gte",
              "field": "temperature",
              "value": 28
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "The heat threshold matters, but rain is ignored.",
        "order": 0
      },
      {
        "id": "very-hot-32",
        "name": "water at 32° or higher",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "gte",
              "field": "temperature",
              "value": 32
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Water starts at 32°.",
        "order": 0
      },
      {
        "id": "no-rain",
        "name": "water whenever rain is absent",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "falsy",
              "field": "rainSoon"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Forecast alone determines watering.",
        "order": 0
      },
      {
        "id": "windy",
        "name": "water in strong wind",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "windy"
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Wind determines watering.",
        "order": 0
      },
      {
        "id": "hot-no-rain",
        "name": "cool hot arches unless Black Rain is coming",
        "complexity": 4,
        "clauses": [
          {
            "when": {
              "op": "and",
              "args": [
                {
                  "op": "gte",
                  "field": "temperature",
                  "value": 28
                },
                {
                  "op": "falsy",
                  "field": "rainSoon"
                }
              ]
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "Heat triggers cooling, with a rain exception.",
        "order": 0
      },
      {
        "id": "warm-no-rain",
        "name": "cool at 25° unless rain is coming",
        "complexity": 4,
        "clauses": [
          {
            "when": {
              "op": "and",
              "args": [
                {
                  "op": "gte",
                  "field": "temperature",
                  "value": 24
                },
                {
                  "op": "falsy",
                  "field": "rainSoon"
                }
              ]
            },
            "action": "act"
          }
        ],
        "fallback": "hold",
        "description": "The threshold is set too low.",
        "order": 0
      }
    ],
    "teachCases": [
      {
        "id": "cool",
        "name": "24° Clear Arch",
        "species": "plant",
        "palette": [
          "#5a9564",
          "#9fc476"
        ],
        "summary": "Arch temperature 24°; no rain is expected.",
        "challengeWeight": 0,
        "temperature": 24,
        "rainSoon": false,
        "windy": false
      },
      {
        "id": "hot",
        "name": "29° Clear Arch",
        "species": "flower",
        "palette": [
          "#c46365",
          "#e2bf5a"
        ],
        "summary": "Arch temperature 29°; no rain is expected.",
        "challengeWeight": 0,
        "temperature": 29,
        "rainSoon": false,
        "windy": false
      },
      {
        "id": "hot-rain",
        "name": "30° Black Rain Arch",
        "species": "plant",
        "palette": [
          "#6c7f78",
          "#a9ad72"
        ],
        "summary": "Arch temperature 30°; Black Rain is approaching; Wilddark wind is strong.",
        "challengeWeight": 0,
        "temperature": 30,
        "rainSoon": true,
        "windy": true
      },
      {
        "id": "very-hot-rain",
        "name": "34° Black Rain Arch",
        "species": "flower",
        "palette": [
          "#b9676e",
          "#dcbc5a"
        ],
        "summary": "Arch temperature 34°; Black Rain is approaching.",
        "challengeWeight": 0,
        "temperature": 34,
        "rainSoon": true,
        "windy": false
      },
      {
        "id": "warm-wind",
        "name": "26° Clear Arch",
        "species": "plant",
        "palette": [
          "#708c62",
          "#b1b871"
        ],
        "summary": "Arch temperature 26°; no rain is expected; Wilddark wind is strong.",
        "challengeWeight": 0,
        "temperature": 26,
        "rainSoon": false,
        "windy": true
      },
      {
        "id": "threshold",
        "name": "28° Clear Arch",
        "species": "flower",
        "palette": [
          "#bf6d69",
          "#dfbd5b"
        ],
        "summary": "Arch temperature 28°; no rain is expected.",
        "challengeWeight": 0,
        "temperature": 28,
        "rainSoon": false,
        "windy": false
      }
    ],
    "challengeCases": [
      {
        "id": "below",
        "name": "27° Clear Arch",
        "species": "plant",
        "palette": [
          "#659565",
          "#a8c178"
        ],
        "summary": "Arch temperature 27°; no rain is expected.",
        "challengeWeight": 1,
        "temperature": 27,
        "rainSoon": false,
        "windy": false
      },
      {
        "id": "exact-clear",
        "name": "28° Clear Arch",
        "species": "flower",
        "palette": [
          "#be6a66",
          "#dfbd59"
        ],
        "summary": "Arch temperature 28°; no rain is expected.",
        "challengeWeight": 2,
        "temperature": 28,
        "rainSoon": false,
        "windy": false
      },
      {
        "id": "exact-rain",
        "name": "28° Black Rain Arch",
        "species": "flower",
        "palette": [
          "#aa6d75",
          "#d6b75b"
        ],
        "summary": "Arch temperature 28°; Black Rain is approaching.",
        "challengeWeight": 2,
        "temperature": 28,
        "rainSoon": true,
        "windy": false
      },
      {
        "id": "above",
        "name": "31° Clear Arch",
        "species": "flower",
        "palette": [
          "#c15f63",
          "#e0bd58"
        ],
        "summary": "Arch temperature 31°; no rain is expected; Wilddark wind is strong.",
        "challengeWeight": 1,
        "temperature": 31,
        "rainSoon": false,
        "windy": true
      },
      {
        "id": "cool-rain",
        "name": "23° Black Rain Arch",
        "species": "plant",
        "palette": [
          "#5e8871",
          "#9eb279"
        ],
        "summary": "Arch temperature 23°; Black Rain is approaching; Wilddark wind is strong.",
        "challengeWeight": 0,
        "temperature": 23,
        "rainSoon": true,
        "windy": true
      },
      {
        "id": "very-hot",
        "name": "35° Clear Arch",
        "species": "flower",
        "palette": [
          "#c3545e",
          "#ddb954"
        ],
        "summary": "Arch temperature 35°; no rain is expected.",
        "challengeWeight": 0,
        "temperature": 35,
        "rainSoon": false,
        "windy": false
      },
      {
        "id": "very-hot-rain-challenge",
        "name": "35° Black Rain Arch",
        "species": "flower",
        "palette": [
          "#9f6b78",
          "#d5b45a"
        ],
        "summary": "Arch temperature 35°; Black Rain is approaching.",
        "challengeWeight": 2,
        "temperature": 35,
        "rainSoon": true,
        "windy": false
      },
      {
        "id": "warm",
        "name": "25° Clear Arch",
        "species": "plant",
        "palette": [
          "#6f9565",
          "#afbd76"
        ],
        "summary": "Arch temperature 25°; no rain is expected.",
        "challengeWeight": 0,
        "temperature": 25,
        "rainSoon": false,
        "windy": false
      }
    ],
    "scene": {
      "theme": "rain",
      "prop": "thermometer",
      "correctAct": "Cooling water lowers the living stone before it begins to crack.",
      "correctHold": "The arch remains dry and the coming Black Rain cools it safely.",
      "wrongAct": "Added water meets the Black Rain and splits the living stone.",
      "wrongHold": "The clear-weather arch overheats and curls away from the path."
    },
    "reward": {
      "icon": "☂",
      "name": "Exception Thinker",
      "description": "Pip learns that a strong general rule can still need a specific exception."
    },
    "chapterTitle": "The Last Promise"
  },
  {
    "id": "festival-gate",
    "act": 3,
    "number": 12,
    "title": "The Last Promise",
    "subtitle": "What the rule is for",
    "kind": "heart",
    "goal": "Rescue anyone injured. Otherwise open the inner ring for calm Heart-seal holders. Hold everyone else outside.",
    "intro": "The Heart chamber is breaking. Sable is hurt beside the last Flame while authorized helpers and unstable echoes reach the inner ring at once.",
    "outro": "Pip reaches Sable before the Flame. The community holds the lantern line, and the final Promise is written by witnesses instead of one unquestioned Keeper.",
    "features": [
      {
        "key": "injured",
        "label": "is injured"
      },
      {
        "key": "permit",
        "label": "carries a Heart seal"
      },
      {
        "key": "noisy",
        "label": "is destabilizing the chamber"
      }
    ],
    "actions": [
      {
        "id": "help",
        "label": "Rescue immediately",
        "shortLabel": "Rescue",
        "description": "Enter the danger zone and pull the injured person to safety.",
        "tone": "care"
      },
      {
        "id": "admit",
        "label": "Open the inner ring",
        "shortLabel": "Open ring",
        "description": "Admit a stable helper who carries a Heart seal.",
        "tone": "kind"
      },
      {
        "id": "wait",
        "label": "Hold the threshold",
        "shortLabel": "Hold",
        "description": "Keep the chamber closed until the arrival is stable and authorized.",
        "tone": "firm"
      }
    ],
    "budget": 7,
    "par": 5,
    "minLessons": 5,
    "challengeCount": 5,
    "targetRuleId": "festival-steward",
    "proofRequirements": [
      {
        "id": "care-only",
        "label": "Show that an unstable injured person is rescued",
        "action": "help",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "truthy",
              "field": "injured"
            },
            {
              "op": "falsy",
              "field": "permit"
            },
            {
              "op": "truthy",
              "field": "noisy"
            }
          ]
        },
        "hint": "Use an injured, destabilizing arrival without a Heart seal.",
        "foilAction": "wait"
      },
      {
        "id": "admission-branch",
        "label": "Show that a calm Heart-seal holder may enter",
        "action": "admit",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "falsy",
              "field": "injured"
            },
            {
              "op": "truthy",
              "field": "permit"
            },
            {
              "op": "falsy",
              "field": "noisy"
            }
          ]
        },
        "hint": "Use an unhurt, stable Heart-seal holder.",
        "foilAction": "wait"
      },
      {
        "id": "noise-blocks-entry",
        "label": "Show that an unstable seal holder must wait",
        "action": "wait",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "falsy",
              "field": "injured"
            },
            {
              "op": "truthy",
              "field": "permit"
            },
            {
              "op": "truthy",
              "field": "noisy"
            }
          ]
        },
        "hint": "Use an unhurt Heart-seal holder who is destabilizing the chamber.",
        "foilAction": "admit"
      },
      {
        "id": "ordinary-fallback",
        "label": "Show that an unsealed arrival must wait",
        "action": "wait",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "falsy",
              "field": "injured"
            },
            {
              "op": "falsy",
              "field": "permit"
            }
          ]
        },
        "hint": "Use an unhurt arrival with no Heart seal.",
        "foilAction": "admit"
      },
      {
        "id": "care-overrides-all",
        "label": "Show that rescue comes before authority",
        "action": "help",
        "when": {
          "op": "and",
          "args": [
            {
              "op": "truthy",
              "field": "injured"
            },
            {
              "op": "truthy",
              "field": "permit"
            },
            {
              "op": "falsy",
              "field": "noisy"
            }
          ]
        },
        "hint": "Use an injured, calm Heart-seal holder.",
        "foilAction": "admit"
      }
    ],
    "rules": [
      {
        "id": "all-wait",
        "name": "hold everyone outside",
        "complexity": 0,
        "clauses": [],
        "fallback": "wait",
        "description": "No one is rescued or admitted.",
        "order": 0
      },
      {
        "id": "all-admit",
        "name": "open the ring for everyone",
        "complexity": 0,
        "clauses": [],
        "fallback": "admit",
        "description": "Every arrival enters the chamber.",
        "order": 1
      },
      {
        "id": "injury-only",
        "name": "rescue injuries, otherwise hold",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "injured"
            },
            "action": "help"
          }
        ],
        "fallback": "wait",
        "description": "Only injury matters.",
        "order": 0
      },
      {
        "id": "permit-only",
        "name": "admit every Heart-seal holder",
        "complexity": 1,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "permit"
            },
            "action": "admit"
          }
        ],
        "fallback": "wait",
        "description": "Authority always grants entry.",
        "order": 0
      },
      {
        "id": "quiet-only",
        "name": "admit every stable arrival",
        "complexity": 2,
        "clauses": [
          {
            "when": {
              "op": "falsy",
              "field": "noisy"
            },
            "action": "admit"
          }
        ],
        "fallback": "wait",
        "description": "Stability alone grants entry.",
        "order": 0
      },
      {
        "id": "permit-quiet",
        "name": "admit stable seal holders, otherwise hold",
        "complexity": 3,
        "clauses": [
          {
            "when": {
              "op": "and",
              "args": [
                {
                  "op": "truthy",
                  "field": "permit"
                },
                {
                  "op": "falsy",
                  "field": "noisy"
                }
              ]
            },
            "action": "admit"
          }
        ],
        "fallback": "wait",
        "description": "Admission is correct, but urgent rescue is ignored.",
        "order": 0
      },
      {
        "id": "permit-first",
        "name": "admit authority before rescue",
        "complexity": 4,
        "clauses": [
          {
            "when": {
              "op": "and",
              "args": [
                {
                  "op": "truthy",
                  "field": "permit"
                },
                {
                  "op": "falsy",
                  "field": "noisy"
                }
              ]
            },
            "action": "admit"
          },
          {
            "when": {
              "op": "truthy",
              "field": "injured"
            },
            "action": "help"
          }
        ],
        "fallback": "wait",
        "description": "The seal is checked before a person is saved.",
        "order": 0
      },
      {
        "id": "festival-steward",
        "name": "rescue first, then admit stable seal holders",
        "complexity": 5,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "injured"
            },
            "action": "help"
          },
          {
            "when": {
              "op": "and",
              "args": [
                {
                  "op": "truthy",
                  "field": "permit"
                },
                {
                  "op": "falsy",
                  "field": "noisy"
                }
              ]
            },
            "action": "admit"
          }
        ],
        "fallback": "wait",
        "description": "Urgent care comes first; stable authorized help comes second.",
        "order": 0
      },
      {
        "id": "noise-first",
        "name": "hold unstable arrivals before all else",
        "complexity": 5,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "noisy"
            },
            "action": "wait"
          },
          {
            "when": {
              "op": "truthy",
              "field": "injured"
            },
            "action": "help"
          },
          {
            "when": {
              "op": "truthy",
              "field": "permit"
            },
            "action": "admit"
          }
        ],
        "fallback": "wait",
        "description": "Instability blocks even urgent rescue.",
        "order": 0
      },
      {
        "id": "help-or-admit",
        "name": "rescue injuries and admit every seal holder",
        "complexity": 4,
        "clauses": [
          {
            "when": {
              "op": "truthy",
              "field": "injured"
            },
            "action": "help"
          },
          {
            "when": {
              "op": "truthy",
              "field": "permit"
            },
            "action": "admit"
          }
        ],
        "fallback": "wait",
        "description": "Instability never blocks admission.",
        "order": 0
      }
    ],
    "teachCases": [
      {
        "id": "hurt-no-permit",
        "name": "Sable Beside the Last Flame",
        "species": "fox",
        "palette": [
          "#b56c47",
          "#edc18f"
        ],
        "summary": "Sable is injured, carries no Heart seal, and the chamber around her is stable.",
        "challengeWeight": 0,
        "injured": true,
        "permit": false,
        "noisy": false
      },
      {
        "id": "permit-quiet",
        "name": "Rowan with the Keeper Seal",
        "species": "rabbit",
        "palette": [
          "#d2bfaa",
          "#ecddc7"
        ],
        "summary": "Rowan is unhurt, carries a Heart seal, and approaches calmly.",
        "challengeWeight": 0,
        "injured": false,
        "permit": true,
        "noisy": false
      },
      {
        "id": "permit-noisy",
        "name": "Lumi Shouting a Warning",
        "species": "bird",
        "palette": [
          "#5b81a3",
          "#dfba56"
        ],
        "summary": "Lumi is unhurt, carries a Heart seal, but her echo is destabilizing the chamber.",
        "challengeWeight": 0,
        "injured": false,
        "permit": true,
        "noisy": true
      },
      {
        "id": "nothing",
        "name": "Juniper at the Outer Ring",
        "species": "snail",
        "palette": [
          "#89a96c",
          "#d4b36c"
        ],
        "summary": "Juniper is unhurt, carries no Heart seal, and waits calmly.",
        "challengeWeight": 0,
        "injured": false,
        "permit": false,
        "noisy": false
      },
      {
        "id": "hurt-permit",
        "name": "Injured Heart Warden",
        "species": "moth",
        "palette": [
          "#796f99",
          "#d8c37a"
        ],
        "summary": "An injured warden carries a Heart seal and remains stable.",
        "challengeWeight": 0,
        "injured": true,
        "permit": true,
        "noisy": false
      },
      {
        "id": "hurt-noisy",
        "name": "Sable in the Fracture",
        "species": "otter",
        "palette": [
          "#725f51",
          "#d5b487"
        ],
        "summary": "Sable is injured without a seal while the chamber destabilizes around her.",
        "challengeWeight": 0,
        "injured": true,
        "permit": false,
        "noisy": true
      },
      {
        "id": "hurt-all",
        "name": "Fallen Lanternwright",
        "species": "badger",
        "palette": [
          "#4c4e52",
          "#d3cdb9"
        ],
        "summary": "An injured seal holder is also destabilizing the chamber.",
        "challengeWeight": 0,
        "injured": true,
        "permit": true,
        "noisy": true
      }
    ],
    "challengeCases": [
      {
        "id": "challenge-help",
        "name": "Fallen Sable",
        "species": "mole",
        "palette": [
          "#6b625a",
          "#d2b07b"
        ],
        "summary": "Injured, unsealed, and stable enough to reach.",
        "challengeWeight": 2,
        "injured": true,
        "permit": false,
        "noisy": false
      },
      {
        "id": "challenge-admit",
        "name": "Calm Heartkeeper",
        "species": "bird",
        "palette": [
          "#816a53",
          "#d7b65a"
        ],
        "summary": "Unhurt, sealed, and stable.",
        "challengeWeight": 2,
        "injured": false,
        "permit": true,
        "noisy": false
      },
      {
        "id": "challenge-noisy",
        "name": "Resonating Seal Bearer",
        "species": "bird",
        "palette": [
          "#e8e4d4",
          "#dc9c48"
        ],
        "summary": "Unhurt and sealed, but destabilizing the chamber.",
        "challengeWeight": 2,
        "injured": false,
        "permit": true,
        "noisy": true
      },
      {
        "id": "challenge-wait",
        "name": "Unsealed Witness",
        "species": "beetle",
        "palette": [
          "#45574d",
          "#c97147"
        ],
        "summary": "Unhurt, unsealed, and stable.",
        "challengeWeight": 1,
        "injured": false,
        "permit": false,
        "noisy": false
      },
      {
        "id": "challenge-priority",
        "name": "Sable with the Last Flame",
        "species": "frog",
        "palette": [
          "#589463",
          "#dbc05a"
        ],
        "summary": "Injured and destabilizing the chamber while holding a Heart seal.",
        "challengeWeight": 3,
        "injured": true,
        "permit": true,
        "noisy": true
      },
      {
        "id": "challenge-hurt-permit",
        "name": "Injured Quiet Warden",
        "species": "cat",
        "palette": [
          "#98806e",
          "#e2cdb2"
        ],
        "summary": "Injured, sealed, and stable.",
        "challengeWeight": 3,
        "injured": true,
        "permit": true,
        "noisy": false
      },
      {
        "id": "challenge-loud-none",
        "name": "Wilddark Echo",
        "species": "raccoon",
        "palette": [
          "#55565c",
          "#d2c7ae"
        ],
        "summary": "Unhurt, unsealed, and destabilizing the chamber.",
        "challengeWeight": 1,
        "injured": false,
        "permit": false,
        "noisy": true
      },
      {
        "id": "challenge-hurt-loud",
        "name": "Injured Unsealed Scout",
        "species": "fox",
        "palette": [
          "#b66d47",
          "#efc493"
        ],
        "summary": "Injured, unsealed, and destabilizing the chamber.",
        "challengeWeight": 2,
        "injured": true,
        "permit": false,
        "noisy": true
      }
    ],
    "scene": {
      "theme": "festival",
      "prop": "lantern-gate",
      "correctHelp": "Pip crosses the fracture and pulls the injured person to safety before touching the Flame.",
      "correctAdmit": "The calm seal holder enters and stabilizes one section of the Heart.",
      "correctWait": "The threshold holds until the arrival can enter without worsening the breach.",
      "wrong": "Pip protects authority or ceremony while an injured person remains inside the fracture."
    },
    "reward": {
      "icon": "✦",
      "name": "Listening Keeper",
      "description": "Pip can use rules, context, exceptions, memory, and care—and revise the Promise when reality proves it incomplete.",
      "accessory": "moon"
    },
    "chapterTitle": "The Last Promise"
  }
];

  window.RG_LEVELS=levels;
})();
