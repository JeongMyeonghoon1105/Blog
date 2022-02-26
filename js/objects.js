module.exports = {
  // 각 페이지 별로 달리 적용될 스타일들을 객체로 묶어 초기화
  variousStyle:{
    'headerStyle': '/* */',
    'menuStyle': '/* */'
  },
  // 카테고리별 게시물 수를 저장할 객체 선언
  postingCount:{
    'frontend': 0,
    'backend': 0,
    'devops': 0,
    'cs': 0
  },
  // 카테고리 선택란의 디폴트 값을 설정하는데 사용되는 객체
  categorySelect:{
    'frontend': '<!----',
    'backend': '<!----',
    'devops': '<!----',
    'cs': '<!----'
  },
  allow:{
    allowedTags: ['div', 'h1', 'h2', 'h3', 'img', 'text', 'i', 'a', 'button', 'input', 'br', 'iframe'],
    allowedClasses: {
      'div': ['card', 'post-container', 'post-contents'],
      'h1': ['post-title']
    },
    allowedAttributes: {
      'img': ['src', 'alt'],
      'iframe': ['src']
    }
  }
}