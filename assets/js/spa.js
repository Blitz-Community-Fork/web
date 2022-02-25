// SPA - Single Page Application
// (c) Copyright Si Dunford, February 2022, All Right Reserved
//
// https://github.com/itspeedway/spa.js.git
//
// Version 1.0

const MAX_COMPONENT_DEPTH = 3

function SPA( initial ){
	return new SinglePageApplication( initial )
}

class SinglePageApplication{

	constructor( initial ){
        console.log( "#" )
        console.log( "# Single Page Application" )
        console.log( "# (c) Copyright Si Dunford, February 2022, All Right Reserved" )
        console.log( "# https://github.com/itspeedway/spa.js.git" )
        console.log( "#" )
		this.router = new Router( initial )
	}

    // Launch the current page
    run() {
        this.router.navigate()
	}

	navigate( hash, method ){
		this.router.navigate( hash, method )
	}
	
	addRoute( pattern, view, methods="GET" ){
		this.router.add( pattern, view, methods )
	}

	removeRoute( pattern, methods="GET" ){
		this.router.remove( pattern, methods )
	}

    // Provide replacement error template
    error( data ) {
        this.router.error = data 
    }

	reveal() {
		this.router.reveal()
	}
}

class Router {

	constructor( routes, content="content" ){
		console.log( "Router.constructor()" )
		this.routes = {}

        // Initialise page content
        this.page = document.getElementById( content )
        if( !this.page ){ 
            this.page = document.createElement("div")
            this.page.setAttribute( "id", content )
            document.body.append( this.page )
         }

        // Initialise template store
        this.templates = document.createElement("templates")
        document.body.append( this.templates )

        // Initialise routes
		for( var route in routes ){
            var path = routes[route]
			this.add( path["route"], path["view"], path["method"] )
		}

        // Initialise internal error template
        this.error = '<div class="error"><p><b>{TITLE}</b><br/>{MESSAGE}</p></div>'
 
		// Handle links and form submissions
		//window.addEventListener( "hashchange", this.hashChange.bind(this) )
		window.addEventListener( "hashchange", function(){
		    console.log( "HASH CHANGE EVENT = "+location.hash )
		    this.navigate( location.hash, "GET" )
        }.bind(this) )

		// console.log( "  "+ JSON.stringify(this.routes) )
    }
	
	// Called when the page has changes
//	hashChange() {
//		console.log( "HASH CHANGE EVENT = "+location.hash )
//		
//		// Navigate
//		this.navigate( location.hash, "GET" )
//		
//	}
	
	// Returns the current has without leading "#"
//	location( url=location.hash ) {
//		return url.setstring(1)
//	}

	// Adds a route
	add( pattern, view, methods="GET" ){
//		route = route.toLowerCase()
//		if( !this.routes[route] ) { this.routes[route]={} }
//		if( !this.routes[route][method] ) { 
//			this.routes[route][method] = view
//		}

		console.log( "Router.add()" )
		console.log( "  pattern="+pattern )
		console.log( "  methods="+methods )
		//console.log( "  view="+view )
		//console.log( "  "+ JSON.stringify(this.routes) )
		//
		if( this.routes[pattern] ){
			// Update a route
			var route = this.routes[pattern]
			route.add( view, methods )
		} else {
			// Add a route
			var route = new Route( pattern, view, methods )
			this.routes[ pattern ] = route	
		}
	}
	
	// Remove a route
	remove( pattern, methods="GET" ){
		//route = route.toLowerCase()
		if( this.routes[pattern] ) { 
			var route = this.routes[pattern]
			route.remove( methods )
			console.log( route.countMethods() )
			if( route.countMethods() == 0 ) {
				delete this.routes[pattern]
			}
		}
		// Clean up empty object
		//if( Object.keys( this.routes[route] ).length == 0 ) {
		//	delete this.routes[route] 
		//}
	}
	
