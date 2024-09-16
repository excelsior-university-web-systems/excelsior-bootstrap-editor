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