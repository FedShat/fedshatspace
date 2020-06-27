const section_front = $('.section-front');
const section_about = $('.section-about');
const section_projects = $('.section-projects');
const abandoned = $('.abandoned');
const abandoned_inner = $('.abandoned-inner');

function goto_about() {
    section_front.css('left', '-100vw').css('top', '-100vh');
    section_about.css('left', '0').css('top', '0');
    section_projects.css('left', '-100vw').css('top', '100vh');
}

function goto_projects() {
    section_front.css('left', '100vw').css('top', '-100vh');
    section_about.css('left', '100vw').css('top', '100vh');
    section_projects.css('left', '0').css('top', '0');
}

function goto_index() {
    section_front.css('left', '0').css('top', '0');
    section_about.css('left', '100vw').css('top', '100vh');
    section_projects.css('left', '-100vw').css('top', '100vh');
}

$('.btn-about').on('click', function () {
    goto_about();
    history.pushState({page: 1}, 'vanutp - обо мне', '/about');
})
$('.btn-projects').on('click', function () {
    goto_projects();
    history.pushState({page: 2}, 'vanutp - проекты', '/projects');
})
$('.btn-back').on('click', function () {
    goto_index();
    history.pushState({page: 0}, 'vanutp', '/');
})
$('.btn-abandoned').on('click', function () {
    abandoned.toggleClass('collapse');
})
particlesJS.load('page-bg', '/static/particles.json', function () {
});
$(document).ready(function () {
    var cnt = 0;
    $('.anim-item').each(function () {
        var it = $(this)
        setTimeout(function () {
            it.css('opacity', 1);
        }, cnt * 300);
        cnt++;
    })
    resize();
});
$(window).on('popstate', function (event) {
    if (document.location.pathname === '/') {
        goto_index();
    } else if (document.location.pathname === '/about') {
        goto_about();
    } else if (document.location.pathname === '/projects') {
        goto_projects();
    }
});

function resize() {
    abandoned.css('max-height', abandoned_inner.outerHeight(true))
}

$(window).on('resize', resize);
