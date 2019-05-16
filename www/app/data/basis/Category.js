//模拟数据源
//员工类别
Ext.define('app.data.basis.Category', {
    extend: 'app.data.Simulated',
    data: {
        data: [{
            //标题
            text: '湖北省',
            id: 1,
            remark:'天大地大除了老板我最大！',
            //leaf: true
            data: [{
                text: 'NB扫频csv',
                leaf: true,
                remark: '',
                id: 2
            },{
                text: '优化数据',
                leaf: true,
                remark: '',
                id: 3
            },{
                text: '室内单验数据',

                remark: '',
                id: 4,
                data:[{
                    text: '室分562173',
                    leaf: true,
                    remark: '',
                    id: 5,
                },{
                    text: '室分单验291789',
                    leaf: true,
                    remark: '',
                    id: 6,
                }]
            },]
        },
        {
            text: 'HUA',
            id: 10,
            remark:'lltest',
            data: [{
                text: 'lltest',
                leaf: true,
                remark: '有锅甩给产品就好',
                id: 11
            },
            {
                text: 'VOLTE数据',
                id: 12,
                remark: '',
               leaf:true,
            },
            {
                text: '吉林电信数据',
                remark: '',
                id: 13,
                leaf: true
            }]
        },
        {
            text: '联通',
            remark: '',
            id: 20,
            //注意
            data: [{
                text: '联通',
                remark: '我的锅甩给谁呢？',
                id: 21,
                leaf: true
            }]
        }, {
            text: 'Adatas',
            remark: '卖卖卖！！！',
            id: 30,
            leaf: true
        }]
    }
});