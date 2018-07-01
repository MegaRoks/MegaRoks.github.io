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