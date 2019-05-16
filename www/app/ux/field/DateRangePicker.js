Ext.define('Fleet5.ux.field.DateRangePicker', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.daterangepicker',
    loadCSS: [
        '/Content/Script/App/ux/css/DateRangePicker.css'
    ],
    frame: true,
    layout: 'hbox',
    enableTime: true,
    hideClear: false,

    timeFormat: '',
    timePickersEditable: true,
    timeFieldLabel: F.C.Time,
    timeIncrement: 30,
    timePickersQueryDelay: 500,
    timePickersWidth: 130,
    mainBtnTextPrefix: '',
    mainBtnIconCls: 'date',
    mainBtnTextColor: '#000000',
    confirmBtnText: F.C.OKText,
    dayClearBtnText: F.C.ClearText,
    presetPeriodsBtnText: F.C.PresetPeriods,
    presetPeriodsBtnIconCls: 'drp-icon-calendar',
    presetPeriodsLast7DayText: F.C.PeriodsLast7Day,
    presetPeriodsLast30DayText: F.C.PeriodsLast30Day,
    presetPeriodsThisWeekText: F.C.PeriodsThisWeek,
    presetPeriodsLastWeekText: F.C.PeriodsLastWeek,
    presetPeriodsThisMonthText: F.C.PeriodsThisMonth,
    presetPeriodsLastMonthText: F.C.PeriodsLastMonth,
    presetPeriodsThisYearText: F.C.PeriodsThisYear,

    initComponent: function () {
        var me = this;
        me.items = me.buildItems();
        me.buttons = [{
            xtype: 'button',
            itemId: 'drpPresetPeriodsBtn',
            text: me.presetPeriodsBtnText,
            iconCls: me.presetPeriodsBtnIconCls,
            menu: {
                allowOtherMenus: true,
                items: [{
                    text: me.presetPeriodsLast7DayText,
                    handler: function () {
                        me.setPresetPeriod('last7Day');
                    }
                }, {
                    text: me.presetPeriodsLast30DayText,
                    handler: function () {
                        me.setPresetPeriod('last30Day');
                    }
                }, {
                    text: me.presetPeriodsThisWeekText,
                    handler: function () {
                        me.setPresetPeriod('thisWeek');
                    }
                }, {
                    text: me.presetPeriodsLastWeekText,
                    handler: function () {
                        me.setPresetPeriod('lastWeek');
                    }
                }, {
                    text: me.presetPeriodsThisMonthText,
                    handler: function () {
                        me.setPresetPeriod('thisMonth');
                    }
                }, {
                    text: me.presetPeriodsLastMonthText,
                    handler: function () {
                        me.setPresetPeriod('lastMonth');
                    }
                }, {
                    text: me.presetPeriodsThisYearText,
                    handler: function () {
                        me.setPresetPeriod('thisYear');
                    }
                }]
            }
        }, {
            text: F.C.ClearText,
            hidden: me.hideClear,
            iconCls: 'close',
            handler: function (btn) {
                me.clearValues(true, true);
                me.fireEvent('clear');
            }
        }, {
            text: me.confirmBtnText,
            iconCls: 'drp-icon-yes',
            handler: function (btn) {
                var val = me.getValues();
                me.fireEvent('select_value', val);
            }
        }];
        me.callParent();
    },

    buildItems: function () {
        var me = this;
        var fromText = '';
        var fromValue = me.fromValue;
        var fromTime = Ext.Date.parse('00:00:00', 'H:i:s');
        if (fromValue) {
            fromText = Ext.Date.format(fromValue, 'Y-m-d');
            fromTime = fromValue;
        }

        var toText = '';
        var toValue = me.toValue;
        var toTime = Ext.Date.parse('23:59:59', 'H:i:s');
        if (toValue) {
            toText = Ext.Date.format(toValue, 'Y-m-d');
            toTime = toValue;
        }
        var items = [{
            xtype: 'container',
            itemId: 'conFrom',
            padding: '1',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [{
                xtype: 'datepicker',
                showTime: false,
                itemId: 'dpFrom',
                value: fromValue,
                disableAnim: true,
                listeners: {
                    select: function (p, date) {
                        me.setDateFrom(date);
                    }
                }
            }, {
                style: 'background: #dfe9f6;margin:5px 0 0 0',
                xtype: 'container',
                border: 0,
                layout: {
                    type: 'hbox',
                    pack: 'center',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'textfield',
                    itemId: 'txtFrom',
                    width: 75,
                    vtype: 'date',
                    value: fromText
                }, {
                    xtype: 'timefield',
                    itemId: 'tfFrom',
                    labelAlign: 'right',
                    hideLabel: true,
                    disabled: !me.enableTime,
                    width: 75,
                    labelWidth: 30,
                    increment: me.timeIncrement,
                    format: 'H:i:s',
                    editable: me.timePickersEditable,
                    //width: me.timePickersWidth,
                    value: fromTime,
                    queryDelay: me.timePickersQueryDelay,
                    listeners: {
                        change: function (fld, newVal, oldVal) {
                            if (!fld.isValid()) { fld.setValue(oldVal); }
                        }
                    }
                }, {
                    xtype: 'button',
                    style: 'margin: 0 0 0 3px;',
                    hidden: me.hideClear,
                    iconCls: 'close',
                    handler: function (btn) {
                        me.clearValues(true, false);
                    }
                }]
            }]
        }, {
            xtype: 'container',
            itemId: 'conTo',
            padding: '1',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [{
                xtype: 'datepicker',
                showTime: false,
                disableAnim: true,
                itemId: 'dpTo',
                value: toValue,
                listeners: {
                    select: function (dp, date) {
                        me.setDateTo(date);
                    }
                }
            }, {
                style: 'background: #dfe9f6;margin:5px 0 0 0',
                xtype: 'container',
                border: 0,
                layout: {
                    type: 'hbox',
                    pack: 'center',
                    align: 'stretch'
                },

                items: [{
                    xtype: 'textfield',
                    itemId: 'txtTo',
                    width: 75,
                    vtype: 'date',
                    value: toText
                }, {
                    xtype: 'timefield',
                    itemId: 'tfTo',
                    labelAlign: 'right',
                    hideLabel: true,
                    disabled: !me.enableTime,
                    width: 75,
                    labelWidth: 30,
                    increment: me.timeIncrement,
                    format: 'H:i:s',
                    editable: me.timePickersEditable,
                    value: toTime,
                    queryDelay: me.timePickersQueryDelay,
                    listeners: {
                        change: function (fld, newVal, oldVal) {
                            if (!fld.isValid()) { fld.setValue(oldVal); }
                        }
                    }
                }, {
                    xtype: 'button',
                    style: 'margin: 0 0 0 3px;',
                    iconCls: 'close',
                    hidden: me.hideClear,
                    handler: function (btn) {
                        me.clearValues(false, true);
                    }
                }]
            }]
        }];
        return items;
    },

    setDateRange: function (from, to) {
        var me = this;
        var dpFrom = me.down('[itemId=dpFrom]');
        var dpTo = me.down('[itemId=dpTo]');
        if (from) {
            dpFrom.setValue(from);
            me.setDateFrom(from);
        } else {
            dpFrom.setValue('');
            me.clearValues(true, false);
        }
        if (to) {
            dpTo.setValue(from);
            me.setDateTo(to);
        } else {
            dpTo.setValue('');
            me.clearValues(false, true);
        }
    },

    setDateFrom: function (date) {
        var me = this;
        var v = Ext.Date.format(date, 'Y-m-d');
        var txt = me.down('[itemId=txtFrom]');
        txt.setValue(v);
        var tf = me.down('[itemId=tfFrom]');
        var tfV = tf.getValue();
        if (tfV) {
            tf.setValue(tfV);
        } else {
            tf.setValue(new Date('2017-01-01 00:00:00'));
        }
    },

    setDateTo: function (date) {
        var me = this;
        var v = Ext.Date.format(date, 'Y-m-d');
        var txtTo = me.down('[itemId=txtTo]');
        txtTo.setValue(v);
        var tfTo = me.down('[itemId=tfTo]');
        var tfV = tfTo.getValue();
        if (tfV) {
            tfTo.setValue(tfV);
        } else {
            tfTo.setValue(new Date('2017-01-01 23:59:59'));
        }
    },

    getValues: function () {
        var me = this;
        var fromValue = null;
        var toValue = null;

        var txtFrom = me.down('[itemId=txtFrom]');
        var tfFrom = me.down('[itemId=tfFrom]');
        var txtTo = me.down('[itemId=txtTo]');
        var tfTo = me.down('[itemId=tfTo]');
        if (!txtFrom.isValid() ||
            !tfFrom.isValid() ||
            !txtTo.isValid() ||
            !tfTo.isValid()) {
            return null;
        }

        var from1 = txtFrom.getValue();
        if (from1) {
            var from2 = tfFrom.getValue();
            var fromStr = from1 + " " +
                        Ext.Date.format(from2, 'H:i:s');
            fromValue = Ext.Date.parse(fromStr, 'Y-m-d H:i:s');
        }

        var to1 = txtTo.getValue();
        if (to1) {
            var to2 = tfTo.getValue();
            var toStr = to1 + " " +
                        Ext.Date.format(to2, 'H:i:s');
            toValue = Ext.Date.parse(toStr, 'Y-m-d H:i:s');

        }
        return { fromValue: fromValue, toValue: toValue };
    },

    clearValues: function (from, to) {
        var me = this;
        if (from) {
            var dpFrom = me.down('[itemId=dpFrom]');
            dpFrom.setValue('');
            var tfFrom = me.down('[itemId=tfFrom]');
            tfFrom.setValue('');
            var txtFrom = me.down('[itemId=txtFrom]');
            txtFrom.setValue('');
        }
        if (to) {
            var dpTo = me.down('[itemId=dpTo]');
            dpTo.setValue('');
            var tfTo = me.down('[itemId=tfTo]');
            tfTo.setValue('');
            var txtTo = me.down('[itemId=txtTo]');
            txtTo.setValue('');
        }
    },

    setPresetPeriod: function (period) {
        var me = this;
        var dpFrom = me.down('[itemId=dpFrom]');
        var dpTo = me.down('[itemId=dpTo]');

        var dt1 = Ext.Date.parse(Ext.Date.format(new Date(), 'Y-m-d'), 'Y-m-d');
        switch (period) {
            case 'last7Day':
                dt1 = Ext.Date.add(dt1, Ext.Date.DAY, -7);
                dpFrom.setValue(dt1);
                dpTo.selectToday();
                me.setDateFrom(dt1);
                me.setDateTo(dpTo.getValue());
                break;
            case 'last30Day':
                dt1 = Ext.Date.add(dt1, Ext.Date.DAY, -30);
                dpFrom.setValue(dt1);
                dpTo.selectToday();
                me.setDateFrom(dt1);
                me.setDateTo(dpTo.getValue());
                break;
            case 'thisWeek':
                var diff, dt = new Date(); // Today's date
                diff = (dt.getDay() + 6) % 7; // Number of days to subtract
                var lastMonday = new Date(dt - diff * 24 * 60 * 60 * 1000); // Do the subtraction
                dpFrom.setValue(lastMonday);
                dpTo.selectToday();
                me.setDateFrom(lastMonday);
                me.setDateTo(dpTo.getValue());
                break;

            case 'lastWeek':
                var beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000),
                         day = beforeOneWeek.getDay(),
                         diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1),
                         prevWeekMonday = new Date(beforeOneWeek.setDate(diffToMonday)),
                            prevWeekSunday = Ext.Date.add(prevWeekMonday, Ext.Date.DAY, 6);

                dpFrom.setValue(prevWeekMonday);
                dpTo.setValue(prevWeekSunday);
                me.setDateFrom(prevWeekMonday);
                me.setDateTo(prevWeekSunday);
                break;

            case 'thisMonth':
                var dt2 = new Date();
                dpFrom.setValue(Ext.Date.getFirstDateOfMonth(dt2));
                dpTo.selectToday();
                me.setDateFrom(dpFrom.getValue());
                me.setDateTo(dpTo.getValue());
                break;

            case 'lastMonth':
                var dt3 = new Date();
                Year = dt3.getFullYear();
                Month = dt3.getMonth(); //Month is ZERO-based!!!
                //Ext.Date.parse uses 1-based month numbers, so if we receive 0(January) for the Month, then we must set Month to 12 and decrease Year with 1
                //in order to produce the previous month
                if (Month === 0) { Month = 12; Year = Year - 1; }

                Month = Month < 10 ? '0' + Month : Month;
                var newDate = Ext.Date.parse(Year + '-' + Month + '-01', 'Y-m-d');
                dpFrom.setValue(newDate);
                dpTo.setValue(Ext.Date.getLastDateOfMonth(newDate));
                me.setDateFrom(newDate);
                me.setDateTo(dpTo.getValue());
                break;

            case 'thisYear':
                var dt4 = new Date();
                Year = dt4.getFullYear();
                var newDate4 = Ext.Date.parse(Year + '-01-01', 'Y-m-d');
                dpFrom.setValue(newDate4);
                dpTo.selectToday();
                me.setDateFrom(newDate4);
                me.setDateTo(dpTo.getValue());
                break;

            default:
                return;
        }
    }

});

