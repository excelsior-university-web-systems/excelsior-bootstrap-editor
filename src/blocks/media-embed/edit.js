import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Notice, Flex, FlexBlock, __experimentalVStack as VStack, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { MediaEmbed, resolveMediaSource } from '../../commons';

/**
 * Friendly labels for the auto-detected media types.
 */
const TYPE_LABELS = {
    yt: 'YouTube',
    gvp: 'Generic Video Player',
    sbplus: 'Storybook+',
    audio: 'Audio Player',
    generic: 'Generic Embed',
};

const SOURCE_HELP = 'Paste a YouTube link, an Excelsior player/.xml URL, or a network/SMB file path. The type is detected automatically.';

export default function Edit( { attributes, setAttributes } ) {

    const { mediaTitle, mediaSource, responsive, width, height, minWidth, minHeight, maxWidth, maxHeight, floatingClasses } = attributes;

    // Raw editable text; committed to mediaSource on blur/Enter.
    const [ tempSource, setTempSource ] = useState( mediaSource );
    const [ error, setError ] = useState( '' );

    // The stored source is always a clean, resolved URL, so re-resolving it is
    // idempotent and yields the detected type for the label + control gating.
    const detectedType = resolveMediaSource( mediaSource ).type;

    const commitSource = () => {
        const { src, error: resolveError } = resolveMediaSource( tempSource );

        if ( resolveError ) {
            setError( resolveError );
            return;
        }

        setError( '' );

        if ( src !== mediaSource ) {
            setAttributes( { mediaSource: src } );
        }

        if ( src !== tempSource ) {
            setTempSource( src );
        }
    };

    const onSourceKeyDown = ( event ) => {
        if ( event.key === 'Enter' ) {
            event.preventDefault();
            commitSource();
        }
    };

    const setPx = ( key ) => ( value ) => setAttributes( { [ key ]: value ?? '' } );

    const showWidth = ! responsive;
    const showHeight = ! responsive || detectedType === 'generic';

    return (
        <>
        <InspectorControls>
            <PanelBody title="Settings">
                <TextControl
                    label="Media Title"
                    value={ mediaTitle }
                    onChange={ ( value ) => setAttributes( { mediaTitle: value } ) }
                    __next40pxDefaultSize={ true }
                />
                <TextControl
                    label="Media Source"
                    help={ SOURCE_HELP }
                    value={ tempSource }
                    onChange={ setTempSource }
                    onBlur={ commitSource }
                    onKeyDown={ onSourceKeyDown }
                    __next40pxDefaultSize={ true }
                />
                { error && (
                    <Notice status="warning" isDismissible={ false }>{ error }</Notice>
                ) }
                { detectedType && (
                    <p className="components-base-control__help">Detected media: <strong>{ TYPE_LABELS[ detectedType ] }</strong></p>
                ) }
                <ToggleControl
                    label="Responsive"
                    help="Fills the available width. Turn off to set a fixed size."
                    checked={ responsive }
                    onChange={ ( value ) => setAttributes( { responsive: value } ) }
                />
                <VStack spacing={ 4 }>
                    { ( showWidth || showHeight ) && (
                        <Flex gap={ 3 } align="flex-start">
                            { showWidth && (
                                <FlexBlock>
                                    <NumberControl
                                        label="Width (px)"
                                        value={ width }
                                        onChange={ setPx( 'width' ) }
                                        __next40pxDefaultSize
                                        __nextHasNoMarginBottom
                                    />
                                </FlexBlock>
                            ) }
                            { showHeight && (
                                <FlexBlock>
                                    <NumberControl
                                        label="Height (px)"
                                        value={ height }
                                        onChange={ setPx( 'height' ) }
                                        __next40pxDefaultSize
                                        __nextHasNoMarginBottom
                                    />
                                </FlexBlock>
                            ) }
                        </Flex>
                    ) }
                    <Flex gap={ 3 } align="flex-start">
                        <FlexBlock>
                            <NumberControl
                                label="Min Width (px)"
                                value={ minWidth }
                                onChange={ setPx( 'minWidth' ) }
                                __next40pxDefaultSize
                                __nextHasNoMarginBottom
                            />
                        </FlexBlock>
                        <FlexBlock>
                            <NumberControl
                                label="Min Height (px)"
                                value={ minHeight }
                                onChange={ setPx( 'minHeight' ) }
                                __next40pxDefaultSize
                                __nextHasNoMarginBottom
                            />
                        </FlexBlock>
                    </Flex>
                    <Flex gap={ 3 } align="flex-start">
                        <FlexBlock>
                            <NumberControl
                                label="Max Width (px)"
                                value={ maxWidth }
                                onChange={ setPx( 'maxWidth' ) }
                                __next40pxDefaultSize
                                __nextHasNoMarginBottom
                            />
                        </FlexBlock>
                        <FlexBlock>
                            <NumberControl
                                label="Max Height (px)"
                                value={ maxHeight }
                                onChange={ setPx( 'maxHeight' ) }
                                __next40pxDefaultSize
                                __nextHasNoMarginBottom
                            />
                        </FlexBlock>
                    </Flex>
                </VStack>
            </PanelBody>
        </InspectorControls>
        <div { ...useBlockProps() }>
            { mediaSource && detectedType ? (
                <div className={ `${ floatingClasses.length ? floatingClasses + " ratio ratio-16x9 ratio-md-0" : 'mb-3' }` }>
                    { /* mediaTitle is intentionally omitted: it only sets the front-end iframe title (see save.js). Passing it here would rebuild the SandBox markup and reload the embed on every keystroke. */ }
                    <MediaEmbed
                        mediaSource={ mediaSource }
                        responsive={ responsive }
                        width={ width }
                        height={ height }
                        minWidth={ minWidth }
                        minHeight={ minHeight }
                        maxWidth={ maxWidth }
                        maxHeight={ maxHeight }
                        preview
                    />
                </div>
            ) : (
                <div className="excelsior-media-embed-insert">
                    <TextControl
                        label="Media Source"
                        help={ SOURCE_HELP }
                        value={ tempSource }
                        onChange={ setTempSource }
                        onBlur={ commitSource }
                        onKeyDown={ onSourceKeyDown }
                    />
                    { error && (
                        <Notice status="warning" isDismissible={ false }>{ error }</Notice>
                    ) }
                </div>
            ) }
        </div>
        </>
    );

}
