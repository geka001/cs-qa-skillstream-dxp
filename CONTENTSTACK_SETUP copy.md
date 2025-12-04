TypeScript Delivery SDK API Reference

link
Contentstack offers the TypeScript Delivery SDK for building applications. Below, is an in-depth guide and valuable resources to initiate your journey with our TypeScript Delivery SDK. Additionally, the SDK supports the creating applications for Node.js and React Native environments.

Additional Resource: To know more about the TypeScript Delivery SDK, refer to the About TypeScript Delivery SDK and Get Started with TypeScript Delivery SDK documentation.

Contentstack

link
The Contentstack module contains the instance of a stack. To import Contentstack, refer to the code below:


TypeScript
keyboard_arrow_down

import contentstack from '@contentstack/delivery-sdk';
Stack

link
A stack is a repository or a container that holds all the entries/assets of your site. It allows multiple users to create, edit, approve, and publish their content within a single space.

The stack function initializes an instance of the Stack. To initialize a stack execute the following code:


TypeScript
keyboard_arrow_down

import contentstack from '@contentstack/delivery-sdk'

const stack = contentstack.stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
Name	Type	Description
apiKey (required)

string

API key of the stack

deliveryToken (required)

string

Delivery token to retrieve data from the stack

environment (required)

string

Environment name where content is published

live_preview

LivePreview

The Live preview configuration for the Contentstack API

branch

string

Name of the branch to fetch data from
Default: main
host

string

Sets the host of the API server
(example: "dev.contentstack.com")
Default: cdn.contentstack.io
region

string

Region of the stack. You can choose from five regions: NA, EU, Azure NA, Azure EU, GCP NA, and GCP EU.

locale

string

Lets you specify which language to use as source content if the entry does not exist in the specified language.

cacheOptions.policy

string

Specifies the caching strategy. Accepts a string value from the Policy enum.

cacheOptions.storeType

string

Defines where the cache is stored. Accepts localStorage or memoryStorage as string values.

Default: 'localStorage'
cacheOptions.maxAge

number

Sets the maximum age (in milliseconds) before the cache expires.

Default: 24 hrs
cacheOptions.serializer

function

Function to serialize data before storing it in the cache.

Default: JSON.stringify
cacheOptions.deserializer

function

Function to deserialize data when retrieving it from the cache.

Default: JSON.parse
early_access

List<string>

Set early access headers

logHandler

function

Method to enable custom logging in the SDK

plugins

List<any>

Add custom plugins to the SDK

LivePreviewConfig

link
Configuration settings to enable live preview functionality and fetch real-time content data.

Name	Type	Description
enable

boolean

Specifies whether to enable the live preview feature.

Default: false
host

string

Specifies the host domain used to retrieve live preview content.

preview_token

string

Token required to fetch live preview content from the stack.

Plugins

link
When creating custom plugins, through this request, you can pass the details of your custom plugins. This facilitates their utilization in subsequent requests when retrieving details.

To initializing a stack with plugins, refer to the code snippet below:


// custom class for plugin

class CrossStackPlugin {

  onRequest (request) {

    // add request modifications


    return request

  }

  async onResponse (request, response, data) {

    // add response modifications here


    return response

  }

}

const Stack = Contentstack.stack({

  api_key,

  delivery_token,

  environment,

  plugins: [

    new CrossStackPlugin(),

  ]

});
Asset

link
The Asset method by default creates an object for all assets of a stack. To retrieve a single asset, specify its UID.

Returns:
Type
Asset
Name	Type	Description
assetUid

string

UID of the asset

Example:


TypeScript
keyboard_arrow_down

const asset = stack.asset(); // For collection of asset

// OR

const asset = stack.asset('assetUid'); // For a single asset with uid 'assetUid'
ContentType

link
The ContentType method retrieves all the content types of a stack. To retrieve a single contenttype, specify its UID.

Returns:
Type
ContentType
Name	Type	Description
contentTypeUid

string

UID of the content type

Example:


TypeScript
keyboard_arrow_down

const contentType = stack.contentType(); // For collection of contentType

// OR

const contentType = stack.contentType('contentTypeUid'); // For a single contentType with uid 'contentTypeUid'
setLocale

link
The setLocale method sets the locale of the API server.

Returns:
Type
void
Name	Type	Description
locale (required)

string

Enter the locale code

Example:


TypeScript
keyboard_arrow_down

stack.setLocale('en-155');
sync

link
The sync method syncs your Contentstack data with your app and ensures that the data is always up-to-date by providing delta updates.

Returns:
Type
promise
Name	Type	Description
params (required)

ISyncType | ISyncStack

An object that supports ‘locale’, ‘start_date’, ‘content_type_uid’, and ‘type’ queries

recursive (required)

boolean

Specifies if the sync should be recursive

Example:

For initializing sync:

TypeScript
keyboard_arrow_down

Stack.sync();
For initializing sync with entries of a specific locale:

TypeScript
keyboard_arrow_down

Stack.sync({ 'locale': 'en-us'}); 
For initializing sync with entries published after a specific date:

TypeScript
keyboard_arrow_down

Stack.sync({ 'start_date': '2018-10-22'}); 
For initializing sync with entries of a specific content type:

TypeScript
keyboard_arrow_down

Stack.sync({ 'content_type_uid': 'session'}); 
For initializing sync with a specific type of content:


TypeScript
keyboard_arrow_down

Stack.sync({ 'type': 'entry_published'});

//Use the type parameter to get a specific type of content. Supports 'asset_published', 'entry_published', 'asset_unpublished', 'entry_unpublished', 'asset_deleted', 'entry_deleted', 'content_type_deleted'
For fetching the next batch of entries using pagination token:

TypeScript
keyboard_arrow_down

Stack.sync({'pagination_token': '<page_tkn>'}); 
For performing subsequent sync after initial sync:

TypeScript
keyboard_arrow_down

Stack.sync({'sync_token': '<sync_tkn>'}); 
Asset

link
In Contentstack, any files (images, videos, PDFs, audio files, and so on) that you upload get stored in your repository for future use. This repository of uploaded files is called assets.

The Asset method by default creates an object for all assets of a stack. To retrieve a single asset, specify its UID.

Example:


TypeScript
keyboard_arrow_down

import contentstack from '@contentstack/delivery-sdk';

import { BaseAsset } from '@contentstack/delivery-sdk';



const stack = contentstack.stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });



interface BlogAsset extends BaseAsset {

    title: string;

    description: string;

    url: string;

    // Add other custom properties as needed

}

async function fetchAssets() {

    try {

       const result = await stack.asset(asset_uid).fetch<BlogAsset[]>(); 

       console.log('Assets Fetched:', assets);

//Add your statements

    } catch (error) {

        console.error('Error fetching asset:', error);

    }

}

