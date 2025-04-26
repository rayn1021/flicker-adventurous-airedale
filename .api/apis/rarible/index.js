"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var oas_1 = __importDefault(require("oas"));
var core_1 = __importDefault(require("api/dist/core"));
var openapi_json_1 = __importDefault(require("./openapi.json"));
var SDK = /** @class */ (function () {
    function SDK() {
        this.spec = oas_1.default.init(openapi_json_1.default);
        this.core = new core_1.default(this.spec, 'rarible/v0.1 (api/6.1.3)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    SDK.prototype.config = function (config) {
        this.core.setConfig(config);
    };
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    SDK.prototype.auth = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.core).setAuth.apply(_a, values);
        return this;
    };
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    SDK.prototype.server = function (url, variables) {
        if (variables === void 0) { variables = {}; }
        this.core.setServer(url, variables);
    };
    /**
     * Returns NFT Item by Id
     *
     * @summary Get NFT by Id
     * @throws FetchError<400, types.GetItemByIdResponse400> Bad Request
     * @throws FetchError<404, types.GetItemByIdResponse404> Not Found
     * @throws FetchError<500, types.GetItemByIdResponse500> Internal Server Error
     */
    SDK.prototype.getItemById = function (metadata) {
        return this.core.fetch('/v0.1/items/{itemId}', 'get', metadata);
    };
    /**
     * Returns NFT Items by specified list of Ids
     *
     * @summary Get NFT by Ids
     * @throws FetchError<400, types.GetItemByIdsResponse400> Bad Request
     * @throws FetchError<404, types.GetItemByIdsResponse404> Not Found
     * @throws FetchError<500, types.GetItemByIdsResponse500> Internal Server Error
     */
    SDK.prototype.getItemByIds = function (body) {
        return this.core.fetch('/v0.1/items/byIds', 'post', body);
    };
    /**
     * Returns NFT royalties by Id
     *
     * @summary Get NFT royalties by Id
     * @throws FetchError<400, types.GetItemRoyaltiesByIdResponse400> Bad Request
     * @throws FetchError<500, types.GetItemRoyaltiesByIdResponse500> Internal Server Error
     */
    SDK.prototype.getItemRoyaltiesById = function (metadata) {
        return this.core.fetch('/v0.1/items/{itemId}/royalties', 'get', metadata);
    };
    /**
     * Reloads NFT metadata from the source. If source not available, old metadata stays.
     *
     * @summary Reset NFT metadata
     * @throws FetchError<400, types.ResetItemMetaResponse400> Bad Request
     * @throws FetchError<500, types.ResetItemMetaResponse500> Internal Server Error
     */
    SDK.prototype.resetItemMeta = function (metadata) {
        return this.core.fetch('/v0.1/items/{itemId}/resetMeta', 'delete', metadata);
    };
    /**
     * Returns list of NFTs belong to specified user and sorted by `last updated` date
     *
     * @summary Get NFT owned by user
     * @throws FetchError<400, types.GetItemsByOwnerResponse400> Bad Request
     * @throws FetchError<500, types.GetItemsByOwnerResponse500> Internal Server Error
     */
    SDK.prototype.getItemsByOwner = function (metadata) {
        return this.core.fetch('/v0.1/items/byOwner', 'get', metadata);
    };
    /**
     * Returns list of NFTs created by specified user and sorted by `last updated` date
     *
     * @summary Get NFT created by user
     * @throws FetchError<400, types.GetItemsByCreatorResponse400> Bad Request
     * @throws FetchError<500, types.GetItemsByCreatorResponse500> Internal Server Error
     */
    SDK.prototype.getItemsByCreator = function (metadata) {
        return this.core.fetch('/v0.1/items/byCreator', 'get', metadata);
    };
    /**
     * Returns list of NFTs from specified collection and sorted by `last updated` date
     *
     * @summary Get NFT from collection
     * @throws FetchError<400, types.GetItemsByCollectionResponse400> Bad Request
     * @throws FetchError<500, types.GetItemsByCollectionResponse500> Internal Server Error
     */
    SDK.prototype.getItemsByCollection = function (metadata) {
        return this.core.fetch('/v0.1/items/byCollection', 'get', metadata);
    };
    /**
     * Returns list of NFTs belong to specified user and sorted by `last updated` date of
     * ownership
     *
     * @summary Get NFT owned by user - detailed
     * @throws FetchError<400, types.GetItemsByOwnerWithOwnershipResponse400> Bad Request
     * @throws FetchError<500, types.GetItemsByOwnerWithOwnershipResponse500> Internal Server Error
     */
    SDK.prototype.getItemsByOwnerWithOwnership = function (metadata) {
        return this.core.fetch('/v0.1/items/byOwnerWithOwnership', 'get', metadata);
    };
    /**
     * Returns all NFT Items in accordance with specified filters and sorted by `last updated`
     * date
     *
     * @summary Get all NFTs
     * @throws FetchError<400, types.GetAllItemsResponse400> Bad Request
     * @throws FetchError<500, types.GetAllItemsResponse500> Internal Server Error
     */
    SDK.prototype.getAllItems = function (metadata) {
        return this.core.fetch('/v0.1/items/all', 'get', metadata);
    };
    /**
     * Returns aggregation of existing traits for specified collections with counter for each
     * trait type/value.
     *
     * @summary Get NFT collection traits
     * @throws FetchError<400, types.QueryTraitsResponse400> Bad Request
     * @throws FetchError<500, types.QueryTraitsResponse500> Internal Server Error
     */
    SDK.prototype.queryTraits = function (metadata) {
        return this.core.fetch('/v0.1/items/traits', 'get', metadata);
    };
    /**
     * Returns aggregation of existing traits for specified collections with counter for each
     * trait type/value.\  This is full-text-search, where you can specify filter for trait
     * keys not precisely\  (for example, results `back` filter include `Background` trait)
     *
     * @summary Search NFT collection traits
     * @throws FetchError<400, types.SearchTraitsResponse400> Bad Request
     * @throws FetchError<500, types.SearchTraitsResponse500> Internal Server Error
     */
    SDK.prototype.searchTraits = function (metadata) {
        return this.core.fetch('/v0.1/items/traits/search', 'get', metadata);
    };
    /**
     * Returns the rarity of the trait
     *
     * @summary Get NFT traits rarity
     */
    SDK.prototype.queryTraitsWithRarity = function (body) {
        return this.core.fetch('/v0.1/items/traits/rarity', 'post', body);
    };
    /**
     * Advanced search returns NFTs satisfying provided filter
     *
     * @summary Search NFTs
     * @throws FetchError<400, types.SearchItemsResponse400> Bad Request
     * @throws FetchError<500, types.SearchItemsResponse500> Internal Server Error
     */
    SDK.prototype.searchItems = function (body) {
        return this.core.fetch('/v0.1/items/search', 'post', body);
    };
    /**
     * Returns Lazy NFT Item by Id
     *
     * @summary Get Lazy NFT
     * @throws FetchError<400, types.GetLazyItemByIdResponse400> Bad Request
     * @throws FetchError<404, types.GetLazyItemByIdResponse404> Not Found
     * @throws FetchError<500, types.GetLazyItemByIdResponse500> Internal Server Error
     */
    SDK.prototype.getLazyItemById = function (metadata) {
        return this.core.fetch('/v0.1/items/lazy/{itemId}', 'get', metadata);
    };
    /**
     * Create Lazy NFT (supported only for some blockchains)
     *
     * @summary Mint Lazy NFT
     * @throws FetchError<400, types.MintLazyItemResponse400> Bad Request
     * @throws FetchError<404, types.MintLazyItemResponse404> Not Found
     * @throws FetchError<500, types.MintLazyItemResponse500> Internal Server Error
     */
    SDK.prototype.mintLazyItem = function (body) {
        return this.core.fetch('/v0.1/items/lazy/mint', 'post', body);
    };
    /**
     * Deletes Lazy NFT (supported only for some blockchains)
     *
     * @summary Burn Lazy NFT
     * @throws FetchError<400, types.BurnLazyItemResponse400> Bad Request
     * @throws FetchError<404, types.BurnLazyItemResponse404> Not Found
     * @throws FetchError<500, types.BurnLazyItemResponse500> Internal Server Error
     */
    SDK.prototype.burnLazyItem = function (body) {
        return this.core.fetch('/v0.1/items/lazy/burn', 'post', body);
    };
    /**
     * Returns Ownership by Id
     *
     * @summary Get NFT Ownership by Id
     * @throws FetchError<400, types.GetOwnershipByIdResponse400> Bad Request
     * @throws FetchError<404, types.GetOwnershipByIdResponse404> Not Found
     * @throws FetchError<500, types.GetOwnershipByIdResponse500> Internal Server Error
     */
    SDK.prototype.getOwnershipById = function (metadata) {
        return this.core.fetch('/v0.1/ownerships/{ownershipId}', 'get', metadata);
    };
    /**
     * Returns Ownerships by specified list of Ids
     *
     * @summary Get NFT Ownerships by Ids
     * @throws FetchError<400, types.GetOwnershipsByIdsResponse400> Bad Request
     * @throws FetchError<500, types.GetOwnershipsByIdsResponse500> Internal Server Error
     */
    SDK.prototype.getOwnershipsByIds = function (body) {
        return this.core.fetch('/v0.1/ownerships/byIds', 'post', body);
    };
    /**
     * Returns list of NFTs Ownerships from specified collection and sorted by `last updated`
     * date
     *
     * @summary Get NFT Collection's Ownerships
     * @throws FetchError<400, types.GetOwnershipsByCollectionResponse400> Bad Request
     * @throws FetchError<500, types.GetOwnershipsByCollectionResponse500> Internal Server Error
     */
    SDK.prototype.getOwnershipsByCollection = function (metadata) {
        return this.core.fetch('/v0.1/ownerships/byCollection', 'get', metadata);
    };
    /**
     * Returns list of NFTs Ownerships for specified NFT and sorted by `last updated` date
     *
     * @summary Get NFTs Ownerships
     * @throws FetchError<400, types.GetOwnershipsByItemResponse400> Bad Request
     * @throws FetchError<500, types.GetOwnershipsByItemResponse500> Internal Server Error
     */
    SDK.prototype.getOwnershipsByItem = function (metadata) {
        return this.core.fetch('/v0.1/ownerships/byItem', 'get', metadata);
    };
    /**
     * Advanced search returns NFT Ownerships satisfying provided filter
     *
     * @summary Search NFT Ownerships
     * @throws FetchError<400, types.SearchOwnershipsResponse400> Bad Request
     * @throws FetchError<500, types.SearchOwnershipsResponse500> Internal Server Error
     */
    SDK.prototype.searchOwnerships = function (body) {
        return this.core.fetch('/v0.1/ownerships/search', 'post', body);
    };
    /**
     * Returns list of collection with owned items by specified owner
     *
     * @summary Get collections owned items by owner
     * @throws FetchError<400, types.GetCollectionsWithOwnedItemsResponse400> Bad Request
     * @throws FetchError<500, types.GetCollectionsWithOwnedItemsResponse500> Internal Server Error
     */
    SDK.prototype.getCollectionsWithOwnedItems = function (metadata) {
        return this.core.fetch('/v0.1/ownerships/collections', 'get', metadata);
    };
    /**
     * Returns Order by Id
     *
     * @summary Get Order
     * @throws FetchError<400, types.GetOrderByIdResponse400> Bad Request
     * @throws FetchError<404, types.GetOrderByIdResponse404> Not Found
     * @throws FetchError<500, types.GetOrderByIdResponse500> Internal Server Error
     */
    SDK.prototype.getOrderById = function (metadata) {
        return this.core.fetch('/v0.1/orders/{id}', 'get', metadata);
    };
    /**
     * Prepare all required data to match given order on the blockchain
     *
     * @summary Prepare order transaction
     * @throws FetchError<400, types.PrepareOrderTransactionResponse400> Bad Request
     * @throws FetchError<404, types.PrepareOrderTransactionResponse404> Not Found
     * @throws FetchError<500, types.PrepareOrderTransactionResponse500> Internal Server Error
     */
    SDK.prototype.prepareOrderTransaction = function (body, metadata) {
        return this.core.fetch('/v0.1/orders/{id}/prepareTx', 'post', body, metadata);
    };
    /**
     * Prepare all required data to cancel given order on the blockchain
     *
     * @summary Prepare order cancel transaction
     * @throws FetchError<400, types.PrepareOrderCancelTransactionResponse400> Bad Request
     * @throws FetchError<404, types.PrepareOrderCancelTransactionResponse404> Not Found
     * @throws FetchError<500, types.PrepareOrderCancelTransactionResponse500> Internal Server Error
     */
    SDK.prototype.prepareOrderCancelTransaction = function (metadata) {
        return this.core.fetch('/v0.1/orders/{id}/prepareCancelTx', 'post', metadata);
    };
    /**
     * Report Error Order
     *
     * @summary Report Order
     * @throws FetchError<400, types.ReportOrderByIdResponse400> Bad Request
     * @throws FetchError<404, types.ReportOrderByIdResponse404> Not Found
     * @throws FetchError<500, types.ReportOrderByIdResponse500> Internal Server Error
     */
    SDK.prototype.reportOrderById = function (metadata) {
        return this.core.fetch('/v0.1/orders/{id}/report', 'post', metadata);
    };
    /**
     * Create or update off-chain Order (supported only for some blockchains)
     *
     * @summary Create or update Order
     * @throws FetchError<400, types.UpsertOrderResponse400> Bad Request
     * @throws FetchError<500, types.UpsertOrderResponse500> Internal Server Error
     */
    SDK.prototype.upsertOrder = function (body) {
        return this.core.fetch('/v0.1/orders', 'post', body);
    };
    /**
     * Validates and returns order by Id. IMPORTANT - validation is time-consuming operation!
     *
     * @summary Get validated Order by Id
     * @throws FetchError<400, types.GetValidatedOrderByIdResponse400> Bad Request
     * @throws FetchError<404, types.GetValidatedOrderByIdResponse404> Not Found
     * @throws FetchError<500, types.GetValidatedOrderByIdResponse500> Internal Server Error
     */
    SDK.prototype.getValidatedOrderById = function (metadata) {
        return this.core.fetch('/v0.1/orders/{id}/validate', 'get', metadata);
    };
    /**
     * Returns Orders by specified list of Ids
     *
     * @summary Get Orders by Ids
     * @throws FetchError<400, types.GetOrdersByIdsResponse400> Bad Request
     * @throws FetchError<500, types.GetOrdersByIdsResponse500> Internal Server Error
     */
    SDK.prototype.getOrdersByIds = function (body) {
        return this.core.fetch('/v0.1/orders/byIds', 'post', body);
    };
    /**
     * Returns all Orders in accordance with specified filters and sorted by `last updated`
     * date
     *
     * @summary Get all Orders
     * @throws FetchError<400, types.GetOrdersAllResponse400> Bad Request
     * @throws FetchError<500, types.GetOrdersAllResponse500> Internal Server Error
     */
    SDK.prototype.getOrdersAll = function (metadata) {
        return this.core.fetch('/v0.1/orders/all', 'get', metadata);
    };
    /**
     * Returns all sales & transfers in accordance with specified filters and sorted by `db
     * updated` date. During internal updates (like migrations) Orders can be updated for
     * technical reasons. In such case, `last update` date won't be changed. If you want to
     * store Orders in your own storage and keep it synced, use this method.
     *
     * @summary Get all Orders (for sync)
     * @throws FetchError<400, types.GetAllSyncResponse400> Bad Request
     * @throws FetchError<500, types.GetAllSyncResponse500> Internal Server Error
     */
    SDK.prototype.getAllSync = function (metadata) {
        return this.core.fetch('/v0.1/orders/sync', 'get', metadata);
    };
    /**
     * Returns sell NFT Sales created by specified user and sorted by `last update` date
     *
     * @summary Get user's sell Orders
     * @throws FetchError<400, types.GetSellOrdersByMakerResponse400> Bad Request
     * @throws FetchError<500, types.GetSellOrdersByMakerResponse500> Internal Server Error
     */
    SDK.prototype.getSellOrdersByMaker = function (metadata) {
        return this.core.fetch('/v0.1/orders/sell/byMaker', 'get', metadata);
    };
    /**
     * Returns sell sales & transfer created for specified NFT and sorted by price in USD
     * (cheapest first)
     *
     * @summary Get sell Orders for NFT
     * @throws FetchError<400, types.GetSellOrdersByItemResponse400> Bad Request
     * @throws FetchError<500, types.GetSellOrdersByItemResponse500> Internal Server Error
     */
    SDK.prototype.getSellOrdersByItem = function (metadata) {
        return this.core.fetch('/v0.1/orders/sell/byItem', 'get', metadata);
    };
    /**
     * Returns sell Orders satisfying specified filters and sorted by `last update` date
     *
     * @summary Get sell Orders
     * @throws FetchError<400, types.GetSellOrdersResponse400> Bad Request
     * @throws FetchError<500, types.GetSellOrdersResponse500> Internal Server Error
     */
    SDK.prototype.getSellOrders = function (metadata) {
        return this.core.fetch('/v0.1/orders/sell', 'get', metadata);
    };
    /**
     * Returns bid Orders created by specified user and sorted by `last update` date
     *
     * @summary Get user's bid Orders
     * @throws FetchError<400, types.GetOrderBidsByMakerResponse400> Bad Request
     * @throws FetchError<500, types.GetOrderBidsByMakerResponse500> Internal Server Error
     */
    SDK.prototype.getOrderBidsByMaker = function (metadata) {
        return this.core.fetch('/v0.1/orders/bids/byMaker', 'get', metadata);
    };
    /**
     * Returns bid Orders created for specified NFT and sorted by price in USD (expensive
     * first)
     *
     * @summary Get bid Orders for NFT
     * @throws FetchError<400, types.GetOrderBidsByItemResponse400> Bad Request
     * @throws FetchError<500, types.GetOrderBidsByItemResponse500> Internal Server Error
     */
    SDK.prototype.getOrderBidsByItem = function (metadata) {
        return this.core.fetch('/v0.1/orders/bids/byItem', 'get', metadata);
    };
    /**
     * Returns floor bids created for specified NFT Collection and sorted by price in USD
     * (expensive first)
     *
     * @summary Get floor bids for Collection
     * @throws FetchError<400, types.GetOrderFloorBidsByCollectionResponse400> Bad Request
     * @throws FetchError<500, types.GetOrderFloorBidsByCollectionResponse500> Internal Server Error
     */
    SDK.prototype.getOrderFloorBidsByCollection = function (metadata) {
        return this.core.fetch('/v0.1/orders/floorBids/byCollection', 'get', metadata);
    };
    /**
     * Get for buy pricing info from AMM Order
     *
     * @summary Get AMM Order trade info
     * @throws FetchError<400, types.GetAmmOrderTradeInfoResponse400> Bad Request
     * @throws FetchError<404, types.GetAmmOrderTradeInfoResponse404> Not Found
     * @throws FetchError<500, types.GetAmmOrderTradeInfoResponse500> Internal Server Error
     */
    SDK.prototype.getAmmOrderTradeInfo = function (metadata) {
        return this.core.fetch('/v0.1/orders/amm/{id}/tradeInfo', 'get', metadata);
    };
    /**
     * Returns Protocol fee settings for Orders
     *
     * @summary Get fee settings
     * @throws FetchError<400, types.GetOrderFeesResponse400> Bad Request
     * @throws FetchError<500, types.GetOrderFeesResponse500> Internal Server Error
     */
    SDK.prototype.getOrderFees = function (metadata) {
        return this.core.fetch('/v0.1/orders/settings/fees', 'get', metadata);
    };
    /**
     * Returns user's Activities (like transfers, mints, sells etc) sorted by date. This API is
     * deprecated in favor of `Search Activities`
     *
     * @summary Get user Activities
     * @throws FetchError<400, types.GetActivitiesByUserResponse400> Bad Request
     * @throws FetchError<500, types.GetActivitiesByUserResponse500> Internal Server Error
     */
    SDK.prototype.getActivitiesByUser = function (metadata) {
        return this.core.fetch('/v0.1/activities/byUser', 'get', metadata);
    };
    /**
     * Returns users Activities (like transfers, mints, sells etc) sorted by date. This API is
     * deprecated in favor of `Search Activities`
     *
     * @summary Get users Activities
     * @throws FetchError<400, types.GetActivitiesByUsersResponse400> Bad Request
     * @throws FetchError<500, types.GetActivitiesByUsersResponse500> Internal Server Error
     */
    SDK.prototype.getActivitiesByUsers = function (body) {
        return this.core.fetch('/v0.1/activities/byUsers', 'post', body);
    };
    /**
     * Returns Activities related to specified NFT and sorted by date. This API is deprecated
     * in favor of `Search Activities`
     *
     * @summary Get NFT Activities
     * @throws FetchError<400, types.GetActivitiesByItemResponse400> Bad Request
     * @throws FetchError<500, types.GetActivitiesByItemResponse500> Internal Server Error
     */
    SDK.prototype.getActivitiesByItem = function (metadata) {
        return this.core.fetch('/v0.1/activities/byItem', 'get', metadata);
    };
    /**
     * Returns Activities related to NFTs from specified Collection and sorted by date. This
     * API is deprecated in favor of `Search Activities`
     *
     * @summary Get NFT Collection Activities
     * @throws FetchError<400, types.GetActivitiesByCollectionResponse400> Bad Request
     * @throws FetchError<500, types.GetActivitiesByCollectionResponse500> Internal Server Error
     */
    SDK.prototype.getActivitiesByCollection = function (metadata) {
        return this.core.fetch('/v0.1/activities/byCollection', 'get', metadata);
    };
    /**
     * Returns all Activities in accordance with specified filters and sorted by `db updated`
     * date. During internal updates (like migrations) Activities can be updated for technical
     * reasons. In such case, `date` field won't be changed. If you want to store Activities in
     * your own storage and keep it synced, use this method.
     *
     * @summary Get all Activities (for sync)
     * @throws FetchError<400, types.GetAllActivitiesSyncResponse400> Bad Request
     * @throws FetchError<500, types.GetAllActivitiesSyncResponse500> Internal Server Error
     */
    SDK.prototype.getAllActivitiesSync = function (metadata) {
        return this.core.fetch('/v0.1/activities/sync', 'get', metadata);
    };
    /**
     * Returns all Activities in accordance with specified filters and sorted by date. This API
     * is deprecated in favor of `Search Activities`
     *
     * @summary Get all Activities
     * @throws FetchError<400, types.GetAllActivitiesResponse400> Bad Request
     * @throws FetchError<500, types.GetAllActivitiesResponse500> Internal Server Error
     */
    SDK.prototype.getAllActivities = function (metadata) {
        return this.core.fetch('/v0.1/activities/all', 'get', metadata);
    };
    /**
     * Advanced search returns Activities satisfying provided filter
     *
     * @summary Search Activities
     * @throws FetchError<400, types.SearchActivitiesResponse400> Bad Request
     * @throws FetchError<500, types.SearchActivitiesResponse500> Internal Server Error
     */
    SDK.prototype.searchActivities = function (body) {
        return this.core.fetch('/v0.1/activities/search', 'post', body);
    };
    /**
     * Returns NFT Collection by Id
     *
     * @summary Get NFT Collection by Id
     * @throws FetchError<400, types.GetCollectionByIdResponse400> Bad Request
     * @throws FetchError<404, types.GetCollectionByIdResponse404> Not Found
     * @throws FetchError<500, types.GetCollectionByIdResponse500> Internal Server Error
     */
    SDK.prototype.getCollectionById = function (metadata) {
        return this.core.fetch('/v0.1/collections/{collection}', 'get', metadata);
    };
    /**
     * Returns next available TokenId for specified minter
     *
     * @summary Generate TokenId
     * @throws FetchError<400, types.GenerateTokenIdResponse400> Bad Request
     * @throws FetchError<500, types.GenerateTokenIdResponse500> Internal Server Error
     */
    SDK.prototype.generateTokenId = function (metadata) {
        return this.core.fetch('/v0.1/collections/{collection}/generateTokenId', 'get', metadata);
    };
    /**
     * Reloads metadata for all NFTs in the Collection (see 'Reset NFT metadata' API)
     *
     * @summary Reset NFT metadata
     * @throws FetchError<400, types.RefreshCollectionItemsMetaResponse400> Bad Request
     * @throws FetchError<500, types.RefreshCollectionItemsMetaResponse500> Internal Server Error
     */
    SDK.prototype.refreshCollectionItemsMeta = function (metadata) {
        return this.core.fetch('/v0.1/collections/{collection}/refreshMeta', 'delete', metadata);
    };
    /**
     * Reloads metadata for Collection (NOT for collection's NFTs)
     *
     * @summary Reset Collection metadata
     * @throws FetchError<400, types.ResetCollectionMetaResponse400> Bad Request
     * @throws FetchError<500, types.ResetCollectionMetaResponse500> Internal Server Error
     */
    SDK.prototype.resetCollectionMeta = function (metadata) {
        return this.core.fetch('/v0.1/collections/{collection}/resetMeta', 'delete', metadata);
    };
    /**
     * Returns list of NFT Collections belong to specified user
     *
     * @summary Get NFT Collections owned by user
     * @throws FetchError<400, types.GetCollectionsByOwnerResponse400> Bad Request
     * @throws FetchError<500, types.GetCollectionsByOwnerResponse500> Internal Server Error
     */
    SDK.prototype.getCollectionsByOwner = function (metadata) {
        return this.core.fetch('/v0.1/collections/byOwner', 'get', metadata);
    };
    /**
     * Returns all NFT Collections in accordance with specified filters
     *
     * @summary Get all NFT Collections
     * @throws FetchError<400, types.GetAllCollectionsResponse400> Bad Request
     * @throws FetchError<500, types.GetAllCollectionsResponse500> Internal Server Error
     */
    SDK.prototype.getAllCollections = function (metadata) {
        return this.core.fetch('/v0.1/collections/all', 'get', metadata);
    };
    /**
     * Advanced search returns NFT Collections satisfying provided filter
     *
     * @summary Search NFT Collections
     * @throws FetchError<400, types.SearchCollectionResponse400> Bad Request
     * @throws FetchError<500, types.SearchCollectionResponse500> Internal Server Error
     */
    SDK.prototype.searchCollection = function (body) {
        return this.core.fetch('/v0.1/collections/search', 'post', body);
    };
    /**
     * Users (top buyers/sellers) leaderboard. Calculated as traded worth for the period.
     *
     * @summary Get user volume
     * @throws FetchError<400, types.GetUserRankingByVolumeResponse400> Bad Request
     * @throws FetchError<500, types.GetUserRankingByVolumeResponse500> Internal Server Error
     */
    SDK.prototype.getUserRankingByVolume = function (metadata) {
        return this.core.fetch('/v0.1/data/rankings/{entity}/volume', 'get', metadata);
    };
    /**
     * Collections leaderboard by trade activity
     *
     * @summary Get NFT Collections volume
     * @throws FetchError<400, types.GetCollectionRankingByVolumeResponse400> Bad Request
     * @throws FetchError<500, types.GetCollectionRankingByVolumeResponse500> Internal Server Error
     */
    SDK.prototype.getCollectionRankingByVolume = function (metadata) {
        return this.core.fetch('/v0.1/data/rankings/collections/volume', 'get', metadata);
    };
    /**
     * Collections leaderboard
     *
     * @summary Get NFT Collections leaderboard
     * @throws FetchError<400, types.GetCollectionLeaderboardResponse400> Bad Request
     * @throws FetchError<500, types.GetCollectionLeaderboardResponse500> Internal Server Error
     */
    SDK.prototype.getCollectionLeaderboard = function (metadata) {
        return this.core.fetch('/v2.0/data/leaderboard/collections', 'get', metadata);
    };
    /**
     * User collections leaderboard
     *
     * @summary Get NFT Collections leaderboard for a specific owner adresses
     * @throws FetchError<400, types.GetCollectionLeaderboardByOwnerResponse400> Bad Request
     * @throws FetchError<500, types.GetCollectionLeaderboardByOwnerResponse500> Internal Server Error
     */
    SDK.prototype.getCollectionLeaderboardByOwner = function (metadata) {
        return this.core.fetch('/v2.0/data/leaderboard/collections/byOwner', 'get', metadata);
    };
    /**
     * Global collection statistics by ID
     *
     * @summary Get global (period-independent) statistics by collection ID
     * @throws FetchError<400, types.GetGlobalCollectionStatisticsResponse400> Bad Request
     * @throws FetchError<500, types.GetGlobalCollectionStatisticsResponse500> Internal Server Error
     */
    SDK.prototype.getGlobalCollectionStatistics = function (metadata) {
        return this.core.fetch('/v2.0/data/collections/{id}/statistics/global', 'get', metadata);
    };
    /**
     * Global collection statistics by IDs
     *
     * @summary Get global (period-independent) statistics by collection IDs
     * @throws FetchError<400, types.GetGlobalCollectionStatisticsByIdsResponse400> Bad Request
     * @throws FetchError<500, types.GetGlobalCollectionStatisticsByIdsResponse500> Internal Server Error
     */
    SDK.prototype.getGlobalCollectionStatisticsByIds = function (body) {
        return this.core.fetch('/v2.0/data/collections/statistics/global/byIds', 'post', body);
    };
    /**
     * Period-based collection statistics by ID
     *
     * @summary Get period-based statistics by collection ID
     * @throws FetchError<400, types.GetPeriodCollectionStatisticsResponse400> Bad Request
     * @throws FetchError<500, types.GetPeriodCollectionStatisticsResponse500> Internal Server Error
     */
    SDK.prototype.getPeriodCollectionStatistics = function (metadata) {
        return this.core.fetch('/v2.0/data/collections/{id}/statistics/period', 'get', metadata);
    };
    /**
     * Period-based collection statistics by IDs
     *
     * @summary Get period-based statistics by collection IDs
     * @throws FetchError<400, types.GetPeriodCollectionStatisticsByIdsResponse400> Bad Request
     * @throws FetchError<500, types.GetPeriodCollectionStatisticsByIdsResponse500> Internal Server Error
     */
    SDK.prototype.getPeriodCollectionStatisticsByIds = function (body) {
        return this.core.fetch('/v2.0/data/collections/statistics/period/byIds', 'post', body);
    };
    /**
     * Returns list of owners of items in the collection along with the number of owned items
     *
     * @summary Get distribution of the number of owned items by owner
     * @throws FetchError<400, types.GetOwnersResponse400> Bad Request
     * @throws FetchError<404, types.GetOwnersResponse404> Not found
     * @throws FetchError<500, types.GetOwnersResponse500> Internal Server Error
     */
    SDK.prototype.getOwners = function (metadata) {
        return this.core.fetch('/v2.0/data/collections/{id}/owners', 'get', metadata);
    };
    /**
     * Returns list of bid prices with number of bids and bidders
     *
     * @summary Get distribution of the number of bids by price
     * @throws FetchError<400, types.GetBidsByPriceResponse400> Bad Request
     * @throws FetchError<404, types.GetBidsByPriceResponse404> Not found
     * @throws FetchError<500, types.GetBidsByPriceResponse500> Internal Server Error
     */
    SDK.prototype.getBidsByPrice = function (metadata) {
        return this.core.fetch('/v2.0/data/collections/{id}/bidsByPrice', 'get', metadata);
    };
    /**
     * Returns list of historical floor prices aggregated at even intervals in the specified
     * time period - last day, last month etc.  Each points represents the aggregated value of
     * the interval after it.  The last point represents the current floor price.
     *
     * @summary Get historical data of floor price for collection for charting purposes
     * @throws FetchError<400, types.GetFloorPriceChartResponse400> Bad Request
     * @throws FetchError<404, types.GetFloorPriceChartResponse404> Not found
     * @throws FetchError<500, types.GetFloorPriceChartResponse500> Internal Server Error
     */
    SDK.prototype.getFloorPriceChart = function (metadata) {
        return this.core.fetch('/v2.0/data/collections/{id}/charts/floorPrice', 'get', metadata);
    };
    /**
     * Given a time period and the desired number of points, returns points which represent
     * total worth of collection sales in the interval after that point.  The last point always
     * has no value.
     *
     * @summary Get historical data of collection volume (total sales worth) for charting purposes
     * @throws FetchError<400, types.GetVolumeChartResponse400> Bad Request
     * @throws FetchError<404, types.GetVolumeChartResponse404> Not found
     * @throws FetchError<500, types.GetVolumeChartResponse500> Internal Server Error
     */
    SDK.prototype.getVolumeChart = function (metadata) {
        return this.core.fetch('/v2.0/data/collections/{id}/charts/volume', 'get', metadata);
    };
    /**
     * Get historical statistics about Collection transactions
     *
     * @summary Get NFT Collection tx stats
     * @throws FetchError<400, types.GetTransactionsResponse400> Bad Request
     * @throws FetchError<404, types.GetTransactionsResponse404> Not found
     * @throws FetchError<500, types.GetTransactionsResponse500> Internal Server Error
     */
    SDK.prototype.getTransactions = function (metadata) {
        return this.core.fetch('/v0.1/data/collections/{collection}/transactions', 'get', metadata);
    };
    /**
     * Get general statistics about Collection
     *
     * @summary Get NFT Collection stats
     * @throws FetchError<400, types.GetCollectionStatsResponse400> Bad Request
     * @throws FetchError<404, types.GetCollectionStatsResponse404> Not found
     * @throws FetchError<500, types.GetCollectionStatsResponse500> Internal Server Error
     */
    SDK.prototype.getCollectionStats = function (metadata) {
        return this.core.fetch('/v0.1/data/collections/{collection}/stats', 'get', metadata);
    };
    /**
     * Get statistics about a collection
     *
     * @summary Get NFT Collection statistics
     * @throws FetchError<400, types.GetCollectionStatisticsResponse400> Bad Request
     * @throws FetchError<404, types.GetCollectionStatisticsResponse404> Not found
     * @throws FetchError<500, types.GetCollectionStatisticsResponse500> Internal Server Error
     */
    SDK.prototype.getCollectionStatistics = function (metadata) {
        return this.core.fetch('/v0.1/data/collections/{collection}/statistics', 'get', metadata);
    };
    /**
     * Get historical statistics about Collection sellers
     *
     * @summary Get NFT Collection seller stats
     * @throws FetchError<400, types.GetSellersResponse400> Bad Request
     * @throws FetchError<404, types.GetSellersResponse404> Not found
     * @throws FetchError<500, types.GetSellersResponse500> Internal Server Error
     */
    SDK.prototype.getSellers = function (metadata) {
        return this.core.fetch('/v0.1/data/collections/{collection}/sellers', 'get', metadata);
    };
    /**
     * Get historical statistics about Collection gross merchandise value
     *
     * @summary Get NFT Collections GVM
     * @throws FetchError<400, types.GetGmvResponse400> Bad Request
     * @throws FetchError<404, types.GetGmvResponse404> Not found
     * @throws FetchError<500, types.GetGmvResponse500> Internal Server Error
     */
    SDK.prototype.getGmv = function (metadata) {
        return this.core.fetch('/v0.1/data/collections/{collection}/gmv', 'get', metadata);
    };
    /**
     * Get historical statistics about Collection's NFT floor price
     *
     * @summary Get NFT Collection floor price
     * @throws FetchError<400, types.GetFloorPriceResponse400> Bad Request
     * @throws FetchError<404, types.GetFloorPriceResponse404> Not found
     * @throws FetchError<500, types.GetFloorPriceResponse500> Internal Server Error
     */
    SDK.prototype.getFloorPrice = function (metadata) {
        return this.core.fetch('/v0.1/data/collections/{collection}/floorPrice', 'get', metadata);
    };
    /**
     * Get historical statistics about Collection buyers
     *
     * @summary Get NFT Collection buyer stats
     * @throws FetchError<400, types.GetBuyersResponse400> Bad Request
     * @throws FetchError<404, types.GetBuyersResponse404> Not found
     * @throws FetchError<500, types.GetBuyersResponse500> Internal Server Error
     */
    SDK.prototype.getBuyers = function (metadata) {
        return this.core.fetch('/v0.1/data/collections/{collection}/buyers', 'get', metadata);
    };
    /**
     * Get historical statistics of collection listed count
     *
     * @summary Get NFT Collection listing stats
     * @throws FetchError<400, types.GetListedResponse400> Bad Request
     * @throws FetchError<404, types.GetListedResponse404> Not found
     * @throws FetchError<500, types.GetListedResponse500> Internal Server Error
     */
    SDK.prototype.getListed = function (metadata) {
        return this.core.fetch('/v0.1/data/collections/{collection}/listed', 'get', metadata);
    };
    /**
     * Resolves domain's blockchain address by its name (for example, from ENS domains
     * collection)
     *
     * @summary Resolve domain
     * @throws FetchError<400, types.ResolveResponse400> Bad Request
     * @throws FetchError<404, types.ResolveResponse404> Not Found
     * @throws FetchError<500, types.ResolveResponse500> Internal Server Error
     */
    SDK.prototype.resolve = function (metadata) {
        return this.core.fetch('/v0.1/domains/{domain}/resolution', 'post', metadata);
    };
    /**
     * Checks if Order's signature is valid and returns 'true' if it so, 'false' otherwise
     *
     * @summary Check Order's signature
     * @throws FetchError<400, types.ValidateResponse400> Bad Request
     * @throws FetchError<500, types.ValidateResponse500> Internal Server Error
     */
    SDK.prototype.validate = function (body) {
        return this.core.fetch('/v0.1/signature/validate', 'post', body);
    };
    /**
     * Generate input string to sign operation
     *
     * @summary Generate signed input
     * @throws FetchError<400, types.GetInputResponse400> Bad Request
     * @throws FetchError<500, types.GetInputResponse500> Internal Server Error
     */
    SDK.prototype.getInput = function (body) {
        return this.core.fetch('/v0.1/signature/input', 'post', body);
    };
    /**
     * Generate order encode data for sign operations
     *
     * @summary Generate order encode data for sign operations
     * @throws FetchError<400, types.EncodeResponse400> Bad Request
     * @throws FetchError<500, types.EncodeResponse500> Internal Server Error
     */
    SDK.prototype.encode = function (body) {
        return this.core.fetch('/v0.1/encode/order', 'post', body);
    };
    /**
     * Get currency USD rate by currency blockchain's address
     *
     * @summary Get USD rate
     * @throws FetchError<400, types.GetUsdRateResponse400> Bad Request
     * @throws FetchError<500, types.GetUsdRateResponse500> Internal Server Error
     */
    SDK.prototype.getUsdRate = function (metadata) {
        return this.core.fetch('/v0.1/currencies/{currencyId}/rates/usd', 'get', metadata);
    };
    /**
     * List of currencies, supported by Protocol
     *
     * @summary Get supported currencies
     * @throws FetchError<400, types.GetAllCurrenciesResponse400> Bad Request
     * @throws FetchError<500, types.GetAllCurrenciesResponse500> Internal Server Error
     */
    SDK.prototype.getAllCurrencies = function () {
        return this.core.fetch('/v0.1/currencies/all', 'get');
    };
    /**
     * Return user's balance of specified currency
     *
     * @summary Get balance
     * @throws FetchError<400, types.GetBalanceResponse400> Bad Request
     * @throws FetchError<404, types.GetBalanceResponse404> Not Found
     * @throws FetchError<500, types.GetBalanceResponse500> Internal Server Error
     */
    SDK.prototype.getBalance = function (metadata) {
        return this.core.fetch('/v0.1/balances/{currencyId}/{owner}', 'get', metadata);
    };
    /**
     * Return short view of items updated after a specific datetime.
     *
     * @summary Get IDs of items updated after a specific datetime.
     * @throws FetchError<400, types.GetReconciliationItemsResponse400> Bad Request
     * @throws FetchError<500, types.GetReconciliationItemsResponse500> Internal Server Error
     */
    SDK.prototype.getReconciliationItems = function (metadata) {
        return this.core.fetch('/v0.1/reconciliation/items', 'get', metadata);
    };
    /**
     * Get latest indexed block for blockchain
     *
     * @summary Get latest indexed block
     * @throws FetchError<400, types.GetLatestIndexedBlockResponse400> Bad Request
     * @throws FetchError<404, types.GetLatestIndexedBlockResponse404> Not Found
     * @throws FetchError<500, types.GetLatestIndexedBlockResponse500> Internal Server Error
     */
    SDK.prototype.getLatestIndexedBlock = function (metadata) {
        return this.core.fetch('/v0.1/blocks/latestIndexed', 'get', metadata);
    };
    return SDK;
}());
var createSDK = (function () { return new SDK(); })();
module.exports = createSDK;