	// Navigate to a specified hash
	navigate( hash=location.hash, method="GET" ) {
		var url = hash
		// Remove leading hash symbol
		if( url.charAt(0)=="#" ) { url = url.substring(1) }
		if( url == '' ) { url = "/" }
console.log( "NAVIGATING TO: '"+hash+"' ["+method+"]" )
console.log( " url="+url )
		
console.log( "MATCHING:" )
        var request = null
		for( var pattern in this.routes ){
console.log( "  Pattern: "+pattern )
			var route = this.routes[pattern]
			request = route.match( url, method )
			if( request ){
//console.log( "  - "+JSON.stringify( request ) )
                console.log( "  - Matches" )
				//var view = request["view"]
				//view( request )
				break
			//} else {
            //    console.log( "  - No match" )
			}
		}
        // Load page
        if( request ){
            this.loadTemplate( request.view, "assets/views/"+request.view+".html", this.pageLoaded.bind(this) )
        } else {
            console.log( " 404 PAGE NOT FOUND?" )
            var clone = this.errorComponent( "404 Page not found", url )
            this.pageLoaded( url, clone, 0 )
	    }	
	}
	
	// Method to debug
	reveal() {
		console.log( "REVEAL - start" )
		for( var pattern in this.routes ){
			var route = this.routes[pattern]
			for( var method in route.views ){
				console.log( pattern + " [" + method + "]" )
			}
		}
		console.log( "REVEAL - done" )
	}

    // Called when a new page is loaded
    pageLoaded( dom, clone ) {
    //console.log( "pageLoaded()")
        //var clone = template.content.cloneNode( true )
        this.page.innerHTML = ""
        this.page.appendChild( clone )
        //
        this.loadComponents( this.page )
    }

    // Used to load individual components
    loadComponents( dom, depth=0 ) {
if( !this ) console.log( "loadcomponent is not a method" )

        //console.log( "loadComponents()")
        var components = dom.querySelectorAll( "[component]" )
        depth ++
        //var timestamp = +new Date;

        components.forEach( function( component ){

            if( depth>5 ){
                var clone = this.errorComponent( "Depth Exceeded", component.id  )
                //var template = document.querySelector( 'template[id="error"]' )
                //var clone = template.content.cloneNode( true )
                //var error = clone.querySelector( ".error" )
                //error.innerHTML = error.innerHTML.replace( "{MESSAGE}", "DEPTH EXCEEDED" )
                this.componentLoaded( component.id, clone, depth )
            } else {

                console.log( ":"+component.id )
                // Check if component is already loaded
                var template = document.querySelector( 'template[id="'+component.id+'"]' )
                if( template ) {
                    //console.log( "- COMPONENT ALREADY LOADED" )
                    var clone = template.content.cloneNode( true )
                    this.componentLoaded( component.id, clone, depth )
                } else {
                    console.log( "- COMPONENT '"+component.id+"' IS NOT LOADED" )
                    this.loadTemplate( component.id, "assets/components/"+component.id+".html", this.componentLoaded.bind(this), depth )
                }

            }

        }.bind(this)); 
    }

    // Called when a component is loaded    
    componentLoaded( name, clone, depth ) {
        console.log( "COMPONENT '"+name+"' LOADED" )
        //var clone = template.content.cloneNode( true )
        var dom = document.getElementById( name )
        dom.innerHTML = ""
        dom.append( clone )

        // Load subcomponents:
        this.loadComponents( dom, depth+1 )
    }

    // Creates an error component using the internal template
    errorComponent( title, message ){
        var dom = document.createElement("div")
        // Clone the error template
        var clone = this.error
        clone = clone.replace( "{TITLE}", title )
        clone = clone.replace( "{MESSAGE}", message )
        console.log( clone )
        // Add clone
        dom.innerHTML = clone
        dom.append( document.createElement("br") )
        return dom 
    }

