login = (() => {
    function login() {
        this.validate = () => {
            let user = document.getElementById('subheaven-login-user').value;
            let pass = document.getElementById('subheaven-login-pass').value;
            axios({
                method: 'POST',
                url: 'http://127.0.0.1:33327/account/signin',
                data: {
                    hello: 'oi'
                },
                auth: {
                    username: document.getElementById('subheaven-login-user').value,
                    password: document.getElementById('subheaven-login-pass').value
                }
            }).then(response => {
                if (response.statusText == 'OK' && response.data.result) {
                    window.location.replace(response.data.next);
                }
            });
        }

        this.init = () => {
            document.getElementById('subheaven-login-submit').addEventListener('click', evt => {;
                this.validate();
            });
        }

        window.addEventListener('load', async() => {
            this.init();
        });
    };

    return new login();
})();

window.addEventListener('load', async() => {
    console.log("window loaded");
    var current = null;
    document.getElementById('subheaven-login-user').addEventListener('focus', function(e) {
        if (current) current.pause();
        current = anime({
            targets: 'path',
            strokeDashoffset: {
                value: 0,
                duration: 700,
                easing: 'easeOutQuart'
            },
            strokeDasharray: {
                value: '240 1386',
                duration: 700,
                easing: 'easeOutQuart'
            }
        });
    });
    document.getElementById('subheaven-login-pass').addEventListener('focus', function(e) {
        if (current) current.pause();
        current = anime({
            targets: 'path',
            strokeDashoffset: {
                value: -336,
                duration: 700,
                easing: 'easeOutQuart'
            },
            strokeDasharray: {
                value: '240 1386',
                duration: 700,
                easing: 'easeOutQuart'
            }
        });
    });
    document.getElementById('subheaven-login-submit').addEventListener('focus', function(e) {
        if (current) current.pause();
        current = anime({
            targets: 'path',
            strokeDashoffset: {
                value: -730,
                duration: 700,
                easing: 'easeOutQuart'
            },
            strokeDasharray: {
                value: '530 1386',
                duration: 700,
                easing: 'easeOutQuart'
            }
        });
    });
});