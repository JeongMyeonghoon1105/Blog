/* ******* Tasks ******* */

// Create                //
// Read                  //
// Update 
// Delete                //
// Search
// Sort
// Add Date of Posting
// Uploading Photos      //
// Sign In               //
// Responsive UI Design

// Ideas
// 강좌 수강 후, 게시물 Update 기능 구현 방법 고민하기
// 로그인하지 않았을 경우, 추가, 변경, 삭제 버튼의 display를 none으로 하기
// 반응형 웹 제작법 관련 도서 읽고 CSS에 적용하기
// readdir() 함수 이용한 검색 기능 구현 방법 고민하기


// 필요한 모듈을 요청하여 변수에 저장
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var signIn = 0;

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

  // 각 카테고리의 게시물 수를 변수에 저장
  var Life_Postings = fs.readdirSync('./texts/Life/').length;
  var Finance_Postings = fs.readdirSync('./texts/Finance/').length;
  var Exercise_Postings = fs.readdirSync('./texts/Exercise/').length;
  var Study_Postings = fs.readdirSync('./texts/Study/').length;

  // pathname이 '/'일 때
  if (pathname === '/') {
    // HEAD
    var head = fs.readFileSync('./texts/index-head', 'utf8');

    // HEADER
    if (signIn == 0) {
      var header = fs.readFileSync('./texts/index-header-unsigned', 'utf8');
    } else {
      var header = fs.readFileSync('./texts/index-header-signed', 'utf8');
    }

    // STYLE
    var style = fs.readFileSync('./css/variables.css', 'utf8');
    style = style + fs.readFileSync('./css/common.css', 'utf8');
    style = style + fs.readFileSync('./css/header.css', 'utf8');
    style = style + fs.readFileSync('./css/menu.css', 'utf8');
    style = style + fs.readFileSync('./css/footer.css', 'utf8');

    // CARD(메인 페이지에 위치해 있어 Query String이 없을 경우)
    if (queryData.id === undefined) {
      style = style + fs.readFileSync('./css/main.css', 'utf8');
      var card = fs.readFileSync('./texts/index-card', 'utf8');
    }
    // CARD(카테고리 페이지에 위치해 있을 경우. 카테고리 페이지에서는 id가 카테고리명, class가 게시물 제목)
    else if ((queryData.id == 'Life') || (queryData.id == 'Finance') || (queryData.id == 'Exercise') || (queryData.id == 'Study')) {
      style = style + fs.readFileSync('./css/else.css', 'utf8');
      var filelist = fs.readdirSync(`./texts/${queryData.id}`);
      var card = 
      `
      <div class="description-area">
        <h1 style="font-size: 20px; font-weight: bold; font-family: 'Nanum Gothic', 'sans-serif';">
          ${queryData.id}
        </h1>
      </div>
      `;

      // 현재 카테고리에 게시물이 없을 때 안내 메시지 표시
      if (filelist.length == 0) {
        card = card +
        `
        <div class="notice">
          <text style="line-height: 0px;">Sorry. No postings in ${queryData.id} category yet.</text>
        </div>
        `
      }
      // 현재 카테고리에 이미 게시물이 존재할 때
      else {
        card = card +
        `
        <div class="posting-item" style="color: gray; border-bottom: 0.5px solid black; margin-top: 30px;">
          Title
        </div>
        `
        // 현재 카테고리에 저장된 모든 파일의 내용을 변수에 덧붙이기
        filelist.forEach((element) => {
          card = card +
          `
          <!-- Item -->
          <div class="posting-item">

            <!-- 텍스트 -->
            <div class="posting-container">
              <a href="/?id=${element}&class=${queryData.id}" class="posting-content">
                ${element}
              </a>

              <!-- 삭제 & 편집 버튼 -->
              <!-- <div style="display: flex; width: 50px; height: 30px;"> -->

                <!-- 삭제 버튼 -->
                <!-- 
                <a class="delete_button" href="http://localhost:3000/delete_process?id=${queryData.id}&class=${element}"
                  style="display: ${display}; width: 50px; height: 30px; font-size: 15px; text-align: center; color: lightgray;">
                  <i class="fas fa-trash" style="line-height: 30px;"></i>
                </a>
                -->

                <!-- 편집 버튼 -->
                <!-- 
                <a class="update_button" style="display: ${display}; width: 50px; height: 30px; font-size: 15px; text-align: center; color: lightgray;">
                  <i class="fas fa-edit" style="line-height: 30px;"></i>
                </a>
                -->
              <!-- </div> -->

            </div>

          </div>
          `;
        });
      }
    }
    // CARD(휴지통 내에 보관된 삭제 게시물의 리스트를 표출하는 페이지에 위치해 있을 경우)
    else if ((queryData.id == 'Trash') && (queryData.class === undefined) && (queryData.title === undefined)) {
      style = style + fs.readFileSync('./css/else.css', 'utf8');
      
      // 로그인하지 않았을 시 해당 페이지 접속 차단
      if (signIn == 0) {
        response.writeHead(302, {
          Location: encodeURI('/')
        });
        response.end();
      }
      
      var directorylist = fs.readdirSync(`texts/Trash`);
      var card =
      `
      <div class="description-area">
        <h1 style="font-size: 20px; font-weight: bold; font-family: 'Nanum Gothic', 'sans-serif';">
          Trash
        </h1>
      </div>
      `;
      
      // 휴지통이 비었는지 확인하는 동시에, 휴지통에 파일이 존재하면 해당 파일의 내용을 변수에 덧붙이기
      var filesInTrash = 0;

      directorylist.forEach((elem) => {
        var filelist = fs.readdirSync(`./texts/Trash/${elem}`);

        // 현재 카테고리에 저장된 모든 파일의 내용을 변수에 덧붙이기
        filelist.forEach((element) => {
          card = card +
          `
          <!-- Item -->
          <div style="width: 800px; height: 50px; margin: 20px 50px; border-bottom: 2px solid lightgray;">

            <!-- 텍스트 -->
            <div style="display: flex; width: 800px; height: 30px; padding: 10px 0;">
              <a href="/?id=Trash&class=${elem}&title=${element}"
                style="display: block; width: 750px; height: 30px; text-align: justify; overflow: hidden; line-height: 30px;">
                ${element}
              </a>

              <!-- 삭제 & 편집 버튼 -->
              <div style="display: flex; width: 50px; height: 30px;">

                <!-- 삭제 버튼 -->
                <a class="delete_button" href="http://localhost:3000/clear_process?id=Trash&class=${elem}&title=${element}"
                  style="display: ${display}; width: 50px; height: 30px; font-size: 15px; text-align: center; color: lightgray;">
                  <i class="fas fa-trash" style="line-height: 30px;"></i>
                </a>

                <!-- 편집 버튼 -->
                <a class="update_button" style="display: ${display}; width: 50px; height: 30px; font-size: 15px; text-align: center; color: lightgray;">
                  <i class="fas fa-edit" style="line-height: 30px;"></i>
                </a>

              </div>
            </div>

          </div>
          `;

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
    // CARD(휴지통 내 게시물 페이지에 위치해 있을 경우)
    else if (queryData.id == 'Trash'){
      style = style + fs.readFileSync('./css/else.css', 'utf8');
      
      if (signIn == 0) {
        response.writeHead(302, {
          Location: encodeURI('/')
        });
        response.end();
      }

      var card = fs.readFileSync(`./texts/Trash/${queryData.class}/${queryData.title}`, 'utf8');
    }
    // CARD(게시물 페이지에 위치해 있을 경우. 게시물 페이지에서는 id가 게시물 제목, class가 카테고리명)
    else if ((queryData.class == 'Life') || (queryData.class == 'Finance') || (queryData.class == 'Exercise') || (queryData.class == 'Study')) {
      style = style + fs.readFileSync('./css/else.css', 'utf8');
      var card = fs.readFileSync(`./texts/${queryData.class}/${queryData.id}`, 'utf8');

      if (signIn == 1) {
        card = card + 
        `
        <!-- 삭제 & 편집 버튼 -->
        <div class="button-container">
  
          <!-- 삭제 버튼 -->
          <a href="http://localhost:3000/delete_process?id=${queryData.class}&class=${queryData.id}" class="update-delete-button">
            <i class="fas fa-trash"></i>
          </a>
  
          <!-- 편집 버튼 -->
          <a class="update-delete-button">
            <i class="fas fa-edit"></i>
          </a>
  
        </div>
        `
      }
    }
    // CARD(로그인 페이지에 위치해 있을 경우)
    else if (queryData.id == 'SignIn' && signIn == 0) {
      style = style + fs.readFileSync('./css/else.css', 'utf8');
      var card = fs.readFileSync('./texts/sign-in', 'utf8');
    }
    // CARD(Post 페이지에 위치해 있을 경우)
    else {
      style = style + fs.readFileSync('./css/else.css', 'utf8');

      if (signIn == 0) {
        response.writeHead(302, {
          Location: encodeURI('/')
        });
        response.end();
      }
      
      var card =
      `
      <div class="description-area">
        <h1 style="font-size: 20px; font-weight: bold; font-family: 'Nanum Gothic', 'sans-serif';">
          Post
        </h1>
      </div>
      `
      + fs.readFileSync(`./texts/${queryData.id}`, 'utf8');
    }

    // MENU
    var list =
    `
    <li><a href="/?id=Life">Life(${Life_Postings})</a></li>
    <li><a href="/?id=Finance">Finance(${Finance_Postings})</a></li>
    <li><a href="/?id=Exercise">Exercise(${Exercise_Postings})</a></li>
    <li><a href="/?id=Study">Study(${Study_Postings})</a></li>
    <li><a href="/?id=Trash" style="display: ${display}">Trash</a></li>
    `;

    // FOOTER
    var footer = fs.readFileSync('./texts/index-footer', 'utf8');

    // 페이지에 따라 스타일을 달리 적용
    if (queryData.id === undefined) {
      var bodyStyle = '/* */';
      var wrapStyle = '/* */';
      var innerStyle = '/* */';
      var cardStyle = 'background-color: rgb(248, 248, 255);';
    } else if (queryData.id == 'post') {
      var bodyStyle = 'height: 610px;';
      var wrapStyle = 'height: 560px;';
      var innerStyle = 'height: 560px;';
      var cardStyle = 'height: 560px; background-color: rgb(248, 248, 255);';
    } else if (queryData.id == 'SignIn') {
      var bodyStyle = '/* */';
      var wrapStyle = '/* */';
      var innerStyle = '/* */';
      var cardStyle = 'background-color: rgb(248, 248, 255);';
    } else {
      var bodyStyle = '/* */';
      var wrapStyle = '/* */';
      var innerStyle = '/* */';
      var cardStyle = '/* */';
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
      ${header}
      
      <!-- WRAP -->
      <div class="wrap" style="${wrapStyle}">
        <div class="inner" style="${innerStyle}">
          <!-- CARD -->
          <div class="card" style="${cardStyle}">
            ${card}
          </div>
          <!-- MENU -->
          <div class="menu">
            <div class="contents">
              <h1>Menu</h1><br>
              <ul style="list-style-type: none; font-size: 15px;">
                ${list}
              </ul><br>
              <h2 class="post_button" style="display: ${display}; font-weight: bold; cursor: pointer;" onclick="location.href='/?id=post'">Post</h2>
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

// 3000번 포트에서 서버 실행
app.listen(3000);