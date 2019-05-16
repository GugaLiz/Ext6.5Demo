Ext.define('Fleet5.ux.toolbar.FakePaging', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.fakepagingtoolbar',
    alternateClassName: 'Ext.FakePagingToolbar',
    requires: ['Ext.toolbar.TextItem', 'Ext.form.field.Number'],
    displayInfo: false,

    /**
     * @cfg {Boolean} prependButtons
     * true to insert any configured items _before_ the paging buttons.
     */
    prependButtons: false,

    //<locale>
    /**
     * @cfg {String} displayMsg
     * The paging status message to display. Note that this string is
     * formatted using the braced numbers {0}-{2} as tokens that are replaced by the values for start, end and total
     * respectively. These tokens should be preserved when overriding this string if showing those values is desired.
     */
    displayMsg: 'Displaying {0} - {1} of {2}',
    //</locale>

    //<locale>
    /**
     * @cfg {String} emptyMsg
     * The message to display when no records are found.
     */
    emptyMsg: 'No data to display',
    //</locale>

    //<locale>
    /**
     * @cfg {String} beforePageText
     * The text displayed before the input item.
     */
    beforePageText: 'Page',
    //</locale>

    //<locale>
    /**
     * @cfg {String} afterPageText
     * Customizable piece of the default paging text. Note that this string is formatted using
     * {0} as a token that is replaced by the number of total pages. This token should be preserved when overriding this
     * string if showing the total page count is desired.
     */
    afterPageText: 'of {0}',
    //</locale>

    //<locale>
    /**
     * @cfg {String} firstText
     * The quicktip text displayed for the first page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    firstText: 'First Page',
    //</locale>

    //<locale>
    /**
     * @cfg {String} prevText
     * The quicktip text displayed for the previous page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    prevText: 'Previous Page',
    //</locale>

    //<locale>
    /**
     * @cfg {String} nextText
     * The quicktip text displayed for the next page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    nextText: 'Next Page',
    //</locale>

    //<locale>
    /**
     * @cfg {String} lastText
     * The quicktip text displayed for the last page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    lastText: 'Last Page',
    //</locale>

    //<locale>
    /**
     * @cfg {String} refreshText
     * The quicktip text displayed for the Refresh button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    refreshText: 'Refresh',
    //</locale>

    /**
     * @cfg {Number} inputItemWidth
     * The width in pixels of the input field used to display and change the current page number.
     */
    inputItemWidth: 30,

    /**
     * Gets the standard paging items in the toolbar
     * @private
     */
    getPagingItems: function () {
        var me = this;
        return [{
            itemId: 'first',
            tooltip: me.firstText,
            overflowText: me.firstText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-first',
            disabled: true,
            handler: me.moveFirst,
            scope: me
        }, {
            itemId: 'prev',
            tooltip: me.prevText,
            overflowText: me.prevText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-prev',
            disabled: true,
            handler: me.movePrevious,
            scope: me
        },
        '-',
        me.beforePageText,
        {
            xtype: 'numberfield',
            itemId: 'inputItem',
            name: 'inputItem',
            cls: Ext.baseCSSPrefix + 'tbar-page-number',
            allowDecimals: false,
            minValue: 1,
            hideTrigger: true,
            enableKeyEvents: true,
            keyNavEnabled: false,
            selectOnFocus: true,
            submitValue: false,
            // mark it as not a field so the form will not catch it when getting fields
            isFormField: false,
            width: me.inputItemWidth,
            margins: '-1 2 3 2',
            listeners: {
                scope: me,
                keydown: me.onPagingKeyDown,
                blur: me.onPagingBlur
            }
        }, {
            xtype: 'tbtext',
            itemId: 'afterTextItem',
            text: Ext.String.format(me.afterPageText, 1)
        },
        '-',
        {
            itemId: 'next',
            tooltip: me.nextText,
            overflowText: me.nextText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-next',
            disabled: true,
            handler: me.moveNext,
            scope: me
        }, {
            itemId: 'last',
            tooltip: me.lastText,
            overflowText: me.lastText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-last',
            disabled: true,
            handler: me.moveLast,
            scope: me
        },
        '-',
        {
            itemId: 'refresh',
            tooltip: me.refreshText,
            overflowText: me.refreshText,
            iconCls: Ext.baseCSSPrefix + 'tbar-loading',
            disabled: false,
            handler: me.doRefresh,
            scope: me
        }];
    },

    initComponent: function () {
        var me = this,
            userItems = me.items || me.buttons || [],
            pagingItems;

        pagingItems = me.getPagingItems();
        if (me.prependButtons) {
            me.items = userItems.concat(pagingItems);
        } else {
            me.items = pagingItems.concat(userItems);
        }
        delete me.buttons;

        if (me.displayInfo) {
            me.items.push('->');
            me.items.push({ xtype: 'tbtext', itemId: 'displayItem' });
        }

        me.callParent();
    },

    beforeRender: function () {
        this.callParent(arguments);
        //if (!this.store.isLoading()) {
        //    this.onLoad();
        //}
    },

    // @private
    updateInfo: function () {
        var me = this,
            displayItem = me.child('#displayItem'),
            pageData = me.getPageData(),
            count, msg;

        var datas = me.getDatas();
        var totalCount = datas ? datas.length : 0;

        if (displayItem) {
            if (totalCount === 0) {
                msg = me.emptyMsg;
            } else {
                msg = Ext.String.format(
                    me.displayMsg,
                    pageData.fromRecord,
                    pageData.toRecord,
                    pageData.total
                );
            }
            displayItem.setText(msg);
        }
    },

    // @private
    onLoad: function () {
        var me = this,
            pageData,
            currPage,
            pageCount,
            afterText,
            count,
            isEmpty,
            item;
        var datas = me.getDatas();
        count = datas ? datas.length : 0;
        isEmpty = count === 0;
        if (!isEmpty) {
            pageData = me.getPageData();
            currPage = pageData.currentPage;
            pageCount = pageData.pageCount;

            // Check for invalid current page.
            if (currPage > pageCount) {
                me.store.loadPage(pageCount);
                return;
            }

            afterText = Ext.String.format(me.afterPageText, isNaN(pageCount) ? 1 : pageCount);
        } else {
            currPage = 0;
            pageCount = 0;
            afterText = Ext.String.format(me.afterPageText, 0);
        }

        Ext.suspendLayouts();
        item = me.child('#afterTextItem');
        if (item) {
            item.setText(afterText);
        }
        item = me.getInputItem();
        if (item) {
            item.setDisabled(isEmpty).setValue(currPage);
        }
        me.setChildDisabled('#first', currPage === 1 || isEmpty);
        me.setChildDisabled('#prev', currPage === 1 || isEmpty);
        me.setChildDisabled('#next', currPage === pageCount || isEmpty);
        me.setChildDisabled('#last', currPage === pageCount || isEmpty);
        me.setChildDisabled('#refresh', false);
        me.updateInfo();
        Ext.resumeLayouts(true);

        me.fireEvent('change', me, pageData);
    },

    setChildDisabled: function (selector, disabled) {
        var item = this.child(selector);
        if (item) {
            item.setDisabled(disabled);
        }
    },
    pageSize: 25,
    currentPage: 1,

    // @private
    getPageData: function () {
        var me = this;
        var datas = me.getDatas();
        var totalCount = datas ? datas.length : 0;

        return {
            total: totalCount,
            currentPage: me.currentPage,
            pageCount: Math.ceil(totalCount / me.pageSize),
            fromRecord: ((me.currentPage - 1) * me.pageSize) + 1,
            toRecord: Math.min(me.currentPage * me.pageSize, totalCount)
        };
    },

    // @private
    onLoadError: function () {
        this.setChildDisabled('#refresh', false);
    },

    getInputItem: function () {
        return this.child('#inputItem');
    },

    // @private
    readPageFromInput: function (pageData) {
        var inputItem = this.getInputItem(),
            pageNum = false,
            v;

        if (inputItem) {
            v = inputItem.getValue();
            pageNum = parseInt(v, 10);
            if (!v || isNaN(pageNum)) {
                inputItem.setValue(pageData.currentPage);
                return false;
            }
        }
        return pageNum;
    },

    // @private
    onPagingBlur: function (e) {
        var inputItem = this.getInputItem(),
            curPage;

        if (inputItem) {
            curPage = this.getPageData().currentPage;
            inputItem.setValue(curPage);
        }
    },

    // @private
    onPagingKeyDown: function (field, e) {
        this.processKeyEvent(field, e);
    },

    processKeyEvent: function (field, e) {
        var me = this,
            k = e.getKey(),
            pageData = me.getPageData(),
            increment = e.shiftKey ? 10 : 1,
            pageNum;

        if (k == e.RETURN) {
            e.stopEvent();
            pageNum = me.readPageFromInput(pageData);
            if (pageNum !== false) {
                pageNum = Math.min(Math.max(1, pageNum), pageData.pageCount);
                if (pageNum !== pageData.currentPage && me.fireEvent('beforechange', me, pageNum) !== false) {
                    me.store.loadPage(pageNum);
                }
            }
        } else if (k == e.HOME || k == e.END) {
            e.stopEvent();
            pageNum = k == e.HOME ? 1 : pageData.pageCount;
            field.setValue(pageNum);
        } else if (k == e.UP || k == e.PAGE_UP || k == e.DOWN || k == e.PAGE_DOWN) {
            e.stopEvent();
            pageNum = me.readPageFromInput(pageData);
            if (pageNum) {
                if (k == e.DOWN || k == e.PAGE_DOWN) {
                    increment *= -1;
                }
                pageNum += increment;
                if (pageNum >= 1 && pageNum <= pageData.pageCount) {
                    field.setValue(pageNum);
                }
            }
        }
    },

    // @private
    beforeLoad: function () {
        this.setChildDisabled('#refresh', true);
    },

    /**
     * Move to the first page, has the same effect as clicking the 'first' button.
     * Fires the {@link #beforechange} event. If the event returns `false`, then
     * the load will not be attempted.
     * @return {Boolean} `true` if the load was passed to the store.
     */
    moveFirst: function () {
        var me = this,
            sto = me._store;
        var datas = me.getDatas();
        if (me.fireEvent('beforechange', this, 1) !== false) {
            var limit = me.pageSize;
            var d = datas.slice(0, limit);
            sto.loadData(d);
            me.currentPage = 1;
            me.onLoad();
            return true;
        }
        return false;
    },

    /**
     * Move to the previous page, has the same effect as clicking the 'previous' button.
     * Fires the {@link #beforechange} event. If the event returns `false`, then
     * the load will not be attempted.
     * @return {Boolean} `true` if the load was passed to the store.
     */
    movePrevious: function () {
        var me = this,
            sto = me._store,
            prev = me.currentPage - 1;
        var datas = me.getDatas();

        if (prev > 0) {
            if (me.fireEvent('beforechange', me, prev) !== false) {
                var start = (prev - 1) * me.pageSize;
                var limit = me.pageSize;
                var d = datas.slice(start, start + limit);
                sto.loadData(d);
                me.currentPage = prev;
                me.onLoad();
                return true;
            }
        }
        return false;
    },

    /**
     * Move to the next page, has the same effect as clicking the 'next' button.
     * Fires the {@link #beforechange} event. If the event returns `false`, then
     * the load will not be attempted.
     * @return {Boolean} `true` if the load was passed to the store.
     */
    moveNext: function () {
        var me = this,
            sto = me._store,
            total = me.getPageData().pageCount,
            next = me.currentPage + 1;
        var datas = me.getDatas();
        if (next <= total) {
            if (me.fireEvent('beforechange', me, next) !== false) {
                var start = (next - 1) * me.pageSize;
                var limit = me.pageSize;
                var d = datas.slice(start, start + limit);
                sto.loadData(d);
                me.currentPage = next;
                me.onLoad();
                return true;
            }
        }
        return false;
    },

    /**
     * Move to the last page, has the same effect as clicking the 'last' button.
     * Fires the {@link #beforechange} event. If the event returns `false`, then
     * the load will not be attempted.
     * @return {Boolean} `true` if the load was passed to the store.
     */
    moveLast: function () {
        var me = this,
            sto = me._store,
            last = me.getPageData().pageCount;
        var datas = me.getDatas();

        if (me.fireEvent('beforechange', me, last) !== false) {
            var start = (last - 1) * me.pageSize;
            var limit = me.pageSize;
            var d = datas.slice(start, start + limit);
            sto.loadData(d);
            me.currentPage = last;
            me.onLoad();
            return true;
        }
        return false;
    },

    /**
     * Refresh the current page, has the same effect as clicking the 'refresh' button.
     * Fires the {@link #beforechange} event. If the event returns `false`, then
     * the load will not be attempted.
     * @return {Boolean} `true` if the load was passed to the store.
     */
    doRefresh: function () {
        var me = this,
            sto = me._store,
            current = me.currentPage;
        var datas = me.getDatas();

        if (me.fireEvent('beforechange', me, current) !== false) {
            var start = (current - 1) * me.pageSize;
            var limit = me.pageSize;
            var d = datas.slice(start, start + limit);
            sto.loadData(d);
            me.onLoad();
            return true;
        }
        return false;
    },

    getStoreListeners: function () {
        return {
            beforeload: this.beforeLoad,
            load: this.onLoad,
            exception: this.onLoadError
        };
    },

    /**
     * Unbinds the paging toolbar from the specified {@link Ext.data.Store} **(deprecated)**
     * @param {Ext.data.Store} store The data store to unbind
     */
    unbind: function (store) {
        this.bindStore(null);
    },

    /**
     * Binds the paging toolbar to the specified {@link Ext.data.Store} **(deprecated)**
     * @param {Ext.data.Store} store The data store to bind
     */
    bind: function (store) {
        this.bindStore(store);
    },

    // @private
    onDestroy: function () {
        this.unbind();
        this.callParent();
    }
});