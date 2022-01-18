var searchState = 0;

document.getElementById("search").addEventListener("click", () => {
  if (searchState == 0) {
    document.getElementById("search-bar").style.width = "200px";
    document.getElementById("search-bar").style.border = "1px solid lightgray";
    searchState = 1;
  } else {
    document.getElementById("search-bar").style.width = "0px";
    document.getElementById("search-bar").style.border = "1px solid white";
    searchState = 0;
  }
})

document.getElementById("file").addEventListener("change", () => {
  document.getElementById("file-name").value = document.getElementById("file").value;
})

'use strict';

const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);
