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
  }, list:(postingCount, display) => {
    return `
    <li><a href="/?category=Frontend">Frontend(${postingCount.frontend})</a></li>
    <li><a href="/?category=Backend">Backend(${postingCount.backend})</a></li>
    <li><a href="/?category=DevOps">DevOps(${postingCount.devops})</a></li>
    <li><a href="/?category=CS">CS(${postingCount.cs})</a></li>
    <li><a href="/trash" style="display: ${display}">Trash</a></li>
    `;
  }, writtingArea:(category, title, data, categorySelect) => {
    return `
    <div class="writting-area">
      <!-- 수정할 데이터 입력란 -->
      <form action="/update_process/?category=${category}&title=${title}" method="post">
        <!-- Title -->
        <div class="title">
          <textarea name="title" id="title-input" rows="1" cols="55" maxlength="100" placeholder="Title"
            value="${title}" required></textarea>
        </div>
    
        <div class="border"></div>
    
        <!-- Contents -->
        <div>
          <textarea name="content" id="contents-input" style="white-space: pre-wrap;" 
          value="${data}" required></textarea>
        </div>
    
        <div class="border"></div>
    
        <!-- Categoties -->
        <div class="category">
          <select name="category" id="category-input" required>
            <option value="Frontend" ${categorySelect.frontend}>Frontend</option>
            <option value="Backend" ${categorySelect.backend}>Backend</option>
            <option value="DevOps" ${categorySelect.devops}>DevOps</option>
            <option value="CS" ${categorySelect.cs}>CS</option>
          </select>
        </div>
    
        <div class="br"></div>
        <div class="br"></div>
        <div class="br"></div>
    
        <!-- Post Button -->
        <div style="position: relative; height: 30px;">
          <button type="submit" class="post-button">
            Post
          </button>
        </div>
      </form>
    </div>
    `;
  }
}
