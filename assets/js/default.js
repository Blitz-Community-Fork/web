/*  
**  (c) Copyright Si Dunford, Blitz Community 2022
*/

console.log( "Blitz Community Website" )
console.log( "(c) Copyright Si Dunford, Blitz Community 2022")

// Site router
const routes = [ 
    { view:"home",      hash:"#home" },
    { view:"example",   hash:"#page" },
    { view:"somewhere", hash:"#somewhere" },
    { view:"posts",     hash:"#post/:id" }
]

const COMPONENT404 = "<template><div class='error'>!ERR:{MESSAGE}</div></template>"

// Launch our application
window.onload = function( e ){ 
    console.log( "window.onload" )
    document.title = "Welcome - Blitz Community Website"
    //
    loadTemplate( "example" )

    // Set up navigation
//    document.addEventListener( "click", function(e) {
//        if( e.target.matches( "[spa-link]" ) ) {
//            e.preventDefault()
//            navigation( e.target.href )
 //       }
//    })
    window.addEventListener( "hashchange", router )
    window.addEventListener( "popstate", router )

    // Run the page router
    router()

}

// Map the route with the current URL
function matchRoute() {
    return routes.map( function( route ) {
        // console.log( "- "+route.hash+" vs "+location.hash )
        regex = new RegExp("^" + route.hash.replace(/:\w+/g, "(.+)") + "$");
        //console.log( "REGEX: "+regex )
        result = {
            view:route.view,
            hash:route.hash, 
            result:location.hash.match( regex )
        }
        //console.log( "RESULT: "+result.hash+"  :  "+result.result )
        return result
    })
}

// Uses the querystring to identify page content
function router() {
    console.log( "ROUTER RUNNING:" + location.hash )
    list = matchRoute()
    console.log( "LIST" )
    console.log( list )
    match = list.find( function( route ) {
        console.log( ">"+route.hash)
        return route.result !== null 
    })
    if( !match ) {
        match = {
            view: routes[0].view,
            hash: routes[0].hash,
            result: [routes[0].hash]
        }
    }
    console.log( "MATCH="+match.view+","+match.hash+","+match.result )
    
    // Load the page view
    loadFile( "assets/views/"+match.view+".html", show_view, match)
}

// Called when a component is loaded
function show_component( data, args, depth=0 ){
    var view = new DOMParser().parseFromString( data, 'text/html' )
    var style = view.querySelector("style")
    var template = view.querySelector("template")

    var content = document.getElementById( args.id )
    content.removeAttribute("component");
    content.innerHTML = ""
    if( style ) content.append( style )
    if( template ) content.append( template.content )

   // Deal with component sub-components
    // BEWARE THIS CAN CAUSE CONTINOUS LOOP
return

/*   console.log( "COMPONENTS:")
   var components = content.querySelectorAll( "[component]" )

   console.log( "LEVEL:"+i+","+components.length )

   components.forEach(element => {
       console.log( ":"+element.id )

       loadFile( "assets/components/"+element.id+".html", show_component, element )
   });
*/
}

// Navigates to a new page
function show_view( data, args ) {
//    history.pushState( null, null, href )
    var view = new DOMParser().parseFromString( data, 'text/html' )
    var style = view.querySelector("style")
    var template = view.querySelector("template")

    var content = document.getElementById( "content" )
    content.innerHTML = ""
    if( style ) content.append( style )
    if( template ) content.append( template.content )

    // Deal with PAGE components

    console.log( "COMPONENTS:")
    var components = document.querySelectorAll( "[component]" )

    if( components.length==0) break
    if( !components ) break
    console.log( "LEVEL:"+i+","+components.length )

    components.forEach(element => {
        console.log( ":"+element.id )

        loadFile( "assets/components/"+element.id+".html", show_component, element )
    });
}

// Load file via XHR
function loadFile( filename, callback, args ) {
    var xhr = new XMLHttpRequest()
    //var dom = document.getElementById( 'content' )
    
    xhr.onreadystatechange = function ( e ) { 
        if ( xhr.readyState == 4 && xhr.status == 200 ) {
            console.log( xhr.readyState+","+xhr.status )
            callback( xhr.responseText, args )
        } else if ( xhr.readyState == 4 && xhr.status == 404 ) {
            console.log( xhr.readyState+","+xhr.status )
            callback( COMPONENT404.replace("{MESSAGE}",filename), args )
        } else {
           console.log( xhr.readyState+","+xhr.status )
        }
    }
    
    xhr.open( "GET", filename, true )
    xhr.setRequestHeader( 'Accept', 'text/html' )
    xhr.send()
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