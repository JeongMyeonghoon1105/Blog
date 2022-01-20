// 필요한 모듈을 요청하여 변수에 저장
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// 서버 생성
var app = http.createServer((request, response) => {
  var url_saver = request.url;
  var queryData = url.parse(url_saver, true).query;
  var pathname = url.parse(url_saver, true).pathname;

  // 각 카테고리의 게시물 수를 변수에 저장
  var Study_Postings = fs.readdirSync('./texts/Study/').length;
  var Finance_Postings = fs.readdirSync('./texts/Finance/').length;
  var Exercise_Postings = fs.readdirSync('./texts/Exercise/').length;
  var Career_Postings = fs.readdirSync('./texts/Career/').length;

  // pathname이 '/'일 때
  if (pathname === '/') {
    fs.readFile('./css/main.css', (err, data) => {
      // HEAD
      var head = fs.readFileSync('./texts/index-head', 'utf8');

      // HEADER
      var header = fs.readFileSync('./texts/index-header', 'utf8');

      // CARD -> Query String의 ID 값에 따라 CARD에 들어갈 알맞은 파일을 로드
      if (queryData.id === undefined) {
        var card = fs.readFileSync('./texts/index-card', 'utf8');
      } else if (queryData.id == 'Study') {
        var filelist = fs.readdirSync('./texts/Study/');
        var card = '';

        filelist.forEach((element) => {
          card = card + `
          <!-- Item -->
          <a class="card-items" href="/?id=${element}&class=${queryData.id}">
            <div class="image-area">
              <img src="https://github.com/JeongMyeonghoon1105/Tech-Log/blob/master/images/Career.png?raw=true" alt="github">
            </div>
            <div class="text-area">
              <div style="width: 430px; height: 270px; padding: 5px; text-align: justify;">
                ${element}
              </div>
            </div>
          </a>
          `;
        });
      } else if (queryData.id == 'Finance') {
        var filelist = fs.readdirSync('./texts/Finance/');
        var card = '';

        filelist.forEach((element) => {
          card = card + `
          <!-- Item -->
          <a class="card-items" href="/?id=${element}&class=${queryData.id}">
            <div class="image-area">
              <img src="https://github.com/JeongMyeonghoon1105/Tech-Log/blob/master/images/Career.png?raw=true" alt="github">
            </div>
            <div class="text-area">
              <div style="width: 430px; height: 270px; padding: 5px; text-align: justify;">
                ${element}
              </div>
            </div>
          </a>
          `;
        });
      } else if (queryData.id == 'Exercise') {
        var filelist = fs.readdirSync('./texts/Exercise/');
        var card = '';

        filelist.forEach((element) => {
          card = card + `
          <!-- Item -->
          <a class="card-items" href="/?id=${element}&class=${queryData.id}">
            <div class="image-area">
              <img src="https://github.com/JeongMyeonghoon1105/Tech-Log/blob/master/images/Career.png?raw=true" alt="github">
            </div>
            <div class="text-area">
              <div style="width: 430px; height: 270px; padding: 5px; text-align: justify;">
                ${element}
              </div>
            </div>
          </a>
          `;
        });
      } else if (queryData.id == 'Career') {
        var filelist = fs.readdirSync('./texts/Career/');
        var card = '';

        filelist.forEach((element) => {
          card = card + `
          <!-- Item -->
          <a class="card-items" href="/?id=${element}&class=${queryData.id}">
            <div class="image-area">
              <img src="https://github.com/JeongMyeonghoon1105/Tech-Log/blob/master/images/Career.png?raw=true" alt="github">
            </div>
            <div class="text-area">
              <div style="width: 430px; height: 270px; padding: 5px; text-align: justify;">
                ${element}
              </div>
            </div>
          </a>
          `;
        });
      } else if ((queryData.class == 'Study') || (queryData.class == 'Finance') || (queryData.class == 'Exercise') || (queryData.class == 'Career')){
        var card = fs.readFileSync(`./texts/${queryData.class}/${queryData.id}`, 'utf8');
      } else {
        var card = fs.readFileSync(`./texts/${queryData.id}`, 'utf8');
      }

      // MENU
      var list = `
      <li><a href="/?id=Study">Study(${Study_Postings})</a></li>
      <li><a href="/?id=Finance">Finance(${Finance_Postings})</a></li>
      <li><a href="/?id=Exercise">Exercise(${Exercise_Postings})</a></li>
      <li><a href="/?id=Career">Career(${Career_Postings})</a></li>
      `;

      // FOOTER
      var footer = fs.readFileSync('./texts/index-footer', 'utf8');

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

      // 코드의 간결성을 위해 중복되는 내용을 함수에 저장
      function posting_init() {
        // 게시물 페이지에 해당하는 html 코드 데이터를 텍스트 파일에 저장
        fs.writeFileSync(`texts/${category}/${title}`,
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
          Location: encodeURI(`/?id=${title}&class=${category}`)
        });
        response.end();
      }

      posting_init();
    });
  } else {   // pathname에 잘못된 값이 들어갔을 때 (404 Not Found)
    response.writeHead(404);
    response.end('Not Found');
  }

});

// 3000번 포트에서 서버 실행
app.listen(3000);