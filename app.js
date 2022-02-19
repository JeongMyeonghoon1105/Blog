var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./js/template.js');
var signIn = 0;
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'audgns9809',
  database: 'StoryMate'
});

// DB 연결
db.connect();

// 서버 생성
var app = http.createServer((request, response) => {
  // URL 정보 요청 및 분석
  var requestedURL = request.url;
  var queryData = url.parse(requestedURL, true).query;
  var pathname = url.parse(requestedURL, true).pathname;
  // 미확인 사용자로부터 관리자 전용 기능 숨기기
  if (signIn == 0) {
    var display = 'none';
  } else {
    var display = 'block';
  }
  // 미확인 사용자의 관리자 전용 페이지 접속 시도 차단
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
    var tabDownHeight = 'height: 220px;';
  } else {
    var signInHeader = template.Header('signin_process', 'Out');
    var tabSignIn = template.Tab('signin_process', 'Out');
    var tabDownHeight = 'height: 280px;';
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
  // 카테고리별 게시물 수를 저장할 객체 선언
  var postingCount = {
    'frontend': 0,
    'backend': 0,
    'devops': 0,
    'cs': 0
  }
  // 카테고리별 게시물 수를 객체에 저장
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
  var categoryList = template.list(postingCount.frontend, postingCount.backend, postingCount.devops, postingCount.cs, display);
  // FOOTER
  var footer = fs.readFileSync('./html/footer.html', 'utf8');
  // JS
  var js = fs.readFileSync('./js/header.js', 'utf8');

  function selectImage(element, logoImage) {
    if (element.subcategory == '-') {
      logoImage = 'https://github.com/JeongMyeonghoon1105/Images/blob/main/Logo_post.png?raw=true';
    } else if (element.subcategory == 'React') {
      logoImage = 'https://github.com/JeongMyeonghoon1105/Images/blob/main/React_alter.png?raw=true';
    } else if (element.subcategory == 'Python') {
      logoImage = 'https://github.com/JeongMyeonghoon1105/Images/blob/main/Vue.jpg?raw=true';
    } else if (element.subcategory == 'Github') {
      logoImage = 'https://github.com/JeongMyeonghoon1105/Images/blob/main/github.png?raw=true';
    } else if (element.subcategory == 'DS') {
      logoImage = 'https://github.com/JeongMyeonghoon1105/Images/blob/main/Data_Structure.png?raw=true';
    } else if (element.subcategory == 'Algorithm') {
      logoImage = 'https://github.com/JeongMyeonghoon1105/Images/blob/main/Algorithms.png?raw=true';
    } else if (element.subcategory == 'Node.js') {
      logoImage = 'https://github.com/JeongMyeonghoon1105/Images/blob/main/NodeJS.png?raw=true';
    } else if (element.subcategory == 'MySQL') {
      logoImage = 'https://github.com/JeongMyeonghoon1105/Images/blob/main/MySQL.png?raw=true';
    } else if (element.subcategory == 'JS') {
      logoImage = 'https://github.com/JeongMyeonghoon1105/Images/blob/main/JS.jpg?raw=true';
    } else {
      logoImage = 'https://github.com/JeongMyeonghoon1105/Images/blob/main/Logo_post.png?raw=true';
    }
    return logoImage;
  }

  // pathname이 '/'일 때(메인 페이지)
  if (pathname === '/') {
    // 메인 페이지
    if (queryData.category === undefined) {
      // STYLE
      style = style + fs.readFileSync('./css/main.css', 'utf8');
      // CARD
      var card = fs.readFileSync('./html/card.html', 'utf8');
      // DB에서 데이터 불러오기
      db.query(`SELECT category, trash FROM topic`, (error, topics) => {
        // 예외 처리
        if (error) {
          throw error;
        }
        // MENU
        menuCount(topics, postingCount);
        var categoryList = template.list(postingCount, display);
        // 페이지 로드
        response.writeHead(200);
        response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js));
      })
    }
    // 카테고리별 게시물 목록
    else if (((queryData.category == 'Frontend') || (queryData.category == 'Backend') || (queryData.category == 'DevOps') || (queryData.category == 'CS')) && queryData.title === undefined) {
      // STYLE
      style = style + fs.readFileSync('./css/category.css', 'utf8');
      // DB에서 데이터 불러오기
      db.query(`SELECT category, id, title, date, DATE_FORMAT(date, "%Y-%m-%d") AS date, trash, subcategory FROM topic ORDER BY id DESC`, (error, topics) => {
        // 예외 처리
        if (error) {
          throw error;
        }
        // CARD
        var card = template.descriptionArea(queryData.category);
        card = card + '<div id="posting-item" style="display: flex; flex-wrap: wrap;">'
        // 카테고리에 게시물이 존재하는지 검사. 존재할 경우, 게시물 목록 표시
        var categoryItems = 0;
        topics.forEach((element) => {
          if ((element.category == queryData.category) && (element.trash != 1)) {
            categoryItems = categoryItems + 1;
            var logoImage = selectImage(element, logoImage);
            card = card + template.postingItem(queryData.category, element.title, element.date, logoImage);
          }
        });
        card = card + '</div>'
        // Card Height 계산 및 게시물 없을 시 안내 메시지 출력
        if (categoryItems == 0) {
          card = card + template.notice(`No Results in ${queryData.category} Category`);
        } else if (categoryItems%2 == 0) {
          variousStyle.cardStyle = `height: ${categoryItems/2*385+90}px`;
        } else {
          variousStyle.cardStyle = `height: ${(parseInt(categoryItems/2)+1)*385+90}px`;
        }
        // MENU
        menuCount(topics, postingCount);
        var categoryList = template.list(postingCount, display);
        // 페이지 로드
        response.writeHead(200);
        response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js));
      })
    }
    // 게시물 페이지
    else if ((queryData.category == 'Frontend') || (queryData.category == 'Backend') || (queryData.category == 'DevOps') || (queryData.category == 'CS')) {
      // STYLE
      style = style + fs.readFileSync('./css/post.css', 'utf8');
      // DB에서 데이터 불러오기
      db.query(`SELECT category, id, title, content, date, DATE_FORMAT(date, "%Y-%m-%d") AS date, trash FROM topic ORDER BY id DESC`, (error, topics) => {
        // 예외 처리
        if (error) {
          throw error;
        }
        // CARD
        var card = '';
        // 선택한 게시물을 DB에서 찾기
        topics.forEach((element) => {
          if ((element.category == queryData.category) && (element.title == queryData.title)) {
            // 게시물의 소스코드를 소독
            card = card + sanitizeHtml(template.postContainer(element.title, element.content), {
              allowedTags: ['div', 'h1', 'h2', 'h3', 'img', 'text', 'i', 'a', 'button', 'input', 'br', 'iframe'],
              allowedClasses: {
                'div': ['card', 'post-container', 'post-contents'],
                'h1': ['post-title']
              },
              allowedAttributes: {
                'img': ['src', 'alt'],
                'iframe': ['src']
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
        // 페이지 로드
        response.writeHead(200);
        response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js));
      })
    }
  }
  // pathname이 '/signin'일 때(로그인 페이지)
  else if (pathname === '/signin') {
    // STYLE
    variousStyle.headerStyle = 'display: none;';
    variousStyle.menuStyle = 'display: none;';
    style = style + fs.readFileSync('./css/signin.css', 'utf8');
    // CARD
    var card = fs.readFileSync('./html/sign-in.html', 'utf8');
    // 페이지 로드
    response.writeHead(200);
    response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js));
  }
  // pathname이 '/signin_process'일 때(로그인/아웃 처리)
  else if (pathname == '/signin_process') {
    // 로그인
    if (signIn == 0) {
      var password = '';
      // 비밀번호를 DB에서 읽어오기
      db.query(`SELECT name, password FROM user`, (error, topics) => {
        topics.forEach((element) => {
          if (element.name == 'Daniel') {
            password = element.password;
          }
        });
        // 폼에서 제출한 데이터를 분석하여 저장할 변수
        var body = ""
        // 포스팅할 데이터를 요청해 변수에 저장
        request.on('data', (data) => {
          // 요청한 데이터를 변수에 덧붙이기
          body = body + data;
          // 포스팅할 게시물 길이가 너무 길어질 경우 커넥션 파괴
          if (body.length > 1e6) {
            request.connection.destroy();
          }
        });
        // 입력한 비밀번호를 실제 비밀번호와 대조
        request.on('end', () => {
          // 폼에서 제출한 데이터를 분석
          var post = qs.parse(body);
          var input_password = post.password;
          // 입력한 비밀번호가 실제 비밀번호와 일치하면 로그인 처리 진행 및 메인 화면으로 리다이렉트
          if (password == input_password) {
            // 로그인 처리
            signIn = 1;
            // 메인 페이지로 리다이렉트
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
      });
    }
    // 로그아웃
    else {
      // 로그아웃 처리
      signIn = 0;
      // 메인 페이지로 리다이렉트
      response.writeHead(302, {
        Location: encodeURI('/')
      });
      response.end();
    }
  }
  // pathname이 '/post'일 때(글 작성 페이지)
  else if (pathname === '/post') {
    // 미확인 사용자의 페이지 접속 시도 차단
    access_deny();
    // STYLE
    variousStyle.bodyStyle = 'height: 1200px;';
    variousStyle.wrapStyle = 'height: 1150px;';
    variousStyle.innerStyle = 'height: 1150px;';
    variousStyle.cardStyle = 'height: 1150px;';
    style = style + fs.readFileSync('./css/write.css', 'utf8');
    // CARD
    var card = template.descriptionArea('Post');
    card = card + fs.readFileSync('./html/write.html', 'utf8');
    // DB에서 데이터 불러오기
    db.query(`SELECT category, trash FROM topic`, (error, topics) => {
      // 예외 처리
      if (error) {
        throw error;
      }
      // MENU
      menuCount(topics, postingCount);
      var categoryList = template.list(postingCount, display);
      // 페이지 로드
      response.writeHead(200);
      response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js));
    })
  }
  // pathname이 '/post_process'일 때(작성된 데이터를 처리하여 게시물 생성)
  else if (pathname === '/post_process') {
    // 미확인 사용자의 페이지 접속 시도 차단
    access_deny();
    // 폼에서 제출한 데이터를 분석하여 저장할 변수
    var body = ""
    // 포스팅할 데이터를 요청해 변수에 저장
    request.on('data', (data) => {
      // 요청한 데이터를 변수에 덧붙이기
      body = body + data;
      // 포스팅할 게시물 길이가 너무 길어질 경우 커넥션 파괴
      if (body.length > 1e6) {
        request.connection.destroy();
      }
    });
    // 포스팅 및 기타 처리
    request.on('end', () => {
      // 폼에서 제출한 데이터를 분석
      var post = qs.parse(body);
      var title = post.title;
      var content = post.content;
      var category = post.category;
      var subcategory = post.subcategory;
      // DB에서 데이터 불러오기
      db.query(`SELECT category, title, content, trash FROM topic`, (error, topics) => {
        // 예외 처리
        if (error) {
          throw error;
        }
        // 카테고리와 제목이 같은 게시물이 이미 존재하는지 검사
        topics.forEach((element) => {
          if ((element.category == category) && (element.title == title) && (element.trash != '1')) {
            throw error;
          }
        });
        // 포스팅할 데이터를 DB에 입력
        db.query(`INSERT INTO topic (category, title, content, date, subcategory) VALUES(?, ?, ?, NOW(), ?)`, [category, title, template.writeContainer(content), subcategory],
        // 작성한 게시물의 카테고리와 제목이 기존 게시물과 중복되면 강제로 에러를 발생시키기
        (error) => {
          if (error) {
            throw error;
          }
          // 포스팅 후, 방금 작성한 게시물로 리다이렉션
          response.writeHead(302, {
            Location: encodeURI(`/?category=${category}&title=${title}`)
          });
          response.end();
        })
      })
    });
  }
  // pathname이 '/update/'일 때(게시물 수정 페이지)
  else if (pathname === '/update/') {
    // 미확인 사용자의 접속 시도 차단
    access_deny();
    // STYLE
    style = style + fs.readFileSync('./css/write.css', 'utf8');
    // 카테고리 선택란의 디폴트 값을 설정하는데 사용되는 객체
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
    // DB에서 데이터 불러오기
    db.query(`SELECT category, title, content, subcategory, trash FROM topic`, (error, topics) => {
      // 예외 처리
      if (error) {
        throw error;
      }
      // 게시물의 내용을 저장할 변수
      var data = '';
      var sub = '';
      // 수정할 게시물을 DB에서 찾기
      topics.forEach((element) => {
        if ((element.category == queryData.category) && (element.title == queryData.title) && (element.trash != '1')) {
          data = element.content;
          sub = element.subcategory;
        }
      });
      // CARD
      var card = template.descriptionArea('Update') + template.writtingArea(queryData.category, queryData.title, data, sub, categorySelect);
      // MENU
      menuCount(topics, postingCount);
      var categoryList = template.list(postingCount, display);
      // 페이지 로드
      response.writeHead(200);
      response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js));
    })
  }
  // pathname이 '/update_process/'일 때(브라우저에서 게시물 수정 데이터를 송신했을 때)
  else if (pathname === '/update_process/') {
    // 미확인 사용자의 접속 시도 차단
    access_deny();
    // 폼에서 제출한 데이터를 분석하여 저장할 변수
    var body = ""
    // 포스팅할 데이터를 요청해 변수에 저장
    request.on('data', (data) => {
      // 요청한 데이터를 변수에 덧붙이기
      body = body + data;
      // 포스팅할 게시물 길이가 너무 길어질 경우 커넥션 파괴
      if (body.length > 1e6) {
        request.connection.destroy();
      }
    });
    // 포스팅 및 기타 처리
    request.on('end', () => {
      // 폼에서 제출한 데이터를 분석
      var post = qs.parse(body);
      var title = post.title;
      var content = post.content;
      var category = post.category;
      var subcategory = post.subcategory;
      // 기존 게시물(수정 전 게시물)을 삭제
      db.query(`DELETE FROM topic WHERE category='${queryData.category}' AND title='${queryData.title}' AND trash='0'`,
        (error) => {
          // 예외 처리
          if (error) {
            throw error;
          }
          // 수정할 데이터를 DB에 입력
          db.query(`INSERT INTO topic (category, title, content, date, subcategory) VALUES(?, ?, ?, NOW(), ?)`, [category, title, template.writeContainer(content), subcategory],
            (error) => {
              // 예외 처리
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
    // 미확인 사용자의 접속 시도 차단
    access_deny();
    // DB UPDATE
    db.query(`UPDATE topic SET trash='1' WHERE category='${queryData.category}' AND title='${queryData.title}'`,
      (error) => {
        // 예외 처리
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
    // 미확인 사용자의 접속 시도 차단
    access_deny();
    // STYLE
    style = style + fs.readFileSync('./css/category.css', 'utf8');
    // CARD
    var card = template.descriptionArea('Trash');
    // DB에서 데이터 불러오기
    db.query(`SELECT category, id, title, date, DATE_FORMAT(date, "%Y-%m-%d") AS date, trash, subcategory FROM topic ORDER BY id DESC`, (error, topics) => {
      // 예외 처리
      if (error) {
        throw error;
      }
      // CARD
      var card = template.descriptionArea('Trash');
      card = card + '<div id="posting-item" style="display: flex; flex-wrap: wrap;">'
      // 카테고리에 게시물이 존재하는지 검사. 존재할 경우, 게시물 목록 표시
      var categoryItems = 0;
      topics.forEach((element) => {
        if (element.trash == 1) {
          categoryItems = categoryItems + 1;
          var logoImage = selectImage(element, logoImage);
          card = card + template.trashItem(element.category, element.title, logoImage);
        }
      });
      card = card + '</div>'
      // Card Height 계산 및 게시물 없을 시 안내 메시지 출력
      if (categoryItems == 0) {
        card = card + template.notice('No Results in Trash');
      } else if (categoryItems%2 == 0) {
        variousStyle.cardStyle = `height: ${categoryItems/2*385+90}px`;
      } else {
        variousStyle.cardStyle = `height: ${(parseInt(categoryItems/2)+1)*385+90}px`;
      }
      // MENU
      menuCount(topics, postingCount);
      var categoryList = template.list(postingCount, display);
      // 페이지 로드
      response.writeHead(200);
      response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js));
    })
  }
  // 휴지통에 담긴 게시물
  else if (pathname === '/trash/') {
    // 미확인 사용자의 접속 시도 차단
    access_deny();
    // STYLE
    style = style + fs.readFileSync('./css/post.css', 'utf8');
    // CARD
    var card = '';
    // DB에서 데이터 불러오기
    db.query(`SELECT category, id, title, content, date, DATE_FORMAT(date, "%Y-%m-%d") AS date, trash FROM topic ORDER BY id DESC`, (error, topics) => {
      // 예외 처리
      if (error) {
        throw error;
      }
      // 선택한 게시물을 DB에서 찾기
      topics.forEach((element) => {
        if ((element.category == queryData.category) && (element.title == queryData.title) && (element.trash == 1)) {
          // 게시물의 소스코드를 소독
          card = card + sanitizeHtml(template.postContainer(element.title, element.content), {
            allowedTags: ['div', 'h1', 'h2', 'h3', 'img', 'text', 'i', 'a', 'button', 'input', 'br'],
            allowedClasses: {
              'div': ['card', 'post-container', 'post-contents'],
              'h1': ['post-title']
            }
          })
        }
      })
      // CARD
      card = card + template.buttonContainer('clear', 'recover_process', 'RECOVER', queryData.category, queryData.title, 'green');
      // MENU
      menuCount(topics, postingCount);
      var categoryList = template.list(postingCount, display);
      // 페이지 로드
      response.writeHead(200);
      response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js));
    })
  }
  // pathname이 '/clear_process'일 때(게시물 영구 삭제 버튼을 눌렀을 때)
  else if (pathname === '/clear_process/') {
    // 미확인 사용자의 접속 시도 차단
    access_deny();
    // 삭제할 게시물을 DB에서 찾아 영구삭제
    db.query(`DELETE FROM topic WHERE category='${queryData.category}' AND title='${queryData.title}' AND trash='1'`,
      (error) => {
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
    // 미확인 사용자의 접속 시도 차단
    access_deny();
    // DB UPDATE
    db.query(`UPDATE topic SET trash='0' WHERE category='${queryData.category}' AND title='${queryData.title}'`,
      (error) => {
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
  // pathname이 '/search/'일 때(게시물 검색)
  else if (pathname === '/search/') {
    // STYLE
    style = style + fs.readFileSync('./css/category.css', 'utf8');
    // 폼에서 제출한 데이터를 분석하여 저장할 변수
    var body = ""
    // 포스팅할 데이터를 요청해 변수에 저장
    request.on('data', (data) => {
      // 요청한 데이터를 변수에 덧붙이기
      body = body + data;
      // 포스팅할 게시물 길이가 너무 길어질 경우 커넥션 파괴
      if (body.length > 1e6) {
        request.connection.destroy();
      }
    });
    // 포스팅 및 기타 처리
    request.on('end', () => {
      // 폼에서 제출한 데이터를 분석
      var post = qs.parse(body);
      var title = post.title;
      var content = post.content;
      var category = post.category;
      // DB에서 데이터 불러오기
      db.query(`SELECT category, title, date, DATE_FORMAT(date, "%Y-%m-%d") AS date, trash, subcategory FROM topic WHERE title LIKE '%${title}%' ORDER BY id DESC`, (error, topics) => {
        // 예외 처리
        if (error) {
          throw error;
        }
        // CARD
        var card = template.descriptionArea('Search Results');
        card = card + '<div id="posting-item" style="display: flex; flex-wrap: wrap;">'
        // 카테고리에 게시물이 존재하는지 검사. 존재할 경우, 게시물 목록 표시
        var categoryItems = 0;
        topics.forEach((element) => {
          if (element.trash != 1) {
            categoryItems = categoryItems + 1;
            var logoImage = selectImage(element, logoImage);
            card = card + template.postingItem(element.category, element.title, element.date, logoImage);
            categoryEmpty = 1;
          }
        });
        card = card + '</div>'
        // Card Height 계산 및 게시물 없을 시 안내 메시지 출력
        if (categoryItems == 0) {
          card = card + template.notice('No Results');
        } else if (categoryItems%2 == 0) {
          variousStyle.cardStyle = `height: ${categoryItems/2*385+90}px`;
        } else {
          variousStyle.cardStyle = `height: ${(parseInt(categoryItems/2)+1)*385+90}px`;
        }
        // MENU
        menuCount(topics, postingCount);
        var categoryList = template.list(postingCount, display);
        // 페이지 로드
        response.writeHead(200);
        response.end(template.HTML(head, style, variousStyle, header, signInHeader, tabDownHeight, tabSignIn, categoryList, display, card, footer, js));
      })
    })
  }
  // pathname에 잘못된 값이 들어갔을 때 (404 Not Found)
  else {
    response.writeHead(404);
    response.end('Not Found');
  }
});

// 3000번 포트를 통해 서버 실행
app.listen(3000);