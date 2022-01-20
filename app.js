// 필요한 모듈을 요청하여 변수에 저장
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// 각 카테고리의 게시물 수가 저장된 파일을 읽어와서 문자열 형태로 변수에 저장
var study_Postings_text = fs.readFileSync('./texts/study-var.txt', 'utf8');
var finance_Postings_text = fs.readFileSync('./texts/finance-var.txt', 'utf8');
var exercise_Postings_text = fs.readFileSync('./texts/exercise-var.txt', 'utf8');
var career_Postings_text = fs.readFileSync('./texts/career-var.txt', 'utf8');

// 문자열 형태로 변수에 저장된 게시물 수 데이터들을 새로운 변수에 정수 형태로 저장
var study_Postings = parseInt(study_Postings_text);
var finance_Postings = parseInt(finance_Postings_text);
var exercise_Postings = parseInt(exercise_Postings_text);
var career_Postings = parseInt(career_Postings_text);

// 서버 생성
var app = http.createServer(function (request, response) {
  var url_saver = request.url;
  var queryData = url.parse(url_saver, true).query;
  var pathname = url.parse(url_saver, true).pathname;

  // pathname이 '/'일 때
  if (pathname === '/') {
    fs.readFile('./css/main.css', (err, data) => {
      // HEAD
      var head = fs.readFileSync('./texts/index-head.txt', 'utf8');

      // HEADER
      var header = fs.readFileSync('./texts/index-header.txt', 'utf8');

      // CARD -> Query String의 ID 값에 따라 CARD에 들어갈 알맞은 파일을 로드
      if (queryData.id === undefined) {
        var card = fs.readFileSync('./texts/index-card.txt', 'utf8');
      } else {
        var card = fs.readFileSync(`./texts/${queryData.id}-card.txt`, 'utf8');
      }

      // MENU
      var list = `
      <li><a href="/?id=study">Study(${study_Postings})</a></li>
      <li><a href="/?id=finance">Finance(${finance_Postings})</a></li>
      <li><a href="/?id=exercise">Exercise(${exercise_Postings})</a></li>
      <li><a href="/?id=career">Career(${career_Postings})</a></li>
      `;

      // FOOTER
      var footer = fs.readFileSync('./texts/index-footer.txt', 'utf8');

      if (queryData.id == 'post') {
        var hide = 'overflow-y: hidden;'
      } else {
        var hide = '/* */'
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
      
      <body style="${hide}">
        ${header}
        
        <!-- WRAP -->
        <div class="wrap">
          <div class="inner">
            <!-- CARD -->
            <div class="card">
              ${card}
            </div>
            <!-- MENU -->
            <div class="menu">
              <div class="contents">

                <h1>Menu</h1><br>
                
                <ul style="list-style-type: none; font-size: 15px;">
                  ${list}
                </ul><br>

                <h2 style="font-weight: bold; cursor: pointer;" onclick="location.href='/?id=post'">Post</h2>

              </div>
            </div>
          </div>
        </div>
        ${footer}
      </body>
      
      </html>
      `

      // 로드
      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname === '/post_process') {   // pathname이 '/post_process'일 때(폼에서 데이터를 제출했을 때)
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

      // appendFile 함수로 파일에 추가할 데이터를 코드의 간결성을 위해 미리 변수에 저장
      var append_contents =
      `
      <!-- Item -->
      <a class="card-items" href="/?id=${title}">
        <div class="image-area">
          <img src="https://github.com/JeongMyeonghoon1105/Tech-Log/blob/master/images/career.png?raw=true" alt="github">
        </div>
        <div class="text-area">
          <h1 style="font-size: 20px; font-weight: bold; display: inline-block; padding: 10px 5px;">${title}</h1>
          <div style="width: 440px; height: 2px; background-color: lightgray;"></div>
          <div style="width: 430px; height: 270px; padding: 5px; text-align: justify;">
            ${content}
          </div>
        </div>
      </a>
      `
      // 코드의 간결성을 위해 중복되는 내용을 함수에 저장
      function posting_init() {
        // 게시물 포스팅 후 게시물 수 데이터를 1씩 증가
        if (category == 'Study') {
          study_Postings = study_Postings + 1;
        } else if (category == 'Finance') {
          finance_Postings = finance_Postings + 1;
        } else if (category == 'Exercise') {
          exercise_Postings = exercise_Postings + 1;
        } else if (category == 'Career') {
          career_Postings = career_Postings + 1;
        }

        // 정수 형태로 저장된 각 카테고리별 게시물 수 데이터를 문자열 형태로 변수에 저장
        study_Postings_text = study_Postings.toString(10);
        finance_Postings_text = finance_Postings.toString(10);
        exercise_Postings_text = exercise_Postings.toString(10);
        career_Postings_text = career_Postings.toString(10);

        // 각 카테고리별 게시물 수를 저장하는 파일에 데이터 덮어쓰기
        fs.writeFileSync('./texts/study-var.txt', study_Postings_text, 'utf8');
        fs.writeFileSync('./texts/finance-var.txt', finance_Postings_text, 'utf8');
        fs.writeFileSync('./texts/exercise-var.txt', exercise_Postings_text, 'utf8');
        fs.writeFileSync('./texts/career-var.txt', career_Postings_text, 'utf8');

        // 게시물 페이지에 해당하는 html 코드 데이터를 텍스트 파일에 저장
        fs.writeFileSync(`texts/${title}-card.txt`,
        `
        <!-- CARD -->
        <div class="card" style="width: 800px; min-height: 100vh; padding: 50px; position: relative;">
          <h1 style="font-size: 30px; font-weight: bold;">${title}</h1><br>
          <div style="width: 800px; height: 2px; background-color: lightgray;"></div><br>
          <div style="font-size: 20px;">
            ${content}
          </div>
        </div>
        `,
        'utf8');

        // 포스팅 후 게시물로 리다이렉션
        response.writeHead(302, {
          Location: encodeURI(`/?id=${title}`)
        });
        response.end();
      }

      // 현재 포스팅 중인 게시물이 해당 카테고리의 첫번째 게시물이 아닐 경우
      if ((category == 'Study' && study_Postings != 0) || (category == 'Finance' && finance_Postings != 0) || (category == 'Exercise' && exercise_Postings != 0) || (category == 'Career' && career_Postings != 0)) {
        // 카테고리 페이지의 해당 게시물 링크(아이템) 위에 구분선을 추가
        append_contents = `<!-- Between items --> <div class="between-items"></div>` + append_contents;

        // 카테고리 페이지에 해당하는 html 코드 데이터를 기존 텍스트 파일에 덧붙이기
        fs.appendFile(`texts/${category}-card.txt`, append_contents, 'utf8', (err) => {
          if (err) throw err;
          posting_init();
        });
      } else {    // 현재 포스팅 중인 게시물이 해당 카테고리의 첫번째 게시물일 경우
        // 카테고리 페이지에 해당하는 html 코드 데이터를 기존 텍스트 파일에 덮어쓰기
        fs.writeFile(`texts/${category}-card.txt`, append_contents, 'utf8', (err) => {
          if (err) throw err;
          posting_init();
        });
      }
    });
  } else {   // pathname에 잘못된 값이 들어갔을 때 (404 Not Found)
    response.writeHead(404);
    response.end('Not Found');
  }

});

// 3000번 포트에서 서버 실행
app.listen(3000);