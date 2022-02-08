module.exports = {
  // 로드될 페이지의 html 소스
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
            <img src="https://github.com/JeongMyeonghoon1105/Images/blob/main/Logo.png?raw=true" alt="Daniel's Tech Blog">
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
  },
  // 메뉴바
  list:(postingCount, display) => {
    return `
    <li><a href="/?category=Frontend">Frontend(${postingCount.frontend})</a></li>
    <li><a href="/?category=Backend">Backend(${postingCount.backend})</a></li>
    <li><a href="/?category=DevOps">DevOps(${postingCount.devops})</a></li>
    <li><a href="/?category=CS">CS(${postingCount.cs})</a></li>
    <li><a href="/trash" style="display: ${display}">Trash</a></li>
    `;
  },
  // 글 작성 페이지의 내용
  writtingArea:(category, title, data, categorySelect) => {
    return `
    <div class="writting-area">
      <form action="/update_process/?category=${category}&title=${title}" method="post">
        <!-- Title -->
        <div class="title">
          <textarea name="title" id="title-input" rows="1" cols="55" maxlength="100" placeholder="Title"
            value="${title}" required></textarea>
        </div>
        <div class="border"></div>
        <div>
          <textarea name="content" id="contents-input" style="white-space: pre-wrap;" 
          value="${data}" required></textarea>
        </div>
        <div class="border"></div>
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
        <div style="position: relative; height: 30px;">
          <button type="submit" class="post-button">Post</button>
        </div>
      </form>
    </div>
    `;
  },
  // 헤더 내부 Sign In/Out 버튼
  Header:(process, InOut) => {
    return `
    <div class="item" id="sign-in" onclick="location.href='/${process}'">
      <span data-tooltip-text="Sign ${InOut}"><i class="fas fa-user-circle"></i></span>
    </div>
    `
  },
  // 탭바 내부 Sign In/Out 버튼
  Tab:(process, InOut) => {
    return `
    <div onclick="location.href='/${process}'" class="tab-sign">
      Sign ${InOut}
    </div>
    `
  },
  // 게시물 페이지 하단 삭제/수정(복구) 버튼
  buttonContainer:(process_1, process_2, btnName, category, title, color) => {
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
  },
  // 게시물 제목 및 내용
  postContainer:(title, content) => {
    return `
    <div class="post-container">
      <h1 class="post-title">${title}</h1><br>
      <div class="post-contents">${content}</div>
    </div>
    `;
  },
  // 게시물 생성/수정시 DB에 저장할 컨텐츠 형식
  writeContainer:(content) => {
    return `
      <div class="post-contents">
        ${content}
      </div>
    `;
  },
  // 카테고리 페이지 내부 각 아이템(각 게시물로 연결되는 링크)
  postingItem:(category, title, date) => {
    return `
    <div class="posting-item">
      <div class="posting-container">
        <a href="/?category=${category}&title=${title}" class="posting-content">
          ${title}
        </a>
        <div class="posting-date">${date}</div>
      </div>
    </div>
    `;
  },
  // 휴지통 페이지 내부 각 아이템(각 게시물로 연결되는 링크)
  trashItem:(category, title) => {
    return `
    <div class="posting-item">
      <div class="posting-container">
        <a href="/trash/?category=${category}&title=${title}" class="posting-content">
          ${title}
        </a>
        <div style="display: flex; min-width: 90px;">
          <a class="delete-button" href="/clear_process/?category=${category}&title=${title}">
            DELETE
          </a>
          <div style="width: 5px;"></div>
          <a class="delete-button" href="/recover_process/?category=${category}&title=${title}" style="color: green;">
            RECOVER
          </a>
        </div>
      </div>
    </div>
    `;
  },
  // 페이지 제목란
  descriptionArea:(descriptionContent) => {
    return `
    <div class="description-area">
      <h1>${descriptionContent}</h1>
    </div>
    `;
  },
  // 카테고리/휴지통에 게시물이 없음을 알리는 문구
  notice:(noticeContent) => {
    return `
    <div class="notice">
      <text style="line-height: 0px;">
        ${noticeContent} is empty.
      </text>
    </div>
    `;
  }
}