fetchAssets();
Name	Type	Description
assetUid

string

UID of the asset

fetch

link
The fetch method retrieves the asset data of the specified asset.

Returns:
Type
Promise
Example:


TypeScript
keyboard_arrow_down

import { BaseAsset } from '@contentstack/delivery-sdk'


interface BlogAsset extends BaseAsset {

  // other custom props

}

const asset = await stack.asset('assetUid').fetch<BlogAsset>();
includeBranch

link
The includeBranch method includes the branch details in the response.

Returns:
Type
Asset
Example:


TypeScript
keyboard_arrow_down

const assetResponse = await stack.asset('asset_uid').includeBranch().fetch<BlogAsset>();
includeDimension

link
The includeDimension method includes the dimensions (height and width) of the image in the result.

Returns:
Type
Asset
Example:


TypeScript
keyboard_arrow_down

const assetResponse = await stack.asset('asset_uid').includeDimension().fetch<BlogAsset>();
includeFallback

link
The includeFallback method retrieves the entry in its fallback language.

Returns:
Type
Asset
Example:


TypeScript
keyboard_arrow_down

const result = await stack.asset('asset_uid').includeFallback().fetch<BlogAsset>();
locale

link
The locale method retrieves the assets published in that locale.

Returns:
Type
Asset
Example:


TypeScript
keyboard_arrow_down

const result = await stack.asset('asset_uid').locale('en-us').fetch<BlogAsset>();
relativeUrls

link
The relativeUrls method includes the relative URLs of the asset in the result.

Returns:
Type
Asset
Example:


TypeScript
keyboard_arrow_down

const result = await stack.asset('asset_uid').relativeUrls().fetch<BlogAsset>();
version

link
The version method retrieves the specified version of the asset in the result.

Returns:
Type
Asset
Name	Type	Description
version (required)

number

Version of the required asset

Example:


TypeScript
keyboard_arrow_down

const result = await stack.asset('asset_uid').version(1).fetch<BlogAsset>();
includeMetadata

link
The includeMetadata method includes the metadata for getting metadata content for the entry.

Returns:
Type
Asset
Example:


TypeScript
keyboard_arrow_down

const result = await stack.asset('asset_uid').includeMetadata().fetch();
Asset Collection

link
The Asset Collection provides methods for filtering and retrieving assets stored in Contentstack. You can retrieve specific assets by UID, tags, or metadata.

Example:


TypeScript
keyboard_arrow_down

const result = stack.asset().find<BlogAsset>()

  .then((assets) => console.log(assets))

  .catch((error) => console.error("Error fetching assets:", error));
addParams

link
The addParam method adds a query parameter to the query.

Returns:
Type
BaseQuery
Name	Type	Description
paramObj (required)

object

Add key-value pairs

Example:


TypeScript
keyboard_arrow_down

import { BaseAsset, FindAsset } from '@contentstack/delivery-sdk'


interface BlogAsset extends BaseAsset {

  // other custom props

  dimension: {

    height: string;

    width: string;

  };

}


const asset = await stack

                      .asset()

                      .addParams({"key": "value"})

                      .find<BlogAsset>();
find

link
The find method retrieves all the assets of the stack.

Returns:
Type
Promise
Example:


TypeScript
keyboard_arrow_down

const result = await stack.asset().find<BlogAsset>();
includeBranch

link
The includeBranch method includes the branch details in the result.

Returns:
Type
AssetQuery
Example:


TypeScript
keyboard_arrow_down

const result = await stack.asset().includeBranch().find<BlogAsset>();
includeCount

link
The includeCount method retrieves count and data of all the objects in the result.

Returns:
Type
BaseQuery
Example:


TypeScript
keyboard_arrow_down

const asset = await stack.asset().includeCount().find<BlogAsset>();
includeDimension

link
The includeDimension method includes the dimensions (height and width) of the image in the result

Returns:
Type
AssetQuery
Example:


TypeScript
keyboard_arrow_down

const result = await stack.asset().includeDimension().find<BlogAsset>();
includeFallback

link
The includeFallback method retrieves the entry in its fallback language.

Returns:
Type
AssetQuery
Example:


TypeScript
keyboard_arrow_down

const result = await stack.asset().includeFallback().find<BlogAsset>();
locale

link
The locale method retrieves the asset published in the specified locale.

Returns:
Type
AssetQuery
Name	Type	Description
locale (required)

string

Locale of the asset

Example:


TypeScript
keyboard_arrow_down

const result = await stack.asset().locale('en-us').find<BlogAsset>();
orderByAscending

link
The orderByAscending method sorts the results in ascending order based on the specified field UID.

Returns:
Type
BaseQuery
Name	Type	Description
key (required)

string

Field UID to sort the results

Example:


TypeScript
keyboard_arrow_down

const asset = await stack.asset().orderByAscending().find<BlogAsset>();
orderByDescending

link
The orderByDescending method sorts the results in descending order based on the specified key.

Returns:
Type
BaseQuery
Name	Type	Description
key (required)

string

Field UID to sort the results

Example:


TypeScript
keyboard_arrow_down

const asset = await stack.asset().orderByDescending().find<BlogAsset>();
param

link
The param method adds query parameters to the URL.

Returns:
Type
BaseQuery
Name	Type	Description
key (required)

string

Add any param to include in the response

value (required)

string/number

Add the corresponding value of the param key

Example:


TypeScript
keyboard_arrow_down

const asset = await stack.asset().param("key", "value").find<BlogAsset>();
relativeUrls

link
The relativeUrls method includes the relative URLs of all the assets in the result.

Returns:
Type
AssetQuery
Example:


TypeScript
keyboard_arrow_down

const result = await stack.asset().relativeUrls().find<BlogAsset>();
removeParam

link
The removeParam method removes a query parameter from the query.

Returns:
Type
BaseQuery
Name	Type	Description
key (required)

string

Specify the param key you want to remove

Example:


TypeScript
keyboard_arrow_down

const asset = await stack.asset().removeParam("query_param_key").find<BlogAsset>();
version

link
The version method retrieves a specific version of the asset in the result.

Returns:
Type
AssetQuery
Name	Type	Description
version (required)

number

Version number of the asset

Example:


TypeScript
keyboard_arrow_down

const result = await stack.asset().version(1).find<BlogAsset>();
where

link
The where method filters the results based on the specified criteria.

Returns:
Type
BaseQuery
Name	Type	Description
fieldUid (required)

string

Specify the field the comparison is made from

queryOperation (required)

QueryOperationEnum

Specify the comparison criteria

fields (required)

string

Specify the field the comparison is made to

Example:


TypeScript
keyboard_arrow_down

const result = await stack.asset().query().


where("field_UID", QueryOperation.IS_LESS_THAN, ["field1", "field2"])


