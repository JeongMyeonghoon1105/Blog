/* ******* Tasks ******* */

// Create                //
// Read                  //
// Update 
// Delete                //
// Search
// Sort
// Add Date of Posting
// Uploading Photos
// Sign Up
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

  var login_form = 
  `
  <!-- 로그인 폼 -->
  <form action="http://localhost:3000/signin_process" method="post" class="sign-in-form">

    <!-- 암호 입력란 -->
    <div class="password">
      <textarea class="password-textarea" name="password" rows="1" cols="55" placeholder="Password" maxlength="100" required></textarea>
    </div>

    <!-- 로그인 버튼 -->
    <div style="width: 460px; height: 30px;">
      <button type="submit" class="sign-in-button">
        Sign In
      </button>
    </div>

  </form>
  `

  // pathname이 '/'일 때
  if (pathname === '/') {
    fs.readFile('./css/main.css', (err, data) => {
      // HEAD
      var head = fs.readFileSync('./texts/index-head', 'utf8');

      // HEADER
      var header = fs.readFileSync('./texts/index-header', 'utf8');

      // CARD(메인 페이지에 위치해 있어 Query String이 없을 경우)
      if (queryData.id === undefined) {
        var card = fs.readFileSync('./texts/index-card', 'utf8');
      }
      // CARD(카테고리 페이지에 위치해 있을 경우. 카테고리 페이지에서는 id가 카테고리명, class가 게시물 제목)
      else if ((queryData.id == 'Life') || (queryData.id == 'Finance') || (queryData.id == 'Exercise') || (queryData.id == 'Study')) {
        var filelist = fs.readdirSync(`./texts/${queryData.id}`);
        var card = '';

        // 현재 카테고리에 게시물이 없을 때 안내 메시지 표시
        if (filelist.length == 0) {
          card =
          `
          <div style="display: inline-block; width: 900px; text-align: center; font: 12px; color: lightgray; padding-top: 15px;">
            Sorry. No postings in ${queryData.id} category yet.
          </div>
          `
        }
        // 현재 카테고리에 이미 게시물이 존재할 때
        else {
          // 현재 카테고리에 저장된 모든 파일의 내용을 변수에 덧붙이기
          filelist.forEach((element) => {
            card = card +
            `
            <!-- Item -->
            <div class="card-items">

              <!-- 이미지 -->
              <a class="image-area" href="/?id=${element}&class=${queryData.id}"s>
                <img src="https://github.com/JeongMyeonghoon1105/Story-Mate/blob/master/images/js.png?raw=true" alt="github">
              </a>

              <!-- 텍스트 & 삭제 버튼 & 편집 버튼 -->
              <div class="text-area">

                <!-- 텍스트 -->
                <a href="/?id=${element}&class=${queryData.id}"
                  style="display: block; width: 430px; height: 135px; padding: 5px; text-align: justify; overflow: hidden;">
                  ${element}
                </a>

                <!-- 삭제 & 편집 버튼 -->
                <div style="width: 430px; height: 20px; display: flex;">

                  <!-- 삭제 버튼 -->
                  <a class="delete_button" href="http://localhost:3000/delete_process?id=${queryData.id}&class=${element}"
                    style="display: ${display}; width: 50px; height: 20px; font-size: 15px; text-align: center; color: lightgray">
                    <i class="fas fa-trash"></i>
                  </a>

                  <!-- 편집 버튼 -->
                  <a class="update_button" style="display: ${display}; width: 50px; height: 20px; font-size: 15px; text-align: center; color: lightgray">
                    <i class="fas fa-edit"></i>
                  </a>

                </div>

              </div>

            </div>
            `;
          });
        }
      }
      // CARD(휴지통 내에 보관된 삭제 게시물의 리스트를 표출하는 페이지에 위치해 있을 경우)
      else if ((queryData.id == 'Trash') && (queryData.class === undefined) && (queryData.title === undefined)) {
        if (signIn == 0) {
          response.writeHead(302, {
            Location: encodeURI('/')
          });
          response.end();
        }
        
        var directorylist = fs.readdirSync(`texts/Trash`);
        var card = '';
        
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
          });
        });

        // 휴지통이 비었을 때, 안내 메시지를 출력
        if (card == '') {
          card =
          `
          <div style="display: inline-block; width: 900px; text-align: center; font: 12px; color: lightgray; padding-top: 15px;">
            Trash is empty.
          </div>
          `
        }
      }
      // CARD(휴지통 내 게시물 페이지에 위치해 있을 경우)
      else if (queryData.id == 'Trash'){
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
        var card = fs.readFileSync(`./texts/${queryData.class}/${queryData.id}`, 'utf8');
      }
      // CARD(로그인 페이지에 위치해 있을 경우)
      else if (queryData.id == 'SignIn' && signIn == 0) {
        var card = login_form;
      }
      // CARD(로그아웃 페이지에 위치해 있을 경우)
      else if (queryData.id == 'SignIn') {
        var card = 
        `
        <div class="sign-in-form" style="padding-top: 0;">
          <button type="submit" class="post-button" onclick="location.href='/signin_process'" style="width: 80px; height: 30px; background-color: white; position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto;">
            Sign Out
          </button>
        </div>
        `
      }
      // CARD(Post 페이지에 위치해 있을 경우)
      else {
        if (signIn == 0) {
          response.writeHead(302, {
            Location: encodeURI('/')
          });
          response.end();
        }
        
        var card = fs.readFileSync(`./texts/${queryData.id}`, 'utf8');
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

      // 포스트 페이지에서는 페이지 height를 100vh로 줄이기
      if (queryData.id == 'post') {
        var bodyHeight = 'height: 610px;';
        var wrapHeight = 'height: 560px;';
        var innerHeight = 'height: 560px;';
        var cardHeight = 'height: 560px;';
      } else {
        var bodyHeight = '/* */';
        var wrapHeight = '/* */';
        var innerHeight = '/* */';
        var cardHeight = '/* */';
      }

      // 로드될 HTML 코드를 변수에 저장
      var template =
      `
      <html lang="ko">
  
      <head>
        ${head}
  
        <style>
          ${data}
        </style>

      </head>
      
      <body style="${bodyHeight}">
        <style>
          ${display}
        </style>

        <!-- HEADER -->
        ${header}
        
        <!-- WRAP -->
        <div class="wrap" style="${wrapHeight}">
          <div class="inner" style="${innerHeight}">
            <!-- CARD -->
            <div class="card" style="${cardHeight}">
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
    });
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
      <!-- CARD -->
      <div class="card" style="width: 800px; min-height: 100vh; padding: 50px; position: relative;">

        <!-- 게시물 제목 -->
        <h1 style="font-size: 30px; font-weight: bold;">${title}</h1><br>

        <!-- 구분선 -->
        <div style="width: 800px; height: 2px; background-color: lightgray;"></div><br>

        <!-- 내용 -->
        <div style="font-size: 20px;">
          ${content}
        </div>

        <!-- 삭제 & 편집 버튼 -->
        <div style="width: 800px; height: 20px; display: flex; position: absolute; left: 0; bottom: 0;">

          <!-- 삭제 버튼 -->
          <a href="http://localhost:3000/delete_process?id=${category}&class=${title}" style="display: ${display}; width: 50px; height: 20px; font-size: 15px; text-align: center;">
            <i class="fas fa-trash"></i>
          </a>

          <!-- 편집 버튼 -->
          <a class="update_button" style="display: ${display}; width: 50px; height: 20px; font-size: 15px; text-align: center;">
            <i class="fas fa-edit"></i>
          </a>

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