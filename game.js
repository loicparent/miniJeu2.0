( function(){

	"use strict";

	var oApplication = {
		"canvas" : null,
		"context" : null,
		"width" : 0,
		"height" : 0
	};

	var _isCanvasSupported = function( oCanvasElt ){
		return !!oCanvasElt.getContext;
	};

	oApplication.setup = function(){
		this.canvas = document.querySelector( '#canvas' );
		if( !_isCanvasSupported( this.canvas ) ){
			return console.error( 'Canvas n\'est pas supporté' );
		}
		this.context = this.canvas.getContext( "2d" );
		this.width = this.canvas.width;
		this.height = this.canvas.height;

		var game = new window.Jeu( this );
	};

	oApplication.setup();

} )();