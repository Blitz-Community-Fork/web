/*  
**  (c) Copyright Si Dunford, Blitz Community 2022
*/

console.log( "Blitz Community Website" )
console.log( "(c) Copyright Si Dunford, Blitz Community 2022")

// Site router
const routes = [ 
    { path:"/" },
    { path:"test" },
    { path:"post/:id" }
]

// Launch our application
window.onload = function( e ){ 
    console.log( "window.onload" )
    document.title = "Welcome - Blitz Community Website"
    //
    loadTemplate( "example" )

    // Set up navigation
    document.addEventListener( "click", function(e) {
        if( e.target.matches( "[spa-link]" ) ) {
            e.preventDefault()
            navigation( e.target.href )
        }
    })
    window.addEventListener( "popstate", router )

    // Run the page router
    router()

}

// Map the route with the current URL
const pathToRegEx = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
function matchRoute() {
    routes.map( function( route ) {
        console.log( "- "+route.path )
        result = {
            path:route.path, 
            result:location.pathname.match( pathToRegEx( route.path ) )
        }
        console.log( result )
        return result
    })
}

function router() {
    console.log( "ROUTER RUNNING" )
    list = matchRoute()
    console.log( list )
    match = list.find( function( route ) {
        route.result !== null 
    })
    if( !match ) {
        match = {
            route: routes[0],
            result: [location.pathname]
        }
    }
    console.log( match )
    return match
}

// Navigates to a new page
function navigation( href ) {
    history.pushState( null, null, href )
    router()
}

// Load a template via XHR
function loadTemplate( filename ) {
    var xhr = new XMLHttpRequest()
    //var dom = document.getElementById( 'content' )
    
    xhr.onreadystatechange = function ( e ) { 
        if ( xhr.readyState == 4 && xhr.status == 200 ) {
            var template = xhr.responseText
            template = new DOMParser().parseFromString( template, 'text/html' )
            //document.getElementById( "templates" ).appendChild( template )
            document.head.append(template)
        }
    }
    
    xhr.open( "GET", filename, true )
    xhr.setRequestHeader( 'Accept', 'text/html' )
    xhr.send()
}