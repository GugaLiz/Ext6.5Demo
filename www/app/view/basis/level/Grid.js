//视图
//员工级别
Ext.define('app.view.basis.level.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'basisLevelGrid',
    requires: ['ux.IFrame'],
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
        //var autoTaskScheduleTypes = Ext.JSON.decode(document.getElementById('hidScheduleTypes').value);
        var autoTaskScheduleTypes = [];
        autoTaskScheduleTypes = [{ Name: '全部', Value: '-1' }].concat(autoTaskScheduleTypes);

        var taskSchedulesStore = Ext.create('Ext.data.Store', {
            fields: ['Name', 'Value'],
            data: autoTaskScheduleTypes,
            proxy: { type: 'memory' }
        });

        me.selModel = Ext.create('Ext.selection.CheckboxModel', { mode: 'SIMPLE' });

        var mockData = [{
            AbnormalCh: "GPS丢失: 测试里程 <= 100m & 测试里程 <= 100m;",
            AbnormalEn: "File Exceptions(Distance): TotalDistance <= 100m & TotalDistance <= 100m;",
            Begindt: "/Date(1557000000000)/", BuildingID: 0, BuildingName: null,
            CreateDT: "/Date(1557015854000)/", Creator: "rcul2019", DataType: 0,
            DecodeFileCount: 1, DeviceGUID: "{35006456-1601-4600-0756-293000002019}",
            DeviceID: 25, DeviceName: "rcul2019", DeviceType: 9,
            Enddt: "/Date(1557003600000)/",
            FileName: "rcu x  i3 12路_未知_未知--0000201920190504200000p10(+0800).dcf",
            FilePort: null, FileSize: "44.53  MB ", GroupName: "RCU项目组", GroupType: 0,
            HaveOtherFile: false, ID: 14107,IsAbnormal: 1, LegalSeq: null, PointName: null,
            Status: 4, Tag: '{"Protocol":"Dingli","FileType":"DCF","SourceDataType":"DT"}',
            Tag1: "", Tag2: null,Tag3: null,TestPointID: null,ValidateResult: 0}];
        var len = 30;
        for(var i = 0;i<len;i++){
            var idData = {
                AbnormalCh: "GPS丢失: 测试里程 <= 100m & 测试里程 <= 100m;",
                AbnormalEn: "File Exceptions(Distance): TotalDistance <= 100m & TotalDistance <= 100m;",
                Begindt: "/Date(1557000000000)/", BuildingID: 0, BuildingName: null,
                CreateDT: "/Date(1557015854000)/", Creator: "rcul2019", DataType: 0,
                DecodeFileCount: 1, DeviceGUID: "{35006456-1601-4600-0756-293000002019}",
                DeviceID: 25, DeviceName: "rcul2019", DeviceType: 9,
                Enddt: "/Date(1557003600000)/",
                FileName: "rcu x  i3 12路_未知_未知--0000201920190504200000p10(+0800).dcf",
                FilePort: null, FileSize: "44.53  MB ", GroupName: "RCU项目组", GroupType: 0,
                HaveOtherFile: false, ID: i,IsAbnormal: i%2 , LegalSeq: null, PointName: null,
                Status: 4, Tag: '{"Protocol":"Dingli","FileType":"DCF","SourceDataType":"DT"}',
                Tag1: "", Tag2: null,Tag3: null,TestPointID: null,ValidateResult: 0};
            mockData.push(idData);
        }
        var store = Ext.create('Ext.data.Store', {
            pageSize: 25,
            fields: ["ID", "GroupType", "FileName",
                'DeviceName', "DeviceID",
                'BuildingName', "BuildingID",
                'PointName', "TestPointID", 'DecodeFileCount',
                "Tag", "FileSize", "FilePort",
                "Begindt", "Enddt", "Status", "GroupName", "DeviceType", "DataType",
                "Creator", "CreateDT", "ValidateResult", "LegalSeq", "HaveOtherFile",
                "IsAbnormal", "AbnormalCh", "AbnormalEn", "Tag1", "Tag2", "Tag3"],
            data:mockData
            /*autoLoad: true,
            proxy: {
                type: 'ajax',
                url: Fleet.Url('/Report/ListAutoReport/'),
                actionMethods: { create: "POST", read: "POST", update: "POST", destroy: "POST" },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    idProperty: 'Id',
                    totalProperty: 'totalCount'
                }
            },
            listeners: {
                beforeload: function (sto) {
                    var search = me._Search;
                    search = search || {};
                    var txtCreator = me.down('[itemId=txtCreator2]');
                    search.User = txtCreator.getValue();
                    if (search.ScheduleType == -1) {
                        delete search.ScheduleType;
                    }
                    store.getProxy().extraParams.Search = Ext.JSON.encode(search);
                }
            }*/

        });
        me.store = store;
        me.columns = {
            items: [{
                xtype: 'rownumberer',
                width: 26
            }, {
                header: '组',
                dataIndex: 'GroupName',
                sortable: false,
                enableColumnMove: false,
                width: 80
            }, {
                header: '文件名称',
                dataIndex:  'FileName',
                width: 130,
                renderer: function (value, metadata) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            }, {
                header: '文件大小',
                draggable: false,
                sortable: true,
                dataIndex: 'FileSize',
                aling: 'center',
                width: 100
            }, {
                header: '测试类型',
                dataIndex: 'DataType',
                draggable: false,
                sortable: false,
                width: 70,
                align: 'center',
                renderer: function (v, p, r) {
                    if (v == null) {
                        return '-';
                    } else {
                        return v;
                    }
                }

            }, {
                header: '设备类型',
                dataIndex: 'DeviceType',
                sortable: false,
                width: 80,
                align: 'center',
                renderer: function (v, p, r) {
                    if (v == null) {
                        return '-';
                    } else {
                        return v;
                    }
                }
            },{
                header: '上传时间',
                sortable: true,
                dataIndex: 'CreateDT',
                width: 140,
                align: 'center',
                renderer: function (v) {
                   // return Fleet.util.DateToString(v);
                }
            }, {
                header: '状态',
                dataIndex: 'Status',
                align: 'center',
                sortable: true,
                width: 60,
                renderer: function (value, p, record) {
                    // return '<font color="' + F.DMG.StatusColor[value] + '">' +
                    //     F.DMG.Status[value] +
                    //     '</font>';
                }
            },  {
                header:  '校验',
                dataIndex: 'IsAbnormal',
                align: 'center',
                sortable: true,
                width: 80,
                renderer: function (value, p, record) {
                    if (value == 0) {
                        //通过
                        return '<font color="green">' + "通过" + '</font>';
                       // return '<font color="green">' + F.DMG.ValidationStatus[1] + '</font>';
                    }
                    else if (value == 1) {
                        //未通过
                        return '<a href="#" style="text-decoration:none;"><font id="btnValidation" color="red">' + '不通过' + '</font></a>';
                        //p.attr = 'ext:qtitle=""' + ' ext:qtip="' + ((F.Language == 'en') ? record.data.AbnormalEn : record.data.AbnormalCh) + '"';
                        //return '<a href="#" style="text-decoration:none;"><font id="btnValidation" color="red">' + F.DMG.ValidationStatus[2] + '</font></a>';
                    }
                    else {
                        return '<a href="#" style="text-decoration:none;"><font id="btnValidation" color="black">' + '未校验' + '</font></a>';
                        //return '<a href="#" style="text-decoration:none;"><font id="btnValidation" color="black">' + F.DMG.ValidationStatus[0] + '</font></a>';
                    }
                }
            },
                {
                    header: '操作',
                    xtype: 'actioncolumn',
                    flex:1,
                    items: [{
                        iconCls: 'x-fa fa-sticky-note',
                        tooltip: '解码信息',
                        handler: function (grid, rowIndex, colIndex) {

                        }
                    },{
                        iconCls: 'x-fa fa-download',
                        tooltip: '下载文件',
                        handler: function (grid, rowIndex, colIndex) {

                        }
                    },{
                        iconCls: 'x-fa fa-caret-square-o-right',
                        tooltip: '回放',
                        handler: function (grid, rowIndex, colIndex) {

                        }
                    },{
                        iconCls: 'x-fa fa-file-archive-o',
                        tooltip: '重解码',
                        handler: function (grid, rowIndex, colIndex) {

                        }
                    }]
                }
            ],
            defaults: { sortable: false, menuDisabled: true }
        };

        me.bbar = Ext.create('Ext.PagingToolbar', {
            store: store,
            displayInfo: true
        });

        
        var labelWidth = 30;
        //var before = now.add(Date.DAY, -7);
        //var beforeDate = new Date(before.getFullYear(), before.getMonth(), before.getDate());
        //var endDate = Date.parseDate(now.format('Y-m-d 23:59:59'), 'Y-m-d H:i:s');
        /*var mytbar = Ext.create('Ext.toolbar.Toolbar', {
            itemId: 'myTbar2',
            style: 'padding: 3px;',
            items: [{
                labelWidth: labelWidth,
                store: new Ext.data.ArrayStore({
                    fields: ['value', 'text'],
                    data:[[0,'DT',],[1,'Indoor'],[2,'CQT']]
                }),
                xtype: 'combo',
                mode: 'local',
                displayField: 'text',
                valueField: 'value',
                triggerAction: 'all',
                fieldLabel: '测试类型'
            },
                { labelWidth: labelWidth,
                    store: new Ext.data.ArrayStore({
                        fields: ['value', 'text'],
                        data:[[0,'RCU'],[1,'ATU'],[2,'Walktour']]
                    }),
                    xtype: 'combo',
                mode: 'local',
                displayField: 'text',
                valueField: 'value',
                triggerAction: 'all',
                fieldLabel: '设备类型'
            },  {
                    labelWidth: labelWidth,
                fieldLabel: '设备',
                xtype: 'combo',
                store: new Ext.data.ArrayStore({
                    fields: ['value', 'text'],
                    data: [

                    ]
                }),
                //forceAll: true,
                labelWidth: labelWidth,
                displayField: 'text',
                valueField: 'value',
                mode: 'local',
                triggerAction: 'all',
                listeners: {

                },
            },{
                    labelWidth: labelWidth,
                    fieldLabel: '状态',
                    xtype: 'combo',
                    store: new Ext.data.ArrayStore({
                        fields: ['value', 'text'],
                        data: [
                            ['0', '失败'],
                            ['1', '等待'],
                            ['2', '解码中'],
                            //['3', F.DMG.Status[3]],
                            ['4', '完成']
                            //['5', F.DMG.Status[5]]
                        ]
                    }),
                    displayField: 'text',
                    valueField: 'value',
                    mode: 'local',
                    triggerAction: 'all'
            }, {
                labelWidth: labelWidth,
                xtype: 'textfield',
                //vtype: 'commonChar',
                fieldLabel: '属性',
                enableKeyEvents: true,
                listeners: {
                    //"keyup": removeComma
                }
            }, {
                labelWidth: labelWidth,
                xtype: 'textfield',
                //vtype: 'commonChar',
                fieldLabel: '关键字',
            }, /*{
                xtype: "doubledatefield",
                fieldLabel: '上传时间',
                beginDT: beforeDate,
                endDT: endDate,
                showTime: true,
            }, {
                labelWidth: labelWidth,
                xtype: "doubledatefield",
                fieldLabel: '测试时间',
                showTime: true,
            }, {
                labelWidth: labelWidth,
                xtype: 'combo',
                store: new Ext.data.ArrayStore({
                    fields: ['value', 'text'],
                    data: [[1, '未校验'], [2, '有效'], [3, '无效']]
                }),
                mode: 'local',
                displayField: 'text',
                valueField: 'value',
                triggerAction: 'all',
                fieldLabel: '校验'
            }, '->', {
                xtype: 'button',
                iconCls: 'search',
                text:'查询',
                handler: function () {
                    mytbar.doSearch();
                }
            }, {
                xtype: 'button',
                iconCls: 'clear',
                text: '清空',
                handler: function () {
                    mytbar.clearSearch();
                    delete me._Search;
                    mytbar.doSearch(true);
                }
            }],
            doSearch: function (first) {
                /*var search = me._Search;
                search = search || {};
                search.Name = mytbar.getComponent('txtKeyWord2').getValue();
                search.ScheduleType = mytbar.getComponent('ScheduleType').getValue();
                me._Search = search;
                if (first) {
                    store.load();
                } else {
                    store.load();
                }
            },
            clearSearch: function () {
                mytbar.getComponent('txtKeyWord2').setValue('');
                mytbar.getComponent('txtCreator2').setValue('');
                mytbar.getComponent('ScheduleType').setValue('-1');
            }
        });*/

        var tbar = me.getTbar();
        var mytbar = Ext.create('Ext.toolbar.Toolbar', {
            style: 'padding:5px',
            layout: 'fit',
            dock: 'top',
            items: [tbar]
        });
        me.dockedItems = [mytbar, {
            dock: 'top',
            xtype: 'toolbar',
            items: [ {
                text: '删除',
                iconCls: 'x-fa fa-minus-square-o',
                handler: function () {
                    /*var url = Fleet.Url("/Report/Task?id=0&auto=1&t="+(new Date()).getTime());
                    var win = me._addWin;
                    if (!win) {
                        win = Ext.create('Ext.window.Window', {
                            title: F.SR.AddReportAuto,
                            height: 500,
                            modal: true,
                            maximized: false,
                            maximizable: true,
                            width: 900,
                            layout: 'fit',
                            closeAction: 'hide',
                            items: Ext.create('Fleet5.ux.IFrame', {
                                src: url
                            })
                        });
                        window._add_win_close = function () {
                            win.hide();
                            store.load();
                        };
                        me._addWin = win;
                    } else {
                        var frame = win.down('uxiframe');
                        frame.el.dom.childNodes[0].src = url;
                        //frame.reload();
                        win.show();
                        return;
                    }
                    win.show();*/
                }
            }, {
                text: '删除所有',
                iconCls: 'x-fa fa-trash-o',
                handler: function () {
                    /*var sm = me.getSelectionModel();
                    var items = sm.selected.items;
                    if (Ext.isEmpty(items) || items.length === 0) {
                        return;
                    }
                    var itemIds = [];
                    Ext.each(items, function (item) {
                        itemIds.push(item.data.Id);
                    });
                    var selectedIds = itemIds.join();
                    Ext.Msg.show({
                        title: F.C.BtnDelete,
                        buttons: Ext.MessageBox.OKCANCEL,
                        msg: F.C.DeleteRecordConfirm,
                        icon: Ext.Msg.QUESTION,
                        fn: function (buttonId, text, opt) {
                            if (buttonId == 'ok') {
                                Ext.getBody().mask(F.C.Loading);
                                Ext.Ajax.request({
                                    url: Fleet.Url('/Report/DeleteAutoReport'),
                                    params: { Ids: selectedIds },
                                    success: function (response, opts) {
                                        var result = Ext.JSON.decode(response.responseText);
                                        if (Fleet.util.Bool(result.success)) {
                                            store.load();
                                        } else {
                                            Fleet.showError(result.msg);
                                        }
                                        Ext.getBody().unmask();
                                    },
                                    failure: function (action, sended) {
                                        Ext.getBody().unmask();
                                        Fleet.ajax.Failure(action, F.C.LoadFail);
                                    }
                                });
                            }
                        }
                    });*/
                }
            }]
        }];
    },

    getTbar: function () {
        var me = this;
        var labelWidth = 60;
        var items1 = [{
            labelWidth: labelWidth,
            store: new Ext.data.ArrayStore({
                fields: ['value', 'text'],
                data: [[0, 'DT', ], [1, 'Indoor'], [2, 'CQT']]
            }),
            xtype: 'combo',
            mode: 'local',
            displayField: 'text',
            valueField: 'value',
            triggerAction: 'all',
            margin: 3,
            fieldLabel: '测试类型'
        },
                {
                    labelWidth: labelWidth,
                    margin: 3,
                    width: 110,
                    store: new Ext.data.ArrayStore({
                        fields: ['value', 'text'],
                        data: [[0, 'RCU'], [1, 'ATU'], [2, 'Walktour']]
                    }),
                    xtype: 'combo',
                    mode: 'local',
                    displayField: 'text',
                    valueField: 'value',
                    triggerAction: 'all',
                    fieldLabel: '设备类型'
                }, {
                    labelWidth: labelWidth,
                    margin: 3,
                    width: 110,
                    fieldLabel: '设备',
                    xtype: 'combo',
                    store: new Ext.data.ArrayStore({
                        fields: ['value', 'text'],
                        data: [

                        ]
                    }),
                    //forceAll: true,
                    labelWidth: labelWidth,
                    margin: 3,
                    width: 110,
                    displayField: 'text',
                    valueField: 'value',
                    mode: 'local',
                    triggerAction: 'all',
                    listeners: {

                    },
                }, {
                    labelWidth: labelWidth,
                    margin: 3,
                    width: 110,
                    fieldLabel: '状态',
                    xtype: 'combo',
                    store: new Ext.data.ArrayStore({
                        fields: ['value', 'text'],
                        data: [
                            ['0', '失败'],
                            ['1', '等待'],
                            ['2', '解码中'],
                            //['3', F.DMG.Status[3]],
                            ['4', '完成']
                            //['5', F.DMG.Status[5]]
                        ]
                    }),
                    displayField: 'text',
                    valueField: 'value',
                    mode: 'local',
                    triggerAction: 'all'
                }, {
                    labelWidth: labelWidth,
                    margin: 3,
                    width: 110,
                    xtype: 'textfield',
                    //vtype: 'commonChar',
                    fieldLabel: '属性'
                }, {
                    labelWidth: labelWidth,
                    margin: 3,
                    width: 110,
                    xtype: 'textfield',
                    //vtype: 'commonChar',
                    fieldLabel: '关键字',
                }, {
                    labelWidth: labelWidth,
                    margin: 3,
                    width: 110,
                    xtype: "datefield",
                    fieldLabel: '上传时间',
                    //beginDT: beforeDate,
                    //endDT: endDate,
                    showTime: true,
                }, {
                    labelWidth: labelWidth,
                    margin: 3,
                    width: 110,
                xtype: "datefield",
                fieldLabel: '测试时间',
                showTime: true,
            },{
                labelWidth: labelWidth,
                margin: 3,
                width: 110,
                xtype: 'combo',
                store: new Ext.data.ArrayStore({
                    fields: ['value', 'text'],
                    data: [[1, '未校验'], [2, '有效'], [3, '无效']]
                }),
                mode: 'local',
                displayField: 'text',
                valueField: 'value',
                triggerAction: 'all',
                fieldLabel: '校验'
            }];
        var pnlSearch = Ext.create('Ext.form.Panel', {
            layout: {
                type: 'column',
                align: 'top',
            },
            border: true,
            baseCls: 'x-plain',
            columnWidth: 1,
            defaults: {
                labelAlign: 'right',
                columnWidth: 0.2,
            },
            
            items: items1
        });

        var pnlButton = Ext.create('Ext.form.Panel', {
            columnWidth: 1,
            border: true,
            baseCls: 'x-plain',
            layout: 'column',
            autoHeight: true,
            items: [{
                baseCls: 'x-plain',
                border: false,
                columnWidth: 0.5,
                items: [{
                    width:  80,
                    text: '查询',
                    xtype: 'button',
                    name: 'btnSearch',
                    style: 'margin-top:3px',
                    iconCls: 'x-fa fa-search',
                    handler: function () {
                        
                    }
                },{
                    width: 80,
                    text: '清空',
                    xtype: 'button',
                    iconCls: 'x-fa fa-eraser',
                    name: 'btnClear',
                    style: 'margin-top: 3px;',
                    handler: function () {

                    }
            }]
            }]
        });
        var tbar = Ext.create('Ext.form.Panel', {
            columnWidth: 1,
            border: false,
            baseCls: 'x-plain',
            layout: 'column',
            defaults: {
                columnWidth: 1,
                baseCls: 'x-plain'
            },
            items: [{
                style: 'margin-left:1px',
                columnWidth: 0.8,
                items: [pnlSearch]
            }, {
                columnWidth: 0.2,
                style: 'margin-left:3px',
                items: [pnlButton]
            }],
            listeners: {
                afterrender: function (cmp) {

                }
            }
        });

        return tbar;
    },

    createTbar: function () {
        var labelWidth = 30;
        var items1 = [{
            labelWidth: labelWidth,
            store: new Ext.data.ArrayStore({
                fields: ['value', 'text'],
                data: [[0, 'DT', ], [1, 'Indoor'], [2, 'CQT']]
            }),
            xtype: 'combo',
            mode: 'local',
            displayField: 'text',
            valueField: 'value',
            triggerAction: 'all',
            fieldLabel: '测试类型'
        },
                {
                    labelWidth: labelWidth,
                    store: new Ext.data.ArrayStore({
                        fields: ['value', 'text'],
                        data: [[0, 'RCU'], [1, 'ATU'], [2, 'Walktour']]
                    }),
                    xtype: 'combo',
                    mode: 'local',
                    displayField: 'text',
                    valueField: 'value',
                    triggerAction: 'all',
                    fieldLabel: '设备类型'
                }, {
                    labelWidth: labelWidth,
                    fieldLabel: '设备',
                    xtype: 'combo',
                    store: new Ext.data.ArrayStore({
                        fields: ['value', 'text'],
                        data: [

                        ]
                    }),
                    //forceAll: true,
                    labelWidth: labelWidth,
                    displayField: 'text',
                    valueField: 'value',
                    mode: 'local',
                    triggerAction: 'all',
                    listeners: {

                    },
                }, {
                    labelWidth: labelWidth,
                    fieldLabel: '状态',
                    xtype: 'combo',
                    store: new Ext.data.ArrayStore({
                        fields: ['value', 'text'],
                        data: [
                            ['0', '失败'],
                            ['1', '等待'],
                            ['2', '解码中'],
                            //['3', F.DMG.Status[3]],
                            ['4', '完成']
                            //['5', F.DMG.Status[5]]
                        ]
                    }),
                    displayField: 'text',
                    valueField: 'value',
                    mode: 'local',
                    triggerAction: 'all'
                }, {
                    labelWidth: labelWidth,
                    xtype: 'textfield',
                    //vtype: 'commonChar',
                    fieldLabel: '属性',
                    enableKeyEvents: true,
                    listeners: {
                        //"keyup": removeComma
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'search',
                    text: '查询',
                    handler: function () {
                        //tbar.doSearch();
                    }
                }];
        var items2 = [{
            labelWidth: labelWidth,
            xtype: 'textfield',
            //vtype: 'commonChar',
            fieldLabel: '关键字',
        }, /*{
                xtype: "doubledatefield",
                fieldLabel: '上传时间',
                beginDT: beforeDate,
                endDT: endDate,
                showTime: true,
            }, {
                labelWidth: labelWidth,
                xtype: "doubledatefield",
                fieldLabel: '测试时间',
                showTime: true,
            },*/ {
                labelWidth: labelWidth,
                xtype: 'combo',
                store: new Ext.data.ArrayStore({
                    fields: ['value', 'text'],
                    data: [[1, '未校验'], [2, '有效'], [3, '无效']]
                }),
                mode: 'local',
                displayField: 'text',
                valueField: 'value',
                triggerAction: 'all',
                fieldLabel: '校验'
            }, {
                xtype: 'button',
                iconCls: 'clear',
                text: '清空',
                handler: function () {
                    tbar.clearSearch();
                    tbar.doSearch();
                }
            }];
        var container1 = {
            xtype: 'container',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            defaults: {
                labelAlign: 'right'
            },
            style: 'padding:0 0 3px 0;',
            items: items1
        };

        var container2 = {
            xtype: 'container',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            defaults: {
                labelAlign: 'right'
            },
            style: 'padding:0 0 3px 0;',
            items: items2
        };
        var tbar = {
            xtype: 'container',
            layout: 'anchor',
            border: 0,
            defaultType: 'toolbar',
            itemId: 'TbSearch',
            items: {
                layout: 'fit',
                style: 'border:0px;padding:3px 0 3px 0;',
                items: [container1, container2],
            },
            doSearch: function () {
                //me.down('grid').getStore().loadPage(1);
            },
            clearSearch: function () {
                //var txtName = me.down('[itemId=txtName]');
                //txtName.setValue('');
                //var txtUser = me.down('[itemId=txtUser]');
                //if (txtUser) {
                //    txtUser.setValue(userName);
                //}
                //me.down('[itemId=dfStart]').setValue('');
                //me.down('[itemId=dfEnd]').setValue('');
                //me.down('[itemId=combReportClass]').setValue('');
                //me.down('[itemId=combReportTypeClass]').setValue('');
                //me.down('[itemId=combReportStatuClass]').setValue('');
            }
        };
        return tbar;
    }
});



