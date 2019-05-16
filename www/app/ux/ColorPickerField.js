
Ext.define('Fleet5.ux.ColorPickerField', {
    extend: 'Ext.form.field.Trigger',

    loadCSS: [
        '/Content/Script/App/ux/Ext.ux.form.ColorPickerFieldPlus.css'
    ],

    requires: [
        'Ext.picker.Color',
        'Ext.menu.ColorPicker',
        'Fleet5.ux.ColorPickerCommon',
        'Fleet5.ux.ColorMenu'
    ],

    mixins: {
        common: 'Fleet5.ux.ColorPickerCommon'
    },

    alias: 'widget.colorpickerfield',

    trigger1Cls: 'x-form-color-trigger-1',
    trigger2Cls: 'x-form-color-trigger-2',
    statics: {
        colorMenu1: null,
        colorMenu2: null
    },
    editable: false,
    disabled: false,
    initComponent: function () {

        var statics = this.statics();

        this.hiddenValue = this.value;
        this.value = 'FF0000';

        var config = {};
        var me = this;

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        if (!Ext.isEmpty(this.value)) {
            if (this.value[0] == '#') {
                this.value = this.value.substring(1);
            }
            if (!/^[0-9a-fA-F]{6}$/.test(this.value)) {
                this.value = '';
            }
        }
        this.callParent(arguments);

        Ext.override(Ext.picker.Color, {
            select: function (color, suppressEvent) {
                var me = this,
                    selectedCls = me.selectedCls,
                    value = me.value,
                    el;

                color = color.replace('#', '');
                if (!me.rendered) {
                    me.value = color;
                    return;
                }

                if (color != value || me.allowReselect) {
                    el = me.el;

                    if (me.value) {
                        var selVal = el.down('a.color-' + value);
                        if (!Ext.isEmpty(selVal)) {
                            selVal.removeCls(selectedCls);
                        }
                    }
                    var sel = el.down('a.color-' + color);
                    if (!Ext.isEmpty(sel)) {
                        sel.addCls(selectedCls);
                    }
                    me.value = color;
                    if (suppressEvent !== true) {
                        me.fireEvent('select', me, color);
                    }
                }
            }
        });

        me.on('trigger1click', function (xy) {
            if (Ext.isEmpty(statics.colorMenu1)) {
                statics.colorMenu1 = Ext.create('Ext.menu.ColorPicker', {
                    focusOnToFront: false,
                    value: me.getColorValue(),
                    listeners: {
                        'select': function (picker, color) {
                            statics.colorMenu1.cur_me.setValue(color);
                            statics.colorMenu1.cur_me.fireEvent('selectColor', statics.colorMenu1.cur_me, color);
                            statics.colorMenu1.cur_me.fireEvent('change', statics.colorMenu1.cur_me, color);
                        }
                    }
                });
            }
            statics.colorMenu1.cur_me = me;
            statics.colorMenu1.showAt(xy);
            statics.colorMenu1.alignTo(me, "tl-bl?");
        }, this);

        me.on('trigger2click', function (xy) {
            if (Ext.isEmpty(statics.colorMenu2)) {
                statics.colorMenu2 = Ext.create('Fleet5.ux.ColorMenu', {
                    value: me.getColorValue(),
                    listeners: {
                        'select': function (picker, color) {
                            statics.colorMenu2.cur_me.setValue(color);
                            statics.colorMenu2.cur_me.fireEvent('selectColor', statics.colorMenu2.cur_me, color);
                            statics.colorMenu2.cur_me.fireEvent('change', statics.colorMenu2.cur_me, color);
                        }
                    }
                });
            }
            statics.colorMenu2.cur_me = me;
            statics.colorMenu2.showAt(xy);
            statics.colorMenu2.alignTo(me, "tl-bl?");
            statics.colorMenu2.picker.setColor(me.getColorValue());
        }, this);

    },

    getColorValue: function () {
        var val = this.hiddenValue;
        if (Ext.String.startsWith(val, '#')) {
            return val.substring(1);
        }
        return val;
    },

    getValue: function () {
        var val = this.hiddenValue;
        if (this.withPrefix && !Ext.String.startsWith(val, '#')) {
            return '#' + val;
        }
        return val;
    },

    withPrefix: false,
    setValue: function (color) {
        var me = this;
        me.hiddenValue = color;
        var val = color;
        if (me.withPrefix) {
            if (Ext.String.startsWith(color, '#')) {
                color = color.substring(1);
            } else {
                val = '#' + color;
            }
        }
        me.setRawValue(val);
        if (!Ext.isEmpty(color)) {
            var invert = me.rgbToHex(me.invert(me.hexToRgb(color)));
            var style = 'background-color: #' + color + '; background-image: none;color: #' + invert + ';';
            me.setFieldStyle(style);
        }
    },

    onTrigger1Click: function (event) {
        if (this.disabled) {
            return;
        }
        var xy = this.el.getXY();
        var height = this.el.getHeight();
        xy = [xy[0], xy[1] + height + 1];
        this.fireEvent('trigger1click', xy);
    },

    onTrigger2Click: function (event) {
        if (this.disabled) {
            return;
        }
        var xy = this.el.getXY();
        var height = this.el.getHeight();
        xy = [xy[0], xy[1] + height + 1];
        this.fireEvent('trigger2click', xy);
    }
});