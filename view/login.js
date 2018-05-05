function initLoginFunc(){

  $('.btn-social').on('click',function(event) {
    var sel = $(this);
    var provider = sel.attr('provider');
    event.preventDefault();
    /* Act on the event */
    loginFrom(provider);
  });
}
initLoginFunc();
function loginFrom(src=null) {
  switch(src){
    case 'fb':
      break;
    case 'google':
      break;
    default:
      break;
  }
}
function login_fb(){
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}