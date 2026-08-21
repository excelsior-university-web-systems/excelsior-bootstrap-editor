import { Notice, SandBox } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';

export const ALT_TEXT_LIMIT = 150;
export const CAPTION_LIMIT = 250;

/**
 * Keeps a container block populated with a minimum number of child blocks.
 *
 * Inserts the missing children whenever the count falls below `minimum`, then
 * toggles each child's `lock.remove` so the required children cannot be deleted
 * while the container is at (or below) the minimum. No-ops in preview mode.
 *
 * @param {Object} options - Hook options.
 * @param {string} options.clientId - Client ID of the container block.
 * @param {string} options.blockName - Block name of the child to enforce.
 * @param {number} [options.minimum=1] - Minimum number of child blocks.
 * @param {boolean} [options.isPreview=false] - Skip while rendering block previews.
 * @returns {Array} The container's child blocks matching `blockName`.
 */
export const useMinimumChildBlocks = ( { clientId, blockName, minimum = 1, isPreview = false } ) => {

    const childBlocks = useSelect(
        ( select ) => select( 'core/block-editor' ).getBlocks( clientId ) || [],
        [ clientId ]
    );
    const { insertBlocks, updateBlockAttributes } = useDispatch( 'core/block-editor' );

    const matchingBlocks = useMemo(
        () => childBlocks.filter( ( block ) => block.name === blockName ),
        [ childBlocks, blockName ]
    );

    useEffect( () => {
        if ( isPreview ) {
            return;
        }

        const missingCount = minimum - matchingBlocks.length;

        if ( missingCount > 0 ) {
            insertBlocks(
                Array.from( { length: missingCount }, () => createBlock( blockName ) ),
                childBlocks.length,
                clientId
            );
            return;
        }

        const lockRemove = matchingBlocks.length <= minimum;

        matchingBlocks.forEach( ( block ) => {
            const currentLock = block.attributes?.lock || {};

            if ( currentLock.remove === lockRemove ) {
                return;
            }

            updateBlockAttributes( block.clientId, {
                lock: {
                    ...currentLock,
                    remove: lockRemove,
                },
            } );
        } );
    }, [ blockName, childBlocks.length, clientId, insertBlocks,
        isPreview, matchingBlocks, minimum, updateBlockAttributes,
    ] );

    return matchingBlocks;

};

/**
 * Converts a 24-hour time string to 12-hour format.
 *
 * @param {string} time - Time string in HH:mm format.
 * @returns {string} Formatted time with AM/PM.
 */
export const convertTo12HourFormat = ( time ) => {

    const [hours24, minutes] = time.split(':');
    let hours = parseInt(hours24, 10);
    const period = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;

};

/**
 * Generates a unique, HTML-safe ID beginning with a letter.
 *
 * @returns {string} Generated HTML ID.
 */
export const generateHtmlId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const chars = letters + '0123456789';
    const timestamp = Date.now().toString(36);
    const randomLength = 6;
    let randomPart = '';
  
    // Generate random characters from valid set for the rest of the ID
    for (let i = 0; i < randomLength; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  
    // Ensure the first character is a letter
    const firstChar = letters.charAt(Math.floor(Math.random() * letters.length));
  
    return firstChar + timestamp + randomPart;
};

/**
 * Formats a string for use as an HTML ID.
 *
 * @param {string} input - String to format.
 * @returns {string} Sanitized HTML ID.
 */
export const formatAsHtmlId = (input) => {
    // Replace spaces with hyphens, remove underscores, and ensure no invalid characters
    let formattedId = input.trim()
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/[^a-zA-Z0-9-]/g, '') // Remove any non-alphanumeric characters except hyphens

    // Ensure it doesn't start with a number
    formattedId = formattedId.replace(/^[0-9]+/, '');

    return formattedId;
};

