const sendAjax = (type, action, data) => {
    console.log(data);
    $.ajax({
      cache: false,
      type: type,
      url: action,
      data: data,
      dataType: "json",
      success: () => {
          console.log('Success');
      },
      error: function(xhr, status, error) {
        var messageObj = JSON.parse(xhr.responseText);
        console.log(messageObj.error);
      }
    });
  };

const handleLogin = (e) => {
    e.preventDefault();

    if($("#username").val() === '' || $("#password").val() === ''){
        alert('Please fill in all fields');
        return false;
    }

    sendAjax('POST', '/login', $("#loginForm").serialize());
};

const init = () => {
    const loginRequest = (e) => handleLogin(e);
    document.querySelector("#loginForm").addEventListener('submit', handleLogin);
};

window.onload = init;