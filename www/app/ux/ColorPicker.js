
Ext.define('Fleet5.ux.ColorPicker', {
    extend: 'Ext.Component',
    mixins: {
        common: 'Fleet5.ux.ColorPickerCommon'
    },
    loadCSS: [
        '/Content/Script/App/ux/Ext.ux.form.ColorPickerFieldPlus.css'
    ],
    animateMove: false,
    HSV: {
        h: 0,
        s: 0,
        v: 0
    },
    floating: false,
    renderTpl: [
        '<div id="{id}__rgb" class="x-cp-rgbpicker"></div>',
        '<div id="{id}__hue" class="x-cp-huepicker"></div>',
        '<div id="{id}__hueslider" class="x-cp-hueslider"></div>',
        '<div id="{id}__rgbslider" class="x-cp-rgbslider"></div>',
        '<div class="x-cp-formcontainer">',
            '<div id="{id}__fCont"></div>',
            '<div id="{id}__cWebSafe" class="x-cp-colorbox">' + F.C.WebSafeColor + '</div>',
            '<div id="{id}__cInverse" class="x-cp-colorbox">' + F.C.InverseColor + '</div>',
            '<div id="{id}__cColor" class="x-cp-colorbox">' + F.C.PickColor + '</div>',
        '</div><div class="x-cp-clearfloat"></div>'
    ],

    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        //if (me.addEvents) {
        //    me.addEvents('select');
        //}
        if (me.handler) {
            me.on('select', me.handler, me.scope, true);
        }
    },

    afterRender: function () {
        var me = this;
        me.renderData = {};
        me.callParent();

        this.id_rgb = this.cpGetId('rgb');
        this.id_rgbPicker = this.cpGetId('rgbslider');

        // Initialize RGB Picker DD
        var rgb = Ext.get(this.id_rgb);
        this.rgbDD = new Ext.dd.DD(this.id_rgbPicker, 'rgbPicker');
        this.rgbDD.constrainTo(rgb, -7);
        this.rgbDD.onDrag = Ext.bind(me.moveRGBPicker, me);
        Ext.get(this.id_rgbPicker).setXY([rgb.getLeft() - 7, rgb.getTop() - 7]);
        // initialize onclick on the rgb picker
        rgb.on('mousedown', Ext.bind(me.clickRGBPicker, me));

        this.id_hue = this.cpGetId('hue');
        this.id_huePicker = this.cpGetId('hueslider');

        // Initialize HUE Picker DD
        var hue = Ext.get(this.id_hue);
        this.hueDD = new Ext.dd.DD(this.id_huePicker, 'huePicker');
        this.hueDD.constrainTo(hue, { 'top': -7, 'right': -3, 'bottom': -7, 'left': -3 });
        this.hueDD.onDrag = Ext.bind(me.moveHuePicker, me);
        Ext.get(this.id_huePicker).setXY([hue.getLeft() - 3, hue.getTop() - 7]);
        // initialize onclick on the hue picker
        hue.on('mousedown', Ext.bind(me.clickHUEPicker, me));

        // Create color divs and Form elements
        this.containerPanel = Ext.create('Ext.container.Container', {
            renderTo: this.cpGetId('fCont'),
            layout: {
                type: 'table',
                columns: 2
            },
            defaultType: 'numberfield',
            defaults: {
                value: 0,
                minValue: 0,
                width: 50,
                labelAlign: 'right',
                labelWidth: 10,
                size: 3,
                maxValue: 255,
                allowBlank: true,
                hideTrigger: true,
                labelSeparator: ''
            },
            items: [{
                fieldLabel: 'R',
                id: this.cpGetId('iRed')
            }, {
                fieldLabel: 'H',
                maxValue: 360,
                id: this.cpGetId('iHue')
            }, {
                fieldLabel: 'G',
                id: this.cpGetId('iGreen')
            }, {
                fieldLabel: 'S',
                id: this.cpGetId('iSat')
            }, {
                fieldLabel: 'B',
                id: this.cpGetId('iBlue')
            }, {
                fieldLabel: 'V',
                id: this.cpGetId('iVal')
            }, {
                fieldLabel: '#',
                labelWidth: 10,
                id: this.cpGetId('iHexa'),
                allowBlank: true,
                xtype: 'textfield',
                labelAlign: 'right',
                width: 100,
                size: 6,
                labelSeparator: '',
                colspan: 2,
                value: '000000'
            }]
        });

        Ext.get(this.cpGetId('iRed')).on('change', Ext.bind(me.updateFromIRGB, me));
        Ext.get(this.cpGetId('iGreen')).on('change', Ext.bind(me.updateFromIRGB, me));
        Ext.get(this.cpGetId('iBlue')).on('change', Ext.bind(me.updateFromIRGB, me));

        Ext.get(this.cpGetId('iHue')).on('change', Ext.bind(me.updateFromIHSV, me));
        Ext.get(this.cpGetId('iSat')).on('change', Ext.bind(me.updateFromIHSV, me));
        Ext.get(this.cpGetId('iVal')).on('change', Ext.bind(me.updateFromIHSV, me));

        Ext.get(this.cpGetId('iHexa')).on('change', Ext.bind(me.updateFromIHexa, me));

        Ext.get(this.cpGetId('cWebSafe')).on('click', Ext.bind(me.updateFromBox, me));
        Ext.get(this.cpGetId('cInverse')).on('click', Ext.bind(me.updateFromBox, me));
        Ext.get(this.cpGetId('cColor')).on('click', Ext.bind(me.selectColor, me));
    },

    /**
    *
    */
    cpGetId: function (postfix) {
        return this.getId() + '__' + (postfix || 'cp');
    },
    /**
    *
    */
    updateRGBPosition: function (x, y) {
        this.updateMode = 'click';
        x = x < 0 ? 0 : x;
        x = x > 181 ? 181 : x;
        y = y < 0 ? 0 : y;
        y = y > 181 ? 181 : y;
        this.HSV.s = this.getSaturation(x);
        this.HSV.v = this.getValue(y);
        var rgb = Ext.get(this.id_rgb);
        Ext.get(this.id_rgbPicker).setXY([rgb.getLeft() + x - 7, rgb.getTop() + y - 7], false);
        this.updateColor();
    },
    /**
    *
    */
    updateHUEPosition: function (y) {
        this.updateMode = 'click';
        y = y < 1 ? 1 : y;
        y = y > 181 ? 181 : y;
        this.HSV.h = Math.round(360 / 181 * (181 - y));
        var hue = Ext.get(this.id_hue);
        var huePicker = Ext.get(this.id_huePicker);
        huePicker.setXY([huePicker.getLeft(), hue.getTop() + y - 7], false);
        this.updateRGBPicker(this.HSV.h);
        this.updateColor();
    },
    /**
    *
    */
    clickRGBPicker: function (event, element) {
        var xy = event.getXY();
        var rgb = Ext.get(this.id_rgb);
        this.updateRGBPosition(xy[0] - rgb.getLeft(), xy[1] - rgb.getTop());
    },
    /**
    *
    */
    clickHUEPicker: function (event, element) {
        var xy = event.getXY();
        this.updateHUEPosition(xy[1] - Ext.get(this.cpGetId('hue')).getTop());
    },
    /**
    *
    */
    moveRGBPicker: function (event) {
        this.rgbDD.constrainTo(this.id_rgb, -7);
        var rgb = Ext.get(this.id_rgb);
        var rgbPicker = Ext.get(this.id_rgbPicker);
        this.updateRGBPosition(rgbPicker.getLeft() - rgb.getLeft() + 7, rgbPicker.getTop() - rgb.getTop() + 7);
    },
    /**
    *
    */
    updateRGBPicker: function (newValue) {
        this.updateMode = 'click';
        var rgb = Ext.get(this.id_rgb);
        rgb.setStyle({ 'background-color': '#' + this.rgbToHex(this.hsvToRgb(newValue, 1, 1)) });
        this.updateColor();
    },
    /**
    *
    */
    moveHuePicker: function (event) {
        this.hueDD.constrainTo(this.id_hue, { 'top': -7, 'right': -3, 'bottom': -7, 'left': -3 });
        var hue = Ext.get(this.id_hue);
        var huePicker = Ext.get(this.id_huePicker);
        this.updateHUEPosition(huePicker.getTop() - hue.getTop() + 7);
    },
    /**
    *
    */
    updateColor: function () {
        var rgb = this.hsvToRgb(this.HSV.h, this.HSV.s, this.HSV.v);
        var websafe = this.websafe(rgb);
        var invert = this.invert(rgb);
        var wsInvert = this.invert(websafe);

        var iHexa = Ext.getCmp(this.cpGetId('iHexa'));

        var iRed = Ext.getCmp(this.cpGetId('iRed'));
        var iGreen = Ext.getCmp(this.cpGetId('iGreen'));
        var iBlue = Ext.getCmp(this.cpGetId('iBlue'));

        var iHue = Ext.getCmp(this.cpGetId('iHue'));
        var iSat = Ext.getCmp(this.cpGetId('iSat'));
        var iVal = Ext.getCmp(this.cpGetId('iVal'));

        if (this.updateMode !== 'hexa') {
            iHexa.setValue(this.rgbToHex(rgb));
        }
        if (this.updateMode !== 'rgb') {
            iRed.setValue(rgb[0]);
            iGreen.setValue(rgb[1]);
            iBlue.setValue(rgb[2]);
        }
        if (this.updateMode !== 'hsv') {
            iHue.setValue(Math.round(this.HSV.h));
            iSat.setValue(Math.round(this.HSV.s * 100));
            iVal.setValue(Math.round(this.HSV.v * 100));
        }

        var cColor = Ext.get(this.cpGetId('cColor'));
        var cInverse = Ext.get(this.cpGetId('cInverse'));
        var cWebSafe = Ext.get(this.cpGetId('cWebSafe'));

        cColor.setStyle({
            'background': '#' + this.rgbToHex(rgb),
            'color': '#' + this.rgbToHex(invert)
        });
        cColor.title = '#' + this.rgbToHex(rgb);

        cInverse.setStyle({
            'background': '#' + this.rgbToHex(invert),
            'color': '#' + this.rgbToHex(rgb)
        });
        cInverse.title = '#' + this.rgbToHex(invert);

        cWebSafe.setStyle({
            'background': '#' + this.rgbToHex(websafe),
            'color': '#' + this.rgbToHex(wsInvert)
        });
        cWebSafe.title = '#' + this.rgbToHex(websafe);

        var hue = Ext.get(this.id_hue);
        var huePicker = Ext.get(this.id_huePicker);
        huePicker.setXY([huePicker.getLeft(), hue.getTop() + this.getHPos(iHue.getValue()) - 7], false);


        var rgb2 = Ext.get(this.id_rgb);
        var rgbPicker = Ext.get(this.id_rgbPicker);
        rgbPicker.setXY([rgb2.getLeft() + this.getSPos(iSat.getValue() / 100) - 7,
            hue.getTop() + this.getVPos(iVal.getValue() / 100) - 7
        ], false);
        rgb2.setStyle({
            'background-color': '#' +
                this.rgbToHex(this.hsvToRgb(iHue.getValue(), 1, 1))
        });
    },
    /**
    *
    */
    setColor: function (c) {
        if (!/^[0-9a-fA-F]{6}$/.test(c)) return;
        Ext.getCmp(this.cpGetId('iHexa')).setValue(c);
        this.updateFromIHexa();
    },
    /**
    *
    */
    updateFromIRGB: function (input, newValue, oldValue) {
        this.updateMode = 'rgb';
        var temp = this.rgbToHsv(Ext.getCmp(this.cpGetId('iRed')).getValue(), Ext.getCmp(this.cpGetId('iGreen')).getValue(), Ext.getCmp(this.cpGetId('iBlue')).getValue());
        this.HSV = { h: temp[0], s: temp[1], v: temp[2] };
        this.updateColor();
    },
    /**
    *
    */
    updateFromIHSV: function (input, newValue, oldValue) {
        this.updateMode = 'hsv';
        this.HSV = { h: Ext.getCmp(this.cpGetId('iHue')).getValue(), s: Ext.getCmp(this.cpGetId('iSat')).getValue() / 100, v: Ext.getCmp(this.cpGetId('iVal')).getValue() / 100 };
        this.updateColor();
    },
    /**
    *
    */
    updateFromIHexa: function (input, newValue, oldValue) {
        this.updateMode = 'hexa';
        var temp = this.rgbToHsv(this.hexToRgb(Ext.getCmp(this.cpGetId('iHexa')).getValue()));
        this.HSV = { h: temp[0], s: temp[1], v: temp[2] };
        this.updateColor();
    },
    /**
    *
    */
    updateFromBox: function (event, element) {
        this.updateMode = 'click';
        var temp = this.rgbToHsv(this.hexToRgb(Ext.get(element).getColor('backgroundColor', '', '')));
        this.HSV = { h: temp[0], s: temp[1], v: temp[2] };
        this.updateColor();
    },

    selectColor: function (event, element) {
        var color = Ext.get(element).getColor('backgroundColor', '', '').toUpperCase();
        this.fireEvent('select', this, color);
    },
    /**
    * Convert HSV color format to RGB color format
    * @param {Integer/Array( h, s, v )} h
    * @param {Integer} s (optional)
    * @param {Integer} v (optional)
    * @return {Array}
    */
    hsvToRgb: function (h, s, v) {
        if (h instanceof Array) { return this.hsvToRgb.call(this, h[0], h[1], h[2]); }
        var r, g, b, i, f, p, q, t;
        i = Math.floor((h / 60) % 6);
        f = (h / 60) - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        return [this.realToDec(r), this.realToDec(g), this.realToDec(b)];
    },
    /**
    * Convert RGB color format to HSV color format
    * @param {Integer/Array( r, g, b )} r
    * @param {Integer} g (optional)
    * @param {Integer} b (optional)
    * @return {Array}
    */
    rgbToHsv: function (r, g, b) {
        if (r instanceof Array) { return this.rgbToHsv.call(this, r[0], r[1], r[2]); }
        r = r / 255;
        g = g / 255;
        b = b / 255;
        var min, max, delta, h, s, v;
        min = Math.min(Math.min(r, g), b);
        max = Math.max(Math.max(r, g), b);
        delta = max - min;
        switch (max) {
            case min: h = 0; break;
            case r: h = 60 * (g - b) / delta;
                if (g < b) { h += 360; }
                break;
            case g: h = (60 * (b - r) / delta) + 120; break;
            case b: h = (60 * (r - g) / delta) + 240; break;
        }
        s = (max === 0) ? 0 : 1 - (min / max);
        return [Math.round(h), s, max];
    },
    /**
    * Convert a float to decimal
    * @param {Float} n
    * @return {Integer}
    */
    realToDec: function (n) {
        return Math.min(255, Math.round(n * 256));
    },
    /**
    * Convert Y coordinate to HUE value
    * @private
    * @param {Integer} y
    * @return {Integer}
    */
    getHue: function (y) {
        var hue = 360 - Math.round(((181 - y) / 181) * 360);
        return hue === 360 ? 0 : hue;
    },
    /**
    * Convert HUE value to Y coordinate
    * @private
    * @param {Integer} hue
    * @return {Integer}
    */
    getHPos: function (hue) {
        return 181 - hue * (181 / 360);
    },
    /**
    * Convert X coordinate to Saturation value
    * @private
    * @param {Integer} x
    * @return {Integer}
    */
    getSaturation: function (x) {
        return x / 181;
    },
    /**
    * Convert Saturation value to Y coordinate
    * @private
    * @param {Integer} saturation
    * @return {Integer}
    */
    getSPos: function (saturation) {
        return saturation * 181;
    },
    /**
    * Convert Y coordinate to Brightness value
    * @private
    * @param {Integer} y
    * @return {Integer}
    */
    getValue: function (y) {
        return (181 - y) / 181;
    },
    /**
    * Convert Brightness value to Y coordinate
    * @private
    * @param {Integer} value
    * @return {Integer}
    */
    getVPos: function (value) {
        return 181 - (value * 181);
    },
    /**
    * Not documented yet
    */
    checkSafeNumber: function (v) {
        if (!isNaN(v)) {
            v = Math.min(Math.max(0, v), 255);
            var i, next;
            for (i = 0; i < 256; i = i + 51) {
                next = i + 51;
                if (v >= i && v <= next) { return (v - i > 25) ? next : i; }
            }
        }
        return v;
    },
    /**
    * Not documented yet
    */
    websafe: function (r, g, b) {
        if (r instanceof Array) { return this.websafe.call(this, r[0], r[1], r[2]); }
        return [this.checkSafeNumber(r), this.checkSafeNumber(g), this.checkSafeNumber(b)];
    }
});