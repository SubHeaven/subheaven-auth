login = (() => {
    function login() {
        this.validate = () => {
            let user = document.getElementById('subheaven-login-user').value;
            let pass = document.getElementById('subheaven-login-pass').value;
            console.log(`user = ${user}`);
            console.log(`pass = ${pass}`);
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
                    console.log(response.data.token);
                }
                console.log(response);
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
});