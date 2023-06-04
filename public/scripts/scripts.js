let darkmodeStyle = document.getElementById("darkmodeStyleSheet");
let htmlElem = document.getElementById("html");
if (getCookie("darkmode") === "true") {
    darkmodeStyle.href = "public/styles/darkmode.css";
    htmlElem.setAttribute("data-bs-theme", "dark");
} else {
    darkmodeStyle.href = "";
    htmlElem.setAttribute("data-bs-theme", "light");
}

$(function () {
    $("#formular").load("public/pages/formular.html");
});
$(function () {
    $("#adminLoginDialog").load("public/pages/admin-login.html", () => {
        if (getCookie("auth") === "true") {
            $('#signIn').hide();
            $('#signOut').show();
        } else {
            $('#signIn').show();
            $('#signOut').hide();
        }
    });
});
$(function () {
    $("#settings").load("public/pages/settings.html", () => {
        if (getCookie("auth") === "true") {
            $('#settingUpdate').show();
        } else {
            $('#settingUpdate').hide();
        }
    });
});
$("[data-bs-toggle='popover']").on('show.bs.popover', function (test) {
    $("#darkmodeSwitch").attr("checked", getCookie("darkmode") === "true" ? true : false);
});

$(function () {
    $('[data-bs-toggle="popover"]').popover({
        html: true,
        placement: "bottom",
        sanitize: false,
        content: function () {
            return $("#popover-settings").html();
        },
    })
})

//close Settings on outer click
$('html').on('mouseup', function (e) {
    if (!$(e.target).closest('.settings-popver').length && !$(e.target).closest('.settingsBtn').length) {
        $('[data-bs-toggle="popover"]').popover('hide')
    }
});

function getCookie(name) {
    function escape(s) {
        return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1');
    }
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
}

function switchDarkmode(elem) {
    document.cookie = `darkmode=${!elem.querySelector("#darkmodeSwitch").checked}; SameSite=Lax`;

    elem.querySelector("#darkmodeSwitch").checked = getCookie("darkmode") === "true" ? true : false;

    let darkmodeStyle = document.getElementById("darkmodeStyleSheet");
    let htmlElem = document.getElementById("html");
    if (getCookie("darkmode") === "true") {
        darkmodeStyle.href = "public/styles/darkmode.css";
        htmlElem.setAttribute("data-bs-theme", "dark");
    } else {
        darkmodeStyle.href = "";
        htmlElem.setAttribute("data-bs-theme", "light");
    }
}

function updateDataBase() {
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        if (this.responseText === "not authorised!") {
            console.log("not authorised!");
        } else {
            console.log("Updated");
        }
    }

    xhttp.open("GET", `/update-database`);
    xhttp.send();
}

//Beim einloggen den Passwort übergeben
function einloggen() {
    const password = $('#adminPassword').val();

    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        const success = this.responseText;
        if (success === "true") {
            $('#signIn').hide();
            $('#signOut').show();
            $('#settingUpdate').show();

            $("#adminLoginModal").modal('hide');
        }
    }

    xhttp.open("POST", "/auth", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`password=${password}`);
}

function ausloggen() {
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        $('#signIn').show();
        $('#signOut').hide();
        $('#settingUpdate').hide();

        $("#adminLoginModal").modal('hide');
    }

    xhttp.open("POST", "/auth", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`signOut=true`);
}



function test() {
    console.log(document.cookie);
    console.log($('#signIn'));
}