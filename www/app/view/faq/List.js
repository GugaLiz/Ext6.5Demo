Ext.define('app.UserManage.ListGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'faq',
    requires: [
        'ux.SearchField'
    ],
    border: false,
    columnLines: true,
    loadMask: true,

    initComponent: function () {
        var me = this;
        me.buildItems();
        me.callParent();
    },

    buildItems: function () {
        var me = this;

        var store = Ext.create("Ext.data.ArrayStore", {
            pageSize: 25,
            fields: ['Id', 'Account', 'RoleName', 'Company', 'Email',
                'Phone', 'FirstName', 'LastName', 'Disabled',
                'LastLoginIP', 'LastLoginDT', 'IsAdmin', 'RoleId'
            ],
            data: [{
                Id: 12717, Account: "admin", IsAdmin: true, Company: "", Email: "", Phone: "", FirstName: "admin", Disabled: 0,
                LastLoginDT:"/Date(1556676877000)/",RoleId:1,RoleName:'Admin',LastName:'super'}]
        });

        var cols = [{
            xtype: 'rownumberer',
            width: 26
        }, {
            header: '账号',
            dataIndex: 'Account',
            flex: 1,
            align: 'center',
            renderer: function (value, metadata) {
                metadata.tdAttr = 'data-qtip="' + value + '"';
                return value;
            }
        }, {
            header: '用户角色',
            dataIndex: 'RoleName',
            flex: 1,
            align: 'center',
            renderer: function (value, metadata) {
                metadata.tdAttr = 'data-qtip="' + value + '"';
                return value;
            }
        }, {
            header: '工作单位',
            flex: 1,
            align: 'center',
            dataIndex: 'Company'
        }, {
            header: '邮箱',
            flex: 1,
            align: 'center',
            dataIndex: 'Email'
        }, {
            header: '电话',
            flex: 1,
            align: 'center',
            dataIndex: 'Phone'
        }, {
            flex: 1,
            header: '姓',
            dataIndex: 'FirstName',
            align: 'center'
        }, {
            flex: 1,
            header: '名',
            dataIndex: 'LastName',
            align: 'center'
        },{
            header: '最后登录日期',
            width: '160',
            dataIndex: 'LastLoginDT',
            renderer: function (v, meta) {
                //var d = Fleet.util.Date(v);
                //meta.tdAttr = 'data-qtip="' + Fleet.util.DateToString(d) + '"';
                //return Fleet.util.DateToString(d, 'Y-m-d');
            }
        }, {
            header: '启用',
            width: '58',
            align: 'center',
            dataIndex: 'Disabled',
            renderer: function (v) {
                var className = "fdisable";
                if (v === 0) {
                    className = "fenable";
                }
                return '<div class="' + className +
                    '" style="width:20px;height:18px;background-repeat:no-repeat;"></div>';
            }
        },{
            header: '查看',
            align: 'center',
            xtype: 'actioncolumn',
            width: 38,
            items: [{
                //icon: Fleet.Url('/Content/Images/icons/fam/user_edit.png'),
                tooltip: '编辑',
                handler: function (grid, rowIndex, colIndex) {
                    //var sto = grid.getStore();
                    //var rec = sto.getAt(rowIndex);
                    //var id = rec.get('Id');
                    //var win = me._editWin;
                    //if (!win) {
                    //    win = Ext.create('app.view.UserManage.EditWin', {
                    //        _isEdit: true,
                    //        PassStrategy: me.PassStrategy,
                    //        listeners: {
                    //            update_success: function () {
                    //                sto.load();
                    //            }
                    //        }
                    //    });
                    //    me._editWin = win;
                    //}
                    //win._recordId = id;
                    //win.show();
                }
            }]
        }
        ]

        me.columns = {
            items: cols,
            defaults: { sortable: false, menuDisabled: true }
        };

        me.bbar = Ext.create('Ext.PagingToolbar', {
            store: store,
            displayInfo: true
        });

        me.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                text: '添加',
                iconCls: 'x-fa x-fa-add',
                handler: function () {
                    var win = me._addWin;
                    if (!win) {
                        win = Ext.create('Fleet5.UserManage.EditWin', {
                            PassStrategy: me.PassStrategy,
                            listeners: {
                                update_success: function (cmp) {
                                    store.load();
                                    cmp.hide();
                                }
                            }
                        });
                        me._addWin = win;
                    }
                    win.show();
                }
            }, {
                text: '删除',
                iconCls: 'x-fa x-fa-delete',
                handler: function () {

                }
            }, '->', {
                labelWidth: 38,
                fieldLabel: '查询',
                labelAlign: 'right',
                store: store,
                xtype: 'searchfield',
                paramName: 'QueryValue',
                width: 220
            }]


        }]
    }
});