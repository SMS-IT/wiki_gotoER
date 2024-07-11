ve.ui.SmsMetasInspectorDiv = function VeUiSmsMetasInspectorDiv() {
    ve.ui.SmsMetasInspectorDiv.super.apply(this, arguments);
};

OO.inheritClass(ve.ui.SmsMetasInspectorDiv, ve.ui.NodeInspector);

ve.ui.SmsMetasInspectorDiv.static.name = 'smsmetasDiv';
ve.ui.SmsMetasInspectorDiv.static.title = 'Метадата (блок)';
ve.ui.SmsMetasInspectorDiv.static.modelClasses = [ve.dm.SmsMetasAnnotationDiv];
ve.ui.SmsMetasInspectorDiv.static.size = 'large'

ve.ui.SmsMetasInspectorDiv.prototype.getSmsMetasInfo = function () {
    var type = this.dbInput.getSmsMetaType();
    var conf = {
        type: 'smsmetasDiv',
        attributes: {
        }
    }
    if (type && type != "") conf.attributes[type] = '';
    return (type ? new ve.dm.SmsMetasAnnotationDiv(conf) : null
    );
};

ve.ui.SmsMetasInspectorDiv.prototype.initialize = function () {
    ve.ui.SmsMetasInspectorDiv.super.prototype.initialize.call(this);
	console.log(ve.ui.SmsMetasInspectorDiv.super.prototype.getSizeProperties.call(this))
	ve.ui.SmsMetasInspectorDiv.super.prototype.setDimensions.call(this, {width:400, height:200});
    this.dbInput = new ve.ui.SmsMetasInputWidget({
        dialogManager: this.manager.getSurface().getDialogs()
    });
	console.log(this)
    this.form.$element.append(this.dbInput.$element);
    this.$content.addClass('ve-ui-SmsMetasInspectorDiv-content');
};


ve.ui.SmsMetasInspectorDiv.prototype.getSetupProcess = function (data) {
    return ve.ui.SmsMetasInspectorDiv.super.prototype.getSetupProcess.call(this, data)
        .next(function () {
            var node = data.fragment.surface.getSelectedNode();
            this.dbInput.setSmsMetaType(node.element.attributes && Object.keys(node.element.attributes).length > 0 ? Object.keys(node.element.attributes)[0] : "");
        }, this);
};

ve.ui.SmsMetasInspectorDiv.prototype.getTeardownProcess = function (data) {
    data = data || {};
    return ve.ui.SmsMetasInspectorDiv.super.prototype.getTeardownProcess.call(this, data)
        .first(function () {
            if (data.action === 'done') {
                var node = this.fragment.surface.getSelectedNode();
                var smsmetas = this.getSmsMetasInfo();
                node.element.attributes = smsmetas ? smsmetas.element.attributes : undefined;
            }
        }, this);
};


ve.ui.windowFactory.register(ve.ui.SmsMetasInspectorDiv);
