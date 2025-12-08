#!/bin/bash

# =============================================================================
# Personalize Management API - COMPLETE WORKING FLOW
# Tested and verified: Dec 8, 2025
# 
# CORRECT API FORMAT:
# - Base URL: https://personalize-api.contentstack.com (NO /v1!)
# - Headers: Authorization: Bearer, organization_uid, x-project-uid
# - Audience: definition.combinationType + rules[] with CustomAttributeReference
# - Experience: POST /experiences, then PUT /experiences/{uid}/versions/{ver}
# =============================================================================

set -e

# Load from oauth.json
if [ -f oauth.json ]; then
  ACCESS_TOKEN=$(python3 -c "import json; print(json.load(open('oauth.json'))['access_token'])")
  ORG_UID=$(python3 -c "import json; print(json.load(open('oauth.json'))['organization_uid'])")
  echo "✅ Loaded token from oauth.json"
else
  echo "❌ oauth.json not found"
  exit 1
fi

# Load from .env.local
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | grep -v '^$' | xargs 2>/dev/null)
fi
PROJECT_UID="${NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID:-${NEXT_PUBLIC_PERSONALIZE_PROJECT_UID:-}}"

# Attribute UIDs (from GET /attributes)
QA_LEVEL_UID="692eb41d2a9f051bc9dd9e69"
TEAM_NAME_UID="692e8160e97e5a98f368cee7"

echo ""
echo "=== Configuration ==="
echo "Token: ${ACCESS_TOKEN:0:20}..."
echo "ORG_UID: $ORG_UID"
echo "PROJECT_UID: $PROJECT_UID"
echo ""

# Team to test
TEAM_NAME="${1:-TestTeam}"
TIMESTAMP=$(date +%s)

echo "=== STEP 1: Create Audience '$TEAM_NAME High Flyer Pro' ==="
AUDIENCE_RESP=$(curl -s -X POST "https://personalize-api.contentstack.com/audiences" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "organization_uid: $ORG_UID" \
  -H "x-project-uid: $PROJECT_UID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "'$TEAM_NAME' High Flyer Pro '$TIMESTAMP'",
    "description": "HIGH_FLYER QA Engineers from '$TEAM_NAME' team",
    "definition": {
      "combinationType": "AND",
      "rules": [
        {
          "__type": "Rule",
          "attribute": {"__type": "CustomAttributeReference", "ref": "'$QA_LEVEL_UID'"},
          "attributeMatchCondition": "STRING_EQUALS",
          "attributeMatchOptions": {"__type": "StringMatchOptions", "value": "HIGH_FLYER"},
          "invertCondition": false
        },
        {
          "__type": "Rule",
          "attribute": {"__type": "CustomAttributeReference", "ref": "'$TEAM_NAME_UID'"},
          "attributeMatchCondition": "STRING_EQUALS",
          "attributeMatchOptions": {"__type": "StringMatchOptions", "value": "'$TEAM_NAME'"},
          "invertCondition": false
        }
      ]
    }
  }')

AUDIENCE_UID=$(echo "$AUDIENCE_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('uid',''))" 2>/dev/null)
if [ -z "$AUDIENCE_UID" ]; then
  echo "❌ Failed to create audience:"
  echo "$AUDIENCE_RESP"
  exit 1
fi
echo "✅ Audience created: $AUDIENCE_UID"
echo ""

echo "=== STEP 2: Create Experience '$TEAM_NAME High Flyer Pro Experience' ==="
EXP_RESP=$(curl -s -X POST "https://personalize-api.contentstack.com/experiences" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "organization_uid: $ORG_UID" \
  -H "x-project-uid: $PROJECT_UID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "'$TEAM_NAME' High Flyer Pro Experience '$TIMESTAMP'",
    "description": "Experience for '$TEAM_NAME' HIGH_FLYER users",
    "__type": "SEGMENTED"
  }')

EXP_UID=$(echo "$EXP_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('uid',''))" 2>/dev/null)
VERSION_UID=$(echo "$EXP_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('latestVersion',''))" 2>/dev/null)
SHORT_UID=$(echo "$EXP_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('shortUid',''))" 2>/dev/null)

if [ -z "$EXP_UID" ] || [ -z "$VERSION_UID" ]; then
  echo "❌ Failed to create experience:"
  echo "$EXP_RESP"
  exit 1
fi
echo "✅ Experience created: $EXP_UID (shortUid: $SHORT_UID)"
echo "   Version: $VERSION_UID"
echo ""

# Variant name
VARIANT_NAME=$(echo "$TEAM_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr '&' 'a')"-high-flyer-pro"

echo "=== STEP 3: Add Variant '$VARIANT_NAME' and ACTIVATE ==="
VERSION_RESP=$(curl -s -X PUT "https://personalize-api.contentstack.com/experiences/$EXP_UID/versions/$VERSION_UID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "organization_uid: $ORG_UID" \
  -H "x-project-uid: $PROJECT_UID" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ACTIVE",
    "variants": [
      {
        "__type": "SegmentedVariant",
        "name": "'$VARIANT_NAME'",
        "audiences": ["'$AUDIENCE_UID'"],
        "audienceCombinationType": "AND"
      }
    ]
  }')

STATUS=$(echo "$VERSION_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('status',''))" 2>/dev/null)
VARIANT_SHORT_UID=$(echo "$VERSION_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('variants',[])[0].get('shortUid','') if d.get('variants') else '')" 2>/dev/null)

if [ "$STATUS" != "ACTIVE" ]; then
  echo "❌ Failed to activate:"
  echo "$VERSION_RESP" | python3 -m json.tool 2>/dev/null || echo "$VERSION_RESP"
  exit 1
fi

echo "✅ Experience ACTIVATED!"
echo "   Variant: $VARIANT_NAME (shortUid: $VARIANT_SHORT_UID)"
echo ""

echo "=== STEP 4: Verify Experience ==="
curl -s "https://personalize-api.contentstack.com/experiences/$EXP_UID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "organization_uid: $ORG_UID" \
  -H "x-project-uid: $PROJECT_UID" | python3 -m json.tool 2>/dev/null

echo ""
echo "=== 🎉 COMPLETE SUCCESS! ==="
echo ""
echo "Summary:"
echo "  Audience UID: $AUDIENCE_UID"
echo "  Experience UID: $EXP_UID"
echo "  Experience shortUid: $SHORT_UID"  
echo "  Variant name: $VARIANT_NAME"
echo "  Variant shortUid: $VARIANT_SHORT_UID"
echo "  Variant alias: cs_personalize_${SHORT_UID}_${VARIANT_SHORT_UID}"
echo ""
echo "View in Contentstack:"
echo "  https://app.contentstack.com/#!/personalize/projects/$PROJECT_UID/experiences/$EXP_UID"
