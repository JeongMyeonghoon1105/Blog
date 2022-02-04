module.exports = {
  HTML:(head, style, variousStyle, header, signInHeader, tabSignIn, list, display, card, footer) => {
    return `
    <html lang="ko">

    <head>
      ${head}
      <style>
        ${style}
      </style>
    </head>
    
    <body style="${variousStyle.bodyStyle}">
      <style>${display}</style>

      <!-- HEADER -->
      <header style="${variousStyle.headerStyle}">
        <div class="inner">
          <!-- LOGO -->
          <a href="/" class="logo">
            <img src="https://github.com/JeongMyeonghoon1105/Story-Mate/blob/master/images/Logo.png?raw=true" alt="Daniel's Tech Blog">
          </a>
          <!-- SEARCH BAR -->
          <input type="text" id="search-bar" placeholder="Search...">
          <!-- MAIN MENU -->
          <div class="main-menu" id="main-menu">
            ${header}
            <!-- 5th Item of Menu (Sign In) -->
            ${signInHeader}
          </div>
          <!-- Hidden Item (Menu) -->
          <div class="item" id="hidden-menu"><i class="fas fa-bars"></i></div>
          <div id="tab-down">
            <div class="tab-down-inner">
              ${tabSignIn}
              <ul class="tab-items">${list}</ul>
              <div style="display: inline-block; padding: 20px; height: 22px;">
                <h2 style="display: ${display}; color: white; font-weight: bold; cursor: pointer;" onclick="location.href='/post'">
                  Post
                </h2>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- WRAP -->
      <div class="wrap" style="${variousStyle.wrapStyle}">
        <div class="inner" style="${variousStyle.innerStyle}">
          <!-- CARD -->
          <div class="card" style="${variousStyle.cardStyle}">${card}</div>
          <!-- MENU -->
          <div class="menu" style="${variousStyle.menuStyle}">
            <div class="contents">
              <h1>Menu</h1><br>
              <ul style="list-style-type: none; font-size: 15px;">
                ${list}
              </ul><br>
              <h2 style="display: ${display}; font-weight: bold; cursor: pointer;" onclick="location.href='/post'">
                Post
              </h2>
            </div>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      ${footer}

    </body>
    
    </html>
    `;
  }, list:(frontend, backend, devops, cs, display) => {
    return `
    <li><a href="/?category=Frontend">Frontend(${frontend})</a></li>
    <li><a href="/?category=Backend">Backend(${backend})</a></li>
    <li><a href="/?category=DevOps">DevOps(${devops})</a></li>
    <li><a href="/?category=CS">CS(${cs})</a></li>
    <li><a href="/trash" style="display: ${display}">Trash</a></li>
    `;
  }
}
