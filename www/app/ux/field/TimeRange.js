Ext.define('Fleet5.ux.field.TimeRange', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.timerangefield',
    loadCSS: [
        '/Content/Script/App/ux/css/DateRangePicker.css'
    ],
    alternateClassName: [
        'Ext.form.TimeRangeField',
        'Ext.form.TimeRange'
    ],
    triggerCls: 'daterange-trigger',
    initComponent: function () {
        var me = this;
        me.on('render', function (cmp) {
            me.displayValues();
        });
        me.firstFromValue = me.fromValue;
        me.firstToValue = me.toValue;
        me.firstIsValidEndTime = me.isValidEndTime;
        var defultToValue = me.firstToValue ? Ext.Date.parse(me.firstToValue, 'H:i:s') : Ext.Date.parse('23:59:59', 'H:i:s');
        var endTimeCmp = {
            xtype: 'timefield',
            itemId: 'tfTo',
            labelAlign: 'right',
            hideLabel: true,
            allowBlank: false,
            width: 75,
            labelWidth: 30,
            increment: me.timeIncrement,
            //vtype: 'timerangeC',
            //minTimeField: 'tfFrom',
            format: 'H:i:s',
            editable: true,
            value: defultToValue,
            queryDelay: me.timePickersQueryDelay,
            listeners: {
                change: function (fld, newVal, oldVal) {
                }
            }
        };
        //Determine whether to set the check
        if (me.firstIsValidEndTime) {
            //need check
            endTimeCmp.vtype = 'timerangeC';
            endTimeCmp.minTimeField = 'tfFrom';
            me.vtype = 'timerange';//Verify that the user input time matches the back is greater than the front
        }
        me.endTimeCmp = endTimeCmp;
        me.callParent();
    },
    isValidEndTime: true,//The time after checking for must be less than the previous time
    fromValue: null, //00:00:00
    toValue: null, //00:00:00
    timePickOffset_X: null,
    timePickOffset_Y: null,
    // vtype: 'timerange',

    reset: function () {
        var me = this;
        me.fromValue = me.firstFromValue;
        me.toValue = me.firstToValue;
        me.isValidEndTime = me.firstIsValidEndTime;
        me.displayValues();
    },

    getValue: function () {
        var me = this;
        //Determine whether to check the fields entered by the user
        if (me.isValidEndTime) {
            if (me.isValid()) {
                return { fromValue: me.fromValue, toValue: me.toValue };
            }
            return { fromValue: null, toValue: null };
        } else {
            return { fromValue: me.fromValue, toValue: me.toValue };
        }
    },

    clearValue: function () {
        var me = this;
        me.setDateRange(null, null);
    },

    setDateRange: function (fromValue, toValue) {
        var me = this;
        var update1 = false;
        var update2 = false;
        if (typeof fromValue != 'undefined') {
            me.fromValue = fromValue;
            update1 = true;
        }
        if (typeof toValue != 'undefined') {
            me.toValue = toValue;
            update2 = true;
        }
        me.displayValues();
        if (update1) {
            var tfFrom = me.menu.down('[itemId=tfFrom]');
            tfFrom.setValue(Ext.Date.parse(me.fromValue, 'H:i:s'));
        }
        if (update2) {
            var tfTo = me.menu.down('[itemId=tfTo]');
            tfTo.setValue(Ext.Date.parse(me.toValue, 'H:i:s'));
        }
    },
    timeIncrement: 30,
    timePickersQueryDelay: 500,

    onTriggerClick: function (e) {
        var me = this;
        var fromTime = Ext.Date.parse('00:00:00', 'H:i:s');
        var defaultFromTime = me.firstFromValue ? Ext.Date.parse(me.firstFromValue, 'H:i:s') : fromTime;
        if (!me.menu) {
            var picker = Ext.create('Ext.panel.Panel', {
                frame: true,
                layout: {
                    type: 'hbox',
                    pack: 'center',
                    align: 'stretch'
                },
                width: 220,
                items: [{
                    style: 'background: #dfe9f6;margin:5px 0 0 0',
                    xtype: 'container',
                    flex: 1,
                    border: 0,
                    layout: {
                        type: 'hbox',
                        pack: 'center',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'timefield',
                        itemId: 'tfFrom',
                        labelAlign: 'right',
                        hideLabel: true,
                        allowBlank: false,
                        width: 75,
                        labelWidth: 30,
                        increment: me.timeIncrement,
                        format: 'H:i:s',
                        editable: true,
                        value: defaultFromTime,
                        queryDelay: me.timePickersQueryDelay,
                        listeners: {
                            change: function (fld, newVal, oldVal) {
                                //if (!fld.isValid()) { fld.setValue(oldVal); }
                            }
                        }
                    }, {
                        xtype: 'button',
                        style: 'margin: 0 0 0 3px;',
                        iconCls: 'close',
                        handler: function (btn) {
                            var tfFrom = me.menu.down('[itemId=tfFrom]');
                            tfFrom.setValue(null);
                        }
                    }]
                }, {
                    style: 'background: #dfe9f6;margin:5px 0 0 0',
                    xtype: 'container',
                    flex: 1,
                    border: 0,
                    layout: {
                        type: 'hbox',
                        pack: 'center',
                        align: 'stretch'
                    },
                    items: [me.endTimeCmp, {
                        xtype: 'button',
                        style: 'margin: 0 0 0 3px;',
                        iconCls: 'close',
                        handler: function (btn) {
                            var tfTo = me.menu.down('[itemId=tfTo]');
                            tfTo.setValue(null);
                        }
                    }]
                }],
                buttons: [{
                    text: F.C.ClearText,
                    iconCls: 'close',
                    handler: function (btn) {
                        me.setDateRange(null, null);
                        me.menu.hide();
                    }
                }, {
                    text: F.C.OKText,
                    iconCls: 'drp-icon-yes',
                    handler: function (btn) {
                        var tfFrom = me.menu.down('[itemId=tfFrom]');
                        var tfTo = me.menu.down('[itemId=tfTo]');
                        if (tfFrom.isValid() && tfTo.isValid()) {
                            var val1 = Ext.Date.format(tfFrom.getValue(), 'H:i:s');
                            var val2 = Ext.Date.format(tfTo.getValue(), 'H:i:s');
                            var old = me.getValue();
                            me.setDateRange(val1, val2);
                            var newV = me.getValue();
                            me.fireEvent('value_change', me, old, newV);
                            me.menu.hide();
                        }
                    }
                }]
            });
            me._picker = picker;
            me.menu = new Ext.menu.Menu({
                plain: true,
                minHeight: 70,
                // defaultAlign:'br-l?',
                items: [picker]
            });
        }
        var xy = e.getXY();
        var x = me.timePickOffset_X;
        var y = me.timePickOffset_Y;
        if (x && y) {
            //use components configured Offset
            var newxy = [xy[0] + x, xy[1] + y];
            me.menu.showAt(newxy);
        } else {
            //let newxy = [xy[0] + 50, xy[1] + 20];
            me.menu.showAt(xy);
            me.menu.alignTo(me, "tl-bl?");
        }
    },

    displayValues: function () {
        var me = this;
        var fromValue = Ext.Date.parse(me.fromValue, 'H:i:s');
        if (!Ext.isDate(fromValue)) {
            me.fromValue = null;
            fromValue = null;
        }
        var toValue = Ext.Date.parse(me.toValue, 'H:i:s');
        if (!Ext.isDate(toValue)) {
            me.toValue = null;
            toValue = null;
        }
        var val = '';
        var format = 'H:i:s';
        if (fromValue && toValue) {
            val = Ext.Date.format(fromValue, format) + '~' +
                Ext.Date.format(toValue, format);
        } else if (fromValue) {
            val = Ext.Date.format(fromValue, format) + '~';
        } else if (toValue) {
            val = '~' + Ext.Date.format(toValue, format);
        }
        me.setValue(val);
    }

});