.find<BlogAsset>();
includeMetadata

link
The includeMetadata method includes the metadata for getting metadata content for the entry.

Returns:
Type
AssetQuery
Example:


TypeScript
keyboard_arrow_down

const result = await stack.asset().includeMetadata().find<BlogAsset>();
skip

link
The skip method will skip a specific number of assets in the output.

Returns:
Type
AssetQuery
Name	Type	Description
skipBy (required)

int

Enter the number of assets to be skipped.

Example:


TypeScript
keyboard_arrow_down

const result = await stack.asset().skip(5).find<BlogAsset>();
limit

link
The limit method will return a specific number of assets in the output.

Returns:
Type
AssetQuery
Name	Type	Description
limit (required)

int

Enter the maximum number of assets to be returned.

Example:


TypeScript
keyboard_arrow_down

const result = await stack.asset().limit(5).find<BlogAsset>();
ContentType

link
A content type is the structure or blueprint of a page or a section that your web or mobile property will display. It lets you define the overall schema of this blueprint by adding fields and setting its properties.

Example:


TypeScript
keyboard_arrow_down

import { BaseContentType } from '@contentstack/delivery-sdk'

interface BlogPost extends BaseContentType {

  text: string;

  // other custom props

}

async function fetchContentType() { 

   try { 

 const contentType = await stack.contentType("blog").fetch<BlogPost>();

 console.log(contentType); 

 //Add your statements

    } catch (error) { 

  console.error("Error fetching content type:", error); 

} 

} 

fetchContentType();
Name	Type	Description
contentTypeUid

string

UID of the content type

entry

link
The entry method creates an entry object for the specified entry.

Returns:
Type
Entries
Name	Type	Description
uid

string

UID of the entry

Example:


TypeScript
keyboard_arrow_down

const entry = stack.contentType("contentTypeUid").entry("entryUid");
fetch

link
The fetch method retrieves the details for the specified content type.

Returns:
Type
Promise
Example:


TypeScript
keyboard_arrow_down

const result = await stack.contentType("contentTypeUid").fetch<BlogPost>();
ContentType Collection

link
The ContentType Collection method retrieves a list of all content types available within a stack. It provides metadata and structural details for each content type but does not retrieve actual content entries.

Example:


TypeScript
keyboard_arrow_down

const contentType = await stack.contentType().find<BlogPost>();
find

link
The find method retrieves all the content types of the stack.

Returns:
Type
Promise
Example:


TypeScript
keyboard_arrow_down

import { BaseContentType, FindContentType } from '@contentstack/delivery-sdk'



interface BlogPostContentType extends BaseContentType {

  // custom content type schema

}


const result = await stack.contentType().find<BlogPostContentType>();
includeGlobalFieldSchema

link
The includeGlobalFieldSchema method includes the schema of the global field in the response.

Returns:
Type
ContentTypeQuery
Example:


TypeScript
keyboard_arrow_down

const contentType = stack.ContentType();
const result = contentType.includeGlobalFieldSchema().find<ContentTypes>();
Entry

link
An Entry is the actual piece of content created using one of the defined content types. To work with a single entry, specify its UID.

Example:


TypeScript
keyboard_arrow_down

import contentstack from '@contentstack/delivery-sdk'

import { BaseEntry } from '@contentstack/delivery-sdk'



const stack = contentstack.stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });

interface BlogPostEntry extends BaseEntry {

  // custom entry types

}

async function fetchEntry() {

    try {

const result = await stack.contentType(contenttype_uid).entry(entry_uid).fetch<BlogPostEntry>();

      console.log('Entry: ', result);

//Add your statements

    } catch (error) {

      console.error('Error fetching entry:', error);

  }

}

fetchEntry();
Name	Type	Description
entryUid

entryUid

UID of the entry

fetch

link
The fetch method retrieves the details of a specific entry.

Returns:
Type
Promise
Example:


TypeScript
keyboard_arrow_down

import { BaseEntry } from '@contentstack/delivery-sdk'



interface BlogPostEntry extends BaseEntry {

  // custom entry types

}

const result = await stack

                      .contentType(contentType_uid)

                      .entry(entry_uid)

                      .fetch<BlogPostEntry>();
includeBranch

link
The includeBranch method includes the branch details in the result.

Returns:
Type
Entry
Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType(contentType_uid)

                       .entry(entry_uid)

                       .includeBranch()

                       .fetch<BlogPostEntry>();
includeFallback

link
The includeFallback method retrieves the entry in its fallback language.

Returns:
Type
Entry
Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType(contentType_uid)

                       .entry(entry_uid)

                       .includeFallback()

                       .fetch<BlogPostEntry>();
locale

link
The locale method retrieves the entries published in that locale.

Returns:
Type
Entry
Name	Type	Description
locale (required)

string

Locale of the entry

Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType(contentType_uid)

                       .entry(entry_uid)

                       .locale('en-us')

                       .fetch<BlogPostEntry>();
addParams

link
The addParam method adds a query parameter to the query.

Returns:
Type
BaseQuery
Name	Type	Description
paramObj (required)

object

Add key-value pairs

Example:


TypeScript
keyboard_arrow_down

import { BaseEntry, FindEntry } from '@contentstack/delivery-sdk'



interface BlogPostEntry extends BaseEntry {

  // custom entry types

}


const result = await stack

                       .contentType(contentType_uid)

                       .entry()

                       .addParams({"key": "value"})

                       .find<BlogPostEntry>();
except

link
The except method excludes specific field(s) of an entry.

Returns:
Type
EntryQueryable
Name	Type	Description
fieldUid (required)

string

UID of the field to exclude

Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType("contentTypeUid")

                       .entry()

                       .except("fieldUID")

                       .find<BlogPostEntry>();
find

link
The find method retrieves the details of the specified entry.

Returns:
Type
Promise
Example:


TypeScript
keyboard_arrow_down

const result = await stack.contentType("contentTypeUid").entry().find<BlogPostEntry>();
skip

link
The skip method will skip a specific number of entries in the output.

Returns:
Type
Entry
Name	Type	Description
skipBy (required)

int

Enter the number of entries to be skipped.

Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType(contentType_uid)

                       .entry()

                       .skip(5)

                       .find<BlogEntry>();
limit

link
The limit method will return a specific number of entries in the output.

Returns:
Type
Entry
Name	Type	Description
limit (required)

int

Enter the maximum number of entries to be returned.

Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType(contentType_uid)

                       .entry()

                       .limit(5)

                       .find<BlogEntry>();
includeCount

link
The includeCount method retrieves the count and data of objects in the result.

Returns:
Type
BaseQuery
Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType("contentTypeUid")

                       .entry()

                       .includeCount()

                       .find<BlogPostEntry>();
only

link
The only method selects specific field(s) of an entry.

