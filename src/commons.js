import { Notice, SandBox } from '@wordpress/components';

export const ALT_TEXT_LIMIT = 150;
export const CAPTION_LIMIT = 250;

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
 * Per-type configuration for the media embed block.
 * `buildSrc` maps the stored media source to the iframe URL.
 *
 * `sameOrigin` renders the editor preview through a same-origin SandBox. The
 * default (isolated) SandBox gives its document — and every iframe nested inside
 * it — an opaque `null` origin, which breaks embedded players: YouTube refuses
 * playback ("Error 153") because there is no valid Referer, and the GVP/Storybook+
 * players fail their own same-origin fetches (e.g. manifest.json) from a null
 * origin. A same-origin SandBox lets the nested iframe keep its real origin.
 * Mirrors how core's embed block renders its previews.
 */
const MEDIA_CONFIG = {
    gvp: {
        buildSrc: ( source ) => source,
        paddingTop: '56.25%',
        allow: 'fullscreen; autoplay; clipboard-write; encrypted-media; picture-in-picture',
        sameOrigin: true,
    },
    yt: {
        buildSrc: ( source ) => `https://www.youtube.com/embed/${ extractYouTubeId( source ) }`,
        paddingTop: '56.25%',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        sameOrigin: true,
    },
    sbplus: {
        buildSrc: ( source ) => source,
        paddingTop: '65.11111111111111%',
        minHeight: 586,
        allow: 'fullscreen; autoplay; accelerometer; gyroscope; clipboard-write; encrypted-media',
        sameOrigin: true,
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
 * Renders a responsive, aspect-ratio-locked media embed iframe.
 *
 * On the front-end the iframe is rendered directly. In `preview` mode (the
 * block editor) it is rendered through WordPress's SandBox component instead.
 *
 * @param {Object} props - Component props.
 * @param {string} props.mediaType - Media type key (see MEDIA_CONFIG).
 * @param {string} props.mediaSource - Media source URL or ID.
 * @param {string} [props.mediaTitle] - Accessible iframe title.
 * @param {boolean} [props.preview=false] - Render through SandBox for the editor.
 * @returns {JSX.Element|null} The embed markup, or null when not configured.
 */
export const MediaEmbed = ( { mediaType, mediaSource, mediaTitle, preview = false } ) => {
    const config = MEDIA_CONFIG[ mediaType ];

    if ( ! config || ! mediaSource ) {
        return null;
    }

    const src = config.buildSrc( mediaSource );

    const wrapperStyle = {
        position: 'relative',
        display: 'block',
        maxWidth: 900,
        margin: '0 auto',
        ...( config.minHeight && { minHeight: config.minHeight } ),
    };

    const fillStyle = {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        border: 'none',
    };

    // Editor preview: render the same markup through SandBox so third-party
    // embeds get a valid browsing context instead of the editor's srcdoc canvas.
    if ( preview ) {
        const minHeight = config.minHeight ? `min-height:${ config.minHeight }px;` : '';
        const html = `
            <div style="position:relative;display:block;max-width:900px;margin:0 auto;${ minHeight }">
                <div style="padding-top:${ config.paddingTop };">
                    <iframe
                        src="${ escapeAttr( src ) }"
                        title="${ escapeAttr( mediaTitle ) }"
                        scrolling="no"
                        frameborder="0"
                        allow="${ escapeAttr( config.allow ) }"
                        referrerpolicy="strict-origin-when-cross-origin"
                        style="position:absolute;inset:0;width:100%;height:100%;border:none;"
                        loading="lazy"
                        allowfullscreen
                    ></iframe>
                </div>
            </div>`;

        return <SandBox allowSameOrigin={ Boolean( config.sameOrigin ) } html={ html } title={ mediaTitle } type={ `media-embed-${ mediaType }` } />;
    }

    return (
        <div style={ wrapperStyle }>
            <div style={ { paddingTop: config.paddingTop } }>
                <iframe
                    src={ src }
                    title={ mediaTitle }
                    scrolling="no"
                    frameBorder="0"
                    allow={ config.allow }
                    referrerPolicy="strict-origin-when-cross-origin"
                    style={ fillStyle }
                    loading="lazy"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};