#Fontastic - A Browser Extension to Avoid Font CDNs

Nowadays, it's very common for websites to use fonts provided by CDNs, such as Google Fonts.
This can be used to potentially track users who view sites that call these CDNs.

Sure, you can disable remote fonts, but this can result in breaking the layout of webpages.

This is where Fontastic comes in. Fontastic contains local copies of fonts with free distribution licenses and, when a font is called for from these CDNs, Fontastic blocks the call and replaces it with the local version of the font.

Currently, Fontastic is only effective against calls to the Google Fonts API, but if there's any other CDNs that offer fonts that are freely distributable, I'd be willing to add support for them.
