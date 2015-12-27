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
		this.width = window.innerWidth;
		this.height = window.innerHeight;

	    function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
	    }
	    resizeCanvas();

		var game = new window.Esquive( this );
	};

	oApplication.setup();

} )();