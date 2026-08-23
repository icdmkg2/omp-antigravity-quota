/** Operational classification of a built-in blob destination. */
export type BlobDestinationStatus = "available" | "requires-account" | "incompatible" | "defunct";
/** Supported value shapes for destination configuration fields. */
export type BlobDestinationFieldType = "string" | "boolean" | "number" | "select";
/** A non-secret configuration field accepted by a destination. */
export interface BlobDestinationOptionDescriptor {
    /** Stable key stored below `images.urls.options`. */
    readonly key: string;
    /** Human-readable field label. */
    readonly label: string;
    /** Shape of the stored value. */
    readonly type: BlobDestinationFieldType;
    /** Whether configuration must provide the field. */
    readonly required?: boolean;
    /** Suggested value when the field is omitted. */
    readonly default?: string | number | boolean;
    /** Allowed values for a select field. */
    readonly choices?: readonly string[];
}
/** A secret or account identifier accepted by a destination. */
export interface BlobDestinationCredentialDescriptor {
    /** Stable key stored below `images.urls.credentials`. */
    readonly key: string;
    /** Human-readable field label. */
    readonly label: string;
    /** Whether the destination cannot operate without the credential. */
    readonly required?: boolean;
    /** Whether the value must be hidden in user interfaces and logs. */
    readonly secret: boolean;
}
/** Static capability and configuration metadata for a built-in destination. */
export interface BlobDestinationMetadata<Id extends string = string> {
    /** Stable registry identifier. */
    readonly id: Id;
    /** Human-readable destination name. */
    readonly label: string;
    /** Broad implementation family used for diagnostics and dispatch. */
    readonly family: string;
    /** Current operational classification. */
    readonly status: BlobDestinationStatus;
    /** Whether a publication URL serves image bytes rather than a viewer page. */
    readonly directImage: boolean;
    /** Explanation for an unavailable or constrained destination. */
    readonly reason?: string;
    /** Non-secret destination settings. */
    readonly options: readonly BlobDestinationOptionDescriptor[];
    /** Account identifiers and secrets required by the destination. */
    readonly credentials: readonly BlobDestinationCredentialDescriptor[];
}
/** Complete static registry of built-in blob publication destinations. */
export declare const BUILTIN_BLOB_DESTINATIONS: {
    readonly imgur: {
        readonly id: "imgur";
        readonly label: "Imgur";
        readonly family: "image-host";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly reason: "Uploads require either an Imgur access token or client ID.";
        readonly options: readonly [{
            readonly key: "album";
            readonly label: "Album";
            readonly type: "string";
        }];
        readonly credentials: readonly [{
            readonly key: "clientId";
            readonly label: "Client ID";
            readonly secret: true;
        }, {
            readonly key: "accessToken";
            readonly label: "Access token";
            readonly secret: true;
        }];
    };
    readonly imageshack: {
        readonly id: "imageshack";
        readonly label: "ImageShack";
        readonly family: "image-host";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly reason: "The API requires a paid subscription.";
        readonly options: readonly [{
            readonly key: "public";
            readonly label: "Public image";
            readonly type: "boolean";
            readonly default: false;
        }];
        readonly credentials: readonly [{
            readonly key: "apiKey";
            readonly label: "API key";
            readonly required: true;
            readonly secret: true;
        }, {
            readonly key: "authToken";
            readonly label: "Authentication token";
            readonly required: true;
            readonly secret: true;
        }];
    };
    readonly flickr: {
        readonly id: "flickr";
        readonly label: "Flickr";
        readonly family: "image-host";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "title";
            readonly label: "Title";
            readonly type: "string";
        }, {
            readonly key: "description";
            readonly label: "Description";
            readonly type: "string";
        }, {
            readonly key: "tags";
            readonly label: "Tags";
            readonly type: "string";
        }, {
            readonly key: "isPublic";
            readonly label: "Public visibility";
            readonly type: "string";
        }, {
            readonly key: "isFriend";
            readonly label: "Friend visibility";
            readonly type: "string";
        }, {
            readonly key: "isFamily";
            readonly label: "Family visibility";
            readonly type: "string";
        }, {
            readonly key: "safetyLevel";
            readonly label: "Safety level";
            readonly type: "string";
        }, {
            readonly key: "contentType";
            readonly label: "Content type";
            readonly type: "string";
        }, {
            readonly key: "hidden";
            readonly label: "Hidden from searches";
            readonly type: "string";
        }];
        readonly credentials: readonly [{
            readonly key: "apiKey";
            readonly label: "API key";
            readonly required: true;
            readonly secret: false;
        }, {
            readonly key: "apiSecret";
            readonly label: "API secret";
            readonly required: true;
            readonly secret: true;
        }, {
            readonly key: "oauthToken";
            readonly label: "OAuth token";
            readonly required: true;
            readonly secret: true;
        }, {
            readonly key: "oauthTokenSecret";
            readonly label: "OAuth token secret";
            readonly required: true;
            readonly secret: true;
        }];
    };
    readonly photobucket: {
        readonly id: "photobucket";
        readonly label: "Photobucket";
        readonly family: "image-host";
        readonly status: "defunct";
        readonly directImage: false;
        readonly reason: "The legacy upload API is decommissioned and third-party embedding is paywalled.";
        readonly options: readonly [];
        readonly credentials: readonly [];
    };
    readonly chevereto: {
        readonly id: "chevereto";
        readonly label: "Chevereto";
        readonly family: "self-hosted";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "endpoint";
            readonly label: "API endpoint";
            readonly type: "string";
            readonly required: true;
        }];
        readonly credentials: readonly [{
            readonly key: "apiKey";
            readonly label: "API key";
            readonly required: true;
            readonly secret: true;
        }];
    };
    readonly vgyme: {
        readonly id: "vgyme";
        readonly label: "vgy.me";
        readonly family: "image-host";
        readonly status: "available";
        readonly directImage: true;
        readonly options: readonly [];
        readonly credentials: readonly [{
            readonly key: "userKey";
            readonly label: "User key";
            readonly secret: true;
        }];
    };
    readonly "custom-image-uploader": {
        readonly id: "custom-image-uploader";
        readonly label: "ShareX custom image uploader";
        readonly family: "sharex-custom";
        readonly status: "incompatible";
        readonly directImage: false;
        readonly reason: "Arbitrary .sxcu definitions are intentionally unsupported by the built-in registry.";
        readonly options: readonly [];
        readonly credentials: readonly [];
    };
    readonly "file-uploader": {
        readonly id: "file-uploader";
        readonly label: "ShareX delegated file uploader";
        readonly family: "sharex-routing";
        readonly status: "incompatible";
        readonly directImage: false;
        readonly reason: "This ShareX routing sentinel is not a publication service.";
        readonly options: readonly [];
        readonly credentials: readonly [];
    };
    readonly dropbox: {
        readonly id: "dropbox";
        readonly label: "Dropbox";
        readonly family: "cloud-files";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "uploadPath";
            readonly label: "Upload path";
            readonly type: "string";
            readonly default: "ShareX/%y/%mo";
        }, {
            readonly key: "createShareableLink";
            readonly label: "Create shareable link";
            readonly type: "boolean";
            readonly default: true;
        }, {
            readonly key: "directLink";
            readonly label: "Use direct link";
            readonly type: "boolean";
            readonly default: true;
        }];
        readonly credentials: readonly [{
            readonly key: "oauthToken";
            readonly label: "OAuth token";
            readonly required: true;
            readonly secret: true;
        }];
    };
    readonly ftp: {
        readonly id: "ftp";
        readonly label: "FTP / FTPS / SFTP";
        readonly family: "file-transfer";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "protocol";
            readonly label: "Protocol";
            readonly type: "select";
            readonly default: "sftp";
            readonly choices: readonly ["ftp", "ftps", "sftp"];
        }, {
            readonly key: "host";
            readonly label: "Host";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "port";
            readonly label: "Port";
            readonly type: "number";
            readonly default: 22;
        }, {
            readonly key: "path";
            readonly label: "Remote path";
            readonly type: "string";
        }, {
            readonly key: "publicBaseUrl";
            readonly label: "Public base URL";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "commandBinary";
            readonly label: "FTP command binary";
            readonly type: "string";
        }];
        readonly credentials: readonly [{
            readonly key: "username";
            readonly label: "Username";
            readonly required: true;
            readonly secret: false;
        }, {
            readonly key: "password";
            readonly label: "Password";
            readonly secret: true;
        }, {
            readonly key: "privateKey";
            readonly label: "Private key path";
            readonly secret: true;
        }];
    };
    readonly onedrive: {
        readonly id: "onedrive";
        readonly label: "OneDrive";
        readonly family: "cloud-files";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "folderId";
            readonly label: "Folder ID";
            readonly type: "string";
        }, {
            readonly key: "directLink";
            readonly label: "Use embed link";
            readonly type: "boolean";
            readonly default: true;
        }];
        readonly credentials: readonly [{
            readonly key: "oauthToken";
            readonly label: "OAuth token";
            readonly required: true;
            readonly secret: true;
        }];
    };
    readonly "google-drive": {
        readonly id: "google-drive";
        readonly label: "Google Drive";
        readonly family: "cloud-files";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "folderId";
            readonly label: "Folder ID";
            readonly type: "string";
        }, {
            readonly key: "public";
            readonly label: "Make public";
            readonly type: "boolean";
            readonly default: true;
        }];
        readonly credentials: readonly [{
            readonly key: "oauthToken";
            readonly label: "OAuth token";
            readonly required: true;
            readonly secret: true;
        }];
    };
    readonly puush: {
        readonly id: "puush";
        readonly label: "puush-compatible endpoint";
        readonly family: "legacy-host";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly reason: "The public service is defunct; a replacement endpoint is required.";
        readonly options: readonly [{
            readonly key: "endpoint";
            readonly label: "Replacement endpoint";
            readonly type: "string";
            readonly required: true;
        }];
        readonly credentials: readonly [{
            readonly key: "apiKey";
            readonly label: "API key";
            readonly required: true;
            readonly secret: true;
        }];
    };
    readonly box: {
        readonly id: "box";
        readonly label: "Box";
        readonly family: "cloud-files";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "folderId";
            readonly label: "Folder ID";
            readonly type: "string";
            readonly default: "0";
        }, {
            readonly key: "directLink";
            readonly label: "Use direct link";
            readonly type: "boolean";
            readonly default: true;
        }, {
            readonly key: "shareAccess";
            readonly label: "Share access";
            readonly type: "select";
            readonly default: "open";
            readonly choices: readonly ["open", "company", "collaborators"];
        }];
        readonly credentials: readonly [{
            readonly key: "oauthToken";
            readonly label: "OAuth token";
            readonly required: true;
            readonly secret: true;
        }];
    };
    readonly "amazon-s3": {
        readonly id: "amazon-s3";
        readonly label: "Amazon S3";
        readonly family: "s3";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "endpoint";
            readonly label: "Endpoint";
            readonly type: "string";
        }, {
            readonly key: "region";
            readonly label: "Region";
            readonly type: "string";
            readonly default: "us-east-1";
        }, {
            readonly key: "bucket";
            readonly label: "Bucket";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "keyPrefix";
            readonly label: "Object key prefix";
            readonly type: "string";
        }, {
            readonly key: "prefix";
            readonly label: "Object prefix";
            readonly type: "string";
        }, {
            readonly key: "path";
            readonly label: "Object path";
            readonly type: "string";
        }, {
            readonly key: "publicBaseUrl";
            readonly label: "Public base URL";
            readonly type: "string";
        }, {
            readonly key: "pathStyle";
            readonly label: "Path-style requests";
            readonly type: "boolean";
            readonly default: false;
        }, {
            readonly key: "cacheControl";
            readonly label: "Cache-Control";
            readonly type: "string";
        }];
        readonly credentials: readonly [{
            readonly key: "accessKeyId";
            readonly label: "Access key ID";
            readonly required: true;
            readonly secret: false;
        }, {
            readonly key: "secretAccessKey";
            readonly label: "Secret access key";
            readonly required: true;
            readonly secret: true;
        }, {
            readonly key: "sessionToken";
            readonly label: "Session token";
            readonly secret: true;
        }];
    };
    readonly "google-cloud-storage": {
        readonly id: "google-cloud-storage";
        readonly label: "Google Cloud Storage";
        readonly family: "object-storage";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "bucket";
            readonly label: "Bucket";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "keyPrefix";
            readonly label: "Object key prefix";
            readonly type: "string";
        }, {
            readonly key: "prefix";
            readonly label: "Object prefix";
            readonly type: "string";
        }, {
            readonly key: "path";
            readonly label: "Object path";
            readonly type: "string";
        }, {
            readonly key: "publicBaseUrl";
            readonly label: "Public base URL";
            readonly type: "string";
        }, {
            readonly key: "cacheControl";
            readonly label: "Cache-Control";
            readonly type: "string";
        }];
        readonly credentials: readonly [{
            readonly key: "oauthToken";
            readonly label: "OAuth token";
            readonly required: true;
            readonly secret: true;
        }];
    };
    readonly "azure-storage": {
        readonly id: "azure-storage";
        readonly label: "Azure Blob Storage";
        readonly family: "object-storage";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "endpoint";
            readonly label: "Endpoint";
            readonly type: "string";
        }, {
            readonly key: "container";
            readonly label: "Container";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "keyPrefix";
            readonly label: "Object key prefix";
            readonly type: "string";
        }, {
            readonly key: "prefix";
            readonly label: "Object prefix";
            readonly type: "string";
        }, {
            readonly key: "path";
            readonly label: "Upload path";
            readonly type: "string";
        }, {
            readonly key: "publicBaseUrl";
            readonly label: "Public base URL";
            readonly type: "string";
        }, {
            readonly key: "cacheControl";
            readonly label: "Cache-Control";
            readonly type: "string";
        }];
        readonly credentials: readonly [{
            readonly key: "accountName";
            readonly label: "Account name";
            readonly required: true;
            readonly secret: false;
        }, {
            readonly key: "accountKey";
            readonly label: "Account key";
            readonly required: true;
            readonly secret: true;
        }];
    };
    readonly "backblaze-b2": {
        readonly id: "backblaze-b2";
        readonly label: "Backblaze B2";
        readonly family: "object-storage";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly reason: "Configure either native B2 application keys or S3-compatible access keys.";
        readonly options: readonly [{
            readonly key: "endpoint";
            readonly label: "S3 endpoint";
            readonly type: "string";
        }, {
            readonly key: "region";
            readonly label: "S3 region";
            readonly type: "string";
            readonly default: "us-west-004";
        }, {
            readonly key: "bucket";
            readonly label: "Bucket";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "keyPrefix";
            readonly label: "Object key prefix";
            readonly type: "string";
        }, {
            readonly key: "prefix";
            readonly label: "Object prefix";
            readonly type: "string";
        }, {
            readonly key: "path";
            readonly label: "Upload path";
            readonly type: "string";
        }, {
            readonly key: "pathStyle";
            readonly label: "Path-style requests";
            readonly type: "boolean";
            readonly default: false;
        }, {
            readonly key: "publicBaseUrl";
            readonly label: "Public base URL";
            readonly type: "string";
        }, {
            readonly key: "cacheControl";
            readonly label: "Cache-Control";
            readonly type: "string";
        }, {
            readonly key: "authorizeEndpoint";
            readonly label: "Authorization endpoint";
            readonly type: "string";
            readonly default: "https://api.backblazeb2.com/b2api/v2/b2_authorize_account";
        }];
        readonly credentials: readonly [{
            readonly key: "applicationKeyId";
            readonly label: "Application key ID";
            readonly secret: false;
        }, {
            readonly key: "applicationKey";
            readonly label: "Application key";
            readonly secret: true;
        }, {
            readonly key: "accessKeyId";
            readonly label: "S3 access key ID";
            readonly secret: false;
        }, {
            readonly key: "secretAccessKey";
            readonly label: "S3 secret access key";
            readonly secret: true;
        }, {
            readonly key: "sessionToken";
            readonly label: "S3 session token";
            readonly secret: true;
        }];
    };
    readonly owncloud: {
        readonly id: "owncloud";
        readonly label: "ownCloud / Nextcloud";
        readonly family: "webdav";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "host";
            readonly label: "Host";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "path";
            readonly label: "Remote path";
            readonly type: "string";
        }, {
            readonly key: "directLink";
            readonly label: "Use direct link";
            readonly type: "boolean";
            readonly default: true;
        }, {
            readonly key: "previewLink";
            readonly label: "Use preview link";
            readonly type: "boolean";
            readonly default: false;
        }, {
            readonly key: "expiryDays";
            readonly label: "Expiry days";
            readonly type: "number";
        }];
        readonly credentials: readonly [{
            readonly key: "username";
            readonly label: "Username";
            readonly required: true;
            readonly secret: false;
        }, {
            readonly key: "password";
            readonly label: "Password";
            readonly required: true;
            readonly secret: true;
        }];
    };
    readonly mediafire: {
        readonly id: "mediafire";
        readonly label: "MediaFire-compatible endpoint";
        readonly family: "legacy-host";
        readonly status: "available";
        readonly directImage: true;
        readonly reason: "The public API is deprecated; a replacement endpoint is required.";
        readonly options: readonly [{
            readonly key: "endpoint";
            readonly label: "Replacement endpoint";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "path";
            readonly label: "Upload path";
            readonly type: "string";
        }];
        readonly credentials: readonly [{
            readonly key: "username";
            readonly label: "Username";
            readonly secret: false;
        }, {
            readonly key: "password";
            readonly label: "Password";
            readonly secret: true;
        }, {
            readonly key: "apiKey";
            readonly label: "API key";
            readonly secret: true;
        }];
    };
    readonly pushbullet: {
        readonly id: "pushbullet";
        readonly label: "Pushbullet";
        readonly family: "messaging";
        readonly status: "requires-account";
        readonly directImage: false;
        readonly options: readonly [{
            readonly key: "deviceId";
            readonly label: "Device ID";
            readonly type: "string";
        }];
        readonly credentials: readonly [{
            readonly key: "apiKey";
            readonly label: "API key";
            readonly required: true;
            readonly secret: true;
        }];
    };
    readonly sendspace: {
        readonly id: "sendspace";
        readonly label: "SendSpace-compatible endpoint";
        readonly family: "legacy-host";
        readonly status: "available";
        readonly directImage: true;
        readonly reason: "The public discovery API is deprecated; a replacement endpoint is required.";
        readonly options: readonly [{
            readonly key: "endpoint";
            readonly label: "Replacement discovery endpoint";
            readonly type: "string";
            readonly required: true;
        }];
        readonly credentials: readonly [{
            readonly key: "apiKey";
            readonly label: "API key";
            readonly secret: true;
        }];
    };
    readonly localhostr: {
        readonly id: "localhostr";
        readonly label: "Hostr-compatible endpoint";
        readonly family: "legacy-host";
        readonly status: "available";
        readonly directImage: true;
        readonly reason: "The public service is offline; a replacement endpoint is required.";
        readonly options: readonly [{
            readonly key: "endpoint";
            readonly label: "Replacement endpoint";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "publicBaseUrl";
            readonly label: "Public base URL";
            readonly type: "string";
        }];
        readonly credentials: readonly [{
            readonly key: "email";
            readonly label: "Email";
            readonly secret: false;
        }, {
            readonly key: "password";
            readonly label: "Password";
            readonly secret: true;
        }];
    };
    readonly lambda: {
        readonly id: "lambda";
        readonly label: "Lambda-compatible endpoint";
        readonly family: "legacy-host";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly reason: "The public service is offline; a replacement endpoint is required.";
        readonly options: readonly [{
            readonly key: "endpoint";
            readonly label: "Replacement endpoint";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "resultBaseUrl";
            readonly label: "Result base URL";
            readonly type: "string";
        }];
        readonly credentials: readonly [{
            readonly key: "apiKey";
            readonly label: "API key";
            readonly required: true;
            readonly secret: true;
        }];
    };
    readonly pomf: {
        readonly id: "pomf";
        readonly label: "Pomf";
        readonly family: "pomf";
        readonly status: "available";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "uploadUrl";
            readonly label: "Upload URL";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "resultBaseUrl";
            readonly label: "Result base URL";
            readonly type: "string";
        }, {
            readonly key: "fileField";
            readonly label: "Multipart file field";
            readonly type: "string";
            readonly default: "files[]";
        }, {
            readonly key: "urlPath";
            readonly label: "JSON URL path";
            readonly type: "string";
            readonly default: "files.0.url";
        }];
        readonly credentials: readonly [];
    };
    readonly uguu: {
        readonly id: "uguu";
        readonly label: "Uguu";
        readonly family: "anonymous-host";
        readonly status: "available";
        readonly directImage: true;
        readonly reason: "Public uploads expire after approximately three hours.";
        readonly options: readonly [];
        readonly credentials: readonly [];
    };
    readonly seafile: {
        readonly id: "seafile";
        readonly label: "Seafile";
        readonly family: "cloud-files";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "apiUrl";
            readonly label: "API URL";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "repositoryId";
            readonly label: "Repository ID";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "path";
            readonly label: "Remote path";
            readonly type: "string";
        }, {
            readonly key: "raw";
            readonly label: "Use raw link";
            readonly type: "boolean";
            readonly default: true;
        }, {
            readonly key: "expiryDays";
            readonly label: "Expiry days";
            readonly type: "number";
        }];
        readonly credentials: readonly [{
            readonly key: "authToken";
            readonly label: "Authentication token";
            readonly required: true;
            readonly secret: true;
        }, {
            readonly key: "sharePassword";
            readonly label: "Share password";
            readonly secret: true;
        }];
    };
    readonly streamable: {
        readonly id: "streamable";
        readonly label: "Streamable";
        readonly family: "video-host";
        readonly status: "incompatible";
        readonly directImage: false;
        readonly reason: "Streamable accepts video, not image blobs.";
        readonly options: readonly [];
        readonly credentials: readonly [];
    };
    readonly "s-ul": {
        readonly id: "s-ul";
        readonly label: "s-ul";
        readonly family: "file-host";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [];
        readonly credentials: readonly [{
            readonly key: "apiKey";
            readonly label: "API key";
            readonly required: true;
            readonly secret: true;
        }];
    };
    readonly lobfile: {
        readonly id: "lobfile";
        readonly label: "LobFile-compatible endpoint";
        readonly family: "legacy-host";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly reason: "The public service is offline; a replacement endpoint is required.";
        readonly options: readonly [{
            readonly key: "endpoint";
            readonly label: "Replacement endpoint";
            readonly type: "string";
            readonly required: true;
        }];
        readonly credentials: readonly [{
            readonly key: "apiKey";
            readonly label: "API key";
            readonly required: true;
            readonly secret: true;
        }];
    };
    readonly "transfer-sh": {
        readonly id: "transfer-sh";
        readonly label: "transfer.sh-compatible endpoint";
        readonly family: "anonymous-host";
        readonly status: "available";
        readonly directImage: true;
        readonly reason: "The defunct public endpoint is blocked; a self-hosted replacement is required.";
        readonly options: readonly [{
            readonly key: "endpoint";
            readonly label: "Replacement endpoint";
            readonly type: "string";
            readonly required: true;
        }];
        readonly credentials: readonly [];
    };
    readonly plik: {
        readonly id: "plik";
        readonly label: "Plik";
        readonly family: "self-hosted";
        readonly status: "available";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "endpoint";
            readonly label: "Endpoint";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "ttlSeconds";
            readonly label: "TTL seconds";
            readonly type: "number";
        }, {
            readonly key: "removable";
            readonly label: "Allow deletion";
            readonly type: "boolean";
            readonly default: true;
        }];
        readonly credentials: readonly [{
            readonly key: "apiKey";
            readonly label: "API key";
            readonly secret: true;
        }];
    };
    readonly youtube: {
        readonly id: "youtube";
        readonly label: "YouTube";
        readonly family: "video-host";
        readonly status: "incompatible";
        readonly directImage: false;
        readonly reason: "YouTube accepts video, not image blobs.";
        readonly options: readonly [];
        readonly credentials: readonly [];
    };
    readonly vault: {
        readonly id: "vault";
        readonly label: "Vault.ooo";
        readonly family: "encrypted-host";
        readonly status: "defunct";
        readonly directImage: false;
        readonly reason: "The service is offline; its ciphertext viewer was also incompatible with direct images.";
        readonly options: readonly [];
        readonly credentials: readonly [];
    };
    readonly "shared-folder": {
        readonly id: "shared-folder";
        readonly label: "Shared folder";
        readonly family: "filesystem";
        readonly status: "available";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "root";
            readonly label: "Root directory";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "path";
            readonly label: "Subfolder path";
            readonly type: "string";
        }, {
            readonly key: "publicBaseUrl";
            readonly label: "Public base URL";
            readonly type: "string";
            readonly required: true;
        }];
        readonly credentials: readonly [];
    };
    readonly email: {
        readonly id: "email";
        readonly label: "Email";
        readonly family: "messaging";
        readonly status: "incompatible";
        readonly directImage: false;
        readonly reason: "SMTP attachments do not produce a public URL.";
        readonly options: readonly [];
        readonly credentials: readonly [];
    };
    readonly "custom-file-uploader": {
        readonly id: "custom-file-uploader";
        readonly label: "ShareX custom file uploader";
        readonly family: "sharex-custom";
        readonly status: "incompatible";
        readonly directImage: false;
        readonly reason: "Arbitrary .sxcu definitions are intentionally unsupported by the built-in registry.";
        readonly options: readonly [];
        readonly credentials: readonly [];
    };
    readonly catbox: {
        readonly id: "catbox";
        readonly label: "Catbox";
        readonly family: "anonymous-host";
        readonly status: "available";
        readonly directImage: true;
        readonly options: readonly [];
        readonly credentials: readonly [{
            readonly key: "userHash";
            readonly label: "User hash";
            readonly secret: true;
        }];
    };
    readonly litterbox: {
        readonly id: "litterbox";
        readonly label: "Litterbox";
        readonly family: "anonymous-host";
        readonly status: "available";
        readonly directImage: true;
        readonly reason: "Uploads are temporary.";
        readonly options: readonly [{
            readonly key: "ttl";
            readonly label: "Retention";
            readonly type: "select";
            readonly default: "24h";
            readonly choices: readonly ["1h", "12h", "24h", "72h"];
        }];
        readonly credentials: readonly [];
    };
    readonly "0x0": {
        readonly id: "0x0";
        readonly label: "0x0.st";
        readonly family: "anonymous-host";
        readonly status: "available";
        readonly directImage: true;
        readonly reason: "Public uploads expire after a retention window determined by file size.";
        readonly options: readonly [];
        readonly credentials: readonly [];
    };
    readonly tmpfiles: {
        readonly id: "tmpfiles";
        readonly label: "tmpfiles.org";
        readonly family: "anonymous-host";
        readonly status: "available";
        readonly directImage: true;
        readonly reason: "Public uploads are temporary.";
        readonly options: readonly [{
            readonly key: "ttl";
            readonly label: "Retention";
            readonly type: "string";
            readonly default: "1h";
        }];
        readonly credentials: readonly [];
    };
    readonly discord: {
        readonly id: "discord";
        readonly label: "Discord";
        readonly family: "messaging";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "content";
            readonly label: "Message content";
            readonly type: "string";
        }, {
            readonly key: "threadId";
            readonly label: "Thread ID";
            readonly type: "string";
        }];
        readonly credentials: readonly [{
            readonly key: "webhookUrl";
            readonly label: "Webhook URL";
            readonly required: true;
            readonly secret: true;
        }];
    };
    readonly "provider-files": {
        readonly id: "provider-files";
        readonly label: "Model provider files";
        readonly family: "provider-files";
        readonly status: "requires-account";
        readonly directImage: false;
        readonly reason: "Provider file references are API-local rather than public image URLs.";
        readonly options: readonly [{
            readonly key: "provider";
            readonly label: "Provider";
            readonly type: "select";
            readonly required: true;
            readonly choices: readonly ["openai", "anthropic", "google"];
        }];
        readonly credentials: readonly [];
    };
    readonly direct: {
        readonly id: "direct";
        readonly label: "Direct public URL";
        readonly family: "local-serving";
        readonly status: "available";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "publicBaseUrl";
            readonly label: "Public base URL";
            readonly type: "string";
            readonly required: true;
        }];
        readonly credentials: readonly [];
    };
    readonly cloudflared: {
        readonly id: "cloudflared";
        readonly label: "Cloudflare quick tunnel";
        readonly family: "tunnel";
        readonly status: "available";
        readonly directImage: true;
        readonly options: readonly [];
        readonly credentials: readonly [];
    };
    readonly ngrok: {
        readonly id: "ngrok";
        readonly label: "ngrok";
        readonly family: "tunnel";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [];
        readonly credentials: readonly [{
            readonly key: "authToken";
            readonly label: "Authentication token";
            readonly required: true;
            readonly secret: true;
        }];
    };
    readonly tailscale: {
        readonly id: "tailscale";
        readonly label: "Tailscale Funnel";
        readonly family: "tunnel";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [];
        readonly credentials: readonly [];
    };
    readonly ssh: {
        readonly id: "ssh";
        readonly label: "SSH reverse tunnel";
        readonly family: "tunnel";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "host";
            readonly label: "SSH host";
            readonly type: "string";
            readonly required: true;
        }];
        readonly credentials: readonly [{
            readonly key: "privateKey";
            readonly label: "SSH private key";
            readonly secret: true;
        }];
    };
    readonly command: {
        readonly id: "command";
        readonly label: "Uploader command";
        readonly family: "external-command";
        readonly status: "available";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "command";
            readonly label: "Command template";
            readonly type: "string";
            readonly required: true;
        }];
        readonly credentials: readonly [];
    };
    readonly "localhost-run": {
        readonly id: "localhost-run";
        readonly label: "localhost.run";
        readonly family: "tunnel";
        readonly status: "available";
        readonly directImage: true;
        readonly options: readonly [];
        readonly credentials: readonly [];
    };
    readonly pinggy: {
        readonly id: "pinggy";
        readonly label: "Pinggy";
        readonly family: "tunnel";
        readonly status: "available";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "publicBaseUrl";
            readonly label: "Stable public base URL";
            readonly type: "string";
        }];
        readonly credentials: readonly [{
            readonly key: "token";
            readonly label: "Pro token";
            readonly secret: true;
        }];
    };
    readonly devtunnel: {
        readonly id: "devtunnel";
        readonly label: "Microsoft dev tunnel";
        readonly family: "tunnel";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly reason: "The devtunnel CLI must be logged in locally.";
        readonly options: readonly [];
        readonly credentials: readonly [];
    };
    readonly zrok: {
        readonly id: "zrok";
        readonly label: "zrok";
        readonly family: "tunnel";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly reason: "The local zrok environment must be enabled.";
        readonly options: readonly [];
        readonly credentials: readonly [];
    };
    readonly bore: {
        readonly id: "bore";
        readonly label: "bore";
        readonly family: "tunnel";
        readonly status: "available";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "server";
            readonly label: "Bore server";
            readonly type: "string";
            readonly default: "bore.pub";
        }];
        readonly credentials: readonly [{
            readonly key: "secret";
            readonly label: "Authentication secret";
            readonly secret: true;
        }];
    };
    readonly "named-cloudflared": {
        readonly id: "named-cloudflared";
        readonly label: "Named Cloudflare Tunnel";
        readonly family: "tunnel";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "publicBaseUrl";
            readonly label: "Public base URL";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "configFile";
            readonly label: "Cloudflared config file";
            readonly type: "string";
        }, {
            readonly key: "tunnelName";
            readonly label: "Tunnel name or UUID";
            readonly type: "string";
        }];
        readonly credentials: readonly [{
            readonly key: "tunnelToken";
            readonly label: "Tunnel token";
            readonly secret: true;
        }];
    };
    readonly r2: {
        readonly id: "r2";
        readonly label: "Cloudflare R2";
        readonly family: "s3";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "endpoint";
            readonly label: "Endpoint";
            readonly type: "string";
        }, {
            readonly key: "accountId";
            readonly label: "Account ID";
            readonly type: "string";
        }, {
            readonly key: "region";
            readonly label: "Region";
            readonly type: "string";
            readonly default: "auto";
        }, {
            readonly key: "bucket";
            readonly label: "Bucket";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "keyPrefix";
            readonly label: "Object key prefix";
            readonly type: "string";
        }, {
            readonly key: "prefix";
            readonly label: "Object prefix";
            readonly type: "string";
        }, {
            readonly key: "path";
            readonly label: "Object path";
            readonly type: "string";
        }, {
            readonly key: "pathStyle";
            readonly label: "Path-style requests";
            readonly type: "boolean";
            readonly default: true;
        }, {
            readonly key: "publicBaseUrl";
            readonly label: "Public base URL";
            readonly type: "string";
        }, {
            readonly key: "cacheControl";
            readonly label: "Cache-Control";
            readonly type: "string";
        }];
        readonly credentials: readonly [{
            readonly key: "accessKeyId";
            readonly label: "Access key ID";
            readonly required: true;
            readonly secret: false;
        }, {
            readonly key: "secretAccessKey";
            readonly label: "Secret access key";
            readonly required: true;
            readonly secret: true;
        }, {
            readonly key: "sessionToken";
            readonly label: "Session token";
            readonly secret: true;
        }];
    };
    readonly tigris: {
        readonly id: "tigris";
        readonly label: "Tigris";
        readonly family: "s3";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "endpoint";
            readonly label: "Endpoint";
            readonly type: "string";
        }, {
            readonly key: "bucket";
            readonly label: "Bucket";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "region";
            readonly label: "Region";
            readonly type: "string";
            readonly default: "auto";
        }, {
            readonly key: "keyPrefix";
            readonly label: "Object key prefix";
            readonly type: "string";
        }, {
            readonly key: "prefix";
            readonly label: "Object prefix";
            readonly type: "string";
        }, {
            readonly key: "path";
            readonly label: "Object path";
            readonly type: "string";
        }, {
            readonly key: "pathStyle";
            readonly label: "Path-style requests";
            readonly type: "boolean";
            readonly default: false;
        }, {
            readonly key: "publicBaseUrl";
            readonly label: "Public base URL";
            readonly type: "string";
        }, {
            readonly key: "cacheControl";
            readonly label: "Cache-Control";
            readonly type: "string";
        }];
        readonly credentials: readonly [{
            readonly key: "accessKeyId";
            readonly label: "Access key ID";
            readonly required: true;
            readonly secret: false;
        }, {
            readonly key: "secretAccessKey";
            readonly label: "Secret access key";
            readonly required: true;
            readonly secret: true;
        }, {
            readonly key: "sessionToken";
            readonly label: "Session token";
            readonly secret: true;
        }];
    };
    readonly minio: {
        readonly id: "minio";
        readonly label: "MinIO";
        readonly family: "s3";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "endpoint";
            readonly label: "Endpoint";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "bucket";
            readonly label: "Bucket";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "region";
            readonly label: "Region";
            readonly type: "string";
            readonly default: "us-east-1";
        }, {
            readonly key: "keyPrefix";
            readonly label: "Object key prefix";
            readonly type: "string";
        }, {
            readonly key: "prefix";
            readonly label: "Object prefix";
            readonly type: "string";
        }, {
            readonly key: "path";
            readonly label: "Object path";
            readonly type: "string";
        }, {
            readonly key: "pathStyle";
            readonly label: "Path-style requests";
            readonly type: "boolean";
            readonly default: true;
        }, {
            readonly key: "publicBaseUrl";
            readonly label: "Public base URL";
            readonly type: "string";
        }, {
            readonly key: "cacheControl";
            readonly label: "Cache-Control";
            readonly type: "string";
        }];
        readonly credentials: readonly [{
            readonly key: "accessKeyId";
            readonly label: "Access key ID";
            readonly required: true;
            readonly secret: false;
        }, {
            readonly key: "secretAccessKey";
            readonly label: "Secret access key";
            readonly required: true;
            readonly secret: true;
        }, {
            readonly key: "sessionToken";
            readonly label: "Session token";
            readonly secret: true;
        }];
    };
    readonly garage: {
        readonly id: "garage";
        readonly label: "Garage";
        readonly family: "s3";
        readonly status: "requires-account";
        readonly directImage: true;
        readonly options: readonly [{
            readonly key: "endpoint";
            readonly label: "Endpoint";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "bucket";
            readonly label: "Bucket";
            readonly type: "string";
            readonly required: true;
        }, {
            readonly key: "region";
            readonly label: "Region";
            readonly type: "string";
            readonly default: "garage";
        }, {
            readonly key: "keyPrefix";
            readonly label: "Object key prefix";
            readonly type: "string";
        }, {
            readonly key: "prefix";
            readonly label: "Object prefix";
            readonly type: "string";
        }, {
            readonly key: "path";
            readonly label: "Object path";
            readonly type: "string";
        }, {
            readonly key: "pathStyle";
            readonly label: "Path-style requests";
            readonly type: "boolean";
            readonly default: true;
        }, {
            readonly key: "publicBaseUrl";
            readonly label: "Public base URL";
            readonly type: "string";
        }, {
            readonly key: "cacheControl";
            readonly label: "Cache-Control";
            readonly type: "string";
        }];
        readonly credentials: readonly [{
            readonly key: "accessKeyId";
            readonly label: "Access key ID";
            readonly required: true;
            readonly secret: false;
        }, {
            readonly key: "secretAccessKey";
            readonly label: "Secret access key";
            readonly required: true;
            readonly secret: true;
        }, {
            readonly key: "sessionToken";
            readonly label: "Session token";
            readonly secret: true;
        }];
    };
};
/** Identifier of any built-in blob destination, derived from registry keys. */
export type BlobDestinationId = keyof typeof BUILTIN_BLOB_DESTINATIONS;
/** Exhaustive mapping of ShareX `ImageDestination` members to registry entries. */
export declare const SHAREX_IMAGE_DESTINATIONS: {
    readonly Imgur: "imgur";
    readonly ImageShack: "imageshack";
    readonly Flickr: "flickr";
    readonly Photobucket: "photobucket";
    readonly Chevereto: "chevereto";
    readonly Vgyme: "vgyme";
    readonly CustomImageUploader: "custom-image-uploader";
    readonly FileUploader: "file-uploader";
};
/** Exhaustive mapping of ShareX `FileDestination` members to registry entries. */
export declare const SHAREX_FILE_DESTINATIONS: {
    readonly Dropbox: "dropbox";
    readonly FTP: "ftp";
    readonly OneDrive: "onedrive";
    readonly GoogleDrive: "google-drive";
    readonly Puush: "puush";
    readonly Box: "box";
    readonly AmazonS3: "amazon-s3";
    readonly GoogleCloudStorage: "google-cloud-storage";
    readonly AzureStorage: "azure-storage";
    readonly BackblazeB2: "backblaze-b2";
    readonly OwnCloud: "owncloud";
    readonly MediaFire: "mediafire";
    readonly Pushbullet: "pushbullet";
    readonly SendSpace: "sendspace";
    readonly Localhostr: "localhostr";
    readonly Lambda: "lambda";
    readonly Pomf: "pomf";
    readonly Uguu: "uguu";
    readonly Seafile: "seafile";
    readonly Streamable: "streamable";
    readonly Sul: "s-ul";
    readonly Lithiio: "lobfile";
    readonly Transfersh: "transfer-sh";
    readonly Plik: "plik";
    readonly YouTube: "youtube";
    readonly Vault_ooo: "vault";
    readonly SharedFolder: "shared-folder";
    readonly Email: "email";
    readonly CustomFileUploader: "custom-file-uploader";
};
