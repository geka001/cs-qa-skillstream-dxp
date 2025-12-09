#!/bin/bash

# Contentstack Configuration
API_KEY="blt8202119c48319b1d"
MANAGEMENT_TOKEN="cs911496f76cbfb543bb764ae7"
DELIVERY_TOKEN="csdf941d70d6da13d4ae6265de"
CONTENT_TYPE_UID="qa_training_module"
ENTRY_UID="blt25efa166fab8cd74"
VARIANT_UID="cs5dcdb813390ecb6f"
ENVIRONMENT="dev"
LOCALE="en-us"

echo "🔍 Verifying Variant Publish Status"
echo "===================================="
echo ""

# Step 1: Get variant version from Management API
echo "📋 Step 1: Checking variant version in Management API..."
MGMT_VARIANT=$(curl -s -X GET \
  "https://api.contentstack.io/v3/content_types/${CONTENT_TYPE_UID}/entries/${ENTRY_UID}/variants?locale=${LOCALE}" \
  -H "api_key: ${API_KEY}" \
  -H "authorization: ${MANAGEMENT_TOKEN}" \
  -H "Content-Type: application/json" | jq -r ".entries[] | select(._variant._uid == \"${VARIANT_UID}\")")

if [ -n "$MGMT_VARIANT" ]; then
  MGMT_VERSION=$(echo "${MGMT_VARIANT}" | jq -r '._version')
  MGMT_TITLE=$(echo "${MGMT_VARIANT}" | jq -r '.title')
  MGMT_BASE_VERSION=$(echo "${MGMT_VARIANT}" | jq -r '._variant._base_entry_version')
  
  echo "✅ Management API Variant:"
  echo "   Title: ${MGMT_TITLE}"
  echo "   Variant Version: ${MGMT_VERSION}"
  echo "   Base Entry Version: ${MGMT_BASE_VERSION}"
  echo ""
else
  echo "❌ Variant not found in Management API"
  exit 1
fi

# Step 2: Get published variant version from Delivery API
echo "📋 Step 2: Checking published variant version in Delivery API..."
DELIVERY_ENTRY=$(curl -s -X GET \
  "https://cdn.contentstack.io/v3/content_types/${CONTENT_TYPE_UID}/entries/${ENTRY_UID}?environment=${ENVIRONMENT}&locale=${LOCALE}" \
  -H "api_key: ${API_KEY}" \
  -H "access_token: ${DELIVERY_TOKEN}" \
  -H "x-cs-variant-uid: ${VARIANT_UID}" \
  -H "Content-Type: application/json")

DELIVERY_TITLE=$(echo "${DELIVERY_ENTRY}" | jq -r '.entry.title // "not found"')
DELIVERY_VERSION=$(echo "${DELIVERY_ENTRY}" | jq -r '.entry._version // "unknown"')
PUBLISHED_VARIANT_VERSION=$(echo "${DELIVERY_ENTRY}" | jq -r '.entry.publish_details.variants."'${VARIANT_UID}'".version // "not found"')
PUBLISHED_VARIANT_TIME=$(echo "${DELIVERY_ENTRY}" | jq -r '.entry.publish_details.variants."'${VARIANT_UID}'".time // "not found"')

echo "✅ Delivery API Variant:"
echo "   Title: ${DELIVERY_TITLE}"
echo "   Entry Version: ${DELIVERY_VERSION}"
echo "   Published Variant Version: ${PUBLISHED_VARIANT_VERSION}"
echo "   Published At: ${PUBLISHED_VARIANT_TIME}"
echo ""

# Step 3: Compare versions
echo "📊 Step 3: Version Comparison"
echo "=============================="
echo "   Management API Variant Version: ${MGMT_VERSION}"
echo "   Delivery API Published Version: ${PUBLISHED_VARIANT_VERSION}"
echo ""

if [ "$MGMT_VERSION" = "$PUBLISHED_VARIANT_VERSION" ]; then
  echo "✅ SUCCESS: Latest variant version (${MGMT_VERSION}) is published!"
else
  echo "⚠️  WARNING: Version mismatch!"
  echo "   Management API has version ${MGMT_VERSION}, but Delivery API shows version ${PUBLISHED_VARIANT_VERSION} is published."
  echo ""
  echo "   This could mean:"
  echo "   1. The publish is still propagating (wait a few minutes)"
  echo "   2. Version ${MGMT_VERSION} needs to be published"
  echo ""
  
  if [ "$MGMT_VERSION" -gt "$PUBLISHED_VARIANT_VERSION" ] 2>/dev/null; then
    echo "   → Management API version (${MGMT_VERSION}) is NEWER than published version (${PUBLISHED_VARIANT_VERSION})"
    echo "   → You may need to publish again to publish the latest version"
  fi
fi

echo ""
echo "✨ Verification complete!"

