#!/bin/bash

# Contentstack Configuration
API_KEY="blt8202119c48319b1d"
MANAGEMENT_TOKEN="cs911496f76cbfb543bb764ae7"
CONTENT_TYPE_UID="qa_training_module"
ENTRY_UID="blt25efa166fab8cd74"
ENVIRONMENT="dev"
LOCALE="en-us"

# Step 1: Get all variants for the entry
echo "📋 Step 1: Fetching all variants for entry ${ENTRY_UID}..."
echo ""

VARIANTS_RESPONSE=$(curl -s -X GET \
  "https://api.contentstack.io/v3/content_types/${CONTENT_TYPE_UID}/entries/${ENTRY_UID}/variants?locale=${LOCALE}" \
  -H "api_key: ${API_KEY}" \
  -H "authorization: ${MANAGEMENT_TOKEN}" \
  -H "Content-Type: application/json")

echo "Response:"
echo "${VARIANTS_RESPONSE}" | jq '.' 2>/dev/null || echo "${VARIANTS_RESPONSE}"
echo ""

# Extract variant UIDs (requires jq)
VARIANT_UIDS=$(echo "${VARIANTS_RESPONSE}" | jq -r '.entries[]?._variant._uid // empty' 2>/dev/null)

if [ -z "$VARIANT_UIDS" ]; then
  echo "⚠️  No variants found or jq not installed. Please check the response above."
  echo ""
  echo "To publish variants manually, use the variant UIDs from the response above."
  echo ""
  echo "Example curl command to publish a specific variant:"
  echo 'curl -X POST "https://api.contentstack.io/v3/content_types/'"${CONTENT_TYPE_UID}"'/entries/'"${ENTRY_UID}"'/publish" \'
  echo '  -H "api_key: '"${API_KEY}"'" \'
  echo '  -H "authorization: '"${MANAGEMENT_TOKEN}"'" \'
  echo '  -H "Content-Type: application/json" \'
  echo '  -d '"'"'{'
  echo '    "entry": {'
  echo '      "environments": ["'"${ENVIRONMENT}"'"],'
  echo '      "locales": ["'"${LOCALE}"'"],'
  echo '      "variant": "VARIANT_UID_HERE"'
  echo '    }'
  echo '  }'"'"
  exit 1
fi

# Count variants
VARIANT_COUNT=$(echo "${VARIANT_UIDS}" | wc -l | tr -d ' ')
echo "✅ Found ${VARIANT_COUNT} variant(s)"
echo ""

# Step 2: Publish each variant
echo "📤 Step 2: Publishing variants..."
echo ""

VARIANT_INDEX=1
while IFS= read -r VARIANT_UID; do
  if [ -n "$VARIANT_UID" ]; then
    echo "Publishing variant ${VARIANT_INDEX}: ${VARIANT_UID}..."
    
    PUBLISH_RESPONSE=$(curl -s -X POST \
      "https://api.contentstack.io/v3/content_types/${CONTENT_TYPE_UID}/entries/${ENTRY_UID}/publish" \
      -H "api_key: ${API_KEY}" \
      -H "authorization: ${MANAGEMENT_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{
        \"entry\": {
          \"environments\": [\"${ENVIRONMENT}\"],
          \"locales\": [\"${LOCALE}\"],
          \"variant\": \"${VARIANT_UID}\"
        }
      }")
    
    # Check if publish was successful
    if echo "${PUBLISH_RESPONSE}" | jq -e '.notice' > /dev/null 2>&1; then
      echo "  ✅ Success: $(echo "${PUBLISH_RESPONSE}" | jq -r '.notice' 2>/dev/null)"
    elif echo "${PUBLISH_RESPONSE}" | jq -e '.error_message' > /dev/null 2>&1; then
      echo "  ❌ Error: $(echo "${PUBLISH_RESPONSE}" | jq -r '.error_message' 2>/dev/null)"
    else
      echo "  Response: ${PUBLISH_RESPONSE}"
    fi
    echo ""
    
    VARIANT_INDEX=$((VARIANT_INDEX + 1))
  fi
done <<< "$VARIANT_UIDS"

echo "✨ Done! All variants have been published."