Returns:
Type
EntryQueryable
Name	Type	Description
fieldUid (required)

string

UID of the field to select

Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType("contentTypeUid")

                       .entry()

                       .only("fieldUID")

                       .find<BlogPostEntry>();
orderByAscending

link
The orderByAscending sorts the results in ascending order based on the specified field UID.

Returns:
Type
BaseQuery
Name	Type	Description
key (required)

string

Field UID to sort the results

Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType("contentTypeUid")

                       .entry()

                       .orderByAscending()

                       .find<BlogPostEntry>();
orderByDescending

link
The orderByDescending sorts the results in descending order based on the specified field UID.

Returns:
Type
BaseQuery
Name	Type	Description
key (required)

string

Field UID to sort the results

Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType("contentTypeUid")

                       .entry()

                       .orderByDescending()

                       .find<BlogPostEntry>();
param

link
The param method adds query parameters to the URL.

Returns:
Type
BaseQuery
Name	Type	Description
key (required)

string

Add any param to include in the response

value (required)

string | number

Add the corresponding value of the param key

Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType("contentTypeUid")

                       .entry()

                       .param("key", "value")

                       .find<BlogPostEntry>();
query

link
The query method retrieves the details of the entry on the basis of the queries applied.

Returns:
Type
query
Name	Type	Description
queryObj

object

Query in object format

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType("contentTypeUid").entry().query({ "price_in_usd": { "$lt": 600 }});
const result = await query.whereIn("brand").find<BlogPostEntry>();
removeParam

link
The removeParam method removes a query parameter from the query.

Returns:
Type
BaseQuery
Name	Type	Description
key (required)

string

Specify the param key you want to remove

Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType("contentTypeUid")

                       .entry()

                       .removeParam("query_param_key")

                       .find<BlogPostEntry>();
where

link
The where method filters the results based on the specified criteria.

Returns:
Type
EntryQueryable
Name	Type	Description
fieldUid (required)

string

Specify the field the comparison is made from

queryOperation (required)

QueryOperationEnum

Specify the comparison criteria

fields (required)

string

Specify the field the comparison is made to

Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType(contentType_uid)

                       .entry()

                       .query()

                       .where(

                         "field_UID", 

                         QueryOperation.IS_LESS_THAN, 

                         ["field1", "field2"])

                       .find<BlogPostEntry>();
includeMetadata

link
The includeMetadata method includes the metadata for getting metadata content for the entry.

Returns:
Type
Entry
Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType('contentType_uid')

                       .entry('entry_uid')

                       .includeMetadata()

                       .fetch<BlogEntry>();
includeEmbeddedItems

link
The includeEmbeddedItems method includes embedded objects (Entry and Assets) along with entry details

Returns:
Type
Entry
Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType(contentType_uid)

                       .entry('entry_uid')

                       .includeEmbeddedItems()

                       .fetch<BlogEntry>();
includeContentType

link
The includeContentType method includes the details of the content type along with the Entry details.

Returns:
Type
Entry
Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType(contentType_uid)

                       .entry('entry_uid')

                       .includeContentType()

                       .fetch<BlogEntry>();
includeReference

link
The includeReference method retrieves the content of the referred entries in your response.

Returns:
Type
Entry
Name	Type	Description
referenceFieldUid (required)

string

UID of the reference field to include

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType(contentType_uid).entry();
const result = await query
                      .includeReference("brand")
                      .find<BlogPostEntry>();
To retrieve all referred entries, use the following code snippet:

TypeScript
keyboard_arrow_down

const result = await query.addParams({ include_all: true, include_all_depth: 2 }).find();
Note: The maximum supported value for include_all_depth is 100.

Variants

link
Variants are different versions of content designed to meet specific needs or target audiences. This feature allows content editors to create multiple variations of a single entry, each customized for a particular variant group or purpose.

When Personalize creates a variant in the CMS, it assigns a "Variant Alias" to identify that specific variant. When fetching entry variants using the Delivery API, you can pass variant aliases in place of variant UIDs in the x-cs-variant-uid header.

Returns:
Type
Promise
Single Variant: This method retrieves the details of a specific entry variant.

Example:


TypeScript
keyboard_arrow_down

import contentstack from '@contentstack/delivery-sdk';


const Stack = contentstack.stack

({'api_key': 'api_key', 'delivery_token': 'delivery_token', 'environment': 'environment'});

const result = await Stack

                    .contentType('content_type_uid')

                    .entry('entry_uid')

                    .variants('variant_uid/variant_alias')

                    .fetch();
Layering variants: This method retrieves the details of entry variants based on the applied query

Example:


TypeScript
keyboard_arrow_down

import contentstack from '@contentstack/delivery-sdk';


const Stack = contentstack.stack

({'api_key': 'api_key', 'delivery_token': 'delivery_token', 'environment': 'environment'});

const result = await Stack

                      .contentType('content_type_uid')

                      .entry('entry_uid')

                      .variants(['variant_uid1/variant_alias1','variant_uid2/variant_alias2'])

                      .fetch();
Query

link
These methods allow you to refine entry queries by applying conditions, filters, and relational data. You can filter entries based on specific field values, include referenced entries, and limit the number of results.

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType("contentTypeUid").Entry().query();
addParams

link
The addParam method adds a query parameter to the query.

Returns:
Type
BaseQuery
Name	Type	Description
paramObj (required)

string

Add key-value pairs

Example:


TypeScript
keyboard_arrow_down

import { BaseEntry, FindEntry } from '@contentstack/delivery-sdk'



interface BlogPostEntry extends BaseEntry {

  // custom entry types

}

const query = stack.contentType(contentType_uid).entry().query();

const result = await query

                       .addParams({"key": "value"})

                       .find<BlogPostEntry>();
addQuery

link
The addQuery method adds multiple query parameters to the query.

Returns:
Type
BaseQuery
Name	Type	Description
key (required)

string

Add filter query key

value (required)

string | number

Add the corresponding value to the filter query key

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType("contentTypeUid").entry().query();

const result = await query

                       .addQuery("query_param_key", "query_param_value")

                       .find<BlogPostEntry>();
find

link
The find method retrieves the details of the specified entry.

Returns:
Type
Promise
Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType("contentType1Uid")

                       .entry()

                       .query()

                       .find<BlogPostEntry>();
includeCount

link
The includeCount method retrieves count and data of objects in the result.

Returns:
Type
BaseQuery
Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType(contentType_uid).entry().query();
const result = await query.includeCount().find<BlogPostEntry>();
orderByAscending

link
The orderByAscending method sorts the results in ascending order based on the specified field UID.

Returns:
Type
BaseQuery
Name	Type	Description
key (required)

string

Field UID to sort the results

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType(contentType_uid).entry().query();

const result = await query

                       .orderByAscending()

                       .find<BlogPostEntry>();
