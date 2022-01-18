/* Node.js 서버에서 JavaScript가 동작하지 않는 문제 해결하기 */

var http = require('http');
var fs = require('fs');
var url = require('url');
const path = require('path');
var qs = require('querystring');

var app = http.createServer(function (request, response) {
  var url_saver = request.url;
  var queryData = url.parse(url_saver, true).query;
  var pathname = url.parse(url_saver, true).pathname;

  if (pathname === '/') {
    // pathname이 '/'일 때
    fs.readFile('./css/main.css', (err, data) => {
      var head = fs.readFileSync('./texts/index-head.txt', 'utf8');
      var script = fs.readFileSync('./texts/script.txt', 'utf8');
      var header = fs.readFileSync('./texts/index-header.txt', 'utf8');

      // Query String의 ID 값에 따라 CARD에 들어갈 알맞은 파일을 로드
      if (queryData.id === undefined) {
        var card = fs.readFileSync('./texts/index-card.txt', 'utf8');
      } else {
        var card = fs.readFileSync(`./texts/${queryData.id}-card.txt`, 'utf8');
      }

      // MENU LIST
      var filelist = fs.readdirSync('./posts');
      var list = '<ul tyle="list-style-type: none; font-size: 15px;>';
      var i = 0;
      while (i < filelist.length) {
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
        i = i + 1;
      }
      list = list + '</ul>'

      // FOOTER
      var footer = fs.readFileSync('./texts/index-footer.txt', 'utf8');

      if (queryData.id == 'post') {
        var hide = 'overflow-y: hidden;'
      } else {
        var hide = '/* */'
      }

      // 로드될 HTML 코드를 변수에 저장
      var template = `
      <html lang="ko">
  
      <head>
        ${head}
  
        <style>
          ${data}
        </style>
  
        <script defer>${script}</script>
      </head>
      
      <body style="${hide}">
        ${header}
        
        <!-- WRAP -->
        <div class="wrap">
          <div class="inner">
            <!-- CARD -->
            ${card}

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
        ${footer}
      </body>
      
      </html>`

      // 로드
      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname === '/post_process') {
    // pathname이 '/post_process'일 때
    var body = ""

    request.on('data', (data) => {
      body = body + data;

      if (body.length > 1e6) {
        request.connection.destroy();
      }
    });
    request.on('end', () => {
      var post = qs.parse(body);
      var title = post.title;
      var content = post.content;

      fs.writeFile(`posts/${title}`, content, 'utf8', (err) => {
        if (err) throw err;

        fs.writeFileSync(`texts/${title}-card.txt`,
        `<!-- CARD -->
        <div class="card" style="width: 800px; min-height: 100vh; padding: 50px;">
          <h1 style="font-size: 30px; font-weight: bold;">${title}</h1><br>
          <div style="width: 800px; height: 2px; background-color: lightgray;"></div><br>
          <div style="font-size: 20px;">
            ${content}
          </div>
        </div>`,
        'utf8');

        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
  } else {
    // pathname에 잘못된 값이 들어갔을 때 (404 Not Found)
    response.writeHead(404);
    response.end('Not Found');
  }

});

// 3000번 포트에서 실행
app.listen(3000);
