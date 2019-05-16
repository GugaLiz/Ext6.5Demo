Ext.define('Fleet5.ux.ComboTreeStore', {
    extend: "Ext.data.TreeStore",
    load: function (options) {
        options = options || {};
        options.params = options.params || {};
        var me = this,
                node = options.node || me.tree.getRootNode(),
                root;
        if (!node) {
            node = me.setRootNode({
                expanded: true
            });
        }

        if (me.clearOnLoad) {
            node.removeAll(false);
        }

        Ext.applyIf(options, {
            node: node
        });
        options.params[me.nodeParam] = node ? node.getId() : 'root';


        if (node) {
            node.set('loading', true);
        }


        return me.callParent([options]);
    }
});

Ext.define('Fleet5.ux.ComboTree', {
    extend: "Ext.form.field.ComboBox",
    alias: 'widget.combotree',
    requires: ["Ext.tree.Panel"],
    initComponent: function () {
        var me = this;
        me.myValue = '';
        Ext.apply(me, {
            fieldLabel: me.fieldLabel,
            checkChild: me.checkChild,
            filterLabel: me.filterLabel,
            labelWidth: me.labelWidth,
            rootVisible: me.rootVisible
        });
        if (Ext.getVersion().major >= 5) {
            me.on('render', function (cmp) {
                if (!Ext.isEmpty(me.myValues)) {
                    cmp.setValues(me.myValues);
                }
                if (!Ext.isEmpty(me.myRawValues)) {
                    cmp.setRawValues(me.myRawValues);
                }
            });
        }
        me.callParent();
    },
    listConfig: {
        resizable: true
    },
    getValue: function () {
        var self = this;
        return self.myValue;
    },

    getName: function () {
        var self = this;
        return self.myName;
    },

    clearValues: function () {
        var self = this;
        self.setValue('');
        self.myValue = '';
        if (!Ext.isEmpty(self.picker)) {
            var rView = self.picker.getView();
            rView.node.cascadeBy(function (b) {
                b.set('checked', false);
            });
        }
    },

    getValues: function () {
        var self = this;
        var values = self.getValue();
        if (Ext.isEmpty(values) || typeof (values.split) == "undefined") {
            return values;
        }
        return values.split(',');
    },

    getRawValues: function () {
        var self = this;
        var raws = self.getRawValue();
        if (Ext.isEmpty(raws) || typeof (raws.split) == "undefined") {
            return raws;
        }
        return raws.split(',');
    },

    setValues: function (vals) {
        var me = this;
        me.myValue = vals;
        if (!Ext.isEmpty(me.picker)) {
            var rView = me.picker.getView();
            rView.node.cascadeBy(function (b) {
                if (b.get('id') == vals) {
                    b.set('checked', true);
                } else {
                    b.set('checked', false);
                }
            });
        }
    },

    setRawValues: function (vals) {
        var me = this;
        me.myName = vals;
        me.setRawValue(vals);
    },

    checkNode: function (self, node) {
        if (node.get('checked') !== null) {
            var checked = !node.get('checked');
            var records;
            var names = [], values = [];
            if (self.multiple) {
                node.set('checked', checked);
                records = self.picker.getView().getChecked();
                Ext.Array.each(records, function (rec) {
                    names.push(rec.get('text'));
                    values.push(rec.get('id'));
                });
            } else {
                records = self.picker.getView().getSelectionModel().getSelection()[0];
                Ext.Array.each(self.picker.getView().getChecked(), function (rec) {
                    rec.set('checked', false);
                });
                node.set('checked', checked);
                if (checked) {
                    names.push(node.get('text'));
                    values.push(node.get('id'));
                } else {
                    names = [];
                    values = [];
                }
            }
            self.myValue = values.join(',');
            self.myName = names.join(',');
            var vals = values.join(',');
            var names2 = names.join(',');
            self.setValue(vals); // 显示值
            self.setRawValue(names2); // 隐藏值
            self.fireEvent('change_val', self, vals, names2);
        }
    },
    onTriggerClick: function () {
        var me = this;
        if (!me.readOnly && !me.disabled) {
            if (me.isExpanded) {
                me.collapse();
            } else {
                me.onFocus({});
                if (me.triggerAction === 'all') {
                    me.doQuery(me.allQuery, true);
                } else if (me.triggerAction === 'last') {
                    me.doQuery(me.lastQuery, true);
                } else {
                    me.doQuery(me.getRawValue(), false, true);
                }
                me.expand();
            }
            me.inputEl.focus();
        }
    },

    checkChildNode: function (self, node, checked) {
        if (node.isLeaf()) {
        } else {
            node.expand(true, function () {
                node.eachChild(function (n) {
                    self.checkChildNode(self, n, checked);
                });
            });
        }
        self.checkNode(self, node, checked);
    },
    hiddenSearchPnl: false,
    createPicker: function () {
        var self = this;
        //aaa;
        var actionMethods = { create: "GET", read: "GET", update: "GET", destroy: "GET" };
        if (!Ext.isEmpty(self.actionMethods)) {
            actionMethods = self.actionMethods;
        }
        var store = Ext.create('Fleet5.ux.ComboTreeStore', {
            proxy: {
                type: 'ajax',
                actionMethods: actionMethods,
                url: self.url,
                extraParams: self.extraParams
            },
            listeners: {
                load: function () {
                    if (Ext.isArray(self.myValue)) {
                        self.oldValue = self.myValue;
                    } else {
                        self.oldValue = self.myValue.split(',');
                    }
                    var rawValue = self.getRawValue();
                    if (Ext.isArray(rawValue)) {
                        self.oldText = rawValue;
                    } else {
                        self.oldText = rawValue.split(',');
                    }
                    if (self.oldText[0] === '') {
                        self.oldText = [];
                    }
                    if (self.oldValue[0] === '') {
                        self.oldValue = [];
                    }
                }
            }
        });
        self.picker = new Ext.tree.Panel({
            resizable: true,
            minHeight: 300,
            height: 300,
            autoScroll: true,
            floating: true,
            focusOnToFront: false,
            shadow: true,
            ownerCt: this.ownerCt,
            useArrows: true,
            store: store,
            rootVisible: self.rootVisible,
            listeners: {
                checkchange: function (node, checked) {
                    self.checkNode(self, node, checked);
                },
                itemclick: function (me, node, index) {
                    var checked = !node.get('checked');
                    if (self.checkChild) {
                        self.checkChildNode(self, node, checked);
                    } else {
                        self.checkNode(self, node);
                    }
                    if (self.hideOnItemClick) {
                        self.picker.hide();
                        self.isExpanded = false;
                    }
                }
            },
            tbar: [self.textField = Ext.create('Ext.form.field.Text', {
                fieldLabel: self.filterLabel,
                width: self.width - 60,
                hidden: self.hiddenSearchPnl,
                labelWidth: 40,
                listeners: {
                    scope: this,
                    specialkey: function (text, e) {
                        if (e.getKey() == e.ENTER) {
                            self.reLoad();
                        }
                    }
                }
            }), '->', {
                hidden: self.hiddenSearchPnl,
                xtype: 'button',
                iconCls: 'search',
                handler: function () {
                    self.reLoad();
                }
            }]
        });
        if (Ext.getVersion().major >= 5) {
            store.tree = self.picker;
        }
        return self.picker;
    },
    reLoad: function () {
        var me = this;
        var store = me.getPicker().getStore();
        var extraParams = me.extraParams;
        if (Ext.isEmpty(extraParams)) {
            extraParams = {};
        }
        extraParams.query = me.textField.getValue();
        store.setProxy({
            type: 'ajax',
            url: me.url,
            extraParams: extraParams
        });
        store.load();
    },
    alignPicker: function () {
        var me = this, picker, isAbove, aboveSfx = '-above';
        if (me.isExpanded) {
            picker = me.getPicker();
            if (me.matchFieldWidth) {
                picker.setWidth(me.bodyEl.getWidth());
            }
            if (picker.isFloating()) {
                picker.alignTo(me.inputEl, "", me.pickerOffset); // ""->tl
                isAbove = picker.el.getY() < me.inputEl.getY();
                me.bodyEl[isAbove ? 'addCls' : 'removeCls'](me.openCls +
                        aboveSfx);
                picker.el[isAbove ? 'addCls' : 'removeCls'](picker.baseCls +
                        aboveSfx);
            }
        }
    },
    onTrigger1Click: function () {
        this.myText = '';
        this.myValue = '';
        this.oldValue = [];
        this.oldText = [];
        this.setValue('');
        this.setRawValue('');
        var records = this.getPicker().getView().getChecked();
        Ext.Array.each(records, function (rec) {
            rec.set('checked', false);
        });
    },
    displayField: 'text',
    editable: false,
    queryMode: 'local',
    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    trigger2Cls: Ext.baseCSSPrefix + 'x-form-trigger',
    valueField: 'id'
});