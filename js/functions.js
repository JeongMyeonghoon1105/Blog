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
}