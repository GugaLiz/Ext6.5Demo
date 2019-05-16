Ext.define('Fleet5.ux.DateTimeField', {
    extend: 'Ext.form.FieldContainer',
    mixins: {
        field: 'Ext.form.field.Field'
    },
    alias: 'widget.datetimefield',
    layout: 'fit',
    timePosition: 'right', // valid values:'below', 'right'
    dateCfg: {},
    timeCfg: {},
    allowBlank: true,


    initComponent: function () {
        var me = this;
        me.buildField();
        me.callParent();
        this.dateField = this.down('datefield');
        this.timeField = this.down('timefield');
        me.initField();
    },


    //@private
    buildField: function () {
        var l;
        var d = {};
        if (this.timePosition == 'below') {
            l = { type: 'anchor' };
            d = { anchor: '100%' };
        } else
            l = {
                type: 'table',
                columns: 2
            };
        this.items = {
            xtype: 'container',
            layout: l,
            defaults: d,
            items: [Ext.apply({
                xtype: 'datefield',
                format: 'Y-m-d',
                margin: this.timePosition != 'below' ? '2 0 0 0' : 0,
                width: this.timePosition != 'below' ? 90 : undefined,
                allowBlank: this.allowBlank,
                listeners: {
                    specialkey: this.onSpecialKey,
                    scope: this
                },
                isFormField: false // prevent submission
            }, this.dateCfg), Ext.apply({
                xtype: 'timefield',
                format: 'H:i',
                margin: this.timePosition != 'below' ? '2 0 0 0' : 0,
                width: this.timePosition != 'below' ? 60 : undefined,
                allowBlank: this.allowBlank,
                value: '23:59',
                listeners: {
                    specialkey: this.onSpecialKey,
                    scope: this
                },
                isFormField: false // prevent submission
            }, this.timeCfg)]
        };
    },


    focus: function () {
        this.callParent();
        this.dateField.focus(false, 100);
    },


    // Handle tab events
    onSpecialKey: function (cmp, e) {
        var key = e.getKey();
        if (key === e.TAB) {
            if (cmp == this.dateField) {
                // fire event in container if we are getting out of focus from datefield
                if (e.shiftKey) {
                    this.fireEvent('specialkey', this, e);
                }
            }
            if (cmp == this.timeField) {
                if (!e.shiftKey) {
                    this.fireEvent('specialkey', this, e);
                }
            }
        } else if (this.inEditor) {
            this.fireEvent('specialkey', this, e);
        }
    },


    getValue: function () {
        var value, date = this.dateField.getSubmitValue(), time = this.timeField.getSubmitValue();
        if (date) {
            if (time) {
                var format = this.getFormat();
                value = Ext.Date.parse(date + ' ' + time, format);
            } else {
                value = this.dateField.getValue();
            }
        }
        return value;
    },


    setValue: function (value) {
        if (Ext.isEmpty(value)) { this.reset(); }
        this.dateField.setValue(value);
        this.timeField.setValue(value);
    },


    getSubmitData: function () {
        var value = this.getValue();
        var format = this.getFormat();
        return value ? Ext.Date.format(value, format) : null;
    },


    getFormat: function () {
        return (this.dateField.submitFormat || this.dateField.format) + " " + (this.timeField.submitFormat || this.timeField.format);
    },


    getErrors: function () {
        return this.dateField.getErrors().concat(this.timeField.getErrors());
    },


    validate: function () {
        if (this.disabled)
            return true;
        else {
            var isDateValid = this.dateField.validate();
            var isTimeValid = this.timeField.validate();
            return isDateValid && isTimeValid;
        }
    },


    reset: function () {
        this.mixins.field.reset();
        this.dateField.reset();
        this.timeField.reset();
    }


});