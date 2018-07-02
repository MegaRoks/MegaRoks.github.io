var day = 20;
var month = 04;
var year = 1994;
var time = new Date();
var age = (time.getFullYear() - year - ((time.getMonth() - --month || time.getDate() - day) < 0));
console.log(age);
var a = document.getElementById("age");
a.innerText = age;

function unmask(blog) {
	for (var i = 0; i < 4; i++) {
		if (blog === i) {
			document.getElementById(`blog${i}`).style.display = 'block';
		} else {
			document.getElementById(`blog${i}`).style.display = 'none';
		}
	}
}

function unmaskNav(blog) {
	for (var i = 4; i < 12; i++) {
		if (blog === i) {
			document.getElementById(`blog${i}`).style.display = 'block';
		} else {
			document.getElementById(`blog${i}`).style.display = 'none';
		}
	}
}