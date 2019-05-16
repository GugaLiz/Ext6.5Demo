Ext.define('Fleet5.ux.RadioModel', {
    extend: 'Ext.selection.CheckboxModel',
    alias: 'widget.radiomodel',
    loadCSS: [
        '/Content/Script/App/ux/RadioHeader.css'
    ],
    mode: 'SINGLE',
    checkerOnCls: Ext.baseCSSPrefix + 'grid-hd-checker-on',
    cls: 'x-grid-checkheader-editor',
    renderer: function (value, metaData, rec, rowIndex, colIndex, store, view) {
        var show = true;
        if (this.hideIt) {
            show = !this.hideIt(rec);
        }
        if (show) {
            metaData.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';
            if (this.selectionMode == 'SINGLE') {
                return '<div class="' + Ext.baseCSSPrefix + 'grid-row-radio-checker">&#160;</div>';
            } else {
                return '<div class="' + Ext.baseCSSPrefix + 'grid-row-checker">&#160;</div>';
            }
        }
    }
});