/**
 * Runs a callback once an element matching the selector is available.
 *
 * @param {string} selector - CSS selector to observe.
 * @param {Function} callback - Callback receiving the matched element.
 * @param {MutationObserverInit} [options] - Observer configuration.
 * @returns {void}
 */
export const observeElement = ( selector, callback, options = { childList: true, subtree: true } ) => {
    
    const element = document.querySelector( selector );

    if ( element ) {
        callback( element );
        return;
    }

    const observer = new MutationObserver( ( mutations, obs ) => {

        const element = document.querySelector( selector );

        if ( element ) {
            callback( element );
            obs.disconnect();
        }

    } );

    observer.observe( document.body, options );

}

/**
 * Removes script tags from an HTML string.
 *
 * @param {string} input - HTML string to sanitize.
 * @returns {string} HTML string without script tags.
 */
export const removeScriptTags = ( input ) => {
    
    const tempElement = document.createElement( 'div' );
    tempElement.innerHTML = input;

    const scripts = tempElement.querySelectorAll( 'script' );
    scripts.forEach( (script) => script.remove() );
    
    return tempElement.innerHTML;

};

/**
 * Finds all nested blocks matching a block type.
 *
 * @param {Array} blocks - Blocks to search.
 * @param {string} blockType - Block name to match.
 * @returns {Array} Matching blocks.
 */
export const getBlocksOfType = (blocks, blockType) => {
    return blocks.reduce((acc, block) => {
        if (block.name === blockType) {
            acc.push(block);
        }
        if (block.innerBlocks?.length) {
            acc = acc.concat(getBlocksOfType(block.innerBlocks, blockType));
        }
        return acc;
    }, []);
};

/**
 * Gets the character count for a value.
 *
 * @param {string} value - Value to count.
 * @returns {number} Character count.
 */
export const getCharacterCount = ( value ) => ( value || '' ).length;

/**
 * Gets a formatted character limit label.
 *
 * @param {string} value - Value to count.
 * @param {number} limit - Maximum character limit.
 * @returns {string} Count and limit label.
 */
export const getCharacterLimitLabel = ( value, limit ) => {
    return `${ getCharacterCount( value ) }/${ limit }`;
};

/**
 * Displays character count and limit warning feedback.
 *
 * @param {Object} props - Component props.
 * @param {string} props.value - Value to count.
 * @param {number} props.limit - Maximum character limit.
 * @param {string} props.message - Warning message.
 * @param {boolean} [props.showCount=true] - Whether to show the count.
 * @returns {JSX.Element} Character limit feedback.
 */
export const CharacterLimitFeedback = ( { value, limit, message, showCount = true } ) => {
    const characterCount = getCharacterCount( value );

    return (
        <>
        { showCount && (
            <div className="components-base-control__help">
                { characterCount }/{ limit }
            </div>
        )}
        { characterCount > limit && (
            <Notice status="warning" isDismissible={false} className="character-limit-notice">
                { message }
            </Notice>
        )}
        </>
    );
};

/**
 * Prevents Enter from inserting a line break or propagating the event.
 *
 * @param {KeyboardEvent} event - Keyboard event to handle.
 */
export const preventLineBreaks = ( event ) => {
    if ( event.key === 'Enter' ) {
        event.preventDefault();
        event.stopPropagation();
    }
};

/**
 * Checks whether a value is a valid HTTP or HTTPS URL.
 *
 * @param {string} value - URL value to validate.
 * @returns {boolean} Whether the URL is valid.
 */