orderByDescending

link
The orderByDescending method sorts the results in descending order based on the specified key.

Returns:
Type
BaseQuery
Name	Type	Description
key (required)

string

Field UID to sort the results

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType(contentType_uid).entry().query();

const result = await query

                       .orderByDescending()

                       .find<BlogPostEntry>();
param

link
The param method adds query parameters to the URL.

Returns:
Type
BaseQuery
Name	Type	Description
key (required)

string

Add any param to include in the response

value (required)

string | number

Add the corresponding value of the param key

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType(contentType_uid).entry().query();

const result = await query

                       .param("key", "value")

                       .find<BlogPostEntry>();
queryOperator

link
The queryOperator method retrieves the entries as per the given operator.

Returns:
Type
Query
Name	Type	Description
queryType (required)

QueryOperatorEnum

Type of query operator to apply

queryObjects (required)

Query[]

Query instances to apply the query to

Example:


TypeScript
keyboard_arrow_down

import contentstack, { QueryOperation, QueryOperator } from '@contentstack/delivery-sdk';



const stack = contentstack.stack('apiKey', 'deliveryToken', 'environment');



// Create main query

const query = stack

  .contentType('contentType1Uid')

  .entry()

  .query();



// Create subquery 1

const subQuery1 = stack

  .contentType('contentType2Uid')

  .entry()

  .query()

  .where('price', QueryOperation.IS_LESS_THAN, 90);



// Create subquery 2

const subQuery2 = stack

  .contentType('contentType3Uid')

  .entry()

  .query()

  .where('discount', QueryOperation.INCLUDES, [20, 45]);



// Apply the query operator (AND/OR)

query.queryOperator(QueryOperator.AND, subQuery1, subQuery2);



// Execute the query

const result = await query.find();

console.log('Result:', result);
removeParam

link
The removeParam method removes a query parameter from the query.

Returns:
Type
BaseQuery
Name	Type	Description
key (required)

string

Specify the param key you want to remove

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType(contentType_uid).entry().query();

const result = await query

                       .removeParam("query_param_key")

                       .find<BlogPostEntry>();
where

link
The where method filters the results based on the specified criteria.

Returns:
Type
BaseQuery
Name	Type	Description
fieldUid (required)

string

Specify the field the comparison is made from

queryOperation (required)

QueryOperationEnum

Specify the comparison criteria

fields (required)

string | strings[]

Specify the field the comparison is made to

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType("contentTypeUid").entry().query();

const result = await query

                       .where(

                         "field_UID", 

                         QueryOperation.IS_LESS_THAN, 

                         ["field1", "field2"])

                       .find<BlogPostEntry>();
whereIn

link
The whereIn method retrieves the entries that meet the query conditions made on referenced fields.

Returns:
Type
Query
Name	Type	Description
referenceUid (required)

string

UID of the reference field to query

queryInstance (required)

Query

Query instance to include in the where clause

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType("contentTypeUid").entry().query();

query.whereIn("brand");

const result = await query.find<BlogPostEntry>();
whereNotIn

link
The whereNotIn method retrieves the entries that do not meet the query conditions made on referenced fields.

Returns:
Type
Query
Name	Type	Description
referenceUid (required)

string

UID of the reference field to query

queryInstance (required)

Query

Query instance to include in the where clause

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType("contentTypeUid").entry().query();

query.whereNotIn("brand");

const result = await query.find<BlogPostEntry>();
skip

link
The skip method will skip a specific number of entries in the output.

Returns:
Type
Entry
Name	Type	Description
skipBy (required)

int

Enter the number of entries to be skipped.

Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType(contentType_uid)

                       .entry()

                       .query()

                       .skip(5)

                       .find<BlogEntry>();
limit

link
The limit method will return a specific number of entries in the output.

Returns:
Type
Entry
Name	Type	Description
limit (required)

int

Enter the maximum number of entries to be returned.

Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .contentType(contentType_uid)

                       .entry()

                       .query()

                       .limit(5)

                       .find<BlogEntry>();
or

link
The or method retrieves the entries that meet either of the conditions specified.

Returns:
Type
Query
Name	Type	Description
queries (required)

array

Array of query objects or raw queries

Example:


TypeScript
keyboard_arrow_down

const query1 = stack.contentType('contenttype_uid').entry().query().containedIn('fieldUID', ['value']);

const query2 = stack.contentType('contenttype_uid').entry().query().where('fieldUID', QueryOperation.EQUALS, 'value2');

const query = await stack.contentType('contenttype_uid').entry().query().or(query1, query2).find<BlogPostEntry>();
and

link
The and method retrieves the entries that meet all the specified conditions.

Returns:
Type
Query
Name	Type	Description
queries (required)

array

Array of query objects or raw queries

Example:


TypeScript
keyboard_arrow_down

const query1 = stack.contentType('contenttype_uid').entry().query().containedIn('fieldUID', ['value']);

const query2 = stack.contentType('contenttype_uid').entry().query().where('fieldUID', QueryOperation.EQUALS, 'value2');

const query = await stack.contentType('contenttype_uid').entry().query().and(query1, query2).find<BlogPostEntry>();
containedIn

link
The containedIn method retrieves the entries that contain the conditions specified.

Returns:
Type
Query
Name	Type	Description
key (required)

string

UID of the field

value (required)

array

Array of values that are to be used to match or compare

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType("contentTypeUid").entry().query();

const result = await query.containedIn('fieldUid', ['value1', 'value2']).find();
notContainedIn

link
The notContainedIn method retrieves the entries where the specified conditions are absent.

Returns:
Type
Query
Name	Type	Description
key (required)

string

UID of the field

value (required)

array

Array of values that are to be used to match or compare

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType("contentTypeUid").entry().query();

const result = await query.notContainedIn('fieldUid', ['value1', 'value2']).find();
equalTo

link
The equalTo method retrieves entries that match the specified conditions exactly.

Returns:
Type
Query
Name	Type	Description
key (required)

string

UID of the field

value (required)

array

Array of values that are to be used to match or compare

Example:


TypeScript
keyboard_arrow_down

const query = await stack.contentType('contenttype_uid').entry().query().equalTo('fieldUid', 'value').find<BlogPostEntry>();
exists

link
The exists method retrieves the entries that satisfy the specified condition of existence.

Returns:
Type
Query
Name	Type	Description
key (required)

string

UID of the field

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType("contentTypeUid").entry().query();

const result = await query.exists('fieldUid').find();
notExists

link
The notExists method retrieves entries where the specified conditions are not met.

Returns:
Type
Query
Name	Type	Description
key (required)

string

UID of the field

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType("contentTypeUid").entry().query();

const result = await query.notExists('fieldUid').find();
getQuery

