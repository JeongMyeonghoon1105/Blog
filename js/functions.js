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
  }
}