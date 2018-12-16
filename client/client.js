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

const handleGetAllStudents = () => {
  sendAjax("GET", "/getAllStudents", null, (data) => {
    var results = Object.keys(data).map(function(key) {
      return [Number(key), data[key]];
    });
    $("#frameContent").empty();
    results.forEach((obj) => {
      result = obj[1].studentData;
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

const handleGetAllResearch = () => {
  console.log('get');
  sendAjax("GET", "/getAllResearch", null, (data) => {
    const results = data.data;
    console.log(results);
    $("#frameContent").empty();
    Object.values(results).forEach((dataObject) => {
      const result = dataObject.data;
      const dataFrame = document.createElement('div');
      dataFrame.className = "dataFrame";

      const name = document.createElement('div');
      name.className = "nameSection";

      const nameImg = document.createElement("img");
      const nameP1 = document.createElement("p");

      nameImg.src = 'userlogo.png';
      nameImg.id = 'userContentPic';
      nameP1.innerHTML += `${result.professor}`;

      $(name).append(nameImg, nameP1);

      const desc = document.createElement('div');
      desc.className = "descSection";
      const descH2 = document.createElement('h2');
      const bio = document.createElement('p');

      descH2.innerHTML = `${result.name}`;
      bio.innerHTML = `${result.description}`;

      $(desc).append(descH2, bio);

      const cat = document.createElement('div');
      cat.className = "categorySection";
      const catP = document.createElement('p');
      catP.className = "categoryLabel";
      catP.innerHTML = `${result.categoryName}`;

      $(cat).append(catP);

      $(dataFrame).append(name, desc, cat);
      console.log(result.researchId);
      if($('#userType').text() === 'Student') {
        $(dataFrame).click((e) => {
          $(".modal").css('display', 'block');
          $("#modalName").text(`${result.name}`);
          $("#modalDesc").text(`${result.description}`);
          $('.modalBtn').click((e) => {
            sendAjax('GET', '/returnSession', null, (session) => {
              const options = {
                researchId: result.researchId,
                studentId: session.userId
              }
              console.log(options);
              $.ajax({
                cache: false,
                type: "POST",
                url: 'http://ist-serenity.main.ad.rit.edu/~iste330t23/research_database/api/user/assignStudent.php',
                data: options,
                dataType: "json",
                success: (res) => {
                  console.log(res);
                  location.reload();
                },
                error: function(xhr, status, error) {
                  console.log(error);
                }
              });
            });
          });
        });
      }
      $("#frameContent").append(dataFrame);
    });
  });
};

const loadStudentProfile = () => {
  loadUser();
  sendAjax('GET', '/returnSession', null , (session) => {
    if(!session.loggedIn) {
      window.location.href = '/homepage.html';
    } else {
      sendAjax('GET', '/getStudentInfo', null, (data) => {
        console.log(data);
        
     //   document.querySelector('#available').checked = data.studentData.searching = 1? true : false;
        document.querySelector('#desc').value = data.studentData.bio;
        document.querySelector('#email').value = data.studentData.email;
    
        const interests = data.interests;
        const checks = document.querySelectorAll('input[type=checkbox]');
        
        for(let i = 0; i < interests.length; i++) {
          checks.forEach((check) => {
            if(check.value === interests[i]){
              check.checked = true;
            }
          });
        }
      });
    }
  });


  // --- UPDATE USER ---
  $('#descSubmit').click((e) => {
    console.log('begin update');
    const checks = document.querySelectorAll('input[type=checkbox]');
    const interestList = [];
    const available = document.querySelector('#available').checked ? 1 : 0;
    console.log('available', available)


    // to dodge the initial searching box
    for(let i = 1; i < checks.length; i++) {
      if(checks[i].checked) {
        interestList.push(checks[i].value);
      }
    }

    let userId;

    sendAjax("GET", '/returnSession', null, (session) => {
      userId = session.userId;
      const options = {
        studentId: userId,
        searching: available,
        interests: interestList,
        bio: $('#desc').val(),
        email: $('#email').val()
      };
      console.log(options);
      $.ajax({
        cache: false,
        type: "POST",
        url: 'http://ist-serenity.main.ad.rit.edu/~iste330t23/research_database/api/user/updateStudent.php',
        data: options,
        dataType: "json",
        success: (res) => {
          console.log(res);
        },
        error: function(xhr, status, error) {
          console.log(error);
        }
      });
    });
  });
};

const loadHomepage = () => {
  console.log('homepage');
  loadUser('home');
};

const loadResearch = () => {
  console.log('research');
  let userRole;
  sendAjax('GET', '/returnSession', null, (session) => {
    if(session.loggedIn) {
      if(session.userRole === 'student') {
        sendAjax('GET', '/getStudentInfo', null, (data) => {
          console.log(data);
          $("#frameContent").empty();
          
          makeResults(data.research);
        });
      } else if (session.userRole === 'prof') {
        sendAjax('GET', '/getProfessorInfo', null, (data) => {
          console.log(data);
          $("#frameContent").empty();
          // let profRes = [];
          // data.data.forEach((result) => {
          //   if (result.professor === session.userName) {
          //     profRes.push(result);
          //   }
          // });
          console.log(session.userId);
          makeResults(data.research, session.userId);
        });
      }
    } else {
      window.location.href = '/homepage.html';
    }
  });
};

const makeResults = (data, profId) => {
  console.log(data);
  data.forEach((research) => {
    const frame = document.createElement('div');
    frame.className = 'researchDataFrame';

    const name = document.createElement('div');
    name.className = 'researchNameSection';

    const h1 = document.createElement('h1');
    h1.textContent = research.researchName ? research.researchName: research.name;

    const info = document.createElement('div');
    info.className = 'researchInfoSection';

    const button = document.createElement('button');
    button.className = 'infoBtn';
    button.textContent = 'Info';

    $(info).append(button);

    $(name).append(h1);
    $(frame).append(name);
    $(frame).append(info);

    $('#frameContent').append(frame);
    if($('#userType').text() === 'Student') {
      console.log('user is student');
      $('.createResearchDiv').css('display', 'none');
    }

    $(button).click((e) => {
      $(".modal").css('display', 'block');
      $("#modalResearchName").text(`${research.researchName ? research.researchName: research.name}`);
      $("#modalResearchDesc").text(`${research.researchDescription ? research.researchDescription: research.description}`);
    });
  });
  $('#createSubmit').click((e) => {
    const newName = $("#createName").val();
    const newDesc = $("#createDesc").val();

    console.log(newName, newDesc);

    const options = {
      professorId: parseInt(profId),
      name: newName,
      description: newDesc,
      category: 1,
      results: ""
    };

    console.log(options);
    $.ajax({
      cache: false,
      type: "POST",
      url: 'http://ist-serenity.main.ad.rit.edu/~iste330t23/research_database/api/research/create.php',
      data: options,
      dataType: "json",
      success: (res) => {
        console.log(res);
      },
      error: function(xhr, status, error) {
        console.log(status);
        console.log(error);
      }
    });
  });
};

const loadProfResearch = () => {
  console.log('profResearch');
  sendAjax('GET', '/getAllResearch', null, (data) => {
    console.log(data);
  });
};

const loadUser = (type) => {
  console.log('loadUser');
  console.log(type);
  sendAjax('GET', '/loadUser', null, (data) => {
    console.log(data);
    let role;
    const name = data.name;

    if(data.role === 'student') {
      role = 'Student';
    } else if (data.role === 'prof') {
      role = 'Professor';
    } else {
      role = 'Guest';
    }

    $('#userName').text(name);
    $('#userType').text(role);

    if(role === 'Guest') {
      $('#researchButton').css('display', 'none');
      $('#logOut').text('Sign In');
    }

    if(role !== 'Student') {
      $('#settingsButton').css('display', 'none');
    }
    if(type === 'home') {
      console.log(role);
      if(role === 'Student' || role === 'Guest') {
        handleGetAllResearch();
      } else if (role === 'Professor') {
        handleGetAllStudents();
      } 
    }
  });
};

const login = () => {
  console.log('login');

  const user = $("input[type='text'").val();
  const pass = $("input[type='password'").val();

  const options = {
    username: user,
    password: pass
  };

  $.ajax({
    cache: false,
    type: "POST",
    url: 'http://ist-serenity.main.ad.rit.edu/~iste330t23/research_database/api/user/login.php',
    data: options,
    dataType: "json",
    success: (res) => {
      sendAjax("POST", '/login', {userId: res.id}, (message) => {
        console.log(message);
        window.location.href = '/homepage.html';
      });
      console.log(res);
    },
    error: function(xhr, status, error) {
      window.alert('Wrong username or password.');
      console.log(status);
      console.log(error);
    }
  });
  
};

const signup = () => {
  console.log('signup');
  
  const username = $("#user").val();
  const role = $("#role").val();
  const name = $("#name").val();
  const pass = $('#pass').val();
  const email = $('#email').val();

  const options = {
    username: username,
    role: role,
    email: email,
    name: name,
    password: pass
  };

  console.log(options);
  $.ajax({
    cache: false,
    type: "POST",
    url: 'http://ist-serenity.main.ad.rit.edu/~iste330t23/research_database/api/user/create.php',
    data: options,
 //   dataType: "json",
    success: (res) => {
      window.location.href = '/login.html';
      console.log(res);
    },
    error: function(xhr, status, error) {
      window.alert('Something went wrong.');
      console.log(status);
      console.log(error);
    }
  });
};

$(document).ready(() => {
  console.log('ready');

  // Event listeners
  $('#signOutBtn').click((e) => {
    sendAjax('GET', '/signout', null, null);
  });

  //$('.categoryLabel').scalem();
});