link
The getQuery method retrieves the entries as per the specified query.

Returns:
Type
Query
Name	Type	Description
key (required)

string

UID of the field

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType("contentTypeUid").entry().query();

const result = await query.query({'brand': {'$nin_query': {'title': 'Apple Inc.'}}}).getQuery();



// OR


const asset = await stack.asset().query({'brand': {'$nin_query': {'title': 'Apple Inc.'}}}).getQuery();
greaterThan

link
The greaterThan method retrieves the entries that are greater than the specified condition.

Returns:
Type
Query
Name	Type	Description
key (required)

string

UID of the field

value (required)

array

Array of values that are to be used to match or compare

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType('contenttype_uid').query().where('title', QueryOperation.EQUALS, 'value');
const entryQuery = await stack.contentType('contenttype_uid').query().greaterThan('fieldUid', 'value').find<BlogPostEntry>();
greaterThanOrEqualTo

link
The greaterThanOrEqualTo method retrieves entries that meet the specified condition of being greater than or equal to a certain value.

Returns:
Type
Query
Name	Type	Description
key (required)

string

UID of the field

value (required)

array

Array of values that are to be used to match or compare

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType('contenttype_uid').query().where('title', QueryOperation.EQUALS, 'value');
const entryQuery = await stack.contentType('contenttype_uid').query().greaterThanOrEqualTo('fieldUid', 'value').find<BlogPostEntry>();
lessThan

link
The lessThan method retrieves the entries that are less than the specified condition.

Returns:
Type
Query
Name	Type	Description
key (required)

string

UID of the field

value (required)

array

Array of values that are to be used to match or compare

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType('contenttype_uid').query().where('title', QueryOperation.EQUALS, 'value');
const entryQuery = await stack.contentType('contenttype_uid').query().lessThan('fieldUid', 'value').find<BlogPostEntry>();
lessThanOrEqualTo

link
The lessThanOrEqualTo method retrieves entries that meet the specified condition of being less than or equal to a certain value.

Returns:
Type
Query
Name	Type	Description
key (required)

string

UID of the field

value (required)

array

Array of values that are to be used to match or compare

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType('contenttype_uid').query().where('title', QueryOperation.EQUALS, 'value');
const entryQuery = await stack.contentType('contenttype_uid').query().lessThanOrEqualTo('fieldUid', 'value').find<BlogPostEntry>();
referenceIn

link
The referenceIn method retrieves the entries that are referenced.

Returns:
Type
Query
Name	Type	Description
key (required)

string

UID of the reference field

value (required)

object

RAW (JSON) queries

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType('contenttype_uid').query().where('title', QueryOperation.EQUALS, 'value');
const entryQuery = await stack.contentType('contenttype_uid').query().referenceIn('reference_uid', query).find<BlogPostEntry>();
referenceNotIn

link
The referenceNotIn method retrieves the entries where the referenced items are not included.

Returns:
Type
Query
Name	Type	Description
key (required)

string

UID of the reference field

value (required)

object

RAW (JSON) queries

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType('contenttype_uid').query().where('title', QueryOperation.EQUALS, 'value');
const entryQuery = await stack.contentType('contenttype_uid').query().referenceNotIn('reference_uid', query).find<BlogPostEntry>();
regex

link
The regex method retrieves entries that match a specified regular expression pattern.

Returns:
Type
Query
Name	Type	Description
key (required)

string

UID of the field

value (required)

array

Array of values that are to be used to match or compare

options (required)

any

Match or compare value in entry

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType("contentTypeUid").entry().query();

const result = await query.regex('title','^Demo').find();

// OR

const result = await query.regex('title','^Demo', 'i').find<BlogPostEntry>();
search

link
The search method retrieves the entries that match the specified search criteria.

Returns:
Type
Query
Name	Type	Description
key (required)

string

UID of the field

Example:


TypeScript
keyboard_arrow_down

const entryQuery = await stack.contentType('contenttype_uid').query().search('key').find<BlogPostEntry>();
tags

link
The tags method fetches the entries that are associated with specific tags.

Returns:
Type
Query
Name	Type	Description
value (required)

array

Array of tags

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType('contenttype_uid').query().where('title', QueryOperation.EQUALS, 'value');
const entryQuery = await stack.contentType('contenttype_uid').query().tags(['tag1']).find<BlogPostEntry>();
Taxonomy

link
Taxonomy helps you categorize pieces of content within your stack to facilitate easy navigation, search, and retrieval of information.

Note: All methods in the Query section are applicable for taxonomy-based filtering as well.

equalAndBelow

link
The equalAndBelow operation retrieves all entries for a specific taxonomy that match a specific term and all its descendant terms, requiring only the target term.

Returns:
Type
Query
Name	Type	Description
key (required)

string

Enter the UID of the taxonomy

value (required)

string

Enter the UID of the term

levels

int

Enter the level

Example:

TypeScript
keyboard_arrow_down

const data = await stack
                   .taxonomy()
                   .where(
                       'taxonomies.one',
                       TaxonomyQueryOperation.EQ_BELOW,
                       'term_one',
                       {"levels": 1}  // optional
                   )
                   .find<TEntries>()
below

link
The below operation retrieves all entries for a specific taxonomy that match all of their descendant terms by specifying only the target term and a specific level.

Note: If you don't specify the level, the default behavior is to retrieve terms up to level 10.

Returns:
Type
Query
Name	Type	Description
key (required)

string

Enter the UID of the taxonomy

value (required)

string

Enter the UID of the term

levels

int

Enter the level

Example:

TypeScript
keyboard_arrow_down

const data = await stack

                   .taxonomy()

                   .where(

                       'taxonomies.one',

                       TaxonomyQueryOperation.BELOW,

                       'term_one',

                       {"levels": 1}  // optional

                   )

                   .find<TEntries>()
equalAndAbove

link
The equalAndAbove operation retrieves all entries for a specific taxonomy that match a specific term and all its ancestor terms, requiring only the target term and a specified level

Note: If you don't specify the level, the default behavior is to retrieve terms up to level 10.

Returns:
Type
Query
Name	Type	Description
key (required)

string

Enter the UID of the taxonomy

value (required)

string

Enter the UID of the term

levels

int

Enter the level

Example:

TypeScript
keyboard_arrow_down

const data = await stack

                   .taxonomy()

                   .where(

                       'taxonomies.one',

                       TaxonomyQueryOperation.EQ_ABOVE,

                       'term_one',

                       {"levels": 1}  // optional

                   )

                   .find<TEntries>()
above

link
The equalAndAbove operation retrieves all entries for a specific The above operation retrieves all entries for a specific taxonomy that match only the parent terms of a specified target term, excluding the target term itself and a specified level.

Note: If you don't specify the level, the default behavior is to retrieve terms up to level 10.

