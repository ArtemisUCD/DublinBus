function Print() {
    const download = e => {
      fetch(e.target.href, {
        method: "GET",
        headers: {}
      })
        .then(response => {
          response.arrayBuffer().then(function(buffer) {
            const url = window.URL.createObjectURL(new Blob([buffer]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "image.png"); //or any other extension
            document.body.appendChild(link);
            link.click();
          });
        })
        .catch(err => {
        });
    };
    return (
      <div className="App">
        <a
          href="https://www.transportforireland.ie/wp-content/uploads/2021/09/Dublin_Train-Tram_Map_ENGLISH.pdf"
          download
          onClick={e => download(e)}
        >
          <i className="fa fa-download" />
          Click here to get the PDF
        </a>
      </div>
    );
  }
  export default Print
  