let globalVars = {
    darkmode: false,
};

$(function () {
    $("#adminLoginDialog").load("public/pages/admin-login.html");
});
$(function () {
    $("#settings").load("public/pages/settings.html");
});
$("[data-bs-toggle='popover']").on('show.bs.popover', function (test) {
    $("#darkmodeSwitch").attr("checked", globalVars.darkmode);
});

$(function () {
    $('[data-bs-toggle="popover"]').popover({
        html: true,
        placement:"bottom",
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

function switchDarkmode(elem) {
    globalVars.darkmode = !elem.querySelector("#darkmodeSwitch").checked;

    elem.querySelector("#darkmodeSwitch").checked = globalVars.darkmode;

    let darkmodeStyle = document.getElementById("darkmodeStyleSheet");
    let htmlElem = document.getElementById("html");
    if (globalVars.darkmode) {
        darkmodeStyle.href = "public/styles/darkmode.css";
        htmlElem.setAttribute("data-bs-theme", "dark");
    } else {
        darkmodeStyle.href = "";
        htmlElem.setAttribute("data-bs-theme", "light");
    }
}