Returns:
Type
Query
Name	Type	Description
key (required)

string

Enter the UID of the taxonomy

value (required)

string

Enter the UID of the term

levels

int

Enter the level

Example:

TypeScript
keyboard_arrow_down

const data = await stack

                   .taxonomy()

                   .where(

                       'taxonomies.one',

                       TaxonomyQueryOperation.ABOVE,

                       'term_one',

                       {"levels": 1}  // optional

                   )

                   .find<TEntries>()
Global Fields

link
A Global field is a reusable field (or group of fields) that you can define once and reuse in any content type within your stack. This eliminates the need (and thereby time and efforts) to create the same set of fields repeatedly in multiple content types.

Example:


TypeScript
keyboard_arrow_down

const globalField = stack.globalField('global_field_uid'); // For a single globalField with uid 'global_field_uid'
Name	Type	Description
globalFieldUid

string

UID of the Global field

find

link
The find method retrieves all the global fields of the stack.

Returns:
Type
Promise
Example:


TypeScript
keyboard_arrow_down

import { BaseGlobalField, FindGlobalField } from '@contentstack/delivery-sdk'


interface ImageField extends BaseGlobalField {

  format: string

  // other props

}


const result = await stack

                       .globalField()

                       .find<ImageField>();
fetch

link
The fetch method retrieves the global field data of the specified global field.

Returns:
Type
Promise
Example:


TypeScript
keyboard_arrow_down

import { BaseGlobalField } from '@contentstack/delivery-sdk'


const stack = contentstack.stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });


interface ImageField extends BaseGlobalField {

  format: string

  // other props

}


const result = await stack

                       .globalField('global_field_uid')

                       .fetch<ImageField>();
includeBranch

link
The includeBranch method includes the branch details in the result for single or multiple global fields.

Returns:
Type
GlobalField
Example:


TypeScript
keyboard_arrow_down

const result = await stack

                       .globalField('global_field_uid')

                       .includeBranch()

                       .find<ImageField>();
Pagination

link
In a single instance, a query will retrieve only the first 100 items in the response. You can paginate and retrieve the rest of the items in batches using the skip and limit parameters in subsequent requests.

Example:


TypeScript
keyboard_arrow_down

const query = stack.contentType("contentTypeUid").entry().query();

const pagedResult = await query

                            .paginate()

                            .find<BlogPostEntry>(); 

// OR

const pagedResult = await query

                            .paginate({ skip: 20, limit: 20 })

                            .find<BlogPostEntry>();
next

link
The next method retrieves the next set of response values and skips the current number of responses.

Returns:
Type
Pagination
Example:


TypeScript
keyboard_arrow_down

const pagedResult = await query

                            .paginate()

                            .find<BlogPostEntry>();

const nextPageResult = await query.next().find<BlogPostEntry>();
previous

link
The previous method retrieves the previous set of response values and skips the current number of responses.

Returns:
Type
Pagination
Example:


TypeScript
keyboard_arrow_down

const pagedResult = await query

                            .paginate()

                            .find<BlogPostEntry>();

const prevPageResult = await query

                            .previous()

                            .find<BlogPostEntry>();
ImageTransform

link
Image transformations can be performed on images by specifying the desired parameters. The parameters control the specific transformations that will be applied to the image.

Example:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().bgColor('cccccc');


const transformURL = url.transform(transformObj);
auto

link
The auto method enables the functionality that automates certain image optimization features.

Returns:
Type
ImageTransform
Example:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().auto();


const transformURL = url.transform(transformObj);
bgColor

link
The bgColor method sets a background color for the given image.

Returns:
Type
ImageTransform
Name	Type	Description
color (required)

string

Color of the background

Example:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().bgColor('cccccc');


const transformURL = url.transform(transformObj);
blur

link
The blur method allows you to decrease the focus and clarity of a given image.

Returns:
Type
ImageTransform
Name	Type	Description
blurValue (required)

number

Set the blur intensity between 1 to 1000

Example:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().blur(10);


const transformURL = url.transform(transformObj);
brightness

link
The brightness method enables the functionality that automates certain image optimization features.

Returns:
Type
ImageTransform
Name	Type	Description
brightnessValue (required)

number

Set the brightness of the image between -100 to 100

Example:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().brightness(80.50);

const transformURL = url.transform(transformObj);
canvas

link
The canvas method allows you to increase the size of the canvas that surrounds an image.

Returns:
Type
ImageTransform
Name	Type	Description
canvasBy

CanvasByEnum

Specifies what params to use for creating canvas - DEFAULT, ASPECTRATIO, REGION, OFFSET

height (required)

string | number

Sets height of the canvas

width (required)

string | number

Sets width of the canvas

xval

string | number

Defines the X-axis position of the top left corner or horizontal offset

yval

string | number

Defines the Y-axis position of the top left corner or vertical offset

Example 1:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().canvas({ width: 100, height: 200 });

const transformURL = url.transform(transformObj);
Example 2:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().canvas({ width: 200, height: 300, canvasBy: CanvasByEnum.OFFSET, xval: 100, yval: 150 });

const transformURL = url.transform(transformObj);
contrast

link
The contrast method enables the functionality that automates certain image optimization features.

Returns:
Type
ImageTransform
Name	Type	Description
contrastValue (required)

number

Set the contrast of the image between -100 to 100

Example:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().contrast(-80.99);

const transformURL = url.transform(transformObj);
crop

link
The crop method allows you to remove pixels from an image by adjusting the height and width in the percentage value or aspect ratio.

Returns:
Type
ImageTransform
Name	Type	Description
cropBy

CropByEnum

Specify the CropBy type using values DEFAULT, ASPECTRATIO, REGION, or OFFSET.

width (required)

string | number

Specify the width to resize the image to.

The value can be in pixels (for example, 400) or in percentage (for example, 0.60 OR '60p')

height (required)

string | number

Specify the height to resize the image to. The value can be in pixels (for example, 400) or in percentage (for example, 0.60 OR '60p')

xval (required)

string | number

For the CropBy Region, specify the X-axis position of the top left corner of the crop. For CropBy Offset, specify the horizontal offset of the crop region.

yval

string | number

For CropBy Region, specify the Y-axis position of the top left corner of the crop. For CropBy Offset, specify the vertical offset of the crop region.

safe

boolean

Ensures that the output image never returns an error due to the specified crop area being out of bounds. The output image is returned as an intersection of the source image and the defined crop area.

smart

boolean

Ensures crop is done using content-aware algorithms. Content-aware image cropping returns a cropped image that automatically fits the defined dimensions while intelligently including the most important components of the image.

Example 1:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().crop({ width: 100, height: 200 });


const transformURL = url.transform(transformObj);
Example 2:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().crop({ width: 2, height: 3, cropBy: CropByEnum.ASPECTRATIO });


