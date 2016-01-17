( function(){

	"use strict";

	window.Esquive = function( oApplication ){

		var ctx = oApplication.context,
		iAnimationRequestId = 0,
		score = 0,
		isGameOver = false,
		nBonus = 0,
        oStart = new Audio( "./sounds/start.mp3" ),
        oGOSound = new Audio( "./sounds/lose.mp3" ),
        oAddBubble = new Audio( "./sounds/bubble+.mp3" ),
        withSounds = 1,
        soundButton = document.querySelector( '.sounds' ),
        soundButtonImg = document.querySelector( '.sounds img' );

		var oZone = {

			"aBubbles" : [],
			"bubble" : {
				"x" : null,
				"y" : null,
				"radius" : null,
				"speedX" : null,
				"speedY" : null,
				"colour" : null,
				"bounce" : null,
				"startNumber" : 15
			},
			"bonus" : {
				"x" : null,
				"y" : null,
				"level" : 10,
				"size" : 30
			},
			"mouse" : {
				"x" : null,
				"y" : null
			},
			"update" : function(){
				oZone.aBubbles.forEach( function( bubble ){
		            if( ( bubble.x + bubble.radius > 0 + oApplication.width ) || ( bubble.x - bubble.radius < 0 ) ){
		                //withSounds == 1 ? bubble.bounce.play() : "";
		                bubble.speedX = - bubble.speedX;
		             }
		             // vérifier si on ricoche sur le hauteur
		             if( ( bubble.y + bubble.radius > 0 + oApplication.height ) || ( bubble.y - bubble.radius < 0 ) ){
		               // withSounds == 1 ? bubble.bounce.play() : "";
		                bubble.speedY = - bubble.speedY;
		             }
		            // Vérifier si on touche une boule.
		            var iDeltaX = Math.abs( bubble.x - oZone.mouse.x ),
		                iDeltaY = Math.abs( bubble.y - oZone.mouse.y ),
		                iDistance = Math.sqrt( ( Math.pow(  iDeltaX, 2 ) + Math.pow( iDeltaY, 2 ) ), 2 );

		            if ( iDistance, iDistance < bubble.radius ) {
		                withSounds == 1 ? oGOSound.play() : "";
		                gameOver();
		            }
		            bubble.x += bubble.speedX/5;
		            bubble.y += bubble.speedY/5;
				} );
			},
			"render" : function(){
				ctx.clearRect( 0, 0, oApplication.width, oApplication.height );

				// Draw bonus square
				var x = oZone.bonus.x,
		            y = oZone.bonus.y,
		            size = oZone.bonus.size;
		        ctx.beginPath();
		        ctx.rect( x-size, y-size, size, size );
		        ctx.fillStyle = 'black';
		        ctx.fill();

		        // Draw bubbles
				oZone.aBubbles.forEach( function( bubble ){
					ctx.beginPath();
					ctx.fillStyle = 'hsl(' + bubble.colour + ',80%,60%)';
					ctx.arc( bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2, true );
					ctx.fill();
					ctx.closePath();
				} );
			},
			"animate" : function(){
				iAnimationRequestId = window.requestAnimationFrame( oZone.animate );
				changeBonus();
				oZone.update();
				oZone.render();
			},
			"generateBubble" : function(){
				var bubbleNumber = oZone.bubble.startNumber;
				for( bubbleNumber; bubbleNumber > 0; bubbleNumber-- ){
					var x = oApplication.width / 8;
					var y = oApplication.height / 8;
					var radius = ~~( Math.random() * 30 ) + 15;
					var speedX = ~~( Math.random() * 15 ) + 8;
					var speedY = ~~( Math.random() * 15 ) + 8;
					var colour = ~~( Math.random() * 350 ) + 30;
					oZone.aBubbles.push( new oBubble( x, y, radius, speedX, speedY, colour ) );
				}
			},
			"generateBonus" : function(){
				this.bonus.x = Math.floor(Math.random() * (( oApplication.width - this.bonus.size ) - this.bonus.size)) + this.bonus.size;
        		this.bonus.y = Math.floor(Math.random() * (( oApplication.height - this.bonus.size ) - this.bonus.size)) + this.bonus.size;
			}
		};

		var oBubble = function( x, y, radius, speedX, speedY, colour ){
			this.x = x;
			this.y = y;
			this.radius = radius;
			this.speedX = speedX;
			this.speedY = speedY;
			this.colour = colour;
			this.bounce = new Audio( "./sounds/bounce.mp3" );
		};

		var gameOver = function (){
			window.cancelAnimationFrame( iAnimationRequestId );
			createCookie( 'sounds', withSounds, 365 );
			if ( readCookie( 'bestScore' ) === null ) {
				createCookie( 'bestScore', nBonus, 365 );
			} else {
				if ( nBonus > readCookie( 'bestScore' ) ) {
					createCookie( 'bestScore', nBonus, 365 );
				}
			}
			document.querySelector( '.endScore' ).innerHTML = nBonus;
			document.querySelector( '.bestScore' ).innerHTML = readCookie( 'bestScore' );
			document.querySelector( '.end_modal' ).classList.remove( 'hidden' );
			document.querySelector( '#canvas' ).classList.add( 'finish' );
			document.querySelector( '.restart' ).addEventListener( 'click', function(){
				window.location.reload( true );
			}, false );
	    }

	    var changeBonus = function() {
	        // vérifier si on a touché le bonus
	        if ( oZone.mouse.x > ( oZone.bonus.x - oZone.bonus.size ) && oZone.mouse.x < ( oZone.bonus.x ) && oZone.mouse.y > ( oZone.bonus.y - oZone.bonus.size ) && oZone.mouse.y < ( oZone.bonus.y ) ) {
	            var bonusSound = new Audio( "./sounds/bonus.mp3" );
	            withSounds == 1 ? bonusSound.play() : "";
	            nBonus++;
		        var BonusSize = oZone.bonus.size;
		        oZone.bonus.x = Math.floor(Math.random() * (( oApplication.width - BonusSize ) - BonusSize )) + BonusSize;
		        oZone.bonus.y = Math.floor(Math.random() * (( oApplication.height - BonusSize ) - BonusSize )) + BonusSize;
		        document.querySelector( '.scoreResult' ).innerHTML = nBonus;
	        }
	        if( nBonus === oZone.bonus.level ){
	            withSounds == 1 ? oAddBubble.play() : "";
	            oZone.bonus.level += 10;
	            addBubbles();
	        }
	    };

	    var addBubbles = function() {
	    	var radius = ~~( Math.random() * 30 ) + 15;
	    	var x = ~~( Math.random() * ( oApplication.width - radius ) ) + radius;
	    	// Vérifier que la boule soit à plus de 100 px de la souris quand elle apparait
	    	if ( ( x > oZone.mouse.x-100  && x < oZone.mouse.x ) || ( x < oZone.mouse.x+100  && x > oZone.mouse.x ) ) {
	    		x = ~~( Math.random() * ( oApplication.width - radius ) ) + radius;
	    	};
			var y = ~~( Math.random() * ( oApplication.height - radius ) ) + radius;
			// Vérifier que la boule soit à plus de 100 px de la souris quand elle apparait
			if ( ( y > oZone.mouse.y-100  && y < oZone.mouse.y ) || ( y < oZone.mouse.y+100  && y > oZone.mouse.y ) ) {
	    		y = ~~( Math.random() * ( oApplication.height - radius ) ) + radius;
	    	};
			var speedX = ~~( Math.random() * 15 ) + 8;
			var speedY = ~~( Math.random() * 15 ) + 8;
			var colour = ~~( Math.random() * 350 ) + 30;
			oZone.aBubbles.push( new oBubble( x, y, radius, speedX, speedY, colour ) );
	    };

		// récupérer la position de la souris:
        var getMousePos = function( canvas, evt ) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }

        // Créer un cookies avec le meilleurs score:
        	// source = http://www.itx-technologies.com/blog/798-creer-et-gerer-un-cookie-en-javascript
        var createCookie = function( name, value, days ) {
			// Le nombre de jour est spécifié
			if ( days ) {
				var the_date = new Date();
				
				// Converti le nombre de jour en millisecondes
				the_date.setTime( the_date.getTime()+( days*24*60*60*1000 ) );
				var expire = "; expire="+the_date.toGMTString();
			} else {
				var expire = "";
			}
			document.cookie = name + "=" + value + expire + "; path=/";
		}

		// Lire la valeur du cookies:
			// source = http://www.itx-technologies.com/blog/798-creer-et-gerer-un-cookie-en-javascript
		var readCookie = function( name ) {
			// Ajoute le signe égale virgule au nom
	        // pour la recherche
	        var name2 = name + "=";
	        // Array contenant tous les cookies
			var arrCookies = document.cookie.split( ';' );
			// Cherche l'array pour le cookie en question
			for( var i=0; i < arrCookies.length; i++ ) {
				var a = arrCookies[i];
				// Si c'est un espace, enlever
                while ( a.charAt( 0 )==' ' ) {
                  a = a.substring( 1,a.length );
                }
				if ( a.indexOf( name2 ) == 0 ) {
	              return a.substring( name2.length,a.length );
	            }
			}
			        // Aucun cookie trouvé
			return null;
		}

        // Avoir la position quand on bouge la souris
		canvas.addEventListener( 'mousemove', function( evt ) {
            var mousePos = getMousePos(canvas, evt);            
            oZone.mouse.x = mousePos.x;
            oZone.mouse.y = mousePos.y;
        } );

		//Vérifier si on met le son ou pas
        document.querySelector( '.sounds' ).addEventListener( 'click', function( evt ) {
            if( withSounds == 1 ){
                withSounds = 0;
                soundButton.title = "Activer le son"
                soundButtonImg.src = "./soundOn.svg";
            } else if ( withSounds == 0 ){
                withSounds = 1;
                soundButton.title = "Couper le son"
                soundButtonImg.src = "./soundOff.svg";
            }
        } );

        // Lancer le jeu au clic sur le H2
        document.querySelector( '.start' ).addEventListener( 'mousedown', function( evt ) {
			/* Script pour mettre en plein écran:
			var body = document.body;
 
			if(body.webkitRequestFullScreen) {
				body.webkitRequestFullScreen();
			}
			else {
				body.mozRequestFullScreen();
			}
			*/ 
            withSounds == 1 ? oStart.play() : "";
            var button = document.querySelector( '.start' ),
            	start_modal = document.querySelector( '.start_modal' );
            button.parentNode.removeChild( button );
            start_modal.parentNode.removeChild( start_modal );
            oZone.generateBubble();
            oZone.generateBonus();
			oZone.animate();
        } );

        // Check the cookies if sounds
        if ( readCookie( 'sounds' ) === null ) {
			createCookie( 'sounds', 1, 365 );
		} else {
			if ( readCookie( 'sounds' ) !== null ) {
				if ( readCookie( 'sounds' ) === "0" ) {
					withSounds = 0;
					soundButton.title = "Activer le son"
                	soundButtonImg.src = "./soundOn.svg";
				}
				if ( readCookie( 'sounds' ) === "1" ) {
					withSounds = 1;
					soundButton.title = "Couper le son"
                	soundButtonImg.src = "./soundOff.svg";
				}
			}
		}

	};

} )();