var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./template.js');
var signIn = 0;
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'audgns9809',
  database: 'StoryMate'
});

db.connect();

// 서버 생성
var app = http.createServer((request, response) => {
  var requestedURL = request.url;
  var queryData = url.parse(requestedURL, true).query;
  var pathname = url.parse(requestedURL, true).pathname;

  // 관리자 전용 기능 숨기기
  if (signIn == 0) {
    var display = 'none';
  } else {
    var display = 'block';
  }

  // 관리자 전용 페이지 접속 시도를 차단
  function access_deny() {
    if (signIn == 0) {
      response.writeHead(302, {
        Location: encodeURI('/')
      });
      response.end();
    }
  }

  // 로그인 여부에 따라 헤더의 스타일을 달리 적용
  if (signIn == 0) {
    var signInHeader = template.Header('signin', 'In');
    var tabSignIn = template.Tab('signin', 'In');
  } else {
    var signInHeader = template.Header('signin_process', 'Out');
    var tabSignIn = template.Tab('signin_process', 'Out');
  }

  // 카테고리별 게시물 수를 객체에 저장
  var postingCount = {
    'frontend': 0,
    'backend': 0,
    'devops': 0,
    'cs': 0
  }

  function menuCount(topics, postingCount) {
    topics.forEach((element) => {
      if ((element.category == 'Frontend') && (element.trash != 1))
        postingCount.frontend = parseInt(postingCount.frontend + 1);
      else if ((element.category == 'Backend') && (element.trash != 1))
        postingCount.backend = parseInt(postingCount.backend + 1);
      else if ((element.category == 'DevOps') && (element.trash != 1))
        postingCount.devops = parseInt(postingCount.devops + 1);
      else if ((element.category == 'CS') && (element.trash != 1))
        postingCount.cs = parseInt(postingCount.cs + 1);
    })
  }

  // 각 페이지 별로 달리 적용될 스타일들을 객체로 묶어 초기화
  var variousStyle = {
    'bodyStyle': '/* */',
    'headerStyle': '/* */',
    'wrapStyle': '/* */',
    'innerStyle': '/* */',
    'cardStyle': '/* */',
    'menuStyle': '/* */'
  }

  /**************************** 소스파일 읽어오기 ****************************/
  // HEAD
  var head = fs.readFileSync('./texts/head', 'utf8');

  // STYLE
  var style = fs.readFileSync('./css/variables.css', 'utf8');
  style = style + fs.readFileSync('./css/common.css', 'utf8');
  style = style + fs.readFileSync('./css/header.css', 'utf8');
  style = style + fs.readFileSync('./css/menu.css', 'utf8');
  style = style + fs.readFileSync('./css/footer.css', 'utf8');

  // HEADER
  var header = fs.readFileSync('./texts/header', 'utf8');

  // MENU
  var categoryList = template.list(postingCount.frontend, postingCount.backend, postingCount.devops, postingCount.cs, display);

  // FOOTER
  var footer = fs.readFileSync('./texts/footer', 'utf8');
  /*************************************************************************/

  // pathname이 '/'일 때
  if (pathname === '/') {
    // 메인 페이지
    if (queryData.category === undefined) {
      variousStyle.cardStyle = 'background-color: rgb(245, 245, 255);';
      style = style + fs.readFileSync('./css/main.css', 'utf8');
      var card = fs.readFileSync('./texts/card', 'utf8');

      db.query(`SELECT category, trash FROM topic`, (error, topics) => {
        // MENU
        menuCount(topics, postingCount);
        var categoryList = template.list(postingCount, display);

        response.writeHead(200);
        response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabSignIn, categoryList, display, card, footer));
      })
    }
    // 카테고리별 게시물 목록
    else if (((queryData.category == 'Frontend') || (queryData.category == 'Backend') || (queryData.category == 'DevOps') || (queryData.category == 'CS')) && queryData.title === undefined) {
      style = style + fs.readFileSync('./css/category.css', 'utf8');

      db.query(`SELECT category, id, title, date, DATE_FORMAT(date, "%Y-%m-%d") AS date, trash FROM topic ORDER BY id DESC`, (error, topics) => {
        var card = template.descriptionArea(queryData.category);
        var categoryEmpty = 0;

        // 현재 카테고리에 이미 게시물이 존재할 때, 게시물 목록 표시
        topics.forEach((element) => {
          if ((element.category == queryData.category) && (element.trash != 1)) {
            card = card + template.postingItem(queryData.category, element.title, element.date);
            categoryEmpty = 1;
          }
        });

        // 현재 카테고리에 게시물이 없을 때, 안내 메시지 표시
        if (categoryEmpty == 0) {
          card = card + template.notice(`${queryData.category} category`);
        }

        // MENU
        menuCount(topics, postingCount);
        var categoryList = template.list(postingCount, display);

        response.writeHead(200);
        response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabSignIn, categoryList, display, card, footer));
      })
    }
    // 게시물 페이지
    else if ((queryData.category == 'Frontend') || (queryData.category == 'Backend') || (queryData.category == 'DevOps') || (queryData.category == 'CS')) {
      style = style + fs.readFileSync('./css/post.css', 'utf8');

      var card = '';

      db.query(`SELECT category, id, title, content, date, DATE_FORMAT(date, "%Y-%m-%d") AS date, trash FROM topic ORDER BY id DESC`, (error, topics) => {
        topics.forEach((element) => {
          if ((element.category == queryData.category) && (element.title == queryData.title) && (element.trash != 1)) {
            card = card + sanitizeHtml(template.postContainer(element.title, element.content), {
              allowedTags: ['div', 'h1', 'h2', 'h3', 'img', 'text', 'i', 'a', 'button', 'input', 'br'],
              allowedClasses: {
                'div': ['card', 'post-container', 'post-contents'],
                'h1': ['post-title']
              }
            })
          }
        })

        // 로그인된 상태일 경우 삭제 및 편집 버튼을 게시물 페이지 하단에 추가
        if (signIn == 1) {
          card = card + template.buttonContainer('delete', 'update', 'UPDATE', queryData.category, queryData.title, 'gray');
        }

        // MENU
        menuCount(topics, postingCount);
        var categoryList = template.list(postingCount, display);

        response.writeHead(200);
        response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabSignIn, categoryList, display, card, footer));
      })
    }
  }
  // pathname이 '/signin'일 때(로그인 페이지)
  else if (pathname === '/signin') {
    variousStyle.headerStyle = 'display: none;';
    variousStyle.cardStyle = 'background-color: rgb(245, 245, 255);';
    variousStyle.menuStyle = 'display: none;';
    style = style + fs.readFileSync('./css/signin.css', 'utf8');
    var card = fs.readFileSync('./texts/sign-in', 'utf8');

    response.writeHead(200);
    response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabSignIn, categoryList, display, card, footer));
  }
  // pathname이 '/signin_process'일 때(로그인/아웃 처리)
  else if (pathname == '/signin_process') {
    if (signIn == 0) {
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

    var card = template.descriptionArea('Post');
    card = card + fs.readFileSync('./texts/write', 'utf8');

    db.query(`SELECT category, trash FROM topic`, (error, topics) => {
      // MENU
      menuCount(topics, postingCount);
      var categoryList = template.list(postingCount, display);

      response.writeHead(200);
      response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabSignIn, categoryList, display, card, footer));
    })
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

      db.query(`
        INSERT INTO topic (category, title, content, date)
          VALUES(?, ?, ?, NOW())`,
        [category, title, template.writeContainer(content)],
        (error, topics) => {
          if (error) {
            throw error;
          }
          // 포스팅 후, 방금 작성한 게시물로 리다이렉션
          response.writeHead(302, {
            Location: encodeURI(`/?category=${category}&title=${title}`)
          });
          response.end();
        }
      )
    });
  }
  // pathname이 '/update/'일 때(게시물 수정 페이지)
  else if (pathname === '/update/') {
    access_deny();

    style = style + fs.readFileSync('./css/write.css', 'utf8');
    // var data = fs.readFileSync(`./texts/${queryData.category}/${queryData.title}`, 'utf8');
    var data = '';

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

    db.query(`SELECT category, title, content, trash FROM topic`, (error, topics) => {
      topics.forEach((element) => {
        if ((element.category == `${queryData.category}`) && (element.title == `${queryData.title}`) && (element.trash != '1')){
          data = element.content;
        }
      });

      var card = template.descriptionArea('Update') + template.writtingArea(queryData.category, queryData.title, data, categorySelect);

      // MENU
      menuCount(topics, postingCount);
      var categoryList = template.list(postingCount, display);

      response.writeHead(200);
      response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabSignIn, categoryList, display, card, footer));
    })
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

      db.query(`DELETE FROM topic WHERE category='${queryData.category}' AND title='${queryData.title}' AND trash='0'`,
        (error, topics) => {
          if (error) {
            throw error;
          }
          db.query(`
            INSERT INTO topic (category, title, content, date)
              VALUES(?, ?, ?, NOW())`,
            [category, title, template.writeContainer(content)],
            (error, topics) => {
              if (error) {
                throw error;
              }
              // 포스팅 후, 방금 작성한 게시물로 리다이렉션
              response.writeHead(302, {
                Location: encodeURI(`/?category=${category}&title=${title}`)
              });
              response.end();
            }
          )
        }
      )
    });
  }
  // pathname이 '/delete_process'일 때(일반 게시물 삭제 버튼을 눌렀을 때)
  else if (pathname === '/delete_process/') {
    access_deny();

    db.query(`UPDATE topic SET trash='1' WHERE category='${queryData.category}' AND title='${queryData.title}'`,
      (error, topics) => {
        if (error) {
          throw error;
        }
        // 카테고리 페이지로 리다이렉트
        response.writeHead(302, {
          Location: encodeURI(`/?category=${queryData.category}`)
        });
        response.end();
      }
    )
  }
  // pathname이 '/trash'일 때(휴지통에 담긴 게시물의 목록)
  else if (pathname === '/trash') {
    access_deny();

    style = style + fs.readFileSync('./css/trash.css', 'utf8');
    var card = template.descriptionArea('Trash');

    db.query(`SELECT category, id, title, date, DATE_FORMAT(date, "%Y-%m-%d") AS date, trash FROM topic ORDER BY id DESC`, (error, topics) => {
      var trashEmpty = 0;

      // 현재 카테고리에 이미 게시물이 존재할 때, 게시물 목록 표시
      topics.forEach((element) => {
        if (element.trash == 1) {
          card = card + template.trashItem(element.category, element.title);
          trashEmpty = 1;
        }
      });

      // 휴지통이 비었을 때, 안내 메시지 표시
      if (trashEmpty == 0) {
        card = card + template.notice('Trash');
      }

      db.query(`SELECT category, trash FROM topic`, (error, topics) => {
        // MENU
        menuCount(topics, postingCount);
        var categoryList = template.list(postingCount, display);

        response.writeHead(200);
        response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabSignIn, categoryList, display, card, footer));
      })
    })
  }
  // 휴지통에 담긴 게시물
  else if (pathname === '/trash/') {
    access_deny();

    style = style + fs.readFileSync('./css/post.css', 'utf8');
    var card = '';

    db.query(`SELECT category, id, title, content, date, DATE_FORMAT(date, "%Y-%m-%d") AS date, trash FROM topic ORDER BY id DESC`, (error, topics) => {
      topics.forEach((element) => {
        if ((element.category == queryData.category) && (element.title == queryData.title) && (element.trash == 1)) {
          card = card + sanitizeHtml(template.postContainer(element.title, element.content), {
            allowedTags: ['div', 'h1', 'h2', 'h3', 'img', 'text', 'i', 'a', 'button', 'input', 'br'],
            allowedClasses: {
              'div': ['card', 'post-container', 'post-contents'],
              'h1': ['post-title']
            }
          })
        }
      })

      card = card + template.buttonContainer('clear', 'recover_process', 'RECOVER', queryData.category, queryData.title, 'green');

      // MENU
      menuCount(topics, postingCount);
      var categoryList = template.list(postingCount, display);

      response.writeHead(200);
      response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabSignIn, categoryList, display, card, footer));
    })
  }
  // pathname이 '/clear_process'일 때(게시물 영구 삭제 버튼을 눌렀을 때)
  else if (pathname === '/clear_process/') {
    access_deny();

    db.query(`DELETE FROM topic WHERE category='${queryData.category}' AND title='${queryData.title}' AND trash='1'`,
      (error, topics) => {
        if (error) {
          throw error;
        }
        // 카테고리 페이지로 리다이렉트
        response.writeHead(302, {
          Location: encodeURI(`/trash`)
        });
        response.end();
      }
    )
  }
  // pathname이 '/recover_process/'일 때(게시물 복구 버튼을 눌렀을 때)
  else if (pathname === '/recover_process/') {
    access_deny();

    db.query(`UPDATE topic SET trash='0' WHERE category='${queryData.category}' AND title='${queryData.title}'`,
      (error, topics) => {
        if (error) {
          throw error;
        }
        // 카테고리 페이지로 리다이렉트
        response.writeHead(302, {
          Location: encodeURI(`/?category=${queryData.category}`)
        });
        response.end();
      }
    )
  }
  // pathname에 잘못된 값이 들어갔을 때 (404 Not Found)
  else {
    response.writeHead(404);
    response.end('Not Found');
  }
});

// 3000번 포트를 통해 서버 실행
app.listen(3000);