    // Load a template via XHR
    loadTemplate( name, filename, callback, depth=0 ) {
        var xhr = new XMLHttpRequest()
        //var dom = document.getElementById( 'content' )
        
        xhr.onreadystatechange = function ( e ) { 
            if ( xhr.readyState == 4 && xhr.status == 200 ) {
                //console.log( xhr.readyState+","+xhr.status )
                var template = new DOMParser().parseFromString( xhr.responseText, 'text/html' )
                    .querySelector("template")
                if( template ) { 
                    //console.log( "template loaded")
                    template.id = name
                    this.templates.append( template ) 
                    if( callback ) { 
                        var dom = this.templates.querySelector( 'template[id="'+name+'"]' )
                        var clone = template.content.cloneNode( true )
                        callback( name, clone, depth )
                    }
                } else {
                    //console.log( "Missing <template> tag in '"+filename+"'" )
                    // Show Error component
                    var clone = this.errorComponent( "500 Bad File Syntax", name )
                    //var dom = document.querySelector( 'template[class="error"]' )
                    //var clone = template.content.cloneNode( true )
                    //var error = clone.querySelector( ".error" )
                    //error.innerHTML = error.innerHTML.replace( "{MESSAGE}", filename )
                    callback( name, clone, depth )
                }
            } else if ( xhr.readyState == 4 && xhr.status == 404 ) {
                //console.log( "Failed to load '"+filename+"'" )
                //console.log( xhr.readyState+","+xhr.status )
                // Show Error component
                var clone = this.errorComponent( "404 Missing Component", name )
                //var dom = document.querySelector( 'template[id="error"]' )
                //var clone = template.content.cloneNode( true )
                //var error = clone.querySelector( ".error" )
                //error.innerHTML = error.innerHTML.replace( "{MESSAGE}", filename )
                callback( name, clone, depth )
            //} else {
               //console.log( xhr.readyState+","+xhr.status )
            }
        }.bind(this)
        
        xhr.open( "GET", filename, true )
        xhr.setRequestHeader( 'Accept', 'text/html' )
        xhr.setRequestHeader( 'Cache-Control', 'max-age=0' )
        xhr.send()
    }


}

// An individual route held in the Router
class Route {

	constructor( pattern, view, methods=["GET","POST"] ) {
		console.log( "Route.constructor()" )
		//console.log( "  Methods "+methods )

		//this.pattern = pattern
		this.views = {}
		this.params = [""]	// First element (0) is null to allow lookup

		// Add methods
		this.add( view, methods )
	
		// Identify parameters <NAME>
		
		var matches = pattern.match( /(<\w+>)/g )
		//this.params = ( this.params == null ? [] : Array.from( this.params ) )
		// Strip &gt; and &lt; symbols from params
		for( var match in matches ){
			var param = matches[match]
			this.params.push( param.replace( /<(.*)>/g, "\$1" ) )
		}
		console.log( "  NAMES: "+this.params )
			
		// Create Regex to extract params
		pattern = "^"+pattern+"$"
		pattern = pattern.replace( /(<\w+>)/g, "([^\/]+)" )
		console.log( "  REGEX: "+pattern )
		this.regex = new RegExp( pattern )		
	}
	
	add( view, methods ){
		// methods should be an arry, but support string:
		methods = ( Array.isArray( methods ) ? methods : [methods] )
		
		// View handlers
		for( var i in methods ){
			var method = methods[i]
			this.views[ method.toUpperCase() ] = view
		}
	}
	
	remove( methods ){
		// methods should be an arry, but support string:
		methods = ( Array.isArray( methods ) ? methods : [methods] )

		// View handlers
		for( var i in methods ){
			var method = methods[i]
			if( this.views[ method.toUpperCase() ] ){
				delete( this.views[ method.toUpperCase() ] )
			}
		}
	}
	
	countMethods() {
		return Object.keys( this.views ).length
	}
	
	match( url, method ){
		console.log( "    Route Matching '"+url+"'" )
		var result = this.regex.exec( url )
		//console.log( "    "+typeof(result) )
		//console.log( "    "+Object.prototype.toString.call(result) )
		//console.log( "    "+result+", "+JSON.stringify( result ) )
		//console.log( "    "+this.params )
		//console.log( "    "+Object.prototype.toString.call(this.params) )
		if( result ) {
			var request = { 
				args:{},
				method:method,
				view:this.views[method],
			}
			// Generate arguments list
			if( this.params.length>1 ) {		
				for( var i=1; i<this.params.length; i++ ) {
					console.log( i + ","+this.params[i]+", "+result[i] )
					request.args[ this.params[i] ] = result[i]
				}
			}
			console.log( request )
			return request
		} else {
			return null
		}
	}
	
//	view( method ){
//		return this.views( method )
//	}
	
}





