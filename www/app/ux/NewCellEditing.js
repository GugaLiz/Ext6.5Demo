Ext.define('Fleet5.ux.NewCellEditing', {
    alias: 'plugin.new_cellediting',
    extend: 'Ext.grid.plugin.CellEditing',
    requires: ['Ext.grid.plugin.CellEditing'],
    constructor: function () {
        this.callParent(arguments);
        this.startEdit_Old = this.startEdit;
        this.startEdit = this.startEdit_New;
    },
    startEdit_New: function (record, columnHeader) {
        //need to check columnHeader is empty
        if (Ext.isEmpty(columnHeader)) {
            return false;
        }
        this.startEdit_Old(record, columnHeader);
    }
});