const transformURL = url.transform(transformObj);
Example 3:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().crop({ width: 200, height: 300, cropBy: CropByEnum.REGION, xval: 100, yval: 150 });

const transformURL = url.transform(transformObj);
Example 4:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().crop({ width: 200, height: 300, cropBy: CropByEnum.OFFSET, xval: 100, yval: 150 });


const transformURL = url.transform(transformObj);
dpr

link
The dpr method lets you deliver images with appropriate size to devices that come with a defined device pixel ratio.

Returns:
Type
ImageTransform
Name	Type	Description
dprValue

number

Specify the device pixel ratio. The value should range between 1-10000 or 0.0 to 9999.999

Example:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().resize({ width: 300, height: 500 }).dpr(10);

const transformURL = url.transform(transformObj);
fit

link
The fit method enables you to fit the given image properly within the specified height and width.

Returns:
Type
ImageTransform
Name	Type	Description
type

FitByEnum

Specifies fit type (Bounds or Crop)

Example:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().resize({ width: 200, height: 200 }).fit(FitByEnum.BOUNDS);

const transformURL = url.transform(transformObj);
format

link
The format method lets you convert a given image from one format to another.

Returns:
Type
ImageTransform
Name	Type	Description
format

FitByEnum

Specify the format

Example:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().format(FormatEnum.PJPG);

const transformURL = url.transform(transformObj);
frame

link
The frame method retrieves the first frame from an animated GIF (Graphics Interchange Format) file that comprises a sequence of moving images.

Returns:
Type
ImageTransform
Example:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().frame();

const transformURL = url.transform(transformObj);
orient

link
The orient method allows you to rotate or flip an image in any direction.

Returns:
Type
ImageTransform
Name	Type	Description
orientType (required)

FitByEnum

Type of Orientation. Values are DEFAULT, FLIP_HORIZONTAL, FLIP_HORIZONTAL_VERTICAL, FLIP_VERTICAL, FLIP_HORIZONTAL_LEFT, RIGHT, FLIP_HORIZONTAL_RIGHT, LEFT.

Example:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().orient(Orientation.FLIP_HORIZONTAL);


const transformURL = url.transform(transformObj);
overlay

link
The overlay method lets you place one image over another by specifying the relative URL of the image.

Returns:
Type
ImageTransform
Name	Type	Description
relativeURL (required)

string

URL of the image to overlay on base image

align

OverlayAlignEnum

Lets you define the position of the overlay image. Accepted values are TOP, BOTTOM, LEFT, RIGHT, MIDDLE, CENTER

repeat

OverlayRepeatEnum

Lets you define how the overlay image will be repeated on the given image. Accepted values are X, Y, BOTH

width

string | number

Lets you define the width of the overlay image. For pixels, use any whole number between 1 and 8192. For percentages, use any decimal number between 0.0 and 0.99

height

string | number

Lets you define the height of the overlay image. For pixels, use any whole number between 1 and 8192. For percentages, use any decimal number between 0.0 and 0.99

pad

number

Lets you add extra pixels to the edges of an image. This is useful if you want to add whitespace or border to an image

Example 1:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().overlay({ relativeURL: overlayImgURL });

const transformURL = url.transform(transformObj);
Example 2:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().overlay({ relativeURL: overlayImgURL, align: OverlayAlignEnum.BOTTOM });

const transformURL = url.transform(transformObj);
Example 3:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().overlay({

                       relativeURL: overlayImgURL,

                       align: OverlayAlignEnum.BOTTOM,

                       repeat: OverlayRepeatEnum.Y,

                       width: '50p',

                     });

const transformURL = url.transform(transformObj);
padding

link
The padding method lets you add extra pixels to the edges of an image's border or add whitespace.

Returns:
Type
ImageTransform
Name	Type	Description
padding (required)

number

padding value in pixels or percentages

Example 1:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().padding([25, 50, 75, 90]);

const transformURL = url.transform(transformObj);
Example 2:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().padding(50);

const transformURL = url.transform(transformObj);
quality

link
The quality method lets you control the compression level of images that have lossy file format.

Returns:
Type
ImageTransform
Name	Type	Description
qualityNum (required)

number

Quality range: 1 - 100

Example:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().quality(50);

const transformURL = url.transform(transformObj);
resize

link
The resize method lets you resize the image in terms of width, height, upscaling the image.

Returns:
Type
ImageTransform
Name	Type	Description
width

number

Specifies the width to resize the image to. The value can be in pixels (for example, 400) or in percentage (for example, 0.60 OR '60p')

height

string | number

Specifies the height to resize the image to.The value can be in pixels (for example, 400) or in percentage (for example, 0.60 OR '60p')

disable

string

The disable parameter disables the functionality that is enabled by default. As of now, there is only one value, i.e., upscale, that you can use with the disable parameter.

Example:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().resize({ width: 200, height: 200, disable: 'upscale' });

const transformURL = url.transform(transformObj);
resizeFilter

link
The resizeFilter method allows you to increase or decrease the number of pixels in a given image.

Returns:
Type
ImageTransform
Name	Type	Description
type (required)

ResizeFilterEnum

Types of Filter to apply. Values are NEAREST, BILINEAR, BICUBIC, LANCZOS2, LANCZOS3.

Example:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().resize({ width: 500, height: 550 }).resizeFilter(ResizeFilterEnum.NEAREST);

const transformURL = url.transform(transformObj);
saturation

link
The saturation method allows you to increase or decrease the intensity of the colors in a given image.

Returns:
Type
ImageTransform
Name	Type	Description
saturationValue (required)

number

To set the saturation of image between -100 to 100

Example:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().saturation(-80.99);

const transformURL = url.transform(transformObj);
sharpen

link
The sharpen method allows you to increase the definition of the edges of objects in an image.

Returns:
Type
ImageTransform
Name	Type	Description
amount (required)

number

Specifies the amount of contrast to be set for the image edges between the range [0-10]

radius (required)

number

Specifies the radius of the image edges between the range [1-1000]

threshold (required)

number

Specifies the range of image edges that need to be ignored while sharpening between the range [0-255]

Example:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().sharpen(5, 1000, 2);

const transformURL = url.transform(transformObj);
trim

link
The trim method lets you trim an image from the edges.

Returns:
Type
ImageTransform
Name	Type	Description
trimValue (required)

number | number[]

Specifies values for top, right, bottom, and left edges of an image.

Example 1:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().trim([25, 50, 75, 90]);

const transformURL = url.transform(transformObj);
Example 2:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().trim([25, 50, 25]);

const transformURL = url.transform(transformObj);
Example 3:


TypeScript
keyboard_arrow_down

const url = 'www.example.com';

const transformObj = new ImageTransform().trim(50);

const transformURL = url.transform(transformObj);