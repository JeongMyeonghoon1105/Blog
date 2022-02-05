module.exports = {
  HTML:(head, style, variousStyle, header, signInHeader, tabSignIn, categoryList, display, card, footer) => {
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
              <ul class="tab-items">${categoryList}</ul>
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
                ${categoryList}
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
  }, Header:(process, InOut) => {
    return `
    <div class="item" id="sign-in" onclick="location.href='/${process}'">
      <span data-tooltip-text="Sign ${InOut}"><i class="fas fa-user-circle"></i></span>
    </div>
    `
  }, Tab:(process, InOut) => {
    return `
    <div onclick="location.href='/${process}'" class="tab-sign">
      Sign ${InOut}
    </div>
    `
  }, postingItem:(category, element) => {
    return `
    <div class="posting-item">
      <div class="posting-container">
        <a href="/?category=${category}&title=${element}" class="posting-content">
          ${element}
        </a>
      </div>
    </div>
    `;
  }, buttonContainer:(process_1, process_2, btnName, category, title, color) => {
    return `
    <div class="button-container">
      <a href="/${process_1}_process/?category=${category}&title=${title}" class="update-delete-button" style="color: red;">
        DELETE
      </a>
      <a href="/${process_2}/?category=${category}&title=${title}" class="update-delete-button" style="color: ${color};">
        ${btnName}
      </a>
    </div>
    `;
  }, postContainer:(title, content) => {
    return `
    <div class="post-container">
      <h1 class="post-title">${title}</h1><br>
      <div class="post-contents">
        ${content}
      </div>
    </div>
    `;
  }, writeContainer:(content) => {
    return `
      <div class="post-contents">
        ${content}
      </div>
    `;
  }, postingItem:(category, title, date) => {
    return `
    <div class="posting-item">
      <div class="posting-container">
        <a href="/?category=${category}&title=${title}" class="posting-content">
          ${title}
        </a>
        <div class="posting-date">
          ${date}
        </div>
      </div>
    </div>
    `;
  }, trashItem:(elem, element) => {
    return `
    <div class="posting-item">
      <div class="posting-container">
        <a href="/trash/?category=${elem}&title=${element}" class="posting-content">
          ${element}
        </a>
        <div style="display: flex; min-width: 90px;">
          <a class="delete-button" href="/clear_process/?category=${elem}&title=${element}">
            DELETE
          </a>
          <div style="width: 5px;"></div>
          <a class="delete-button" href="/recover_process/?category=${elem}&title=${element}" style="color: green;">
            RECOVER
          </a>
        </div>
      </div>
    </div>
    `;
  }, descriptionArea:(descriptionContent) => {
    return `
    <div class="description-area">
      <h1>${descriptionContent}</h1>
    </div>
    `;
  }, notice:(noticeContent) => {
    return `
    <div class="notice">
      <text style="line-height: 0px;">
        ${noticeContent} is empty.
      </text>
    </div>
    `;
  }
}