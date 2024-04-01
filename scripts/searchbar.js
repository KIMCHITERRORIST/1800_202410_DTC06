function search() {
    let input = document.getElementById('simple-search').value
    input = input.toLowerCase();
    let list = document.getElementsById('recipesContainer');

    for (i = 0; i < list.length; i++) {
        if (!list[i].innerHTML.toLowerCase().includes(input)) {
            list[i].style.display = "none";
        }
        else {
            list[i].style.display = "list-item";
        }
    }
}