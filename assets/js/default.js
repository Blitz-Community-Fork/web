/*  
**  (c) Copyright Si Dunford, Blitz Community 2022
*/

console.log( "Blitz Community Website" )
console.log( "(c) Copyright Si Dunford, Blitz Community 2022")

// Current page
var spa = undefined

//var page = undefined
var templates = undefined

// Site router
const routes = [ 
    { route:"/",                    view:"home",},
    { route:"/showcase/<language>", view:"showcase" }
]

// Launch our application
window.onload = function( e ){ 
    //console.log( "window.onload" )
    document.title = "Blitz Community Website"

    // Attach page to a component
    //templates = document.querySelector( "templates" )

    // Check for template support in the browser
    if( !("content" in document.createElement( "template" )) ) {
        page.innerHTML = "Please update to a Modern Browser to use this website"
        return
    }

    // Navigation events
    //window.addEventListener( "popstate", router )

    // Initialise the single page application
    spa = SPA( routes )

    // Update the error component (with nicely formatted error boxes)
    spa.error( '<div class="error w3-container w3-round w3-red w3-padding-16 w3-center"><i class="fa fa-bug w3-xlarge"></i><p><b>{TITLE}</b><br/>{MESSAGE}</p></div>')

    // Run the SPA
    spa.run()


}

// Fucntion to toggle a class in the interface
function toggleClass( id, toggle='w3-hide' ) {
    var element = document.getElementById( id );
    element.classList.toggle( toggle );
}





// Load file via XHR
function loadFile( dom, filename ) {
    var xhr = new XMLHttpRequest()
    //var dom = document.getElementById( 'content' )
    
    xhr.onreadystatechange = function ( e ) { 
        if ( xhr.readyState == 4 && xhr.status == 200 ) {
            //console.log( xhr.readyState+","+xhr.status )
            show_component( dom, xhr.responseText )
        } else if ( xhr.readyState == 4 && xhr.status == 404 ) {
            //console.log( xhr.readyState+","+xhr.status )
            show_component( dom, ERROR.replace("{MESSAGE}",filename) )
        } else {
           //console.log( xhr.readyState+","+xhr.status )
        }
    }
    
    xhr.open( "GET", filename, true )
    xhr.setRequestHeader( 'Accept', 'text/html' )
    xhr.setRequestHeader( 'Cache-Control', 'max-age=0' )
    xhr.send()
}


