#!/bin/bash

# Contentstack Configuration
API_KEY="blt8202119c48319b1d"
MANAGEMENT_TOKEN="cs911496f76cbfb543bb764ae7"
CONTENT_TYPE_UID="qa_training_module"
ENTRY_UID="blt25efa166fab8cd74"
VARIANT_UID="cs5dcdb813390ecb6f"
ENVIRONMENT="dev"
LOCALE="en-us"

echo "📋 Publishing Variant Details:"
echo "  Entry UID: ${ENTRY_UID}"
echo "  Variant UID: ${VARIANT_UID}"
echo "  Environment: ${ENVIRONMENT}"
echo "  Locale: ${LOCALE}"
echo ""

# Step 1: Get variant details before publishing
echo "📋 Step 1: Fetching variant details before publish..."
echo ""

BEFORE_RESPONSE=$(curl -s -X GET \
  "https://api.contentstack.io/v3/content_types/${CONTENT_TYPE_UID}/entries/${ENTRY_UID}/variants?locale=${LOCALE}" \
  -H "api_key: ${API_KEY}" \
  -H "authorization: ${MANAGEMENT_TOKEN}" \
  -H "Content-Type: application/json")

VARIANT_BEFORE=$(echo "${BEFORE_RESPONSE}" | jq -r ".entries[] | select(._variant._uid == \"${VARIANT_UID}\")" 2>/dev/null)

if [ -n "$VARIANT_BEFORE" ]; then
  VERSION_BEFORE=$(echo "${VARIANT_BEFORE}" | jq -r '._version // "unknown"' 2>/dev/null)
  BASE_VERSION_BEFORE=$(echo "${VARIANT_BEFORE}" | jq -r '._variant._base_entry_version // "unknown"' 2>/dev/null)
  TITLE_BEFORE=$(echo "${VARIANT_BEFORE}" | jq -r '.title // "unknown"' 2>/dev/null)
  
  echo "✅ Variant found:"
  echo "  Title: ${TITLE_BEFORE}"
  echo "  Variant Version: ${VERSION_BEFORE}"
  echo "  Base Entry Version: ${BASE_VERSION_BEFORE}"
  echo ""
else
  echo "⚠️  Variant not found in response"
  echo "Response: ${BEFORE_RESPONSE}" | jq '.' 2>/dev/null || echo "${BEFORE_RESPONSE}"
  echo ""
fi

# Step 2: Publish the variant
echo "📤 Step 2: Publishing variant ${VARIANT_UID}..."
echo ""

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

echo "Publish Response:"
echo "${PUBLISH_RESPONSE}" | jq '.' 2>/dev/null || echo "${PUBLISH_RESPONSE}"
echo ""

# Check if publish was successful
if echo "${PUBLISH_RESPONSE}" | jq -e '.notice' > /dev/null 2>&1; then
  NOTICE=$(echo "${PUBLISH_RESPONSE}" | jq -r '.notice' 2>/dev/null)
  echo "✅ Success: ${NOTICE}"
elif echo "${PUBLISH_RESPONSE}" | jq -e '.error_message' > /dev/null 2>&1; then
  ERROR=$(echo "${PUBLISH_RESPONSE}" | jq -r '.error_message' 2>/dev/null)
  echo "❌ Error: ${ERROR}"
  exit 1
else
  echo "⚠️  Unexpected response format"
fi

echo ""
echo "⏳ Waiting 3 seconds for publish to propagate..."
sleep 3

# Step 3: Verify variant was published (check via Delivery API)
echo ""
echo "📋 Step 3: Verifying variant publish via Delivery API..."
echo ""

DELIVERY_TOKEN="csdf941d70d6da13d4ae6265de"
DELIVERY_RESPONSE=$(curl -s -X GET \
  "https://cdn.contentstack.io/v3/content_types/${CONTENT_TYPE_UID}/entries/${ENTRY_UID}?environment=${ENVIRONMENT}&locale=${LOCALE}" \
  -H "api_key: ${API_KEY}" \
  -H "access_token: ${DELIVERY_TOKEN}" \
  -H "x-cs-variant-uid: ${VARIANT_UID}" \
  -H "Content-Type: application/json")

echo "Delivery API Response:"
echo "${DELIVERY_RESPONSE}" | jq '.' 2>/dev/null || echo "${DELIVERY_RESPONSE}"
echo ""

# Check if variant is accessible via Delivery API
if echo "${DELIVERY_RESPONSE}" | jq -e '.entry' > /dev/null 2>&1; then
  DELIVERY_TITLE=$(echo "${DELIVERY_RESPONSE}" | jq -r '.entry.title // "unknown"' 2>/dev/null)
  DELIVERY_VARIANT_UID=$(echo "${DELIVERY_RESPONSE}" | jq -r '.entry._variant._uid // "none"' 2>/dev/null)
  
  if [ "$DELIVERY_VARIANT_UID" = "$VARIANT_UID" ]; then
    echo "✅ Variant is accessible via Delivery API!"
    echo "  Title: ${DELIVERY_TITLE}"
    echo "  Variant UID: ${DELIVERY_VARIANT_UID}"
  else
    echo "⚠️  Variant UID mismatch. Expected: ${VARIANT_UID}, Got: ${DELIVERY_VARIANT_UID}"
  fi
else
  echo "⚠️  Could not fetch variant via Delivery API"
fi

echo ""
echo "✨ Done!"

