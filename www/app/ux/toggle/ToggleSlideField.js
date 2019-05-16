Ext.define('Fleet5.ux.toggle.ToggleSlideField', {
    extend: 'Ext.form.Field',
    requires: ['Fleet5.ux.toggle.ToggleSlide'],
    alias : 'widget.toggleslidefield',

    /**
     * @cfg {String} type of input field element
     * @private
     */
    inputType: 'hidden',

    /**
     * Initialize the component.
     * @private
     */
    initComponent : function() {
        var cfg = {id: this.id + '-toggle-slide'};
        cfg = Ext.copyTo(cfg, this.initialConfig, [
            'onText',
            'offText', 
            'resizeHandle',
            'resizeContainer',
            'background',
            'onLabelCls',
            'offLabelCls',
            'handleCls',
            'handleCenterCls',
            'handleRightCls',
            'state',
            'booleanMode'
        ]);

        this.toggle = new Fleet5.ux.toggle.ToggleSlide(cfg);
        Fleet5.ux.toggle.ToggleSlideField.superclass.initComponent.call(this);
    },    
    
    /**
     * Render this including the hidden field.
     * @param {Object} ct The container to render to.
     * @param {Object} position The position in the container to render to.
     * @private
     */
    onRender: function(ct, position){
        Fleet5.ux.toggle.ToggleSlideField.superclass.onRender.call(this, ct, position);
        this.toggle.render(this.bodyEl);
        this.setValue(this.toggle.getValue());
    },
 
    /**
     * Initialize any events for this class.
     * @private
     */
    initEvents: function() {
        Fleet5.ux.toggle.ToggleSlideField.superclass.initEvents.call(this);
        this.toggle.on('change', this.onChangeToggle, this);
    },

    /**
     * Utility method to set the value of the field when the toggle changes.
     * @param {Object} toggle The toggleSlide object.
     * @param {Object} v The new value.
     * @private
     */
    onChangeToggle: function(toggle, state) {
        return this.setValue(state);
    },

    /**
     * Enable the toggle when the field is enabled.
     * @private
     */
    onEnable: function(){
        Fleet5.ux.toggle.ToggleSlideField.superclass.onEnable.call(this);
        this.toggle.enable();
    },
    
    /**
     * Disable the toggle when the field is disabled.
     * @private
     */
    onDisable: function(){
        Fleet5.ux.toggle.ToggleSlideField.superclass.onDisable.call(this);
        this.toggle.disable();
    },

    /**
     * Ensure the toggle is destroyed when the field is destroyed.
     * @private
     */
    beforeDestroy: function(){
        Ext.destroy(this.toggle);
        Fleet5.ux.toggle.ToggleSlideField.superclass.beforeDestroy.call(this);
    }
});