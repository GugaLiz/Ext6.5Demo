Ext.define('Fleet5.ux.field.DateRange', {
    extend: 'Ext.form.field.Trigger',
    requires: [
		'Fleet5.ux.field.DateRangePicker'
    ],
    alias: 'widget.daterangefield',
    loadCSS: [
        '/Content/Script/App/ux/css/DateRangePicker.css'
    ],
    alternateClassName: [
        'Ext.form.DateRangeField',
        'Ext.form.DateRange'
    ],
    triggerCls: 'daterange-trigger',
    initComponent: function () {
        var me = this;
        me.on('render', function (cmp) {
            me.displayValues();
        });
        me.on('change', function (cmp, val) {
            if (cmp.isValid()) {
                me.setDateRangeVal(val);
            }
        });
        if (me.enableTime) {
            me.vtype = 'daterange2';
        } else {
            me.vtype = 'daterange3';
        }
        if (me.defaultRange) {
            var period = me.defaultRange;
            var todayF = Ext.Date.format(new Date(), 'Y-m-d');
            var today = Ext.Date.parse(todayF, 'Y-m-d');
            var todayHour = Ext.Date.parse(Ext.Date.format(new Date(), 'Y-m-d H:00:00'),
                'Y-m-d H:i:s');
            var todayTo = Ext.Date.parse(todayF + " 23:59:59", 'Y-m-d H:i:s');

            var dayFrom = today;
            var dayTo = Ext.Date.parse(todayF + " 23:59:59", 'Y-m-d H:i:s');

            switch (period) {
                case 'last1Hour':
                    dayFrom = Ext.Date.add(todayHour, Ext.Date.HOUR, -1);
                    break;
                case 'today':
                    dayFrom = Ext.Date.add(today, Ext.Date.DAY, 0);
                    break;
                case 'last7Day':
                    dayFrom = Ext.Date.add(today, Ext.Date.DAY, -7);
                    break;
                case 'last30Day':
                    dayFrom = Ext.Date.add(today, Ext.Date.DAY, -30);
                    break;
                case 'thisWeek':
                    var diff, dt = new Date(); // Today's date
                    diff = (dt.getDay() + 6) % 7; // Number of days to subtract
                    dayFrom = new Date(dt - diff * 24 * 60 * 60 * 1000); // Do the subtraction
                    break;

                case 'lastWeek':
                    var beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000),
                             day = beforeOneWeek.getDay(),
                             diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1),
                             prevWeekMonday = new Date(beforeOneWeek.setDate(diffToMonday)),
                                prevWeekSunday = Ext.Date.add(prevWeekMonday, Ext.Date.DAY, 6);
                    dayFrom = prevWeekMonday;
                    dayTo = prevWeekSunday;
                    break;

                case 'thisMonth':
                    var dt2 = new Date();
                    dayFrom = Ext.Date.getFirstDateOfMonth(dt2);
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
                    dayFrom = newDate;
                    dayTo = Ext.Date.getLastDateOfMonth(newDate);
                    break;

                case 'thisYear':
                    var dt4 = new Date();
                    Year = dt4.getFullYear();
                    var newDate4 = Ext.Date.parse(Year + '-01-01', 'Y-m-d');
                    dayFrom = newDate4;
                    break;

                default:
                    return;
            }
            me.fromValue = dayFrom;
            me.firstFromValue = dayFrom;
            me.firstToValue = null;
            if (me.initToValue) {
                me.toValue = dayTo;
                me.firstToValue = dayTo;
            }
        } else {
            if (Ext.isDate(me.fromValue)) {
                me.firstFromValue = me.fromValue;
            }
            if (Ext.isDate(me.toValue)) {
                me.firstToValue = me.toValue;
            }
        }
        me.callParent();
    },
    enableTime: true,
    hideClear: false,

    fromValue: null,
    toValue: null,
    initToValue: false,

    vtype: 'daterange2',

    getValueRange: function () {
        var me = this;
        if (me.isValid()) {
            var format = 'Y-m-d H:i:s';
            var val = { fromValue: me.fromValue, toValue: me.toValue };
            if (val.fromValue) {
                val.from = Ext.Date.format(val.fromValue, format);
            }
            if (val.toValue) {
                val.to = Ext.Date.format(val.toValue, format);
            }
            return val;
        }
        return {
            from: '',
            fromValue: null,
            to: '',
            toValue: null
        };
    },

    clearValue: function(){
        var me = this;
        me.setDateRange(false, false);
    },

    reset: function () {
        var me = this;
        me.fromValue = me.firstFromValue;
        me.toValue = me.firstToValue;
        me.displayValues();
        if (me._picker) {
            var picker = me._picker;
            picker.setDateRange(me.fromValue, me.toValue);
        }
    },

    setDateRangeVal: function (val) {
        var me = this;
        var enableTime = me.enableTime;
        var format = 'Y-m-d';
        if (enableTime) {
            format = 'Y-m-d H:i:s';
        }
        var vals = val.split('~');
        if (vals[0]) {
            me.fromValue = Ext.Date.parse(vals[0].trim(), format);
        }
        if (vals[1]) {
            me.toValue = Ext.Date.parse(vals[1].trim(), format);
        }
        if (me._picker) {
            var picker = me._picker;
            picker.setDateRange(me.fromValue, me.toValue);
        }
    },

    setDateRange: function (fromValue, toValue) {
        var me = this;
        var update = false;
        if (fromValue && Ext.isDate(fromValue)) {
            me.fromValue = fromValue;
            update = true;
        } else if (Ext.isBoolean(fromValue) && !fromValue) {
            me.fromValue = null;
            update = true;
        }
        if (toValue && Ext.isDate(toValue)) {
            me.toValue = toValue;
            update = true;
        } else if (Ext.isBoolean(toValue) && !toValue) {
            me.toValue = null;
            update = true;
        }
        if (update) {
            me.displayValues();
            if (me._picker) {
                var picker = me._picker;
                picker.setDateRange(me.fromValue, me.toValue);
            }
        }
    },

    onTriggerClick: function (e) {
        var me = this;
        if (!me.menu) {
            var picker = Ext.create('Fleet5.ux.field.DateRangePicker', {
                fromValue: me.fromValue,
                toValue: me.toValue,
                hideClear: me.hideClear,
                enableTime: me.enableTime,
                listeners: {
                    select_value: function (v) {
                        if (v) {
                            me.fromValue = v.fromValue;
                            me.toValue = v.toValue;
                            me.displayValues();
                            me.fireEvent('select_value', me, v);
                            me.menu.hide();
                        }
                    },
                    clear: function () {
                        me.fromValue = null;
                        me.toValue = null;
                        me.displayValues();
                        var v = {
                            from: '',
                            fromValue: null,
                            to: '',
                            toValue: null
                        };
                        me.fireEvent('select_value', me, v);
                        me.menu.hide();
                    }
                }
            });
            me._picker = picker;
            me.menu = new Ext.menu.Menu({
                plain: true,
                minHeight: 270,
                items: [picker]
            });
        }
        var xy = e.getXY();
        var newxy = [xy[0] + 65, xy[1] + 65];
        //console.info(xy, newxy);
        me.menu.showAt(xy);
        me.menu.alignTo(me, "tl-bl?");
        //me.menu.alignTo(me, "tl-bl?", [me.labelWidth + 5, 0]);
    },

    displayValues: function () {
        var me = this;
        var enableTime = me.enableTime;
        var fromValue = me.fromValue;
        var toValue = me.toValue;
        var val = '';
        var format = 'Y-m-d';
        if (enableTime) {
            format = 'Y-m-d H:i:s';
        }
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

