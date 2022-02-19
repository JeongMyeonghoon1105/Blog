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

var card = document.getElementsByClassName('card');

/* Tab Down 표출된 상황에서 VW를 1250px 이상으로 늘릴 시 Tab Down 숨기기 */
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