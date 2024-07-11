ve.dm.SmsMetasAnnotationDiv = function VeDmSmsMetasAnnotationDiv() {
    ve.dm.SmsMetasAnnotationDiv.super.apply(this, arguments);
};

OO.inheritClass(ve.dm.SmsMetasAnnotationDiv, ve.dm.BranchNode);

ve.dm.SmsMetasAnnotationDiv.static.name = 'smsmetasDiv';
ve.dm.SmsMetasAnnotationDiv.static.extensionName = 'smsmeta';
ve.dm.SmsMetasAnnotationDiv.static.matchTagNames = ['smsmeta'];
ve.dm.SmsMetasAnnotationDiv.static.tagName = 'smsmeta';
ve.dm.SmsMetasAnnotationDiv.static.preserveHtmlAttributes = false;

ve.dm.SmsMetasAnnotationDiv.static.matchFunction = function (domElement) {
    //return domElement.innerText.indexOf('\n') != -1;
    // если это тег smsmeta значит то, что нам нужно
    return true;
};

ve.dm.SmsMetasAnnotationDiv.static.toDataElement = function (domElements, converter) {
    var element = ve.dm.SmsMetasAnnotationDiv.parent.static.toDataElement.call(this, domElements[0], converter);
    $node = JSON.parse(domElements[0].getAttribute('data-mw'));
    var dataElement = null;
    if ($node) {
        if ($node && $node.name == 'smsmeta') {
            var keys = Object.keys($node.attrs);
            dataElement = {
                type: this.name,
                attributes: {}
            };
            if (keys.includes('db')) dataElement.attributes.db = $node.attrs.db;
            if (keys.includes('history')) dataElement.attributes.history = $node.attrs.history;
        }
    } else {
        $node = JSON.parse(domElements[0].getAttribute('data-parsoid'));
        if ($node) {
            var keys = Object.keys($node.sa);
            dataElement = {
                type: this.name,
                attributes: {}
            };

            if (keys.includes('db')) dataElement.attributes.db = $node.sa.db;
            if (keys.includes('history')) dataElement.attributes.history = $node.sa.history;
        }
    }

    element = Object.assign(element, dataElement);
    return element;
};

ve.dm.SmsMetasAnnotationDiv.static.toDomElements = function (dataElement, doc) {
    var domElement = doc.createElement('smsmeta');
    var attrs = {};
    if (!dataElement.attributes) dataElement.attributes = {'db': ''};

    if (Object.keys(dataElement.attributes).includes("db")) {
        attrs = {
            db: '',
        };
    }

    if (Object.keys(dataElement.attributes).includes("history")) {
        attrs = {
            history: '',
        };
    }

    ve.setDomAttributes(domElement, attrs);

    return [domElement];
};

ve.dm.SmsMetasAnnotationDiv.prototype.getSmsMetaType = function () {
    return this.element.attributes && Object.keys(this.element.attributes).length > 0 ? Object.keys(this.element.attributes)[0] : "db";
};

ve.dm.modelRegistry.register(ve.dm.SmsMetasAnnotationDiv);

