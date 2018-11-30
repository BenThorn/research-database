const sendAjax = (type, action, data, callback) => {
    $.ajax({
      cache: false,
      type: type,
      url: action,
      data: data,
      dataType: "json",
      success: callback,
      error: function(xhr, status, error) {
        var messageObj = JSON.parse(xhr.responseText);
        console.log(messageObj.error);
      }
    });
  };

// const handleLogin = (e) => {

//     e.preventDefault();

//     if($("#username").val() === '' || $("#password").val() === ''){
//         alert('Please fill in all fields');
//         return false;
//     }
//     sendAjax("POST", "/login", $("#getForm").serialize());
// };

const handleGet = () => {
  console.log('get');
  sendAjax("GET", "/getAllStudents", null, (data) => {
    const results = data.results;
    console.log(results);
    $("#frameContent").empty();
    results.forEach((result) => {
      const dataFrame = document.createElement('div');
      dataFrame.className = "dataFrame";

      const name = document.createElement('div');
      name.className = "nameSection";

      const nameImg = document.createElement("img");
      const nameP1 = document.createElement("p");
      const nameP2 = document.createElement("p");
      nameP2.className = 'date';

      nameImg.src = 'userlogo.png';
      nameImg.id = 'userContentPic';
      nameP1.innerHTML += `${result.name}`;
      nameP2.innerHTML += `Grad Date: ${result.gradDate}`;

      $(name).append(nameImg, nameP1, nameP2);

      const desc = document.createElement('div');
      desc.className = "descSection";
      const descH2 = document.createElement('h2');
      const bio = document.createElement('p');

      descH2.innerHTML = `Bio`;
      bio.innerHTML = `${result.bio}`;

      $(desc).append(descH2, bio);

      const cat = document.createElement('div');
      cat.className = "categorySection";
      const catP = document.createElement('p');
      catP.className = "categoryLabel";
      catP.innerHTML = `Math`;

      $(cat).append(catP);

      $(dataFrame).append(name, desc, cat);
      $("#frameContent").append(dataFrame);
    });
  });
};

$(document).ready(() => {
  console.log('ready');

  // Event listeners
  $("#researchNav").click(function() {
    handleGet();
  });
});