var card = document.getElementsByClassName('card');
var id = parseInt(card[0].id);
var signInContainer = document.getElementsByClassName('signin-container');
var signInMain = document.getElementsByClassName('signin-main');
var signInForm = document.getElementsByClassName('signin-form');

function changeHeight() {
  if (window.innerWidth > 900) {
    if (id%2==0) {
      card[0].setAttribute('style', `height: ${id/2*385+90}px`);
    } else {
      card[0].setAttribute('style', `height: ${(parseInt(id/2)+1)*385+90}px`);
    }
  } else if (window.innerWidth > 675) {
    card[0].setAttribute('style', `height: ${id*520+90}px`);
  } else if (window.innerWidth > 562.5) {
    card[0].setAttribute('style', `height: ${id*452.5+90}px`);
  } else if (window.innerWidth > 450) {
    card[0].setAttribute('style', `height: ${id*385+90}px`);
  } else if (window.innerWidth > 337.5) {
    card[0].setAttribute('style', `height: ${id*328+90}px`);
  } else if (window.innerWidth > 270) {
    card[0].setAttribute('style', `height: ${id*286+90}px`);
  }

  if (id==0)
    card[0].setAttribute('style', 'height: 100vh');
  
  if (window.innerHeight < 500) {
    signInContainer.setAttribute('style', 'height: 350px;');
    signInMain.setAttribute('style', 'height: 350px;');
    signInForm.setAttribute('style', 'height: 260px;');
  }
}

window.addEventListener('resize', () => {
  changeHeight();
})

window.addEventListener('load', () => {
  changeHeight();
})

/* Menu Icon */
var menuIcon = document.getElementById('menu-icon');
/* Menu Icon Container */
var hiddenMenu = document.getElementById('hidden-menu');
/* Tab-Down */
var tabDown = document.getElementById('tab-down');
var tabDownInner = document.getElementById('tab-down-inner');
/* Tab-Down Search Bar */
var tabSearchContainer = document.getElementById('tab-search-container');
var tabSearch = document.getElementById('tab-search');
/* Tab-Down Sign In Button */
var tabSign = document.getElementById('tab-sign');
/* Tab-Down Menu List */
var tabItems = document.getElementById('tab-items');
/* Tab-Down Post Button */
var tabList = document.getElementById('tab-post-container');

var mainMenu = document.getElementById('main-menu');
var searchToggle = document.getElementById('search');
var searchContainer = document.getElementById('search-container');

window.addEventListener('resize', () => {
  if (window.innerWidth > 1250) {
    /* Menu Icon 복구 */
    menuIcon.className = 'fas fa-bars';
    menuIcon.setAttribute('style', 'font-size: 23px;');

    /* Tab Down 가리기 */
    tabDown.setAttribute('style', 'pointer-events: none; height: 0; transition: 0;');
    tabDownInner.setAttribute('style', 'pointer-events: none; height: 0; transition: 0;');
    tabSearchContainer.setAttribute('style', 'opacity: 0; pointer-events: auto; transition: 0;');
    tabSearch.setAttribute('style', 'opacity: 0; pointer-events: auto; transition: 0;');
    tabSign.setAttribute('style', 'opacity: 0; pointer-events: none; transition: 0;');
    tabItems.setAttribute('style', 'opacity: 0; pointer-events: none; transition: 0;');
    tabList.setAttribute('style', 'opacity: 0; pointer-events: none; transition: 0;');
  }
})

