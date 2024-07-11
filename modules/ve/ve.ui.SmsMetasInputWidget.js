ve.ui.SmsMetasInputWidget = function VeUiSmsMetasInputWidget(config) {
    var layoutConfig;
    config = config || {};

    ve.ui.SmsMetasInputWidget.super.call(this, config);

    this.smsMetaType = 'db';

    this.overlay = new ve.ui.Overlay({classes: ['ve-ui-overlay-global']});
    this.dialogs = config.dialogManager || new ve.ui.WindowManager({factory: ve.ui.windowFactory});
    this.dropdownInput = new OO.ui.DropdownInputWidget({
	$overlay: this.overlay,
        options: [
            {data: 'db', label: 'Поле бд'},
            {data: 'history', label: 'История'}
        ],
        classes: ['ve-ui-mwExtensionWindow-input']
    });
    this.dropdownInput.setValue('db');

    layoutConfig = {
        align: 'top',
        label: 'Тип метаполя'
    };

    this.layout = new OO.ui.FieldLayout(
        this.dropdownInput, layoutConfig
    );

    this.dropdownInput.connect(this, {change: 'onChange'});
    this.overlay.$element.append(this.dialogs.$element);
    $('body').append(this.overlay.$element);

    this.$element
        .addClass('ve-ui-languageInputWidget')
        .append(this.layout.$element)
	.append("</br></br></br></br>");

};


OO.inheritClass(ve.ui.SmsMetasInputWidget, OO.ui.Widget);


ve.ui.SmsMetasInputWidget.prototype.onChange = function () {
    var selectedItem;
    if (this.updating) {
        return;
    }

    this.setSmsMetaType(
        this.dropdownInput.getValue()
    );

};

ve.ui.SmsMetasInputWidget.prototype.setSmsMetaType = function (smsMetaType) {

    if (smsMetaType === this.smsMetaType) {
        return;
    }

    this.updating = true;
    if (smsMetaType) {
        smsMetaType = smsMetaType || '';
        this.dropdownInput.setValue(smsMetaType);
    } else {
        this.dropdownInput.setValue('');
    }
    this.updating = false;

    this.emit('change', smsMetaType);
    this.smsMetaType = smsMetaType;
};

ve.ui.SmsMetasInputWidget.prototype.getSmsMetaType = function () {
    return this.smsMetaType;
}

