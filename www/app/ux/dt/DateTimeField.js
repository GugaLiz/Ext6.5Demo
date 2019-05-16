Ext.define('Fleet5.ux.dt.DateTimeField', {
    extend: 'Ext.form.field.Date',
    alias: 'widget.datetimefield',
    requires: ['Fleet5.ux.dt.DateTimePicker'],
    initComponent: function () {
        var me = this;
        me.on('blur', function (cmp, newVal) {
            if (me.picker) {
                return me.picker.setValue(this.value);
            }
        });
        me.callParent();
    },
    // overwrite
    createPicker: function () {
        var me = this,
			  format = Ext.String.format;

        return Ext.create('Fleet5.ux.dt.DateTimePicker', {
            ownerCt: me.ownerCt,
            renderTo: document.body,
            floating: true,
            hidden: true,
            focusOnShow: true,
            isStartDay: me.isStartDay,
            isEndDay: me.isEndDay,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            format: me.format,
            showToday: false,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            listeners: {
                scope: me,
                select: me.onSelect,
                clearValue: me.clearValue
            },
            keyNavConfig: {
                esc: function () {
                    me.collapse();
                }
            }
        });
    },
    clearValue: function () {
        var me = this;
        me.setValue(null);
        me.collapse();
    },
    getValue: function () {
        var me = this;
        if (this.inputEl && this.inputEl.dom.value === "") {
            return null;
        }
        if (me.picker) {
            return me.picker.getValue();
        } else {
            return this.value || null;
        }
    }
});