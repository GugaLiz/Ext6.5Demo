
Ext.define('app.ux.GridSelectAll', {
    extend: 'Ext.grid.feature.Feature',
    alias: 'feature.selectall',

    constructor: function () {
        this.groupCache = {};
        this.callParent(arguments);
    },

    init: function (grid) {
        var me = this,
            view = me.view;
        view.on({
            afterrender: me.afterViewRender,
            scope: me,
            single: true
        });
    },

    afterViewRender: function () {
        var me = this,
            grid = me.grid,
            view = me.view;
        var page = grid.down('pagingtoolbar');
        if (page) {
            grid.SetSelectAllOff = function () {
                var btn = grid.down('[itemId=btn_all]');
                btn.toggle(false);
                grid.IsSelectAll = false;
                var sm = grid.getSelectionModel();
                if (grid.IsSelectAll) {
                    sm.selectAll();
                } else {
                    sm.deselectAll();
                }
            };
            page.add(['->', {
                text: F.C.SelectAll,
                itemId: 'btn_all',
                tooltip: F.C.SelectAll + ' Off',
                enableToggle: true,
                handler: function (btn, state) {
                    grid.IsSelectAll = (grid.IsSelectAll !== true);
                    var text = F.C.SelectAll + ': ' + (grid.selectAll ? 'On' : 'Off');
                    var sm = grid.getSelectionModel();
                    if (grid.IsSelectAll) {
                        sm.selectAll();
                    } else {
                        sm.deselectAll();
                    }
                    btn.setTooltip(text);
                }
            }]);
        }
    }
});