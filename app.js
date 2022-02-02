/* ******* Tasks ******* */

// Update
// Search
// Sort
// Add Date of Posting

// Ideas
// 강좌 수강 후, 게시물 Update 기능 구현 방법 고민하기
// readdir() 함수 이용한 검색 기능 구현 방법 고민하기


// 필요한 모듈을 요청하여 변수에 저장
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var signIn = 0;

// 로그인하지 않았을 시 페이지 접속 차단
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

  // 로그인 되지 않았을 때, 관리자 전용 기능 숨기기
  if (signIn == 0)
    var display = 'none';
  else
    var display = 'block';

  // 각 카테고리의 게시물 수를 객체에 저장
  var postingCount = {
    'frontend': fs.readdirSync('./texts/Frontend/').length,
    'backend': fs.readdirSync('./texts/Backend/').length,
    'devops': fs.readdirSync('./texts/DevOps/').length,
    'cs': fs.readdirSync('./texts/CS/').length
  }

  // pathname이 '/'일 때
  if (pathname === '/') {
    // HEAD
    var head = fs.readFileSync('./texts/index-head', 'utf8');

    // STYLE
    var style = fs.readFileSync('./css/variables.css', 'utf8');
    style = style + fs.readFileSync('./css/common.css', 'utf8');
    style = style + fs.readFileSync('./css/header.css', 'utf8');
    style = style + fs.readFileSync('./css/menu.css', 'utf8');
    style = style + fs.readFileSync('./css/footer.css', 'utf8');

    // CARD(메인 페이지)
    if (queryData.id === undefined) {
      style = style + fs.readFileSync('./css/main.css', 'utf8');
      var card = fs.readFileSync('./texts/index-card', 'utf8');
    }
    // CARD(카테고리별 게시물 목록)
    else if ((queryData.id == 'Frontend') || (queryData.id == 'Backend') || (queryData.id == 'DevOps') || (queryData.id == 'CS')) {
      style = style + fs.readFileSync('./css/category.css', 'utf8');
      var filelist = fs.readdirSync(`./texts/${queryData.id}`);

      // 페이지 제목
      var card = 
      `
      <div class="description-area">
        <h1>
          ${queryData.id}
        </h1>
      </div>
      `;

      // 현재 카테고리에 게시물이 없을 때, 안내 메시지 표시
      if (filelist.length == 0) {
        card = card +
        `
        <div class="notice">
          <text style="line-height: 0px;">
            ${queryData.id} category is empty.
          </text>
        </div>
        `
      }
      // 현재 카테고리에 이미 게시물이 존재할 때, 게시물 목록 표시
      else {
        filelist.forEach((element) => {
          card = card +
          `
          <!-- Item -->
          <div class="posting-item">
            <div class="posting-container">
              <a href="/?id=${element}&class=${queryData.id}" class="posting-content">
                ${element}
              </a>
            </div>
          </div>
          `;
        });
      }
    }
    // CARD(휴지통 내 게시물 목록)
    else if ((queryData.id == 'Trash') && (queryData.class === undefined) && (queryData.title === undefined)) {
      style = style + fs.readFileSync('./css/trash.css', 'utf8');

      access_deny();
      
      // Trash 폴더 내부 폴더(카테고리)들의 리스트를 변수에 저장
      var directorylist = fs.readdirSync('texts/Trash');

      // 페이지 제목
      var card =
      `
      <div class="description-area">
        <h1>
          Trash
        </h1>
      </div>
      `;
      
      // 휴지통이 비었는지 확인할 때 사용할 변수
      var filesInTrash = 0;

      // Trash 폴더 내부 각 카테고리에 속한 파일들을 모두 검사
      directorylist.forEach((elem) => {
        var filelist = fs.readdirSync(`./texts/Trash/${elem}`);

        // 현재 카테고리(휴지통)에 저장된 모든 파일의 제목을 디자인 형식에 대입한 후, card 변수에 덧붙이기
        filelist.forEach((element) => {
          card = card +
          `
          <div class="posting-item">
            <div class="posting-container">

              <a href="/?id=Trash&class=${elem}&title=${element}" class="posting-content">
                ${element}
              </a>

              <!-- 삭제 버튼 -->
              <a class="delete-button" href="http://localhost:3000/clear_process?id=Trash&class=${elem}&title=${element}">
                DELETE
              </a>

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
      if (filesInTrash == 0) {
        card = card +
        `
        <div class="notice">
          <text style="line-height: 0px;">Trash is empty.</text>
        </div>
        `
      }
    }
    // CARD(휴지통을 통해 접속한 게시물 페이지)
    else if (queryData.id == 'Trash'){
      style = style + fs.readFileSync('./css/post.css', 'utf8');
      
      access_deny();

      var card = fs.readFileSync(`./texts/Trash/${queryData.class}/${queryData.title}`, 'utf8');
      card = card + 
        `
        <!-- 삭제 버튼 -->
        <div class="button-container">
          <a href="http://localhost:3000/clear_process?id=Trash&class=${queryData.class}&title=${queryData.title}"
            class="update-delete-button" style="color: red;">
            DELETE
          </a>
        </div>
        `
    }
    // CARD(게시물 페이지. 게시물 페이지에서는 id가 게시물 제목, class가 카테고리명)
    else if ((queryData.class == 'Frontend') || (queryData.class == 'Backend') || (queryData.class == 'DevOps') || (queryData.class == 'CS')) {
      style = style + fs.readFileSync('./css/post.css', 'utf8');
      var card = fs.readFileSync(`./texts/${queryData.class}/${queryData.id}`, 'utf8');

      // 로그인된 상태일 경우 삭제 및 편집 버튼을 게시물 페이지 하단에 추가
      if (signIn == 1) {
        card = card + 
        `
        <!-- 삭제 & 편집 버튼 -->
        <div class="button-container">
  
          <!-- 삭제 버튼 -->
          <a href="http://localhost:3000/delete_process?id=${queryData.class}&class=${queryData.id}" class="update-delete-button" style="color: red;">
            DELETE
          </a>
  
          <!-- 편집 버튼 -->
          <a class="update-delete-button" style="color: gray;">
            UPDATE
          </a>
  
        </div>
        `
      }
    }
    // CARD(로그인 페이지)
    else if (queryData.id == 'SignIn' && signIn == 0) {
      style = style + fs.readFileSync('./css/signin.css', 'utf8');
      var card = fs.readFileSync('./texts/sign-in', 'utf8');
    }
    // CARD(글쓰기 페이지)
    else {
      style = style + fs.readFileSync('./css/write.css', 'utf8');

      access_deny();
      
      // 페이지 제목
      var card =
      `
      <div class="description-area">
        <h1>
          Post
        </h1>
      </div>
      `
      + fs.readFileSync(`./texts/${queryData.id}`, 'utf8');
    }

    // MENU
    var list =
    `
    <li><a href="/?id=Frontend">Frontend(${postingCount.frontend})</a></li>
    <li><a href="/?id=Backend">Backend(${postingCount.backend})</a></li>
    <li><a href="/?id=DevOps">DevOps(${postingCount.devops})</a></li>
    <li><a href="/?id=CS">CS(${postingCount.cs})</a></li>
    <li><a href="/?id=Trash" style="display: ${display}">Trash</a></li>
    `;

    // FOOTER
    var footer = fs.readFileSync('./texts/index-footer', 'utf8');

    // 페이지에 따라 스타일을 달리 적용
    if (queryData.id === undefined) {
      var bodyStyle = '/* */';
      var headerStyle = '/* */';
      var wrapStyle = '/* */';
      var innerStyle = '/* */';
      var cardStyle = 'background-color: rgb(245, 245, 255);';
      var menuStyle = '/* */';
    } else if (queryData.id == 'write') {
      var bodyStyle = 'height: 1200px;';
      var headerStyle = '/* */';
      var wrapStyle = 'height: 1150px;';
      var innerStyle = 'height: 1150px;';
      var cardStyle = 'height: 1150px;';
      var menuStyle = '/* */';
    } else if (queryData.id == 'SignIn') {
      var bodyStyle = '/* */';
      var headerStyle = 'display: none;';
      var wrapStyle = '/* */';
      var innerStyle = '/* */';
      var cardStyle = 'background-color: rgb(245, 245, 255);';
      var menuStyle = 'display: none;';
    } else {
      var bodyStyle = '/* */';
      var headerStyle = '/* */';
      var wrapStyle = '/* */';
      var innerStyle = '/* */';
      var cardStyle = '/* */';
      var menuStyle = '/* */';
    }

    if (signIn == 0) {
      var signInHeader =
      `
      <div class="item" id="sign-in" onclick="location.href='/?id=SignIn'">
        <span data-tooltip-text="Sign In"><i class="fas fa-user-circle"></i></span>
      </div>
      `
      var tabSignIn =
      `
      <div onclick="location.href='/?id=SignIn'" class="tab-sign">
        Sign In
      </div>
      `
    } else {
      var signInHeader =
      `
      <div class="item" id="sign-in" onclick="location.href='/signin_process'">
        <span data-tooltip-text="Sign Out"><i class="fas fa-user-circle"></i></span>
      </div>
      `
      var tabSignIn =
      `
      <div onclick="location.href='/signin_process'" class="tab-sign">
        Sign Out
      </div>
      `
    }

    // 로드될 HTML 코드를 변수에 저장
    var template =
    `
    <html lang="ko">

    <head>
      ${head}

      <style>
        ${style}
      </style>

    </head>
    
    <body style="${bodyStyle}">
      <style>
        ${display}
      </style>

      <!-- HEADER -->
      <header style="${headerStyle}">
        <div class="inner">
          <!-- LOGO -->
          <a href="/" class="logo">
            <img src="https://github.com/JeongMyeonghoon1105/Story-Mate/blob/master/images/Logo.png?raw=true" alt="Daniel's Tech Blog">
          </a>
          
          <!-- SEARCH BAR -->
          <input type="text" id="search-bar" placeholder="Search...">
          
          <!-- MAIN MENU -->
          <div class="main-menu" id="main-menu">
          
            <!-- 1st Item of Menu (Search Button) -->
            <div class="item" id="search">
              <i class="fas fa-search"></i>
            </div>
          
            <!-- 2nd Item of Menu (Instagram) -->
            <div class="item" id="instagram">
              <i class="fab fa-instagram" onclick="window.open('https://www.instagram.com/myeonghoon._.1105')"></i>
            </div>
          
            <!-- 3rd Item of Menu (Facebook Link) -->
            <div class="item" id="facebook" onclick="window.open('https://www.facebook.com/JeongMyeonghoon')">
              <i class="fab fa-facebook"></i>
            </div>
          
            <!-- 4th Item of Menu (Github Link) -->
            <div class="item" id="github" onclick="window.open('https://github.com/JeongMyeonghoon1105')">
              <i class="fab fa-github"></i>
            </div>
          
            <!-- 5th Item of Menu (Sign In) -->
            ${signInHeader}
          
            <!-- SEARCH BAR -->
            <input type="text" id="search-bar" placeholder="Search...">
            
          </div>
        
          <!-- Hidden Item (Menu) -->
          <div class="item" id="hidden-menu">
            <i class="fas fa-bars"></i>
          </div>

          <div id="tab-down">
            <div class="tab-down-inner">

              ${tabSignIn}

              <ul class="tab-items">
                ${list}
              </ul>

              <div style="display: inline-block; padding: 20px; height: 22px;">
                <h2 style="display: ${display}; color: white; font-weight: bold; cursor: pointer;" onclick="location.href='/?id=write'">
                  Post
                </h2>
              </div>
              
            </div>
          </div>

        </div>
      </header>
      
      <!-- WRAP -->
      <div class="wrap" style="${wrapStyle}">
        <div class="inner" style="${innerStyle}">

          <!-- CARD -->
          <div class="card" style="${cardStyle}">
            ${card}
          </div>

          <!-- MENU -->
          <div class="menu" style="${menuStyle}">
            <div class="contents">
              <h1>Menu</h1><br>
              <ul style="list-style-type: none; font-size: 15px;">
                ${list}
              </ul><br>
              <h2 style="display: ${display}; font-weight: bold; cursor: pointer;" onclick="location.href='/?id=write'">
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

    // 로드
    response.writeHead(200);
    response.end(template);
  }
  // pathname이 '/post_process'일 때(폼에서 데이터를 제출했을 때)
  else if (pathname === '/post_process') {
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

      // 게시물 페이지에 해당하는 html 코드 데이터를 텍스트 파일로 저장
      fs.writeFileSync(`texts/${category}/${title}`,
      `
      <div class="post-container">

        <!-- 게시물 제목 -->
        <h1 class="post-title">${title}</h1><br>

        <!-- 내용 -->
        <div class="post-contents">
          ${content}
        </div>

      </div>
      `,
      'utf8');

      // 포스팅 후 게시물로 리다이렉션
      response.writeHead(302, {
        Location: encodeURI(`/?id=${title}&class=${category}`)
      });
      response.end();
    });
  }
  // pathname이 '/delete_process'일 때(일반 게시물 삭제 버튼을 눌렀을 때)
  else if (pathname === '/delete_process') {
    // 파일 삭제 (id == 카테고리명, class == 게시물 제목)
    fs.renameSync(`./texts/${queryData.id}/${queryData.class}`, `./texts/Trash/${queryData.id}/${queryData.class}`);

    // 카테고리 페이지로 리다이렉트
    response.writeHead(302, {
      Location: encodeURI(`/?id=${queryData.id}`)
    });
    response.end();
  }
  // pathname이 '/clear_process'일 때(휴지통에 담긴 게시물의 삭제 버튼을 눌렀을 때)
  else if (pathname === '/clear_process') {
    // 파일 영구 삭제
    fs.unlinkSync(`./texts/Trash/${queryData.class}/${queryData.title}`);

    // 카테고리 페이지로 리다이렉트
    response.writeHead(302, {
      Location: encodeURI(`/?id=Trash`)
    });
    response.end();
  }
  // pathname이 '/signin_process'일 때(비밀번호를 입력받았을 때)
  else if (pathname == '/signin_process' && signIn == 0) {
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

      if (password == input_password) {
        signIn = 1;
        response.writeHead(302, {
          Location: encodeURI('/')
        });
      } else if (queryData.class === undefined) {
        response.writeHead(302, {
          Location: encodeURI('/?id=SignIn&class=Failed')
        });
      }
      response.end();
    });
  }
  // pathname이 '/signin_process'일 때(로그아웃 버튼을 눌렀을 때)
  else if (pathname == '/signin_process' && signIn == 1) {
    signIn = 0;
    response.writeHead(302, {
      Location: encodeURI('/')
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