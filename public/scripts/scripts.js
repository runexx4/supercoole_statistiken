let globalVars = {
    darkmodeStyle: document.getElementById("darkmodeStyleSheet"),
    htmlElem: document.getElementById("html"),
    serviceData: null,
    filteredServices: []
}

if (getCookie("darkmode") === "true") {
    globalVars.darkmodeStyle.href = "public/styles/darkmode.css";
    globalVars.htmlElem.setAttribute("data-bs-theme", "dark");
} else {
    globalVars.darkmodeStyle.href = "";
    globalVars.htmlElem.setAttribute("data-bs-theme", "light");
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

        $(".applyBtn").on("click", function () {
            requestFilter();
        });

        setFormularData();

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

    if (getCookie("darkmode") === "true") {
        globalVars.darkmodeStyle.href = "public/styles/darkmode.css";
        globalVars.htmlElem.setAttribute("data-bs-theme", "dark");
    } else {
        globalVars.darkmodeStyle.href = "";
        globalVars.htmlElem.setAttribute("data-bs-theme", "light");
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

function getServiceData() {
    return new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest();

        xhttp.onload = function () {
            resolve(JSON.parse(this.responseText));
        }
        xhttp.open("GET", `/services`);
        xhttp.send();
    })
}

async function setFormularData() {
    if (!globalVars.serviceData) {
        globalVars.serviceData = await getServiceData();
        globalVars.filteredServices = globalVars.serviceData.services;
    }
    globalVars.serviceData.service.forEach(service => {
        $('#selectService').append($('<option>', {
            value: JSON.stringify(service),
            text: service.service_name
        }));
    });
    globalVars.serviceData.category.forEach(category => {
        $('#selectCategory').append($('<option>', {
            value: category.id,
            text: category.category_name
        }));
    });
    globalVars.serviceData.type.forEach(type => {
        $('#selectType').append($('<option>', {
            value: type.id,
            text: type.type_name
        }));
    });
}

function requestFilter() {

    let selectType = $("#selectType").val();
    let selectCategory = $("#selectCategory").val();
    let selectService = $("#selectService").val() !== "all" ? JSON.parse($("#selectService").val()) : $("#selectService").val();
    let selectTimeinterval = $("#selectTimeinterval").val();

    filterForm(selectType, selectCategory);

    console.log(selectType, selectCategory, selectService, selectTimeinterval);

    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        const requests = JSON.parse(this.responseText);

        let filteredRequests = [];
        globalVars.filteredServices.forEach(service => {
            let filterArray = requests.filter((request) => {
                return request.serviceCode == service.service_code;
            })

            if (filterArray.length > 0) {
                filteredRequests.push(filterArray);
            }
        });

        setCharts(filteredRequests);
    }

    xhttp.open("GET", `/requests`);
    xhttp.send();
}

function filterForm(selectTypeId, selectCategoryId) {
    if (selectTypeId === "all") {
        $("#selectCategory").prop("disabled", true);
        $("#selectService").prop("disabled", true);

        $("#selectCategory").val("all");
        $("#selectService").val("all");
    } else {
        $("#selectCategory").prop("disabled", false);
        $("#selectService").prop("disabled", false);

        if (selectTypeId === "all") {
            $('#selectService option').each(function () {
                $(this).show();
            })
            globalVars.filteredServices = globalVars.serviceData.services;
        } else {
            $('#selectCategory option:not([value=all])').hide();
            globalVars.filteredServices = [];

            $('#selectService option').each(function () {
                if ($(this).val() === "all") return;

                const serviceVal = JSON.parse($(this).val());

                if (serviceVal.type_id == selectTypeId && (selectCategoryId === "all" || serviceVal.category_id == selectCategoryId)) {
                    $(this).show();
                    globalVars.filteredServices.push(serviceVal);
                } else {
                    $(this).hide();
                }

                if (serviceVal.type_id == selectTypeId) {
                    $(`#selectCategory option[value=${serviceVal.category_id}]`).show();
                }
            });

        }
    }

}

function setCharts(filteredRequests) {

    filteredRequests.sort(function (a, b) {
        return b.length - a.length;
    });
    console.log(filteredRequests);

    let labels = [];
    let data = [];
    let sonstigeSize = 0;
    filteredRequests.forEach((filteredRequest, i) => {
        if(i < 5){
            labels.push(filteredRequest[0].serviceName);
            data.push(filteredRequest.length);
        }else{
            if(!labels.includes("Sonstige")){
                labels.push("Sonstige")
            }
            sonstigeSize += filteredRequest.length;
        }
    });
    if(sonstigeSize > 0){
        data.push(sonstigeSize);
    }

    const ctx2 = Chart.getChart("chart2");
    ctx2.data.labels = labels;
    ctx2.data.datasets.forEach((dataset) => {
        dataset.data = data;
    });
    ctx2.update();

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