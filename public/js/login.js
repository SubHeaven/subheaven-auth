login = (() => {
    function main() {
        this.teste = "Teste oioioi";
        this.alert = () => {
            console.log(this.teste);
        }
    }
    return new main();
})();

window.addEventListener('load', async() => {
    console.log("window loaded");
});