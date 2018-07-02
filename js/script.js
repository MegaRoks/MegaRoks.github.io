document.addEventListener('DOMContentLoaded', function () {
	var day = 20;
	var month = 04;
	var year = 1994;
	var time = new Date();
	var age = (time.getFullYear() - year - ((time.getMonth() - --month || time.getDate() - day) < 0));
	document.getElementById("age").innerText = age;
}, false);

function unmask(range, id) {
	for (var i = range; i < range + 4; i++) {
		if (id === i) {
			document.getElementById(`block${i}`).style.display = 'block';
		} else {
			document.getElementById(`block${i}`).style.display = 'none';
		}
	}
}