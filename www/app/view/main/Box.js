//视图
//主容器
Ext.define('app.view.main.Box', {
    extend: 'Ext.container.Viewport',
    requires: ['Ext.button.Segmented', 'Ext.list.Tree'],
    controller: 'main',
    viewModel: 'main',
    itemId: 'mainView',
    layout: {
        type: 'vbox',
        //子视图铺满容器
        align: 'stretch'
    },
    listeners: {
        //监听页面初始化事件
        render: 'onMainViewRender'
    },
    items: [{
            //顶部导航栏
            xtype: 'toolbar',
            cls: 'sencha-dash-dash-headerbar shadow',
            //高度
            height: 64,
            itemId: 'headerBar',
            hidden: true,
            bind: {
                hidden: '{isHiddenMain}'
            },
            items: [{
                    //左侧文字与图标
                    xtype: 'component',
                    reference: 'senchaLogo',
                    cls: 'sencha-logo',
                    html: '<div class="main-logo"><img src="resources/images/company-logo.png">Fleet Form</div>',
                    //宽度与导航菜单栏宽度相同
                    width: 180
                },
                {
                    //菜单折叠/展开按钮
                    hidden:true,
                    margin: '0 0 0 8',
                    ui: 'header',
                    iconCls: 'x-fa fa-navicon',
                    id: 'main-navigation-btn',
                    handler: 'onToggleNavigationSize'
                },{
                    //横向菜单
                    xtype: 'container',
                    layout: 'hbox',
                    cls:'nav',
                    items: [{
                        xtype: 'button',
                        iconCls: 'x-fa fa-home',
                        ui: 'navBtn',
                        text: '数据管理',
                        scale: 'medium',
                        menu: {
                            plain: true,
                            items: [{
                                iconCls: 'x-fa fa-database',
                                text: '基础数据管理',
                                value: 'basisLevelGrid',
                                viewType: 'basisLevelGrid',
                                pageType: 'basisPanel',
                                leaf: true,
                                handler: 'onNavigationSelectionChange'
                            }, {
                                iconCls: 'x-fa fa-list-alt',
                                text: '测试数据管理',
                                value: 'basisLevelGrid',
                                viewType: 'basisLevelGrid',
                                pageType: 'basisPanel',
                                leaf: true,
                                handler: 'onNavigationSelectionChange'
                            }]
                        }
                    }]
                    },
                '->', {
                    //帮助按钮
                    iconCls: 'x-fa fa-user-plus',
                    ui: 'header',
                    //触发路由
                    href: '#view.faq',
                    //本页打开
                    hrefTarget: '_self',
                    tooltip: '用户管理'
                },
                {
                    //锁定按钮
                    iconCls: 'x-fa fa-th-list',
                    ui: 'header',
                    tooltip: '切换语言',
                    menu: [{
                        text: '简体中文',
                        checked: true,
                        group: 'theme',
                        checkHandler: 'onItemCheck'
                    }, {
                        text: 'English',
                        checked: false,
                        group: 'theme',
                        checkHandler: 'onItemCheck'
                    }, {
                        text: '繁體中文',
                        checked: false,
                        group: 'theme',
                        checkHandler: 'onItemCheck'
                    }],
                    //handler: 'onLock'
                },
                {
                    //退出登录按钮
                    iconCls: 'x-fa fa-sign-out',
                    ui: 'header',
                    tooltip: '退出登录',
                    handler: 'onLoginOut'
                },
                {
                    //相当于一个label
                    xtype: 'tbtext',
                    //动态绑定名称
                    bind: '{userData.fullName}'
                },
                {
                    //图片
                    xtype: 'image',
                    cls: 'header-right-profile-image',
                    height: 35,
                    width: 35,
                    alt: '当前用户图像',
                    //动态绑定头像
                    bind: {
                        src: '{userData.img}'
                    }
                }
            ]
        },
        {
            //下方容器
            xtype: 'container',
            id: 'main-view-detail-wrap',
            reference: 'mainContainerWrap',
            flex: 1,
            hidden: true,
            bind: {
                hidden: '{isHiddenMain}'
            },
            layout: {
                type: 'hbox',
                //是否支持动画效果
                //用于支持菜单栏折叠/展开动画效果
                animate: true,
                animatePolicy: {
                    x: true,
                    width: true
                }
            },
            items: [{
                    //导航菜单模块
                    //导航栏与右侧容器的滚动条相互独立，互不干涉
                    height: '100%',
                    scrollable: 'y',
                    reference: 'navigationContainer',
                    cls: 'navigationContainer',
                    xtype: 'container',
                    width: 250,
                    hidden:true,
                    //container套panle用以支持独立滚动条
                    items: [{
                        xtype: 'treelist',
                        reference: 'navigationTreeList',
                        itemId: 'navigationTreeList',
                        ui: 'nav',
                        //注意第四章的时候这里需要去掉注释
                        //store: 'navigationTree',
                        width: 250,
                        //展开按钮显示在右侧
                        expanderFirst: false,
                        //点击父菜单任何区域都可展开子菜单
                        expanderOnly: false,
                        //只有一个节点能展开
                        singleExpand: true,
                        listeners: {
                            //监听导航菜单选中改变事件
                            selectionchange: 'onNavigationTreeSelectionChange'
                        }
                    }]
                },
                {
                    //内容展示模块
                    xtype: 'container',
                    height: '100%',
                    flex: 1,
                    reference: 'mainCardPanel',
                    itemId: 'contentPanel',
                    //返回页面集合，自定义属性
                    backView: [],
                    layout: {
                        //跑马灯布局
                        type: 'card',
                        //暂时不知道用处
                        anchor: '100%'
                    },
                    //子item默认配置
                    defaults: {
                        padding: 20
                    }
                }
            ]
        }
    ]
});