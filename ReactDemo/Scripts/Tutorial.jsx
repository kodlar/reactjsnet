  var data = [
    { Author: "Daniel Lo Nigro", Text: "Hello ReactJS.NET World!" },
    { Author: "Pete Hunt", Text: "This is one comment" },
    { Author: "Jordan Walke", Text: "This is *another* comment" }
  ];

var Comment = React.createClass({

    render: function () {
        // satır 19'dan çıkarıldı {converter.makeHtml(this.props.children.toString())}
        var converter = new Showdown.converter();
        var rawMarkup = converter.makeHtml(this.props.children.toString());
        return (<div className="comment">
               <h2 className="commentAuthor">{this.props.author}</h2>
              <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
        </div>);
    }
});

var CommentList = React.createClass({
    render: function () {
        /* statik versiyon
        return (<div className="commentList">
                <Comment author="Yazar1">Yorum 1</Comment>
                <Comment author="Yazar2">Yorum 2</Comment>
                <Comment author="Yazar3">Yorum 3</Comment>
                </div>);
        */
        //dinamik versiyon commentnodes component oluşturulup gelen json data okunup assign ediliyor.
        var commentNodes = this.props.data.map(function (comment) {
            return (<Comment author={comment.Author }>{comment.Text}</Comment>);
        });

        return (<div className="commentList">{commentNodes}</div>);
    }
});

  var CommentForm = React.createClass({
      handleSubmit: function (e) {
          e.preventDefault();
          var author = this.refs.author.value.trim();
          var text = this.refs.text.value.trim();
          if (!text || !author) {
              return;
          }
          // TODO: send request to the server
          // child element içindeki datayı parent elemente gönderiyoruz
          this.props.onCommentSubmit({ Author: author, Text: text });
          this.refs.author.value = '';
          this.refs.text.value = '';
          return;
      },
    render: function () {
        //return (<div className="commentForm">Hello, world! I am a CommentForm.</div>);
        return (
     <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
      <input type="submit" value="Post" />      
    </form>
    );
    }
});

var CommentBox = React.createClass({

    // bu fonksiyon daha önce componentWillMount(render öncesinde bir kere çalışır) içinde kullanılmıştı ancak tek seferlik olacağı için yeni gelen commentleri göremiyoruz
    // bu yüzden reuse hale getirip istediğimiz zaman çağırabilecek hale getirmek için  mesela componentdidmount içinde bir kere çağırıldıktan
    // sonra kendi kendini belirli interval içinde update edebilir hale getirerek yeni yorumları alabilir hale geliyoruz.
    loadCommentsFromServer: function () {
        // burada istenirse jqueryde kullanılabilir ancak biz eski tarayıcılarda desteklesin diye xmlhttprequest kullanıyoruz
        var xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ data: data });
        }.bind(this);
        xhr.send();
    },
    handleCommentSubmit: function (comment) {
        // TODO: submit to the server and refresh the list
        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({ data: newComments });
        // child elementten gelen datayı sunucuyu post ediyoruz
        var data = new FormData();
        data.append('Author', comment.Author);
        data.append('Text', comment.Text);

        var xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl, true);
        xhr.onload = function () {
            this.loadCommentsFromServer();
        }.bind(this);
        xhr.send(data);
    },
    //ajax ile data çekilirken datayı beklememek için boş component döndürülür
    getInitialState: function () {
        return { data: [] };
    },
    componentDidMount: function () {
        this.loadCommentsFromServer();
        window.setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
          <div className="commentBox">
           <h1>Comments</h1>
              <CommentList data={this.state.data} />
              <CommentForm onCommentSubmit={this.handleCommentSubmit} />
          </div>
      );
    }
});
//<CommentBox data={data } />,
ReactDOM.render(
  <CommentBox url="/comments" submitUrl="/comments/new" pollInterval={2000} />,
  document.getElementById('content')
);