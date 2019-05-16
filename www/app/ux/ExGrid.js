
Ext.define('Fleet5.ux.ExGrid', {
    extend: 'Ext.grid.Panel',
    initComponent: function () {
        this.buildIt();
        this.callParent();
    },

    checkSelect: function () {
        var me = this;
        me.selModel.deselectAll(true);
        if (me.selectIds.length > 0) {
            var arry = [];
            var store = me.getStore();
            store.each(function (record) {
                if (me.selectIds.contains(record.get(me.idProperty))) {
                    arry.push(record);
                }
            });
            me.selModel.select(arry, true, true);
        }
    },

    listeners: {
        afterrender: function (gri, eOpts) {
            var me = gri;
            if (me.multiSelect) {
                if (me.dockedItems) {
                    me.dockedItems.each(function (item) {
                        if (item.xtype == 'pagingtoolbar') {
                            item.on('beforechange', function (paging, page) {
                                me.isPageChanging = true;
                            });

                            item.on('change', function (paging, pageData) {
                                me.isPageChanging = false;
                            });
                            return;
                        }
                    });
                }

                var store = me.getStore();
                store.on('beforeload', function () {
                    me.isLoading = true;
                });
                store.on('load', function () {
                    me.checkSelect();
                });

                me.headerCt.on('headerclick', function (headerCt, column, e, t) {
                    var checkHd = headerCt.child('gridcolumn[isCheckerHd]');
                    var isChecked = checkHd.el.hasCls(Ext.baseCSSPrefix + 'grid-hd-checker-on');
                    if (checkHd) {
                        var store = me.getStore();
                        if (isChecked) {// 全选  
                            store.data.each(function (item) {
                                if (!me.selectIds.contains(item.get(me.idProperty))) {
                                    me.selectIds.add(item.get(me.idProperty));
                                }
                            });
                        } else {// 全不选  
                            store.data.each(function (item) {
                                if (me.selectIds.contains(item.get(me.idProperty))) {
                                    me.selectIds.remove(item.get(me.idProperty));
                                }
                            });
                        }
                    }
                });
            }
        }
    },

    clearIds: function () {
        this.selectIds.clear();
    },

    multiSelect: true,
    idProperty: 'Id',
    buildIt: function () {
        var me = this;
        if (me.multiSelect) {
            me.selectIds = new Ext.util.MixedCollection();
            var deselect = function (gri, record, index, eOpts) {
                if (!this.bulkChange) {
                    var val = record.get(me.idProperty);
                    if (me.selectIds.contains(val)) {
                        me.selectIds.remove(val);
                    }
                }
            };
            var select = function (gri, record, index, eOpts) {
                if (!this.bulkChange) {
                    var val = record.get(me.idProperty);
                    if (!me.selectIds.contains(val)) {
                        me.selectIds.add(val);
                    }
                }
            };
            var checkboxModel = Ext.create('Ext.selection.CheckboxModel', {
                mode: 'SIMPLE',
                listeners: {
                    'select': select,
                    'deselect': deselect
                }
            });
            me.selModel = checkboxModel;
        }
    }
});