ve.ui.SmsMetasAction = function VeUiSmsMetasAction() {
    ve.ui.SmsMetasAction.super.apply(this, arguments);
};

OO.inheritClass(ve.ui.SmsMetasAction, ve.ui.Action);

ve.ui.SmsMetasAction.static.name = 'smsmetasAction';

ve.ui.SmsMetasAction.static.methods = [
    'create', 'delete', 'changeSmsMetaStyle', 'enterSmsMeta'
];

ve.ui.SmsMetasAction.prototype.create = function (options) {
    var i, type, smsmetaElement, surfaceModel, fragment, data;

    options = options || {};
    type = options.type || 'smsmetasDiv';
    smsmetaElement = {type: type};
    surfaceModel = this.surface.getModel();
    fragment = surfaceModel.getFragment();
    data = [];
    if (!(fragment.getSelection() instanceof ve.dm.LinearSelection)) {
        return false;
    }

    if (options.attributes) {
        smsmetaElement.attributes = ve.copy(options.attributes);
    }

    data.push(smsmetaElement);
    data.push(
        {type: 'paragraph', internal: {generated: 'wrapper'}},
        {type: '/paragraph'}
    );
    data.push({type: '/' + type});
    fragment.insertContent(data, false);
    surfaceModel.setSelection(
        new ve.dm.LinearSelection(fragment.getDocument(), fragment.getSelection().getRange())
    );
    return true;
};

ve.ui.SmsMetasAction.prototype.delete = function (mode) {
    var tableNode, minIndex, maxIndex, isFull,
        selection = this.surface.getModel().getSelection();

    if (!(selection instanceof ve.dm.TableSelection)) {
        return false;
    }

    tableNode = selection.getTableNode();
    // Either delete the table or rows or columns
    if (mode === 'table') {
        this.deleteTable(tableNode);
    } else {
        if (mode === 'col') {
            minIndex = selection.startCol;
            maxIndex = selection.endCol;
            isFull = selection.isFullRow();
        } else {
            minIndex = selection.startRow;
            maxIndex = selection.endRow;
            isFull = selection.isFullCol();
        }
        // Delete the whole table if all rows or cols get deleted
        if (isFull) {
            this.deleteTable(tableNode);
        } else {
            this.deleteRowsOrColumns(tableNode.matrix, mode, minIndex, maxIndex);
        }
    }
    return true;
};

ve.ui.SmsMetasAction.prototype.changeSmsMetaStyle = function (style) {
    var i, ranges,
        txBuilders = [],
        surfaceModel = this.surface.getModel(),
        selection = surfaceModel.getSelection();

    if (!(selection instanceof ve.dm.LinearSelection)) {
        return false;
    }

    ranges = selection.getOuterRanges();
    for (i = ranges.length - 1; i >= 0; i--) {
        txBuilders.push(
            ve.dm.TransactionBuilder.static.newFromAttributeChanges.bind(null,
                surfaceModel.getDocument(), ranges[i].start, {style: style}
            )
        );
    }
    txBuilders.forEach(function (txBuilder) {
        surfaceModel.change(txBuilder());
    });
    return true;
};

ve.ui.SmsMetasAction.prototype.enterSmsMeta = function () {
    enter
    var tableNode,
        selection = this.surface.getModel().getSelection();

    if (!(selection instanceof ve.dm.LinearSelection)) {
        return false;
    }
    tableNode = this.surface.getView().documentView.getBranchNodeFromOffset(selection.tableRange.start + 1);
    tableNode.setEditing(true);
    this.surface.getView().focus();
    return true;
};

/* Registration */

ve.ui.actionFactory.register(ve.ui.SmsMetasAction);
