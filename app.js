var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('query-string');
var template = require('./js/template.js');
var functions = require('./js/functions.js');
var objects = require('./js/objects.js');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'audgns9809',
  database: 'TechLog'
});
var signIn = 0;

// DB 연결
db.connect();

// 서버 생성
var app = http.createServer((request, response) => {
  // URL 정보 요청 및 분석
  var requestedURL = request.url;
  var queryData = url.parse(requestedURL, true).query;
  var pathname = url.parse(requestedURL, true).pathname;
  // 미확인 사용자로부터 관리자 전용 기능 숨기기
  var display = functions.changeDisplayStatus(signIn);
  // 로그인 여부에 따라 헤더의 스타일을 달리 적용
  if (signIn == 0) {
    var signInHeader = template.Header('signin', 'In');
    var tabSignIn = template.Tab('signin', 'In');
    var tabDownHeight = 'height: 220px;';
  } else {
    var signInHeader = template.Header('signin_process', 'Out');
    var tabSignIn = template.Tab('signin_process', 'Out');
    var tabDownHeight = 'height: 280px;';
  }
  // HEAD
  var head = fs.readFileSync('./html/head.html', 'utf8');
  // STYLE
  var style = fs.readFileSync('./css/variables.css', 'utf8');
  style = style + fs.readFileSync('./css/common.css', 'utf8');
  style = style + fs.readFileSync('./css/header.css', 'utf8');
  style = style + fs.readFileSync('./css/menu.css', 'utf8');
  style = style + fs.readFileSync('./css/footer.css', 'utf8');
  // HEADER
  var header = fs.readFileSync('./html/header.html', 'utf8');
  // MENU
  var categoryList = template.list(objects.postingCount.frontend, objects.postingCount.backend, objects.postingCount.devops, objects.postingCount.cs, display);
  // FOOTER
  var footer = fs.readFileSync('./html/footer.html', 'utf8');
  // JS
  var js = fs.readFileSync('./js/style.js', 'utf8');
  var categoryItems = 0;
  // 게시물 목록 출력 함수
  function showCategory(description, error,topics, card, queryData, postingOrTrash) {
    card = template.descriptionArea(description) + '<div id="posting-item" style="display: flex; flex-wrap: wrap;">'
    functions.throwError(error);
    categoryItems = 0;
    // 카테고리에 게시물이 존재하는지 검사. 존재할 경우, 게시물 목록 표시
    topics.forEach((element) => {
      if (postingOrTrash == 'trash') {
        if (element.trash == 1) {
          categoryItems = categoryItems + 1;
          var logoImage = functions.selectImage(element, logoImage);
          card = card + template.trashItem(element.category, element.title, logoImage);
        }
      } else if (postingOrTrash == 'posting') {
        if ((element.category == queryData.category) && (element.trash != 1)) {
          categoryItems = categoryItems + 1;
          var logoImage = functions.selectImage(element, logoImage);
          card = card + template.postingItem(queryData.category, element.title, element.date, logoImage);
        }
      } else {
        if (element.trash != 1) {
          categoryItems = categoryItems + 1;
          var logoImage = functions.selectImage(element, logoImage);
          card = card + template.postingItem(element.category, element.title, element.date, logoImage);
        }
      }
    });
    card = card + '</div>';
    // Card Height 계산 및 게시물 없을 시 안내 메시지 출력
    if (categoryItems == 0)
      card = card + template.notice('No Results');
    return card;
  }
  // 화면 표출 함수
  function pageResponse(response, head, style, variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js, categoryItems) {
    response.writeHead(200);
    response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js, categoryItems));
  }
  // 스타일 지정 및 메뉴 표출
  function styleAndMenu(topics, css) {
    style = style + fs.readFileSync(css, 'utf8');
    functions.menuCount(topics, objects.postingCount);
    var categoryList = template.list(objects.postingCount, display);
    return categoryList;
  }

  // 로그인 페이지가 아닌 모든 페이지
  if (pathname != '/signin') {
    objects.variousStyle.headerStyle = '/* */';
    objects.variousStyle.menuStyle = '/* */';
  }
  // pathname이 '/'일 때
  if (pathname === '/') {
    // 메인 페이지
    if (queryData.category === undefined) {
      var card = fs.readFileSync('./html/card.html', 'utf8');
      db.query(`SELECT category, trash FROM topic`, (error, topics) => {
        functions.throwError(error);
        var categoryList = styleAndMenu(topics, './css/main.css');
        pageResponse(response, head, style, objects.variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js, undefined);
      })
    }
    // 카테고리별 게시물 목록 페이지
    else if (((queryData.category == 'Frontend') || (queryData.category == 'Backend') || (queryData.category == 'DevOps') || (queryData.category == 'CS')) && queryData.title === undefined) {
      db.query(`SELECT category, id, title, date, DATE_FORMAT(date, "%Y-%m-%d") AS date, trash, subcategory FROM topic ORDER BY id DESC`, (error, topics) => {
        functions.throwError(error);
        var card = showCategory(queryData.category, error, topics, card, queryData, 'posting');
        var categoryList = styleAndMenu(topics, './css/category.css');
        pageResponse(response, head, style, objects.variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js, categoryItems);
      })
    }
    // 게시물 페이지
    else if ((queryData.category == 'Frontend') || (queryData.category == 'Backend') || (queryData.category == 'DevOps') || (queryData.category == 'CS')) {
      db.query(`SELECT category, id, title, content, date, DATE_FORMAT(date, "%Y-%m-%d") AS date, trash FROM topic ORDER BY id DESC`, (error, topics) => {
        functions.throwError(error);
        var card = '';
        topics.forEach((element) => {
          if ((element.category == queryData.category) && (element.title == queryData.title))
            card = card + sanitizeHtml(template.postContainer(element.title, element.content), objects.allow);
        })
        if (signIn == 1)
          card = card + template.buttonContainer('delete', 'update', 'UPDATE', queryData.category, queryData.title, 'gray');
        var categoryList = styleAndMenu(topics, './css/post.css');
        pageResponse(response, head, style, objects.variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js, undefined);
      })
    }
  }
  // 로그인 페이지
  else if (pathname === '/signin') {
    objects.variousStyle.headerStyle = 'display: none;';
    objects.variousStyle.menuStyle = 'display: none;';
    style = style + fs.readFileSync('./css/signin.css', 'utf8');
    var card = fs.readFileSync('./html/sign-in.html', 'utf8');
    pageResponse(response, head, style, objects.variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js, undefined);
  }
  // 로그인/아웃 처리
  else if (pathname == '/signin_process') {
    // 로그인
    if (signIn == 0) {
      var password = '';
      db.query(`SELECT name, password FROM user`, (error, topics) => {
        topics.forEach((element) => {
          if (element.name == 'Daniel')
            password = element.password;
        });
        var body = ""
        request.on('data', (data) => {
          body = body + data;
        });
        request.on('end', () => {
          var post = qs.parse(body);
          var input_password = post.password;
          if (password == input_password) {
            signIn = 1;
            functions.pageRedirection(response, 302, '/');
          }
          else {
            functions.pageRedirection(response, 302, '/signin');
          }
        });
      });
    }
    else {
      signIn = 0;
      functions.pageRedirection(response, 302, '/');
    }
  }
  // 새 게시물 작성 페이지
  else if (pathname === '/post') {
    functions.access_deny(signIn);
    var action = '/post_process'
    var card = template.descriptionArea('Post') + template.writtingArea(action, '', '', '', objects.categorySelect);
    db.query(`SELECT category, trash FROM topic`, (error, topics) => {
      functions.throwError(error);
      var categoryList = styleAndMenu(topics, './css/write.css');
      pageResponse(response, head, style, objects.variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js, undefined);
    })
  }
  // 작성된 데이터를 처리하여 게시물 생성
  else if (pathname === '/post_process') {
    functions.access_deny(signIn);
    var body = "";
    request.on('data', (data) => {
      body = body + data;
    });
    request.on('end', () => {
      var post = qs.parse(body); var title = post.title;
      var content = post.content; var category = post.category;
      var subcategory = post.subcategory;
      db.query(`SELECT category, title, content, trash FROM topic`, (error, topics) => {
        functions.throwError(error);
        topics.forEach((element) => {
          if ((element.category == category) && (element.title == title) && (element.trash != '1'))
            throw error;
        });
        db.query(`INSERT INTO topic (category, title, content, date, subcategory) VALUES(?, ?, ?, NOW(), ?)`, [category, title, template.writeContainer(content), subcategory],
        (error) => {
          functions.throwError(error);
          functions.pageRedirection(response, 302, `/?category=${category}&title=${title}`);
        })
      })
    });
  }
  // 게시물 수정 페이지
  else if (pathname === '/update/') {
    functions.access_deny(signIn);
    if (queryData.category === 'Frontend')
      objects.categorySelect.frontend = 'selected';
    else if (queryData.category === 'Backend')
      objects.categorySelect.backend = 'selected';
    else if (queryData.category === 'DevOps')
      objects.categorySelect.devops = 'selected';
    else if (queryData.category === 'CS')
      objects.categorySelect.cs = 'selected';
    db.query(`SELECT category, title, content, subcategory, trash FROM topic`, (error, topics) => {
      functions.throwError(error);
      var data = ''; var sub = '';
      topics.forEach((element) => {
        if ((element.category == queryData.category) && (element.title == queryData.title) && (element.trash != '1')) {
          data = element.content;
          sub = element.subcategory;
        }
      });
      var action = `/update_process/?category=${queryData.category}&title=${queryData.title}`
      var card = template.descriptionArea('Update') + template.writtingArea(action, queryData.title, data, sub, objects.categorySelect);
      var categoryList = styleAndMenu(topics, './css/write.css');
      pageResponse(response, head, style, objects.variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js, undefined);
    })
  }
  // 브라우저로부터 게시물 수정 데이터를 수신했을 때
  else if (pathname === '/update_process/') {
    functions.access_deny(signIn);
    var body = ""
    request.on('data', (data) => {
      body = body + data;
    });
    request.on('end', () => {
      var post = qs.parse(body); var title = post.title;
      var content = post.content; var category = post.category;
      var subcategory = post.subcategory;
      db.query(`DELETE FROM topic WHERE category='${queryData.category}' AND title='${queryData.title}' AND trash='0'`,
        (error) => {
          functions.throwError(error);
          db.query(`INSERT INTO topic (category, title, content, date, subcategory) VALUES(?, ?, ?, NOW(), ?)`, [category, title, template.writeContainer(content), subcategory],
            (error) => {
              functions.throwError(error);
              functions.pageRedirection(response, 302, `/?category=${category}&title=${title}`);
            }
          )
        }
      )
    });
  }
  // 게시물 삭제 버튼을 눌렀을 때
  else if (pathname === '/delete_process/') {
    functions.access_deny(signIn);
    db.query(`UPDATE topic SET trash='1' WHERE category='${queryData.category}' AND title='${queryData.title}'`,
      (error) => {
        functions.throwError(error);
        functions.pageRedirection(response, 302, `/?category=${queryData.category}`);
      }
    )
  }
  // 휴지통에 담긴 게시물 목록
  else if (pathname === '/trash') {
    functions.access_deny(signIn);
    db.query(`SELECT category, id, title, date, DATE_FORMAT(date, "%Y-%m-%d") AS date, trash, subcategory FROM topic ORDER BY id DESC`, (error, topics) => {
      var card = showCategory('Trash', error, topics, card, queryData, 'trash');
      var categoryList = styleAndMenu(topics, './css/category.css');
      pageResponse(response, head, style, objects.variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js, categoryItems);
    })
  }
  // 휴지통에 담긴 게시물
  else if (pathname === '/trash/') {
    functions.access_deny(signIn);
    var card = '';
    db.query(`SELECT category, id, title, content, date, DATE_FORMAT(date, "%Y-%m-%d") AS date, trash FROM topic ORDER BY id DESC`, (error, topics) => {
      functions.throwError(error);
      topics.forEach((element) => {
        if ((element.category == queryData.category) && (element.title == queryData.title) && (element.trash == 1))
          card = card + sanitizeHtml(template.postContainer(element.title, element.content), objects.allow);
      })
      card = card + template.buttonContainer('clear', 'recover_process', 'RECOVER', queryData.category, queryData.title, 'green');
      var categoryList = styleAndMenu(topics, './css/post.css');
      pageResponse(response, head, style, objects.variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js, undefined);
    })
  }
  // 게시물 영구 삭제 버튼을 눌렀을 때
  else if (pathname === '/clear_process/') {
    functions.access_deny(signIn);
    db.query(`DELETE FROM topic WHERE category='${queryData.category}' AND title='${queryData.title}' AND trash='1'`, (error) => {
        functions.throwError(error);
        functions.pageRedirection(response, 302, '/trash');
      }
    )
  }
  // 게시물 복구 버튼을 눌렀을 때
  else if (pathname === '/recover_process/') {
    functions.access_deny(signIn);
    db.query(`UPDATE topic SET trash='0' WHERE category='${queryData.category}' AND title='${queryData.title}'`, (error) => {
        functions.throwError(error);
        functions.pageRedirection(response, 302, `/?category=${queryData.category}`);
      }
    )
  }
  // 검색 결과
  else if (pathname === '/search/') {
    var body = "";
    request.on('data', (data) => {
      body = body + data;
    });
    request.on('end', () => {
      var post = qs.parse(body);
      var title = post.title;
      db.query(`SELECT category, title, date, DATE_FORMAT(date, "%Y-%m-%d") AS date, trash, subcategory FROM topic WHERE title LIKE '%${title}%' ORDER BY id DESC`, (error, topics) => {
        var card = showCategory('Search Results', error, topics, card, queryData, 'search');
        var categoryList = styleAndMenu(topics, './css/category.css');
        pageResponse(response, head, style, objects.variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js, categoryItems);
      })
    })
  }
  // 404 Not Found
  else {
    response.writeHead(404);
    response.end('Not Found');
  }
});

// 3000번 포트를 통해 서버 실행
app.listen(8080);
