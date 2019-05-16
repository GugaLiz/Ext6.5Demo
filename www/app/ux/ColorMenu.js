
Ext.define('Fleet5.ux.ColorMenu', {
    extend: 'Ext.menu.Menu',
    requires: ['Fleet5.ux.ColorPicker'],
    enableScrolling: false,
    hideOnClick: true,
    floating: true,
    initComponent: function () {
	
    var config = {},
        me = this;

    Ext.apply(this, Ext.apply(this.initialConfig, config));

		//alert(config);
        this.picker = new Fleet5.ux.ColorPicker({ style: 'width:350px;' });
        this.items = this.picker;
        this.callParent();
        this.relayEvents(this.picker, ['select']);
        this.on('select', this.menuHide, this);
        if (this.handler) {
            this.on('select', this.handler, this.scope || this);
        }
    },

    menuHide: function () {
        if (this.hideOnClick) {
            this.hide();
        }
    }
});