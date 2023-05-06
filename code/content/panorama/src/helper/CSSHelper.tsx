export module CSSHelper {

    export const DEFAULT_ADDON_TYPE = "Tui3";
    export const DEFAULT_ICON_SIZE = "32px";

    export function IsReadyUI() {
        return Game.GetState() >= DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS;
    }

    export enum VCSSStyle {
        /**
         * Controls blending mode for the panel. See CSS mix-blend-mode docs on web, except normal for us is with alpha blending.
         *
         * Examples:
         * -s2-mix-blend-mode: normal;
         * -s2-mix-blend-mode: multiply;
         * -s2-mix-blend-mode: screen;
         */
        S2MixBlendMode,

        align,

        animation,
        animationDelay,
        animationDirection,
        animationDuration,
        animationIterationCount,
        animationName,
        animationTimingFunction,

        /**
         * Sets the background fill color/gradient/combination for a panel.
         *
         * Examples:
         * background-color: #FFFFFFFF;
         * background-color: gradient( linear, 0% 0%, 0% 100%, from( #fbfbfbff ), to( #c0c0c0c0 ) );
         * background-color: gradient( linear, 0% 0%, 0% 100%, from( #fbfbfbff ), color-stop( 0.3, #ebebebff ), to( #c0c0c0c0 ) );
         * background-color: gradient( radial, 50% 50%, 0% 0%, 80% 80%, from( #00ff00ff ), to( #0000ffff ) );
         * background-color: #0d1c22ff, gradient( radial, 100% -0%, 100px -40px, 320% 270%, from( #3a464bff ), color-stop( 0.23, #0d1c22ff ), to( #0d1c22ff ) );
         */
        backgroundColor,

        /**
         * Comma separated list of images or movies to draw in the background. Can specify "none" to not draw a background layer. Combined with background-position, background-size and background-repeat
         * values.
         *
         * Example:
         * background-image: url("file://{images}/default.tga"), url( "file://{movies}/Background1080p.webm" );
         */
        backgroundImage,

        /**
         * Controls the horizontal and vertical placement of the background image, with the format: <left|center|right> <horizontal length> <top|center|bottom> <vertical length>
         *
         * If length is a percent, the specified location within the image is positioned over that same specified position in the background. If the length is pixels, the top left corner is placed
         * relative to the provided alignment keywords (left, bottom, etc.). See examples for more details.
         *
         * If 1 value is specified, the other value is assumed to be center. If 2 values are specified, the first value must be for horizontal placement and the second for vertical.
         *
         * Examples:
         * // aligns the top left corner of the image with the top left corner of the panel (default)
         * background-position: 0% 0%;
         * // centers the image within the background (same as "center center")
         * background-position: center;
         * // aligns the bottom right corner of the image with the bottom right corner of the panel (same as "100% 100%")
         * background-position: right bottom;
         * // the top left corner of the image is placed 10px to the right of, 40px below the top left corner of the panel
         * background-position: left 10px top 40px;
         */
        backgroundPosition,

        /**
         * Controls if the background should be repeated in the horizontal and vertical directions.
         *
         * Possible values per direction:
         * "repeat" - (default) Repeated in the specified direction until it fills the panel
         * "space" - Repeated as many times as required to fill the panel w/o being clipped. Space is added between images to to align first and last image with panel edges.
         * "round" - Repeated as many times as required to fill the panel w/o being clipped. The image is resized to align first and last image with panel edges.
         * "no-repeat" - Not repeated
         *
         * Possible single values:
         * "repeat-x" - equals "repeat no-repeat"
         * "repeat-y" - equals "no-repeat repeat"
         *
         * Examples:
         * background-repeat: repeat; // equals "repeat repeat" (default)
         * background-repeat: repeat space; // repeats horizontally, spaces vertically
         * background-repeat: no-repeat round; // 1 column of images, scaled to fit evenly
         */
        backgroundRepeat,

        /**
         * Sets the horizontal and vertical dimensions used to draw the background image. Can be set in pixels, percent, "contains" to size down to panel dimensions or "auto" preserves the image aspect
         * ratio. By default, set to "auto" which preveres the image's original size.
         *
         * Multiple background layers can be specified in a comma separated list, which are then combined with background-image, background-position, and background-repeat values.
         *
         * Examples:
         * background-size: auto; // same as "auto auto" (default)
         * background-size: 100% 100%; // image fills the panel
         * background-size: 50% 75%; // image fills 50% of the panel's width, and 75% of the panel's height
         * background-size: 300px 200px; // image is drawn 300px wide, 200px tall
         */
        backgroundSize,

        /**
         * Sets the amount of blur to apply to the panel and all it's children during composition.  Default is no blur, for now Gaussian is the only blur type and takes a horizontal standard deviation,
         * vertical standard deviation, and number of passes.  Good std deviation values are around 0-10, if 10 is still not intense enough consider more passes, but more than one pass is bad for perf.
         * As shorthand you can specify with just one value, which will be used for the standard deviation in both directions and 1 pass will be set.
         *
         * Examples:
         * blur: gaussian( 2.5 );
         * blur: gaussian( 6, 6, 1 );
         */
        blur,

        /**
         * Shorthand for setting panel border. Specify width, style, and color.  Supported styles are: solid, none.
         *
         * Examples:
         * border: 2px solid #111111FF;
         */
        border,

        /**
         * Shorthand for setting the bottom panel border. Specify width, style, and color.  Supported styles are: solid, none.
         *
         * Examples:
         * border-bottom: 2px solid #111111FF;
         */
        borderBottom,

        /**
         * Specifies border color for the bottom edge of the panel.
         *
         * Examples:
         * border-bottom-color: #111111FF;
         */
        borderBottomColor,

        /**
         * Specifies border-radius for bottom-left corner which rounds off border and clips background/foreground content to rounded edge.  Takes 1 or 2 values in px or %, first value is horizontal
         * radii for elliptical corner, second is vertical radii, if only one is specified then horizontal/vertical will both be set and corner will be circular.
         *
         * Examples:
         * border-bottom-left-radius: 2px 2px;
         * border-bottom-left-radius: 5%;
         */
        borderBottomLeftRadius,

        /**
         * Specifies border-radius for bottom-right corner which rounds off border and clips background/foreground content to rounded edge.  Takes 1 or 2 values in px or %, first value is horizontal
         * radii for elliptical corner, second is vertical radii, if only one is specified then horizontal/vertical will both be set and corner will be circular.
         *
         * Examples:
         * border-bottom-right-radius: 2px 2px;
         * border-bottom-right-radius: 5%;
         */
        borderBottomRightRadius,

        /**
         * Specifies border style for the bottom edge of the panel.
         *
         * Examples:
         * border-bottom-style: solid;
         */
        borderBottomStyle,

        /**
         * Specifies border width for the bottom edge of the panel.
         *
         * Examples:
         * border-bottom-width: 2px;
         */
        borderBottomWidth,

        /**
         * Specifies border color for panel.  If a single color value is set it applies to all sides, if 2 are set the first is top/bottom and the second is left/right, if all four are set then they are
         * top, right, bottom, left in order.
         *
         * Examples:
         * border-color: #111111FF;
         * border-color: #FF0000FF #00FF00FF #0000FFFF #00FFFFFF;
         */
        borderColor,

        /**
         * Shorthand for setting the left panel border. Specify width, style, and color.  Supported styles are: solid, none.
         *
         * Examples:
         * border-left: 2px solid #111111FF;
         */
        borderLeft,

        /**
         * Specifies border color for the left edge of the panel.
         *
         * Examples:
         * border-left-color: #111111FF;
         */
        borderLeftColor,

        /**
         * Specifies border style for the left edge of the panel.
         *
         * Examples:
         * border-left-style: solid;
         */
        borderLeftStyle,

        /**
         * Specifies border width for the left edge of the panel.
         *
         * Examples:
         * border-left-width: 2px;
         */
        borderLeftWidth,

        /**
         * Shorthand to set border radius for all corners at once.  Border radius rounds off corners of the panel, adjusting the border to smoothly round and also clipping background image/color and
         * contents to the specified elliptical or circular values.  In this shorthand version you may specify a single value for all raddi, or horizontal / vertical separated by the '/' character.
         * For both horizontal and vertical you may specify 1 to 4 values in pixels or %, they will be taken in order as top-left, top-right, bottom-right, bottom-left radii values.
         *
         * Examples:
         * // 2 px circular corners on all sides
         * border-radius: 2px;
         * // Perfect circular or elliptical panel (circular if box was square)
         * border-radius: 50% / 50%;
         * // 2 px horizontal radii 4px vertical elliptical corners on all sides
         * border-radius: 2px / 4px;
         * // All corners fully specified
         * border-radius: 2px 3px 4px 2px / 2px 3px 3px 2px;
         */
        borderRadius,

        /**
         * Shorthand for setting the right panel border. Specify width, style, and color.  Supported styles are: solid, none.
         *
         * Examples:
         * border-right: 2px solid #111111FF;
         */
        borderRight,

        /**
         * Specifies border color for the right edge of the panel.
         *
         * Examples:
         * border-right-color: #111111FF;
         */
        borderRightColor,

        /**
         * Specifies border style for the right edge of the panel.
         *
         * Examples:
         * border-right-style: solid;
         */
        borderRightStyle,

        /**
         * Specifies border width for the right edge of the panel.
         *
         * Examples:
         * border-right-width: 2px;
         */
        borderRightWidth,

        /**
         * Specifies border style for panel.  If a single style value is set it applies to all sides, if 2 are set the first is top/bottom and the second is left/right, if all four are set then they are
         * top, right, bottom, left in order.
         *
         * Examples:
         * border-style: solid;
         * border-style: solid none solid none;
         */
        borderStyle,

        /**
         * Shorthand for setting the top panel border. Specify width, style, and color.  Supported styles are: solid, none.
         *
         * Examples:
         * border-top: 2px solid #111111FF;
         */
        borderTop,

        /**
         * Specifies border color for the top edge of the panel.
         *
         * Examples:
         * border-top-color: #111111FF;
         */
        borderTopColor,

        /**
         * Specifies border-radius for top-left corner which rounds off border and clips background/foreground content to rounded edge.  Takes 1 or 2 values in px or %, first value is horizontal radii
         * for elliptical corner, second is vertical radii, if only one is specified then horizontal/vertical will both be set and corner will be circular.
         *
         * Examples:
         * border-top-left-radius: 2px 2px;
         * border-top-left-radius: 5%;
         */
        borderTopLeftRadius,

        /**
         * Specifies border-radius for top-right corner which rounds off border and clips background/foreground content to rounded edge.  Takes 1 or 2 values in px or %, first value is horizontal radii
         * for elliptical corner, second is vertical radii, if only one is specified then horizontal/vertical will both be set and corner will be circular.
         *
         * Examples:
         * border-top-right-radius: 2px 2px;
         * border-top-right-radius: 5%;
         */
        borderTopRightRadius,

        /**
         * Specifies border style for the top edge of the panel.
         *
         * Examples:
         * border-top-style: solid;
         */
        borderTopStyle,

        /**
         * Specifies border width for the top edge of the panel.
         *
         * Examples:
         * border-top-width: 2px;
         */
        borderTopWidth,

        /**
         * Specifies border width for panel.  If a single width value is set it applies to all sides, if 2 are set the first is top/bottom and the second is left/right, if all four are set then they are
         * top, right, bottom, left in order.
         *
         * Examples:
         * border-width: 1px;'
         * border-width: 20px 1px 20px 1px;
         */
        borderWidth,

        /**
         * Specifies outer shadows for boxes, or inset shadows/glows.  The shadow shape will match the border box for the panel,so use border-radius to affect rounding.  Syntax takes optional 'inset',
         * optional 'fill' then color, and then horizontal offset pixels, vertical offset pixels, blur radius pixels, and spread distance in pixels. Inset means the shadow is an inner shadow/glow, fill
         * is validonly on outer shadows and means draw the shadow behind the entire box, not clipping it to outside the border area only.
         *
         * Examples:
         * box-shadow: #ffffff80 4px 4px 8px 0px; // outer
         * box-shadow: fill #ffffff80 4px 4px 8px 0px; // outer, filled
         * box-shadow: inset #333333b0 0px 0px 8px 12px; // inner
         */
        boxShadow,

        /**
         * Sets the brightness that applies to the panel and all it's children during composition. The value is a multiplier on the HSB brightness value.
         *
         * Example:
         * brightness: 1.5;
         */
        brightness,

        /**
         * Specifies a clip region within the panel, where contents will be clipped at render time. This clipping has no impact on layout, and is fast and supported for transitions/animations. Radialclip
         * mode takes a center point, start angle and angular width of the revealed sector.
         *
         * Example:
         * clip: rect( 10%, 90%, 90%, 10% );clip: radial( 50% %50, 0deg, 90deg );
         */
        clip,

        /**
         * Sets the foreground fill color/gradient/combination for a panel.  This color is the color used to render text within the panel.
         *
         * Examples:
         * color: #FFFFFFFF;
         * color: gradient( linear, 0% 0%, 0% 100%, from( #cbcbcbff ), to( #a0a0a0a0 ) );
         */
        color,

        /**
         * Specifies where to point the arrow of a context menu at on this panel. The first value controls how the arrow is positioned horizontally when the context menu is to the top or bottom of the
         * panel, and the second value controls how the arrow is positioned vertically when the context menu is to the left or right of the panel. Default is '50% 50%'.
         *
         * Example:
         * context-menu-arrow-position: 25% 50%;
         */
        contextMenuArrowPosition,

        /**
         * Specifies where to position the body of a context menu relative to this panel. The first value controls how the body is aligned horizontally when the context menu is to the top or bottom of
         * the panel, and the second value controls how the body is aligned vertically when the context menu is to the left or right of the panel. 0% means left/top aligned, 50% means center/middle
         * aligned, and 100% means right/bottom aligned. Default is '0% 0%'.
         *
         * Example:
         * context-menu-body-position: 50% 100%;
         */
        contextMenuBodyPosition,

        /**
         * Specifies where to position a context menu relative to this panel. Valid options include 'left', 'top', 'right', and 'bottom'. List up to 4 positions to determine the order that positions are
         * tried if the context menu doesn't fully fit on screen. Default is 'right left bottom top'. If less than 4 positions are specified, the context menu first tries the opposite of the specified
         * position along the same axis before switching to the other axis.
         *
         * Examples:
         * context-menu-position: bottom;
         * context-menu-position: left bottom;
         */
        contextMenuPosition,

        /**
         * Sets the contrast that applies to the panel and all it's children during composition.
         *
         * Example:
         * contrast: 1.5;
         */
        contrast,

        flowChildren,

        font,

        /**
         * Specifies the font face to use.
         *
         * Examples:
         * font-family: Arial;
         * font-family: "Comic Sans MS";
         */
        fontFamily,

        /**
         * Specifies the target font face height in pixels.
         *
         * Example:
         * font-size: 12;
         */
        fontSize,

        /**
         * Specifies the font style to use. Supported values are normal, and italic
         *
         * Example:
         * font-style: normal;
         */
        fontStyle,

        /**
         * Specifies the font weight to use. Supported values are light, thin, normal, medium, bold, and black.
         *
         * Examples:
         * font-weight: normal;
         * font-weight: bold;
         * font-weight: thin;
         */
        fontWeight,

        /**
         * Sets the height for this panel. Possible values:
         * "fit-children" - Panel size is set to the required size of all children (default)
         * <pixels> - Any fixed pixel value (ex: "100px")
         * <percentage> - Percentage of parent height (ex: "100%")
         * "fill-parent-flow( <weight> )" - Fills to remaining parent width. If multiple children are set to this value, weight is used to determine final height. For example, if three children are set
         * to fill-parent-flow of 1.0 and the parent is 300px tall, each child will be 100px tall. (ex: "fill-parent-flow( 1.0 )" )
         * "width-percentage( <percentage> )" - Percentage of the panel's width, which allows you to enforce a particular aspect ratio.  The width cannot also be height-percentage.
         */
        height,

        horizontalAlign,

        /**
         * Sets the hue rotation to apply to the panel and all it's children during composition. Default of 0.0 means no adjustment, domain is in degrees.
         *
         * Example:
         * hue-rotation: 180deg;
         */
        hueRotation,

        /**
         * Sets letter-spacing for text in a string. Possible values:
         * normal - no manual spacing
         * <pixels> - Any fixed pixel value (ex: "1px")
         */
        letterSpacing,

        /**
         * Specifies the line height (distance between top edge of line above and line below) to use for text.  By default this is unset and a value that matches the font-size reasonably will be used
         * automatically.
         *
         * Example:
         * line-height: 20px;
         */
        lineHeight,

        margin,
        marginBottom,
        marginLeft,
        marginRight,
        marginTop,

        minHeight,
        maxHeight,

        minWidth,
        maxWidth,

        /**
         * Sets the opacity or amount of transparency applied to the panel and all it's children during composition. Default of 1.0 means fully opaque, 0.0 means fully transparent.
         *
         * Example:
         * opacity: 0.8;
         */
        opacity,

        /**
         * Applies an image as an opacity mask that stretches to the panel bounds and fades out it's content based on the alpha channel. The second float value is an optional opacity value for the mask
         * itself, the image won't interpolate/cross-fade, but you can animate the opacity to fade the mask in/out. The -scroll-up, -scroll-down, and -scroll-up-down varients override the mask and apply
         * only when the various vertical scroll scenarios affect the panel based on the overflow property.
         *
         * Examples:
         * opacity-mask: url( "file://{images}/upper_row_mask.tga" );
         * opacity-mask: url( "file://{images}/upper_row_mask.tga" ) 0.5;
         * opacity-mask-scroll-up: url( "file://{images}/upper_row_mask_up.tga" ) 0.5;
         * opacity-mask-scroll-down: url( "file://{images}/upper_row_mask_down.tga" ) 0.5;
         * opacity-mask-scroll-up-down: url( "file://{images}/upper_row_mask_up_down.tga" ) 0.5;
         */
        opacityMask,
        opacityMaskScrollDown,
        opacityMaskScrollUp,
        opacityMaskScrollUpDown,

        /**
         * Specifies what to do with contents that overflow the available space for the panel. Possible values:
         * "squish" - Children are squished to fit within the panel's bounds if needed (default)
         * "clip" - Children maintain their desired size but their contents are clipped
         * "scroll" - Children maintain their desired size and a scrollbar is added to this panel
         *
         * Examples:
         * overflow: squish squish; // squishes contents in horizontal and vertical directions
         * overflow: squish scroll; // scrolls contents in the Y direction
         */
        overflow,

        padding,
        paddingBottom,
        paddingLeft,
        paddingRight,
        paddingTop,

        /**
         * Sets the perspective depth space available for children of the panel.  Default of 1000 would mean that children at 1000px zpos are right at the viewers eye, -1000px are just out of view
         * distance faded to nothing.
         *
         * Example:
         * perspective: 1000;
         */
        perspective,
        /**
         * Sets the perspective origin which will be used when transforming children of this panel.  This can be thought of as the camera x/y position relative to the panel.
         *
         * Example:
         * perspective-origin: 50% 50%;
         */
        perspectiveOrigin,

        /**
         * Sets the x, y, z position for a panel. Must not be in a flowing layout.
         *
         * Example:
         * position: 3% 20px 0px;
         */
        position,

        /**
         * Sets 2 dimensional rotation degrees that apply to the quad for this panel prior to 3 dimensional transforms. This rotation applies without perspective and leaves the panel centered at the same
         * spot as it started.
         *
         * Example:
         * pre-transform-rotate2d: 45deg;
         */
        preTransformRotate2d,

        /**
         * Sets 2 dimensional X/Y scale factors that apply to the quad for this panel prior to 3 dimensional transforms. This scaling applies without perspective and leaves the panel centered at the same
         * spot as it started. Default of 1.0 means no scaling, 0.5 would be half size.
         *
         * Examples:
         * pre-transform-scale2d: 0.8
         * pre-transform-scale2d: 0.4, 0.6
         */
        preTransformScale2d,

        /**
         * Sets the amount of saturation to apply to the panel and all it's children during composition.  Default of 1.0 means no adjustment, 0.0 means fully desaturated to gray scale, greater than 1.0
         * means over-saturation.
         *
         * Example:
         * saturation: 0.4;
         */
        saturation,

        /**
         * Specifies a sound name to play when this selector is applied.
         *
         * Example:
         * sound: "whoosh_in";
         */
        sound,

        /**
         * Specifies a sound name to play when this selector is removed.
         *
         * Example:
         * sound-out: "whoosh_out";
         */
        soundOut,

        /**
         * Specifies the text alignment for text within this panel, defaults to left.
         *
         * Examples:
         * text-align: left;
         * text-align: right;
         * text-align: center;
         */
        textAlign,

        /**
         * Specifies the decoration for text within this panel, defaults to none. Possible values: none, underline, line-through.
         *
         * Example:
         * text-decoration: underline;
         */
        textDecoration,

        /**
         * Controls truncation of text that doesn't fit in a panel.  "clip" means to simply truncate (on char boundaries), "ellipsis" means to end with '...', and "shrink" means to a
         * We default to ellipsis, which is contrary to the normal CSS spec.
         *
         * Examples:
         * text-overflow: ellipsis;
         * text-overflow: clip;
         * text-overflow: shrink;
         *
         */
        textOverflow,

        /**
         * Specifies text shadows.  The shadow shape will match the text the panel can generate,and this is only meaningful for labels.  Syntax takes horizontal offset pixels, vertical offset pixels,
         * blur radius pixels, strength, and then shadow color.
         *
         * Example:
         * text-shadow: 2px 2px 8px 3.0 #333333b0;
         */
        textShadow,

        /**
         * Specifies the transform for text within this panel, defaults to none. Possible values: none, uppercase, lowercase.
         *
         * Example:
         * text-transform: uppercase;
         */
        textTransform,

        /**
         * Controls texture sampling mode for the panel. Set to alpha-only to use the textures alpha data across all 3 color channels.
         *
         * Examples:
         * texture-sampling: normal;
         * texture-sampling: alpha-only;
         */
        textureSampling,

        /**
         * Specifies where to point the arrow of a tooltip at on this panel. The first value controls how the arrow is positioned horizontally when the tooltip is to the top or bottom of the panel, and
         * the second value controls how the arrow is positioned vertically when the tooltip is to the left or right of the panel. Default is '50% 50%'.
         *
         * Example:
         * tooltip-arrow-position: 25% 50%;
         */
        tooltipArrowPosition,

        /**
         * Specifies where to position the body of a tooltip relative to this panel. The first value controls how the body is aligned horizontally when the tooltip is to the top or bottom of the panel,
         * and the second value controls how the body is aligned vertically when the tooltip is to the left or right of the panel. 0% means left/top aligned, 50% means center/middle aligned, and 100%
         * means right/bottom aligned. Default is '0% 0%'.
         *
         * Example:
         * tooltip-body-position: 50% 100%;
         */
        tooltipBodyPosition,

        /**
         * Specifies where to position a tooltip relative to this panel. Valid options include 'left', 'top', 'right', and 'bottom'. List up to 4 positions to determine the order that positions are tried
         * if the tooltip doesn't fully fit on screen. Default is 'right left bottom top'. If less than 4 positions are specified, the tooltip first tries the opposite of the specified position along the
         * same axis before switching to the other axis.
         *
         * Examples:
         * tooltip-position: bottom;
         * tooltip-position: left bottom;
         */
        tooltipPosition,

        /**
         * Sets the transforms to apply to the panel in 2d or 3d space.  You can combine various transforms (comma separated) and they will be applied in order to create a 4x4 3d transform matrix.
         * The possible operations are: translate3d( x, y, z ), translatex( x ), translatey( y ), translatez( z ), scale3d( x, y, z), rotate3d( x, y, z ), rotatex( x ), rotatey( y ), rotatez( z ).
         *
         * Examples:
         * transform: translate3d( -100px, -100px, 0px );
         * transform: rotateZ( -32deg ) rotateX( 30deg ) translate3d( 125px, 520px, 230px );
         */
        transform,

        /**
         * Sets the transform origin about which transforms will be applied.  Default is 50% 50% on the panel so a rotation/scale is centered.
         *
         * Example:
         * transform-origin: 50% 50%
         */
        transformOrigin,

        /**
         * Specifies which properties should transition smoothly to new values if a class/pseudo class changes the styles.  Also specifies duration, timing function, and delay.
         * Valid timing functions are: ease, ease-in, ease-out, ease-in-out, linear.
         *
         * Example:
         * transition: position 2.0s ease-in-out 0.0s, perspective-origin 1.2s ease-in-out 0.8s;
         */
        transition,

        /**
         * Specifies the delay in seconds to use for transition properties on this panel, if more than one comma delimited value is specified then the values are applied to each property specified in
         * 'transition-property' in order.  If only one value is specified then it applies to all the properties specified in transition-property.
         *
         * Examples:
         * transition-delay: 0.0s;
         * transition-delay: 0.0s, 1.2s;
         */
        transitionDelay,

        /**
         * Specifies the durating in seconds to use for transition properties on this panel, if more than one comma delimited value is specified then the values are applied to each property specified in
         * 'transition-property' in order.  If only one value is specified then it applies to all the properties specified in transition-property.
         *
         * Examples:
         * transition-duration: 2.0s;
         * transition-duration: 2.0s, 1.2s, 1.2s, 4.0s, 2.0s;
         */
        transitionDuration,

        /**
         * Specifies which properties should transition smoothly to new values if a class/pseudo class changes the styles.
         *
         * Examples:
         * transition: position, transform, background-color;
         */
        transitionProperty,

        /**
         * Specifies the timing function to use for transition properties on this panel, if more than one comma delimited value is specified then the values are applied to each property specified in
         * 'transition-property' in order.  If only one value is specified then it applies to all the properties specified in transition-property. Valid timing functions are: ease, ease-in, ease-out,
         * ease-in-out, linear.
         *
         * Examples:
         * transition-timing-function: ease-in-out;
         * transition-timing-function: ease-in-out, linear;
         * transition-timing-function: cubic-bezier( 0.785, 0.385, 0.555, 1.505 );
         */
        transitionTimingFunction,

        /**
         * Specifies a scale to apply to this panel's layout and all descendants. This scale happens at the layout level ratherthan the bitmap level, so things like text will increase their font size
         * rather than just bitmap scaling.
         *
         * Examples:
         * ui-scale: 150%; // 150% scaling for X, Y, and Z.
         * ui-scale: 50% 100% 150%; // 50% scaling for X, 100% for Y. 150% for Z.
         */
        uiScale,

        /**
         * Specifies a scale to apply to this panel's layout and all descendants. This scale happens at the layout level ratherthan the bitmap level, so things like text will increase their font size
         * rather than just bitmap scaling.
         *
         * Examples:
         * ui-scale: 150%; // 150% scaling for X, Y, and Z.
         * ui-scale: 50% 100% 150%; // 50% scaling for X, 100% for Y. 150% for Z.
         */
        uiScaleX,

        /**
         * Specifies a scale to apply to this panel's layout and all descendants. This scale happens at the layout level ratherthan the bitmap level, so things like text will increase their font size
         * rather than just bitmap scaling.
         *
         * Examples:
         * ui-scale: 150%; // 150% scaling for X, Y, and Z.
         * ui-scale: 50% 100% 150%; // 50% scaling for X, 100% for Y. 150% for Z.
         */
        uiScaleY,

        /**
         * Specifies a scale to apply to this panel's layout and all descendants. This scale happens at the layout level ratherthan the bitmap level, so things like text will increase their font size
         * rather than just bitmap scaling.
         *
         * Examples:
         * ui-scale: 150%; // 150% scaling for X, Y, and Z.
         * ui-scale: 50% 100% 150%; // 50% scaling for X, 100% for Y. 150% for Z.
         */
        uiScaleZ,

        verticalAlign,

        /**
         * Controls if the panel is visible and is included in panel layout. Possible values:
         * "visible" - panel is visible and included in layout (default)
         * "collapse" - panel is invisible and not included in layout
         */
        visibility,

        /**
         * Specifies a 'wash' color, which means a color that will be blended over the panel and all it's children at composition time, tinting them.  The alpha value of the color determines the
         * intensity of the tinting.
         *
         * Example:
         * wash-color: #39b0d325;
         */
        washColor,

        /**
         * Controls white-space wrapping on rendered text.  "normal" means wrap on whitespace, "nowrap" means do no wrapping at all.
         *
         * Examples:
         * white-space: normal;
         * white-space: nowrap;
         */
        whiteSpace,

        /**
         * Sets the width for this panel. Possible values:
         * "fit-children" - Panel size is set to the required size of all children (default)
         * <pixels> - Any fixed pixel value (ex: "100px")
         * <percentage> - Percentage of parent width (ex: "100%")
         * "fill-parent-flow( <weight> )" - Fills to remaining parent width. If multiple children are set to this value, weight is used to determine final width. For example, if three children are set
         * to fill-parent-flow of 1.0 and the parent is 300px wide, each child will be 100px wide. (ex: "fill-parent-flow( 1.0 )" )
         * "height-percentage( <percentage> )" - Percentage of the panel's height, which allows you to enforce a particular aspect ratio.  The height cannot also be width-percentage.
         */
        width,

        /**
         * Sets the x, y, z position for a panel. Must not be in a flowing layout.
         *
         * Example:
         * position: 3% 20px 0px;
         */
        x,

        /**
         * Sets the x, y, z position for a panel. Must not be in a flowing layout.
         *
         * Example:
         * position: 3% 20px 0px;
         */
        y,

        /**
         * Sets the x, y, z position for a panel. Must not be in a flowing layout.
         *
         * Example:
         * position: 3% 20px 0px;
         */
        z,

        /**
         * Sets the z-index for a panel, panels will be sorted and painted in order within a parent panel.
         * The sorting first sorts by the z-pos computed from position and transforms, then if panels have matching zpos zindex is used. z-index is different than z-pos in that it doesn't affect rendering perspective, just paint/hit-test ordering.
         * The default z-index value is 0, and any floating point value is accepted.
         *
         * Example:
         * z-index: 1;
         */

        zIndex,
    }
    // 海蓝#70DB93 土灰玫瑰红色 #856363 中石板蓝色 #7F00FF 

    // 巧克力色 #5C3317 长石色 #D19275 中春绿色 #7FFF00 天蓝 #3299CC

    // 蓝紫色 #9F5F9F  中绿松石色 #70DBDB 石板蓝 #007FFF

    // 黄铜色 #B5A642 森林绿 #238E23 中紫红色 #DB7093 艳粉红色 #FF1CAE

    //   中木色 #A68064 春绿色 #00FF7F

    // 棕色#A67D3D 鲜黄色 #DBDB70  钢蓝色 #236B8E

    // 青铜色 #8C7853 灰色 #C0C0C0 海军蓝 #23238E 亮天蓝色 #38B0DE

    // 2号青铜色 #A67D3D 铜绿色 #527F76 霓虹篮 #4D4DFF 棕褐色 #DB9370

    // 士官服蓝色 #5F9F9F 青黄色 #93DB70 霓虹粉红 #FF6EC7 紫红色 #D8BFD8

    // 冷铜色 #D98719 新深藏青色 #00009C 石板蓝色 #ADEAEA

    // 铜色#B87333 印度红 #4E2F2F 新棕褐色 #EBC79E 浓深棕色 #5C4033

    // 珊瑚红 #FF7F00 土黄色 #9F9F5F  淡浅灰色 #CDCDCD

    //  浅蓝色 #C0D9D9 橙色 #FF7F00 紫罗兰色 #4F2F4F

    //  浅灰色 #A8A8A8 橙红色 #FF2400 
    export enum EColor {
        White = "#FFFFFFFF",
        Red = "#ff0000FF",
        Green = "#00ff00FF",
        Blue = "#00ffffFF",
        Purple = "#990099FF",
        Yellow = "#ffff00FF",
        /**金色 */
        Gold = "#CD7F32",
        /**深紫色 */
        color1 = "#871F78",
        /**深兰花色 */
        color2 = "#9932CD",
        /**桔黄色 */
        color3 = "#E47833",
        /**李子色 */
        color4 = "#EAADEA",
        /**深橄榄绿 */
        color5 = "#4F4F2F",
        /**石灰绿色 */
        color6 = "#32CD32",
        /**粉红色 */
        color7 = "#BC8F8F",
        /**深铜绿色 */
        color8 = "#4A766E",
        /**浅木色 */
        color9 = "#E9C2A6",
        /**黄绿色 */
        color10 = "#99CC32",
        /**深绿 */
        color11 = "#2F4F2F",
        /**浅钢蓝色 */
        color12 = "#8F8FBD",
        /**淡紫色 */
        color13 = "#DB70DB",
        /**麦黄色 */
        color14 = "#D8D8BF",
        /**猎人绿 */
        color15 = "#215E21",
        /**深棕 */
        color16 = "#5C4033",
        /**珊瑚红 */
        color17 = "#FF7F00",
        /**暗金黄色 */
        color18 = "#CFB53B",
        /**紫罗兰红色 */
        color19 = "#CC3299",
        /**银色 */
        color20 = "#E6E8FA",
        /**火砖色 */
        color21 = "#D19275",
        /**亮金色 */
        color22 = "#D9D919",
        /**深藏青色 */
        color23 = "#2F2F4F",
        /**赭色 */
        color24 = "#8E6B23",
        /**淡灰色 */
        color25 = "#545454",
        /**半甜巧克力色 */
        color26 = "#6B4226",
        /**中兰花色 */
        color27 = "#9370DB",
        /**暗木色 */
        color28 = "#855E42",
        /**海绿色 */
        color29 = "#238E68",
        /**中鲜黄色 */
        color30 = "#EAEAAE",
        /**深绿松石色 */
        color31 = "#7093DB",
        /**青色 */
        color32 = "#00FFFF",
        /**猩红色 */
        color33 = "#BC1717",
        /**中森林绿 */
        color34 = "#6B8E23",
        /**深棕褐色 */
        color35 = "#97694F",
        /**牡丹红 */
        color36 = "#FF00FF",
        /**鲑鱼色 */
        color37 = "#6F4242",
        /**中蓝色 */
        color38 = "#3232CD",
        /**深铅灰色 */
        color39 = "#2F4F4F",
        /**艳蓝色 */
        color40 = "#5959AB",
        /**中海蓝色 */
        color41 = "#32CD99",
        /**石英色 */
        color43 = "#D9D9F3",
        /**褐红色 */
        color44 = "#8E236B",
    }

    export const EColorList = Object.keys(EColor);

    export enum EColorDes {
        White = "white",
        Red = "red",
        Green = "green",
        Blue = "blue",
        Purple = "purple",
        Yellow = "yellow",
    }

    export function GetRarityColor(rarity: IRarity) {
        switch (rarity) {
            case "D":
                return EColor.White;
            case "C":
                return EColor.Green;
            case "B":
                return EColor.Blue;
            case "A":
                return EColor.Purple;
            case "S":
                return EColor.Gold;
            case "SS":
                return EColor.Red;
            default:
                return EColorDes.White;
        }
    }

    export function IsCssStyle(kk: string) {
        return (VCSSStyle as any)[kk] != null;
    }

    export function IsChineseLanguage() {
        return $.Language() == "schinese"
    }
    export function ClassMaker(...args: (string | number | any | { [k: string]: boolean })[]): string {
        let classes: string[] = [];
        for (let i = 0; i < args.length; i++) {
            let arg = args[i];
            if (!arg) continue;
            let argType = typeof arg;
            if (argType === 'string' || argType === 'number') {
                classes.push(arg as string);
            }
            else if (Array.isArray(arg)) {
                if (arg.length) {
                    let inner = ClassMaker(...arg);
                    if (inner) {
                        classes.push(inner);
                    }
                }
            } else if (argType === 'object') {
                let objargs = arg as { [k: string]: boolean }
                for (let key in objargs) {
                    if (objargs[key]) {
                        classes.push(key);
                    }
                }
            }
        }
        return classes.join(" ");
    };

    export function SavePanelData(panel: Panel, key: string, v: string | number | any): void {
        (panel.Data() as any)[key] = v;
    }
    export function GetPanelData<T>(panel: Panel, key: string): T {
        return (panel.Data() as any)[key] as T;
    }

    export function GetPanelOnlyKey(panel: Panel): string {
        return GetPanelData(panel, "__onlykey__")
    }

    export function getPanelSize(panel: Panel) {
        if (panel == null || !panel.IsValid()) {
            return [0, 0];
        }
        let scalex = panel.actualuiscale_x || 1;
        let scaley = panel.actualuiscale_y || 1;
        if (panel.IsSizeValid()) {
            return [panel.actuallayoutwidth / scalex, panel.actuallayoutheight / scaley];
        }
        let width = panel.style.width, height = panel.style.height;
        if (width == null || height == null) {
            return [500, 200];
        }
        return [Number(width?.replace("px", "")), Number(height?.replace("px", ""))];
    }
    export function setLocalText(node: React.RefObject<LabelPanel>, str: string) {
        if (node.current == null) {
            return;
        }
        node.current.text = $.Localize("#" + str);
    }
    export function setFlowChildren(node: React.RefObject<Panel>, str: "right" | "right-wrap" | "down" | "down-wrap" | "left" | "left-wrap" | "up" | "up-wrap" | "none" = "right-wrap") {
        if (node.current == null) {
            return;
        }
        node.current.style.flowChildren = str;
    }
    export function setVerticalAlign(node: React.RefObject<Panel>, str: "top" | "bottom" | "middle" | "center" = "top") {
        if (node.current == null) {
            return;
        }
        node.current.style.verticalAlign = str;
    }
    export function setHorizontalAlign(node: React.RefObject<Panel>, str: "left" | "right" | "middle" | "center" = "left") {
        if (node.current == null) {
            return;
        }
        node.current.style.horizontalAlign = str;
    }
    export function setAlign(node: React.RefObject<Panel>, str: "left top" | "left center" | "left bottom" | "center top" | "center center" | "center bottom" | "right top" | "right center" | "right bottom") {
        if (node.current == null) {
            return;
        }
        node.current.style.align = str;
    }
    export function setScroll(node: React.RefObject<Panel>, str: "x" | "y" | "both" | "default") {
        if (node.current == null) {
            return;
        }
        let style = ""
        switch (str) {
            case "x":
                style = "scroll squish";
                break;
            case "y":
                style = "squish scroll";
                break;
            case "both":
                style = "scroll scroll";
                break;
            default:
                style = "squish squish";
                break;
        }
        (node.current.style.overflow as any) = style;
    }

    /**
     * 添加边框
     * @param node
     * @param color
     * @returns
     */
    export function addBorderStyle(panel: Panel, color: EColor = EColor.White) {
        if (panel == null || !panel.IsValid()) {
            return;
        }
        panel.style.border = `2px solid ${color}`;
    }
    /**
     *取消边框
     * @param node
     * @returns
     */
    export function removeBorderStyle(panel: Panel) {
        if (panel == null || !panel.IsValid()) {
            return;
        }
        panel.style.border = null;
    }

    export namespace HtmlTxt {
        interface HtmlTxtStyle {
            color?: EColorDes;
            fontSize?: number;
        }
        export function createHtmlTxt(string: string, style: HtmlTxtStyle | null = null) {
            let s = "";
            if (style != null) {
                if (style.color) {
                    s += `color="${style.color}" `;
                }
                if (style.fontSize) {
                    s += `fontSize=${style.fontSize} `;
                }
            }
            return `<font ${s}>${string}</font>`;
        }
    }
}