export const isValidUrl = ( value ) => {
    if ( !value || typeof value !== 'string' ) {
        return false;
    }

    try {
        const url = new URL( value );
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

/**
 * Extracts an 11-character YouTube video ID from a raw ID or any common
 * YouTube URL form (watch, youtu.be, embed, shorts).
 *
 * @param {string} source - Raw video ID or YouTube URL.
 * @returns {string} The extracted video ID, or the trimmed input if none matched.
 */
const extractYouTubeId = ( source ) => {
    const value = ( source || '' ).trim();

    // Already a bare 11-char ID.
    if ( /^[a-zA-Z0-9_-]{11}$/.test( value ) ) {
        return value;
    }

    const match = value.match(
        /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    return match ? match[ 1 ] : value;
};

/**
 * Returns true when the value is a recognizable YouTube video reference
 * (a bare 11-character ID or a watch/youtu.be/embed/shorts URL).
 *
 * @param {string} value - Candidate ID or URL.
 * @returns {boolean} Whether it looks like a YouTube video.
 */
const isYouTubeUrl = ( value ) => {
    const v = ( value || '' ).trim();

    if ( /^[a-zA-Z0-9_-]{11}$/.test( v ) ) {
        return true;
    }

    return /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test( v );
};

/**
 * Network "bucket" used to translate mapped-drive / SMB paths into their public
 * URL. Only the academics media-services bucket is supported.
 * @type {!Array<{bucket:string, root:string, baseUrl:string}>}
 */
const S3_BUCKETS = [
    { bucket: 'academics', root: 'academics-media-services', baseUrl: 'https://academics.excelsior.edu/media-services/' },
];

/** Base URLs for the supported Excelsior players. */
const PLAYER_BASES = Object.freeze( {
    sbplus: 'https://academics.excelsior.edu/acadapp-sbplus/',
    gvp: 'https://academics.excelsior.edu/acadapp-gvp/',
    audio: 'https://academics.excelsior.edu/acadapp-audioplayer/',
} );

/** Base URL for published media-services assets. */
const MEDIA_SERVICES_BASE = 'https://academics.excelsior.edu/media-services/';

/**
 * True when the string looks like a Windows file path (drive letter or UNC).
 * @param {string} str
 * @returns {boolean}
 */
const isWindowsFilePath = ( str ) => /^(?:[a-zA-Z]:|\\)(?:\\[^\\/:*?"<>|\r\n]+)+$/.test( str );

/**
 * Looser Windows-path check as a safety net (drive letter or UNC).
 * @param {string} str
 * @returns {boolean}
 */
const looksLikeWindowsPath = ( str ) => /^[a-zA-Z]:\\/.test( str ) || /^\\\\[^\\]/.test( str );

/**
 * True when the string looks like a macOS SMB path (smb://server/share/...).
 * @param {string} str
 * @returns {boolean}
 */
const isMacOsFilePath = ( str ) => /^smb:\/\/[^/]+(\/[^/]+)+$/i.test( str );

/**
 * Strips surrounding straight/curly quotes, whitespace, and slashes.
 * @param {string} str
 * @returns {string}
 */
const sanitizeInput = ( str ) =>
    ( str || '' ).replace( /^[\s"'“”‘’/\\]+|[\s"'“”‘’/\\]+$/g, '' ).trim();

/**
 * Converts a Windows or macOS SMB path to its public URL using S3_BUCKETS.
 * Throws on empty/insufficient/unknown paths. Never called during render.
 * @param {string} path
 * @param {boolean} isMac
 * @returns {string}
 */
const convertToUrl = ( path, isMac ) => {
    if ( typeof path !== 'string' || ! path.trim() ) {
        throw new Error( 'Empty file path' );
    }

    const pathParts = isMac ? path.split( '/' ) : path.split( '\\' );
    const acceptableLength = isMac ? 8 : 5;

    if ( pathParts.length < acceptableLength ) {
        throw new Error( 'Insufficient file path' );
    }

    const targetBucket = isMac ? pathParts[ 5 ] : pathParts[ 2 ];
    let workingBucket;
    let remainder;

    if ( targetBucket === 'academics' ) {
        const academicsBuckets = S3_BUCKETS.filter( ( b ) => b.bucket === targetBucket );
        const root = isMac ? pathParts[ 6 ] : pathParts[ 3 ];

        workingBucket = academicsBuckets.find( ( b ) => b.root === root );
        remainder = isMac ? pathParts.slice( 7 ) : pathParts.slice( 4 );
    } else {
        workingBucket = S3_BUCKETS.find( ( b ) => b.bucket === targetBucket );
        remainder = isMac ? pathParts.slice( 6 ) : pathParts.slice( 3 );
    }

    if ( ! workingBucket ) {
        throw new Error( 'Unknown bucket' );
    }

    const tail = remainder.join( '/' ).replace( /^\/*/, '' );

    return workingBucket.baseUrl + tail;
};

/**
 * True when the string is a direct http(s) URL whose path ends with .xml.
 * @param {string} str
 * @returns {boolean}
 */
const isXmlFileUrl = ( str ) => /^https?:\/\/(?:[\w-]+\.)+[\w-]+(?:\/[^\s?#]*)*\.xml$/i.test( str );

/**
 * Maps a direct .xml file URL to its player URL. media-services assets are
 * passed to the player as a path relative to that base; anything else is
 * passed as an absolute URL. Returns null for unrecognized xml names.
 * @param {string} xmlUrl
 * @returns {?string}
 */
const buildPlayerUrlFromXml = ( xmlUrl ) => {
    let normalized = xmlUrl;

    if ( normalized.startsWith( MEDIA_SERVICES_BASE ) ) {
        normalized = normalized.replace( MEDIA_SERVICES_BASE, '' );
    }

    const last = normalized.split( '/' ).pop();

    switch ( last ) {
        case 'sbplus.xml':
            return `${ PLAYER_BASES.sbplus }?p=${ encodeURIComponent( normalized ) }`;
        case 'gvp.xml':
            return `${ PLAYER_BASES.gvp }?src=${ encodeURIComponent( normalized ) }`;
        case 'album.xml':
            return `${ PLAYER_BASES.audio }?src=${ encodeURIComponent( normalized ) }`;
        default:
            return null;
    }
};

/**
 * True when a player URL's source parameter references an .xml file.
 * @param {string} url
 * @param {string} type - 'sbplus' | 'gvp' | 'audio'
 * @returns {boolean}
 */
const playerParamEndsWithXml = ( url, type ) => {
    try {
        const param = type === 'sbplus' ? 'p' : 'src';
        const value = new URL( url ).searchParams.get( param );

        return !! value && /\.xml$/i.test( value );
    } catch {
        return false;
    }
};

/**
 * Classifies a resolved URL into a media type. Pure and never throws — this is
 * the single source of truth used at render time (editor preview and save).
 * @param {string} url
 * @returns {string} 'yt' | 'gvp' | 'sbplus' | 'audio' | 'generic' | ''
 */
const classifyUrl = ( url ) => {
    const value = ( url || '' ).trim();

    if ( ! value ) {
        return '';
    }

    if ( isYouTubeUrl( value ) ) {
        return 'yt';
    }

    const lower = value.toLowerCase();

    if ( lower.startsWith( PLAYER_BASES.gvp ) ) {
        return 'gvp';
    }

    if ( lower.startsWith( PLAYER_BASES.sbplus ) ) {
        return 'sbplus';
    }

    if ( lower.startsWith( PLAYER_BASES.audio ) ) {
        return 'audio';
    }

    return isValidUrl( value ) ? 'generic' : '';
};

/**
 * Resolves raw author input to a clean, storable embed URL and its media type.
 * Runs only in the editor (may throw internally via convertToUrl, caught here).
 * Order: sanitize -> convert file path -> rewrite direct .xml -> classify ->
 * validate (.xml for players, http(s) for generic).
 *
 * @param {string} raw - Raw author input (URL, ID, player link, or file path).
 * @returns {{type: string, src: string, error: ?string}}
 */
export const resolveMediaSource = ( raw ) => {
    let value = sanitizeInput( raw );

    if ( ! value ) {
        return { type: '', src: '', error: null };
    }

    // Convert a Windows/UNC/SMB file path to its public URL first.
    const isMac = isMacOsFilePath( value );

    if ( isWindowsFilePath( value ) || looksLikeWindowsPath( value ) || isMac ) {
        try {
            value = convertToUrl( value, isMac );
        } catch ( err ) {
            return { type: '', src: '', error: err.message };
        }
    }

    // Rewrite a direct .xml file URL to its player URL.
    if ( isXmlFileUrl( value ) ) {
        const playerUrl = buildPlayerUrlFromXml( value );

        if ( ! playerUrl ) {
            return { type: '', src: '', error: 'Unsupported XML file. Expected sbplus.xml, gvp.xml, or album.xml.' };
        }

        value = playerUrl;
    }

    const type = classifyUrl( value );

    // Players must reference an .xml source.
    if ( type === 'gvp' || type === 'sbplus' || type === 'audio' ) {
        if ( ! playerParamEndsWithXml( value, type ) ) {
            return { type: '', src: '', error: 'Player URL must reference an .xml file.' };
        }
    }

    if ( ! type || ( type === 'generic' && ! isValidUrl( value ) ) ) {
        return { type: '', src: '', error: 'Enter a valid URL, player link, or network/SMB file path.' };
    }

    return { type, src: value, error: null };
};

/**
 * Per-type configuration for the media embed block. `buildSrc` maps the stored
 * media source to the iframe URL; `layout` is 'aspect' (aspect-ratio padding box
 * when responsive) or 'flow' (fill-width + fixed height); `width`/`height` are the
 * per-type pixel defaults; `aspectRatio` is the padding-top for aspect types.
 *
 * The editor preview always renders through a same-origin SandBox. The default
 * (isolated) SandBox gives its document — and every iframe nested inside it — an
 * opaque `null` origin, which breaks embedded players: YouTube refuses playback
 * ("Error 153") because there is no valid Referer, and the GVP/Storybook+/audio
 * players fail their own same-origin fetches (e.g. manifest.json, album.xml) from
 * a null origin. A same-origin SandBox lets the nested iframe keep its real
 * origin. Mirrors how core's embed block renders its previews.
 */
const MEDIA_CONFIG = {
    gvp: {
        buildSrc: ( source ) => source,
        layout: 'aspect',
        width: 900,
        height: 506.25,
        aspectRatio: '56.25%',
        allow: 'fullscreen; autoplay; clipboard-write; encrypted-media; picture-in-picture',
        allowFullscreen: true,
    },
    yt: {
        buildSrc: ( source ) => `https://www.youtube.com/embed/${ extractYouTubeId( source ) }`,
        layout: 'aspect',
        width: 900,
        height: 506.25,
        aspectRatio: '56.25%',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        allowFullscreen: true,
    },
    sbplus: {
        buildSrc: ( source ) => source,
        layout: 'aspect',
        width: 900,
        height: 586,
        aspectRatio: '65.11111111111111%',
        minHeight: 586,
        allow: 'fullscreen; autoplay; accelerometer; gyroscope; clipboard-write; encrypted-media',
        allowFullscreen: true,
    },
    audio: {
        buildSrc: ( source ) => source,
        layout: 'aspect',
        width: 320,
        height: 568,
        aspectRatio: '177.5%',
        minHeight: 568,
        allow: 'autoplay; encrypted-media',
        allowFullscreen: false,
    },
    generic: {
        buildSrc: ( source ) => source,
        layout: 'flow',
        width: 900,
        height: 600,
        scroll: true,
        allow: 'fullscreen; encrypted-media; picture-in-picture',
        allowFullscreen: true,
    },
};

/**
 * Escapes a value for safe interpolation into a double-quoted HTML attribute.
 *
 * @param {string} value - Raw attribute value.
 * @returns {string} Escaped value.
 */
const escapeAttr = ( value ) =>
    String( value || '' )
        .replace( /&/g, '&amp;' )
        .replace( /"/g, '&quot;' )
        .replace( /</g, '&lt;' )
        .replace( />/g, '&gt;' );

/**
 * Coerces an attribute value (digit string, number, or empty) to a pixel
 * number, or undefined when unset/invalid.
 * @param {*} value
 * @returns {number|undefined}
 */
const toPx = ( value ) => {
    if ( value === undefined || value === null || value === '' ) {
        return undefined;
    }

    const n = parseFloat( value );

    return Number.isFinite( n ) ? n : undefined;
};

/** Converts a kebab-case CSS property to camelCase for React style objects. */
const kebabToCamel = ( str ) => str.replace( /-([a-z])/g, ( _match, char ) => char.toUpperCase() );

/** Serializes [prop, value] pairs to a CSS declaration string. */
const toStyleString = ( pairs ) => pairs.map( ( [ prop, value ] ) => `${ prop }:${ value }` ).join( ';' );

/** Converts [prop, value] pairs to a React style object. */
const toStyleObject = ( pairs ) =>
    pairs.reduce( ( style, [ prop, value ] ) => {
        style[ kebabToCamel( prop ) ] = value;
        return style;
    }, {} );

/**
 * Builds the iframe HTML string for the SandBox editor preview.
 * @param {string} src
 * @param {string} mediaTitle
 * @param {Object} config - MEDIA_CONFIG entry.
 * @param {string} styleString - Serialized iframe style.
 * @param {string} scrolling - Iframe scrolling attribute ('yes' | 'no').
 * @returns {string}
 */
const buildIframeHtml = ( src, mediaTitle, config, styleString, scrolling ) =>
    `<iframe src="${ escapeAttr( src ) }" title="${ escapeAttr( mediaTitle ) }" scrolling="${ scrolling }" frameborder="0" allow="${ escapeAttr( config.allow ) }" referrerpolicy="strict-origin-when-cross-origin" style="${ escapeAttr( styleString ) }" loading="lazy"${ config.allowFullscreen ? ' allowfullscreen' : '' }></iframe>`;

/**
 * Renders a media embed iframe. The media type is derived from the source URL
 * (see classifyUrl), so no type is passed in. Sizing follows the block's
 * responsive toggle and per-type defaults; min/max bounds apply in every mode.
 *
 * On the front-end the iframe is rendered directly. In `preview` mode (the
 * block editor) the same markup is rendered through WordPress's SandBox.
 *
 * @param {Object} props - Component props.
 * @param {string} props.mediaSource - Resolved media source URL or ID.
 * @param {string} [props.mediaTitle] - Accessible iframe title.
 * @param {boolean} [props.responsive=true] - Fluid layout vs fixed pixel size.
 * @param {string} [props.width] - Fixed width px (non-responsive).
 * @param {string} [props.height] - Fixed height px (non-responsive / flow).
 * @param {string} [props.minWidth] - Minimum width px.
 * @param {string} [props.minHeight] - Minimum height px.
 * @param {string} [props.maxWidth] - Maximum width px.
 * @param {string} [props.maxHeight] - Maximum height px.
 * @param {string} [props.verticalScroll] - Scroll override ('' = per-type default | 'yes' | 'no').
 * @param {boolean} [props.preview=false] - Render through SandBox for the editor.
 * @returns {JSX.Element|null} The embed markup, or null when not configured.
 */
export const MediaEmbed = ( {
    mediaSource,
    mediaTitle,
    responsive = true,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    verticalScroll = '',
    preview = false,
} ) => {
    const type = classifyUrl( mediaSource );
    const config = MEDIA_CONFIG[ type ];

    if ( ! config || ! mediaSource ) {
        return null;
    }

    const src = config.buildSrc( mediaSource );

    // Empty override falls back to the per-type default; explicit 'no' wins.
    const scrolling = verticalScroll || ( config.scroll ? 'yes' : 'no' );

    const effectiveWidth = toPx( width ) ?? config.width;
    const effectiveHeight = toPx( height ) ?? config.height;
    const effectiveMinWidth = toPx( minWidth );
    const effectiveMinHeight = toPx( minHeight ) ?? config.minHeight;
    const effectiveMaxWidth = toPx( maxWidth ) ?? config.width;
    const effectiveMaxHeight = toPx( maxHeight );

    const useAspectBox = responsive && config.layout === 'aspect';

    // Optional min/max declarations shared by every layout.
    const boundsPairs = [];

    if ( effectiveMinWidth !== undefined ) {
        boundsPairs.push( [ 'min-width', `${ effectiveMinWidth }px` ] );
    }
    if ( effectiveMinHeight !== undefined ) {
        boundsPairs.push( [ 'min-height', `${ effectiveMinHeight }px` ] );
    }
    if ( effectiveMaxHeight !== undefined ) {
        boundsPairs.push( [ 'max-height', `${ effectiveMaxHeight }px` ] );
    }

    let wrapperPairs = null;
    let innerPairs = null;
    let iframePairs;

    if ( useAspectBox ) {
        // Aspect-ratio padding box: fluid width capped by max-width.
        wrapperPairs = [
            [ 'position', 'relative' ],
            [ 'display', 'block' ],
            [ 'margin', '0 auto' ],
            [ 'max-width', `${ effectiveMaxWidth }px` ],
            ...boundsPairs,
        ];
        innerPairs = [ [ 'padding-top', config.aspectRatio ] ];
        iframePairs = [
            [ 'position', 'absolute' ],
            [ 'top', '0' ],
            [ 'left', '0' ],
            [ 'inset', '0' ],
            [ 'width', '100%' ],
            [ 'height', '100%' ],
            [ 'border', 'none' ],
        ];
    } else if ( responsive ) {
        // Flow layout (generic), responsive: fill container width, fixed height.
        iframePairs = [
            [ 'display', 'block' ],
            [ 'margin', '0 auto' ],
            [ 'border', 'none' ],
            [ 'width', '100%' ],
            [ 'height', `${ effectiveHeight }px` ],
            [ 'max-width', `${ effectiveMaxWidth }px` ],
            ...boundsPairs,
        ];
    } else {
        // Non-responsive: fixed pixel box; never overflow a narrow viewport.
        const userMaxWidth = toPx( maxWidth );

        iframePairs = [
            [ 'display', 'block' ],
            [ 'margin', '0 auto' ],
            [ 'border', 'none' ],
            [ 'width', `${ effectiveWidth }px` ],
            [ 'height', `${ effectiveHeight }px` ],
            [ 'max-width', userMaxWidth !== undefined ? `${ userMaxWidth }px` : '100%' ],
            ...boundsPairs,
        ];
    }

    // Editor preview: render the same markup through SandBox so third-party
    // embeds get a valid browsing context instead of the editor's srcdoc canvas.
    if ( preview ) {
        const iframeHtml = buildIframeHtml( src, mediaTitle, config, toStyleString( iframePairs ), scrolling );
        const html = useAspectBox
            ? `<div style="${ toStyleString( wrapperPairs ) }"><div style="${ toStyleString( innerPairs ) }">${ iframeHtml }</div></div>`
            : iframeHtml;

        return <SandBox allowSameOrigin html={ html } title={ mediaTitle } type={ `media-embed-${ type }` } />;
    }

    const iframe = (
        <iframe
            src={ src }
            title={ mediaTitle }
            scrolling={ scrolling }
            frameBorder="0"
            allow={ config.allow }
            referrerPolicy="strict-origin-when-cross-origin"
            style={ toStyleObject( iframePairs ) }
            loading="lazy"
            allowFullScreen={ config.allowFullscreen }
        ></iframe>
    );

    if ( useAspectBox ) {
        return (
            <div style={ toStyleObject( wrapperPairs ) }>
                <div style={ toStyleObject( innerPairs ) }>
                    { iframe }
                </div>
            </div>
        );
    }

    return iframe;
};