/*Ext.define('app.view.basis.level.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'basisLevelGrid',
    controller: 'basisLevel',
    //引入扩展
    requires: ['ux.button.Search'],
    viewModel: {
        type: 'basisLevel'
    },
    selModel: {
        selType: 'checkboxmodel',
        //单选
        mode: 'SINGLE'
    },
    bind: '{basisLevelStore}',
    reference: 'basisLevelGrid',
    //title: '员工级别',
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        defaults: {
            xtype: 'button',
            disabled: true,
            ui: 'soft-blue'
        },
        items: [{
            text: '新增',
            handler: 'onAddClick',
            bind: {
                disabled: '{!categoryTree.selection}'
            }
        },
        {
            text: '删除',
            handler: 'onDeleteClick',
            bind: {
                disabled: '{!basisLevelGrid.selection}'
            }
        },
        {
            text: '设置待遇',
            handler: 'onPlayClick',
            bind: {
                disabled: '{!basisLevelGrid.selection}'
            }
        },
        '->', {
            xtype: 'buttonSearch',
            text: '筛选',
            //浮动位置
            pickerAlign: 'tr-b',
            //浮动偏移量
            pickerOffset: [35, 5],
            listeners: {
                okclick: 'onGridSearchByBtn'
            },
            //弹窗配置
            pickerConfig: {
                fieldDefaults: {
                    labelWidth: 40
                }
            },
            //筛选项
            //和form表单中items配置一样
            pickerItems: [{
                //隐藏域
                xtype: 'hidden',
                name: 'categoryId',
                //左侧树形菜单选中项的id
                bind: '{categoryTree.selection.id}'
            }, {
                fieldLabel: '编码',
                xtype: 'textfield',
                allowBlank: false,
                name: 'coding'
            },
            {
                fieldLabel: '名称',
                xtype: 'textfield',
                name: 'type'
            }],
            disabled: true,
            bind: {
                disabled: '{!categoryTree.selection}'
            }
        }]
    }],
    columns: [{
        dataIndex: 'coding',
        text: '编码',
        width: 120
    },
    {
        xtype: 'uxColumn',
        flex: 1,
        dataIndex: 'type',
        text: '名称',
        listeners: {
            linkclick: 'onEditClick'
        }
    }]
});*/