const section_index = $('.section-index');
const section_about = $('.section-about');
const section_projects = $('.section-projects');
const section_index_inner = $('.section-index-inner');
const section_about_inner = $('.section-about-inner');
const section_projects_inner = $('.section-projects-inner');
const abandoned = $('.abandoned');

function goto_about() {
    section_about_inner.css('display', '');
    section_index.css('left', '-100vw').css('top', '-100vh');
    section_about.css('left', '0').css('top', '0');
    section_projects.css('left', '-100vw').css('top', '100vh');
    section_about.on('transitionend', function () {
        section_projects_inner.css('display', 'none');
        section_index_inner.css('display', 'none');
        section_about.unbind('transitionend');
    });
}

function goto_projects() {
    section_projects_inner.css('display', '');
    section_index.css('left', '100vw').css('top', '-100vh');
    section_about.css('left', '100vw').css('top', '100vh');
    section_projects.css('left', '0').css('top', '0');
    section_projects.on('transitionend', function () {
        section_about_inner.css('display', 'none');
        section_index_inner.css('display', 'none');
        section_projects.unbind('transitionend');
    });
}

function goto_index() {
    section_index_inner.css('display', '');
    section_index.css('left', '0').css('top', '0');
    section_about.css('left', '100vw').css('top', '100vh');
    section_projects.css('left', '-100vw').css('top', '100vh');
    section_index.on('transitionend', function () {
        section_about_inner.css('display', 'none');
        section_projects_inner.css('display', 'none');
        section_index.unbind('transitionend');
    });
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
    if (abandoned.hasClass('collapse')) {
        abandoned.hide(400);
    } else {
        abandoned.show(400);
    }
})
particlesJS.load('page-bg', '/static/particles.json', function () {
});
$(window).on('load', function () {
    var cnt = 0;
    $('.anim-item').each(function () {
        var it = $(this)
        setTimeout(function () {
            it.css('opacity', 1);
        }, cnt * 300);
        cnt++;
    })
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
$(document).on('keyup', function (e) {
    if (e.key === 'Escape') {
        if (document.location.pathname !== '/') {
            goto_index();
            history.pushState({page: 0}, 'vanutp', '/');
        }
    }
})

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', {scope: '.'}).then(reg => {
            reg.addEventListener('updatefound', () => {
                var newWorker = reg.installing;

                newWorker.addEventListener('statechange', () => {
                    switch (newWorker.state) {
                        case 'installed':
                            if (navigator.serviceWorker.controller) {
                                newWorker.postMessage({action: 'skipWaiting'});
                            }
                            break;
                    }
                });
            });
        });
        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', function () {
            if (refreshing) return;
            window.location.reload();
            refreshing = true;
        });
    });
}