module.exports = {
  // 각 Sub Category별 Image 지정
  selectImage:(element, logoImage) => {
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
  },
  // 예외 처리
  throwError:(error) => {
    if (error) {
      throw error;
    }
  },
  // 카테고리별 게시물 수를 객체에 저장
  menuCount:(topics, postingCount) => {
    postingCount.frontend = 0;
    postingCount.backend = 0;
    postingCount.devops = 0;
    postingCount.cs = 0;
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
  },
  // 미확인 사용자의 관리자 전용 페이지 접속 시도 차단
  access_deny:(signIn) => {
    if (signIn == 0) {
      response.writeHead(302, {
        Location: encodeURI('/')
      });
      response.end();
    }
  },
  // 미확인 사용자로부터 관리자 전용 기능 숨기기
  changeDisplayStatus:(signIn) => {
    if (signIn == 0) {
      var display = 'none';
    } else {
      var display = 'block';
    }
    return display;
  },
  // 리다이렉션 함수
  pageRedirection: (response, num, url) => {
    response.writeHead(num, {
      Location: encodeURI(url)
    });
    response.end();
  }
}