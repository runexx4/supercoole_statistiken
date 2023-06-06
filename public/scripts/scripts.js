let darkmodeStyle = document.getElementById("darkmodeStyleSheet");
let htmlElem = document.getElementById("html");
if (getCookie("darkmode") === "true") {
    darkmodeStyle.href = "public/styles/darkmode.css";
    htmlElem.setAttribute("data-bs-theme", "dark");
} else {
    darkmodeStyle.href = "";
    htmlElem.setAttribute("data-bs-theme", "light");
}
if (getCookie("auth") === "true") {
    $('#loginIcon').addClass("bi-person-fill-check");
    $('#loginIcon').removeClass("bi-person-fill");
} else {
    $('#loginIcon').removeClass("bi-person-fill-check");
    $('#loginIcon').addClass("bi-person-fill");
}

$(function () {
    $("#formular").load("public/pages/formular.html", () => {
        $('input[name="daterange"]').daterangepicker({
            locale: {
                format: 'DD.MM.YYYY',
                applyLabel: "Übernehmen",
                cancelLabel: "Abbrechen"
            },
            cancelClass: "btn-secondary",
        });

    });
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
$(function () {
    $("#toasts").load("public/pages/toasts.html", () => {

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
    $('.settings-popver #dbUpdateSpinner').css('visibility', 'visible');
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        if (this.responseText === "not authorised!") {
            console.log("not authorised!");
        } else {
            const toastLiveExample = document.getElementById('dbUpdated')
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
            toastBootstrap.show();
        }
        $('.settings-popver #dbUpdateSpinner').css('visibility', 'hidden');
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
            setTimeout(() => {
                $('#signIn').hide();
                $('#signOut').show();
            }, 250);

            $('#settingUpdate').show();

            $("#adminLoginModal").modal('hide');

            $('#loginIcon').addClass("bi-person-fill-check");
            $('#loginIcon').removeClass("bi-person-fill");
        } else {
            const toastLiveExample = document.getElementById('wrongPw')
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
            toastBootstrap.show();
        }
    }

    xhttp.open("POST", "/auth", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`password=${password}`);
}

function ausloggen() {
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        setTimeout(() => {
            $('#signIn').show();
            $('#signOut').hide();
        }, 250);
        $('#settingUpdate').hide();

        $("#adminLoginModal").modal('hide');

        $('#loginIcon').removeClass("bi-person-fill-check");
        $('#loginIcon').addClass("bi-person-fill");
    }

    xhttp.open("POST", "/auth", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`signOut=true`);
}



function test() {
    console.log(document.cookie);
    console.log($('#signIn'));
}

const ctx = document.getElementById('chart1');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        responsive: true,
        maintainAspectRatio: true,
    },
});

const ctx2 = document.getElementById('chart2');
new Chart(ctx2, {
    type: 'doughnut',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        responsive: true,
        maintainAspectRatio: true,
    },
});

const ctx3 = document.getElementById('chart3');
new Chart(ctx3, {
    type: 'polarArea',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        responsive: true,
        maintainAspectRatio: true,
    },
});