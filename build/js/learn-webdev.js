(function() {
	'use strict';

	var sections = document.querySelectorAll('section');
	var currentHash;

	// Y coord of the top of an element relative to the top of the document
	var getOffsetTop = function(el) {
		var offset = 0;
		if (el.offsetParent) {
			do {
				offset += el.offsetTop;
			} while (el = el.offsetParent);
		}
		return offset;
	};

	// Y coord of the bottom of an element relative to the top of the document
	var getOffsetBottom = function(el) {
		return getOffsetTop(el) + el.offsetHeight;
	};

	// Creates anchor elements for each section based on the section title (<h2>)
	var insertSectionAnchors = function() {
		for (var i = 0; i < sections.length; i++) {
			var el = sections[i];
			var hash = encodeURIComponent(el.querySelector('h2').textContent.toLowerCase().replace(' ', '-'));
			var anchor = document.createElement('a');
			anchor.className = 'section-anchor';
			anchor.id = hash;
			el.insertBefore(anchor, el.firstChild);
		}
	};

	var update = function() {
		var vpTop = window.pageYOffset;
		var vpBottom = vpTop + window.innerHeight;
		var hash = '';

		for (var i = 0; i < sections.length; i++) {
			var el = sections[i];
			var h2 = el.querySelector('h2');

			// Determine hash
			if (getOffsetTop(el) <= vpTop) {
				hash = '#' + el.querySelector('.section-anchor').id;
			}

			// "Raise" sections in viewport
			// If the section's <h2> and bottom edge are in the viewport, raise it
			if (getOffsetBottom(el) - h2.offsetHeight > vpTop && getOffsetBottom(el) < vpBottom) {
				el.classList.add('section-raised');
			}
			// If the section is filling the entire viewport, raise it
			else if (getOffsetTop(el) < vpTop && getOffsetBottom(el) > vpBottom) {
				el.classList.add('section-raised');
			} else {
				el.classList.remove('section-raised');
			}

			// Clear existing <h2> modifiers
			h2.classList.remove('h2-floating');
			h2.classList.remove('h2-bottom');

			// "Float" <h2> in active section
			if (getOffsetTop(el) < vpTop && getOffsetBottom(el) - h2.offsetHeight - 2 > vpTop) {
				h2.classList.add('h2-floating');
			} else if (getOffsetTop(h2) < vpTop) {
				h2.classList.add('h2-bottom');
			}
		}

		// Update URL with active section hash
		if (currentHash == undefined) {
			currentHash = window.location.hash;
		} else if (currentHash !== hash) {
			history.replaceState(null, '', hash == '' ? './' : hash);
			currentHash = hash;
		}
	};


	// If we have at least one section, hook everything up
	if (sections.length) {
		document.addEventListener('scroll', update);
		window.addEventListener('resize', update);

		insertSectionAnchors();
		update();
	}
})();