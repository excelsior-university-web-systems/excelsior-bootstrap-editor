export const convertTo12HourFormat = ( time ) => {

    const [hours24, minutes] = time.split(':');
    let hours = parseInt(hours24, 10);
    const period = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;

};

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

export const formatAsHtmlId = (input) => {
    // Replace spaces with hyphens, remove underscores, and ensure no invalid characters
    let formattedId = input.trim()
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/[^a-zA-Z0-9-]/g, '') // Remove any non-alphanumeric characters except hyphens

    // Ensure it doesn't start with a number
    formattedId = formattedId.replace(/^[0-9]+/, '');

    return formattedId;
};

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

// Sanitize to strip out <script> tags
export const removeScriptTags = ( input ) => {
    
    const tempElement = document.createElement( 'div' );
    tempElement.innerHTML = input;

    const scripts = tempElement.querySelectorAll( 'script' );
    scripts.forEach( (script) => script.remove() );
    
    return tempElement.innerHTML;

};

// Recursive function to get all blocks of a specific type
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