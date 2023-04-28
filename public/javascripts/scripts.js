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

$('html').on('mouseup', function (e) {
    if (!$(e.target).closest('.popover').length && !$(e.target).closest('.settingsBtn').length) {
        $('[data-bs-toggle="popover"]').popover('hide')
    }
});

function toggleDarkmode(){
    console.log($("#darkLight"))
    if( $("#darkLight").attr("href") === "stylesheets/lightmode.css" ){
        $("#darkLight").attr("href", "stylesheets/darkmode.css")
    }else{
        $("#darkLight").attr("href", "stylesheets/lightmode.css")
    }
}