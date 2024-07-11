ve.ce.SmsMetasAnnotationDiv = function VeCeSmsMetasAnnotationDiv() {
	// Parent constructor
	ve.ce.SmsMetasAnnotationDiv.super.apply( this, arguments );

	// Events
	 this.model.connect( this, {
		 update: 'onUpdate'
	 } );

	// Properties
	this.surface = null;
	this.active = false;
};

/* Inheritance */

OO.inheritClass( ve.ce.SmsMetasAnnotationDiv, ve.ce.BranchNode );

/* Static Properties */

ve.ce.SmsMetasAnnotationDiv.static.name = 'smsmetasDiv';
ve.ce.SmsMetasAnnotationDiv.static.primaryCommandName = 'smsmeta';
// во что преобразовать модель
ve.ce.SmsMetasAnnotationDiv.static.tagName = 'div';
ve.ce.SmsMetasAnnotationDiv.static.isMultiline = true;

/* Override Methods */

/**
 * @inheritdoc
 */
ve.ce.SmsMetasAnnotationDiv.prototype.initialize = function () {
	var type, title;

	// Parent method
	ve.ce.SmsMetasAnnotationDiv.super.prototype.initialize.call( this );

	type = this.model.getSmsMetaType();
	title = this.constructor.static.getDescription(this.model);

	this.$element
		.addClass( 'in-develop-smsmetas ve-ce-smsmetasDiv' );

	// Set attributes (keep in sync with #onSetup)
	if (type && type != "") this.$element.attr(type, type);
	this.$element.attr( 'title', title );
	this.$element.attr( 'data-title', title );
};

ve.ce.SmsMetasAnnotationDiv.prototype.onUpdate = function () {
	this.updateTagName();
};

ve.ce.SmsMetasAnnotationDiv.prototype.onSetup = function () {
	console.log('setyp');
	// Parent method
	ve.ce.SmsMetasAnnotationDiv.super.prototype.onSetup.call( this );

	// Exit if already setup or not attached
	if ( this.isSetup || !this.root ) {
		return;
	}
	this.surface = this.getRoot().getSurface();

	// Overlay
	this.$selectionBox = $( '<div>' ).addClass( 've-ce-smsmetasNodeOverlay-selection-box' );
	this.$selectionBoxAnchor = $( '<div>' ).addClass( 've-ce-smsmetasNodeOverlay-selection-box-anchor' );

	this.$overlay = $( '<div>' )
		.addClass( 've-ce-smsmetasNodeOverlay oo-ui-element-hidden' )
		.append( [
			this.$selectionBox,
			this.$selectionBoxAnchor,
		] );
	this.surface.surface.$blockers.append( this.$overlay );


	var type = this.model.getSmsMetaType();
	var res = '';
	this.$xxx = $( '<span class="smsmetadb">' + res + '</span>' );
	this.$element.prepend(this.$xxx);


	// Events
	this.$element.on( {
		'dblclick.ve-ce-smsmetasDiv': this.onVChangeMouseDown.bind( this )
	} );
	this.$overlay.on( {
		'dblclick.ve-ce-smsmetasDiv': this.onVChangeMouseDown.bind( this )
	} );
};

/**
 * Handle mouse down or touch start events
 *
 * @param {jQuery.Event} e Mouse down or touch start event
 */
ve.ce.SmsMetasAnnotationDiv.prototype.onVChangeMouseDown = function ( e ) {
	var cellNode, startCell, endCell, selection, newSelection,
		node = this;

	cellNode = this.getSmsMetaNodeFromEvent( e );
	if ( !cellNode ) {
		return;
	}
	newSelection = new ve.dm.LinearSelection(
		this.getModel().getDocument(),
		this.getModel().getOuterRange()
	);
	this.surface.getModel().setSelection( newSelection );
};

/**
 * Get a table cell node from a mouse event
 *
 * Works around various issues with touch events and browser support.
 *
 * @param {jQuery.Event} e Mouse event
 * @return {ve.ce.SmsMetasAnnotationDiv|null} node
 */
ve.ce.SmsMetasAnnotationDiv.prototype.getSmsMetaNodeFromEvent = function ( e ) {
	var touch;

	// 'touchmove' doesn't give a correct e.target, so calculate it from coordinates
	if ( e.type === 'touchstart' && e.originalEvent.touches.length > 1 ) {
		// Ignore multi-touch
		return null;
	} else if ( e.type === 'touchmove' ) {
		if ( e.originalEvent.touches.length > 1 ) {
			// Ignore multi-touch
			return null;
		}
		touch = e.originalEvent.touches[ 0 ];
		return this.getSmsMetaNodeFromPoint( touch.clientX, touch.clientY );
	} else {
		return this.getNearestSmsMetaNode( e.target );
	}
};


/**
 * Get the cell node from a point
 *
 * @param {number} x X offset
 * @param {number} y Y offset
 * @return {ve.ce.TableCellNode|null} Table cell node, or null if none found
 */
ve.ce.SmsMetasAnnotationDiv.prototype.getSmsMetaNodeFromPoint = function ( x, y ) {
	return this.getNearestSmsMetaNode(
		this.surface.getElementDocument().elementFromPoint( x, y )
	);
};

/**
 * Get the nearest cell node in this table to an element
 *
 * If the nearest cell node is in another table, return null.
 *
 * @param {HTMLElement} element Element target to find nearest cell node to
 * @return {ve.ce.TableCellNode|null} Table cell node, or null if none found
 */
ve.ce.SmsMetasAnnotationDiv.prototype.getNearestSmsMetaNode = function ( element ) {
	var ignoreSet = new Set(['td', 'tr']);
	var $element = $( element );
	if ($element.data('view').parent && ignoreSet.has($element.data('view').parent.tagName))
		return undefined;
	return $element.closest("div.ve-ce-smsmetasDiv").data('view');
};


/**
 * @inheritdoc
 */
ve.ce.SmsMetasAnnotationDiv.prototype.onTeardown = function (data) {
	// Parent method
	ve.ce.SmsMetasAnnotationDiv.super.prototype.onTeardown.call( this );
	// Events
	this.$element.off( '.ve-ce-smsmetasDiv' );
	this.$overlay.off( '.ve-ce-smsmetasDiv' );
	this.surface.getModel().disconnect( this );
	this.surface.disconnect( this );
	this.$overlay.remove();
};


/* Static Methods */

/**
 * @inheritdoc
 */
ve.ce.SmsMetasAnnotationDiv.static.getDescription = function ( model ) {
	var type = model.getAttributes();

	$res = "";
	if (Object.keys(type).includes('db') || Object.keys(type).length == 0) {
		$res = "Поле бд";
	}

	if (Object.keys(type).includes('history')) {
		$res = "История";
	}

	return ve.msg( 'visualeditor-languageannotation-description', $res );
};

/* Registration */

ve.ce.nodeFactory.register( ve.ce.SmsMetasAnnotationDiv );


