ve.ui.SmsMetasInspectorToolDiv = function VeUiSmsMetasInspectorToolDiv() {
	ve.ui.SmsMetasInspectorToolDiv.super.apply( this, arguments );
};
OO.inheritClass( ve.ui.SmsMetasInspectorToolDiv, ve.ui.FragmentInspectorTool );

ve.ui.SmsMetasInspectorToolDiv.static.name = 'smsmetasDiv';
ve.ui.SmsMetasInspectorToolDiv.static.group = 'mw';
ve.ui.SmsMetasInspectorToolDiv.static.icon = 'code';
ve.ui.SmsMetasInspectorToolDiv.static.title = 'Метадата (блок)';

ve.ui.SmsMetasInspectorToolDiv.static.modelClasses = [ ve.dm.SmsMetasAnnotationDiv ];
ve.ui.SmsMetasInspectorToolDiv.static.commandName = 'smsmetasDiv';

ve.ui.toolFactory.register( ve.ui.SmsMetasInspectorToolDiv );

ve.ui.commandRegistry.register(
	new ve.ui.Command(
		'smsmetasDiv', 'smsmetasAction', 'create',
		{ args: [ 'smsmetasDiv' ], supportedSelections: [ 'linear' ] }
	)
);

ve.ui.commandRegistry.register(
	new ve.ui.Command(
		'smsmetasDivEdit', 'window', 'open',
		{ args: [ 'smsmetasDiv' ], supportedSelections: [ 'linear' ] }
	)
);

ve.ui.triggerRegistry.register(
    'smsmetasDiv', {
        mac: new ve.ui.Trigger('cmd+alt+t'),
        pc: new ve.ui.Trigger('ctrl+alt+t')
    }
);

ve.ui.sequenceRegistry.register(
	new ve.ui.Sequence( 'wikitextSmsmetasDiv', 'smsmetasDiv', '<block', 6 )
);

ve.ui.commandHelpRegistry.register( 'insert', 'smsmeta', {
	sequences: [ 'wikitextSmsmetasDiv' ],
	label: 'VisualSmsMetaTags'
} );
