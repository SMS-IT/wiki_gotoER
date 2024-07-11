ve.ui.SmsMetasContextItemDiv = function VeUiSmsMetasContextItemDiv( context, model, config ) {

	// Parent constructor
	ve.ui.SmsMetasContextItemDiv.super.call( this, context, model, config );

	// Initialization
	this.$element.addClass( 've-ui-smsmetasContextItemDiv' );
};

/* Inheritance */

OO.inheritClass( ve.ui.SmsMetasContextItemDiv, ve.ui.LinearContextItem );

/* Static Properties */

ve.ui.SmsMetasContextItemDiv.static.name = 'smsmetasDiv';

// todo: иконка всплывающего бокса
ve.ui.SmsMetasContextItemDiv.static.icon = 'code';

ve.ui.SmsMetasContextItemDiv.static.label = "Метадата (блок)";

ve.ui.SmsMetasContextItemDiv.static.modelClasses = [ ve.dm.SmsMetasAnnotationDiv ];

ve.ui.SmsMetasContextItemDiv.static.embeddable = false;

ve.ui.SmsMetasContextItemDiv.static.commandName = 'smsmetasDiv';

/**
 * @inheritdoc
 */
ve.ui.SmsMetasContextItemDiv.static.isCompatibleWith = function ( model ) {
	return model instanceof ve.dm.SmsMetasAnnotationDiv;
};


/* Methods */

/**
 * @inheritdoc
 */
ve.ui.SmsMetasContextItemDiv.prototype.isDeletable = function () {
	return true;
};

/**
 * Handle edit button click events.
 *
 * @localdoc Executes the command related to #static-commandName on the context's surface
 *
 * @protected
 */
ve.ui.SmsMetasContextItemDiv.prototype.onEditButtonClick = function () {

	var command = this.context.getSurface().commandRegistry.lookup( "smsmetasDivEdit" );;

	if ( command ) {
		command.execute( this.context.getSurface() );
		this.emit( 'command' );
	}
};

/**
 * @inheritdoc
 */
ve.ui.SmsMetasContextItemDiv.prototype.getDescription = function () {
	return ve.ce.SmsMetasAnnotationDiv.static.getDescription( this.model );
};

/* Registration */

ve.ui.contextItemFactory.register( ve.ui.SmsMetasContextItemDiv );
