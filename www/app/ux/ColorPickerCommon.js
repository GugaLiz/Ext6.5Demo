Ext.define('Fleet5.ux.ColorPickerCommon', {

    /**
    * Convert RGB color format to Hexa color format
    * @param {Integer/Array( r, g, b )} r
    * @param {Integer} g (optional)
    * @param {Integer} b (optional)
    * @return {String}
    */
    rgbToHex: function (r, g, b) {
        if (r instanceof Array) { return this.rgbToHex.call(this, r[0], r[1], r[2]); }
        return this.decToHex(r) + this.decToHex(g) + this.decToHex(b);
    },
    /**
    * Convert an integer to hexa
    * @param {Integer} n
    * @return {String}
    */
    decToHex: function (n) {
        var HCHARS = '0123456789ABCDEF';
        n = parseInt(n, 10);
        n = (!isNaN(n)) ? n : 0;
        n = (n > 255 || n < 0) ? 0 : n;
        return HCHARS.charAt((n - n % 16) / 16) + HCHARS.charAt(n % 16);
    },
    /**
    * Return with position of a character in this.HCHARS string
    * @private
    * @param {Char} c
    * @return {Integer}
    */
    getHCharPos: function (c) {
        if (typeof c != 'undefined') {
            var HCHARS = '0123456789ABCDEF';
            return HCHARS.indexOf(c.toUpperCase());
        }
    },
    /**
    * Convert a hexa string to decimal
    * @param {String} hex
    * @return {Integer}
    */
    hexToDec: function (hex) {
        var s = hex.split('');
        return ((this.getHCharPos(s[0]) * 16) + this.getHCharPos(s[1]));
    },
    /**
    * Convert a hexa string to RGB color format
    * @param {String} hex
    * @return {Array}
    */
    hexToRgb: function (hex) {
        return [this.hexToDec(hex.substr(0, 2)), this.hexToDec(hex.substr(2, 2)), this.hexToDec(hex.substr(4, 2))];
    },
    /**
    * Not documented yet
    */
    invert: function (r, g, b) {
        if (r instanceof Array) { return this.invert.call(this, r[0], r[1], r[2]); }
        return [255 - r, 255 - g, 255 - b];
    }

});