document.getElementById("myprod").focus();

function myfunc(id, pd, ps, st, pt) {
    const obj = {
        id: null,
        path: "",
        product: "",
        pris: null,
        stock: null
    };
    obj.id = id;
    obj.path = pt;
    obj.product = pd;
    obj.pris = ps;
    obj.stock = st;
    return JSON.stringify(obj);
}

function reset() {
    document.getElementById("myid").focus();
    document.getElementById("mypric").value = null;
    document.getElementById("myid").value = null;
    document.getElementById("myprod").value = null;
    document.getElementById("mystoc").value = null;
    document.getElementById("mypic").value = null;
}

function setvalue() {
    var price = document.getElementById("mypric").value;
    var id = document.getElementById("myid").value;
    var prod = document.getElementById("myprod").value;
    var stock = document.getElementById("mystoc").value;
    var path = document.getElementById("mypic").value;
    const tex = myfunc(id, prod, price, stock, path);
    return tex;
}

function postFunction() {
    document.getElementById("demo").style.color = "black";
    fetch(`http://localhost:3000/create/`, {
        method: 'post',
        headers: {
            'Content-Type': 'text/html'
        },
        body: setvalue()
    })
        .then(res => res.text())
        .then(res => document.getElementById("demo").innerHTML = res)
    reset();
}

function getFunction() {
    var id = document.getElementById("myid").value;
    if (id === null) {
        console.log("jghfjyf");
    }
    fetch(`http://localhost:3000/receive/${id}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(res => res.json())
        .then((res) => {

            if (Object.values(res) == "Product with given Id not found!") {
                document.getElementById("demo").innerHTML = Object.values(res);
                document.getElementById("demo").style.color = "red";
            } else {
                document.getElementById("demo").innerHTML = `Product: ${res.product},<br> id: ${res.id} <br> Price: ${res.pris}kr<br> Stock: ${res.stock}`;
                document.getElementById("demo").style.color = "blue";
                if (res.path) {
                    document.getElementById("img").src = res.path;

                } else {
                    document.getElementById("img").src = res.path;
                    document.getElementById("img").alt = "  This product does not have any image";
                }
            }
            // console.clear();
            document.getElementById("myid").value = null;
            document.getElementById("myid").focus()
        });
}

function putFunction() {
    var id = document.getElementById("myid").value;
    fetch(`http://localhost:3000/update/${id}`, {
        method: 'put',
        headers: {
            'Content-Type': 'text/html'
        },
        body: setvalue()
    })
        .then(res => res.text())
        .then(res => document.getElementById("demo").innerHTML = res)
    reset();
}

function delFunction() {
    let text = 'your are about delete an item! are you sure?\n Either Yes or No.';
    if (confirm(text) == true) {
        document.getElementById("demo").style.color = "red";
        var id = document.getElementById("myid").value;
        fetch(`http://localhost:3000/delete/${id}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'text/html'
            },
        })
            .then(res => res.text())
            .then(res => document.getElementById("demo").innerHTML = res)
    }
    document.getElementById("demo").innerHTML = "No data has been deleted..."
}