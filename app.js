// 모듈 요청
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var signIn = 0;

// 로그인하지 않은 사용자의 관리자 전용 페이지 접속 시도를 차단
function access_deny() {
  if (signIn == 0) {
    response.writeHead(302, {
      Location: encodeURI('/')
    });
    response.end();
  }
}

// 서버 생성
var app = http.createServer((request, response) => {
  var requestedURL = request.url;
  var queryData = url.parse(requestedURL, true).query;
  var pathname = url.parse(requestedURL, true).pathname;

  // 로그인하지 않은 사용자에 대해 관리자 전용 기능 숨기기
  if (signIn == 0) { var display = 'none'; }
  else { var display = 'block'; }

  // 카테고리별 게시물 수를 객체에 저장
  var postingCount = {
    'frontend': fs.readdirSync('./texts/Frontend/').length,
    'backend': fs.readdirSync('./texts/Backend/').length,
    'devops': fs.readdirSync('./texts/DevOps/').length,
    'cs': fs.readdirSync('./texts/CS/').length
  }

  // HEAD
  var head = fs.readFileSync('./texts/head', 'utf8');

  // STYLE
  var style = fs.readFileSync('./css/variables.css', 'utf8');
  style = style + fs.readFileSync('./css/common.css', 'utf8');
  style = style + fs.readFileSync('./css/header.css', 'utf8');
  style = style + fs.readFileSync('./css/menu.css', 'utf8');
  style = style + fs.readFileSync('./css/footer.css', 'utf8');

  var variousStyle = {
    'bodyStyle': '/* */',
    'headerStyle': '/* */',
    'wrapStyle': '/* */',
    'innerStyle': '/* */',
    'cardStyle': '/* */',
    'menuStyle': '/* */'
  }

  // 페이지 좌상단 제목 추가
  function descriptionArea(descriptionContent) {
    return `<div class="description-area"><h1>${descriptionContent}</h1></div>`
  }

  // 카테고리가 비어있음을 안내
  function notice(noticeContent) {
    return `<div class="notice"><text style="line-height: 0px;">${noticeContent} is empty.</text></div>`
  }

  // HEADER
  var header = fs.readFileSync('./texts/header', 'utf8');

  // MENU
  var list =
  `
  <li><a href="/?category=Frontend">Frontend(${postingCount.frontend})</a></li>
  <li><a href="/?category=Backend">Backend(${postingCount.backend})</a></li>
  <li><a href="/?category=DevOps">DevOps(${postingCount.devops})</a></li>
  <li><a href="/?category=CS">CS(${postingCount.cs})</a></li>
  <li><a href="/trash" style="display: ${display}">Trash</a></li>
  `;

  // FOOTER
  var footer = fs.readFileSync('./texts/footer', 'utf8');

  // 로그인 여부에 따라 헤더의 스타일을 달리 적용
  if (signIn == 0) {
    var signInHeader =
    `
    <div class="item" id="sign-in" onclick="location.href='/signin'">
      <span data-tooltip-text="Sign In"><i class="fas fa-user-circle"></i></span>
    </div>
    `
    var tabSignIn =
    `<div onclick="location.href='/signin'" class="tab-sign">Sign In</div>`
  } else {
    var signInHeader =
    `
    <div class="item" id="sign-in" onclick="location.href='/signin_process'">
      <span data-tooltip-text="Sign Out"><i class="fas fa-user-circle"></i></span>
    </div>
    `
    var tabSignIn =
    `<div onclick="location.href='/signin_process'" class="tab-sign">Sign Out</div>`
  }

  function templateHTML(card) {
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
    `
  }

  // pathname이 '/'일 때
  if (pathname === '/') {
    // 메인 페이지
    if (queryData.category === undefined) {
      variousStyle.cardStyle = 'background-color: rgb(245, 245, 255);';
      style = style + fs.readFileSync('./css/main.css', 'utf8');
      var card = fs.readFileSync('./texts/card', 'utf8');
    }
    // 카테고리별 게시물 목록
    else if (((queryData.category == 'Frontend') || (queryData.category == 'Backend') || (queryData.category == 'DevOps') || (queryData.category == 'CS')) && queryData.title === undefined) {
      style = style + fs.readFileSync('./css/category.css', 'utf8');
      var filelist = fs.readdirSync(`./texts/${queryData.category}`);

      var card = descriptionArea(queryData.category);

      // 현재 카테고리에 게시물이 없을 때, 안내 메시지 표시
      if (filelist.length == 0) { card = card + notice(`${queryData.category} category`); }
      // 현재 카테고리에 이미 게시물이 존재할 때, 게시물 목록 표시
      else {
        filelist.forEach((element) => {
          card = card +
          `
          <div class="posting-item">
            <div class="posting-container">
              <a href="/?category=${queryData.category}&title=${element}" class="posting-content">
                ${element}
              </a>
            </div>
          </div>
          `;
        });
      }
    }
    // 게시물 페이지
    else if ((queryData.category == 'Frontend') || (queryData.category == 'Backend') || (queryData.category == 'DevOps') || (queryData.category == 'CS')) {
      style = style + fs.readFileSync('./css/post.css', 'utf8');
      var card = fs.readFileSync(`./texts/${queryData.category}/${queryData.title}`, 'utf8');

      // 로그인된 상태일 경우 삭제 및 편집 버튼을 게시물 페이지 하단에 추가
      if (signIn == 1) {
        card = card + 
        `
        <div class="button-container">
          <a href="/delete_process/?category=${queryData.category}&title=${queryData.title}" class="update-delete-button" style="color: red;">
            DELETE
          </a>
          <a href="/update/?category=${queryData.category}&title=${queryData.title}" class="update-delete-button" style="color: gray;">
            UPDATE
          </a>
        </div>
        `
      }
    }

    response.writeHead(200);
    response.end(templateHTML(card));
  }
  // pathname이 '/signin'일 때(로그인 페이지)
  else if (pathname === '/signin') {
    variousStyle.headerStyle = 'display: none;';
    variousStyle.cardStyle = 'background-color: rgb(245, 245, 255);';
    variousStyle.menuStyle = 'display: none;';
    style = style + fs.readFileSync('./css/signin.css', 'utf8');
    var card = fs.readFileSync('./texts/sign-in', 'utf8');

    response.writeHead(200);
    response.end(templateHTML(card));
  }
  // pathname이 '/signin_process'일 때(로그인/아웃 처리)
  else if (pathname == '/signin_process') {
    if(signIn == 0) {
      var password = fs.readFileSync('./password', 'utf8');
      var body = ""

      // 포스팅할 데이터를 요청해 변수에 저장
      request.on('data', (data) => {
        body = body + data;

        // 포스팅할 게시물 길이가 너무 길어질 경우 커넥션 파괴
        if (body.length > 1e6) {
          request.connection.destroy();
        }
      });
      
      // 입력한 비밀번호를 실제 비밀번호와 대조
      request.on('end', () => {
        var post = qs.parse(body);
        var input_password = post.password;

        // 입력한 비밀번호가 실제 비밀번호와 일치하면 로그인 처리 진행 및 메인 화면으로 리다이렉트
        if (password == input_password) {
          signIn = 1;
          response.writeHead(302, {
            Location: encodeURI('/')
          });
        }
        // 입력한 비밀번호가 실제 비밀번호와 일치하지 않으면 로그인 화면으로 리다이렉트
        else {
          response.writeHead(302, {
            Location: encodeURI('/signin')
          });
        }
        response.end();
      });
    } else {
      signIn = 0;
      response.writeHead(302, {
        Location: encodeURI('/')
      });
      response.end();
    }
  }
  // pathname이 '/post'일 때(글 작성 페이지)
  else if (pathname === '/post') {
    access_deny();

    variousStyle.bodyStyle = 'height: 1200px;';
    variousStyle.wrapStyle = 'height: 1150px;';
    variousStyle.innerStyle = 'height: 1150px;';
    variousStyle.cardStyle = 'height: 1150px;';
    style = style + fs.readFileSync('./css/write.css', 'utf8');
    var card = descriptionArea('Post');
    card = card + fs.readFileSync('./texts/write', 'utf8');
    
    response.writeHead(200);
    response.end(templateHTML(card));
  }
  // pathname이 '/post_process'일 때(작성된 데이터를 처리하여 게시물 생성)
  else if (pathname === '/post_process') {
    access_deny();

    var body = ""

    // 포스팅할 데이터를 요청해 변수에 저장
    request.on('data', (data) => {
      body = body + data;

      // 포스팅할 게시물 길이가 너무 길어질 경우 커넥션 파괴
      if (body.length > 1e6) {
        request.connection.destroy();
      }
    });

    // 포스팅 및 기타 처리
    request.on('end', () => {
      var post = qs.parse(body);
      var title = post.title;
      var content = post.content;
      var category = post.category;

      // 파일 쓰기(새 게시물)
      fs.writeFileSync(`texts/${category}/${title}`,
      `
      <div class="post-container">
        <h1 class="post-title">${title}</h1><br>
        <div class="post-contents">
          ${content}
        </div>
      </div>
      `,
      'utf8');

      // 포스팅 후, 방금 작성한 게시물로 리다이렉션
      response.writeHead(302, {
        Location: encodeURI(`/?category=${category}&title=${title}`)
      });
      response.end();
    });
  }
  // pathname이 '/update/'일 때(게시물 수정 페이지)
  else if (pathname === '/update/') {
    access_deny();

    style = style + fs.readFileSync('./css/write.css', 'utf8');
    var data = fs.readFileSync(`./texts/${queryData.category}/${queryData.title}`, 'utf8');

    var categorySelect = {
      'frontend': `<!----`,
      'backend': `<!----`,
      'devops': `<!----`,
      'cs': `<!----`
    }
    
    // 수정할 게시물의 원래 카테고리를 디폴트 값으로 설정
    if (queryData.category === 'Frontend')
      categorySelect.frontend = `selected`;
    else if (queryData.category === 'Backend')
      categorySelect.backend = `selected`;
    else if (queryData.category === 'DevOps')
      categorySelect.devops = `selected`;
    else if (queryData.category === 'CS')
      categorySelect.cs = `selected`;

    var card = descriptionArea('Update') + 
      `
      <div class="writting-area">
        <!-- 수정할 데이터 입력란 -->
        <form action="/update_process/?category=${queryData.category}&title=${queryData.title}" method="post">
          <!-- Title -->
          <div class="title">
            <textarea name="title" id="title-input" rows="1" cols="55" maxlength="100" placeholder="Title"
              value="${queryData.title}" required></textarea>
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
    
    response.writeHead(200);
    response.end(templateHTML(card));
  }
  // pathname이 '/update_process/'일 때(브라우저에서 게시물 수정 데이터를 송신했을 때)
  else if (pathname === '/update_process/') {
    access_deny();

    var body = ""

    // 포스팅할 데이터를 요청해 변수에 저장
    request.on('data', (data) => {
      body = body + data;

      // 포스팅할 게시물 길이가 너무 길어질 경우 커넥션 파괴
      if (body.length > 1e6) {
        request.connection.destroy();
      }
    });

    // 포스팅 및 기타 처리
    request.on('end', () => {
      var post = qs.parse(body);
      var title = post.title;
      var content = post.content;
      var category = post.category;

      // 파일 영구 삭제
      fs.unlinkSync(`./texts/${queryData.category}/${queryData.title}`);
      // 수정된 내용으로 새 파일 쓰기
      fs.writeFileSync(`./texts/${category}/${title}`,
      `
      <div class="post-container">
        <h1 class="post-title">${title}</h1><br>
        <div class="post-contents">
          ${content}
        </div>
      </div>
      `,
      'utf8');

      // 포스팅 후 게시물로 리다이렉션
      response.writeHead(302, {
        Location: encodeURI(`/?category=${category}&title=${title}`)
      });
      response.end();
    });
  }
  // pathname이 '/delete_process'일 때(일반 게시물 삭제 버튼을 눌렀을 때)
  else if (pathname === '/delete_process/') {
    access_deny();

    // 파일을 휴지통으로 이동
    fs.renameSync(`./texts/${queryData.category}/${queryData.title}`, `./texts/Trash/${queryData.category}/${queryData.title}`);

    // 카테고리 페이지로 리다이렉트
    response.writeHead(302, {
      Location: encodeURI(`/?category=${queryData.category}`)
    });
    response.end();
  }
  // pathname이 '/trash'일 때(휴지통에 담긴 게시물의 목록)
  else if (pathname === '/trash') {
    access_deny();

    style = style + fs.readFileSync('./css/trash.css', 'utf8');
    var card = descriptionArea('Trash');
    
    var filesInTrash = 0;

    // Trash 폴더 내부 폴더(카테고리)들의 리스트를 변수에 저장
    var directorylist = fs.readdirSync('texts/Trash');

    // Trash 폴더 내부 각 카테고리에 속한 파일들을 모두 검사
    directorylist.forEach((elem) => {
      var filelist = fs.readdirSync(`./texts/Trash/${elem}`);

      // 현재 카테고리(휴지통)에 저장된 모든 파일의 제목을 디자인 형식에 대입한 후, card 변수에 덧붙이기
      filelist.forEach((element) => {
        card = card +
        `
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

        // 휴지통이 비었는지 검사
        if (filelist.length != 0) {
          filesInTrash = 1;
        }
      });
    });

    // 휴지통이 비었을 때, 안내 메시지를 출력
    if (filesInTrash == 0) { card = card + notice('Trash'); }

    response.writeHead(200);
    response.end(templateHTML(card));
  }
  // 휴지통에 담긴 게시물
  else if (pathname === '/trash/') {
    access_deny();

    style = style + fs.readFileSync('./css/post.css', 'utf8');
    var card = fs.readFileSync(`./texts/Trash/${queryData.category}/${queryData.title}`, 'utf8');
    card = card + 
      `
      <div class="button-container">
        <a href="/clear_process/?category=${queryData.category}&title=${queryData.title}" class="update-delete-button" style="color: red;">
          DELETE
        </a>
        <a href="/recover_process/?category=${queryData.category}&title=${queryData.title}" class="update-delete-button" style="color: green;">
          RECOVER
        </a>
      </div>
      `

    response.writeHead(200);
    response.end(templateHTML(card));
  }
  // pathname이 '/clear_process'일 때(게시물 영구 삭제 버튼을 눌렀을 때)
  else if (pathname === '/clear_process/') {
    access_deny();

    // 파일 영구 삭제
    fs.unlinkSync(`./texts/Trash/${queryData.category}/${queryData.title}`);

    // 카테고리 페이지로 리다이렉트
    response.writeHead(302, {
      Location: encodeURI('/trash')
    });
    response.end();
  }
  else if (pathname === '/recover_process/') {
    access_deny();

    // 휴지통에 있던 파일을 원래 위치로 복구
    fs.renameSync(`./texts/Trash/${queryData.category}/${queryData.title}`, `./texts/${queryData.category}/${queryData.title}`);

    // 카테고리 페이지로 리다이렉트
    response.writeHead(302, {
      Location: encodeURI(`/?category=${queryData.category}`)
    });
    response.end();
  }
  // pathname에 잘못된 값이 들어갔을 때 (404 Not Found)
  else {
    response.writeHead(404);
    response.end('Not Found');
  }
});

// 3000번 포트를 통해 서버 실행
app.listen(3000);