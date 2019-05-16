Ext.define('Fleet5.ux.DeleteableCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.xcombo',
    triggerTip: 'Click to delete selection.',
    spObj: '',
    spForm: '',
    spExtraParam: '',
    qtip: 'Deleteable Combo Box',
    trigger1Class: 'x-form-select-trigger',
    trigger2Class: 'x-form-clear-trigger',
    hideTrigger2: function (hide) {
        var id = this.getId();
        var trigger2 = Ext.get("trigger2" + id);
        if (hide) {
            trigger2.hide();
        }
        else {
            trigger2.show();
        }
    },
    onRender: function (ct, position) {
        Fleet5.ux.DeleteableCombo.superclass.onRender.call(this, ct, position);
        var id = this.getId();
        this.triggerConfig = {
            tag: 'div', cls: 'x-form-twin-triggers', style: 'display:block;width:46px;', cn: [
            { tag: "img", style: Ext.isIE ? 'margin-left:-3;height:19px' : '', src: Ext.BLANK_IMAGE_URL, id: "trigger1" + id, name: "trigger1" + id, cls: "x-form-trigger " + this.trigger1Class },
            { tag: "img", style: Ext.isIE ? 'margin-left:-6;height:19px' : '', src: Ext.BLANK_IMAGE_URL, id: "trigger2" + id, name: "trigger2" + id, cls: "x-form-trigger " + this.trigger2Class }
        ]
        };
        this.triggerEl.replaceWith(this.triggerConfig);
        this.triggerEl.on('mouseup', function (e) {

            if (e.target.name == "trigger1" + id) {
                this.onTriggerClick();
            } else if (e.target.name == "trigger2" + id) {
                return this.fireEvent('clickdelete', this, this.getValue());
            }
        },
this);
        var trigger1 = Ext.get("trigger1" + id);
        var trigger2 = Ext.get("trigger2" + id);
        trigger1.addClsOnOver('x-form-trigger-over');
        trigger2.addClsOnOver('x-form-trigger-over');
    }
});
